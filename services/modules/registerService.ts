import { IPostRegister } from "@/interfaces/register";
import { getErrorsByApi } from "@/utils/getErrorApi";
import { api } from "../api";

export async function postRegister(data: IPostRegister): Promise<boolean> {
  try {
    const responseData = await api.post<string>("/users", data).then((response) => response.data);

    return Boolean(responseData);
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél cadastrar a conta! Tente mais tarde");
  }
  return false;
}