"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchWeather } from "@/lib/slices/weatherSlice";
import { removeCity } from "@/lib/slices/citiesSlice";
import type { City } from "@/types/city";
import styles from "./CityCard.module.scss";

interface CityCardProps {
  city: City;
}

export default function CityCard({ city }: CityCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const weather = useAppSelector((state) => state.weather.data[city.id]);
  const loading = useAppSelector((state) => state.weather.loading[city.id]);
  const error = useAppSelector((state) => state.weather.error[city.id]);

  useEffect(() => {
    if (!weather) {
      dispatch(fetchWeather(city.id));
    }
  }, [city.id, dispatch, weather]);

  const handleRefresh = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(fetchWeather(city.id));
    },
    [city.id, dispatch]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(removeCity(city.id));
    },
    [city.id, dispatch]
  );

  const handleCardClick = useCallback(() => {
    router.push(`/city/${encodeURIComponent(city.id)}`);
  }, [city.id, router]);

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        <h2 className={styles.cityName}>
          {city.name}
          {city.country && <span className={styles.country}>, {city.country}</span>}
        </h2>
        <button
          className={styles.removeButton}
          onClick={handleRemove}
          aria-label="Remove city"
        >
          ×
        </button>
      </div>

      {loading && !weather && (
        <div className={styles.loading}>Loading...</div>
      )}

      {error && (
        <div className={styles.error}>
          Error: {error}
          <button
            className={styles.retryButton}
            onClick={handleRefresh}
            aria-label="Try again"
          >
            Try again
          </button>
        </div>
      )}

      {weather && !loading && (
        <div className={styles.weatherInfo}>
          <div className={styles.temperature}>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className={styles.weatherIcon}
            />
            <span className={styles.temp}>{weather.temp}°C</span>
          </div>
          <div className={styles.description}>
            {weather.description}
          </div>
          <div className={styles.details}>
            <span>Feels like: {weather.feelsLike}°C</span>
            <span>Humidity: {weather.humidity}%</span>
            <span>Wind: {weather.windSpeed.toFixed(1)} m/s</span>
          </div>
        </div>
      )}

      {weather && (
        <button
          className={styles.refreshButton}
          onClick={handleRefresh}
          disabled={loading}
          aria-label="Refresh weather"
        >
          {loading ? "Updating..." : "Refresh weather"}
        </button>
      )}
    </div>
  );
}

