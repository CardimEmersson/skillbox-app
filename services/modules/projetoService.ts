import { IApiPaginate, IApiResponseDeleteSuccess, IApiResponseSuccess, IParamsPaginate } from "@/interfaces/apiRequest";
import { IGetProjeto, IGetProjetoById } from "@/interfaces/cadastroProjeto";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postProjeto(data: FormData): Promise<boolean> {
  try {
    const responseData = await api.post<IApiResponseSuccess>("/projetos", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar o projeto! Tente mais tarde");
  }
  return false;
}

export async function putProjeto(idProjeto: number, data: FormData): Promise<boolean> {
  if (!idProjeto) throw new Error("Id do projeto não informado");
  try {
    const responseData = await api.put<IApiResponseSuccess>(`/projetos/${idProjeto}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél editar o projeto! Tente mais tarde");
  }
  return false;
}

export async function getProjetos(params?: IParamsPaginate): Promise<IApiPaginate<IGetProjeto> | null> {
  try {
    const responseData = await api.get<IApiPaginate<IGetProjeto>>("/projetos", {
      params
    }).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél listar as projetos! Tente mais tarde");
  }
  return null;
}


export async function getProjetoById(id: number): Promise<IGetProjetoById | null> {
  if (!id) throw new Error("Id do projeto não informado");
  try {
    const responseData = await api.get<IGetProjetoById>(`/projetos/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar o projeto! Tente mais tarde");
  }
  return null;
}

export async function deleteProjeto(id: number): Promise<IApiResponseDeleteSuccess | null> {
  if (!id) throw new Error("Id do projeto não informado");
  try {
    const responseData = await api.delete<IApiResponseDeleteSuccess>(`/projetos/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél excluir o projeto! Tente mais tarde");
  }
  return null;
}