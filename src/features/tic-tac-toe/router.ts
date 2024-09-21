import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  ComponentType,
  InteractionReplyOptions,
  MessagePayload,
} from "discord.js";
import EventEmitter from "events";

export type ReplyType = MessagePayload | InteractionReplyOptions | string;

export type RouteReturnedType = {
  reply: ReplyType;
  buttonEvents?: {
    customId: string;
    handler: (i: ButtonInteraction) => void;
  }[];
};

export type Route = (
  interaction: ChatInputCommandInteraction,
  client: Client,
) => RouteReturnedType;

type Routes = Record<string, Route>;

interface Config<T> {
  initialRoute: T;
  routes: Routes;
  interaction: ChatInputCommandInteraction;
}

export class Router extends EventEmitter {
  initialRoute: string | null = null;
  routes: Routes = {};
  currentRoute: string = "";

  constructor() {
    super();
  }

  async createRouter<T extends object>(config: Config<keyof T>) {
    this.routes = config.routes;
    this.initialRoute = config.initialRoute as string;

    const reply = await config.interaction.reply(
      this.routes[this.initialRoute!](config.interaction).reply,
    );

    this.currentRoute = this.initialRoute;

    this.on("navigate", (screen: keyof typeof this.routes) => {
      reply.edit(this.routes[screen](config.interaction).reply);
      this.currentRoute = screen;
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    collector.on("collect", (i) => {
      const buttonEvents = this.routes?.[this.currentRoute]?.(
        config.interaction,
      )?.buttonEvents;

      if (!buttonEvents) return;

      for (const buttonEvent of buttonEvents) {
        if (i.customId === buttonEvent.customId) buttonEvent.handler(i);
      }
    });
  }

  navigate<T extends object>(screen: keyof T) {
    this.emit("navigate", screen);
  }
}
