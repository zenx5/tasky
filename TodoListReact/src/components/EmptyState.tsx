import { ClipboardList } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
    <ClipboardList className="h-10 w-10 mb-3 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);

export default EmptyState;
