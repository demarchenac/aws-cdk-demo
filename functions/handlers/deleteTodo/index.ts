import { join } from "path";

export default {
  entry: join(__dirname, "handler.ts"),
  path: "/todos/{todoId}",
  method: "DELETE",
};
