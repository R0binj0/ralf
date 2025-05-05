'use client';

import { useState, useEffect } from 'react';
import { Monster } from '@/app/services/monsterService';
import Image from 'next/image';
const Monsters = () => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMonster, setNewMonster] = useState({
    title: '',
    description: '',
    behavior: '',
    habitat: '',
    image: null as string | null
  });

  useEffect(() => {
    fetchMonsters();
  }, []);

  const fetchMonsters = async () => {
    try {
      const response = await fetch('/api/monsters');
      if (!response.ok) throw new Error('Failed to fetch monsters');
      const data = await response.json();
      setMonsters(data);
    } catch (err) {
      console.error('Error fetching monsters:', err);
      setError('Failed to load monsters');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/monsters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMonster),
      });

      if (!response.ok) throw new Error('Failed to create monster');
      
      const createdMonster = await response.json();
      setMonsters([...monsters, createdMonster]);
      setNewMonster({
        title: '',
        description: '',
        behavior: '',
        habitat: '',
        image: null
      });
    } catch (error) {
      console.error('Error creating monster:', error);
      setError('Failed to create monster');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Monsters</h1>
      
      {/* Add Monster Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Monster</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newMonster.title}
              onChange={(e) => setNewMonster({...newMonster, title: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newMonster.description}
              onChange={(e) => setNewMonster({...newMonster, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Behavior</label>
            <textarea
              value={newMonster.behavior}
              onChange={(e) => setNewMonster({...newMonster, behavior: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Habitat</label>
            <input
              type="text"
              value={newMonster.habitat}
              onChange={(e) => setNewMonster({...newMonster, habitat: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Monster
          </button>
        </form>
      </div>

      {/* Monsters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monsters.map((monster) => (
          <div key={monster.id} className="bg-white rounded-lg shadow-md p-6">
            <Image src={"/img/" + monster.id + ".png"} alt={monster.title} width={100} height={100} />
            <h2 className="text-xl font-semibold mb-2">{monster.title}</h2>
            <p className="text-gray-600 mb-4">{monster.description}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Behavior:</span> {monster.behavior}
              </p>
              {monster.habitat && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Habitat:</span> {monster.habitat}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monsters;