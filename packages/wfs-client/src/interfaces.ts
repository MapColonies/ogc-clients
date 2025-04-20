import { EpsgCode } from "@map-colonies/types";
import { GetFeatureOptions } from "./filters";

export type GetCapabilitiesRequest = {
  exceptions?: OutputFormat
}

export type DescribeFeatureTypeRequest = {
  outputFormat?: OutputFormat,
  exceptions?: OutputFormat
}

export type GetFeatureRequest = Omit<GetFeatureOptions, 'outputFormat' | 'srsName'> & {
  srsName?: `EPSG:${EpsgCode}`,
  outputFormat?: OutputFormat,
  exceptions?: OutputFormat
}

export type OutputFormat =
  'text/xml; subtype=gml/3.2' |
  'text/xml; subtype=gml/3.1.1' |
  'text/xml; subtype=gml/2.1.2' |
  'GML2' |
  'KML' |
  'SHAPE-ZIP' |
  'application/gml+xml; version=3.2' |
  'application/json' |
  'application/vnd.google-earth.kml xml' |
  'application/vnd.google-earth.kml+xml' |
  'csv' |
  'gml3' |
  'gml32' |
  'json';

export type Version = /*'1.0.0' |*/ '1.1.0' | '2.0.0';

export type Method = 'GET' | 'POST';

export type WFSPayload = {
  baseUrl: string,
  method: Method,
  body?: string,
  headers?: Record<string, string>,
  params?: Record<string, string>
  // paramsSerializer?: (params: any) => string;
  // xsrfCookieName?: string;
  // xsrfHeaderName?: string;
}