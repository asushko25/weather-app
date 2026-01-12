import { Middleware } from "@reduxjs/toolkit";
import type { City } from "@/types/city";

const STORAGE_KEY = "weather-app-cities";

export const localStorageMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  if (
    action.type === "cities/addCity" ||
    action.type === "cities/removeCity" ||
    action.type === "cities/setCities"
  ) {
    const state = store.getState() as any;
    const cities = state.cities.cities;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    } catch (error) {
      console.error("Failed to save cities to localStorage:", error);
    }
  }

  return result;
};

export const loadCitiesFromStorage = (): City[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load cities from localStorage:", error);
  }
  return [];
};

