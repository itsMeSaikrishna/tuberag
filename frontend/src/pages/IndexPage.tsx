import { Youtube } from 'lucide-react';
import UrlInput from '@/components/UrlInput';
import VideoCard from '@/components/VideoCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useIngest } from '@/hooks/useIngest';
import { useVideos, useDeleteVideo } from '@/hooks/useVideos';

export default function IndexPage() {
  const { data: videos, isLoading: videosLoading } = useVideos();
  const ingest = useIngest();
  const deleteMutation = useDeleteVideo();

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-100">Index Videos</h1>
        <p className="text-sm text-gray-400">
          Paste a YouTube URL to fetch its transcript and index it for AI-powered Q&A.
        </p>
      </div>

      {/* URL Input */}
      <div className="glass-card p-6">
        <UrlInput
          onSubmit={(url) => ingest.mutate(url)}
          isLoading={ingest.isPending}
        />

        {ingest.isError && (
          <p className="mt-3 text-sm text-red-400">
            {(ingest.error as Error).message || 'Failed to index video.'}
          </p>
        )}

        {ingest.isSuccess && (
          <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-400">{ingest.data.message}</p>
          </div>
        )}
      </div>

      {/* Video Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-200">Indexed Videos</h2>

        {videosLoading ? (
          <LoadingSpinner label="Loading videos..." className="py-12" />
        ) : !videos?.length ? (
          <div className="glass-card p-12 flex flex-col items-center gap-3">
            <Youtube className="w-12 h-12 text-gray-600" />
            <p className="text-sm text-gray-500">
              No videos indexed yet. Paste a YouTube URL above to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard
                key={video.video_id}
                video={video}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
