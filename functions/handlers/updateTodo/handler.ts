import { ddb } from "@lambda-libs/aws";
import * as lambda from "@lambda-libs/lambda";

import { type Schema } from "./schema";

const tableName = lambda.getEnv("TABLE_NAME").required().asString();

interface UrlParams {
  todoId: string;
}

const lambdaHandler: lambda.ValidatedAPIGatewayProxyEventHandler<
  Schema,
  UrlParams
> = async (event) => {
  const {
    body: { title, description, completed },
  } = event;

  const todoId = decodeURIComponent(event.pathParameters.todoId);

  await ddb
    .update({
      TableName: tableName,
      Key: {
        pk: todoId,
        sk: todoId,
      },
      UpdateExpression:
        "set title = :newTitle, description = :newDescription, completed = :isCompleted",
      ExpressionAttributeValues: {
        ":newTitle": title,
        ":newDescription": description,
        ":isCompleted": completed,
      },
    })
    .promise();

  const result = await ddb
    .get({
      TableName: tableName,
      Key: { pk: todoId, sk: todoId },
    })
    .promise()
    .catch((error) => ({ Item: error }));

  return lambda.formatJSONResponse({ todo: result.Item }, 200);
};

export const handler = lambda.middify(lambdaHandler);
