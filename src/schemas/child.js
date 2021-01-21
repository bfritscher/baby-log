const schema = {
  titel: "Child Schema",
  description: "Child Schema",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string"
    },
    birthdate: {
      type: "string",
      format: "date"
    },
    gender: {
      type: "string"
    }
  },
  required: ["id", "name"],
  indexes: ["name"]
};

export default schema;
