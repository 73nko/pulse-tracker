export interface Step {
  name: string;
  condition?: (data: any) => boolean;
  execute: (data: any, error?: unknown) => any | void;
}

export interface CatchStep extends Step {
  condition?: (data: any, error?: unknown) => boolean;
  execute: (data: any, error?: unknown) => any | void;
}

export class StopChain extends Error {}

export class RetryableError extends Error {}

export const chain = (chainName = '') => {
  const steps: Step[] = [];
  const catchSteps: CatchStep[] = [];

  const executeCatchSteps = async (
    catchSteps: Step[],
    metric: any,
    error: unknown
  ) => {
    const id = metric?.id;

    for (const catchStep of catchSteps) {
      const condition = catchStep.condition
        ? await catchStep.condition(metric)
        : true;

      console.log(
        `[${id}] Executing catch step`,
        chainName,
        catchStep.name,
        condition
      );

      try {
        if (condition) {
          const newData = await catchStep.execute(metric, error);
          Object.assign(metric, newData);
        }
      } catch (error) {
        console.error(
          `[${id}] Captured! Error executing catch step`,
          chainName,
          catchStep.name,
          error
        );
      }
    }
  };

  const executeChain = async (steps: Step[], metric: any = {}) => {
    const id = metric?.id;
    console.log(`[${id}] Executing chain`, chainName, JSON.stringify(metric));

    for (const step of steps) {
      const condition = step.condition ? await step.condition(metric) : true;

      console.log(`[${id}] Executing step`, chainName, step.name, condition);

      try {
        if (condition) {
          const newData = await step.execute({ ...metric });
          Object.assign(metric, newData);
        }
      } catch (error) {
        // chain's step error handling

        // if instance of stop chain, stop lambda
        if (error instanceof StopChain) {
          console.log(`[${id}] Chain gracefully stopped`, error);
          return;
        }

        console.error(
          `[${id}] Error executing step`,
          chainName,
          step.name,
          error
        );

        await executeCatchSteps(catchSteps, metric, error);

        throw error;
      }
    }

    console.log(`[${id}] Chain executed`, chainName);
  };

  const instance = async ({ metric }: { metric: any }) => {
    // Process metrics from same id in sequence
    const processStep = async () => {
      const failedRecords: any = [];

      try {
        await executeChain(steps, { metric });
      } catch (error) {
        failedRecords.push(metric.id);
        console.error(error);
      }

      return failedRecords;
    };

    const failedRecords = (await processStep()) as any;

    // Reports failed items

    return {
      batchItemFailureId: failedRecords,
    };
  };

  instance.use = (step: Step) => {
    steps.push(step);
    return instance;
  };

  instance.catch = (catchStep: CatchStep) => {
    catchSteps.push(catchStep);
    return instance;
  };

  return instance;
};
