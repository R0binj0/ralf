'use client';

import { useState } from 'react';
import { Marker, updateMarker, deleteMarker } from '../services/mapService';

interface MarkerDetailsProps {
  marker: Marker;
  onUpdate: (marker: Marker) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function MarkerDetails({ marker, onUpdate, onDelete, onClose }: MarkerDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: marker.name,
    description: marker.description,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMarker = await updateMarker(
      marker.id,
      editData.name,
      marker.latitude,
      marker.longitude,
      editData.description
    );
    if (updatedMarker) {
      onUpdate(updatedMarker);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteMarker(marker.id);
    if (success) {
      onDelete(marker.id);
      onClose();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">Marker Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{marker.name}</h3>
            <p className="text-gray-600">{marker.description}</p>
          </div>
          <div className="text-sm text-gray-500">
            <p>Coordinates: {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}</p>
            <p>Added: {new Date(marker.added).toLocaleString()}</p>
            <p>Last edited: {new Date(marker.edited).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 