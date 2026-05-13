import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import type { Product } from './productService';

const DB_NAME = 'sales_home_products.db';

let dbReady: Promise<SQLiteDatabase | null> | null = null;

async function getDb(): Promise<SQLiteDatabase | null> {
  if (!dbReady) {
    dbReady = (async () => {
      try {
        const db = await openDatabaseAsync(DB_NAME);
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS cached_products (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image TEXT
          );
        `);
        return db;
      } catch {
        return null;
      }
    })();
  }
  return dbReady;
}

export async function replaceCachedProducts(products: Product[]): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.runAsync('DELETE FROM cached_products');
  for (const p of products) {
    await db.runAsync(
      'INSERT INTO cached_products (id, name, description, price, image) VALUES (?, ?, ?, ?, ?)',
      [p.id, p.name ?? '', p.description ?? '', Number(p.price) || 0, p.image ?? '']
    );
  }
}

type CachedRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
};

export async function getCachedProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db.getAllAsync<CachedRow>(
    'SELECT id, name, description, price, image FROM cached_products ORDER BY name COLLATE NOCASE ASC'
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: Number(row.price) || 0,
    image: row.image ? row.image : undefined,
  }));
}
