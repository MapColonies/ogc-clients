import { DescribeFeatureTypeRequest, GetCapabilitiesRequest, GetFeatureRequest, Version, WFSPayload } from './interfaces';
export declare const DEFAULT_COUNT = 500;
export declare const DEFAULT_VERSION = "2.0.0";
export declare class WfsClient {
    private readonly baseUrl;
    private readonly version;
    constructor(version: Version, baseUrl: string);
    GetCapabilitiesRequest({ exceptions }?: GetCapabilitiesRequest): WFSPayload;
    DescribeFeatureType(typeNames: Array<string>, { outputFormat, exceptions }?: DescribeFeatureTypeRequest): WFSPayload;
    GetFeatureRequest({ outputFormat, exceptions, ...rest }: GetFeatureRequest): WFSPayload;
    xmlToJson(xml: string, formatFeatures?: boolean): Record<string, unknown>;
    private formattedFeaturesByVersion;
    private removeFieldRecursively;
}
