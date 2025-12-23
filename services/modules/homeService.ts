import { ICursosByCategoria, ICursosPopulares, IDashboard } from "@/interfaces/home";
import { getErrorsByApi } from "@/utils/getErrorApi";
import axios from "axios";
import { api } from "../api";

export async function getDashboard(): Promise<IDashboard | null> {
  try {
    const responseData = await api.get<IDashboard>("/dashboard").then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar os dados! Tente mais tarde");
  }
  return null;
}

export async function getCursosPopulares() {
  try {
    const responseData = await axios.get<ICursosPopulares>("https://www.udemy.com/api-2.0/discovery-units/most_viewed/?apply_campaign_filter=False&context=personalized_home&discovery_configuration_id=138&fft=studentsareviewing&fl=df&is_content_rankable=False&ref_tracking_id=hh-ny0QERw6S2c5AaNSGvQ&sos=e&timestamp=1766174400.0&u=1152523765&skip_price=true&last_course_id=1121284&source_page=logged_out_homepage&locale=pt_BR&currency=brl&navigation_locale=pt").then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar os dados! Tente mais tarde");
  }
  return null;
}

export async function getCursosByCategoria(id: number) {
  try {
    if (!id) return null;
    const responseData = await axios.get<ICursosByCategoria>(`https://www.udemy.com/api-2.0/discovery-units/bestseller/?category_id=${id}&context=category&fl=cat&member_of=skills_hub_top_nn_trending&ranking_index=0&sos=pc&skip_price=true&source_page=category_page&locale=pt_BR&currency=brl&navigation_locale=pt`).then((response) => response.data);

    return responseData;
  } catch (error: any) {
    getErrorsByApi(error, "Não foi possivél buscar os dados! Tente mais tarde");
  }
  return null;
}