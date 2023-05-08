import { ZodObject } from 'zod';

export const validate = ({ schema }: { schema: ZodObject<any> }) => ({
  name: 'validate',
  condition: () => !!schema,
  execute: async ({ metric }: any) => {
    await schema.parseAsync(metric);
  },
});
