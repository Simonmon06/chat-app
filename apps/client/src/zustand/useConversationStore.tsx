// useConversationStore is the Single Source of Truth for Conversation, its participants and Messages,
// use them directly from the store.

import { create } from "zustand";
import {
  type ConversationListItemType,
  type MessageType,
} from "@chat-app/validators";
// import { persist } from "zustand/middleware";
// TODO add persist to store conversation info in localstorage

interface ConversationState {
  conversationListItems: ConversationListItemType[] | null;
  setConversationListItems: (
    conversation: ConversationListItemType[] | null
  ) => void;

  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  messages: Record<string, MessageType[]>;
  setMessages: (conversationId: string, messages: MessageType[]) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversationListItems: [],
  setConversationListItems: (listItems) =>
    set({ conversationListItems: listItems }),
  selectedConversationId: null,
  setSelectedConversationId: (id) => set({ selectedConversationId: id }),
  messages: {},
  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),
}));
