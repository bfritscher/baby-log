const schema = {
  titel: "record",
  description: "Record Schema",
  version: 1,
  keyCompression: false,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    type: {
      type: "string"
    },
    subtype: {
      type: "string"
    },
    fromDate: {
      type: "string",
      format: "date-time"
    },
    toDate: {
      type: "string",
      format: "date-time"
    },
    amount: {
      type: "number"
    },
    unit: {
      type: "string"
    },
    details: {
      type: "string"
    },
    category: {
      type: "string"
    },
    childId: {
      type: "string"
    },
    timer: {
      type: "boolean"
    }
  },
  required: ["id", "type", "subtype", "fromDate", "childId"],
  indexes: ["fromDate", "childId"]
};

export default schema;
