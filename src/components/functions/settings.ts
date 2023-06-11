import type { RequestEventBase } from "@builder.io/qwik-city";
import { server$ } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";
import type { APIGuild, APIRole, APIGuildChannel, ChannelType, RESTError, RESTRateLimit } from "discord-api-types/v10";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface Guild extends APIGuild {
  id: string;
  mutual: boolean;
}

export interface guildData {
  guild: Guild;
  channels: APIGuildChannel<ChannelType>[];
  roles: APIRole[];
  srvconfig: settings | null;
}

export interface settings {
  guildId: string;
  leavemessage: {
    message: string;
    channel: string;
  };
  joinmessage: {
    message: string;
    channel: string;
  };
  ticketdata: {
    logChannel: string;
    categories: {
      open: string;
      closed: string;
    }
    supportRole: string;
    message: string;
    transcripts: string;
  }
  membercountchannel: string;
  wishlistchannel: string;
  ticketId: number;
}

export interface embedData {
  sendChannel: string;
  title: string;
  description: string;
  color: string;
  footer: string;
  thumbnail: string;
  image: string;
  buttonText: string;
}

export type AnyGuildChannel = APIGuildChannel<ChannelType>;

export const sendEmbedFn: any = server$(async function (embedData: embedData) {
  const res = await fetch(`https://discord.com/api/v10/channels/${embedData.sendChannel}/messages`, {
    method: "POST",
    headers: {
      authorization: `Bot ${this.env.get("BOT_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [
        {
          title: embedData.title ?? undefined,
          description: embedData.description ?? undefined,
          color: parseInt(embedData.color.replace("#", ""), 16) ?? undefined,
          footer: {
            text: embedData.footer ?? undefined,
          },
          thumbnail: {
            url: embedData.thumbnail ?? undefined,
          },
          image: {
            url: embedData.image ?? undefined,
          },
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: embedData.buttonText ? embedData.buttonText : "Create Ticket",
              custom_id: "ticket_create",
            },
          ],
        },
      ],
    }),
  }).catch(() => null);

  if (!res) throw new Error(`Failed to send embed`);

  const data: RESTError | RESTRateLimit | any = await res.json();
  if ("retry_after" in data) {
    console.log(`${data.message}, retrying after ${data.retry_after * 1000}ms`);
    await sleep(data.retry_after * 1000);
    return await sendEmbedFn(embedData);
  }
  if ("code" in data) throw new Error(`Send embed error ${data.code}`);
});

const prisma = new PrismaClient();

export const getGuildDataFn = server$(async function (props: RequestEventBase): Promise<guildData | Error> {
  const guildId = props.params.guildId;
  try {
    const [guild, channels, roles, srvconfig] = await Promise.all([
      fetchData(`https://discord.com/api/v10/guilds/${guildId}`, props),
      fetchData(`https://discord.com/api/v10/guilds/${guildId}/channels`, props),
      fetchData(`https://discord.com/api/v10/guilds/${guildId}/roles`, props),
      prisma.settings.findUnique({ where: { guildId } }),
    ]);

    channels.sort((a: { position: number }, b: { position: number }) => a.position - b.position);
    roles.sort((a: { position: number }, b: { position: number }) => b.position - a.position);

    const parsedSrvConfig = srvconfig
      ? {
          ...srvconfig,
          joinmessage: JSON.parse(srvconfig.joinmessage),
          leavemessage: JSON.parse(srvconfig.leavemessage),
          wishlistchannel: JSON.parse(srvconfig.wishlistchannel),
          membercountchannel: JSON.parse(srvconfig.membercountchannel),
          ticketdata: JSON.parse(srvconfig.ticketdata),
        }
      : null;

    return { guild, channels, roles, srvconfig: parsedSrvConfig };
  } catch (error: any) {
    return new Error(`Failed to fetch guild data: ${error.message}`);
  }
});

export const updateSettingFn = server$(async function (
  name: string,
  value: string | number | boolean | null | undefined
) {
  const guildId = this.params.guildId;
  try {
    await prisma.settings.update({
      where: { guildId },
      data: { [name]: value },
    });
  } catch (error: any) {
    throw new Error(`Failed to update setting: ${error.message}`);
  }
});

async function fetchData(url: string, props: RequestEventBase): Promise<any> {
  const res = await fetch(url, {
    headers: {
      authorization: `Bot ${props.env.get("BOT_TOKEN")}`,
    },
  }).catch(() => null);

  if (!res) throw new Error(`Fetch failed for ${url}`);

  const data: RESTError | RESTRateLimit | any = await res.json();
  if ("retry_after" in data) {
    console.log(`${data.message}, retrying after ${data.retry_after * 1000}ms`);
    await sleep(data.retry_after * 1000);
    return await fetchData(url, props);
  }
  if ("code" in data) throw new Error(`${url} error ${data.code}`);

  return data;
}
