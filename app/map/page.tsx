'use client';

import { useState, useEffect } from 'react';
import { Marker, getMarkers } from '../services/mapService';
import MapComponent from '../components/MapComponent';
import MarkerDetails from '../components/MarkerDetails';

export default function Map() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    const fetchedMarkers = await getMarkers();
    setMarkers(fetchedMarkers);
  };

  const handleMarkerAdded = (marker: Marker) => {
    setMarkers(prevMarkers => [...prevMarkers, marker]);
  };

  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
  };

  const handleMarkerUpdate = (updatedMarker: Marker) => {
    setMarkers(prevMarkers =>
      prevMarkers.map(marker =>
        marker.id === updatedMarker.id ? updatedMarker : marker
      )
    );
  };

  const handleMarkerDelete = (id: string) => {
    setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Map</h1>
      
      <div className="relative">
        <MapComponent
          markers={markers}
          onMarkerAdded={handleMarkerAdded}
          onMarkerClick={handleMarkerClick}
        />
        
        {selectedMarker && (
          <div className="absolute top-4 left-4 z-10">
            <MarkerDetails
              marker={selectedMarker}
              onUpdate={handleMarkerUpdate}
              onDelete={handleMarkerDelete}
              onClose={() => setSelectedMarker(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}