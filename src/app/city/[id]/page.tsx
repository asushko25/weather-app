"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchWeather, fetchHourlyWeather } from "@/lib/slices/weatherSlice";
import styles from "./page.module.scss";

export default function CityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cityId = decodeURIComponent(params.id as string);

  const cities = useAppSelector((state) => state.cities.cities);
  const city = cities.find((c) => c.id === cityId);
  const weather = useAppSelector((state) => state.weather.data[cityId]);
  const hourlyForecast = useAppSelector(
    (state) => state.weather.hourlyForecast[cityId]
  );
  const loading = useAppSelector((state) => state.weather.loading[cityId]);
  const error = useAppSelector((state) => state.weather.error[cityId]);

  useEffect(() => {
    if (!city) {
      router.push("/");
      return;
    }

    dispatch(fetchWeather(cityId));
    dispatch(
      fetchHourlyWeather({
        cityId,
        lat: city.lat,
        lon: city.lon,
      })
    );
  }, [city, cityId, dispatch, router]);

  const handleBackClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleRetry = useCallback(() => {
    if (!city) return;
    dispatch(fetchWeather(cityId));
    dispatch(
      fetchHourlyWeather({
        cityId,
        lat: city.lat,
        lon: city.lon,
      })
    );
  }, [city, cityId, dispatch]);

  const chartData = useMemo(() => {
    if (!hourlyForecast || hourlyForecast.length === 0) return null;

    const temps = hourlyForecast.map((item) => item.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = maxTemp - minTemp || 1;

    return hourlyForecast.map((item) => ({
      ...item,
      normalizedHeight: ((item.temp - minTemp) / range) * 100,
    }));
  }, [hourlyForecast]);

  if (!city) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBackClick}>
        Back to list
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>
          {city.name}
          {city.country && <span className={styles.country}>, {city.country}</span>}
        </h1>
      </div>

      {loading && !weather && (
        <div className={styles.loading}>Loading...</div>
      )}

      {error && (
        <div className={styles.error}>
          Error: {error}
          <button className={styles.retryButton} onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}

      {weather && (
        <div className={styles.weatherDetails}>
          <div className={styles.currentWeather}>
            <div className={styles.temperatureSection}>
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                alt={weather.description}
                className={styles.weatherIcon}
              />
              <div className={styles.tempInfo}>
                <div className={styles.temp}>{weather.temp}°C</div>
                <div className={styles.feelsLike}>
                  Feels like {weather.feelsLike}°C
                </div>
                <div className={styles.description}>
                  {weather.description}
                </div>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Humidity</span>
                <span className={styles.detailValue}>{weather.humidity}%</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Pressure</span>
                <span className={styles.detailValue}>
                  {weather.pressure} hPa
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Wind</span>
                <span className={styles.detailValue}>
                  {weather.windSpeed.toFixed(1)} m/s
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Visibility</span>
                <span className={styles.detailValue}>
                  {weather.visibility.toFixed(1)} km
                </span>
              </div>
            </div>
          </div>

          {chartData && chartData.length > 0 && (
            <div className={styles.chartSection}>
              <h2 className={styles.chartTitle}>
                Temperature forecast for today
              </h2>
              <div className={styles.chart}>
                {chartData.map((item, index) => {
                  const date = new Date(item.time);
                  const hours = date.getHours();
                  const minutes = date.getMinutes();
                  const timeLabel = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

                  return (
                    <div key={index} className={styles.chartBar}>
                      <div
                        className={styles.bar}
                        style={{ height: `${item.normalizedHeight}%` }}
                        title={`${timeLabel}: ${item.temp}°C`}
                      >
                        <span className={styles.barTemp}>{item.temp}°</span>
                      </div>
                      <span className={styles.barLabel}>{timeLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

