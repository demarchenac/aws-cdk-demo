import { ddb } from "@lambda-libs/aws";
import { generateId } from "@lambda-libs/id";
import * as lambda from "@lambda-libs/lambda";

import { type Schema } from "./schema";

const tableName = lambda.getEnv("TABLE_NAME").required().asString();

const lambdaHandler: lambda.ValidatedAPIGatewayProxyEventHandler<
  Schema
> = async (event) => {
  const {
    body: { title, description },
  } = event;

  const todoId = "todo#" + generateId();

  await ddb
    .put({
      TableName: tableName,
      Item: {
        pk: `item#${todoId}`,
        sk: `item#${todoId}`,
        insertedAt: Date.now(),
        completed: false,
        title,
        description,
      },
    })
    .promise();

  const result = await ddb
    .get({
      TableName: tableName,
      Key: { pk: `item#${todoId}`, sk: `item#${todoId}` },
    })
    .promise()
    .catch((error) => ({ Item: error }));

  return lambda.formatJSONResponse({ todo: result.Item }, 201);
};

export const handler = lambda.middify(lambdaHandler);
