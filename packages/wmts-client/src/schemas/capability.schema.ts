/* eslint-disable @typescript-eslint/naming-convention */
import { z } from 'zod';

export const StyleSchema = z.object({
  value: z.string().min(1).describe('Style identifier value'),
  isDefault: z.string().min(1).nullable().describe('Whether this style is the default style'),
});

export const TileMatrixSetSchema = z.object({
  tileMatrixSetID: z.string().min(1).describe('Identifier of the TileMatrixSet'),
  tileMatrixLabels: z.array(z.string().min(1)).min(1).describe('TileMatrix identifier per level'),
});

export const ResourceURLSchema = z.object({
  format: z.string().min(1).describe('MIME type of the resource'),
  resourceType: z.string().min(1).describe('Type of the resource, e.g. tile'),
  template: z.string().min(1).describe('URL template for the resource'),
});

export const CapabilityWMTSSchema = z.object({
  id: z.string().min(1).describe('Layer identifier'),
  style: z.array(StyleSchema).min(1).describe('Styles available for the layer'),
  format: z.array(z.string().min(1)).min(1).describe('MIME types supported by the layer'),
  tileMatrixSet: z.array(TileMatrixSetSchema).min(1).describe('TileMatrixSets available for the layer'),
  url: z.array(ResourceURLSchema).min(1).describe('Resource URLs available for the layer'),
});

// Inferred TypeScript types
export type Style = z.infer<typeof StyleSchema>;
export type TileMatrixSet = z.infer<typeof TileMatrixSetSchema>;
export type ResourceURL = z.infer<typeof ResourceURLSchema>;
export type CapabilityWMTS = z.infer<typeof CapabilityWMTSSchema>;
