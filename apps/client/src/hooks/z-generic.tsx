import { useShallow } from "zustand/react/shallow";
import type { StoreApi, UseBoundStore } from "zustand";

export function usePickFrom<S, K extends keyof S>(
  store: UseBoundStore<StoreApi<S>>,
  ...keys: K[]
) {
  return store(
    useShallow((s: S) => {
      const out = {} as Pick<S, K>;
      for (const k of keys) (out as any)[k] = (s as any)[k];
      return out;
    })
  );
}
