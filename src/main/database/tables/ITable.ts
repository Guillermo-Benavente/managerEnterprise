export default interface ITable<T, K> {
  createTable(): Promise<void>;
  getAll(filterKey?: K): Promise<T[]>;
  getOne(id: K): Promise<T | null>;
  insertAll(entity: T[]): Promise<string[]>;
  insert(entity: T): Promise<string>;
  update(entity: T): Promise<void>;
  delete(id: K): Promise<void>;
}