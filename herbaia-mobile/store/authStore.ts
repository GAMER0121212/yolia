import {
  cerrarSesionApi,
  iniciarSesion,
  iniciarSesionGoogle,
  obtenerSesion,
  registrarUsuario,
  Usuario,
} from '@/services/authApi';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const TOKEN_KEY = 'herbaia.token';

/*
|--------------------------------------------------------------------------
| ESTADO DE AUTENTICACIÓN
|--------------------------------------------------------------------------
*/

type AuthState = {
  ready: boolean;
  token: string | null;
  user: Usuario | null;
};

let state: AuthState = {
  ready: false,
  token: null,
  user: null,
};

/*
|--------------------------------------------------------------------------
| LISTENERS
|--------------------------------------------------------------------------
*/

const listeners =
  new Set<() => void>();

function emit() {
  listeners.forEach(
    (listener) => listener()
  );
}

function setState(
  patch: Partial<AuthState>
) {
  state = {
    ...state,
    ...patch,
  };

  emit();
}

/*
|--------------------------------------------------------------------------
| SUSCRIPCIÓN
|--------------------------------------------------------------------------
*/

export function subscribeAuth(
  listener: () => void
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/*
|--------------------------------------------------------------------------
| OBTENER ESTADO
|--------------------------------------------------------------------------
*/

export function getAuthState() {
  return state;
}

/*
|--------------------------------------------------------------------------
| GUARDAR SESIÓN
|--------------------------------------------------------------------------
*/

async function guardarSesion(
  token: string,
  usuario: Usuario
) {
  await AsyncStorage.setItem(
    TOKEN_KEY,
    token
  );

  setState({
    ready: true,
    token,
    user: usuario,
  });
}

/*
|--------------------------------------------------------------------------
| CARGAR SESIÓN
|--------------------------------------------------------------------------
*/

export async function loadSession() {
  try {
    const token =
      await AsyncStorage.getItem(
        TOKEN_KEY
      );

    if (!token) {
      setState({
        ready: true,
        token: null,
        user: null,
      });

      return;
    }

    const user =
      await obtenerSesion(token);

    setState({
      ready: true,
      token,
      user,
    });
  } catch {
    await AsyncStorage.removeItem(
      TOKEN_KEY
    );

    setState({
      ready: true,
      token: null,
      user: null,
    });
  }
}

/*
|--------------------------------------------------------------------------
| LOGIN NORMAL
|--------------------------------------------------------------------------
*/

export async function login(
  correo: string,
  password: string
) {
  const {
    usuario,
    token,
  } = await iniciarSesion(
    correo,
    password
  );

  await guardarSesion(
    token,
    usuario
  );
}

/*
|--------------------------------------------------------------------------
| LOGIN GOOGLE
|--------------------------------------------------------------------------
*/

export async function loginWithGoogle(
  credential: string
) {
  const {
    usuario,
    token,
  } = await iniciarSesionGoogle(
    credential
  );

  await guardarSesion(
    token,
    usuario
  );
}

/*
|--------------------------------------------------------------------------
| REGISTRO
|--------------------------------------------------------------------------
*/

export async function register(
  nombre: string,
  correo: string,
  password: string
) {
  const {
    usuario,
    token,
  } = await registrarUsuario(
    nombre,
    correo,
    password
  );

  await guardarSesion(
    token,
    usuario
  );
}

/*
|--------------------------------------------------------------------------
| ACTUALIZAR USUARIO LOCAL
|--------------------------------------------------------------------------
*/

export function updateAuthUser(
  user: Usuario
) {
  setState({
    user,
  });
}

/*
|--------------------------------------------------------------------------
| REFRESCAR USUARIO
|--------------------------------------------------------------------------
*/

export async function refreshAuthUser() {
  const token = state.token;

  if (!token) {
    throw new Error(
      'No existe una sesión activa'
    );
  }

  const user =
    await obtenerSesion(token);

  setState({
    user,
  });

  return user;
}

/*
|--------------------------------------------------------------------------
| CERRAR SESIÓN
|--------------------------------------------------------------------------
*/

export async function logout() {
  const token = state.token;

  if (token) {
    try {
      await cerrarSesionApi(
        token
      );
    } catch {
      /*
      |--------------------------------------------------------------------------
      | Aunque falle la API cerramos localmente.
      |--------------------------------------------------------------------------
      */
    }
  }

  await AsyncStorage.removeItem(
    TOKEN_KEY
  );

  setState({
    token: null,
    user: null,
    ready: true,
  });
}

/*
|--------------------------------------------------------------------------
| HOOK
|--------------------------------------------------------------------------
*/

export function useAuth() {
  return useSyncExternalStore(
    subscribeAuth,
    getAuthState,
    getAuthState
  );
}