import * as http from 'http';
import type { AddressInfo } from 'net';
import { jsLogger, type Logger } from '@map-colonies/js-logger';
import { WmtsClient } from '../../src/wmts-client';

const CAPABILITIES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1">
  <Contents>
    <Layer>
      <ows:Identifier>sample-layer</ows:Identifier>
      <Style isDefault="true">
        <ows:Identifier>default</ows:Identifier>
      </Style>
      <Format>image/png</Format>
      <TileMatrixSetLink>
        <TileMatrixSet>webmercator</TileMatrixSet>
      </TileMatrixSetLink>
      <ResourceURL format="image/png" resourceType="tile" template="https://example.com/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png"/>
    </Layer>
    <TileMatrixSet>
      <ows:Identifier>webmercator</ows:Identifier>
      <TileMatrix>
        <ows:Identifier>0</ows:Identifier>
      </TileMatrix>
    </TileMatrixSet>
  </Contents>
</Capabilities>`;

describe('WmtsClient', () => {
  let logger: Logger;
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    logger = await jsLogger({ enabled: false });
    server = http.createServer((_req, res) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- HTTP header name
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(CAPABILITIES_XML);
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  describe('GetCapabilities', () => {
    it('fetches and parses the WMTS capabilities document', async () => {
      const client = new WmtsClient(logger, baseUrl);

      const capabilities = await client.GetCapabilities();

      expect(capabilities).toHaveLength(1);
      expect(capabilities[0]).toMatchObject({
        id: 'sample-layer',
        format: ['image/png'],
        style: [{ value: 'default', isDefault: 'true' }],
        tileMatrixSet: [{ tileMatrixSetID: 'webmercator', tileMatrixLabels: ['0'] }],
        url: [{ format: 'image/png', resourceType: 'tile', template: 'https://example.com/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png' }],
      });
    });
  });

  describe('GetTile', () => {
    it('rejects as not implemented', async () => {
      const client = new WmtsClient(logger, baseUrl);

      await expect(
        client.GetTile({
          layer: 'sample-layer',
          style: 'default',
          format: 'image/png',
          tileMatrixSet: 'webmercator',
          tileMatrix: '0',
          tileRow: 0,
          tileCol: 0,
        })
      ).rejects.toThrow('not implemented');
    });
  });

  describe('GetFeatureInfo', () => {
    it('rejects as not implemented', async () => {
      const client = new WmtsClient(logger, baseUrl);

      await expect(
        client.GetFeatureInfo({
          layer: 'sample-layer',
          style: 'default',
          format: 'image/png',
          tileMatrixSet: 'webmercator',
          tileMatrix: '0',
          tileRow: 0,
          tileCol: 0,
          infoFormat: 'application/json',
          i: 0,
          j: 0,
        })
      ).rejects.toThrow('not implemented');
    });
  });
});
