import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { City } from "@/types/city";

interface CitiesState {
  cities: City[];
}

const initialState: CitiesState = {
  cities: [],
};

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<City>) => {
      const exists = state.cities.some((city) => city.id === action.payload.id);
      if (!exists) {
        state.cities.push(action.payload);
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter((city) => city.id !== action.payload);
    },
    setCities: (state, action: PayloadAction<City[]>) => {
      state.cities = action.payload;
    },
  },
});

export const { addCity, removeCity, setCities } = citiesSlice.actions;
export default citiesSlice.reducer;

