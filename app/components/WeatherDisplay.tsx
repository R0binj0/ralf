import { WeatherData } from '../services/weatherService';
interface WeatherDisplayProps {
  weatherData: WeatherData;
}

export default function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  const { main, weather, name, sys } = weatherData;
  const weatherDescription = weather[0].description;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {name}, {sys.country}
          </h2>
          <p className="text-gray-600 capitalize">{weatherDescription}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-4xl font-bold text-gray-800">
          {Math.round(main.temp)}°C
        </div>
      </div>
    </div>
  );
} 