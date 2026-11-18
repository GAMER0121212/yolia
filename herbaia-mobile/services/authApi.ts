import { API_URL } from '@/services/apiUrl';

/*
|--------------------------------------------------------------------------
| TIPOS
|--------------------------------------------------------------------------
*/

export interface Usuario {
  id_usuario: number;
  nombre: string;

  email: string;
  correo: string;

  telefono?: string | null;
  avatar?: string | null;

  rol:
    | 'usuario'
    | 'admin'
    | 'investigador'
    | string;

  estado?: string | null;

  es_premium: boolean;
  premium: boolean;

  fecha_inicio_premium?: string | null;
  fecha_fin_premium?: string | null;

  proveedor_auth?: string | null;
}

interface UsuarioApi {
  id_usuario: number;
  nombre: string;

  email?: string;
  correo?: string;

  telefono?: string | null;
  avatar?: string | null;

  rol?: string;
  estado?: string | null;

  es_premium?: boolean | number;
  premium?: boolean | number;

  fecha_inicio_premium?: string | null;
  fecha_fin_premium?: string | null;

  proveedor_auth?: string | null;
}

interface RespuestaAuth {
  mensaje?: string;
  token?: string;
  usuario?: UsuarioApi;
  id_usuario?: number;
}

/*
|--------------------------------------------------------------------------
| NORMALIZAR USUARIO
|--------------------------------------------------------------------------
*/

function normalizarUsuario(
  usuario: UsuarioApi
): Usuario {
  const email =
    usuario.email ||
    usuario.correo ||
    '';

  const premium = Boolean(
    usuario.es_premium ??
      usuario.premium ??
      false
  );

  return {
    id_usuario: usuario.id_usuario,

    nombre:
      usuario.nombre ||
      'Usuario',

    email,
    correo: email,

    telefono:
      usuario.telefono ?? null,

    avatar:
      usuario.avatar ?? null,

    rol:
      usuario.rol ||
      'usuario',

    estado:
      usuario.estado ?? null,

    es_premium: premium,
    premium,

    fecha_inicio_premium:
      usuario.fecha_inicio_premium ??
      null,

    fecha_fin_premium:
      usuario.fecha_fin_premium ??
      null,

    proveedor_auth:
      usuario.proveedor_auth ??
      null,
  };
}

/*
|--------------------------------------------------------------------------
| LEER RESPUESTA JSON
|--------------------------------------------------------------------------
*/

async function leerJson(
  respuesta: Response
): Promise<any> {
  let datos: any = null;

  try {
    datos =
      await respuesta.json();
  } catch {
    throw new Error(
      'La respuesta del servidor no es válida.'
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      datos?.mensaje ||
        datos?.error ||
        'Ocurrió un error en el servidor.'
    );
  }

  return datos;
}

/*
|--------------------------------------------------------------------------
| VALIDAR RESPUESTA DE AUTENTICACIÓN
|--------------------------------------------------------------------------
*/

function obtenerDatosSesion(
  datos: RespuestaAuth
): {
  usuario: Usuario;
  token: string;
} {
  if (
    !datos.token ||
    !datos.usuario
  ) {
    throw new Error(
      'La respuesta del servidor no contiene los datos de sesión.'
    );
  }

  return {
    token: datos.token,
    usuario:
      normalizarUsuario(
        datos.usuario
      ),
  };
}

/*
|--------------------------------------------------------------------------
| LOGIN NORMAL
|--------------------------------------------------------------------------
*/

export async function iniciarSesion(
  correo: string,
  password: string
): Promise<{
  usuario: Usuario;
  token: string;
}> {
  const respuesta = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        login:
          correo
            .trim()
            .toLowerCase(),

        password,
      }),
    }
  );

  const datos: RespuestaAuth =
    await leerJson(respuesta);

  return obtenerDatosSesion(datos);
}

/*
|--------------------------------------------------------------------------
| LOGIN CON GOOGLE
|--------------------------------------------------------------------------
*/

export async function iniciarSesionGoogle(
  credential: string
): Promise<{
  usuario: Usuario;
  token: string;
}> {
  if (!credential) {
    throw new Error(
      'Google no devolvió una credencial válida.'
    );
  }

  const respuesta = await fetch(
    `${API_URL}/api/auth/google`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        credential,
      }),
    }
  );

  const datos: RespuestaAuth =
    await leerJson(respuesta);

  return obtenerDatosSesion(datos);
}

