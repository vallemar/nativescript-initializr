export interface Adapter<T, S> {
  adapt: (data: T) => S;
}
