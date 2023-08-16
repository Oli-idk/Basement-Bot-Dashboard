import { component$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ChannelType } from "discord-api-types/v10";
import {
  Add,
  Remove,
} from "qwik-ionicons";
import { MenuTitle } from "~/components/Menu";
import { Button } from "~/components/elements/Button";
import Card, { CardHeader } from "~/components/elements/Card";
import ColorInput from "~/components/elements/ColorInput";
import JoinLeaveImage from "~/components/elements/JoinLeaveImage";
import SelectInput from "~/components/elements/SelectInput";
import SettingsMenu from "~/components/elements/SettingsMenu";
import TextInput from "~/components/elements/TextInput";
import Toggle from "~/components/elements/Toggle";
import type { guildData, joinleaveImage } from "~/components/functions/guildData";
import { updateSettingFn } from "~/components/functions/guildData";
import { useGetGuildData, useGetUserData } from "~/routes/layout-required";

export default component$(() => {
  const guildData = useGetGuildData().value;
  const userData = useGetUserData().value;
  const store = useStore({
    guildData,
    userData,
    loading: [] as string[],
    joinImage: {
      backgroundColor: "#0D0D0D",
      image: "",
      textColor: "#F0CCFB",
      shadow: "true",
      shadowColor: "#7C4B8B",
    } as joinleaveImage,
    leaveImage: {
      backgroundColor: "#0D0D0D",
      image: "",
      textColor: "#F0CCFB",
      shadow: "true",
      shadowColor: "#7C4B8B",
    } as joinleaveImage,
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

  if (store.userData instanceof Error) {
    return (
      <div class="flex flex-col gap-3 items-center justify-center h-full pt-24">
        <h1 class="text-4xl font-bold">Error</h1>
        <p class="text-xl">{(userData as Error).message}</p>
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
        <MenuTitle>Join/Leave Image Settings</MenuTitle>
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
              Possible placeholders: <code>{"{USER MENTION}"}</code> <code>{"{USERNAME}"}</code> <code>{"{SERVER NAME}"}</code> <code>{"{NUMBER}"}</code> <code>{"{NUMBER FORMATTED}"}</code>
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
            <CardHeader id="joinimage" loading={store.loading.includes("joinimage")}>
              <Add width="25" class="fill-current" /> Join Image
            </CardHeader>
            <JoinLeaveImage join={true} id="joinImage" userdata={store.userData} imagedata={srvconfig.joinimage} />
            <Button onClick$={async () => {
              const modal = document.getElementById("joinimage-modal") as HTMLDialogElement;
              modal.showModal();
            }}
            >
              Edit
            </Button>
          </Card>
          <Card fit>
            <CardHeader id="leavemessage" loading={store.loading.includes("leavemessage")}>
              <Remove width="25" class="fill-current" /> Leave Message
            </CardHeader>
            <TextInput big id="leavemessage-message" value={srvconfig?.leavemessage.message} placeholder="The message sent when someone leaves the server" onChange$={async (event: any) => {
              store.loading.push("leavemessage");
              srvconfig!.leavemessage.message = event.target.value;
              await updateSettingFn("leavemessage", JSON.stringify(srvconfig?.leavemessage));
              store.loading = store.loading.filter((l) => l != "leavemessage");
            }}
            >
              The message when someone leaves the server
            </TextInput>
            <p class="mt-2 mb-4">
              Possible placeholders: <code>{"{USER MENTION}"}</code> <code>{"{USERNAME}"}</code> <code>{"{SERVER NAME}"}</code> <code>{"{NUMBER}"}</code> <code>{"{NUMBER FORMATTED}"}</code>
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
            <CardHeader id="leaveimage" loading={store.loading.includes("leaveimage")}>
              <Remove width="25" class="fill-current" /> Leave Image
            </CardHeader>
            <JoinLeaveImage join={true} id="leaveImage" userdata={store.userData} imagedata={srvconfig.leaveimage} />
            <Button onClick$={async () => {
              const modal = document.getElementById("leaveimage-modal") as HTMLDialogElement;
              modal.showModal();
            }}
            >
              Edit
            </Button>
          </Card>
        </div>
      </div>
      <dialog id="joinimage-modal" class="bg-transparent text-gray-300">
        <Card fit>
          <JoinLeaveImage join={true} id="joinImage-editing" userdata={store.userData} imagedata={store.joinImage} />
          <ColorInput key="joinimage-backgroundColor" id="joinimage-backgroundColor" value={store.joinImage.backgroundColor} onInput$={(color: string) => store.joinImage!.backgroundColor = color}>
            Background Color
          </ColorInput>
          <ColorInput key="joinimage-textColor" id="joinimage-textColor" value={store.joinImage.textColor} onInput$={(color: string) => store.joinImage!.textColor = color}>
            Text Color
          </ColorInput>
          <ColorInput key="joinimage-shadowColor" id="joinimage-shadowColor" value={store.joinImage.shadowColor} onInput$={(color: string) => store.joinImage!.shadowColor = color}>
            Shadow Color
          </ColorInput>
          <Toggle id="joinimage-shadow" checked={store.joinImage.shadow == 'true'} onChange$={async (event: any) => {
            store.loading.push("joinimage");
            store.joinImage!.shadow = event.target.checked ? 'true' : 'false';
            store.loading = store.loading.filter((l) => l != "joinimage");
          }}>
            Shadow Enabled
          </Toggle>
          <TextInput id="joinimage-image" value={store.joinImage.image} placeholder="The image for the corners" onChange$={async (event: any) => {
            store.loading.push("joinimage");
            store.joinImage!.image = event.target.value;
            store.loading = store.loading.filter((l) => l != "joinimage");
          }}>
            Image for the corners
          </TextInput>
          <div class="flex gap-4 py-10">
            <Button color="primary" onClick$={async () => {
              store.loading.push("joinimage");
              srvconfig.joinimage = store.joinImage!;
              await updateSettingFn("joinimage", JSON.stringify(srvconfig?.joinimage));
              const modal = document.getElementById("joinimage-modal") as HTMLDialogElement;
              modal.close();
              store.loading = store.loading.filter((l) => l != "joinimage");
            }}
            >
              Submit
            </Button>
            <Button color="danger" onClick$={async () => {
              store.loading.push("joinimage");
              store.joinImage = srvconfig.joinimage;
              const modal = document.getElementById("joinimage-modal") as HTMLDialogElement;
              modal.close();
              store.loading = store.loading.filter((l) => l != "joinimage");
            }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </dialog>
      <dialog id="leaveimage-modal" class="bg-transparent text-gray-300">
        <Card fit>
          <JoinLeaveImage join={true} id="leaveimage-editing" userdata={store.userData} imagedata={store.leaveImage} />
          <ColorInput key="leaveimage-backgroundColor" id="leaveimage-backgroundColor" value={store.leaveImage.backgroundColor} onInput$={(color: string) => store.leaveImage!.backgroundColor = color}>
            Background Color
          </ColorInput>
          <ColorInput key="leaveimage-textColor" id="leaveimage-textColor" value={store.leaveImage.textColor} onInput$={(color: string) => store.leaveImage!.textColor = color}>
            Text Color
          </ColorInput>
          <ColorInput key="leaveimage-shadowColor" id="leaveimage-shadowColor" value={store.leaveImage.shadowColor} onInput$={(color: string) => store.leaveImage!.shadowColor = color}>
            Shadow Color
          </ColorInput>
          <Toggle id="leaveimage-shadow" checked={store.leaveImage.shadow == 'true'} onChange$={async (event: any) => {
            store.loading.push("leaveimage");
            store.leaveImage!.shadow = event.target.checked ? 'true' : 'false';
            store.loading = store.loading.filter((l) => l != "leaveimage");
          }}>
            Shadow Enabled
          </Toggle>
          <TextInput id="leaveimage-image" value={store.leaveImage.image} placeholder="The image for the corners" onChange$={async (event: any) => {
            store.loading.push("leaveimage");
            store.leaveImage!.image = event.target.value;
            store.loading = store.loading.filter((l) => l != "leaveimage");
          }}>
            Image for the corners
          </TextInput>
          <div class="flex gap-4 py-10">
            <Button color="primary" onClick$={async () => {
              store.loading.push("leaveimage");
              srvconfig.leaveimage = store.leaveImage!;
              await updateSettingFn("leaveimage", JSON.stringify(srvconfig?.leaveimage));
              const modal = document.getElementById("leaveimage-modal") as HTMLDialogElement;
              modal.close();
              store.loading = store.loading.filter((l) => l != "leaveimage");
            }}
            >
              Submit
            </Button>
            <Button color="danger" onClick$={async () => {
              store.loading.push("leaveimage");
              store.leaveImage = srvconfig.leaveimage;
              const modal = document.getElementById("leaveimage-modal") as HTMLDialogElement;
              modal.close();
              store.loading = store.loading.filter((l) => l != "leaveimage");
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
  title: "Join/Leave Settings",
  meta: [
    {
      name: "description",
      content: "Basement Bot Join/Leave Settings",
    },
    {
      property: "og:description",
      content: "Basement Bot Join/Leave Settings",
    },
  ],
};