import { Role } from "discord.js";
import { Schema, model } from "mongoose";

export interface IRanksRoles {
  rank: string;
  role: Role;
}

const RanksRolesSchema = new Schema({
  rank: String,
  role: Object,
});

export default model("RanksRoles", RanksRolesSchema);
