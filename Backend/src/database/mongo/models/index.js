const User = require("../ModelsFactory").create("User");
const Research = require("../ModelsFactory").create("Research");
const History = require("../ModelsFactory").create("History");

module.exports = {
  User,
  Research,
  History,
};
