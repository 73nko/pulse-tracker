import { z } from 'zod';
import { chain, validate } from '@pulse-tracker/utils';
import { testFIDStep } from './testStep';

const fidSchema = z.object({
  rating: z.string(),
  value: z.number(),
});

export const chainFid = chain('chain-fid')
  .use(validate({ schema: fidSchema }))
  .use(testFIDStep);
