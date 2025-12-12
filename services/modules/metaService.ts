import { IGetMeta, IPostMeta } from "@/interfaces/cadastroMeta";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postMeta(data: IPostMeta): Promise<boolean> {
  try {
    const responseData = await api.post<string>("/metas", data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar a meta! Tente mais tarde");
  }
  return false;
}

export async function putMeta(idMeta: string, data: IPostMeta): Promise<boolean> {
  if (!idMeta) throw new Error("Id da meta não informado");
  try {
    const responseData = await api.put<string>(`/metas/${idMeta}`, data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél editar a meta! Tente mais tarde");
  }
  return false;
}

export async function getMetas(idUser: string): Promise<IGetMeta[]> {
  try {
    const responseData = await api.get<IGetMeta[]>(`/metas?idUser=${idUser}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél listar as metas! Tente mais tarde");
  }
  return [];
}

export async function getMetaById(id: string): Promise<IGetMeta | null> {
  if (!id) throw new Error("Id da meta não informado");
  try {
    const responseData = await api.get<IGetMeta>(`/metas/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar a meta! Tente mais tarde");
  }
  return null;
}

export async function deleteMeta(id: string): Promise<IGetMeta | null> {
  if (!id) throw new Error("Id da meta não informado");
  try {
    const responseData = await api.delete<IGetMeta>(`/metas/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél excluir a meta! Tente mais tarde");
  }
  return null;
}