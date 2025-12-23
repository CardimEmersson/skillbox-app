import { IApiPaginate, IApiResponseDeleteSuccess, IApiResponseSuccess, IParamsPaginate } from "@/interfaces/apiRequest";
import { IGetMeta, IPostMeta } from "@/interfaces/cadastroMeta";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postMeta(data: IPostMeta): Promise<boolean> {
  try {
    const responseData = await api.post<IApiResponseSuccess>("/metas", data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar a meta! Tente mais tarde");
  }
  return false;
}

export async function putMeta(idMeta: number, data: IPostMeta): Promise<boolean> {
  if (!idMeta) throw new Error("Id da meta não informado");
  try {
    const responseData = await api.put<IApiResponseSuccess>(`/metas/${idMeta}`, data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél editar a meta! Tente mais tarde");
  }
  return false;
}

export async function getMetas(params?: IParamsPaginate): Promise<IApiPaginate<IGetMeta> | null> {
  try {
    const responseData = await api.get<IApiPaginate<IGetMeta>>("/metas", {
      params,
    }).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél listar as metas! Tente mais tarde");
  }
  return null;
}

export async function getMetaById(id: number): Promise<IGetMeta | null> {
  if (!id) throw new Error("Id da meta não informado");
  try {
    const responseData = await api.get<IGetMeta>(`/metas/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar a meta! Tente mais tarde");
  }
  return null;
}

export async function deleteMeta(id: number): Promise<IApiResponseDeleteSuccess | null> {
  if (!id) throw new Error("Id da meta não informado");
  try {
    const responseData = await api.delete<IApiResponseDeleteSuccess>(`/metas/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél excluir a meta! Tente mais tarde");
  }
  return null;
}