import api from "./api";
import type {
  Message,
  Conversation,
  ChatApiResponse,
} from "../types/chat.types";

/**
 * Chat API Service
 * Mesaj gönderme ve konuşma yönetimi için API çağrıları
 */
const chatService = {
  /**
   * Mesaj gönder
   */
  async sendMessage(
    conversationId: string,
    content: string,
    token: string,
    type: "text" | "image" | "location" | "system" = "text",
  ): Promise<Message> {
    const response = await api.post<ChatApiResponse<Message>>(
      "/chat/send",
      {
        conversationId,
        content,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  },

  /**
   * Kullanıcının konuşmalarını getir
   */
  async getConversations(token: string): Promise<Conversation[]> {
    const response = await api.get<ChatApiResponse<Conversation[]>>(
      "/chat/conversations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  },

  /**
   * Konuşmanın mesajlarını getir
   */
  async getMessages(
    conversationId: string,
    token: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Message[]> {
    const response = await api.get<ChatApiResponse<Message[]>>(
      `/chat/messages/${conversationId}`,
      {
        params: { limit, offset },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  },

  /**
   * Konuşmayı okundu olarak işaretle
   */
  async markAsRead(conversationId: string, token: string): Promise<void> {
    await api.patch(
      `/chat/read/${conversationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  /**
   * Yeni direkt konuşma oluştur
   */
  async createDirectConversation(
    targetUserId: string,
    token: string,
  ): Promise<Conversation> {
    const response = await api.post<ChatApiResponse<Conversation>>(
      "/chat/conversations/direct",
      { targetUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  },
};

export default chatService;
