// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
const mockPostMetric = jest.fn();
const mockMetricFID = { name: 'FID', value: 1000 };
const mockMetricFCP = { name: 'FCP', value: 1000 };
const mockMetricTTFB = { name: 'TTFB', value: 1000 };
const mockOnFID = jest.fn().mockImplementation((cb) => cb(mockMetricFID));
const mockOnFCP = jest.fn().mockImplementation((cb) => cb(mockMetricFCP));
const mockOnTTFB = jest.fn().mockImplementation((cb) => cb(mockMetricTTFB));

import { plugin, PluginConfig } from './plugin';

jest.mock('./api', () => ({
  postMetric: mockPostMetric,
}));

jest.mock('web-vitals', () => ({
  onFID: mockOnFID,
  onTTFB: mockOnTTFB,
  onFCP: mockOnFCP,
}));

describe('plugin.config', () => {
  const mockConfig = {
    id: 'mi-id',
    projectId: 'mi-project-id',
    urlEndpoint: 'https://mi-url.com/metric',
  };

  const instancePlugin = plugin.config(mockConfig);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return instance ok of class PluginRum', () => {
    expect(instancePlugin.configuration).toEqual(mockConfig);
  });

  test('should throw error when id is not provided', () => {
    const mockConfig = {
      projectId: 'mi-project-id',
      urlEndpoint: 'https://mi-url.com/metric',
    };

    expect(() => plugin.config(mockConfig as PluginConfig)).toThrowError(
      'id, projectId and urlEndpoint are required'
    );
  });

  test('should call postMetric when measureFid is called', () => {
    instancePlugin.measureFid();

    expect(mockOnFID).toHaveBeenCalled();
    expect(mockPostMetric).toHaveBeenCalled();
  });

  test('should call callback when measureFid is called with callback parameter', () => {
    const mockCallback = jest.fn();
    instancePlugin.measureFid(mockCallback);

    expect(mockCallback).toHaveBeenCalled();
  });

  test('should call postMetric when measureFCP is called', () => {
    instancePlugin.measureFCP();

    expect(mockOnFCP).toHaveBeenCalled();
    expect(mockPostMetric).toHaveBeenCalled();
  });

  test('should call callback when measureFCP is called with callback parameter', () => {
    const mockCallback = jest.fn();
    instancePlugin.measureFCP(mockCallback);

    expect(mockCallback).toHaveBeenCalled();
  });
});
