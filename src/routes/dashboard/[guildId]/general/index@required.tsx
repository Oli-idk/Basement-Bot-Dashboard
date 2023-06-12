import { component$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ChannelType } from "discord-api-types/v10";
import {
  FolderOutline,
} from "qwik-ionicons";
import { MenuTitle } from "~/components/Menu";
import { Button } from "~/components/elements/Button";
import Card, { CardHeader } from "~/components/elements/Card";
import SelectInput from "~/components/elements/SelectInput";
import SettingsMenu from "~/components/elements/SettingsMenu";
import type { guildData } from "~/components/functions/guildData";
import { updateSettingFn } from "~/components/functions/guildData";
import { useGetGuildData } from "~/routes/layout-required";

export default component$(() => {
  const guildData = useGetGuildData().value;
  const store = useStore({
    guildData,
    loading: [] as string[],
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

  const { guild, channels, srvconfig } = store.guildData as guildData;

  return (
    <section class="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 mx-auto max-w-screen-2xl px-4 sm:px-6 min-h-[calc(100lvh-80px)]">
      <SettingsMenu guild={guild} store={store} />
      <div class="sm:col-span-2 lg:col-span-3 2x1:col-span-4 pt22 sm:pt-28">
        <MenuTitle>General Settings</MenuTitle>
        <div class="flex flex-wrap gap-4 py-10">
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