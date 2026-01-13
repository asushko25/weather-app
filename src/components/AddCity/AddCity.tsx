"use client";

import { useState, useCallback } from "react";
import { useAppDispatch } from "@/hooks";
import { addCity } from "@/lib/slices/citiesSlice";
import { fetchWeather } from "@/lib/slices/weatherSlice";
import { getCityCoordinates } from "@/lib/api/weatherApi";
import type { City } from "@/types/city";
import styles from "./AddCity.module.scss";

export default function AddCity() {
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!cityName.trim()) {
        setError("Please enter a city name");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const coords = await getCityCoordinates(cityName.trim());
        const cityId = `${coords.name},${coords.country}`;

        const city: City = {
          id: cityId,
          name: coords.name,
          country: coords.country,
          lat: coords.lat,
          lon: coords.lon,
        };

        dispatch(addCity(city));
        dispatch(fetchWeather(cityId));
        setCityName("");
      } catch (err: any) {
        setError(err.message || "Failed to find city");
      } finally {
        setLoading(false);
      }
    },
    [cityName, dispatch]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
    setError(null);
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={cityName}
          onChange={handleInputChange}
          placeholder="Enter city name..."
          className={styles.input}
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading || !cityName.trim()}
        >
          {loading ? "Adding..." : "Add city"}
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

