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
    },
    alarms: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          type: {
            type: "string"
          },
          subtype: {
            type: "string"
          },
          details: {
            type: "string"
          },
          enabled: {
            type: "boolean"
          },
          intervalAmount: {
            type: "number"
          },
          intervalType: {
            type: "string"
          }
        },
        required: ["id", "type"]
      }
    }
  },
  required: ["id", "name"],
  indexes: ["name"]
};

export default schema;
