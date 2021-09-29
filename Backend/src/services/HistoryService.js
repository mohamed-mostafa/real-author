const BaseService = require("../core/baseService");
const { History } = require("../database/mongo/models/index");

class HistoryService extends BaseService {
  async getAll(pagination = false) {
    const history = await History.getAll({}, {}, pagination);
    return history.reverse();
  }
}

module.exports = new HistoryService();
