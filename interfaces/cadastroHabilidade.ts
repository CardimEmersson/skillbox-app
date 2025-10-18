export type TypeCursoProjeto = {
    id: number;
    descricao: string;
    tipo: "curso" | "projeto";
  };

export interface CadastroHabilidadeDataForm {
  icone: string;
  nome: string;
  proficiencia: "iniciante" | "intermediario" | "avancado";
  categoriaSelecionada?: number;
  categorias: number[];
  cursoProjetoSelecionado?: number;
  cursosProjetos: TypeCursoProjeto[];

}