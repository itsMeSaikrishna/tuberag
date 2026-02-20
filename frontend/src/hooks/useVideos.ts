import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteVideo, fetchVideos } from '@/lib/api';

export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}
