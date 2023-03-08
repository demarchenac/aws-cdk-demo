import { aws_lambda_nodejs } from "aws-cdk-lib";
import { type Construct } from "constructs";

import { type ApiGateway } from "@constructs/apiGateway";
import { type Table } from "@constructs/table";

import addTodo from "@lambda-handlers/addTodo";

import { nodejsFunctionProps } from "./base";

type AddTodoFunctionProps = {
  apiGateway: ApiGateway;
  todoTable: Table;
};

export class AddTodoFunction extends aws_lambda_nodejs.NodejsFunction {
  constructor(scope: Construct, id: string, props: AddTodoFunctionProps) {
    const { entry, ...apiGatewayIntegrationOptions } = addTodo;

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
