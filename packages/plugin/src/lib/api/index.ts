// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ProjectMetric } from '../global';
import { api } from './api';
import { ResponseError } from '../../utils/error';

export async function postMetric(url: string, data: ProjectMetric) {
  try {
    await api.post(url, data);
  } catch (error) {
    if (error instanceof ResponseError) {
      //handle error
    }

    if (error instanceof Error) {
      //handle error
    }

    console.error(error);
  }
}
