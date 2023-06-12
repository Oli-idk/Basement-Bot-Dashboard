import { component$, useStore } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { Button } from "~/components/elements/Button";
import Card, { CardHeader } from "~/components/elements/Card";
import type { guildData } from "~/components/functions/guildData";
import { useGetGuildData, useGetLeaderboard } from "~/routes/layout";

export default component$(() => {
  const guildData = useGetGuildData().value;
  const leaderboard = useGetLeaderboard().value;
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

  const { guild } = store.guildData as guildData;
  const levels = leaderboard.sort((a, b) => {
    if (a.level !== b.level) {
      return b.level - a.level;
    } else {
      return b.xp - a.xp;
    }
  });

  return (
    <section class="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 mx-auto max-w-screen-2xl px-4 sm:px-6 min-h-[calc(100lvh-80px)]">
      <div class="sm:col-span-2 lg:col-span-3 2x1:col-span-4 pt22 sm:pt-28">
        <Card fit>
          <CardHeader>
            {guild.name}'s leaderboard
          </CardHeader>
          {(() => {
            return levels.map((user, index) => (
              <Card key={user.userId}>
                <div class="flex items-start flex-1">
                  {index + 1}. {user.username} - Level: {user.level} - XP: {user.xp}/{user.xp_needed}
                </div>
              </Card>
            ))
          })()}
        </Card>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Leaderboard",
  meta: [
    {
      name: "description",
      content: `Basement Bot Leaderboard`,
    },
    {
      property: "og:description",
      content: "Basement Bot Leaderboard",
    },
  ],
};