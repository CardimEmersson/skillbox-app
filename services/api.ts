import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";

export const BASE_URL = "http://192.168.100.11:3000";

function setupApi(): AxiosInstance {
  const apiConfig = axios.create({
    baseURL: BASE_URL,
  });

  const configAuth = async (config: InternalAxiosRequestConfig<any> | any) => {
    try {
      const jsonValue = await AsyncStorage.getItem("@SkillBox:user");
      const user = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }

      return config;
    } catch (error) {
      console.log(error);
      return config;
    }
  };

  const responseErrorHandler = async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("@SkillBox:user");
      router.replace("/login");
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
