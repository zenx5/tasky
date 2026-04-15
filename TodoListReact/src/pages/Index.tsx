import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskItem, { type Task } from "@/components/TaskItem";
import { useIsMobile } from "@/hooks/use-mobile";
// 1. Nuevas importaciones para el Drag and Drop
import {
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove
} from "@dnd-kit/sortable";
import { PENDING, COMPLETED } from "@/lib/constant";
import TaskHeader from "@/components/TaskHeader";
import TaskInput from "@/components/TaskInput";
import TaskContent from "@/components/TaskContent";
import { useTasks } from "@/hooks/use-tasks";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation()
  const [tabValue, setTabValue] = useState(PENDING);
  const { tasks, loading, addTask, reorderTasks, toggleTask, deleteTask } = useTasks();
  const isMobile = useIsMobile();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTasks(arrayMove, active, over);
    }
  };

  const pending = useMemo(() => tasks.filter((t) => !t.completedAt), [tasks]);
  const completed = useMemo(() => tasks.filter((t) => t.completedAt), [tasks]);
  console.log( pending.length, completed.length)

  const typeTask = [
    {
      id: PENDING,
      name: "pending",
      items: pending,
      includeCount: true
    },
    {
      id: COMPLETED,
      name: "completed",
      items: completed,
      includeCount: false
    },
  ]


  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-12">
        {/* Header */}
        <TaskHeader />

        {/* Input */}
        { !isMobile && <TaskInput onAddTask={addTask} />}

        {/* Tabs */}
        <Tabs defaultValue={PENDING} value={tabValue}
          onValueChange={(value) => setTabValue(value)}
          className="w-full">
          <TabsList className="w-full">
            {typeTask.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="flex-1">
                {t('tabs.'+type.name)}{ type.includeCount && ` (${type.items.length})` }
              </TabsTrigger>
            ))}
          </TabsList>

          {typeTask.map((type) => (
            <TabsContent value={type.id} className="space-y-2 mt-4">
              <TaskContent items={type.items} onDragEnd={handleDragEnd} loading={loading} >
                {type.items.map((task: Task) => (
                  <TaskItem key={task.externalId} task={task} onToggle={toggleTask} onDelete={deleteTask}/>
                ))}
              </TaskContent>
            </TabsContent>
          ))}

        </Tabs>
        { isMobile && <div className="absolute bottom-0 left-0 px-4 w-full m-0">
            <TaskInput onAddTask={addTask} />
          </div>
        }
      </div>
    </div>
  );
};

export default Index;
