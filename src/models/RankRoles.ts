import { Role } from "discord.js";
import { Schema, model } from "mongoose";

export interface IRankRoles {
  rank: string;
  role: Role;
}

const RankRolesSchema = new Schema({
  rank: String,
  role: Object,
});

export default model("RankRoles", RankRolesSchema);
