import { WritableStore, store } from "openrct2-flexui";

const loadStoreFromParkStorage = <T extends object | null>(key: string) => {
  return (context.getParkStorage().get(key) ?? null) as T;
};

const subscribeToStoreChange = (store: WritableStore<any>, key: string) => {
  store.subscribe((v) => context.getParkStorage().set(key, v));
};

export const initializeStore = <T extends object | null>(key: string): WritableStore<T> => {
  const value = loadStoreFromParkStorage<T>(key);
  const s = store<T>(value);
  subscribeToStoreChange(s, key);
  return s;
};
