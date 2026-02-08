import { create } from "zustand";
import { supabase } from "../lib/supabase";
import chatService from "../services/chat.service";
import { useAuthStore } from "./authStore";
import type { ChatState, Conversation, Message } from "../types/chat.types";
import { RealtimeChannel } from "@supabase/supabase-js";

interface ChatStore extends ChatState {
  // Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    content: string,
    type?: "text" | "image" | "location" | "system",
  ) => Promise<void>;
  addMessage: (message: Message) => void;
  setActiveConversation: (conversationId: string | null) => void;
  markAsRead: (conversationId: string) => Promise<void>;
  createDirectConversation: (targetUserId: string) => Promise<Conversation>;
  subscribeToMessages: (conversationId: string) => RealtimeChannel;
  unsubscribeFromMessages: (channel: RealtimeChannel) => void;
  subscribeToConversations: () => RealtimeChannel;
  unsubscribeFromConversations: (channel: RealtimeChannel) => void;
  updateConversationLastMessage: (
    conversationId: string,
    content: string,
    senderId: string,
  ) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  activeConversationId: null,
  isLoading: false,
  error: null,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  // Konuşmaları getir
  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Token bulunamadı");
      const conversations = await chatService.getConversations(token);
      set({ conversations, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Konuşmalar yüklenemedi",
        isLoading: false,
      });
    }
  },

  // Mesajları getir
  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Token bulunamadı");
      const messages = await chatService.getMessages(conversationId, token);
      set({ messages, activeConversationId: conversationId, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Mesajlar yüklenemedi",
        isLoading: false,
      });
    }
  },

  // Mesaj gönder
  sendMessage: async (
    conversationId: string,
    content: string,
    type = "text",
  ) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Token bulunamadı");
      const message = await chatService.sendMessage(
        conversationId,
        content,
        token,
        type,
      );
      // Mesajı listeye ekle (optimistic update - realtime'dan da gelecek)
      const { messages } = get();
      // Duplikasyonu önlemek için kontrol et
      if (!messages.find((m) => m.id === message.id)) {
        set({ messages: [message, ...messages] });
      }
      // Konuşma son mesajını güncelle
      get().updateConversationLastMessage(
        conversationId,
        content,
        message.sender_id,
      );
    } catch (error: any) {
      set({ error: error.message || "Mesaj gönderilemedi" });
      throw error;
    }
  },

  // Realtime'dan gelen mesajı ekle
  addMessage: (message: Message) => {
    const { messages, activeConversationId } = get();
    // Sadece aktif konuşmanın mesajlarını ekle ve duplikasyonu önle
    if (message.conversation_id === activeConversationId) {
      if (!messages.find((m) => m.id === message.id)) {
        set({ messages: [message, ...messages] });
      }
    }
    // Konuşma listesini güncelle
    get().updateConversationLastMessage(
      message.conversation_id,
      message.content || `[${message.message_type}]`,
      message.sender_id,
    );
  },

  // Aktif konuşmayı ayarla
  setActiveConversation: (conversationId: string | null) => {
    set({ activeConversationId: conversationId, messages: [] });
  },

  // Okundu olarak işaretle
  markAsRead: async (conversationId: string) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Token bulunamadı");
      await chatService.markAsRead(conversationId, token);
      // Konuşma participant'ının last_read_at'ini güncelle (UI için)
      const { conversations } = get();
      set({
        conversations: conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                conversation_participants: conv.conversation_participants.map(
                  (p) => ({
                    ...p,
                    last_read_at: new Date().toISOString(),
                  }),
                ),
              }
            : conv,
        ),
      });
    } catch (error: any) {
      console.error("Okundu işaretlenemedi:", error.message);
    }
  },

  // Yeni direkt konuşma oluştur
  createDirectConversation: async (targetUserId: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Token bulunamadı");
      const conversation = await chatService.createDirectConversation(
        targetUserId,
        token,
      );
      const { conversations } = get();
      // Zaten listede yoksa ekle
      if (!conversations.find((c) => c.id === conversation.id)) {
        set({ conversations: [conversation, ...conversations] });
      }
      set({ isLoading: false });
      return conversation;
    } catch (error: any) {
      set({
        error: error.message || "Konuşma oluşturulamadı",
        isLoading: false,
      });
      throw error;
    }
  },

  // Mesajlara realtime subscribe ol
  subscribeToMessages: (conversationId: string) => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          get().addMessage(newMessage);
        },
      )
      .subscribe();

    return channel;
  },

  // Mesaj subscription'dan çık
  unsubscribeFromMessages: (channel: RealtimeChannel) => {
    supabase.removeChannel(channel);
  },

  // Konuşmalara realtime subscribe ol
  subscribeToConversations: () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.warn("User ID not found for conversation subscription");
      return supabase.channel("conversations_placeholder");
    }

    const channel = supabase
      .channel("conversations_list")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: "conversations",
        },
        async (payload) => {
          const { conversations } = get();
          const updatedConv = payload.new as Conversation;

          if (payload.eventType === "INSERT") {
            // Yeni konuşma eklendi - kullanıcı katılımcı mı kontrol et
            // Eğer conversations listesinde yoksa ve kullanıcı katılımcıysa ekle
            const token = useAuthStore.getState().token;
            if (token) {
              // Konuşmaları yeniden fetch et (participant kontrolü backend'de yapılıyor)
              await chatService
                .getConversations(token)
                .then((convs) => {
                  set({ conversations: convs });
                })
                .catch(console.error);
            }
          } else if (payload.eventType === "UPDATE") {
            // Var olan konuşma güncellendi (genellikle son mesaj)
            set({
              conversations: conversations
                .map((c) =>
                  c.id === updatedConv.id ? { ...c, ...updatedConv } : c,
                )
                .sort((a, b) => {
                  // En yeni mesaja göre sırala
                  const aTime = a.last_message_at
                    ? new Date(a.last_message_at).getTime()
                    : 0;
                  const bTime = b.last_message_at
                    ? new Date(b.last_message_at).getTime()
                    : 0;
                  return bTime - aTime;
                }),
            });
          }
        },
      )
      .subscribe();

    return channel;
  },

  // Konuşma subscription'dan çık
  unsubscribeFromConversations: (channel: RealtimeChannel) => {
    supabase.removeChannel(channel);
  },

  // Konuşma son mesaj bilgisini güncelle
  updateConversationLastMessage: (
    conversationId: string,
    content: string,
    senderId: string,
  ) => {
    const { conversations } = get();
    set({
      conversations: conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              last_message_content: content,
              last_message_at: new Date().toISOString(),
              last_message_sender_id: senderId,
            }
          : conv,
      ),
    });
  },

  // Hata ayarla
  setError: (error: string | null) => {
    set({ error });
  },

  // Hata temizle
  clearError: () => {
    set({ error: null });
  },

  // Store'u sıfırla
  reset: () => {
    set(initialState);
  },
}));
