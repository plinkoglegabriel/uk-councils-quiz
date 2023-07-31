import * as React from 'react';
import Head from 'next/head';
import Map, {Layer, MapLayerMouseEvent, MapRef, Source} from 'react-map-gl';
import {useCallback, useRef} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import zones from '../../zones.json';

import { MAPBOX_ACCESS_TOKEN } from '../../mapboxtoken';
import mapboxgl from 'mapbox-gl';

export default function Home() {
  const mapRef = useRef<MapRef>(null);

  const handleMapLoad = () => {
    let hoveredPolygonId: number | null = null;
    mapRef.current?.on('mousemove', 'zone-fills', (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredPolygonId !== null) {
          mapRef.current?.setFeatureState(
            { source: 'zones', id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = Number(e.features[0].id);
        mapRef.current?.setFeatureState(
          { source: 'zones', id: hoveredPolygonId },
          { hover: true }
        );
      }
      });
      
      mapRef.current?.on('mouseleave', 'zone-fills', () => {
        if (hoveredPolygonId !== null) {
          mapRef.current?.setFeatureState(
            { source: 'zones', id: hoveredPolygonId },
            { hover: false }
          );
        }
      hoveredPolygonId = null;
      });

      mapRef.current?.on('click', 'zone-fills', (e) => {
        if (e.features && e.features.length > 0) {
          console.log(e.features[0].properties?.name);
        }
      });
  }

  return (
    <div className="flex w-full h-full">
      <Head>
        <title>react-map-gl example</title>
      </Head>
      <Map
        ref={mapRef}
        onLoad={handleMapLoad}
        initialViewState={{
          latitude: 51.48,
          longitude: -0.115,
          zoom: 9.5
        }}
        interactiveLayerIds={["zones"]}
        style={{left: 0, width: "100vw", height: "100vh"}}
        mapStyle="mapbox://styles/jolerus/clh4z2ham00pl01quabbchxqc"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        <Source id="zones" type="geojson" data={zones}>
          <Layer
            {... {'id': 'zone-fills',
              'type': 'fill',
              'source': 'states',
              'layout': {},
              'paint': {
                'fill-color': '#627BC1',
                'fill-opacity': [
                  'case', ['boolean', ['feature-state', 'hover'], false], 1, 0.5
                ]
              },
            }}
          />
          <Layer
            {... {
              'id': 'zone-borders',
              'type': 'line',
              'source': 'states',
              'layout': {},
              'paint': {
              'line-color': '#627BC1',
              'line-width': 2}
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
