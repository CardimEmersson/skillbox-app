export interface LoginDataForm {
  login: string;
  senha: string;
}

export interface IPostLogin {
  email: string;
  senha: string;
}

export interface IPostLoginGoogle {
  token: string;
}

export interface IPostLoginFacebook {
  token: string;
}

export interface IPostLoginResponse {
  access_token: string;
  user: {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string;
    data_nascimento: string;
    avatar_url: string;
  },
}