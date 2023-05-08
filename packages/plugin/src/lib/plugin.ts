// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { onFID, onTTFB, onFCP, Metric } from 'web-vitals';
import { postMetric } from './api';
import { PluginConfig } from './global';
import { SERVER_URL } from '../utils/constants';

class PluginRum {
  private _config: PluginConfig;

  constructor(config: PluginConfig) {
    if (!config.projectId || !config.projectName) {
      throw new Error('projectId and projectName are required');
    }

    this._config = {
      ...config,
      urlEndpoint: config?.urlEndpoint ?? SERVER_URL,
    }
  }

  public get configuration() {
    return this._config;
  }

  private measure(metric: Metric, callback?: (metric: Metric) => void) {
    const { projectId, urlEndpoint } = this._config;

    postMetric(urlEndpoint as string, {
      projectId: projectId,
      ...metric,
    });

    if (callback) {
      callback(metric);
    }
  }

  public measureFID(callback?: (metric: Metric) => void) {
    onFID((metric) => {
      this.measure(metric, callback);
    });
  }

  public measureFCP(callback?: (metric: Metric) => void) {
    onFCP((metric) => {
      this.measure(metric, callback);
    });
  }

  public measureTTFB(callback?: (metric: Metric) => void) {
    onTTFB((metric) => {
      this.measure(metric, callback);
    });
  }
}

export const plugin = {
  config: (config: PluginConfig) => {
    const plugin = new PluginRum(config);
    return Object.freeze(plugin);
  },
};
