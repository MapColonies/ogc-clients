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
          <ows:Abstract>This is a sample WFS capabilities document for testing.</ows:Abstract>
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
              <Title>Buildings</Title>
              <DefaultCRS>urn:ogc:def:crs:EPSG::4326</DefaultCRS>
              <ows:WGS84BoundingBox>
                  <ows:LowerCorner>-180.0 -90.0</ows:LowerCorner>
                  <ows:UpperCorner>180.0 90.0</ows:UpperCorner>
              </ows:WGS84BoundingBox>
          </FeatureType>
      </FeatureTypeList>
    </wfs:WFS_Capabilities>`;

  const expectedJson = {
    featureType: [
      {
        name: {
          namespaceURI: "core",
          localPart: "buildings",
          prefix: "core",
          key: "{core}buildings",
          string: "{core}core:buildings"
        },
        title: [
          {
            value: "Buildings"
          }
        ],
        defaultCRS: "urn:ogc:def:crs:EPSG::4326",
        wgs84BoundingBox: [
          {
            lowerCorner: [-180.0, -90.0],
            upperCorner: [180.0, 90.0]
          }
        ]
      }
    ]
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

    it('should contain expected parameters', () => {
      expect(getCapabilitiesRequest.params).toBeDefined();
      expect(getCapabilitiesRequest.params?.exceptions).toEqual('application/json');
      expect(getCapabilitiesRequest.params?.version).toEqual('2.0.0');
    });
  });

  describe('Response parsing', () => {
    it('should correctly parse XML to JSON using xmlToJson', () => {
      expect(getCapabilitiesResponseXml200).toBeDefined();
      const json = wfsClient200.xmlToJson(getCapabilitiesResponseXml200);
      expect(json.featureTypeList).toEqual(expectedJson);
    })
  });
});

describe('GetFeature', () => {
  const extent: Extent = [-180, -90, 180, 90];
  const geometry = new Geom.Polygon([
    [
      [
        6.609085800757157,
        20.548381396523084
      ],
      [
        15.240318467486333,
        5.11590215012076
      ],
      [
        29.99934901925451,
        15.087905911998007
      ],
      [
        24.121708960844103,
        21.80665402351343
      ],
      [
        6.609085800757157,
        20.548381396523084
      ]
    ]
  ]);

  const getFeatureReq = `<GetFeature xmlns="http://www.opengis.net/wfs/2.0" service="WFS" version="2.0.0" outputFormat="application/json" count="500" xmlns:ns1="http://www.w3.org/2001/XMLSchema-instance" ns1:schemaLocation="http://www.opengis.net/wfs/2.0 http://schemas.opengis.net/wfs/2.0/wfs.xsd"><Query typeNames="core:buildings" xmlns:core="core"><Filter xmlns="http://www.opengis.net/fes/2.0"><Or><BBOX><ValueReference>geom</ValueReference><Envelope xmlns="http://www.opengis.net/gml/3.2" srsName="ESPG"><lowerCorner>-180 -90</lowerCorner><upperCorner>180 90</upperCorner></Envelope></BBOX><Intersects><ValueReference>geom</ValueReference><Polygon xmlns="http://www.opengis.net/gml/3.2"><exterior><LinearRing><posList srsDimension="2">6.609085800757157 20.548381396523084 15.240318467486333 5.11590215012076 29.99934901925451 15.087905911998007 24.121708960844103 21.80665402351343 6.609085800757157 20.548381396523084</posList></LinearRing></exterior></Polygon></Intersects></Or></Filter></Query></GetFeature>`

  const getFeatureRequest = wfsClient200.GetFeatureRequest({
    featureNS: 'core',
    featurePrefix: 'core',
    featureTypes: ['core:buildings'],
    outputFormat: 'application/json',
    filter: Filter.or(
      Filter.bbox('geom', extent, 'ESPG'),
      Filter.intersects('geom', geometry)
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
})