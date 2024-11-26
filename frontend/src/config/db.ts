import Dexie, { type EntityTable } from 'dexie';
import { Encodings, Occupants } from '../types/db.types';



const db = new Dexie('frames') as Dexie & {
  encodings: EntityTable<Encodings>;
  occupants: EntityTable<Occupants>;
};

// Schema declaration:
db.version(1).stores({
  encodings: '++id, name, schoolId, encoding',
  occupants: '++id, name, schoolId, timeIn, timeOut'
});

export type { Encodings };
export { db };