const aclResources = {
  AUTHENTICATION: "authentication",
  RESEARCH: "research",
  USER: "user",
  HISTORY: "history",
};

const roles = {
  admin: "admin",
  user: "user",
};

const rolesEnum = ["admin", "user"];

const aclRoles = {
  admin: {
    [aclResources.RESEARCH]: {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
    },
    [aclResources.USER]: {
      "read:any": ["*"],
      "read:own": ["*"],
      "update:own": ["*"],
      "update:any": ["*"],
    },
    [aclResources.HISTORY]: {
      "read:any": ["*"],
      "create:any": ["*"],
    },
  },
  user: {
    [aclResources.RESEARCH]: {
      "read:any": ["*"],
      "update:any": ["*"],
    },
    [aclResources.USER]: {
      "read:any": ["*"],
      "read:own": ["*"],
      "update:own": ["*"],
      "update:any": ["*"],
    },
    [aclResources.HISTORY]: {
      "read:any": ["*"],
      "create:any": ["*"],
    },
  },
  public: {
    [aclResources.AUTHENTICATION]: { "create:any": ["*"] },
  },
};

module.exports = {
  aclResources,
  aclRoles,
  rolesEnum,
  roles,
};
