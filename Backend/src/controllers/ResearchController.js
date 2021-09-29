const { aclResources } = require("../core/authorization/accessList");
const BaseController = require("../core/baseController");
const { researchSchema } = require("../core/validation/schemas");
const ResearchService = require("../services/ResearchService");

const multipart = {
  fileSize: 1 * 1024 * 1024,
  fields: {
    image: { maxCount: 1, ext: ["jpg", "jpeg", "png", "PNG"] },
  },
};

class ResearchController extends BaseController {
  constructor() {
    super({
      name: aclResources.RESEARCH,
      path: "/researches",
      service: ResearchService,
      routes: [
        { method: "POST", path: "/", handler: "create", multipart },
        { method: "GET", path: "/", handler: "get" },
        { method: "PUT", path: "/:id", handler: "update", multipart },
        { method: "GET", path: "/:id", handler: "getOne" },
        {
          method: "GET",
          path: "/:id/investigators",
          handler: "getInvestigators",
        },
        {
          method: "PUT",
          path: "/:id/investigators",
          handler: "deleteInvestigator",
        },
        {
          method: "GET",
          path: "/:id/parameters",
          handler: "getParameters",
        },
        {
          method: "GET",
          path: "/:id/rank",
          handler: "rank",
        },
        {
          method: "PUT",
          path: "/:id/rank",
          handler: "calcRank",
        },
      ],
    });
  }

  async create(ctx) {
    await this.authorize(ctx, ["createAny"]);
    await this.validate(researchSchema, ctx.request.body);
    ctx.body = await this.service.create({
      data: ctx.request.body,
      files: ctx.request.files,
      userName: ctx._locals.user.firstName + ctx._locals.user.lastName,
    });
  }

  async get(ctx) {
    await this.authorize(ctx, ["readAny"]);
    ctx.body = await this.service.getAll(
      ctx.request.query,
      ctx.request.query,
      ctx._locals.user.roles[0]
    );
  }

  async getOne(ctx) {
    await this.authorize(ctx, ["readAny"]);
    ctx.body = await this.service.getOne(ctx.params.id);
  }

  async getInvestigators(ctx) {
    await this.authorize(ctx, ["readAny"]);
    ctx.body = await this.service.getInvestigators(ctx.params.id);
  }

  async getParameters(ctx) {
    await this.authorize(ctx, ["readAny"]);
    ctx.body = await this.service.getParameters(ctx.params.id);
  }

  async rank(ctx) {
    await this.authorize(ctx, ["readAny"]);
    ctx.body = await this.service.rank(ctx.params.id);
  }

  async calcRank(ctx) {
    await this.authorize(ctx, ["updateAny"]);

    // console.log(ctx.body);
    ctx.body = await this.service.calcRank({
      researchId: ctx.params.id,
      userId: ctx.request.body.userId,
    });
  }

  async update(ctx) {
    await this.authorize(ctx, ["updateAny"]);
    const data = ctx.request.body;
    await this.validate(researchSchema, data, false);
    ctx.body = await this.service.update({
      id: ctx.params.id,
      data: data,
      files: ctx.request.files,
      userName: ctx._locals.user.firstName + ctx._locals.user.lastName,
    });
  }

  async deleteInvestigator(ctx) {
    await this.authorize(ctx, ["updateAny"]);
    ctx.body = await this.service.deleteInvestigator({
      researchId: ctx.params.id,
      investigatorId: ctx.request.body.investigatorId,
    });
  }
}

module.exports = ResearchController;
