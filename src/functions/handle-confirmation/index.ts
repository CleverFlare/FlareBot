import { formatList } from "@/utils/format-list";
import {
  ButtonBuilder,
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  CollectorFilter,
  EmbedBuilder,
  InteractionCollector,
  InteractionReplyOptions,
  InteractionResponse,
  MessagePayload,
} from "discord.js";
import { sendInitialReply } from "./components/send-initial-reply";
import { handleButtonClick } from "./components/handle-button-click";
import { createCollector } from "./components/create-collector";

export type Dependencies = {
  interaction: ChatInputCommandInteraction;
  onAccept?: (i: ButtonInteraction) => void;
  onReject?: (i: ButtonInteraction) => void;
  onTimeout?: () => void;
  message?: string;
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
  message,
  embeds,
  buttons,
  allowedUsers = [],
  filter,
  time = 30_000,
  allowedUserReplyOptions,
}: Dependencies): ReturnType {
  return new Promise(async (_return) => {
    const reply = await sendInitialReply(
      interaction,
      [embeds.confirmation],
      [
        buttons.accept.setCustomId("accept"),
        buttons.reject.setCustomId("reject"),
      ],
      message,
    );

    const onCollect = async (
      i: ButtonInteraction,
      collector: InteractionCollector<ButtonInteraction<CacheType>>,
    ) => {
      const isAllowedToInteract = handleButtonClick(
        i,
        allowedUsers,
        (allowedUsersMentions) =>
          formatList(allowedUsersMentions, "disjuction"),
        allowedUserReplyOptions,
      );

      if (!isAllowedToInteract) return;

      if (i.customId === "accept") {
        onAccept(i);
        collector.stop("accept");
        await i.deferUpdate();
      }

      if (i.customId === "reject") {
        onReject(i);
        collector.stop("reject");

        if (!embeds.rejection) await i.deferUpdate();
      }
    };

    const onEnd = (reason: string) => {
      switch (reason) {
        case "accept":
          _return({
            type: "accept",
            reply,
          });
          break;
        case "reject":
          _return({
            type: "reject",
            reply,
          });

          if (embeds.rejection)
            reply.edit({
              embeds: [embeds.rejection],
              components: [],
            });
          break;
        case "timeout":
          _return({
            type: "timeout",
            reply,
          });

          if (embeds.timeout)
            reply.edit({
              embeds: [embeds.timeout],
              components: [],
            });

          onTimeout();
          break;
      }
    };

    createCollector(reply, time, onCollect, onEnd, filter);
  });
}
