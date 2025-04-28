import { Version } from "./interfaces";
const WFS_2_0 = require('ogc-schemas').WFS_2_0;
const GML_3_1_1 = require('ogc-schemas').GML_3_1_1;
const XLink_1_0 = require('w3c-schemas').XLink_1_0;
const XSD_1_0 = require('w3c-schemas').XSD_1_0;
const SMIL_2_0_Language = require('ogc-schemas').SMIL_2_0_Language;
const SMIL_2_0 = require('ogc-schemas').SMIL_2_0;
const Filter_2_0 = require('ogc-schemas').Filter_2_0;
const Filter_1_1_0 = require('ogc-schemas').Filter_1_1_0;
// const OWS_2_0 = require('ogc-schemas').OWS_2_0;
const OWS_1_1_0 = require('ogc-schemas').OWS_1_1_0;
const WFS_1_1_0 = require('ogc-schemas').WFS_1_1_0;
const OWS_1_0_0 = require('ogc-schemas').OWS_1_0_0;

const Jsonix = require('jsonix').Jsonix;

export const getJsonixContext = (version: Version): Record<string, unknown> => {

  if (version === '1.1.0') {
    return new Jsonix.Context([
      XLink_1_0,
      OWS_1_0_0,
      Filter_1_1_0,
      GML_3_1_1,
      SMIL_2_0,
      SMIL_2_0_Language,
      WFS_1_1_0
    ]);
  } else if (version === '2.0.0') {
    return new Jsonix.Context([
      XSD_1_0,
      XLink_1_0,
      OWS_1_1_0,
      // OWS_2_0,
      Filter_2_0,
      SMIL_2_0,
      SMIL_2_0_Language,
      GML_3_1_1,
      WFS_2_0,
    ]);
  }

  return {};
};