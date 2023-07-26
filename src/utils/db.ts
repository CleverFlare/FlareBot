import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import User from "../models/User";

interface IEmptyUser {
  username: string;
  displayName: string;
  avatar: string;
}

export async function createAnEmptyUser({
  username,
  displayName,
  avatar,
}: IEmptyUser) {
  return await User.create({
    username: username,
    name: displayName,
    avatar: avatar,
  });
}
