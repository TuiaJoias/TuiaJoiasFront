"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useReorderWorks } from "@/hooks/useWorks";
import { friendlyMessage } from "@/lib/errors";
import type { UploadLimits } from "@/lib/upload-config";
import type { Category } from "@/types/category";
import type { Work } from "@/types/work";
import { useFeedback } from "./FeedbackProvider";
import { WorkCard } from "./WorkCard";

interface WorkGridProps {
  /** Todos os trabalhos, na ordem do site. */
  works: Work[];
  /** Os que aparecem com o filtro atual. */
  visible: Work[];
  categories: Category[];
  limits: UploadLimits | undefined;
}

const announcements = {
  onDragStart: () => "Foto selecionada. Use as setas para mover e espaço para soltar.",
  onDragOver: () => "Movendo a foto.",
  onDragEnd: () => "Foto solta. A nova ordem foi salva.",
  onDragCancel: () => "Movimento cancelado.",
};

/**
 * Grade ordenável. Mesmo com um filtro ativo, a foto é movida dentro da lista
 * completa e a API recebe todas as posições (1..N), como ela exige.
 */
export function WorkGrid({ works, visible, categories, limits }: WorkGridProps) {
  const reorder = useReorderWorks();
  const { notify } = useFeedback();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // No celular, segurar um instante para arrastar; deslizar continua rolando a página.
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = works.findIndex((work) => work.id === active.id);
    const to = works.findIndex((work) => work.id === over.id);
    if (from < 0 || to < 0) return;
    reorder.mutate(arrayMove(works, from, to), {
      onError: (error) => notify(`A nova ordem não foi salva. ${friendlyMessage(error)}`),
    });
  }

  const positions = new Map(works.map((work, index) => [work.id, index + 1]));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{ announcements }}
    >
      <SortableContext items={visible.map((work) => work.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-5">
          {visible.map((work, index) => (
            <WorkCard
              key={work.id}
              eager={index < 4}
              work={work}
              position={positions.get(work.id) ?? work.position}
              categories={categories}
              limits={limits}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
