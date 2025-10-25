import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "http://192.168.100.11:3000";

function setupApi(): AxiosInstance {
  const apiConfig = axios.create({
    baseURL: BASE_URL,
  });

  const configAuth = async (config: InternalAxiosRequestConfig<any> | any) => {
    try {
      // const token = "";
      // config.headers.Authorization = `Bearer ${token}`;

      return config;
    } catch (error) {
      console.log(error);
    }
  };

  const responseErrorHandler = async (error: AxiosError) => {
    if (error.response?.status === 401) {
      //
    }

    return Promise.reject(error);
  };

  apiConfig.interceptors.request.use(
    configAuth,
    responseErrorHandler
  );

  apiConfig.interceptors.response.use(
    configAuth,
    responseErrorHandler
  );

  return apiConfig;
}

export const api = setupApi();
