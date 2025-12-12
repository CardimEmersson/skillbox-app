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
  localizacao: string;
  dataNascimento: string;
  nivelFormacao: string;
  instituicao: string;
  objetivoProfissional: string;
  areaInteresse: string[];
  bio: string;
  linkedin: string;
  github: string;
  site: string;
  imagem: string;
  telefone: string;
  senha: string;
}