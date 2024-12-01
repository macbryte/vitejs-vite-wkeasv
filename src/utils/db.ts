export interface DBSchema {
  assets: {
    key: string;
    value: {
      id: string;
      category: string;
      description: string;
      value: number;
    };
  };
  liabilities: {
    key: string;
    value: {
      id: string;
      category: string;
      description: string;
      amount: number;
    };
  };
  netWorthHistory: {
    key: string;
    value: {
      date: string;
      totalAssets: number;
      totalLiabilities: number;
      netWorth: number;
    };
  };
}

const DB_NAME = 'netWorthDB';
const DB_VERSION = 1;

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('assets')) {
        db.createObjectStore('assets', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('liabilities')) {
        db.createObjectStore('liabilities', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('netWorthHistory')) {
        db.createObjectStore('netWorthHistory', { keyPath: 'date' });
      }
    };
  });
}

export async function getAllItems<T>(storeName: keyof DBSchema): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function addItem<T>(storeName: keyof DBSchema, item: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function removeItem(storeName: keyof DBSchema, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}