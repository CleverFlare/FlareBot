import { formatList } from "@/utils/format-list";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  CollectorFilter,
  ComponentType,
  EmbedBuilder,
  InteractionReplyOptions,
  InteractionResponse,
  MessagePayload,
} from "discord.js";
import { client } from "..";

export type Dependencies = {
  interaction: ChatInputCommandInteraction;
  onAccept?: (i: ButtonInteraction) => void;
  onReject?: (i: ButtonInteraction) => void;
  onTimeout?: () => void;
  embeds: {
    confirmation: EmbedBuilder;
    rejection?: EmbedBuilder;
    timeout?: EmbedBuilder;
  };
  buttons: {
    accept: ButtonBuilder;
    reject: ButtonBuilder;
  };
  allowedUsers?: string[];
  filter?: CollectorFilter<[ButtonInteraction<CacheType>]>;
  time?: number;
  allowedUserReplyOptions?: string | MessagePayload | InteractionReplyOptions;
};

export type ReturnType = Promise<{
  type: "accept" | "reject" | "timeout";
  reply: InteractionResponse<boolean>;
}>;

export function handleConfirmation({
  interaction,
  onAccept = () => null,
  onReject = () => null,
  onTimeout = () => null,
  embeds,
  buttons,
  allowedUsers = [],
  filter,
  time = 30_000,
  allowedUserReplyOptions,
}: Dependencies): ReturnType {
  return new Promise(async (_return) => {
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
      buttons.accept.setCustomId("accept"),
      buttons.reject.setCustomId("reject"),
    ]);

    const reply = await interaction.reply({
      embeds: [embeds.confirmation],
      components: [actionRow],
    });

    let deleted: boolean = false;

    const collector = reply.createMessageComponentCollector({
      ...(filter ?? { filter }),
      time,
      componentType: ComponentType.Button,
      dispose: true,
    });

    client.on("messageDelete", (deletedMessage) => {
      if (deletedMessage.id === reply.id) deleted = true;
    });

    collector.on("collect", async (i) => {
      if (!allowedUsers.includes(i.user.id)) {
        const allowedUsersMentions = allowedUsers.map(
          (userId) => `<@${userId}>`,
        );

        const plural = allowedUsers.length > 1;

        const formattedAllowedUsersmentions = formatList(
          allowedUsersMentions,
          "disjuction",
        );

        i.reply(
          allowedUserReplyOptions ?? {
            content: `Only ${formattedAllowedUsersmentions} ${plural ? "are" : "is"} allowed to interact with this confirmation message.`,
            ephemeral: true,
          },
        );

        return;
      }

      if (i.customId === "accept") {
        await i.deferUpdate();

        _return({
          type: "accept",
          reply,
        });
        onAccept(i);
      }

      if (i.customId === "reject") {
        _return({
          type: "reject",
          reply,
        });

        if (embeds.rejection)
          reply.edit({
            embeds: [embeds.rejection],
            components: [],
          });

        onReject(i);
      }
    });

    collector.on("end", (_, reason) => {
      _return({
        type: "timeout",
        reply,
      });

      if (embeds.timeout && reason === "time")
        reply.edit({
          embeds: [embeds.timeout],
          components: [],
        });

      onTimeout();
    });
  });
}
