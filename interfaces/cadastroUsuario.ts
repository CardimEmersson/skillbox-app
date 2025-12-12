
export type TypeNivelFormacao = 'fundamental' | 'medio' | 'tecnico' | 'graduacao' | 'pos_graduacao' | 'mestrado' | 'doutorado';

export interface CadastroUsuarioDataForm {
  nome: string;
  sobrenome: string;
  email: string;
  localizacao: string;
  dataNascimento: string;
  telefone: string;
  nivelFormacao: TypeNivelFormacao;
  instituicao: string;
  objetivoProfissional: string;
  areaSelecionada?: string; 
  areasUtilizadas: string[];
  bio: string;
  linkedin: string;
  github: string;
  site: string;
  imagem: string;
}

export interface IPutUsuario {
  nome: string;
  sobrenome: string;
  email: string;
  localizacao: string;
  dataNascimento: string;
  telefone: string;
  nivelFormacao: 'fundamental' | 'medio' | 'tecnico' | 'graduacao' | 'pos_graduacao' | 'mestrado' | 'doutorado';
  instituicao: string;
  objetivoProfissional: string;
  areasUtilizadas: {
    nome: string;
    id: string;
  }[];
  bio: string;
  linkedin: string;
  github: string;
  site: string;
  imagem: string;
  senha: string;
}

export interface IGetUsuario {
  dataNascimento: string; 
  email: string; 
  id: string; 
  nome: string; 
  senha: string; 
  sobrenome: string; 
  telefone: string;
  areasUtilizadas: any[]; 
  bio: string; 
  github: string; 
  imagem: string; 
  instituicao: string;
  linkedin: string; 
  localizacao: string; 
  nivelFormacao: string; 
  objetivoProfissional: string; 
  site: string;
}