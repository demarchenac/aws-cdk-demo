import { ddb } from "@lambda-libs/aws";
import * as lambda from "@lambda-libs/lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const tableName = lambda.getEnv("TABLE_NAME").required().asString();

const lambdaHandler: lambda.ValidatedAPIGatewayProxyEventHandler<null> = async (
  _event
) => {
  try {
    let lastEvaluatedKey: DocumentClient.Key | undefined = {};

    const todos: DocumentClient.ItemList = [];

    while (typeof lastEvaluatedKey !== "undefined") {
      const result = await ddb.scan({ TableName: tableName }).promise();
      result.Items?.forEach((todo) => todos.push(todo));
      lastEvaluatedKey = result.LastEvaluatedKey;
    }

    return lambda.formatJSONResponse({ todos }, 200);
  } catch (error) {
    return lambda.formatJSONResponse({ error }, (error as any).statusCode);
  }
};

export const handler = lambda.middify(lambdaHandler);
