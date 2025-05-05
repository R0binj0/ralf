import monstersData from '@/public/data.json';

export interface Monster {
  id: number;
  title: string;
  image: string | null;
  description: string;
  behavior: string;
  habitat: string | null;
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cache: {
  data: Monster[];
  timestamp: number;
} | null = null;

export const getMonsters = async (limit?: number): Promise<Monster[]> => {
  // Check cache
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return limit ? cache.data.slice(0, limit) : cache.data;
  }

  // If no cache or cache expired, create new cache
  const data = monstersData as Monster[];
  cache = {
    data,
    timestamp: Date.now(),
  };

  return limit ? data.slice(0, limit) : data;
};

export const getMonster = async (id: number): Promise<Monster | null> => {
  const monsters = await getMonsters();
  return monsters.find(monster => monster.id === id) || null;
};

export const searchMonsters = async (query: string): Promise<Monster[]> => {
  const monsters = await getMonsters();
  const searchTerm = query.toLowerCase();
  
  return monsters.filter(monster => 
    monster.title.toLowerCase().includes(searchTerm) ||
    monster.description.toLowerCase().includes(searchTerm) ||
    monster.behavior.toLowerCase().includes(searchTerm) ||
    (monster.habitat && monster.habitat.toLowerCase().includes(searchTerm))
  );
}; 