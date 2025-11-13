import { ApiErrorResponse } from "@/interfaces/ApiErrorResponse";
import { AxiosError } from "axios";

export function getErrorsByApi(error: AxiosError, defaultMessage?: string) {
	if (error.response) {
		const response = error.response.data as ApiErrorResponse;

		throw new Error(response.message);
	}

	if (error.message) {
		throw new Error(error.message);
	}

	throw new Error(defaultMessage ?? "Tivemos problemas ao realizar essa ação");
}