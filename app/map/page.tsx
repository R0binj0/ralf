'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Marker } from '../services/mapService';
import { getMarkers } from '../services/mapService';
import MarkerDetails from '../components/MarkerDetails';

// Dynamically import MapComponent with no SSR
const MapComponent = dynamic(
  () => import('../components/MapComponent'),
  { ssr: false }
);

export default function Map() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  useEffect(() => {
    const loadMarkers = async () => {
      const loadedMarkers = await getMarkers();
      setMarkers(loadedMarkers);
    };
    loadMarkers();
  }, []);

  const handleMarkerAdded = (marker: Marker) => {
    setMarkers([...markers, marker]);
  };

  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
  };

  const handleMarkerUpdated = (updatedMarker: Marker) => {
    setMarkers(markers.map(m => m.id === updatedMarker.id ? updatedMarker : m));
    setSelectedMarker(null);
  };

  const handleMarkerDeleted = (markerId: string) => {
    setMarkers(markers.filter(m => m.id !== markerId));
    setSelectedMarker(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Map</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MapComponent
            markers={markers}
            onMarkerAdded={handleMarkerAdded}
            onMarkerClick={handleMarkerClick}
          />
        </div>
        <div className="lg:col-span-1">
          {selectedMarker && (
            <MarkerDetails
              marker={selectedMarker}
              onUpdate={handleMarkerUpdated}
              onDelete={handleMarkerDeleted}
              onClose={() => setSelectedMarker(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}