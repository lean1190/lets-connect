export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type ServerSearchParams = {
  [key: string]: string | string[] | undefined;
};

export type ValueOf<T> = T[keyof T];
