import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  name: string;
  avatar: string;
  levels: {
    [key: string]: number;
  };
  warnings: {
    date: string;
    reason: string;
  }[];
  achievements: { name: string; role: string }[];
  rank: number;
  save: () => void;
}

const levelsSchema = new Schema({
  english: Number,
  help: Number,
  active: Number,
});

const warningSchema = new Schema({
  date: String,
  reason: String,
});

const achievementsSchema = new Schema({
  name: String,
  role: String,
});

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  levels: {
    type: levelsSchema,
    default: {
      english: 0,
      help: 0,
      active: 0,
    },
  },
  achievements: {
    type: [achievementsSchema],
    default: [],
  },
  warnings: {
    type: [warningSchema],
    default: [],
  },
  rank: {
    type: Number,
    default: 0,
  },
});

export default model("User", userSchema);
