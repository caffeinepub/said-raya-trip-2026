import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useFoodBreakdown() {
  const { actor, isFetching } = useActor();

  return useQuery<[string, bigint][]>({
    queryKey: ['foodBreakdown'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFoodBreakdown();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });
}
