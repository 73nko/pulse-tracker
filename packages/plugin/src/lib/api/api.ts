export class ResponseError extends Error {
  response: Response;

  constructor(message: string, res: Response) {
    super(message);
    this.response = res;
  }
}

async function http<T>(path: string, config: RequestInit): Promise<T> {
  const request = new Request(path, config)
  const response = await fetch(request)

  if(!response.ok) {
    throw new ResponseError('Error', response)
  }

  return response.json().catch(() => ({}))
}


async function post<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = {method: 'post', body: JSON.stringify(body), ...config}
  return await http<U>(path, init)
}

export const api = {
  post,
}
