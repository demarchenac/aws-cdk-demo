import { aws_lambda_nodejs } from "aws-cdk-lib";
import { type Construct } from "constructs";

import { type ApiGateway } from "@constructs/apiGateway";
import { type Table } from "@constructs/table";

import { nodejsFunctionProps } from "./base";
import deleteTodo from "@lambda-handlers/deleteTodo";

type DeleteTodoFunctionProps = {
  apiGateway: ApiGateway;
  todoTable: Table;
};

export class DeleteTodoFunction extends aws_lambda_nodejs.NodejsFunction {
  constructor(scope: Construct, id: string, props: DeleteTodoFunctionProps) {
    const { entry, ...apiGatewayIntegrationOptions } = deleteTodo;

    super(scope, id, {
      ...nodejsFunctionProps,
      entry,
      environment: {
        TABLE_NAME: props.todoTable.tableName,
      },
    });

    // Grant the required DynamoDB permissions to the function
    props.todoTable.grantWriteData(this);
    // Create the API integration for the function
    props.apiGateway.addLambdaIntegration(this, apiGatewayIntegrationOptions);
  }
}
