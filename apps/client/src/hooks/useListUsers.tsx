import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export type Contact = {
  id: string;
  nickname: string;
  profilePic: string | null;
};

type ListUsersResp = {
  items: Contact[];
  nextCursor: string | null;
  hasMore: boolean;
};

export function useListUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Contact[] | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get<ListUsersResp>("/api/users", {
        signal,
        params: { limit: 30 },
      });
      setItems(res.data.items);
      setCursor(res.data.nextCursor);
      setHasMore(res.data.hasMore);
    } catch (e) {
      if ((e as any)?.name === "CanceledError") return;
      setError(axiosErrorHandler(e));
      setItems([]); // 出错也别卡住
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    refresh(ctrl.signal);
    return () => ctrl.abort();
  }, [refresh]);

  return { isLoading, error, items, hasMore, cursor, refresh };
}
