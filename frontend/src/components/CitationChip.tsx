import { Clock } from 'lucide-react';
import type { Citation } from '@/types';

interface Props {
  citation: Citation;
}

export default function CitationChip({ citation }: Props) {
  return (
    <a
      href={citation.youtube_url_with_timestamp}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                 bg-accent/15 text-accent text-xs font-medium
                 hover:bg-accent/25 transition-colors duration-200 whitespace-nowrap"
    >
      <Clock className="w-3 h-3" />
      {citation.start_time_formatted}
    </a>
  );
}
