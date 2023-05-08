import { Step } from '@pulse-tracker/utils';

export const testFIDStep: Step = {
  name: 'testFIDStep',
  execute: async (values) => {
    console.log('testFIDStep', values);

    return values;
  },
};
