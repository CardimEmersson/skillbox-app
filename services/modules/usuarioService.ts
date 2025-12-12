import { IGetUsuario, IPutUsuario } from "@/interfaces/cadastroUsuario";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";


export async function getUsuarioById(idUsuario: string): Promise<IGetUsuario | null> {
  if (!idUsuario) throw new Error("Id do usuario não informado");
  try {
    const responseData = await api.get<IGetUsuario>(`/users/${idUsuario}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar o usuario! Tente mais tarde");
  }
  return null;
}

export async function putUsuario(idUsuario: string, data: IPutUsuario): Promise<boolean> {
  if (!idUsuario) throw new Error("Id do usuario não informado");
  try {
    const responseData = await api.put<string>(`/users/${idUsuario}`, data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél editar o usuario! Tente mais tarde");
  }
  return false;
}