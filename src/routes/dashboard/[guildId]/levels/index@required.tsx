import { component$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TrashOutline } from "qwik-ionicons";
import { Button } from "~/components/elements/Button";
import Card, { CardHeader } from "~/components/elements/Card";
import NumberInput from "~/components/elements/NumberInput";
import SelectInput from "~/components/elements/SelectInput";
import SettingsMenu from "~/components/elements/SettingsMenu";
import TextInput from "~/components/elements/TextInput";
import { updateLevelRewardFn, type guildData, deleteLevelRewardFn } from "~/components/functions/guildData";
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

  const { guild, level_rewards, roles } = store.guildData as guildData;

  return (
    <section class="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 mx-auto max-w-screen-2xl px-4 sm:px-6 min-h-[calc(100lvh-80px)]">
      <SettingsMenu guild={guild} store={store} />
      <div class="sm:col-span-2 lg:col-span-3 2x1:col-span-4 pt22 sm:pt-28">
        <div class="flex flex-col gap-4 py-10">
          <Card fit>
            <Button onClick$={() => {
              const modal = document.getElementById("levelrewardcreate") as HTMLDialogElement;
              modal.showModal();
            }}>
              Create Level Reward
            </Button>
            {
              level_rewards.map((lr) => (
                <Card key={lr.role}>
                  <CardHeader>
                    Level: {lr.level}
                  </CardHeader>
                  <CardHeader>
                    Role:
                    <h1 style={{ color: '#' + (lr.role ? roles.find(r => r.id === lr.role) ? roles.find(r => r.id === lr.role)?.color.toString(16) : 'ffffff' : 'ffffff') }}>
                      {lr.role ? `@${roles.find(r => r.id === lr.role)?.name}` : "None"}
                    </h1>
                  </CardHeader>
                  <CardHeader>
                    Message:
                  </CardHeader>
                  <TextInput big disabled value={lr.message} />
                  <TrashOutline width="24" class="fill-red-400 text-redd-400 cursor-pointer hidden sm:flex" onClick$={async () => {
                    await deleteLevelRewardFn(lr.level)
                    store.guildData = {
                      ...store.guildData,
                      level_rewards: [
                        ...(store.guildData as guildData).level_rewards.filter(l => l.level !== lr.level),
                      ]
                    }
                  }}
                  />
                </Card>
              ))
            }
          </Card>
        </div>
      </div>
      <dialog id="levelrewardcreate" class="bg-transparent text-gray-300">
        <Card fit>
          <NumberInput input min={1} value={5} id="levelrewardlevel-input"
            onIncrement$={() => {
              const elm = document.getElementById("levelrewardlevel-input") as HTMLInputElement;
              elm.value = (parseInt(elm.value) + 1).toString();
            }}
            onDecrement$={() => {
              const elm = document.getElementById("levelrewardlevel-input") as HTMLInputElement;
              if (parseInt(elm.value) - 1 < 1) return;
              elm.value = (parseInt(elm.value) - 1).toString();
            }}
          >
            The level the user has to reach to get the reward
          </NumberInput>
          <SelectInput id="levelrewardrole-input" label="The role to give the user" onChange$={async (event: any) => {
            event.target.style.color = event.target.options[event.target.selectedIndex].style.color;
          }}
          >
            <option value="false" >None</option>
            {roles.map(r =>
              <option value={r.id} key={r.id} style={{ color: '#' + (r.color ? r.color.toString(16) : 'ffffff') }}>{`@ ${r.name}`}</option>
            )}
          </SelectInput>
          <TextInput big id="levelrewardmessage-message" placeholder="The message sent when someone joins the server">
            The message when someone joins the server
          </TextInput>
          <p class="mt-2 mb-4">
            Possible placeholders: <code>{"{USER MENTION}"}</code> <code>{"{USERNAME}"}</code> <code>{"{SERVER NAME}"}</code> <code>{"{LEVEL}"}</code>
          </p>
          <div class="flex gap-4 py-10">
            <Button color="primary" onClick$={async () => {
              const level = (document.getElementById("levelrewardlevel-input") as HTMLInputElement).value;
              const role = (document.getElementById("levelrewardrole-input") as HTMLSelectElement).value;
              const message = (document.getElementById("levelrewardmessage-message") as HTMLInputElement).value;
              store.loading.push("level_rewards");
              await updateLevelRewardFn({
                level: parseInt(level),
                role: role,
                message,
                guildId: guild.id,
              })
              store.guildData = {
                ...store.guildData,
                level_rewards: [
                  ...(store.guildData as guildData).level_rewards,
                  {
                    level: parseInt(level),
                    role: role,
                    message,
                    guildId: guild.id,
                  }
                ]
              }
              console.log(store.guildData)
              const modal = document.getElementById("levelrewardcreate") as HTMLDialogElement;
              modal.close();
              store.loading = store.loading.filter((l) => l != "level_rewards");
            }}
            >
              Submit
            </Button>
            <Button color="danger" onClick$={async () => {
              const modal = document.getElementById("levelrewardcreate") as HTMLDialogElement;
              modal.close();
              store.loading = store.loading.filter((l) => l != "joinimage");
            }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </dialog>
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