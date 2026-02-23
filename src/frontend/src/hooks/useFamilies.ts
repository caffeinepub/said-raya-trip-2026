import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FamilyRaya } from '../backend';

export function useFamilies() {
  const { actor, isFetching } = useActor();

  return useQuery<FamilyRaya[]>({
    queryKey: ['families'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFamilies();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
}
