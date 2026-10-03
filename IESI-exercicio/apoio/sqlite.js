import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
// Infraestrutura fornecida. Os comandos de negócio ficam no Repository.
export function abrirBanco(caminho) {
  mkdirSync(dirname(caminho), { recursive: true });
  const db = new DatabaseSync(caminho);
  db.exec(`PRAGMA busy_timeout = 3000;
    CREATE TABLE IF NOT EXISTS produtos (
      sku TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      quantidade INTEGER NOT NULL CHECK (quantidade >= 0)
    );`);
  return db;
}
