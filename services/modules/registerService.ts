import { IPostUsuarioResponse } from "@/interfaces/register";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postRegister(data: FormData): Promise<boolean> {
  try {
    const responseData = await api.post<IPostUsuarioResponse>("/usuarios", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar a conta! Tente mais tarde");
  }
  return false;
}