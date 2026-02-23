import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FamilyRaya } from '../backend';

export function useAddFamily() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (family: FamilyRaya) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFamily(family);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['summaryStats'] });
      queryClient.invalidateQueries({ queryKey: ['foodBreakdown'] });
    },
  });
}

export function useUpdateFamily() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, family }: { id: string; family: FamilyRaya }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFamily(id, family);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['summaryStats'] });
      queryClient.invalidateQueries({ queryKey: ['foodBreakdown'] });
    },
  });
}

export function useDeleteFamily() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFamily(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['summaryStats'] });
      queryClient.invalidateQueries({ queryKey: ['foodBreakdown'] });
    },
  });
}

export function useResetFamilies() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.resetFamilies();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['summaryStats'] });
      queryClient.invalidateQueries({ queryKey: ['foodBreakdown'] });
    },
  });
}
