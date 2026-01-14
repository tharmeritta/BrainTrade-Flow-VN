export interface CallLog {
  id: number;
  date: string;
  notes: string;
  completedSteps: string[];
  duration: number;
}

const DB_NAME = 'TeleFlowDB';
const DB_VERSION = 1;
const STORE_DRAFTS = 'drafts';
const STORE_HISTORY = 'call_history';

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
        db.createObjectStore(STORE_DRAFTS);
      }
      if (!db.objectStoreNames.contains(STORE_HISTORY)) {
        db.createObjectStore(STORE_HISTORY, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
};

export const saveDraftNote = async (content: string): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_DRAFTS, 'readwrite');
  tx.objectStore(STORE_DRAFTS).put(content, 'current_note');
  return new Promise((resolve) => {
    tx.oncomplete = () => resolve();
  });
};

export const getDraftNote = async (): Promise<string> => {
  const db = await openDB();
  const tx = db.transaction(STORE_DRAFTS, 'readonly');
  const request = tx.objectStore(STORE_DRAFTS).get('current_note');
  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result || '');
  });
};

export const clearDraftNote = async (): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_DRAFTS, 'readwrite');
  tx.objectStore(STORE_DRAFTS).delete('current_note');
  return new Promise((resolve) => {
    tx.oncomplete = () => resolve();
  });
};

export const archiveCall = async (log: Omit<CallLog, 'id'>): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_HISTORY, 'readwrite');
  const entry = { ...log, id: Date.now() };
  tx.objectStore(STORE_HISTORY).add(entry);
  return new Promise((resolve) => {
    tx.oncomplete = () => resolve();
  });
};
