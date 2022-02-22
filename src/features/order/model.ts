import { restore, createEffect, createEvent } from 'effector';

export const sleepFx = createEffect(async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
});

export const orderSet = createEvent<string>();

export const order = restore(orderSet, '');
