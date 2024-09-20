import { constructGridFromBinary } from "./utils/construct-grid-from-binary";
import { createChoicesButtons } from "./utils/create-buttons-from-binary";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

type DataType = string;

export class UI {
  constructor(
    public interaction: ChatInputCommandInteraction,
    public data: DataType[] = [],
  ) {
    this.dataEmbed = new EmbedBuilder()
      .setTitle("Tic Tac Toe Game")
      .setColor("Blue")
      .setDescription(this.data.join("\n"));

    this.gridEmbed = new EmbedBuilder().setColor("Blue");
    this.setGrid(0b000000000, 0b000000000);

    interaction.reply({
      embeds: [this.dataEmbed, this.gridEmbed],
      components: this.actionRows,
      fetchReply: true,
    });

    this.update();
  }

  private dataEmbed: EmbedBuilder;
  setData(data: DataType[]) {
    this.data = data;
    this.dataEmbed.setDescription(this.data.join("\n"));

    this.update();
  }

  private gridEmbed: EmbedBuilder;
  grid = "";
  setGrid(playerMovesInBinary: number, opponentMovesInBinary: number) {
    this.grid = constructGridFromBinary(
      playerMovesInBinary,
      opponentMovesInBinary,
    );

    this.gridEmbed.setDescription(this.grid);

    this.update();
  }

  private buttons = createChoicesButtons();

  readonly actionRows = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      this.buttons.slice(0, 3),
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      this.buttons.slice(3, 6),
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      this.buttons.slice(6, 9),
    ),
  ];

  gameOver: boolean = false;

  async update(options?: { hideButtons?: boolean; disableButtons?: boolean }) {
    if (options?.disableButtons !== undefined) {
      this.buttons.forEach((button) =>
        button.setDisabled(options.disableButtons),
      );
    }

    const components =
      options?.hideButtons !== undefined && options?.hideButtons
        ? []
        : this.actionRows;

    await this.interaction.editReply({
      embeds: [this.dataEmbed, this.gridEmbed],
      components,
    });
  }
}

export default function initialize(
  interaction: ChatInputCommandInteraction,
  data: DataType[] = [],
) {
  return new UI(interaction, data);
}
