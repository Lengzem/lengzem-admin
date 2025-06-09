import axios from 'axios';

const apiKey = import.meta.env.VITE_API_KEY; // pulling from your .env file

const api = axios.create({
  baseURL: 'https://apis.zostream.in/api',
});

const laravelApi = axios.create({
  baseURL: 'http://192.168.137.150:8000/api', // optional if you want dynamic baseURL too
  headers: {
    'X-Api-Key': apiKey,
    'Content-Type': 'application/json',
  }
});

export { api, laravelApi };
