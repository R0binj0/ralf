'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Marker as MarkerType, createMarker } from '../services/mapService';

interface MapComponentProps {
  markers: MarkerType[];
  onMarkerAdded: (marker: MarkerType) => void;
  onMarkerClick: (marker: MarkerType) => void;
}

export default function MapComponent({ markers, onMarkerAdded, onMarkerClick }: MapComponentProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [markerLayer, setMarkerLayer] = useState<L.LayerGroup | null>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Fix for Leaflet marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const mapInstance = L.map('map').setView([58.3776, 26.7290], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      const layerGroup = L.layerGroup().addTo(mapInstance);
      setMap(mapInstance);
      setMarkerLayer(layerGroup);

      return () => {
        mapInstance.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (map && markerLayer) {
      markerLayer.clearLayers();

      markers.forEach(marker => {
        const markerIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">${markers.indexOf(marker) + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const mapMarker = L.marker([marker.latitude, marker.longitude], { icon: markerIcon })
          .addTo(markerLayer)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold">${marker.name}</h3>
              <p>${marker.description}</p>
              <button class="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onclick="window.dispatchEvent(new CustomEvent('markerClick', { detail: '${marker.id}' }))">
                View Details
              </button>
            </div>
          `);

        mapMarker.on('click', () => {
          onMarkerClick(marker);
        });
      });
    }
  }, [map, markerLayer, markers, onMarkerClick]);

  useEffect(() => {
    if (map && isAddingMarker) {
      const clickHandler = async (e: L.LeafletMouseEvent) => {
        const name = prompt('Enter marker name:');
        if (!name) {
          setIsAddingMarker(false);
          return;
        }

        const description = prompt('Enter marker description:');
        if (!description) {
          setIsAddingMarker(false);
          return;
        }

        const newMarker = await createMarker(
          name,
          e.latlng.lat,
          e.latlng.lng,
          description
        );
        onMarkerAdded(newMarker);
        setIsAddingMarker(false);
      };

      map.on('click', clickHandler);
      return () => {
        map.off('click', clickHandler);
      };
    }
  }, [map, isAddingMarker, onMarkerAdded]);

  return (
    <div className="space-y-4">
      <div id="map" className="h-[600px] w-full rounded-lg shadow-lg"></div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setIsAddingMarker(!isAddingMarker)}
          className={`px-4 py-2 rounded-lg text-white font-semibold shadow-lg ${
            isAddingMarker
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isAddingMarker ? 'Cancel Adding Marker' : 'Add Marker'}
        </button>
        {isAddingMarker && (
          <div className="bg-gray-100 p-2 rounded-lg text-sm text-gray-600">
            Click on the map to add a marker
          </div>
        )}
      </div>
    </div>
  );
} 