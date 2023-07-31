import * as React from 'react';
import Head from 'next/head';
import Map, {Layer, MapLayerMouseEvent, MapRef, Source} from 'react-map-gl';
import {useCallback, useRef} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import zones from '../../zones.json';

import { MAPBOX_ACCESS_TOKEN } from '../../mapboxtoken';

export default function Home() {
  const mapRef = useRef<MapRef>(null);

  let hoveredZoneId: number | null = null;
  const handleMouseMove = (event: MapLayerMouseEvent) => {
    if (mapRef.current && event.features && event.features.length > 0 && event.features[0].properties && event.features[0]?.id) {
      mapRef.current.getCanvas().style.cursor = 'pointer';

      if (hoveredZoneId) {
        mapRef.current.removeFeatureState(
          {
            source: 'zones-src',
            id: hoveredZoneId
          }
        );
      }

      hoveredZoneId = Number(event.features[0].id);

      console.log("2")
      mapRef.current.setFeatureState(
        {
          source: 'zones-src',
          id: hoveredZoneId
        },
        {
          hover: true
        }
      );
    }
  }

  return (
    <div className="flex w-full h-full">
      <Head>
        <title>react-map-gl example</title>
      </Head>
      <Map
        ref={mapRef}
        onMouseMove={(e) => handleMouseMove(e)}
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
        <Source id="zones-src" type="geojson" data={zones}>
          <Layer
            id="zones"
            type="line"
          />
        </Source>
      </Map>
    </div>
  );
}
