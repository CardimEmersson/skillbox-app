
export interface IDashboard {
  habilidades: number;
  cursos: number;
  metas: number;
  projetos: number;
}

export type TypeCursosRecomendados = {
  id: number;
  title: string;
  url: string;
  visible_instructors: {
    id: number;
    name: string;
  }[];
  image_750x422: string;
  headline: string;
}

export interface ICursosPopulares {
  unit: {
    title: string;
    items: TypeCursosRecomendados[]
  }
}

export interface ICursosByCategoria {
  unit: {
    title: string;
    items: TypeCursosRecomendados[]
  }
}