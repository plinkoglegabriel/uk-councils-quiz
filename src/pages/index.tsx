import * as React from 'react';
import Head from 'next/head';
import Map, {Layer, LineLayer, Marker, Source} from 'react-map-gl';
import {useRef} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import zones from '../../zones.json';

import { MAPBOX_ACCESS_TOKEN } from '../../mapboxtoken';

export default function Home() {
  const mapRef = useRef(null);

  return (
    <div className="flex w-full h-full">
      <Head>
        <title>react-map-gl example</title>
      </Head>
      <Map
        ref={mapRef}
        
        initialViewState={{
          latitude: 51.48,
          longitude: -0.115,
          zoom: 9.5
        }}
        style={{left: 0, width: "100vw", height: "100vh"}}
        mapStyle="mapbox://styles/jolerus/clh4z2ham00pl01quabbchxqc"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        <Source id="zones" type="geojson" data={zones}>
          <Layer
            id="zones"
            type="line"
          />
        </Source>
      </Map>
    </div>
  );
}
