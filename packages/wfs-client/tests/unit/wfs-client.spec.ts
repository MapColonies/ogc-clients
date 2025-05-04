import { Extent, Filter, Geom } from '../../src/filters';
import { WfsClient } from '../../src/wfs-client';

const BASE_URL = 'https://mockUrl';

const wfsClient110 = new WfsClient('1.1.0', BASE_URL);
const wfsClient200 = new WfsClient('2.0.0', BASE_URL);

describe('GetCapabilities', function () {
  const getCapabilitiesResponseXml200 = `<?xml version="1.0" encoding="UTF-8"?>
    <wfs:WFS_Capabilities version="2.0.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns="http://www.opengis.net/wfs/2.0"
      xmlns:wfs="http://www.opengis.net/wfs/2.0"
      xmlns:ows="http://www.opengis.net/ows/1.1"
      xmlns:gml="http://www.opengis.net/gml/3.2"
      xmlns:fes="http://www.opengis.net/fes/2.0"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:xs="http://www.w3.org/2001/XMLSchema"
      xsi:schemaLocation="http://www.opengis.net/wfs/2.0
          http://geoserver-vector-dev.apps.j1lk3njp.eastus.aroapp.io/geoserver/schemas/wfs/2.0/wfs.xsd http://inspire.ec.europa.eu/schemas/inspire_dls/1.0 https://inspire.ec.europa.eu/schemas/inspire_dls/1.0/inspire_dls.xsd"
      xmlns:xml="http://www.w3.org/XML/1998/namespace"
      xmlns:inspire_dls="http://inspire.ec.europa.eu/schemas/inspire_dls/1.0" xmlns:inspire_common="http://inspire.ec.europa.eu/schemas/common/1.0" xmlns:core="core">
  
      <ows:ServiceIdentification>
          <ows:Title>Sample WFS</ows:Title>
          <ows:Abstract/>This is a sample WFS capabilities document for testing.</ows:Abstract>
          <ows:ServiceType>WFS</ows:ServiceType>
          <ows:ServiceTypeVersion>2.0.0</ows:ServiceTypeVersion>
      </ows:ServiceIdentification>
  
      <ows:ServiceProvider>
          <ows:ProviderName>Test Provider</ows:ProviderName>
      </ows:ServiceProvider>
  
      <ows:OperationsMetadata>
          <ows:Operation name="GetCapabilities">
              <ows:DCP>
                  <ows:HTTP>
                      <ows:Get xlink:href="http://example.com/wfs"/>
                  </ows:HTTP>
              </ows:DCP>
          </ows:Operation>
      </ows:OperationsMetadata>
  
      <FeatureTypeList>
          <FeatureType>
              <Name>core:buildings</Name>
              <Title>buildings</Title>
              <Abstract/>
              <ows:Keywords>
                <ows:Keyword>features</ows:Keyword>
                <ows:Keyword>buildings</ows:Keyword>
              </ows:Keywords>
              <DefaultCRS>urn:ogc:def:crs:EPSG::4326</DefaultCRS>
              <ows:WGS84BoundingBox>
                  <ows:LowerCorner>-180.0 -90.0</ows:LowerCorner>
                  <ows:UpperCorner>180.0 90.0</ows:UpperCorner>
              </ows:WGS84BoundingBox>
              <MetadataURL xlink:href="mockurl.com"/>
          </FeatureType>
      </FeatureTypeList>
    </wfs:WFS_Capabilities>`;

  const formattedFeatureTypesJson = [
    {
      name: "core:buildings",
      title: "buildings",
      abstract: '',
      defaultCRS: "urn:ogc:def:crs:EPSG::4326",
      keywords: ['features', 'buildings'],
      wgs84BoundingBox:
      {
        lowerCorner: [-180.0, -90.0],
        upperCorner: [180.0, 90.0]
      },
      metadataUrl: "mockurl.com",
    }
  ];

  const notFormmatedfeatureTypesJson = {
    featureType: [{
      name: {
        namespaceURI: "core",
        localPart: "buildings",
        prefix: "core",
        key: "{core}buildings",
        string: "{core}core:buildings"
      },
      title: [
        {
          "value": "buildings"
        }
      ],
      _abstract: [
        {
          "value": ""
        }
      ],
      keywords: [
        {
          "keyword": [
            {
              "value": "features"
            },
            {
              "value": "buildings"
            }
          ]
        }
      ],
      defaultCRS: "urn:ogc:def:crs:EPSG::4326",
      wgs84BoundingBox: [
        {
          "lowerCorner": [-180, -90],
          "upperCorner": [180, 90]
        }
      ],
      metadataURL: [
        {
          "href": "mockurl.com"
        }
      ]
    }]
  };

  describe('Request generation', () => {
    const getCapabilitiesRequest = wfsClient200.GetCapabilitiesRequest();

    it('should return a defined request object', () => {
      expect(getCapabilitiesRequest).toBeDefined();
    });

    it('should have a valid baseUrl and HTTP GET method', () => {
      const urlRegex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
      expect(getCapabilitiesRequest.baseUrl).toBeDefined();
      expect(getCapabilitiesRequest.method).toBe('GET');
      expect(getCapabilitiesRequest.baseUrl.match(urlRegex)).toBeTruthy();
    });

    // it('should contain expected parameters', () => {
    it('should contain expected parameters, exceptions and version', () => {
      expect(getCapabilitiesRequest.params).toBeDefined();
      expect(getCapabilitiesRequest.params?.exceptions).toEqual('application/json');
      expect(getCapabilitiesRequest.params?.version).toEqual('2.0.0');
    });
  });

  describe('Response parsing', () => {
    it('should correctly parse XML to JSON using xmlToJson, with formmated featureTypeList', () => {
      const json = wfsClient200.xmlToJson(getCapabilitiesResponseXml200);
      expect(json).toBeDefined();
      expect(json.featureTypeList).toEqual(formattedFeatureTypesJson);
    });
    
    it('should correctly parse XML to JSON using xmlToJson, without formmated featureTypeList', () => {
      const json = wfsClient200.xmlToJson(getCapabilitiesResponseXml200, false);
      expect(json).toBeDefined();
      expect(json.featureTypeList).toEqual(notFormmatedfeatureTypesJson);
    });
  });
});

