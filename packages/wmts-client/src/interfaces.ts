export interface GetTileRequest {
  layer: string;
  style: string;
  format: string;
  tileMatrixSet: string;
  tileMatrix: string;
  tileRow: number;
  tileCol: number;
}

export interface GetFeatureInfoRequest extends GetTileRequest {
  infoFormat: string;
  i: number;
  j: number;
}
