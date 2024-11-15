import Dexie, { type EntityTable } from 'dexie';

type Encodings ={
  id: number;
  name: string;
  schoolId: string;
  encoding: number[];
}

const db = new Dexie('frames') as Dexie & {
  encodings: EntityTable<
    Encodings
  >;
};

// Schema declaration:
db.version(1).stores({
  encodings: '++id, name, schoolId, encoding' // primary key "id" (for the runtime!)
});

export type { Encodings };
export { db };