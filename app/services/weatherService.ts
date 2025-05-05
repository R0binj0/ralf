import { cache } from 'react';

export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  name: string;
  sys: {
    country: string;
  };
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const CACHE_DURATION = 5 * 60 * 1000;

const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();

export const getWeatherData = cache(async (city: string) => {
  const cacheKey = city.toLowerCase();
  const cachedData = weatherCache.get(cacheKey);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: WeatherData = await response.json();

    weatherCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}); 