import { useState } from 'react';
import { Link2, Loader2 } from 'lucide-react';

interface Props {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export default function UrlInput({ onSubmit, isLoading }: Props) {
  const [url, setUrl] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setUrl('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="relative flex-1">
        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube URL..."
          className="input-dark w-full pl-11"
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading || !url.trim()} className="btn-primary flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Indexing...
          </>
        ) : (
          'Index Video'
        )}
      </button>
    </form>
  );
}
