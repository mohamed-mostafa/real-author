const { aclResources } = require("../core/authorization/accessList");
const BaseController = require("../core/baseController");
const { userSchema } = require("../core/validation/schemas");
const AuthenticationService = require("../services/AuthenticationService");

const multipart = {
  fileSize: 1 * 1024 * 1024,
  fields: {
    image: { maxCount: 1, ext: ["jpg", "jpeg", "png", "PNG"] },
  },
};

class AuthenticationController extends BaseController {
  constructor() {
    super({
      name: aclResources.AUTHENTICATION,
      path: "/auth/local",
      service: AuthenticationService,
      routes: [
        { method: "POST", path: "/login", handler: "login" },
        { method: "POST", path: "/register", handler: "register", multipart },
        { method: "POST", path: "/verify", handler: "verifyEmail" },
      ],
    });
  }

  async login(ctx) {
    await this.authorize(ctx, ["createAny"]);
    await this.validate(
      {
        type: "object",
        properties: {
          password: { type: "string", minLength: 6, maxLength: 64 },
          username: { type: "string", format: "email" },
        },
        required: ["username", "password"],
      },
      ctx.request.body
    );
    const user = await this.service.login(ctx.request.body);
    ctx.body = user;
  }

  async register(ctx) {
    await this.authorize(ctx, ["createAny"]);
    const data = ctx.request.body;
    await this.validate(userSchema, data);

    const user = await this.service.register(data, ctx.request.files);
    ctx.body = user;
  }

  async verifyEmail(ctx) {
    ctx.body = await this.service.verifyEmail(ctx.request.body);
  }
}

module.exports = AuthenticationController;
