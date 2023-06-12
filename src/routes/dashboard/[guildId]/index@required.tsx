import type { RequestEvent } from "@builder.io/qwik-city";

export const onGet: any = async ({ redirect, pathname  }: RequestEvent) => {
  throw redirect(302, `${pathname}/general`);
};