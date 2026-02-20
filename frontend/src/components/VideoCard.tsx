import { Trash2, Hash } from 'lucide-react';
import type { VideoInfo } from '@/types';

interface Props {
  video: VideoInfo;
  onDelete: (videoId: string) => void;
  isDeleting?: boolean;
}

export default function VideoCard({ video, onDelete, isDeleting }: Props) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`;

  return (
    <div className="glass-card overflow-hidden fade-in group">
      <a
        href={video.video_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={thumbnailUrl}
          alt={video.video_title}
          className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </a>

      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-100 line-clamp-2 leading-snug">
          {video.video_title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Hash className="w-3 h-3" />
            {video.chunk_count} chunks
          </span>

          <button
            onClick={() => onDelete(video.video_id)}
            disabled={isDeleting}
            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10
                       transition-all duration-200 disabled:opacity-40"
            title="Remove video"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
