module.exports = {
  type: "object",
  properties: {
    name: { type: "string" },
    abstract: { type: "string" },
    status: { type: "string" },
    investigators: { type: "array" },
    commonParameters: { type: "object" },
  },
  required: ["name", "abstract"],
};
