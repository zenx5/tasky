interface Task {
  id?: number; // El ID de BD relacional (opcional hasta que el server lo asigne)
  externalId: string; // Tu Guid (Clave principal en el frontend)
  description: string;
  createdAt: string; // ISO string
  completedAt: string | null;
  updatedAt: string; // ISO string
  order: number;
  externalId: string;
  // Campo exclusivo del frontend para saber si requiere sincronización
  isPendingSync?: boolean;
}