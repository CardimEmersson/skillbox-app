import { IPostLogin, IPostLoginFacebook, IPostLoginGoogle, IPostLoginLinkedin, IPostLoginResponse } from "@/interfaces/login";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postLogin(data: IPostLogin): Promise<IPostLoginResponse | null> {
  try {
    const response = await api.post<IPostLoginResponse>(`/auth/login`, data).then((response) => response.data);

    return response;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél realizar o login! Tente mais tarde");
  }
  return null;
}

export async function postLoginGoogle(data: IPostLoginGoogle): Promise<IPostLoginResponse | null> {
  try {
    const response = await api.post<IPostLoginResponse>(`/auth/google`, data).then((response) => response.data);

    return response;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél realizar o login! Tente mais tarde");
  }
  return null;
}

export async function postLoginFacebook(data: IPostLoginFacebook): Promise<IPostLoginResponse | null> {
  try {
    const response = await api.post<IPostLoginResponse>(`/auth/facebook`, data).then((response) => response.data);

    return response;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél realizar o login! Tente mais tarde");
  }
  return null;
}

export async function postLoginLinkedin(data: IPostLoginLinkedin): Promise<IPostLoginResponse | null> {
  try {
    const response = await api.post<IPostLoginResponse>(`/auth/linkedin`, data).then((response) => response.data);

    return response;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél realizar o login! Tente mais tarde");
  }
  return null;
}