/*
|--------------------------------------------------------------------------
| REGISTRO
|--------------------------------------------------------------------------
*/

export async function registrarUsuario(
  nombre: string,
  correo: string,
  password: string
): Promise<{
  usuario: Usuario;
  token: string;
}> {
  const respuesta = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        nombre:
          nombre.trim(),

        email:
          correo
            .trim()
            .toLowerCase(),

        password,
      }),
    }
  );

  await leerJson(respuesta);

  /*
  |--------------------------------------------------------------------------
  | AUTO LOGIN
  |--------------------------------------------------------------------------
  */

  return iniciarSesion(
    correo,
    password
  );
}

/*
|--------------------------------------------------------------------------
| OBTENER SESIÓN
|--------------------------------------------------------------------------
*/

export async function obtenerSesion(
  token: string
): Promise<Usuario> {
  const respuesta = await fetch(
    `${API_URL}/api/auth/me`,
    {
      method: 'GET',

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  const datos =
    await leerJson(respuesta);

  const usuario =
    datos.usuario || datos;

  if (
    !usuario ||
    !usuario.id_usuario
  ) {
    throw new Error(
      'No fue posible obtener la sesión.'
    );
  }

  return normalizarUsuario(
    usuario
  );
}

/*
|--------------------------------------------------------------------------
| ACTUALIZAR PERFIL
|--------------------------------------------------------------------------
*/

export async function actualizarPerfilApi(
  token: string,
  datos: {
    nombre: string;
    email: string;
    telefono?: string;
  }
): Promise<Usuario> {
  const respuesta = await fetch(
    `${API_URL}/api/auth/perfil`,
    {
      method: 'PUT',

      headers: {
        'Content-Type':
          'application/json',

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        nombre:
          datos.nombre.trim(),

        email:
          datos.email
            .trim()
            .toLowerCase(),

        telefono:
          datos.telefono?.trim() ||
          '',
      }),
    }
  );

  const resultado =
    await leerJson(respuesta);

  if (!resultado.usuario) {
    throw new Error(
      'La API no devolvió el usuario actualizado.'
    );
  }

  return normalizarUsuario(
    resultado.usuario
  );
}

/*
|--------------------------------------------------------------------------
| CAMBIAR CONTRASEÑA
|--------------------------------------------------------------------------
*/

export async function cambiarPasswordApi(
  token: string,
  passwordActual: string,
  passwordNuevo: string
): Promise<string> {
  const respuesta = await fetch(
    `${API_URL}/api/auth/cambiar-password`,
    {
      method: 'PUT',

      headers: {
        'Content-Type':
          'application/json',

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        passwordActual,
        passwordNuevo,
      }),
    }
  );

  const datos =
    await leerJson(respuesta);

  return (
    datos.mensaje ||
    'Contraseña actualizada correctamente.'
  );
}

/*
|--------------------------------------------------------------------------
| OLVIDÉ MI CONTRASEÑA
|--------------------------------------------------------------------------
*/

export async function solicitarRecuperacionPassword(
  email: string
): Promise<string> {
  const respuesta = await fetch(
    `${API_URL}/api/auth/forgot-password`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        email:
          email
            .trim()
            .toLowerCase(),
      }),
    }
  );

  const datos =
    await leerJson(respuesta);

  return (
    datos.mensaje ||
    'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.'
  );
}

/*
|--------------------------------------------------------------------------
| RESTABLECER CONTRASEÑA
|--------------------------------------------------------------------------
*/

export async function restablecerPasswordApi(
  token: string,
  password: string
): Promise<string> {
  const respuesta = await fetch(
    `${API_URL}/api/auth/reset-password`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        token,
        password,
      }),
    }
  );

  const datos =
    await leerJson(respuesta);

  return (
    datos.mensaje ||
    'Contraseña restablecida correctamente.'
  );
}

/*
|--------------------------------------------------------------------------
| CERRAR SESIÓN
|--------------------------------------------------------------------------
*/

export async function cerrarSesionApi(
  token: string
): Promise<void> {
  try {
    await fetch(
      `${API_URL}/api/auth/logout`,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );
  } catch {
    /*
    |--------------------------------------------------------------------------
    | El cierre local continuará aunque la API no responda.
    |--------------------------------------------------------------------------
    */
  }
}