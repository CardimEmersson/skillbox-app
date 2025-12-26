export interface IParamsPaginate {
  page?: number;
  limit?: number;
}

export interface IApiPaginate<T> {
  data: T[];
  count: number;
  totalPages: number;
  currentPage: number;
}

export interface IApiResponseSuccess {
  id?: number; 
  message: string;
}

export interface IApiResponseDeleteSuccess {
  message: string;
}