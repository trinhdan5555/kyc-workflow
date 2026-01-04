import { KycApplication } from "../types";

export type Store = {
  applications: KycApplication[];
};

export interface StoreAdapter {
  read(): Store;
  write(store: Store): void;
}
