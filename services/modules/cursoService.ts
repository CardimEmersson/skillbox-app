import { IApiPaginate, IParamsPaginate } from "@/interfaces/apiRequest";
import { IGetCurso, IPostCurso } from "@/interfaces/cadastroCurso";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postCurso(data: IPostCurso): Promise<boolean> {
  try {
    const responseData = await api.post<string>("/cursos", data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar o curso! Tente mais tarde");
  }
  return false;
}

export async function putCurso(idCurso: string, data: IPostCurso): Promise<boolean> {
  if (!idCurso) throw new Error("Id do curso não informado");
  try {
    const responseData = await api.put<string>(`/cursos/${idCurso}`, data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél editar o curso! Tente mais tarde");
  }
  return false;
}

export async function getCursos(params?: IParamsPaginate): Promise<IApiPaginate<IGetCurso> | null> {
  try {
    const responseData = await api.get<IApiPaginate<IGetCurso>>("/cursos", {
      params
    }).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél listar os cursos! Tente mais tarde");
  }
  return null;
}

export async function getCursoById(id: string): Promise<IGetCurso | null> {
  if (!id) throw new Error("Id do curso não informado");
  try {
    const responseData = await api.get<IGetCurso>(`/cursos/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar o curso! Tente mais tarde");
  }
  return null;
}

export async function deleteCurso(id: string): Promise<IGetCurso | null> {
  if (!id) throw new Error("Id do curso não informado");
  try {
    const responseData = await api.delete<IGetCurso>(`/cursos/${id}`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél excluir o curso! Tente mais tarde");
  }
  return null;
}