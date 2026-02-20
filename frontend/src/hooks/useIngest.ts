import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ingestVideo } from '@/lib/api';

export function useIngest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => ingestVideo(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}
