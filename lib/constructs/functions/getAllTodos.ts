import { aws_lambda_nodejs } from "aws-cdk-lib";
import { type Construct } from "constructs";

import { type ApiGateway } from "@constructs/apiGateway";
import { type Table } from "@constructs/table";
import getAllTodos from "@lambda-handlers/getAllTodos";

import { nodejsFunctionProps } from "./base";

type GetAllTodosFunctionProps = {
  apiGateway: ApiGateway;
  todoTable: Table;
};

export class GetAllTodosFunction extends aws_lambda_nodejs.NodejsFunction {
  constructor(scope: Construct, id: string, props: GetAllTodosFunctionProps) {
    const { entry, ...apiGatewayIntegrationOptions } = getAllTodos;

    super(scope, id, {
      ...nodejsFunctionProps,
      entry,
      environment: {
        TABLE_NAME: props.todoTable.tableName,
      },
    });

    // Grant the required DynamoDB permissions to the function
    props.todoTable.grantReadData(this);
    // Create the API integration for the function
    props.apiGateway.addLambdaIntegration(this, apiGatewayIntegrationOptions);
  }
}
