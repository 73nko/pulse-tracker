// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { onFID, onTTFB, onFCP, Metric } from 'web-vitals';
import { postMetric } from './api';
import { PluginConfig } from './global';


class PluginRum {
  private _config: PluginConfig;

  constructor(config: PluginConfig) {
    if (!config.id || !config.projectId || !config.urlEndpoint) {
      throw new Error('id, projectId and urlEndpoint are required');
    }

    this._config = config;
  }

  public get configuration() {
    return this._config;
  }

  private measure(metric: Metric) {
    const { projectId, urlEndpoint } = this._config;

    postMetric(urlEndpoint, {
      projectId: projectId,
      ...metric,
    });
  }

  public measureFid(callback?: (metric: Metric) => void) {
    if (!callback) {
      return onFID((metric) => this.measure(metric));
    }

    onFID(callback);
  }

  public measureFCP(callback?: (metric: Metric) => void) {
    if (!callback) {
      return onFCP((metric) => this.measure(metric));
    }
    
    onFCP(callback);
  }

  public measureTTFB(callback?: (metric: Metric) => void) {
    if (!callback) {
      return onTTFB((metric) => this.measure(metric));
    }
    
    onTTFB(callback);
  }
}

export const plugin = {
  config: (config: PluginConfig) => {
    const plugin = new PluginRum(config);
    return Object.freeze(plugin);
  },
};
