export interface CadastroCursoDataForm { 
  nome: string;
  plataformaInstituicao: string;
  dataConclusao: string;
  emAndamento: boolean;
  cargaHoraria: string;
  habilidadeSelecionada?: number; 
  habilidadesDesenvolvidas: number[];
  link: string;
  imagens: string[];
}