import Constants from 'expo-constants';

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

const getApiConfig = (): ApiConfig => {
  const extra = Constants.expoConfig?.extra;
  
  return {
    baseUrl: extra?.apiBaseUrl || 'http://127.0.0.1:4000',
    timeout: 10000, // 10 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
};

export const apiConfig = getApiConfig();

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = apiConfig.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove leading slash
  return `${baseUrl}/${cleanEndpoint}`;
}; 