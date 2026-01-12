"use client";

import { useRef, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";
import { setCities } from "@/lib/slices/citiesSlice";
import { fetchWeather } from "@/lib/slices/weatherSlice";
import { loadCitiesFromStorage } from "@/lib/middleware/localStorage";
import type { AppDispatch } from "@/lib/store";

function StoreInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const savedCities = loadCitiesFromStorage();
    if (savedCities.length > 0) {
      dispatch(setCities(savedCities));
      savedCities.forEach((city) => {
        dispatch(fetchWeather(city.id));
      });
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <StoreInitializer>{children}</StoreInitializer>
    </Provider>
  );
}

