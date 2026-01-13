import axios from "axios";
import type { WeatherData, HourlyForecast } from "../slices/weatherSlice";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_WEATHER_API_KEY is not set. Please configure your API key in environment variables."
    );
  }
  return apiKey;
};

interface OpenWeatherCurrentResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  dt: number;
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: Array<{
      icon: string;
    }>;
  }>;
}

const cityCoordinatesCache: Record<string, { lat: number; lon: number }> = {};

export const getCityCoordinates = async (
  cityName: string
): Promise<{ lat: number; lon: number; name: string; country: string }> => {
  if (cityCoordinatesCache[cityName.toLowerCase()]) {
    const cached = cityCoordinatesCache[cityName.toLowerCase()];
    return {
      ...cached,
      name: cityName,
      country: "",
    };
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct`,
      {
        params: {
          q: cityName,
          limit: 1,
          appid: getApiKey(),
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const city = response.data[0];
      const coords = {
        lat: city.lat,
        lon: city.lon,
        name: city.name,
        country: city.country,
      };
      cityCoordinatesCache[cityName.toLowerCase()] = {
        lat: coords.lat,
        lon: coords.lon,
      };
      return coords;
    }

    throw new Error("City not found");
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to find city");
  }
};

export const fetchCurrentWeather = async (
  cityId: string
): Promise<WeatherData> => {
  const [name, country] = cityId.split(",");
  const coords = await getCityCoordinates(name);

  try {
    const response = await axios.get<OpenWeatherCurrentResponse>(
      `${BASE_URL}/weather`,
      {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: getApiKey(),
          units: "metric",
        },
      }
    );

    const data = response.data;
    return {
      cityId,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      visibility: data.visibility / 1000,
      lastUpdated: Date.now(),
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch weather data"
    );
  }
};

export const fetchHourlyForecast = async (
  lat: number,
  lon: number
): Promise<HourlyForecast[]> => {
  try {
    const response = await axios.get<OpenWeatherForecastResponse>(
      `${BASE_URL}/forecast`,
      {
        params: {
          lat,
          lon,
          appid: getApiKey(),
          units: "metric",
        },
      }
    );

    const hourlyData = response.data.list.slice(0, 8).map((item) => ({
      time: item.dt * 1000,
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
    }));

    return hourlyData;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch hourly forecast"
    );
  }
};
