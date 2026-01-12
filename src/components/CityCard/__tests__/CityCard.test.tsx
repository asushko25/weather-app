/// <reference types="jest" />
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CityCard from "../CityCard";
import citiesReducer from "@/lib/slices/citiesSlice";
import weatherReducer from "@/lib/slices/weatherSlice";
import type { City } from "@/types/city";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockCity: City = {
  id: "Kyiv,UA",
  name: "Kyiv",
  country: "UA",
  lat: 50.4501,
  lon: 30.5234,
};

const createStore = (weather = {}) =>
  configureStore({
    reducer: { cities: citiesReducer, weather: weatherReducer },
    preloadedState: {
      cities: { cities: [mockCity] },
      weather: { data: {}, hourlyForecast: {}, loading: {}, error: {}, ...weather },
    },
  });

describe("CityCard", () => {
  it("renders city name", () => {
    render(
      <Provider store={createStore()}>
        <CityCard city={mockCity} />
      </Provider>
    );
    expect(screen.getByText("Kyiv")).toBeInTheDocument();
  });

  it("shows weather data", () => {
    render(
      <Provider store={createStore({
        data: {
          "Kyiv,UA": {
            cityId: "Kyiv,UA",
            temp: 20,
            feelsLike: 22,
            humidity: 65,
            pressure: 1013,
            description: "clear sky",
            icon: "01d",
            windSpeed: 3.5,
            visibility: 10,
            lastUpdated: Date.now(),
          },
        },
        loading: { "Kyiv,UA": false },
      })}>
        <CityCard city={mockCity} />
      </Provider>
    );
    expect(screen.getByText("20°C")).toBeInTheDocument();
  });
});
