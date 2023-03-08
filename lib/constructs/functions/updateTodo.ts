import { aws_lambda_nodejs } from "aws-cdk-lib";
import { type Construct } from "constructs";

import { type ApiGateway } from "@constructs/apiGateway";
import { type Table } from "@constructs/table";
import updateTodo from "@lambda-handlers/updateTodo";

import { nodejsFunctionProps } from "./base";

type UpdateTodoFunctionProps = {
  apiGateway: ApiGateway;
  todoTable: Table;
};

export class UpdateTodoFunction extends aws_lambda_nodejs.NodejsFunction {
  constructor(scope: Construct, id: string, props: UpdateTodoFunctionProps) {
    const { entry, ...apiGatewayIntegrationOptions } = updateTodo;

    super(scope, id, {
      ...nodejsFunctionProps,
      entry,
      environment: {
        TABLE_NAME: props.todoTable.tableName,
      },
    });

    // Grant the required DynamoDB permissions to the function
    props.todoTable.grantReadWriteData(this);
    // Create the API integration for the function
    props.apiGateway.addLambdaIntegration(this, apiGatewayIntegrationOptions);
  }
}
