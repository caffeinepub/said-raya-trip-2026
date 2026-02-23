import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SummaryStats } from '../backend';

export function useSummaryStats() {
  const { actor, isFetching } = useActor();

  return useQuery<SummaryStats>({
    queryKey: ['summaryStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSummaryStats();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });
}
