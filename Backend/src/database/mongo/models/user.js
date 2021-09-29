const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const { rolesEnum } = require("../../../core/authorization/accessList");

const parameterSchema = new Schema({
  studyDesign: { type: Boolean, default: false },
  monitoring: { type: Boolean, default: false },
  submission: { type: Boolean, default: false },
  manuscriptDrafting: { type: Number, default: 0, min: 0, max: 0 },
  fund: { type: Number, default: 0, min: 0, max: 0 },
  groupHiring: { type: Boolean },
  dataCollection: { type: Number, default: 0, min: 0, max: 0 },
  studyPlan: { type: Number, default: 0, min: 0, max: 0 },
  idea: { type: Boolean, default: false },
  manuscriptReview: { type: Number, default: 0, min: 0, max: 0 },
  revising: { type: Number, default: 0, min: 0, max: 0 },
  citation: { type: Number, default: 0, min: 0, max: 0 },
  irb: { type: Boolean, default: false },
  responsibility: { type: Number, default: 0, min: 0, max: 0 },
  dataAnalysis: { type: Boolean, default: false },
  inquiry: { type: Boolean, default: false },
  presentation: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["New", "In Progress", "Validate", "Pending Validation"],
    default: "New",
    trim: true,
  },
});
const researchSchema = new Schema({
  id: { type: Types.ObjectId, ref: "Research", trim: true },
  score: { type: Number, trim: true, default: 0 },
  updated_at: { type: Date, default: Date.now() },
  roles: [
    {
      type: String,
      trim: true,
      enum: ["admin", "investigator"],
    },
  ],
  status: {
    type: String,
    enum: ["Approved", "Pending", "Declined"],
    default: "Pending",
    trim: true,
  },
  canShowResult: {
    type: String,
    enum: ["Approved", "Pending", "Declined"],
    default: "Pending",
    trim: true,
  },
  rankStatus: {
    type: String,
    enum: ["Accepted", "Rejected"],
    trim: true,
  },
  parameters: parameterSchema,
});

const userSchema = new Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  image: { type: String, trim: true },
  title: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  mobile: { type: String, trim: true },
  is_email_verified: { type: Boolean, default: false },
  password: { type: String },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zip: { type: String, trim: true },
  address: { type: String, trim: true },
  address2: { type: String, trim: true },
  roles: [{ type: String, enum: rolesEnum }],
  appStatus: {
    type: String,
    enum: ["Approved", "Pending", "Declined"],
    default: "Pending",
    trim: true,
  },
  researches: [researchSchema],
});

module.exports = mongoose.model("User", userSchema);
