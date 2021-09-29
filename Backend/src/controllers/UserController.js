const { aclResources } = require("../core/authorization/accessList");
const BaseController = require("../core/baseController");
const { userSchema } = require("../core/validation/schemas");
const UserService = require("../services/UserService");

const multipart = {
  fileSize: 1 * 1024 * 1024,
  fields: {
    image: { maxCount: 1, ext: ["jpg", "jpeg", "png", "PNG"] },
  },
};

class UserController extends BaseController {
  constructor() {
    super({
      name: aclResources.USER,
      path: "/users",
      service: UserService,
      routes: [
        { method: "PUT", path: "/:id/", handler: "update", multipart },
        { method: "GET", path: "/:id/", handler: "getOne" },
        { method: "GET", path: "/", handler: "get" },
        {
          method: "PUT",
          path: "/:id/investigator",
          handler: "updateInvestigator",
        },
        {
          method: "PUT",
          path: "/:id/research",
          handler: "deleteResearch",
        },
        {
          method: "PUT",
          path: "/:id/participate",
          handler: "participate",
        },
        { method: "GET", path: "/:id/parameters", handler: "parameters" },
        {
          method: "PUT",
          path: "/:id/parameters",
          handler: "updateParameters",
        },
      ],
    });
  }

  async get(ctx) {
    await this.authorize(ctx, ["readAny"]);
    ctx.body = await this.service.getAll(ctx.request.query, ctx.request.query);
  }

  async getOne(ctx) {
    await this.authorize(ctx, ["readAny"]);
    ctx.body = await this.service.getOne(ctx.params.id, ctx.request.query);
  }

  async parameters(ctx) {
    await this.authorize(ctx, ["readAny"]);
    ctx.body = await this.service.parameters(
      ctx.params.id,
      ctx._locals.user._id
    );
  }

  async update(ctx) {
    await this.authorize(ctx, ["updateAny"]);
    const data = ctx.request.body;
    await this.validate(userSchema, data, false);
    ctx.body = await this.service.update({
      id: ctx.params.id,
      data: data,
      files: ctx.request.files,
    });
  }

  async updateInvestigator(ctx) {
    await this.authorize(ctx, ["updateAny"]);
    const data = ctx.request.body;
    ctx.body = await this.service.updateInvestigator({
      userId: ctx.params.id,
      data: data,
    });
  }

  async participate(ctx) {
    await this.authorize(ctx, ["updateOwn"]);
    const data = ctx.request.body;
    ctx.body = await this.service.participate({
      id: ctx.params.id,
      data: data,
    });
  }

  async updateParameters(ctx) {
    await this.authorize(ctx, ["updateOwn"]);
    ctx.body = await this.service.updateParameters(
      ctx.params.id,
      ctx.request.body
    );
  }

  async deleteResearch(ctx) {
    await this.authorize(ctx, ["updateAny", "updateOwn"]);
    ctx.body = await this.service.deleteResearch({
      userId: ctx.params.id,
      researchId: ctx.request.body.researchId,
    });
  }
}

module.exports = UserController;
