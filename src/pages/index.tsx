import * as React from 'react';
import Head from 'next/head';
import Map, {Layer, MapLayerMouseEvent, MapRef, Source} from 'react-map-gl';
import {useCallback, useRef} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import zones from '../../zones.json';

import { MAPBOX_ACCESS_TOKEN } from '../../mapboxtoken';

export default function Home() {
  const mapRef = useRef<MapRef>(null);

  const handleMouseMove = (event: MapLayerMouseEvent) => {
    console.log("mousemove");
    if (mapRef.current && event.features && event.features.length > 0 && event.features[0].properties) {
      mapRef.current.getCanvas().style.cursor = 'pointer';
      console.log(event.features[0]);
    
      // If quakeID for the hovered feature is not null,
      // use removeFeatureState to reset to the default behavior
      // if (quakeID) {
      //   map.removeFeatureState({
      //     source: 'earthquakes',
      //     id: quakeID
      //   });
      // }
    
      // quakeID = event.features[0].id;
    
      // // When the mouse moves over the earthquakes-viz layer, update the
      // // feature state for the feature under the mouse
      // map.setFeatureState(
      //   {
      //     source: 'earthquakes',
      //     id: quakeID
      //   },
      //   {
      //     hover: true
      //   }
      // );
    }
  }


  const onMapLoad = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.on('mousemove', 'earthquakes-viz', (event) => {

      });
    }
  }, []);

  return (
    <div className="flex w-full h-full">
      <Head>
        <title>react-map-gl example</title>
      </Head>
      <Map
        ref={mapRef}
        onMouseMove={handleMouseMove}
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
