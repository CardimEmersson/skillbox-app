

export interface CadastroUsuarioDataForm {
  nome: string;
  sobrenome: string;
  email: string;
  localizacao: string;
  dataNascimento: string;
  nivelFormacao: 'fundamental' | 'medio' | 'tecnico' | 'graduacao' | 'pos_graduacao' | 'mestrado' | 'doutorado';
  instituicao: string;
  objetivoProfissional: string;
  areaSelecionada?: number; 
  areasUtilizadas: number[];
  bio: string;
  linkedin: string;
  github: string;
  site: string;
  imagem: string;
}