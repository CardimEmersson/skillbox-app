import { IApiPaginate, IParamsPaginate } from "@/interfaces/apiRequest";
import { IGetProjeto, IGetProjetoById, IPostProjeto } from "@/interfaces/cadastroProjeto";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postProjeto(data: IPostProjeto): Promise<boolean> {
  try {
    const responseData = await api.post<string>("/projetos", data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar o projeto! Tente mais tarde");
  }
  return false;
}

export async function putProjeto(idProjeto: string, data: IPostProjeto): Promise<boolean> {
  if (!idProjeto) throw new Error("Id do projeto não informado");
  try {
    const responseData = await api.put<string>(`/projetos/${idProjeto}`, data).then((response) => response.data);

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


export async function getProjetoById(id: string): Promise<IGetProjetoById | null> {
  if (!id) throw new Error("Id do projeto não informado");
  try {
    const responseData = await api.get<IGetProjetoById>(`/projetos/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar o projeto! Tente mais tarde");
  }
  return null;
}

export async function deleteProjeto(id: string): Promise<IGetProjeto | null> {
  if (!id) throw new Error("Id do projeto não informado");
  try {
    const responseData = await api.delete<IGetProjeto>(`/projetos/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél excluir o projeto! Tente mais tarde");
  }
  return null;
}