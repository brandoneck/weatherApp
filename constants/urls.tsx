export const API_KEY = `c71e140b08384499b2b182316251807`; //From https://www.weatherapi.com/
export const getWeatherList = (lat: string | null, lon: string | null): string =>
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no&alerts=no`;
export const getPlaces = (q: string | null): string =>
    `https://nominatim.openstreetmap.org/search?q=${q}&format=json&addressdetails=1&limit=5`;