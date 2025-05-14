import { apiRequestPost } from 'mastodon/api';

interface AiChatRequest {
  message: string;
}

interface AiChatResponse {
  content: string;
}

export const apiSendChatMessage = (data: AiChatRequest) =>
  apiRequestPost<AiChatResponse>('v1/ai/chat', data);