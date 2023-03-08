import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";

export type ValidatedAPIGatewayProxyEvent<TBody, TUrlParams> = Omit<
  APIGatewayProxyEvent,
  "body" | "pathParameters"
> & {
  rawBody: string;
  body: TBody;
} & {
  pathParameters: TUrlParams;
};

export type ValidatedAPIGatewayProxyEventHandler<
  TBody,
  TUrlParams = null
> = Handler<
  ValidatedAPIGatewayProxyEvent<TBody, TUrlParams>,
  APIGatewayProxyResult
>;

export const middify = <TBody, TUrlParams>(
  handler: ValidatedAPIGatewayProxyEventHandler<TBody, TUrlParams>
) => middy(handler).use(httpHeaderNormalizer()).use(jsonBodyParser());

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
