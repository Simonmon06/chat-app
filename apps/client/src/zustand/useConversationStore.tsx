// useConversationStore is the Single Source of Truth for Conversation, its participants and Messages,
// use them directly from the store.

import { create } from "zustand";
import {
  type ConversationListItemType,
  type MessageType,
} from "@chat-app/validators";
// import { persist } from "zustand/middleware";
// TODO add persist to store conversation info in localstorage
type MessageMap = Record<string, MessageType[]>;

interface ConversationState {
  conversationListItems: ConversationListItemType[] | null;
  receiverId: string | null;
  selectedConversationId: string | null;
  messages: MessageMap;

  setConversationListItems: (
    conversation: ConversationListItemType[] | null
  ) => void;

  setReceiverId: (id: string | null) => void;

  setSelectedConversationId: (id: string | null) => void;

  setMessages: (conversationId: string, messages: MessageType[]) => void;
}

const initialState: Pick<
  ConversationState,
  "conversationListItems" | "receiverId" | "selectedConversationId" | "messages"
> = {
  conversationListItems: null,
  receiverId: null,
  selectedConversationId: null,
  messages: {},
};

export const useConversationStore = create<ConversationState>((set) => ({
  ...initialState,
  setConversationListItems: (listItems) =>
    set({ conversationListItems: listItems }),

  setReceiverId: (id) => set({ receiverId: id }),

  setSelectedConversationId: (id) => set({ selectedConversationId: id }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),
}));
