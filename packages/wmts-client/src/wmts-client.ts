// Deep-imported to avoid pulling in mc-utils's unrelated `geo` barrel (and its @turf/turf dependency)
// that the top-level `@map-colonies/mc-utils` entry point re-exports.
import { HttpClient, type IHttpRetryConfig } from '@map-colonies/mc-utils/dist/communication/http';
import type { Logger } from '@map-colonies/js-logger';
import { xmlToCapabilities } from './xmlToCapabilities';
import type { CapabilityWMTS } from './schemas/capability.schema';
import type { GetFeatureInfoRequest, GetTileRequest } from './interfaces';

/* eslint-disable @typescript-eslint/naming-convention -- method names match the OGC WMTS request names (GetCapabilities, GetTile, GetFeatureInfo) */
export class WmtsClient extends HttpClient {
  public constructor(logger: Logger, baseUrl: string, targetService = 'WMTS', retryConfig?: IHttpRetryConfig, disableDebugLogs = false) {
    super(logger, baseUrl, targetService, retryConfig, disableDebugLogs);
  }

  public async GetCapabilities(): Promise<CapabilityWMTS[]> {
    const xml = await this.get<string>('');
    return xmlToCapabilities(xml, this.logger);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async GetTile(request: GetTileRequest): Promise<never> {
    return Promise.reject(new Error('WmtsClient.GetTile is not implemented'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async GetFeatureInfo(request: GetFeatureInfoRequest): Promise<never> {
    return Promise.reject(new Error('WmtsClient.GetFeatureInfo is not implemented'));
  }
}
