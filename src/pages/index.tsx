import * as React from 'react';
import Head from 'next/head';
import Map, {Layer, MapLayerMouseEvent, MapRef, Source} from 'react-map-gl';
import { useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import zones from '../../london_zones.json';
import centroids from '../../london_centroids.json';
import { MAPBOX_ACCESS_TOKEN } from '../../mapboxtoken';

export default function Home() {
  const mapRef = useRef<MapRef>(null);
  const unHoveredColor = ""
  const councilData = useState({});

  const handleMapLoad = () => {

    const fetchResult = fetch(`/api/councils`, {})
    .then((response) => response.json().then((data) => {
      const features = mapRef.current?.querySourceFeatures('zones', {
        sourceLayer: 'zone-fills',
      });

      data.results.forEach((notionZone: any) => {
        features?.forEach((featureZone) => {
          if (notionZone.properties.Name.title[0].plain_text === featureZone.properties?.name) {
            mapRef.current?.setFeatureState(
              { source: 'zones', id: featureZone.id },
              { status: notionZone.properties.Status.status.name,
                color: notionZone.properties.Status.status.color,
                url: notionZone.url
              }
            );
          }
        });
      });
    }));

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
          const featureState = mapRef.current?.getFeatureState(
            { source: 'zones', id: e.features[0]?.id}
          );
          const url = featureState?.url;
          if (url) {
            window.open(url, '_blank');
          }
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
        mapStyle="mapbox://styles/jolerus/clh4z2ham00pl01quabbchxqc/draft"
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
                  'case', ['==', ['feature-state', 'url'], null], 0,
                  ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.3],
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
              'line-color': '#000000',
              'line-width': 2}
            }}
          />
        </Source>
        <Source id="centroids" type="geojson" data={centroids}>
          <Layer
              {... {
                'id': 'poi-labels',
                'type': 'symbol',
                'source': 'places',
                'layout': {
                  'text-field': ['get', 'name'],
                  'text-variable-anchor': ['bottom'],
                  'text-radial-offset': 0.5,
                  'text-justify': 'auto',
                }
              }}
            />
        </Source>
      </Map>
    </div>
  );
}
