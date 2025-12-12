import { IGetCategoria, IGetHabilidade, IPostCategoria, IPostHabilidade } from "@/interfaces/cadastroHabilidade";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postHabilidade(data: IPostHabilidade): Promise<boolean> {
  try {
    const responseData = await api.post<string>("/habilidades", data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar a habilidade! Tente mais tarde");
  }
  return false;
}

export async function putHabilidade(idHabilidade: string, data: IPostHabilidade): Promise<boolean> {
  if (!idHabilidade) throw new Error("Id da habilidade não informado");
  try {
    const responseData = await api.put<string>(`/habilidades/${idHabilidade}`, data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél editar a habilidade! Tente mais tarde");
  }
  return false;
}

export async function getHabilidades(idUser: string, params?: string): Promise<IGetHabilidade[]> {
  try {
    const responseData = await api.get<IGetHabilidade[]>(`/habilidades?idUser=${idUser}${params ?? ""}`).then((response) => response.data);
    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél listar as habilidades! Tente mais tarde");
  }
  return [];
}

export async function getHabilidadeById(id: string): Promise<IGetHabilidade | null> {
  if (!id) throw new Error("Id da habilidade não informado");
  try {
    const responseData = await api.get<IGetHabilidade>(`/habilidades/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar a habilidade! Tente mais tarde");
  }
  return null;
}

export async function deleteHabilidade(id: string): Promise<IGetHabilidade | null> {
  if (!id) throw new Error("Id da habilidade não informado");
  try {
    const responseData = await api.delete<IGetHabilidade>(`/habilidades/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél excluir a habilidade! Tente mais tarde");
  }
  return null;
}

export async function postCategoria(data: IPostCategoria): Promise<IGetCategoria | null> {
  try {
    const responseData = await api.post<IGetCategoria>("/categorias", data).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar a categoria! Tente mais tarde");
  }
  return null;
}

export async function getCategorias(idUser: string): Promise<IGetCategoria[]> {
  try {
    const responseData = await api.get<IGetCategoria[]>(`/categorias?idUser=${idUser}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar as categorias! Tente mais tarde");
  }
  return [];
}