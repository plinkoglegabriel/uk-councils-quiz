import * as React from 'react';
import Head from 'next/head';
import Map, { Layer,  MapRef, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState } from 'react';
import zones from '../../zones.json';
import { MAPBOX_ACCESS_TOKEN } from '../../mapboxtoken';
import convertOSGridPolygon from '../../convertosgridref';
import WelcomePopup from '../components/welcomePopup';
import GuessPopup from '../components/guessPopup';
import Correct from '../components/correct';
import Counter from '../components/counter';
import CongratulationsPopup from '../components/congratulations';

export default function Home() {
  const mapRef = useRef<MapRef>(null);
  // initialise state showWelcomePopup of to true 
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
   // initialise state showGuessPopup to false 
  const [showGuessPopup, setShowGuessPopup] = useState(false);
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  // initialise state isGuessCorrect to false (used to track correctness)
  const [isGuessCorrect, setIsGuessCorrect] = useState(false); 
  const [currentRandomZone, setCurrentRandomZone] = useState(null);
  const [showInitialCorrectPopup, setShowInitialCorrectPopup] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);



  // defining function to close welcome popup, call getting random zone and "fly to" that zone
  const startGame = () => {
    setShowWelcomePopup(false);
    setShowGuessPopup(true); 
    if (showWelcomePopup) {
      setShowInitialCorrectPopup(true); // Set showInitialCorrectPopup to true on the first game start
    }
    const newRandomZone = getRandomZone();
    console.log('Zone:', newRandomZone.properties.LAD23NM.toLowerCase());
    if (mapRef.current && newRandomZone) {
      // const [name] = newRandomZone.properties.LAD23NM;
      // console.log("Name:",name)
      const [longitude, latitude] = newRandomZone.geometry.coordinates[0][0];
      console.log('Longitude:', longitude);
      console.log('Latitude:', latitude);
      try {
        mapRef.current.flyTo({
          center: [longitude, latitude],
          zoom: 7,
          essential: true,
        });
        
        setCurrentRandomZone(newRandomZone); 
      }
      catch(err) {
        setCurrentRandomZone(newRandomZone); 
      }
    }
  };
  
  
  // converting coordinates in zones.json
  const convertedZones = {
    ...zones,
    features: zones.features.map((feature: { geometry: { coordinates: any } }) => {
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: convertOSGridPolygon(feature.geometry.coordinates),
        },
      };
    }),
  };

    // defining function to get random zone
    function getRandomZone() {
      const eligibleZones = convertedZones.features.filter(
        (zone: { id: string }) => !correctAnswers.includes(zone.id)
      );
    
      if (eligibleZones.length === 0) {
        // All zones have been correctly answered; reset the correctAnswers array
        correctAnswers.length = 0;
      }
    
      const randomIndex = Math.floor(Math.random() * eligibleZones.length);
      return eligibleZones[randomIndex];
    }
    
    
    const randomZone = currentRandomZone || getRandomZone();
// assigning colour to randomZone

const colouredZones = convertedZones.features.map((feature) => {
  const isRandomZone = feature.id === randomZone.id;
  const isCorrect = correctAnswers.includes(feature.id);
  const isUnguessed = !isCorrect && !isRandomZone;
  const isIncorrect = incorrectAnswers.includes(feature.id);
  let color;

  if (isRandomZone) {
    color = '#FFFF00'; // yellow for the current zone to guess
  } else if (isCorrect) {
    color = '#3BF084'; // green for correctly guessed zones
  } else if (isIncorrect) {
    color = '#FF0000'; // red for incorrectly guessed zones
  } else if (isUnguessed) {
    color = '#FFFFFF'; // white for unguessed zones
  } else {
    color = '#FFFFFF'; // default to white
  }

  return {
    ...feature,
    properties: {
      ...feature.properties,
      color: color,
    },
  };
});

  const test = {
    "type": "FeatureCollection",
    features: colouredZones,
  };

  // console.log({ convertedZones });
  // console.log('zoneName:', randomZone.properties.LAD23NM);
  // console.log({ convertedCentroids });

  // console.log(colouredZones);
  // console.log(colouredZones.find((feat) => feat.id === randomZone.id));

  return (
    <div className="flex w-full h-full relative">
      <Head>
        <title>Map Quiz</title>
      </Head>
      {/* A small spinner in the corner that floats on top of the map and
      goes away when loading state is set to false */}
      {<div role="status" className='absolute top-0 left-0 z-10 m-12'>
          <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>}
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: 51.48,
          longitude: -0.115,
          zoom: 8
        }}
        style={{ left: 0, width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/jolerus/clh4z2ham00pl01quabbchxqc/draft"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      >
       {showWelcomePopup && <WelcomePopup onStartGame={startGame} />}
       {((showGuessPopup && !showWelcomePopup) || showCorrectPopup) && (
          <GuessPopup
          onGuessSubmit={(isCorrect: boolean) => {
            setShowGuessPopup(false);
            setIsGuessCorrect(isCorrect);
          }}
          randomZone={randomZone}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
        />
        )}
        {isGuessCorrect !== null && !showGuessPopup && showInitialCorrectPopup && (
          <Correct
            isCorrect={isGuessCorrect}
            onNextCouncil={() => {
              setShowCorrectPopup(false); 
              startGame(); 
            }}
            zoneName={randomZone.properties.LAD23NM}
          />
        )}
        <Counter correctCount={correctAnswers.length} />
        {showWelcomePopup && correctAnswers.length === 361 ? (
            <CongratulationsPopup onStartGame={startGame} />
          ) : null}

       <Source id="colored-zones" type="geojson" data={test}>
          <Layer
            {...{
              id: 'zone-fills',
              type: 'fill',
              source: 'colored-zones',
              layout: {},
              paint: {
                'fill-color': ['get', 'color'],
              },
            }}
          />
       </Source>
       <Source id="zones" type="geojson" data={convertedZones}>
          {/* adding WHITE outline to zones */}
          <Layer
            {... {
              'id': 'zone-borders',
              'type': 'line',
              'source': 'zones',
              'layout': {},
              'paint': {
              'line-color': '#000000',
              'line-width': 1}
            }}
          />
        </Source>
      </Map>
    </div>
  );
}