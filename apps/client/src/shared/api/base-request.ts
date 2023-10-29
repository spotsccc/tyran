import { ErrorResponse, Response, SuccessResponse } from 'api-contract'

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

type RequestConfig<Body> = {
  path: string
  method: Method
  body?: Body
  headers?: Record<string, string>
}

export class ForbiddenError extends Error {}
export class UnauthorizedError extends Error {}
export class NotFoundError extends Error {}
export class InternalServerError extends Error {}

export class BadRequestError extends Error {}
export class UnknownError extends Error {}
export class ParsingError extends Error {}

export const baseRequest = async <
  ResponsePayload extends Response<unknown>,
  Body = unknown,
>({
  path,
  body,
  method,
  headers,
}: RequestConfig<Body>): Promise<
  ResponsePayload extends SuccessResponse<unknown>
    ? ResponsePayload['data']
    : never
> => {
  const res = await fetch(`http://localhost:4000/api${path}`, {
    method,
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  })
  let parsedResponse: ResponsePayload
  try {
    parsedResponse = (await res.json()) as ResponsePayload
  } catch (error) {
    if (error instanceof Error) {
      throw new ParsingError(error.message)
    }
    throw new ParsingError('Unknown parsing error')
  }
  if (!res.ok) {
    const error = (parsedResponse as ErrorResponse).message
    switch (res.status) {
      case 400:
        throw new BadRequestError(error)
      case 401:
        throw new UnauthorizedError(error)
      case 403:
        throw new ForbiddenError(error)
      case 404:
        throw new NotFoundError(error)
      case 500:
        throw new InternalServerError(error)
      default:
        throw new UnknownError(error)
    }
  }
  const payload = (
    parsedResponse as SuccessResponse<
      ResponsePayload extends SuccessResponse<unknown>
        ? ResponsePayload['data']
        : never
    >
  ).data
  return payload
}
