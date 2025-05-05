export interface Marker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  added: string;
  edited: string;
}

// In-memory storage for markers
let markers: Marker[] = [];

export const getMarkers = async (): Promise<Marker[]> => {
  return markers;
};

export const getMarker = async (id: string): Promise<Marker | null> => {
  return markers.find(marker => marker.id === id) || null;
};

export const createMarker = async (
  name: string,
  latitude: number,
  longitude: number,
  description: string
): Promise<Marker> => {
  const newMarker: Marker = {
    id: Date.now().toString(),
    name,
    latitude,
    longitude,
    description,
    added: new Date().toISOString(),
    edited: new Date().toISOString(),
  };
  
  markers.push(newMarker);
  return newMarker;
};

export const updateMarker = async (
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  description: string
): Promise<Marker | null> => {
  const markerIndex = markers.findIndex(marker => marker.id === id);
  
  if (markerIndex === -1) return null;
  
  markers[markerIndex] = {
    ...markers[markerIndex],
    name,
    latitude,
    longitude,
    description,
    edited: new Date().toISOString(),
  };
  
  return markers[markerIndex];
};

export const deleteMarker = async (id: string): Promise<boolean> => {
  const initialLength = markers.length;
  markers = markers.filter(marker => marker.id !== id);
  return markers.length !== initialLength;
}; 