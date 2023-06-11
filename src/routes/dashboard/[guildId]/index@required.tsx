import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ChannelType } from "discord-api-types/v10";
import {
  Add,
  At,
  BrowsersOutline,
  FileTrayFullOutline,
  FolderOutline,
  Remove,
} from "qwik-ionicons";
import Menu, { MenuCategory, MenuItem, MenuTitle } from "~/components/Menu";
import { Button } from "~/components/elements/Button";
import Card, { CardHeader } from "~/components/elements/Card";
import ColorInput from "~/components/elements/ColorInput";
import SelectInput from "~/components/elements/SelectInput";
import TextInput from "~/components/elements/TextInput";
import type { embedData, guildData } from "~/components/functions/settings";
import { getGuildDataFn, sendEmbedFn, updateSettingFn } from "~/components/functions/settings";

export const useGetGuildData = routeLoader$(
  async (props) => await getGuildDataFn(props)
);

export default component$(() => {
  const guildData = useGetGuildData().value;

  const store = useStore({
    guildData,
    loading: [] as string[],
    ticketEmbed: {
      sendChannel: "",
      title: "Support Ticket",
      description: "To create a ticket click the button below and fill out all valid information",
      color: "#ffffff",
      footer: "",
      thumbnail: "",
      image: "",
      buttonText: "Create Ticket",
    } as embedData,
  });

  if (store.guildData instanceof Error) {
    return (
      <div class="flex flex-col gap-3 items-center justify-center h-full pt-24">
        <h1 class="text-4xl font-bold">Error</h1>
        <p class="text-xl">{(guildData as Error).message}</p>
        <Button onClick$={() => location.reload()} color="danger">
          Reload
        </Button>
      </div>
    );
  }

  const { guild, channels, roles, srvconfig } = store.guildData as guildData;

  useVisibleTask$(() => {
    store.ticketEmbed.sendChannel = channels.filter((c) => c.type == ChannelType.GuildText)[0].id;
  });

  return (
    <section class="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 mx-auto max-w-screen-2xl px-4 sm:px-6 min-h-[calc(100lvh-80px)]">
      <Menu guild={guild} store={store}>
        <MenuCategory name="General">
          <MenuItem href="#joinmessage">
            <Add width="25" class="fill-current" /> Join Message
          </MenuItem>
          <MenuItem href="#leavemessage">
            <Remove width="25" class="fill-current" /> Leave Message
          </MenuItem>
          <MenuItem href="#membercount">
            <FolderOutline width="25" class="fill-current" /> Member Count Channel
          </MenuItem>
          <MenuItem href="#wishlistchannel">
            <FolderOutline width="25" class="fill-current" /> Wishlist Channel
          </MenuItem>
        </MenuCategory>
        <MenuCategory name="Ticket System">
          <MenuItem href="#ticketopencategory">
            <FolderOutline width="24" class="fill-current" /> Open Category
          </MenuItem>
          <MenuItem href="#ticketclosedcategory">
            <FolderOutline width="24" class="fill-current" /> Closed Category
          </MenuItem>
          <MenuItem href="#ticketlogchannel">
            <FileTrayFullOutline width="24" class="fill-current" /> Log Channel
          </MenuItem>
          <MenuItem href="#supportrole">
            <At width="24" class="fill-current" /> Support Role
          </MenuItem>
          <MenuItem href="#ticketmsg">
            <BrowsersOutline width="24" class="fill-current" /> Ticket Embed
          </MenuItem>
        </MenuCategory>
        <MenuCategory name="Level System">
          <MenuItem href="#ticketopencategory">
            <FolderOutline width="24" class="fill-current" /> Open Category
          </MenuItem>
          <MenuItem href="#ticketclosedcategory">
            <FolderOutline width="24" class="fill-current" /> Closed Category
          </MenuItem>
        </MenuCategory>
      </Menu>
      <div class="sm:col-span-2 lg:col-span-3 2x1:col-span-4 pt22 sm:pt-28">
        <MenuTitle>General Settings</MenuTitle>
        <div class="flex flex-wrap gap-4 py-10">
          <Card fit>
            <CardHeader id="joinmessage" loading={store.loading.includes("joinmessage")}>
              <Add width="25" class="fill-current" /> Join Message
            </CardHeader>
            <TextInput big id="joinmessage-message" value={srvconfig?.joinmessage.message} placeholder="The message sent when someone joins the server" onChange$={async (event: any) => {
              store.loading.push("joinmessage");
              srvconfig!.joinmessage.message = event.target.value;
              await updateSettingFn("joinmessage", JSON.stringify(srvconfig?.joinmessage));
              store.loading = store.loading.filter((l) => l != "joinmessage");
            }}
            >
              The message when someone joins the server
            </TextInput>
            <p class="mt-2 mb-4">
              Possible placeholders: <code>{"{USER MENTION}"}</code>{" "}<code>{"{USERNAME}"}</code>
            </p>
            <SelectInput id="joinmessage-channel" label="Channel to send the message in" onChange$={async (event: any) => {
              store.loading.push("joinmessage");
              srvconfig!.joinmessage.channel = event.target.value;
              await updateSettingFn("joinmessage", JSON.stringify(srvconfig?.joinmessage));
              store.loading = store.loading.filter((l) => l != "joinmessage");
            }}
            >
              <option value="false" selected={srvconfig?.joinmessage.channel == "false"}> System Channel </option>
              {channels
                .filter((c) => c.type == ChannelType.GuildText).map((c) => (
                  <option value={c.id} key={c.id} selected={srvconfig?.joinmessage.channel == c.id}>{`# ${c.name}`}</option>
                ))}
            </SelectInput>
          </Card>
          <Card fit>
            <CardHeader id="leavemessage" loading={store.loading.includes("leavemessage")}>
              <Remove width="25" class="fill-current" /> Leave Message
            </CardHeader>
            <TextInput big id="leavemessage-message" value={srvconfig?.leavemessage.message} placeholder="The message sent when someone leaves the server" onChange$={async (event: any) => {
              store.loading.push("leavemessage");
              srvconfig!.leavemessage.message = event.target.value;
              await updateSettingFn("leavemessage", JSON.stringify(srvconfig?.joinmessage));
              store.loading = store.loading.filter((l) => l != "leavemessage");
            }}
            >
              The message when someone leaves the server
            </TextInput>
            <p class="mt-2 mb-4">
              Possible placeholders: <code>{"{USER MENTION}"}</code>{" "}<code>{"{USERNAME}"}</code>
            </p>
            <SelectInput id="leavemessage-channel" label="Channel to send the message in" onChange$={async (event: any) => {
              store.loading.push("leavemessage");
              srvconfig!.leavemessage.channel = event.target.value;
              await updateSettingFn("leavemessage", JSON.stringify(srvconfig?.leavemessage));
              store.loading = store.loading.filter((l) => l != "leavemessage");
            }}
            >
              <option value="false" selected={srvconfig?.leavemessage.channel == "false"}> System Channel </option>
              {channels
                .filter((c) => c.type == ChannelType.GuildText).map((c) => (
                  <option value={c.id} key={c.id} selected={srvconfig?.leavemessage.channel == c.id}>{`# ${c.name}`}</option>
                ))}
            </SelectInput>
          </Card>
          <Card fit>
            <CardHeader id="membercount" loading={store.loading.includes("membercount")}>
              <FolderOutline width="25" class="fill-current" /> Member Count Channel
            </CardHeader>
            <SelectInput id="membercount-input" label="The channel to use as a member count" onChange$={async (event: any) => {
              store.loading.push("membercount");
              await updateSettingFn("membercountchannel", event.target.value);
              store.loading = store.loading.filter((l) => l != "membercount");
            }}
            >
              <option value="false" selected={srvconfig!.membercountchannel == "false"}> None </option>
              {channels.map((c) => (
                <option value={c.id} key={c.id} selected={srvconfig!.membercountchannel == c.id}>{`- ${c.name}`}</option>
              ))}
            </SelectInput>
          </Card>
          <Card fit>
            <CardHeader id="wishlistchannel" loading={store.loading.includes("wishlistchannel")}>
              <FolderOutline width="25" class="fill-current" /> Wishlist Channel
            </CardHeader>
            <SelectInput id="wishlistchannel-input" label="The channel to use as a member count" onChange$={async (event: any) => {
              store.loading.push("wishlistchannel");
              await updateSettingFn("wishlistchannel", event.target.value);
              store.loading = store.loading.filter((l) => l != "wishlistchannel");
            }}
            >
              <option value="false" selected={srvconfig!.wishlistchannel == "false"}> None </option>
              {channels
                .filter((c) => c.type == ChannelType.GuildText).map((c) => (
                  <option value={c.id} key={c.id} selected={srvconfig!.wishlistchannel == c.id}>{`- ${c.name}`}</option>
                ))}
            </SelectInput>
          </Card>
        </div>
        <MenuTitle>Ticket System</MenuTitle>
        <div class="flex flex-wrap gap-4 py-10">
          <Card fit>
            <CardHeader id="ticketopencategory" loading={store.loading.includes("ticketopencategory")}>
              <FolderOutline width="25" class="fill-current" /> Open Ticket Category
            </CardHeader>
            <SelectInput id="ticketopencategory-input" label="The category open tickets will be in" onChange$={async (event: any) => {
              store.loading.push("ticketopencategory");
              srvconfig!.ticketdata.categories.open = event.target.value;
              await updateSettingFn("ticketdata", JSON.stringify(srvconfig?.ticketdata));
              store.loading = store.loading.filter((l) => l != "ticketopencategory");
            }}
            >
              <option value="false" selected={srvconfig!.ticketdata.categories.open == "false"}> None </option>
              {channels
                .filter((c) => c.type == ChannelType.GuildCategory).map((c) => (
                  <option value={c.id} key={c.id} selected={srvconfig!.ticketdata.categories.open == c.id}>{`- ${c.name}`}</option>
                ))}
            </SelectInput>
          </Card>
          <Card fit>
            <CardHeader id="ticketclosecategory" loading={store.loading.includes("ticketclosecategory")}>
              <FolderOutline width="25" class="fill-current" /> Closed Ticket Category
            </CardHeader>
            <SelectInput id="ticketclosecategory-input" label="The category closed tickets will be in" onChange$={async (event: any) => {
              store.loading.push("ticketclosecategory");
              srvconfig!.ticketdata.categories.closed = event.target.value;
              await updateSettingFn("ticketdata", JSON.stringify(srvconfig?.ticketdata));
              store.loading = store.loading.filter((l) => l != "ticketclosecategory");
            }}
            >
              <option value="false" selected={srvconfig!.ticketdata.categories.closed == "false"}> None </option>
              {channels
                .filter((c) => c.type == ChannelType.GuildCategory).map((c) => (
                  <option value={c.id} key={c.id} selected={srvconfig!.ticketdata.categories.closed == c.id}>{`- ${c.name}`}</option>
                ))}
            </SelectInput>
          </Card>
          <Card fit>
            <CardHeader id="ticketlogchannel" loading={store.loading.includes("ticketlogchannel")}>
              <FileTrayFullOutline width="25" class="fill-current" /> Ticket Log Channel
            </CardHeader>
            <SelectInput id="ticketlogchannel-input" label="The channel all ticket events will be logged to" onChange$={async (event: any) => {
              store.loading.push("ticketlogchannel");
              srvconfig!.ticketdata.logChannel = event.target.value;
              await updateSettingFn("ticketdata", JSON.stringify(srvconfig?.ticketdata));
              store.loading = store.loading.filter((l) => l != "ticketlogchannel");
            }}
            >
              <option value="false" selected={srvconfig!.ticketdata.logChannel == "false"}> None </option>
              {channels
                .filter((c) => c.type == ChannelType.GuildText).map((c) => (
                  <option value={c.id} key={c.id} selected={srvconfig!.ticketdata.logChannel == c.id}>{`# ${c.name}`}</option>
                ))}
            </SelectInput>
          </Card>
          <Card fit>
            <CardHeader id="supportrole" loading={store.loading.includes("supportrole")}>
              <FileTrayFullOutline width="25" class="fill-current" /> Support Role
            </CardHeader>
            <SelectInput id="supportrole-input" label="The channel all ticket events will be logged to" onChange$={async (event: any) => {
              store.loading.push("supportrole");
              srvconfig!.ticketdata.supportRole = event.target.value;
              await updateSettingFn("ticketdata", JSON.stringify(srvconfig?.ticketdata));
              event.target.style.color = event.target.options[event.target.selectedIndex].style.color;
              store.loading = store.loading.filter((l) => l != "supportrole");
            }} style={{
              color: '#' + (roles.find(r => r.id == srvconfig?.ticketdata.supportRole)?.color ? roles.find(r => r.id == srvconfig?.ticketdata.supportRole)?.color.toString(16) : 'ffffff')
            }}
            >
              <option value="false" selected={srvconfig?.ticketdata.supportRole == "false"} style={{ color: '#ffffff' }}> Only Admins </option>
              {roles.map(r =>
                <option value={r.id} key={r.id} selected={srvconfig?.ticketdata.supportRole == r.id} style={{ color: '#' + (r.color ? r.color.toString(16) : 'ffffff') }}>{`@ ${r.name}`}</option>
              )}
            </SelectInput>
          </Card>
          <Card fit>
            <CardHeader id="ticketmsg" loading={store.loading.includes("ticketmsg")}>
              <BrowsersOutline width="25" class="fill-current" /> Ticket Embed
            </CardHeader>
            <SelectInput id="ticketmsg-channel" value={store.ticketEmbed.sendChannel} label="The channel to send the embed" onChange$={async (event: any) => {
              store.loading.push("ticketmsg");
              store.ticketEmbed.sendChannel = event.target.value;
              store.loading = store.loading.filter((l) => l != "ticketmsg");
            }}
            >
              {channels
                .filter((c) => c.type == ChannelType.GuildText).map((c) => (
                  <option value={c.id} key={c.id} selected={srvconfig!.ticketdata.categories.closed == c.id}>{`- ${c.name}`}</option>
                ))}
            </SelectInput>
            <TextInput id="ticketmsg-title" value={store.ticketEmbed.title} placeholder="The title of the embed" onChange$={async (event: any) => {
              store.loading.push("ticketmsg");
              store.ticketEmbed.title = event.target.value;
              store.loading = store.loading.filter((l) => l != "ticketmsg");
            }}
            >
              Embed Title
            </TextInput>
            <TextInput big id="ticketmsg-description" value={store.ticketEmbed.description} placeholder="The description of the embed" onChange$={async (event: any) => {
              store.loading.push("ticketmsg");
              store.ticketEmbed.description = event.target.value;
              store.loading = store.loading.filter((l) => l != "ticketmsg");
            }}
            >
              Embed Title
            </TextInput>
            <ColorInput key="ticketmsg-color" id="ticketmsg-color" value={store.ticketEmbed.color} onInput$={(color: string) => store.ticketEmbed.color = color}>
              Embed Color
            </ColorInput>
            <TextInput id="ticketmsg-footer" placeholder="The footer of the embed" onChange$={async (event: any) => {
              store.loading.push("ticketmsg");
              store.ticketEmbed.footer = event.target.value;
              store.loading = store.loading.filter((l) => l != "ticketmsg");
            }}
            >
              Embed Footer
            </TextInput>
            <TextInput id="ticketmsg-thumbnail" placeholder="The thumbnail of the embed" onChange$={async (event: any) => {
              store.loading.push("ticketmsg");
              store.ticketEmbed.thumbnail = event.target.value;
              store.loading = store.loading.filter((l) => l != "ticketmsg");
            }}
            >
              Embed Thumbnail
            </TextInput>
            <TextInput id="ticketmsg-image" placeholder="The image of the embed" onChange$={async (event: any) => {
              store.loading.push("ticketmsg");
              store.ticketEmbed.image = event.target.value;
              store.loading = store.loading.filter((l) => l != "ticketmsg");
            }}
            >
              Embed Image
            </TextInput>
            <TextInput id="ticketmsg-buttonText" value={store.ticketEmbed.buttonText} placeholder="The text of the ticket create button" onChange$={async (event: any) => {
              store.loading.push("ticketmsg");
              store.ticketEmbed.buttonText = event.target.value;
              store.loading = store.loading.filter((l) => l != "ticketmsg");
            }}
            >
              Button Text
            </TextInput>
            <Button onClick$={async () => {
              store.loading.push("ticketmsgcreate");
              await sendEmbedFn(store.ticketEmbed);
              store.loading = store.loading.filter((l) => l != "ticketmsgcreate");
            }}
            >
              Send
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Dashboard",
  meta: [
    {
      name: "description",
      content: "Basement Bot Dashboard",
    },
    {
      property: "og:description",
      content: "Basement Bot Dashboard",
    },
  ],
};