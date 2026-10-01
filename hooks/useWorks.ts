"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  createWork,
  deleteWork,
  getWorkStats,
  listAdminWorks,
  reorderWorks,
  setWorkFavorite,
  setWorkPublished,
  updateWork,
} from "@/services/works";
import type { Category } from "@/types/category";
import type { CreateWorkInput, UpdateWorkInput, Work } from "@/types/work";
import { categoryKeys } from "./useCategories";
import { useAdminSession } from "./useAuth";

export const workKeys = {
  all: ["works"] as const,
  admin: ["works", "admin"] as const,
  stats: ["works", "stats"] as const,
};

type ProgressHandler = (percent: number) => void;

/** Lista completa do painel (publicados e ocultos), na ordem do site. */
export function useAdminWorks() {
  const { token } = useAdminSession();
  return useQuery({ queryKey: workKeys.admin, queryFn: () => listAdminWorks(token) });
}

export function useWorkStats() {
  const { token } = useAdminSession();
  return useQuery({ queryKey: workKeys.stats, queryFn: () => getWorkStats(token) });
}

// ---- Cache helpers ---------------------------------------------------------

function patchWork(client: QueryClient, id: number, patch: Partial<Work>): void {
  client.setQueryData<Work[]>(workKeys.admin, (works) =>
    works?.map((work) => (work.id === id ? { ...work, ...patch } : work)),
  );
}

/** Aplica a mudança na lista antes da resposta da API e guarda o estado anterior. */
async function optimistic(client: QueryClient, apply: () => void) {
  await client.cancelQueries({ queryKey: workKeys.admin });
  const previous = client.getQueryData<Work[]>(workKeys.admin);
  apply();
  return { previous };
}

function rollback(client: QueryClient, context?: { previous?: Work[] }): void {
  if (context?.previous) client.setQueryData(workKeys.admin, context.previous);
}

/** Lista e contadores mudam juntos: invalidar ["works"] atualiza os dois. */
function refreshWorks(client: QueryClient) {
  return client.invalidateQueries({ queryKey: workKeys.all });
}

// ---- Mutations -------------------------------------------------------------

export function useCreateWork() {
  const { token } = useAdminSession();
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ input, onProgress }: { input: CreateWorkInput; onProgress?: ProgressHandler }) =>
      createWork(token, input, onProgress),
    onSettled: () => refreshWorks(client),
  });
}

export function useUpdateWork() {
  const { token } = useAdminSession();
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input, onProgress }: { id: number; input: UpdateWorkInput; onProgress?: ProgressHandler }) =>
      updateWork(token, id, input, onProgress),
    onMutate: ({ id, input }) => {
      // Troca de foto não é otimista: a imagem nova só existe depois do upload.
      if (input.file) return { previous: undefined };
      return optimistic(client, () => {
        const patch: Partial<Work> = {};
        if (input.title !== undefined) patch.title = input.title;
        if (input.description !== undefined) patch.description = input.description || null;
        if (input.categoryId !== undefined) {
          const category = client
            .getQueryData<Category[]>(categoryKeys.all)
            ?.find((c) => c.id === input.categoryId);
          patch.categoryId = input.categoryId;
          if (category) patch.category = category;
        }
        patchWork(client, id, patch);
      });
    },
    onError: (_error, _variables, context) => rollback(client, context),
    onSuccess: (work) => patchWork(client, work.id, work),
    onSettled: () => refreshWorks(client),
  });
}

export function useSetFavorite() {
  const { token } = useAdminSession();
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: number; isFavorite: boolean }) =>
      setWorkFavorite(token, id, isFavorite),
    onMutate: ({ id, isFavorite }) => optimistic(client, () => patchWork(client, id, { isFavorite })),
    onError: (_error, _variables, context) => rollback(client, context),
    onSettled: () => refreshWorks(client),
  });
}

export function useSetPublished() {
  const { token } = useAdminSession();
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      setWorkPublished(token, id, isPublished),
    onMutate: ({ id, isPublished }) => optimistic(client, () => patchWork(client, id, { isPublished })),
    onError: (_error, _variables, context) => rollback(client, context),
    onSettled: () => refreshWorks(client),
  });
}

/** Recebe a lista completa já na nova ordem e envia as posições 1..N. */
export function useReorderWorks() {
  const { token } = useAdminSession();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (ordered: Work[]) =>
      reorderWorks(token, { items: ordered.map((work, index) => ({ id: work.id, position: index + 1 })) }),
    onMutate: (ordered) =>
      optimistic(client, () =>
        client.setQueryData<Work[]>(
          workKeys.admin,
          ordered.map((work, index) => ({ ...work, position: index + 1 })),
        ),
      ),
    onError: (_error, _variables, context) => rollback(client, context),
    onSuccess: (works) => client.setQueryData(workKeys.admin, works),
    onSettled: () => refreshWorks(client),
  });
}

export function useDeleteWork() {
  const { token } = useAdminSession();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteWork(token, id),
    onSuccess: (_data, id) =>
      client.setQueryData<Work[]>(workKeys.admin, (works) => works?.filter((work) => work.id !== id)),
    onSettled: () => refreshWorks(client),
  });
}
