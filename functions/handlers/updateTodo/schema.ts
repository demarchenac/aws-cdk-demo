export const schema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 2, maxLength: 100 },
    description: { type: "string", minLength: 2, maxLength: 500 },
    completed: { type: "boolean" },
  },
  required: ["title", "description", "completed"],
  additionalProperties: false,
};

export type Schema = { title: string; description: string; completed: boolean };
