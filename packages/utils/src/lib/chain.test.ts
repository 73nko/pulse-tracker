import { chain, StopChain } from './chain';

const MOCK_BODY = { foo: 'bar' };

describe('chain', () => {
  const MOCK_DATA = {
    projectId: 'miweb',
    name: 'FID',
    value: 8,
    rating: 'good',
    delta: 8,
    entries: [
      {
        name: 'pointerdown',
        entryType: 'first-input',
        startTime: 12581.20000000298,
        duration: 8,
        processingStart: 12589.20000000298,
        processingEnd: 12589.20000000298,
        cancelable: true,
      },
    ],
    id: 'v3-1683453825182-9047523024474',
    navigationType: 'navigate',
  };

  it('creates instance with use', () => {
    const instance = chain('example');

    expect(instance).toHaveProperty('use');
  });

  it('creates instance with catch', () => {
    const instance = chain('example');

    expect(instance).toHaveProperty('catch');
  });

  it('concats data from one execution to the following', async () => {
    const data = MOCK_DATA;
    const step1 = {
      name: 'step1',
      execute: jest.fn().mockResolvedValue({ step1: 'data' }),
    };
    const step2 = {
      name: 'step2',
      execute: jest.fn(),
    };

    const instance = chain('example').use(step1).use(step2);

    await instance({ metric: data });

    expect(step2.execute).toHaveBeenCalled();
  });

  it('executes steps in provided order', async () => {
    const metric = {
      projectId: 'miweb',
      name: 'FID',
      value: 8,
      rating: 'good',
      delta: 8,
      entries: [
        {
          name: 'pointerdown',
          entryType: 'first-input',
          startTime: 12581.20000000298,
          duration: 8,
          processingStart: 12589.20000000298,
          processingEnd: 12589.20000000298,
          cancelable: true,
        },
      ],
      id: 'v3-1683453825182-9047523024474',
      navigationType: 'navigate',
    };
    const step1 = {
      name: 'name',
      execute: jest.fn().mockResolvedValue({ step1: 'data' }),
    };

    const step2 = {
      name: 'name',
      execute: jest.fn().mockResolvedValue({ step2: 'data' }),
    };

    const instance = chain('example').use(step1).use(step2);

    await instance({ metric });

    expect(step1.execute).toHaveBeenCalled();
    expect(step2.execute).toHaveBeenCalled();
  });

  it('stops chain if StopChain is raised', async () => {
    const error = new StopChain('oops');
    const step1 = {
      name: 'name',
      execute: jest.fn().mockRejectedValue(error),
    };

    const step2 = {
      name: 'name',
      execute: jest.fn(),
    };

    const instance = chain('example').use(step1).use(step2);

    await instance({ metric: MOCK_DATA });

    expect(step1.execute).toHaveBeenCalled();
    expect(step2.execute).not.toHaveBeenCalled();
  });

  describe('when step has no condition', () => {
    it('executes the step', async () => {
      const step = {
        name: 'name',
        execute: jest.fn(),
      };

      const instance = chain('example').use(step);

      await instance({ metric: MOCK_DATA });

      expect(step.execute).toHaveBeenCalledWith({ metric: MOCK_DATA });
    });
  });

  describe('when step has condition', () => {
    it('executes the step if condition is truthy', async () => {
      const step = {
        name: 'name',
        condition: jest.fn().mockResolvedValue(true),
        execute: jest.fn(),
      };

      const instance = chain('example').use(step);

      await instance({ metric: MOCK_DATA });

      expect(step.condition).toHaveBeenCalledWith({ metric: MOCK_DATA });
      expect(step.execute).toHaveBeenCalledWith({ metric: MOCK_DATA });
    });
  });

  describe('when multiple records are present', () => {
    it('executes steps multiple times', async () => {
      const metric = {
        projectId: 'miweb',
        name: 'FID',
        value: 8,
        rating: 'good',
        delta: 8,
        entries: [
          {
            name: 'pointerdown',
            entryType: 'first-input',
            startTime: 12581.20000000298,
            duration: 8,
            processingStart: 12589.20000000298,
            processingEnd: 12589.20000000298,
            cancelable: true,
          },
        ],
        id: 'v3-1683453825182-9047523024474',
        navigationType: 'navigate',
      };
      const step1 = {
        name: 'step1',
        execute: jest.fn(),
      };

      const instance = chain('example').use(step1);

      await instance({ metric } as any);

      expect(step1.execute).toHaveBeenCalledTimes(1);
    });

    it('returns report of successes', async () => {
      const metric = {
        projectId: 'miweb',
        name: 'FID',
        value: 8,
        rating: 'good',
        delta: 8,
        entries: [
          {
            name: 'pointerdown',
            entryType: 'first-input',
            startTime: 12581.20000000298,
            duration: 8,
            processingStart: 12589.20000000298,
            processingEnd: 12589.20000000298,
            cancelable: true,
          },
        ],
        id: 'v3-1683453825182-9047523024474',
        navigationType: 'navigate',
      };
      const step1 = {
        name: 'step1',
        execute: jest.fn(),
      };

      const instance = chain('example').use(step1);

      const res = await instance({ metric } as any);

      expect(res).toEqual({
        batchItemFailureId: [],
      });
    });
  });

  describe('when there is an error inside the chain', () => {
    it('executes catch step with error', async () => {
      const data = MOCK_DATA;
      const error = new Error('oops');
      const step = {
        name: 'name',
        execute: jest.fn().mockRejectedValue(error),
      };
      const catchStep = {
        name: 'name',
        execute: jest.fn().mockResolvedValue(false),
      };

      const instance = chain('example').use(step).catch(catchStep);

      await instance({ metric: data });

      expect(catchStep.execute).toHaveBeenCalledWith({ metric: data }, error);
    });

    it('returns report of successes', async () => {
      const data = MOCK_DATA;
      const error = new Error('oops');
      const step = {
        name: 'name',
        execute: jest.fn().mockRejectedValue(error),
      };

      const instance = chain('example').use(step);

      const res = await instance({ metric: data });

      expect(res).toEqual({
        batchItemFailureId: [data.id],
      });
    });
  });

  describe('when some records fails and others succed', () => {
    it('returns report of successes', async () => {
      const metric = {
        projectId: 'miweb',
        name: 'FID',
        value: 8,
        rating: 'good',
        delta: 8,
        entries: [
          {
            name: 'pointerdown',
            entryType: 'first-input',
            startTime: 12581.20000000298,
            duration: 8,
            processingStart: 12589.20000000298,
            processingEnd: 12589.20000000298,
            cancelable: true,
          },
        ],
        id: 'v3-1683453825182-9047523024474',
        navigationType: 'navigate',
      };
      const error = new Error('oops');
      const step = {
        name: 'name',
        execute: jest.fn((metric) => {
          if (metric.id !== '2') {
            return Promise.reject(error);
          }

          return Promise.resolve({ metric });
        }),
      };

      const instance = chain('example').use(step);

      const res = await instance({ metric } as any);

      expect(res).toEqual({
        batchItemFailureId: [metric.id],
      });
    });
  });
});
