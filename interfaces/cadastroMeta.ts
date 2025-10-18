

export interface CadastroMetaDataForm {
  titulo: string;
  descricao: string;
  habilidadeSelecionada?: number; 
  habilidadesRelacionadas: number[];
  prazoConclusão: string;
  status: 'planejado' | 'em andamento' | 'concluído';
}