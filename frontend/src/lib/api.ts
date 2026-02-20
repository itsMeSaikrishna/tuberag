import axios from 'axios';
import type { IngestResponse, VideoInfo } from '@/types';

const client = axios.create({
  baseURL: '/api',
});

export async function ingestVideo(url: string): Promise<IngestResponse> {
  const { data } = await client.post<IngestResponse>('/ingest', { url });
  return data;
}

export async function fetchVideos(): Promise<VideoInfo[]> {
  const { data } = await client.get<VideoInfo[]>('/videos');
  return data;
}

export async function deleteVideo(videoId: string): Promise<void> {
  await client.delete(`/videos/${videoId}`);
}

export function buildQueryURL(query: string, videoIds?: string[]): string {
  const params = new URLSearchParams({ q: query });
  if (videoIds?.length) {
    params.set('video_ids', videoIds.join(','));
  }
  return `/api/query?${params.toString()}`;
}