describe('GetFeature', () => {
  const getFeatureReq = `<GetFeature xmlns=\"http://www.opengis.net/wfs/2.0\" service=\"WFS\" version=\"2.0.0\" outputFormat=\"application/json\" startIndex=\"300\" count=\"500\" xmlns:ns1=\"http://www.w3.org/2001/XMLSchema-instance\" ns1:schemaLocation=\"http://www.opengis.net/wfs/2.0 http://schemas.opengis.net/wfs/2.0/wfs.xsd\"><Query typeNames=\"core:buildings\" xmlns:core=\"core\"><Filter xmlns=\"http://www.opengis.net/fes/2.0\"><And><BBOX><ValueReference>geom</ValueReference><Envelope xmlns=\"http://www.opengis.net/gml/3.2\" srsName=\"EPSG\"><lowerCorner>-180 -90</lowerCorner><upperCorner>180 90</upperCorner></Envelope></BBOX><Intersects><ValueReference>geom</ValueReference><Polygon xmlns=\"http://www.opengis.net/gml/3.2\" srsName=\"EPSG:4326\"><exterior><LinearRing srsName=\"EPSG:4326\"><posList srsDimension=\"2\">35.28685467327085 32.613825853105666 35.28685467327085 32.608815506513025 35.29491077260772 32.608815506513025 35.29491077260772 32.613825853105666 35.28685467327085 32.613825853105666</posList></LinearRing></exterior></Polygon></Intersects></And></Filter><SortBy><SortProperty><ValueReference>id</ValueReference><SortOrder>asc</SortOrder></SortProperty><SortProperty><ValueReference>nillable</ValueReference><SortOrder>desc</SortOrder></SortProperty></SortBy></Query></GetFeature>`
  const extent: Extent = [-180, -90, 180, 90];
  const geometry = new Geom.Polygon([
    [
      [
        35.28685467327085,
        32.613825853105666
      ],
      [
        35.28685467327085,
        32.608815506513025
      ],
      [
        35.29491077260772,
        32.608815506513025
      ],
      [
        35.29491077260772,
        32.613825853105666
      ],
      [
        35.28685467327085,
        32.613825853105666
      ]
    ]
  ]);

  const getFeatureRequest = wfsClient200.GetFeatureRequest({
    featureNS: 'core',
    featurePrefix: 'core',
    featureTypes: ['core:buildings'],
    startIndex: 300,
    outputFormat: 'application/json',
    sortBy: [['id', 'asc'], ['nillable', 'desc']],
    filter: Filter.and(
      Filter.bbox('geom', extent, 'EPSG'),
      Filter.intersects('geom', geometry, 'EPSG:4326')
    )
  });

  it('should return a defined request object', () => {
    expect(getFeatureRequest).toBeDefined();
  });

  it('should contain expected body', () => {
    expect(getFeatureRequest.body).toBe(getFeatureReq);
  });

  it('should contain expected parameters', () => {
    expect(getFeatureRequest.baseUrl).toBe(BASE_URL);
    expect(getFeatureRequest.method).toBe('POST');
    expect(getFeatureRequest.params?.exceptions).toEqual('application/json');
  });
});

describe('DescribeFeatureType', () => {
  const describeFeatureTypeRequest = wfsClient200.DescribeFeatureTypeRequest(['buildings', 'roads']);

  it('should return a defined request object', () => {
    expect(describeFeatureTypeRequest).toBeDefined();
  });

  it('should contain expected parameters', () => {
    const typeNames = 'buildings,roads';

    expect(describeFeatureTypeRequest.params?.typeNames).toBe(typeNames);
    expect(describeFeatureTypeRequest).toBeDefined();
  });
});