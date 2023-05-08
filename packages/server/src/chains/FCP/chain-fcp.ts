import { z } from 'zod';
import { chain, validate } from '@pulse-tracker/utils';
import { testFIDStep } from './testStep';

const fcpSchema = z.object({
  rating: z.string(),
  value: z.number(),
});

export const chainFcp = chain('chain-fcp')
  .use(validate({ schema: fcpSchema }))
  .use(testFIDStep);
