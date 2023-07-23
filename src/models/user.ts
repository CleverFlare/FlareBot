import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  name: string;
  avatar: string;
  levels: {
    english: number;
    help: number;
    active: number;
  };
  rank: number;
}

const levelsSchema = new Schema({
  english: Number,
  help: Number,
  active: Number,
});

const userSchema = new Schema<IUser>({
  username: String,
  name: String,
  avatar: String,
  levels: levelsSchema,
  rank: Number,
});

export default model("User", userSchema);
