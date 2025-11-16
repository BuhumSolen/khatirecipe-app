// Database utility functions for Cloudflare D1
export interface D1Statement {
  bind(...values: any[]): D1Statement;
  all(): Promise<{ results: any[]; meta: any }>;
  first(): Promise<any>;
  run(): Promise<{ success: boolean; meta: any }>;
}

export interface Database {
  prepare(query: string): D1Statement;
}

export interface Env {
  DB: Database;
  IMAGES: any; // R2Bucket
  JWT_SECRET: string;
}

// Helper function to execute queries
export async function query<T = any>(
  db: Database,
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(...params);
  }
  const result = await stmt.all();
  return result.results as T[];
}

export async function queryOne<T = any>(
  db: Database,
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(...params);
  }
  return (await stmt.first()) as T | null;
}

export async function execute(
  db: Database,
  sql: string,
  params: any[] = []
): Promise<boolean> {
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(...params);
  }
  const result = await stmt.run();
  return result.success;
}
