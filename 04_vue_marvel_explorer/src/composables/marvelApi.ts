import { Md5 } from 'ts-md5';
import { Path, type Characters, type Comics } from "@/types/marvel";

const apiPublicKey = import.meta.env.VITE_APP_MARVEL_API_PUBLIC;
const apiPrivateKey = import.meta.env.VITE_APP_MARVEL_API_SECRET;

// Generate a timestamp
const ts = new Date().getTime().toString();

// Create the hash
const preHash = ts + apiPrivateKey + apiPublicKey;
const hash = Md5.hashStr(preHash);

const MARVEL_API = `https://gateway.marvel.com/v1/public/`;
const API_SIGN = `?ts=${ ts }&apikey=${ apiPublicKey }&hash=${ hash }`;

// Pagination
const ITEMS_PER_PAGE = 20;

interface ApiOptions {
  query?: string;
  page?: number;
}

export const useMarvelAPI = async (path: Path, options: ApiOptions): Promise<Comics | Characters> => {
  const pagination = getPagination(options.page);
  const query = getQuery(options.query);

  const requestURI = getRequestURI(path, query, pagination);

  return useFetch(requestURI);
}

const getPagination = (page?: number): string => {
  return page ? `&offset=${page * ITEMS_PER_PAGE}` : '';
};

const getQuery = (query?: string): string => {
  return query ? `&${ query }` : '';
};

const getRequestURI = (path: Path, query: string, pagination: string): string => {
  const apiPath = `${ MARVEL_API }${ path }`;
  return `${ apiPath }${ API_SIGN }${ query }${ pagination }`;
};

export const useFetch = async (requestURI: string): Promise<Comics | Characters> => {
  try {
    const res = await fetch(requestURI);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const jsonRes = await res.json();

    return jsonRes.data as Comics | Characters;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const useComics = async (page: number = 0): Promise<Comics> => {
  try {
    return await useMarvelAPI(Path.COMICS, { page }) as Comics
  } catch {
    throw new Error('An error occurred while trying to read comics');
  }
};

export const useCharacterSearch = async (query: string, page: number = 0): Promise<Characters> => {
  try {
    return await useMarvelAPI(Path.CHARACTERS, { query: `nameStartsWith=${query}`, page }) as Characters
  } catch {
    throw new Error('An error occurred while trying to search comics');
  }
};
