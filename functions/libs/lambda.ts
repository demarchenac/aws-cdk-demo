import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";

export type ValidatedAPIGatewayProxyEvent<T> = Omit<
  APIGatewayProxyEvent,
  "body"
> & {
  rawBody: string;
  body: T;
};

export type ValidatedAPIGatewayProxyEventHandler<T> = Handler<
  ValidatedAPIGatewayProxyEvent<T>,
  APIGatewayProxyResult
>;

export const middify = <T>(handler: ValidatedAPIGatewayProxyEventHandler<T>) =>
  middy(handler).use(httpHeaderNormalizer()).use(jsonBodyParser());

export const formatJSONResponse = (
  response: Record<string, unknown>,
  statusCode = 200
) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
};

export { get as getEnv } from "env-var";
