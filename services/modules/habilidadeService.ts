import { IApiPaginate, IApiResponseDeleteSuccess, IApiResponseSuccess, IParamsPaginate } from "@/interfaces/apiRequest";
import { IGetCategoria, IGetHabilidade, IPostCategoria } from "@/interfaces/cadastroHabilidade";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postHabilidade(formData: FormData): Promise<boolean> {
  try {
    const responseData = await api.post<IApiResponseSuccess>("/habilidades", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar a habilidade! Tente mais tarde");
  }
  return false;
}

export async function putHabilidade(idHabilidade: string, data: FormData): Promise<boolean> {
  if (!idHabilidade) throw new Error("Id da habilidade não informado");
  try {
    const responseData = await api.put<string>(`/habilidades/${idHabilidade}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.data);
    
    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél editar a habilidade! Tente mais tarde");
  }
  return false;
}

export async function getHabilidades(params?: IParamsPaginate): Promise<IApiPaginate<IGetHabilidade> | null> {
  try {
    const responseData = await api.get<IApiPaginate<IGetHabilidade>>("/habilidades", {
      params
    }).then((response) => response.data);
    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél listar as habilidades! Tente mais tarde");
  }
  return null;
}

export async function getHabilidadeById(id: number): Promise<IGetHabilidade | null> {
  if (!id) throw new Error("Id da habilidade não informado");
  try {
    const responseData = await api.get<IGetHabilidade>(`/habilidades/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar a habilidade! Tente mais tarde");
  }
  return null;
}

export async function deleteHabilidade(id: string): Promise<IApiResponseDeleteSuccess | null> {
  if (!id) throw new Error("Id da habilidade não informado");
  try {
    const responseData = await api.delete<IApiResponseDeleteSuccess>(`/habilidades/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél excluir a habilidade! Tente mais tarde");
  }
  return null;
}

export async function postCategoria(data: IPostCategoria): Promise<IApiResponseSuccess | null> {
  try {
    const responseData = await api.post<IApiResponseSuccess>("/categorias", data).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar a categoria! Tente mais tarde");
  }
  return null;
}

export async function getCategorias(): Promise<IGetCategoria[]> {
  try {
    const responseData = await api.get<IGetCategoria[]>("/categorias").then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar as categorias! Tente mais tarde");
  }
  return [];
}