import {
  ButtonInteraction,
  CacheType,
  CollectorFilter,
  ComponentType,
  InteractionCollector,
  InteractionResponse,
} from "discord.js";

export function createCollector(
  reply: InteractionResponse<boolean>,
  time: number,
  onCollect: (
    i: ButtonInteraction,
    collector: InteractionCollector<ButtonInteraction<CacheType>>,
  ) => void,
  onEnd: (reason: string) => void,
  filter?: CollectorFilter<[ButtonInteraction<CacheType>]>,
) {
  const collector = reply.createMessageComponentCollector({
    ...(filter && { filter }),
    time,
    componentType: ComponentType.Button,
  });

  collector.on("collect", (i) => onCollect(i, collector));

  collector.on("end", (_, reason) => onEnd(reason));

  return collector;
}
