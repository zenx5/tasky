import axios from "axios";
import { API_URL } from "@/lib/constant";
import { v4 as uuidv4 } from "uuid"; // Necesitarás instalar: npm install uuid @types/uuid
import { db } from "@/lib/db";

export const taskService = {
  endpoint: "/v1/Tasks", // Asegúrate de que coincida con tu controller

  // --- OPERACIONES LOCALES (Lo que React va a usar) ---

  createLocal: async (description: string, order: number = 0) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      externalId: uuidv4(), // Generamos el Guid en el front
      description,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      order,
      isPendingSync: true, // Marcamos para sincronizar después
    };
    await db.tasks.add(newTask);
    taskService.triggerBackgroundSync();
  },

  updateLocal: async (externalId: string, updates: Partial<Task>) => {
    await db.tasks.update(externalId, {
      ...updates,
      updatedAt: new Date().toISOString(),
      isPendingSync: true,
    });
    taskService.triggerBackgroundSync();
  },

  deleteLocal: async (externalId: string) => {
    // Nota: Para sincronizar borrados offline, se suele usar "Soft Delete"
    // (marcar un deletedAt) en lugar de borrarlo físicamente de Dexie de inmediato.
    // Para mantenerlo simple según tu backend actual:
    await db.tasks.delete(externalId);
    // Idealmente, llamarías al DELETE del backend aquí si hay internet
  },

  // --- LÓGICA DE SINCRONIZACIÓN ---

  triggerBackgroundSync: () => {
    // Evita bloquear la UI, ejecuta la sincronización de forma asíncrona
    setTimeout(() => {
      taskService.syncWithServer().catch(console.error);
    }, 1000);
  },

  syncWithServer: async () => {
    console.log('online')
    if (!navigator.onLine) return; // Si no hay internet, cancelamos

    try {
      // 1. Enviar cambios locales al servidor (POST /sync)
      const pendingTasks = await db.tasks.where("isPendingSync").equals(1).toArray(); // Dexie guarda booleanos como 1/0 a veces, o true/false

      if (pendingTasks.length > 0) {
        // Limpiamos el flag para enviarlo limpio al servidor
        const tasksToSend = pendingTasks.map(({ isPendingSync, id, ...rest }) => rest);
        await axios.post(API_URL + taskService.endpoint + "/sync", tasksToSend);

        // Marcamos como sincronizadas localmente
        await db.tasks.bulkUpdate(
          pendingTasks.map((t) => ({ key: t.externalId, changes: { isPendingSync: false } }))
        );
      }

      // 2. Descargar la versión más reciente del servidor (GET /Tasks)
      const { data: serverTasks } = await axios.get<Task[]>(API_URL + taskService.endpoint);
      // 3. Actualizar la base local con lo del servidor (Upsert)
      // Como tu backend manda la verdad absoluta (y resolvió conflictos con UpdatedAt)
      for (const st of serverTasks) {
        st.isPendingSync = false;
        // Buscamos si ya tenemos esta tarea por su UUID único
        const existingTask = await db.tasks.get({ externalId: st.externalId });

        if (existingTask) {
          // Si existe, actualizamos usando su ID local de Dexie para que no se duplique
          await db.tasks.update(existingTask.id, st);
        } else {
          // Si no existe, es una tarea nueva que viene del servidor
          await db.tasks.add(st);
        }
      }

    } catch (error) {
      console.error("Error en sincronización:", error);
    }
  }
};