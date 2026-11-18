import { API_URL } from '@/services/apiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'herbaia.token';

/*
|--------------------------------------------------------------------------
| TIPOS
|--------------------------------------------------------------------------
*/

export interface PlantaApi {
  // 1
  id_planta: number;

  // 2
  nombre_comun: string;

  // 3
  nombre_cientifico: string;

  // 4
  familia_botanica?: string | null;

  // 5
  descripcion?: string | null;

  // 6
  id_categoria?: number | null;

  // Campo adicional obtenido mediante JOIN
  categoria?: string | null;

  // 7
  imagen_principal?: string | null;

  // 8
  habitat?: string | null;

  // 9
  distribucion_geografica?: string | null;

  // 10
  indicaciones?: string | null;

  // 11
  beneficios?: string | null;

  // 12
  parte_utilizada?: string | null;

  // 13
  preparacion?: string | null;

  // 14
  administracion?: string | null;

  // 15
  dosis?: string | null;

  // 16
  contraindicaciones?: string | null;

  // 17
  efectos_secundarios?: string | null;

  // 18
  interacciones?: string | null;

  // 19
  embarazo_lactancia?: string | null;

  // 20
  nivel_evidencia?: string | null;

  // 21
  presentaciones?: string | null;

  // 22
  created_at?: string | null;

  // 23
  updated_at?: string | null;

  // 24
  estado_revision?: string | null;

  // 25
  aprobado_por?: number | null;

  // 26
  fecha_aprobacion?: string | null;

  // 27
  observaciones_revision?: string | null;

  /*
  |--------------------------------------------------------------------------
  | CAMPOS ADICIONALES DE JOINS
  |--------------------------------------------------------------------------
  */

  centro_investigacion?: string | null;
  investigador?: string | null;
  nombre_aprobador?: string | null;
}

/*
|--------------------------------------------------------------------------
| RESPUESTAS API
|--------------------------------------------------------------------------
*/

interface RespuestaPlanta {
  ok?: boolean;
  planta?: PlantaApi;
  mensaje?: string;
}

interface RespuestaFavoritos {
  ok?: boolean;
  total?: number;
  favoritos?: PlantaApi[];
  mensaje?: string;
}

/*
|--------------------------------------------------------------------------
| LEER JSON
|--------------------------------------------------------------------------
*/

async function leerJson<T>(
  respuesta: Response
): Promise<T> {
  const texto = await respuesta.text();

  try {
    return JSON.parse(texto) as T;
  } catch {
    throw new Error(
      `El servidor respondió con un formato incorrecto (${respuesta.status})`
    );
  }
}

/*
|--------------------------------------------------------------------------
| OBTENER TOKEN
|--------------------------------------------------------------------------
*/

async function obtenerToken(): Promise<string> {
  const token =
    await AsyncStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error(
      'No hay una sesión activa. Inicia sesión nuevamente.'
    );
  }

  return token;
}

/*
|--------------------------------------------------------------------------
| OBTENER TODAS LAS PLANTAS
|--------------------------------------------------------------------------
*/

export async function obtenerPlantas(
  filtros: {
    q?: string;
    categoria?: string;
  } = {}
): Promise<PlantaApi[]> {
  const parametros =
    new URLSearchParams();

  if (filtros.q) {
    parametros.set(
      'q',
      filtros.q
    );
  }

  if (filtros.categoria) {
    parametros.set(
      'categoria',
      filtros.categoria
    );
  }

  const consulta =
    parametros.toString();

  const url =
    `${API_URL}/api/plantas${
      consulta
        ? `?${consulta}`
        : ''
    }`;

  try {
    const respuesta =
      await fetch(url);

    if (!respuesta.ok) {
      throw new Error(
        `No fue posible obtener las plantas (${respuesta.status})`
      );
    }

    const datos =
      await leerJson<PlantaApi[]>(
        respuesta
      );

    if (!Array.isArray(datos)) {
      throw new Error(
        'La API devolvió un formato de plantas inesperado'
      );
    }

    return datos;
  } catch (error) {
    console.error(
      'Error al obtener plantas:',
      error
    );

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      'No fue posible conectar con la API'
    );
  }
}

/*
|--------------------------------------------------------------------------
| OBTENER UNA PLANTA POR ID
|--------------------------------------------------------------------------
|
| Este endpoint debe devolver TODOS los campos de la tabla plantas.
|
*/

export async function obtenerPlantaPorId(
  id: string | number
): Promise<PlantaApi> {
  try {
    const respuesta =
      await fetch(
        `${API_URL}/api/plantas/${id}`
      );

    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        throw new Error(
          'La planta no fue encontrada'
        );
      }

      throw new Error(
        `No fue posible obtener la planta (${respuesta.status})`
      );
    }

    const datos =
      await leerJson<
        PlantaApi | RespuestaPlanta
      >(respuesta);

    /*
    |--------------------------------------------------------------------------
    | FORMATO:
    |
    | {
    |   id_planta: 1,
    |   nombre_comun: "...",
    |   ...
    | }
    |--------------------------------------------------------------------------
    */

    if (
      typeof datos === 'object' &&
      datos !== null &&
      'id_planta' in datos
    ) {
      return datos as PlantaApi;
    }

    /*
    |--------------------------------------------------------------------------
    | FORMATO:
    |
    | {
    |   ok: true,
    |   planta: {...}
    | }
    |--------------------------------------------------------------------------
    */

    const resultado =
      datos as RespuestaPlanta;

    if (resultado.planta) {
      return resultado.planta;
    }

    throw new Error(
      resultado.mensaje ||
        'No fue posible obtener la planta'
    );
  } catch (error) {
    console.error(
      `Error al obtener planta ${id}:`,
      error
    );

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      'No fue posible conectar con la API'
    );
  }
}

/*
|--------------------------------------------------------------------------
| OBTENER FAVORITOS
|--------------------------------------------------------------------------
*/

export async function obtenerFavoritos():
Promise<PlantaApi[]> {
  const token =
    await obtenerToken();

  const respuesta =
    await fetch(
      `${API_URL}/api/favoritos`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  const datos =
    await leerJson<RespuestaFavoritos>(
      respuesta
    );

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
        'No fue posible obtener los favoritos'
    );
  }

  return datos.favoritos || [];
}

/*
|--------------------------------------------------------------------------
| AGREGAR FAVORITO
|--------------------------------------------------------------------------
*/

export async function agregarFavorito(
  idPlanta: number
): Promise<void> {
  const token =
    await obtenerToken();

  const respuesta =
    await fetch(
      `${API_URL}/api/favoritos`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          id_planta: idPlanta,
        }),
      }
    );

  const datos =
    await leerJson<RespuestaFavoritos>(
      respuesta
    );

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
        'No fue posible guardar el favorito'
    );
  }
}

/*
|--------------------------------------------------------------------------
| QUITAR FAVORITO
|--------------------------------------------------------------------------
*/

export async function quitarFavorito(
  idPlanta: number
): Promise<void> {
  const token =
    await obtenerToken();

  const respuesta =
    await fetch(
      `${API_URL}/api/favoritos/${idPlanta}`,
      {
        method: 'DELETE',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  const datos =
    await leerJson<RespuestaFavoritos>(
      respuesta
    );

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
        'No fue posible quitar el favorito'
    );
  }
}