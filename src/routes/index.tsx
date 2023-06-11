import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

import { HappyOutline, LogoDiscord, PersonCircleOutline, SettingsOutline } from 'qwik-ionicons';
import { useGetAuth } from './layout';
import { ExternalButton, SPAButton } from '~/components/elements/Button';

export default component$(() => {
  const auth = useGetAuth();
  return (
    <section class="flex mx-auto max-w-6xl px-6 items-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div>
        <h1 class="font-bold text-white text-4xl sm:text-5xl md:text-6xl">
          Cum <span class="text-blue-400">Real</span> bot you need, <span class="text-green-200">RatBot</span>.
        </h1>
        <p class="mt-5 text-xl sm:text-2xl md:text-3xl text-gray-400">
          Levels, Utilities, Cum!
        </p>
        <p class="my-5 text-xs text-gray-400">
          Basement Bot Go BRRRRR :3
        </p>
        <div class="flex flex-col sm:flex-row justify-start">
          <ExternalButton massive bold color="primary" href="/invite" style={{ filter: 'drop-shadow(0 3rem 6rem #CB6CE6)' }}>
            <HappyOutline width="24" class="fill-current" />
            Invite me to your server!
          </ExternalButton>
        </div>
        <div class="mt-3 flex flex-col sm:flex-row gap-2">
          <div class="rounded-md shadow">
            <ExternalButton massive bold href="/discord">
              <LogoDiscord width="24" class="fill-current" />
              Join the Discord!
            </ExternalButton>
          </div>
          <div class="rounded-md shadow">
            {!auth.value &&
              <ExternalButton massive bold href="/login">
                <PersonCircleOutline width="24" class="fill-current" />
                Login
              </ExternalButton>
            }
            {auth.value &&
              <SPAButton massive bold href="/dashboard">
                <SettingsOutline width="24" class="fill-current" />
                Dashboard
              </SPAButton>
            }
          </div>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: 'Home',
  meta: [
    {
      name: 'description',
      content: 'A bot that does stuff ig',
    },
    {
      property: 'og:description',
      content: 'A bot that does stuff ig',
    },
  ],
};