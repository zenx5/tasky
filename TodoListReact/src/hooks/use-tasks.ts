import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { taskService } from "@/services/taskServices";
import { toast } from "sonner";
import { db } from "@/lib/db";
export const useTasks = () => {
  //const [tasks, setTasks] = useState<Task[]>([])
  // 1. useLiveQuery "escucha" a Dexie. Retorna 'undefined' mientras carga inicialmente.
  useEffect(() => {
    taskService.syncWithServer().catch((err) => {
      console.error("Error en el sync inicial:", err);
      // Opcional: mostrar un toast si falla la conexión
      toast.error("Modo offline: No se pudo conectar con el servidor"); 
    });
  }, []);

  const rawTasks = useLiveQuery(() =>{
      console.log('dispatch tasks')
      return db.tasks.orderBy('order').reverse().toArray()
  });

  const loading = rawTasks === undefined;

  // 2. EL TRUCO PARA NO TOCAR LA UI:
  // dnd-kit y tu UI esperan que la propiedad única sea un string llamado 'id'.
  // Mapeamos 'externalId' a 'id' sobre la marcha para engañar a la UI.
  const tasks = rawTasks ? rawTasks.map(t => ({ ...t, id: t.externalId })) : [];

  const addTask = async (input: string) => {
    const desc = input.trim();
    if (!desc) return;
    try {
      // Calculamos el orden más alto para ponerla al principio (o final)
      const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) : 0;
      // Solo guardamos localmente. useLiveQuery actualizará la UI automáticamente.
      await taskService.createLocal(desc, maxOrder + 1);
    } catch {
      toast.error("Failed to add task");
    }
  };

  const toggleTask = async (task: any) => {
    try {
      // Recuerda: para Dexie, la llave primaria es externalId (que la UI nos devuelve como 'id' por el mapeo)
      await taskService.updateLocal(task.id, {
        completedAt: task.completedAt ? null : new Date().toISOString(),
      });
    } catch {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteLocal(id);
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const reorderTasks = async (arrayMove: any, active: any, over: any) => {
    if (!rawTasks) return;

    // Usamos el array Move de dnd-kit para obtener el nuevo array visual
    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    const newOrder = arrayMove(tasks, oldIndex, newIndex);

    try {
      // Preparamos los cambios para guardarlos en Dexie
      // Asignamos un nuevo número de 'order' basado en la posición del array
      const updates = newOrder.map((task: any, index: number) => ({
        key: task.id, // externalId
        changes: {
            order: newOrder.length - index,
            isPendingSync: true,
            updatedAt: new Date().toISOString()
        }
      }));

      // Actualizamos todos los registros afectados en bloque
      await db.tasks.bulkUpdate(updates);

      // Disparamos la sincronización en segundo plano
      taskService.triggerBackgroundSync();
    } catch (error) {
      toast.error("Failed to reorder tasks");
    }
  };

  return { tasks, loading, addTask, reorderTasks, toggleTask, deleteTask };
};