import { BACKEND_URL } from "./utils";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  model: string;
  conversationId?: string;
}

export interface ChatStreamResponse {
  content?: string;
  done?: boolean;
  error?: string;
}

export class ChatService {
  /**
   * Send a chat message and receive streaming response
   * @param request Chat request with message, model, and optional conversationId
   * @param onChunk Callback for each streaming chunk received
   * @param onDone Callback when streaming is complete
   * @param onError Callback for errors
   * @param signal AbortSignal for cancelling the request
   */
  static async streamChat(
    request: ChatRequest,
    onChunk: (content: string) => void,
    onDone?: () => void,
    onError?: (error: string) => void,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const response = await fetch(`${BACKEND_URL}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: request.message, model: request.model }),
        signal,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}
        onError?.(errorMessage);
        return;
      }

      if (!response.body) {
        onError?.("No response body received");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            onDone?.();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (!data) continue;

              try {
                const parsed: ChatStreamResponse = JSON.parse(data);

                if (parsed.error) {
                  onError?.(parsed.error);
                  return;
                }
                if (parsed.done) {
                  onDone?.();
                  return;
                }
                if (parsed.content) {
                  onChunk(parsed.content);
                }
              } catch (e) {
                console.warn("Failed to parse SSE data:", data, e);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (signal?.aborted) return;
      onError?.(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Simple function to fetch AI response (non-streaming)
   */
  static async sendMessage(request: ChatRequest): Promise<string | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: request.message, model: request.model }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("AI Error:", err.message || res.statusText);
        return null;
      }

      const data = await res.json();
      return data.response || null;
    } catch (error) {
      console.error("AI request failed:", error);
      return null;
    }
  }
}

