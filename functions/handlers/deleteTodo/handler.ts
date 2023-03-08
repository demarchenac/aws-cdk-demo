import { ddb } from "@lambda-libs/aws";
import * as lambda from "@lambda-libs/lambda";

const tableName = lambda.getEnv("TABLE_NAME").required().asString();

interface UrlParams {
  todoId: string;
}

const lambdaHandler: lambda.ValidatedAPIGatewayProxyEventHandler<
  null,
  UrlParams
> = async (event) => {
  const todoId = decodeURIComponent(event.pathParameters.todoId);

  await ddb
    .delete({
      TableName: tableName,
      Key: { pk: todoId, sk: todoId },
    })
    .promise()
    .catch((error) => ({ Item: error }));

  return lambda.formatJSONResponse({}, 204);
};

export const handler = lambda.middify(lambdaHandler);
