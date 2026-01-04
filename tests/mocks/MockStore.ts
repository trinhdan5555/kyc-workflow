import { Store, StoreAdapter } from "../../src/types";


export class MockStore implements StoreAdapter {
  private store: Store = { applications: [] };

  read(): Store {
    return this.store;
  }

  write(store: Store): void {
    this.store = store;
  }
}
