import { create } from "zustand";

export type Contact = {
  id: string;
  nickname: string;
  profilePic: string | null;
};

interface ContactsState {
  selectedContact: Contact | null;
  setSelectedContact: (c: Contact | null) => void;
}

export const useContactsStore = create<ContactsState>((set) => ({
  selectedContact: null,
  setSelectedContact: (c) => set({ selectedContact: c }),
}));
