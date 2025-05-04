# 🌐 OGC-CLIENTS
This clients library meant for simplify working with OGC protocols.

# 📦 WFS-CLIENT
This package provides a client-side API for OGC WFS services, written in TypeScript.

> This client library is based on [Jsonix](https://github.com/highsource/jsonix), [ogc-schemas](https://github.com/highsource/ogc-schemas) and [ol](https://github.com/openlayers/openlayers/tree/main) libraries.

✨ Code samples are provided by Javascript.

## 🚀 Installation
### 1. Install the package via NPM
  ```sh
  npm install @map-colonies/wfs-client --save
  ```
### 2. ⚠️ Apply integrated PATCHES
  These steps are based on the following prerequisites:
  - **npm** as package manager.
  - **copyfiles** package to copy files.
  - **patch-package** package to apply relevant patches.

  The following **scripts** in **package.json** demonstrate how and when perform necessary actions.
  ```json
  "scripts": {
    .
    .
    .
    "postinstall": "npm run patch:deps",
    // In this example, we use the copyfiles package to copy files.
    // If you're in a web environment, add this:
    "patch:deps": "copyfiles -u 4 ./node_modules/@map-colonies/wfs-client/dist/patches/* . && patch-package",
    // For a server environment, use this command instead:
    "patch:deps": "copyfiles -u 4 ./node_modules/@map-colonies/wfs-client/dist/patches/jsonix+3.0.0.patch . && copyfiles -u 4 ./node_modules/@map-colonies/wfs-client/dist/patches/ol+10.4.0.patch . && patch-package"
  }
  ```


## 💡 Importrant for Web Users

### If you're in a web environment, you should include polyfills for Node.js core modules, if your environment does not already provide them (e.g. working with webpack 5+).

## 🔧 WFS Client API's
### 🌐 GetCapabilities (WFS Operation)
Accepts only an optional exceptions parameter and returns a ready-to-use GetCapabilities request.

### 🌐 DescribeFeatureType (WFS Operation)
Accepts type names as an array of strings, an optional exceptions parameter, and an optional outputFormat (defaulting to 'application/json'), and returns a ready-to-use DescribeFeatureType request.

The default format for GetFeature is application/json.

### 🌐 GetFeature (WFS Operation)
Accepting GetFeatureRequest for building GetFeature request.
If not specified, the default count/maxFeatures value will be 500.
The default format for GetFeature response is application/json.

🔔 **Note:** Each of the **WFS Operations** API's accepts an optional ```exceptions``` parameter to specify the format of exceptions. If not provided, the default format is ```'application/json'```.

### 🌐 xmlToJson
xmlToJson function - accepts an XML string and an optional formatFeatures parameter to better align features in the feature list with the OGC WFS format.

🔔 **Note:** Currently, the ```xmlToJson``` function only supports parsing XML responses from ```GetCapabilities``` and ```DescribeFeatureType``` requests.  
However, it is **recommended to use this function only with** ```GetCapabilities```, which does not support native JSON output.  
If you want to receive the response in JSON format, for ```DescribeFeatureType``` and ```GetFeature``` recommended to use ```outputFormat: 'application/json'``` option instead of calling xmlToJson().

## 📚 Usage Examples

### ▶️ GetCapabilities
  ```typescript
  import { WfsClient } from '@map-colonies/wfs-client';

  const wfsClient200 = new WfsClient('2.0.0', BASE_URL);
  const getCapabilitiesRequest = wfsClient200.GetCapabilitiesRequest();

  // Execute the request using any executor (e.g. fetch, axios)
  ```

### ▶️ GetFeature
  ```typescript
  import { WfsClient, Geom, Filter } from '@map-colonies/wfs-client';

  const BASE_URL = 'https://mockUrl';
  const wfsClient200 = new WfsClient('2.0.0', BASE_URL);
  const extent = [-180, -90, 180, 90];
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

  // Execute the request using any executor (e.g. fetch, axios)
  ```


### ▶️ DescribeFeatureType
  ```typescript
  import { WfsClient } from '@map-colonies/wfs-client';

  const wfsClient200 = new WfsClient('2.0.0', BASE_URL);
  const describeFeatureTypeRequest = wfsClient200.DescribeFeatureTypeRequest(['buildings', 'roads']);

  // Execute the request using any executor (e.g. fetch, axios)
  ```


## 🔐 Authentication:
Authentication is not handled by ```wfs-client```.
You can manually append authentication headers or tokens as needed when executing requests.