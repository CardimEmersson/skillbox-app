export interface RegisterDataForm {
  nome: string;
  sobrenome: string;
  email: string;
  dataNascimento: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
}

export interface IPostRegister {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  avatar: string;
  bio: string;
  senha: string;
  localizacao: string;
  nivel_formacao: string;
  instituicao: string;
  objetivo_profissional: string;
  area_interesse: string;
  linkedin: string;
  github: string;
  site: string;
}

export interface IPostUsuarioResponse {
  area_interesse: string; 
  avatar: string; 
  bio: string;
  created_at: string; 
  dataNascimento: string; 
  deleted_at: string | null;
  email: string; 
  github: string; 
  id: number;
  instituicao: string; 
  linkedin: string;
  localizacao: string; 
  nivel_formacao: string; 
  nome: string; 
  objetivo_profissional: string; 
  site: string; 
  sobrenome: string; 
  telefone: string; 
  updated_at: string;
}