"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchWeather } from "@/lib/slices/weatherSlice";
import CityCard from "@/components/CityCard/CityCard";
import AddCity from "@/components/AddCity/AddCity";
import CurrentDate from "@/components/CurrentDate/CurrentDate";
import styles from "./page.module.scss";

export default function Home() {
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.cities.cities);

  useEffect(() => {
    cities.forEach((city) => {
      dispatch(fetchWeather(city.id));
    });
  }, [cities, dispatch]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Weather in Cities</h1>
        <p className={styles.subtitle}>
          Add cities to track the weather
        </p>
        <CurrentDate />
      </header>

      <AddCity />

      {cities.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No cities added. Add a city above to get started.</p>
        </div>
      ) : (
        <div className={styles.citiesGrid}>
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      )}
    </div>
  );
}
