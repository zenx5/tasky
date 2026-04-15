import EmptyState from "@/components/EmptyState";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function TaskContent({ items, loading, onDragEnd, children }){
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Evita que un click normal inicie un arrastre por accidente
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            onDragEnd({ active, over });
        }
    };


    if( loading ) return <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
    if( items.length === 0 ) return <EmptyState message="No completed tasks yet." />;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(t => t.id)}
                strategy={verticalListSortingStrategy}
            >
                {children}
            </SortableContext>
        </DndContext>
    )
}