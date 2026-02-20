export interface IngestRequest {
  url: string;
}

export interface IngestResponse {
  status: string;
  video_id: string;
  video_title: string;
  chunks_added: number;
  message: string;
}

export interface Citation {
  video_id: string;
  video_title: string;
  start_time: number;
  start_time_formatted: string;
  video_url: string;
  youtube_url_with_timestamp: string;
}

export interface VideoInfo {
  video_id: string;
  video_title: string;
  video_url: string;
  chunk_count: number;
}

export interface SSEChunkEvent {
  type: 'chunk';
  content: string;
}

export interface SSECitationsEvent {
  type: 'citations';
  citations: Citation[];
}

export interface SSEDoneEvent {
  type: 'done';
}

export type SSEEvent = SSEChunkEvent | SSECitationsEvent | SSEDoneEvent;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
}
