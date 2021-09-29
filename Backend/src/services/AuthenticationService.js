const baseService = require("../core/baseService");
const { User } = require("../database/mongo/models");
const { roles } = require("../core/authorization/accessList");
const ConfirmMailService = require("./ConfirmMailService");

class AuthenticationService extends baseService {
  async login(data) {
    const existUser = await User.getOne(
      { email: data.username },
      { lean: true, fields: { researches: 0 } }
    );
    if (!existUser) {
      throw new this.NotFoundError("wrongUsernameOrPassword");
    }
    if (!(await this.crypto.compareHash(data.password, existUser.password))) {
      throw new this.NotFoundError("wrongUsernameOrPassword");
    }
    delete existUser.password;
    const token = await this.crypto.createJwtToken(
      {
        sub: existUser._id.toString(),
        roles: existUser.roles,
      },
      "key"
    );
    return { user: existUser, token };
  }

  async register(data, files) {
    let existUser = await User.exists({ email: data.email });
    if (existUser) {
      throw new this.ValidationError("userWithThisEmailExists");
    }
    existUser = await User.exists({ mobile: data.mobile });
    if (existUser) {
      throw new this.ValidationError("userWithThisMobileExists");
    }
    if (files && files.image) {
      const [image] = await this.storage.save(files.image);
      data.image = image;
    }
    data.password = this.crypto.createHash(data.password);
    data.roles = [roles.user];
    const user = await User.create(data);
    const token = await this.crypto.createJwtToken(
      {
        sub: user._id.toString(),
        roles: user.roles,
      },
      "key"
    );

    const confirmToken = await this.crypto.createJwtTokenWithExpiration(
      {
        sub: user._id.toString(),
        roles: user.roles,
      },
      "confirmationKey",
      72000000
    );
    new ConfirmMailService().sendMail({ to: user.email, token: confirmToken });
    return { user: user.toObject(), token };
  }

  async verifyEmail({ token }) {
    const data = await this.crypto.verifyJwtToken(token, "confirmationKey");
    if (!data) {
      throw new this.ValidationError("Invalid Token");
    }
    const user = await User.getById(data.sub);
    if (!user) {
      throw this.NotFoundError("user not found");
    }
    user.is_email_verified = true;

    return user.save();
  }
}

module.exports = new AuthenticationService();
