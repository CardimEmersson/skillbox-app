import { IApiResponseSuccess } from "@/interfaces/apiRequest";
import { IPostConfirmarConta, IPostEsqueciSenha, IPostRedefinirSenha } from "@/interfaces/cadastroUsuario";
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

export async function postConfirmarConta(data: IPostConfirmarConta): Promise<IApiResponseSuccess | null> {
  try {
    const responseData = await api.post<IApiResponseSuccess>("/usuarios/confirmar-conta", data).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél confirmar a conta! Tente mais tarde");
  }
  return null;
}

export async function postEsqueciSenha(data: IPostEsqueciSenha): Promise<IApiResponseSuccess | null> {
  try {
    const responseData = await api.post<IApiResponseSuccess>("/usuarios/esqueci-senha", data).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél completar a requisição! Tente mais tarde");
  }
  return null;
}

export async function postRedefinirSenha(data: IPostRedefinirSenha): Promise<IApiResponseSuccess | null> {
  try {
    const responseData = await api.post<IApiResponseSuccess>("/usuarios/redefinir-senha", data).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél redefinir a senha! Tente mais tarde");
  }
  return null;
}