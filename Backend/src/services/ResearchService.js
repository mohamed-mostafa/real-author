const baseService = require("../core/baseService");
const { Research, User, History } = require("../database/mongo/models");

const weights = {
  studyDesign: 0.069,
  monitoring: 0.068,
  submission: 0.067,
  manuscriptDrafting: 0.065,
  fund: 0.064,
  groupHiring: 0.063,
  dataCollection: 0.062,
  studyPlan: 0.061,
  responsibility: 0.059,
  idea: 0.059,
  manuscriptReview: 0.059,
  revising: 0.057,
  citation: 0.056,
  irb: 0.052,
  dataAnalysis: 0.052,
  inquiry: 0.048,
  presentation: 0.04,
};

class ResearchService extends baseService {
  async getAll(filters, params, role, pagination = false) {
    const nParams = params;
    const query = {};

    if (filters.app_status) {
      query.app_status = { $in: filters.app_status.split(",") };
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { abstract: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (role !== "admin") {
      if (!query.$or) {
        query.$or = [];
      }
      query.$or.push({ status: "NEW" });
      query.$or.push({ status: "IN PROGRESS" });
    }

    if (filters.role) {
      query.roles = filters.role;
    }
    if (nParams.pagination) {
      pagination = this.utils.parseBoolean(nParams.pagination);
    }

    nParams.lean = true;
    return Research.getAll(query, nParams, pagination);
  }

  async getOne(id) {
    const research = await Research.getById(id);
    if (!research) {
      throw new this.NotFoundError(`there is no research with id ${id}`);
    }
    return research;
  }

  async getInvestigators(id) {
    const research = await Research.getById(id, {
      lean: true,
      populate: [["investigators", `firstName lastName image researches`]],
    });
    if (!research) {
      throw new this.NotFoundError(`there is no research with id ${id}`);
    }
    const investigators = research.investigators;
    for (const investigator of investigators) {
      investigator.researches = investigator.researches.find(
        (element) => element.id.toString() === id
      );
    }
    return investigators;
  }

  async update({ data, id, files, userName }) {
    const research = await Research.getById(id);
    if (!research) {
      throw new this.NotFoundError(`there is no research with id ${id}`);
    }
    if (files) {
      if (files.image && research.image) {
        await this.storage.delete(research.image);
      }
      if (files.image) data.image = (await this.storage.save(files.image))[0];
    }
    await History.create({
      record: `${userName} updated Research ${research.name}`,
    });
    return Research.updateById(id, data, { new: true, lean: true });
  }

  async calcRank({ researchId, userId }) {
    const research = await Research.getById(researchId, {
      fields: { investigators: 1 },
    });
    if (!research) {
      throw new this.NotFoundError(
        `there is no research with id ${researchId}`
      );
    }

    let investigator = research.investigators.find(
      (element) => element.toString() === userId.toString()
    );
    if (!investigator) {
      throw new this.NotFoundError(`You are not participated in this research`);
    }
    investigator = await User.getOne(
      { _id: userId, "researches.id": researchId },
      { fields: { "researches.$": 1 } }
    );
    const parameters = investigator.researches[0].parameters;
    investigator.researches[0].score = 0;
    for (const prop in parameters) {
      if (typeof parameters[prop] === "number") {
        investigator.researches[0].score +=
          (parameters[prop] / 100) * weights[prop];
      } else {
        if (parameters[prop]) investigator.researches[0].score += weights[prop];
      }
    }
    investigator.researches[0].score =
      Math.round(investigator.researches[0].score * 100) / 100;
    investigator.researches[0].rankStatus = "Accepted";
    if (
      !parameters.responsibility ||
      !parameters.manuscriptReview ||
      !parameters.revising ||
      !parameters.studyPlan
    ) {
      investigator.researches[0].rankStatus = "Rejected";
    }
    return User.updateOne(
      {
        $and: [{ _id: userId }, { "researches.id": researchId }],
      },
      { $set: { "researches.$": investigator.researches[0] } }
    );
  }

  async rank(id) {
    const investigators = await this.getInvestigators(id);
    investigators.sort((a, b) => {
      return b.researches.score - a.researches.score;
    });
    return investigators.filter((element) => {
      return element.researches.parameters.status === "Validate";
    });
  }

  async create({ data, files, userName }) {
    const existResearch = await Research.getOne({ name: data.name });
    if (existResearch) {
      throw new this.ValidationError("Research is already registered");
    }
    if (files && files.image) {
      data.image = (await this.storage.save(files.image))[0];
    }
    data.commonParameters = {};
    const research = await Research.create(data);
    await History.create({
      record: `${userName} added Research ${research.name}`,
    });
    return research;
  }

  async getParameters(researchId) {
    const research = Research.getById(researchId, {
      fields: { commonParameters: 1 },
    });
    if (!research) {
      throw new this.NotFoundError(
        `there is no research with id ${researchId}`
      );
    }
    return research;
  }

  async deleteInvestigator({ researchId, investigatorId }) {
    const research = Research.getById(researchId);
    if (!research) {
      throw new this.NotFoundError(
        `there is no research with id ${researchId}`
      );
    }

    await User.updateById(investigatorId, {
      $pull: { researches: { id: researchId } },
    });

    return Research.updateById(researchId, {
      $pull: { investigators: { $in: [investigatorId] } },
    });
  }
}

module.exports = new ResearchService();
