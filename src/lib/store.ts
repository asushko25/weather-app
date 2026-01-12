import { configureStore } from "@reduxjs/toolkit";
import citiesReducer from "./slices/citiesSlice";
import weatherReducer from "./slices/weatherSlice";
import { localStorageMiddleware } from "./middleware/localStorage";

export const makeStore = () => {
  return configureStore({
    reducer: {
      cities: citiesReducer,
      weather: weatherReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["weather/fetchWeather/fulfilled"],
        },
      }).concat(localStorageMiddleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

