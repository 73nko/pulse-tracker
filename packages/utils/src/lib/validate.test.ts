import { z } from 'zod';
import { validate } from './validate';

describe('validate', () => {
  describe('condition', () => {
    it('is true if schema is passed', async () => {
      const schema = z.object({});

      const res = validate({ schema }).condition();

      expect(res).toEqual(true);
    });

    it('is false if schema is not passed', async () => {
      const res = validate({
        // @ts-expect-error - intentionally missing schema
        schema: undefined,
      }).condition();

      expect(res).toEqual(false);
    });
  });

  describe('execute', () => {
    it('calls validateAsync on Joi schema with body', async () => {
      const schema = {
        parseAsync: jest.fn(),
      };
      const metric = { id: 1 };

      // @ts-expect-error - intentionally missing schema
      await validate({ schema }).execute({ metric });

      expect(schema.parseAsync).toHaveBeenCalledWith(metric);
    });
  });
});
