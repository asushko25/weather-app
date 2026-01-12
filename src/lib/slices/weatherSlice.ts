import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchCurrentWeather, fetchHourlyForecast } from "../api/weatherApi";

export interface WeatherData {
  cityId: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  windSpeed: number;
  visibility: number;
  lastUpdated: number;
}

export interface HourlyForecast {
  time: number;
  temp: number;
  icon: string;
}

export interface WeatherState {
  data: Record<string, WeatherData>;
  hourlyForecast: Record<string, HourlyForecast[]>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

const initialState: WeatherState = {
  data: {},
  hourlyForecast: {},
  loading: {},
  error: {},
};

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (cityId: string, { rejectWithValue }) => {
    try {
      const weather = await fetchCurrentWeather(cityId);
      return { cityId, weather };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch weather");
    }
  }
);

export const fetchHourlyWeather = createAsyncThunk(
  "weather/fetchHourlyWeather",
  async (
    { cityId, lat, lon }: { cityId: string; lat: number; lon: number },
    { rejectWithValue }
  ) => {
    try {
      const forecast = await fetchHourlyForecast(lat, lon);
      return { cityId, forecast };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch hourly forecast");
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    clearError: (state, action: PayloadAction<string>) => {
      state.error[action.payload] = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state, action) => {
        const cityId = action.meta.arg;
        state.loading[cityId] = true;
        state.error[cityId] = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        const { cityId, weather } = action.payload;
        state.data[cityId] = weather;
        state.loading[cityId] = false;
        state.error[cityId] = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        const cityId = action.meta.arg;
        state.loading[cityId] = false;
        state.error[cityId] = action.payload as string;
      })
      .addCase(fetchHourlyWeather.pending, (state) => {
      })
      .addCase(fetchHourlyWeather.fulfilled, (state, action) => {
        const { cityId, forecast } = action.payload;
        state.hourlyForecast[cityId] = forecast;
      })
      .addCase(fetchHourlyWeather.rejected, (state, action) => {
        const cityId = action.meta.arg.cityId;
      });
  },
});

export const { clearError } = weatherSlice.actions;
export default weatherSlice.reducer;

