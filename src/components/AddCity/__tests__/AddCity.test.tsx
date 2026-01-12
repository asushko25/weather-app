/// <reference types="jest" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AddCity from "../AddCity";
import citiesReducer from "@/lib/slices/citiesSlice";
import weatherReducer from "@/lib/slices/weatherSlice";

jest.mock("@/lib/api/weatherApi", () => ({
  getCityCoordinates: jest.fn(),
}));

const createStore = () =>
  configureStore({
    reducer: { cities: citiesReducer, weather: weatherReducer },
  });

describe("AddCity", () => {
  it("renders form", () => {
    render(
      <Provider store={createStore()}>
        <AddCity />
      </Provider>
    );
    expect(screen.getByPlaceholderText("Enter city name...")).toBeInTheDocument();
    expect(screen.getByText("Add city")).toBeDisabled();
  });

  it("enables button when typing", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={createStore()}>
        <AddCity />
      </Provider>
    );
    await user.type(screen.getByPlaceholderText("Enter city name..."), "Kyiv");
    expect(screen.getByText("Add city")).not.toBeDisabled();
  });
});
