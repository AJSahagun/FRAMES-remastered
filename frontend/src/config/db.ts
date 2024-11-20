import Dexie, { type EntityTable } from 'dexie';

type Encodings ={
  id: number;
  name: string;
  schoolId: string;
  encoding: number[];
}

type Occupants ={
  id: number;
  name: string;
  schoolId: string;
  timeIn: string;
  timeOut: string | null;
}

const db = new Dexie('frames') as Dexie & {
  encodings: EntityTable<Encodings>;
  occupants: EntityTable<Occupants>;
};

// Schema declaration:
db.version(1).stores({
  encodings: '++id, name, schoolId, encoding',
  occupants: '++id, name, schoolId, timeIn'
});

export type { Encodings };
export { db };