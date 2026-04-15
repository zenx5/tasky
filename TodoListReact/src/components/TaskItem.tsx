import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
// 1. Importar hooks y utilidades de dnd-kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";

export interface Task {
  id: string;
  description: string;
  createdAt: string;
  completedAt: string | null;
  externalId?: string
}

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(() => {
    const createdTime = new Date(task.createdAt).getTime();
    const now = new Date().getTime();
    return (now - createdTime) < 2000;
  });
  const isCompleted = !!task.completedAt;

  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // 3. Crear el estilo de transformación
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 500);
  };

  const handleToggle = () => {
    setIsChanging(true);
    setTimeout(() => {
      onToggle(task);
      setIsChanging(false);
    }, 500);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-all duration-300 ease-in-out
        ${isHighlighted ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)] scale-[1.01]" : "border-border shadow-none scale-100"}
        ${isDragging ? "z-50 shadow-md ring-1 ring-ring opacity-80" : ""}
        ${isDeleting
          ? "opacity-0 translate-x-8 pointer-events-none"
          : "opacity-100 translate-x-0 hover:bg-accent/50"
        }
        ${ isChanging ? "h-0 py-0 overflow-hidden transition-height duration-1000 ease-in-out text-opacity-0" : "h-100"}
      `}
    >
      {!isChanging &&
      <>
      <Button
        variant="ghost"
        size="icon"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing h-8 w-8 text-muted-foreground hover:bg-transparent"
      >
        <ChevronsUpDown className="h-4 w-4 opacity-50"/>
      </Button>
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleToggle}
        className="border-muted-foreground/40"
      />
      <div className="flex-1 min-w-0">
        <p className={`sm:text-sm text-xs leading-snug transition-colors ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.description}
        </p>
        <p className="sm:text-xs text-[0.6rem] text-muted-foreground mt-0.5">
          {isCompleted && task.completedAt
            ? `${t('tasks.completed')} ${format(new Date(task.completedAt), "MMM d, h:mm a")}`
            : `${t('tasks.created')} ${format(new Date(task.createdAt), "MMM d, h:mm a")}`}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
        disabled={isDeleting} // Evitamos doble click mientras se anima
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      </>}
    </div>
  );
};

export default TaskItem;