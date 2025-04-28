import WFS from 'ol/format/WFS';
import { getXMLSerializer } from 'ol/xml.js';
import { DescribeFeatureTypeRequest, GetCapabilitiesRequest, GetFeatureRequest, Version, WFSPayload } from './interfaces';
import { getJsonixContext } from './jsonix-context';
import { removeFieldRecursively, insertAtIndex } from './utils';

export const DEFAULT_COUNT = 500;
export const DEFAULT_VERSION = '2.0.0';

export class WfsClient {
  private readonly baseUrl: string;
  private readonly version: Version;

  public constructor(version: Version, baseUrl: string) {
    this.baseUrl = baseUrl;
    this.version = version;
  }

  public GetCapabilitiesRequest({ exceptions = 'application/json' }: GetCapabilitiesRequest = {}): WFSPayload {
    const host = this.baseUrl.split('/')[2];

    const payload = {
      baseUrl: this.baseUrl,
      method: 'GET',
      params: {
        exceptions,
        service: 'WFS',
        request: 'GetCapabilities',
        version: this.version
      },
      headers: {
        "Host": host,
      },
    } satisfies WFSPayload;
    return payload;
  }

  public DescribeFeatureType(typeNames: Array<string>, { outputFormat = 'application/json', exceptions = 'application/json' }: DescribeFeatureTypeRequest = {}): WFSPayload {
    const host = this.baseUrl.split('/')[2];

    const payload = {
      baseUrl: this.baseUrl,
      method: 'GET',
      params: {
        service: 'WFS',
        request: 'DescribeFeatureType',
        typeNames: typeNames.join(','),
        exceptions,
        outputFormat,
      },
      headers: {
        "Host": host,
      },
    } satisfies WFSPayload;

    return payload;
  }

  public GetFeatureRequest({ sortBy, outputFormat = 'application/json', exceptions = 'application/json', ...rest }: GetFeatureRequest): WFSPayload {
    const countOrMaxFeature = {
      [this.version === '2.0.0' ? 'count' : 'maxFeatures']: rest.count ?? rest.maxFeatures ?? DEFAULT_COUNT
    } as { count: number } | { maxFeatures: number };

    const featureRequest = new WFS({ version: this.version }).writeGetFeature({
      outputFormat,
      ...countOrMaxFeature,
      ...rest,
    });

    const body = getXMLSerializer().serializeToString(featureRequest);

    let sortXML = '';
    let modifiedBody = '';

    sortBy?.map(sort => {
      sortXML += `<SortProperty><ValueReference>${sort[0]}</ValueReference><SortOrder>${sort[1]}</SortOrder></SortProperty>`
    });

    if (sortBy && sortXML.length) {
      const regex = /<Query[^>]*(\/>)/;

      if (body.match(regex)) {
        const start = body.indexOf('<Query');
        const indexToReplace = body.indexOf('/>', start);
        modifiedBody = insertAtIndex(body, indexToReplace, `><SortBy>${sortXML}</SortBy></Query>`)
      } else {
        modifiedBody = body.replace(
          '</Query>',
          `<SortBy>${sortXML}</SortBy></Query>`
        );
      }
    }

    const host = this.baseUrl.split('/')[2];

    const payload = {
      baseUrl: this.baseUrl,
      method: 'POST',
      body: sortBy !== undefined ? modifiedBody : body,
      headers: {
        "Host": host,
        "Content-Length": sortBy !== undefined ? modifiedBody.length.toString() : body.length.toString(),
        "Content-Type": 'text/xml'
      },
      params: {
        exceptions
      }
    } satisfies WFSPayload;

    return payload;
  }

  public xmlToJson(xml: string, formatFeatures = true): Record<string, unknown> {
    try {
      const jsonixContext = getJsonixContext(this.version);
      /* eslint-disable */
      // @ts-ignore
      const jsonixUnmarshaller = jsonixContext.createUnmarshaller();

      // eslint-disable-next-line
      const json = jsonixUnmarshaller.unmarshalString(xml) as Record<string, unknown>;
      const res = removeFieldRecursively(json.value, 'TYPE_NAME');
      formatFeatures && this.formattedFeaturesByVersion(res);

      return res;
    } catch (err) {
      console.log('error her on json: ', err)
      throw new Error(`Could not parse the XML for this request. ${(err as Error).message}`);
    }
  }

  private formattedFeaturesByVersion(obj: any) {
    if (this.version === '2.0.0') {
      const featureArr = obj.featureTypeList.featureType.map((feature: any) => ({
        name: `${feature.name.namespaceURI}:${feature.name.localPart}`,
        title: feature.title?.[0].value,
        abstract: feature._abstract?.[0].value,
        keywords: ((feature.keywords[0]?.keyword.map((kw: any) => kw.value)) as string[]),
        defaultCRS: feature.defaultCRS,
        wgs84BoundingBox: feature.wgs84BoundingBox[0]
      }))
      obj.featureTypeList = featureArr;
    }
  }
}