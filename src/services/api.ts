import axios from 'axios';

export const API_BASE_URL = 'api'; // Base URL para as requisições da API (usando o proxy configurado no Vite)

export const api = axios.create({
  baseURL: API_BASE_URL,
});