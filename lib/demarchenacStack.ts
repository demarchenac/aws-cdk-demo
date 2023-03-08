import { Stack, type StackProps } from "aws-cdk-lib";
import { type Construct } from "constructs";

import { ApiGateway } from "@constructs/apiGateway";
import { Table } from "@constructs/table";
import { CreateAccountFunction } from "@constructs/functions/createAccount";
import { AddTodoFunction } from "@constructs/functions/addTodo";
import { GetAllTodosFunction } from "@constructs/functions/getAllTodos";
import { GetTodoFunction } from "@constructs/functions/getTodo";
import { UpdateTodoFunction } from "@constructs/functions/updateTodo";
import { DeleteTodoFunction } from "@constructs/functions/deleteTodo";

type DemarchenacStackProps = StackProps & {
  apiStageName: string;
};

export class DemarchenacStack extends Stack {
  constructor(scope: Construct, id: string, props: DemarchenacStackProps) {
    const { apiStageName, ...stackProps } = props;

    super(scope, id, {
      description: "Contains all demarchenac application resources",
      ...stackProps,
    });

    const table = new Table(this, "account-table@demarchenac-api-demo");
    const todoTable = new Table(this, "todo-table@demarchenac-api-demo");

    const apiGateway = new ApiGateway(this, "api-gw@demarchenac-api-demo", {
      apiStageName,
    });

    new CreateAccountFunction(this, "create-account@demarchenac-api-demo", {
      table,
      apiGateway,
    });

    // [POST] /todos
    new AddTodoFunction(this, "add-todo@demarchenac-api-demo", {
      todoTable,
      apiGateway,
    });

    // [GET] /todos
    new GetAllTodosFunction(this, "get-all-todos@demarchenac-api-demo", {
      todoTable,
      apiGateway,
    });

    // [GET] /todos/{todoId}
    new GetTodoFunction(this, "get-todo@demarchenac-api-demo", {
      todoTable,
      apiGateway,
    });

    // [PUT] /todos/{todoId}
    new UpdateTodoFunction(this, "update-todo@demarchenac-api-demo", {
      todoTable,
      apiGateway,
    });

    // [DELETE] /todos/{todoId}
    new DeleteTodoFunction(this, "delete-todo@demarchenac-api-demo", {
      todoTable,
      apiGateway,
    });
  }
}
