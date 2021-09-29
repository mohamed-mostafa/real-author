const baseService = require("../core/baseService");
const { User, Research } = require("../database/mongo/models");

class UserService extends baseService {
  async getAll(filters, params, pagination = false) {
    const nParams = params;
    const query = {};

    if (filters.appStatus) {
      query.app_status = { $in: filters.app_status.split(",") };
    }

    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: "i" } },
        { lastName: { $regex: filters.search, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: filters.search,
              options: "i",
            },
          },
        },
        { phoneNumber: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.role) {
      query.roles = filters.role;
    }
    if (nParams.pagination) {
      pagination = this.utils.parseBoolean(nParams.pagination);
    }

    nParams.lean = true;
    return User.getAll(query, nParams, pagination);
  }

  async getOne(id, query) {
    const user = await User.getById(id, {
      lean: true,
      populate: [["researches.id", "name"]],
    });
    if (!user) {
      throw new this.NotFoundError(`there is no research with id ${id}`);
    }
    if (query.research) {
      const research = user.researches.find(
        (element) => element.id._id.toString() === query.research
      );
      if (!research)
        throw new this.NotFoundError(
          "You are not participated in this research"
        );
      return research;
    }
    return user;
  }

  async getInvestigators(id) {
    const research = await User.getById(id, { lean: true });
    if (!research) {
      throw new this.NotFoundError(`there is no research with id ${id}`);
    }
    const investigators = research.investigators;
    return investigators;
  }

  async update({ data, id, files }) {
    const user = await User.getById(id);
    if (!user) {
      throw new this.NotFoundError(`there is no research with id ${id}`);
    }
    if (files) {
      if (files.image && user.image) {
        await this.storage.delete(user.image);
      }
      if (files.image) data.image = (await this.storage.save(files.image))[0];
    }
    return User.updateById(id, data, { new: true, lean: true });
  }

  async participate({ data, id }) {
    const user = await User.getById(id);
    if (!user) {
      throw new this.NotFoundError(`there is no research with id ${id}`);
    }
    data.roles = [];
    data.roles.push("investigator");
    return User.updateById(
      id,
      { $push: { researches: data } },
      { new: true, lean: true }
    );
  }

  async create({ data, files }) {
    const existResearch = await User.getOne({ name: data.name });
    if (existResearch) {
      throw new this.ValidationError("Research is already registered");
    }
    if (files && files.image) {
      data.image = (await this.storage.save(files.image))[0];
    }
    const research = await User.create(data);
    return research;
  }

  async parameters(researchId, userId) {
    const user = await User.getById(userId);
    if (!user) {
      throw new this.NotFoundError(`there is no user with id ${userId}`);
    }
    const research = user.researches.find((research) => {
      return research.id.toString() === researchId;
    });
    if (!research) {
      throw new this.NotFoundError(
        `there is no research with id ${researchId}`
      );
    }
    return research;
  }

  async updateInvestigator({ userId, data }) {
    const user = await User.getById(userId);
    if (!user) {
      throw new this.NotFoundError(`there is no user with id ${userId}`);
    }

    for (let i = 0; i < user.researches.length; i++) {
      if (data.researches.id === user.researches[i].id.toString()) {
        user.researches[i] = data.researches;
      }
    }
    return User.updateById(userId, user);
  }

  async updateParameters(userId, data) {
    console.log(data);
    const user = await User.getById(userId);
    if (!user) {
      throw new this.NotFoundError(`there is no user with id ${userId}`);
    }
    data.updated_at = Date.now();
    // data.parameters.status = "In Progress";
    for (let i = 0; i < user.researches.length; i++) {
      if (data.id === user.researches[i].id.toString()) {
        user.researches[i] = data;
      }
    }
    return User.updateById(userId, user, { lean: true, new: true });
  }

  async deleteResearch({ researchId, userId }) {
    const user = await User.getById(userId);
    if (!user) {
      throw new this.NotFoundError(`there is no user with id ${userId}`);
    }
    await Research.updateById(researchId, {
      $pull: { investigators: { $in: [userId] } },
    });
    return User.updateById(userId, {
      $pull: { researches: { id: researchId } },
    });
  }
}

module.exports = new UserService();
