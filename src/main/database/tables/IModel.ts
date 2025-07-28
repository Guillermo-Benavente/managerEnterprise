export interface IModel<V, D> {
  toData(): D;
  toFrontend(): V;
}

export type ModelClass<V, D> = {
  new (data: D): IModel<V, D>;
  fromView(view: V): IModel<V, D>;
}