import { aws_lambda_nodejs } from "aws-cdk-lib";
import { type Construct } from "constructs";

import { type ApiGateway } from "@constructs/apiGateway";
import { type Table } from "@constructs/table";

import { nodejsFunctionProps } from "./base";
import getTodo from "@lambda-handlers/getTodo";

type GetTodoFunctionProps = {
  apiGateway: ApiGateway;
  todoTable: Table;
};

export class GetTodoFunction extends aws_lambda_nodejs.NodejsFunction {
  constructor(scope: Construct, id: string, props: GetTodoFunctionProps) {
    const { entry, ...apiGatewayIntegrationOptions } = getTodo;

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
