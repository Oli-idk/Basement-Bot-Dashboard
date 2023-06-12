// import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
// import type { DocumentHead } from "@builder.io/qwik-city";
// import { routeLoader$ } from "@builder.io/qwik-city";
// import { ChannelType } from "discord-api-types/v10";
// import { Button } from "~/components/elements/Button";
// import SettingsMenu from "~/components/elements/SettingsMenu";
// import getAuth from "~/components/functions/auth";
// import type { embedData, guildData, joinleaveImage } from "~/components/functions/settings";
// import { getGuildDataFn, getUserInfoFn } from "~/components/functions/settings";

// export const useGetGuildData = routeLoader$(
//   async (props) => await getGuildDataFn(props)
// );

// export const useGetUserData = routeLoader$(async ({ cookie }) => {
//   const auth = await getAuth(cookie);
//   return await getUserInfoFn(auth!.accessToken);
// });

// export default component$(() => {
//   const guildData = useGetGuildData().value;
//   const userData = useGetUserData().value;
//   const store = useStore({
//     guildData,
//     userData,
//     loading: [] as string[],
//     ticketEmbed: {
//       sendChannel: "",
//       title: "Support Ticket",
//       description: "To create a ticket click the button below and fill out all valid information",
//       color: "#ffffff",
//       footer: "",
//       thumbnail: "",
//       image: "",
//       buttonText: "Create Ticket",
//     } as embedData,
//     joinImage: {
//       backgroundColor: "#0D0D0D",
//       image: "",
//       textColor: "#F0CCFB",
//       shadow: "true",
//       shadowColor: "#7C4B8B",
//     } as joinleaveImage,
//     leaveImage: {
//       backgroundColor: "#0D0D0D",
//       image: "",
//       textColor: "#F0CCFB",
//       shadow: "true",
//       shadowColor: "#7C4B8B",
//     } as joinleaveImage,
//   });

//   if (store.guildData instanceof Error) {
//     return (
//       <div class="flex flex-col gap-3 items-center justify-center h-full pt-24">
//         <h1 class="text-4xl font-bold">Error</h1>
//         <p class="text-xl">{(guildData as Error).message}</p>
//         <Button onClick$={() => location.reload()} color="danger">
//           Reload
//         </Button>
//       </div>
//     );
//   }

//   if (store.userData instanceof Error) {
//     return (
//       <div class="flex flex-col gap-3 items-center justify-center h-full pt-24">
//         <h1 class="text-4xl font-bold">Error</h1>
//         <p class="text-xl">{(userData as Error).message}</p>
//         <Button onClick$={() => location.reload()} color="danger">
//           Reload
//         </Button>
//       </div>
//     );
//   }

//   const { guild, channels, roles, srvconfig } = store.guildData as guildData;

//   useVisibleTask$(() => {
//     store.ticketEmbed.sendChannel = channels.filter((c) => c.type == ChannelType.GuildText)[0].id;
//   });

//   return (
//     <section class="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 mx-auto max-w-screen-2xl px-4 sm:px-6 min-h-[calc(100lvh-80px)]">
//     <SettingsMenu guild={guild} store={store} />
//     </section>
//   );
// });

// export const head: DocumentHead = {
//   title: "Dashboard",
//   meta: [
//     {
//       name: "description",
//       content: "Basement Bot Dashboard",
//     },
//     {
//       property: "og:description",
//       content: "Basement Bot Dashboard",
//     },
//   ],
// };