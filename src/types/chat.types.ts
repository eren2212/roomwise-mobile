/**
 * Konuşma türü
 */
export type ConversationType = "direct" | "group";

/**
 * Mesaj türü
 */
export type MessageType = "text" | "image" | "location" | "system";

/**
 * Profil bilgisi (mesaj ve konuşma için)
 */
export interface ChatProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

/**
 * Mesaj
 */
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  message_type: MessageType;
  created_at: string;
  profiles?: ChatProfile;
}

/**
 * Konuşma katılımcısı
 */
export interface ConversationParticipant {
  id: string;
  user_id: string;
  last_read_at: string;
  joined_at: string;
  profiles: ChatProfile;
}

/**
 * Konuşma
 */
export interface Conversation {
  id: string;
  type: ConversationType;
  house_id: string | null;
  match_id: string | null;
  last_message_content: string | null;
  last_message_at: string | null;
  last_message_sender_id: string | null;
  created_at: string;
  updated_at: string;
  conversation_participants: ConversationParticipant[];
}

/**
 * Chat store state
 */
export interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * API Response tipi
 */
export interface ChatApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
