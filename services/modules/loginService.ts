import { UserAuthType } from "@/comtexts/authContext";
import { IPostLogin } from "@/interfaces/login";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postLogin(data: IPostLogin): Promise<UserAuthType | null> {
  try {
    const findedUser = await api.get<UserAuthType[]>(`/users?email=${data.login}`).then((response) => response.data);

    if (!findedUser.length) {
      throw new Error("Email ou senha inválidos.");
    }

    const user = findedUser[0];

    if (user.senha !== data.senha) {
      throw new Error("Email ou senha inválidos.");
    }

    return user;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél realizar o login! Tente mais tarde");
  }
  return null;
}