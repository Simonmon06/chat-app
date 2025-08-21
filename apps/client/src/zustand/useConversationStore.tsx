// useConversationStore is the Single Source of Truth for Conversation, its participants and Messages,
// use them directly from the store.

import { create } from "zustand";
import {
  type ConversationListItemType,
  type MessageType,
} from "@chat-app/validators";
import { devtools } from "zustand/middleware";
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

  upsertConversationListItem: (item: ConversationListItemType) => void;
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

export const useConversationStore = create<ConversationState>()(
  devtools(
    (set) => ({
      ...initialState,

      setConversationListItems: (listItems) =>
        set({ conversationListItems: listItems }, false, "conv/setList"),

      setReceiverId: (id) => set({ receiverId: id }, false, "conv/setReceiver"),

      setSelectedConversationId: (id) =>
        set({ selectedConversationId: id }, false, "conv/select"),

      setMessages: (conversationId, messages) =>
        set(
          (state) => ({
            messages: { ...state.messages, [conversationId]: messages },
          }),
          false,
          "msg/setForConversation"
        ),

      upsertConversationListItem: (incoming) =>
        set(
          (state) => {
            const list = state.conversationListItems ?? [];
            const idx = list.findIndex((x) => x.id === incoming.id);
            let next: ConversationListItemType[];

            if (idx >= 0) {
              // merge & move to top
              const merged: ConversationListItemType = {
                ...list[idx],
                ...incoming,
                // 以服务端最新 last message/updatedAt 为准
                messages: incoming.messages?.length
                  ? incoming.messages
                  : list[idx].messages,
                updatedAt: incoming.updatedAt ?? list[idx].updatedAt,
                participants: incoming.participants?.length
                  ? incoming.participants
                  : list[idx].participants,
              };
              next = [merged, ...list.slice(0, idx), ...list.slice(idx + 1)];
            } else {
              next = [incoming, ...list];
            }

            return { conversationListItems: next };
          },
          false,
          "conv/upsertListItem"
        ),
    }),
    {
      name: "conversation-store",
      enabled: import.meta.env.DEV,
    }
  )
);
