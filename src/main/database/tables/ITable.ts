export default interface ITable<T, K> {
  createTable(): Promise<void>;
  getAll(filterKey?: K): Promise<T[]>;
  getOne(id: K): Promise<T | null>;
  insert(entity: T | T[]): Promise<string[]>;
  update(entity: T): Promise<void>;
  delete(id: K): Promise<void>;
}