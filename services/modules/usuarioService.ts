import { IGetUsuario, IPutUsuarioResponse } from "@/interfaces/cadastroUsuario";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";


export async function getUsuarioAuth(): Promise<IGetUsuario | null> {
  try {
    const responseData = await api.get<IGetUsuario>("/usuarios/me").then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar o usuario! Tente mais tarde");
  }
  return null;
}

export async function putUsuario(data: FormData): Promise<IPutUsuarioResponse | null> {
  try {
    const responseData = await api.put<IPutUsuarioResponse>("/usuarios/me", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél editar o usuario! Tente mais tarde");
  }
  return null;
}