import { readFile } from "fs/promises";
import { join } from "path";

export type ChatMessage = {
  role: "user" | "system" | "assistant" | "tool";
  content: string;
};

class Messages {
  readonly messages: ChatMessage[] = [];

  constructor() {
    readFile(join(__dirname, "../system.txt"))
      .then((data) => data.toString())
      .then((system) => {
        this.messages.push({
          role: "system",
          content: system,
        });
      });
  }

  userSend(userId: string, message: string, messageId: string) {
    this.messages.push({
      role: "system",
      content: `The ID of the next message is ${messageId}. The ID of the user who will send the next message is ${userId}`,
    });
    this.messages.push({
      role: "user",
      content: message,
    });
  }

  assistantSend(message: string, messageId: string) {
    this.messages.push({
      role: "system",
      content: `The ID of the next message is ${messageId}. The next message is yours.`,
    });
    this.messages.push({
      role: "assistant",
      content: message,
    });
  }

  userReply(
    userId: string,
    message: string,
    messageId: string,
    replyMessageId: string,
  ) {
    this.messages.push({
      role: "system",
      content: `The ID of the next message is ${messageId}. The ID of the user who will send the next message is ${userId}. The next message is a reply to a previous response of yours with message ID of ${replyMessageId}`,
    });
    this.messages.push({
      role: "user",
      content: message,
    });
  }
}

const messages = new Messages();

export default messages;
