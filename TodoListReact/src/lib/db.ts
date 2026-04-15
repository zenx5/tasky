// src/lib/db.ts
import Dexie, { Table } from 'dexie';

export class MyDatabase extends Dexie {
  tasks!: Table<Task, string>;

  constructor() {
    super('TodoOfflineDB');
    this.version(2).stores({
      tasks: "externalId, id, order, isPendingSync"
    });
  }
}

export const db = new MyDatabase();