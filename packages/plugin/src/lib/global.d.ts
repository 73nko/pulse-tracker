// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Metric } from 'web-vitals';

export interface ProjectMetric extends Metric {
  projectId: string;
}

export interface PluginConfig {
  id: string;
  projectId: string;
  urlEndpoint: string;
}
