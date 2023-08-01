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
  const [loading, setLoading] = useState<Boolean>(true);

  const handleMapLoad = () => {

    const fetchResult = fetch(`/api/councils`, {})
    .then((response) => response.json().then((data) => {
      setLoading(false);
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
      {/* A small spinner in the corner that floats on top of the map and
      goes away when loading state is set to false */}
      {loading && <div role="status" className='absolute top-0 left-0 z-10 m-12'>
          <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>}
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
                  'case', ['boolean', ['to-boolean', ['feature-state', 'url']], false], 
                    ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.3],
                    ['case', ['boolean', ['feature-state', 'hover'], false], 0, 0]
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
