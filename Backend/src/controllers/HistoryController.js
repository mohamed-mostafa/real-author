const { aclResources } = require("../core/authorization/accessList");
const BaseController = require("../core/baseController");

const HistoryService = require("../services/HistoryService");

class HistoryController extends BaseController {
  constructor() {
    super({
      name: aclResources.USER,
      path: "/history",
      service: HistoryService,
      routes: [{ method: "GET", path: "/", handler: "find" }],
    });
  }

  async find(ctx) {
    await this.authorize(ctx, ["readAny"]);
    ctx.body = await this.service.getAll();
  }
}

module.exports = HistoryController;
