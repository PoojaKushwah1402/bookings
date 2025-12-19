const withDelay = async <T>(callback: () => T, delayMs = 120): Promise<T> =>
  new Promise<T>((resolve) => {
    setTimeout(() => resolve(callback()), delayMs);
  });

export const httpClient = {
  get: withDelay,
  post: withDelay,
  patch: withDelay,
  delete: withDelay,
};

export type HttpClient = typeof httpClient;


