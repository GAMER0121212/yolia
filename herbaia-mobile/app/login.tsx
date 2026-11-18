import {
  login,
  loginWithGoogle,
  register,
  useAuth,
} from '@/store/authStore';

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { Ionicons } from '@expo/vector-icons';

import {
  Redirect,
  useRouter,
} from 'expo-router';

import {
  type ComponentProps,
  useState,
} from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN GOOGLE
|--------------------------------------------------------------------------
*/

const GOOGLE_WEB_CLIENT_ID =
  process.env
    .EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

const GOOGLE_IOS_CLIENT_ID =
  process.env
    .EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

if (!GOOGLE_WEB_CLIENT_ID) {
  console.warn(
    'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID no está configurado.'
  );
}

GoogleSignin.configure({
  webClientId:
    GOOGLE_WEB_CLIENT_ID,

  iosClientId:
    GOOGLE_IOS_CLIENT_ID,

  offlineAccess: false,
});

export default function LoginScreen() {
  const router = useRouter();

  const {
    user,
    ready,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | MODO
  |--------------------------------------------------------------------------
  */

  const [mode, setMode] =
    useState<
      'login' | 'register'
    >('login');

  /*
  |--------------------------------------------------------------------------
  | CAMPOS
  |--------------------------------------------------------------------------
  */

  const [nombre, setNombre] =
    useState('');

  const [correo, setCorreo] =
    useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    confirmarPassword,
    setConfirmarPassword,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] =
    useState(false);

  const [
    googleLoading,
    setGoogleLoading,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const [
    mostrarPassword,
    setMostrarPassword,
  ] = useState(false);

  const [
    mostrarConfirmacion,
    setMostrarConfirmacion,
  ] = useState(false);

  const bloqueado =
    loading || googleLoading;

  /*
  |--------------------------------------------------------------------------
  | USUARIO YA AUTENTICADO
  |--------------------------------------------------------------------------
  */

  if (ready && user) {
    return (
      <Redirect href="/(tabs)" />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VALIDAR CORREO
  |--------------------------------------------------------------------------
  */

  function correoValido(
    email: string
  ) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }

  /*
  |--------------------------------------------------------------------------
  | LOGIN / REGISTRO NORMAL
  |--------------------------------------------------------------------------
  */

  async function onSubmit() {
    if (bloqueado) {
      return;
    }

    const email =
      correo
        .trim()
        .toLowerCase();

    const pass =
      password.trim();

    const name =
      nombre.trim();

    const confirmacion =
      confirmarPassword.trim();

    setError('');

    if (!email) {
      setError(
        'Escribe tu correo electrónico.'
      );

      return;
    }

    if (!correoValido(email)) {
      setError(
        'Escribe un correo electrónico válido.'
      );

      return;
    }

    if (!pass) {
      setError(
        'Escribe tu contraseña.'
      );

      return;
    }

    if (pass.length < 8) {
      setError(
        'La contraseña debe tener al menos 8 caracteres.'
      );

      return;
    }

    if (mode === 'register') {
      if (name.length < 2) {
        setError(
          'Escribe tu nombre.'
        );

        return;
      }

      if (!confirmacion) {
        setError(
          'Confirma tu contraseña.'
        );

        return;
      }

      if (
        pass !== confirmacion
      ) {
        setError(
          'Las contraseñas no coinciden.'
        );

        return;
      }
    }

    try {
      setLoading(true);

      if (
        mode === 'register'
      ) {
        await register(
          name,
          email,
          pass
        );
      } else {
        await login(
          email,
          pass
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : mode === 'login'
            ? 'No se pudo iniciar sesión.'
            : 'No se pudo crear la cuenta.'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | GOOGLE
  |--------------------------------------------------------------------------
  */

  async function onGoogleLogin() {
    if (bloqueado) {
      return;
    }

    setError('');

    try {
      setGoogleLoading(true);

      if (
        Platform.OS === 'android'
      ) {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog:
            true,
        });
      }

      const resultado =
        await GoogleSignin.signIn();

      if (
        !isSuccessResponse(
          resultado
        )
      ) {
        return;
      }

      const idToken =
        resultado.data.idToken;

      if (!idToken) {
        throw new Error(
          'Google no devolvió un token de identidad.'
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Enviamos el ID TOKEN al backend de Yolia
      |--------------------------------------------------------------------------
      */

      await loginWithGoogle(
        idToken
      );
    } catch (err) {
      if (
        isErrorWithCode(err)
      ) {
        switch (err.code) {
          case statusCodes.IN_PROGRESS:
            setError(
              'Ya hay un inicio de sesión con Google en proceso.'
            );
            break;

          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setError(
              'Google Play Services no está disponible o necesita actualizarse.'
            );
            break;

          default:
            setError(
              err.message ||
                'No se pudo iniciar sesión con Google.'
            );
            break;
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo iniciar sesión con Google.'
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CAMBIAR LOGIN / REGISTRO
  |--------------------------------------------------------------------------
  */

  function cambiarModo() {
    setError('');

    setNombre('');
    setPassword('');
    setConfirmarPassword('');

    setMostrarPassword(false);
    setMostrarConfirmacion(false);

    setMode(
      (modoActual) =>
        modoActual === 'login'
          ? 'register'
          : 'login'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor:
          '#F4F6F8',
      }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          justifyContent:
            'center',
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
      >
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
          disabled={bloqueado}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor:
              '#FFFFFF',
            justifyContent:
              'center',
            alignItems:
              'center',
            marginBottom: 28,

            shadowColor:
              '#000000',

            shadowOpacity:
              0.05,

            shadowRadius: 8,

            elevation: 2,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#166534"
          />
        </TouchableOpacity>

        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            backgroundColor:
              '#166534',
            alignItems:
              'center',
            justifyContent:
              'center',
            marginBottom: 18,
          }}
        >
          <Ionicons
            name="leaf"
            size={34}
            color="#FFFFFF"
          />
        </View>

        <Text
          style={{
            fontSize: 32,
            fontWeight: '900',
            color: '#111827',
          }}
        >
          Yolia
        </Text>

        <Text
          style={{
            marginTop: 8,
            color: '#6B7280',
            fontSize: 16,
            lineHeight: 24,
          }}
        >
          {mode === 'login'
            ? 'Inicia sesión para guardar tus plantas favoritas y acceder a tus funciones personales.'
            : 'Crea una cuenta para disfrutar de todas las funciones de Yolia.'}
        </Text>

        <View
          style={{
            marginTop: 28,
            backgroundColor:
              '#FFFFFF',
            borderRadius: 28,
            padding: 20,

            shadowColor:
              '#000000',

            shadowOpacity:
              0.06,

            shadowRadius: 16,

            shadowOffset: {
              width: 0,
              height: 5,
            },

            elevation: 4,
          }}
        >
          {mode ===
            'register' && (
            <Field
              icon="person-outline"
              placeholder="Nombre completo"
              value={nombre}
              onChangeText={
                setNombre
              }
              autoCapitalize="words"
              editable={!bloqueado}
              returnKeyType="next"
            />
          )}

          <Field
            icon="mail-outline"
            placeholder="Correo electrónico"
            value={correo}
            onChangeText={
              setCorreo
            }
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!bloqueado}
            returnKeyType="next"
          />

          <PasswordField
            placeholder="Contraseña"
            value={password}
            onChangeText={
              setPassword
            }
            visible={
              mostrarPassword
            }
            onToggle={() =>
              setMostrarPassword(
                (actual) =>
                  !actual
              )
            }
            editable={!bloqueado}
            onSubmitEditing={
              mode === 'login'
                ? onSubmit
                : undefined
            }
          />

          {mode ===
            'register' && (
            <PasswordField
              placeholder="Confirmar contraseña"
              value={
                confirmarPassword
              }
              onChangeText={
                setConfirmarPassword
              }
              visible={
                mostrarConfirmacion
              }
              onToggle={() =>
                setMostrarConfirmacion(
                  (actual) =>
                    !actual
                )
              }
              editable={
                !bloqueado
              }
              onSubmitEditing={
                onSubmit
              }
            />
          )}

          {mode === 'login' ? (
            <TouchableOpacity
              disabled={bloqueado}
              onPress={() => {
                setError(
                  'La recuperación de contraseña se configurará a continuación.'
                );
              }}
              style={{
                alignSelf:
                  'flex-end',
                marginBottom: 18,
                marginTop: 2,
              }}
            >
              <Text
                style={{
                  color:
                    '#166534',
                  fontWeight:
                    '700',
                  fontSize: 14,
                }}
              >
                ¿Olvidaste tu
                contraseña?
              </Text>
            </TouchableOpacity>
          ) : null}

          {error ? (
            <View
              style={{
                backgroundColor:
                  '#FEF2F2',

                borderRadius: 14,

                paddingHorizontal:
                  14,

                paddingVertical:
                  12,

                marginBottom: 14,

                flexDirection:
                  'row',

                alignItems:
                  'flex-start',
              }}
            >
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#B91C1C"
              />

              <Text
                style={{
                  color:
                    '#B91C1C',

                  marginLeft: 8,

                  fontWeight:
                    '600',

                  flex: 1,

                  lineHeight: 20,
                }}
              >
                {error}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              void onSubmit()
            }
            disabled={bloqueado}
            style={{
              backgroundColor:
                '#166534',

              borderRadius: 18,

              paddingVertical: 16,

              alignItems:
                'center',

              justifyContent:
                'center',

              minHeight: 54,

              opacity:
                bloqueado
                  ? 0.7
                  : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={{
                  color:
                    '#FFFFFF',

                  fontWeight:
                    '800',

                  fontSize: 16,
                }}
              >
                {mode ===
                'login'
                  ? 'Iniciar sesión'
                  : 'Crear cuenta'}
              </Text>
            )}
          </TouchableOpacity>

          {/*
          |--------------------------------------------------------------------------
          | SEPARADOR
          |--------------------------------------------------------------------------
          */}

          <View
            style={{
              flexDirection:
                'row',
              alignItems:
                'center',
              marginVertical: 18,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor:
                  '#E5E7EB',
              }}
            />

            <Text
              style={{
                marginHorizontal: 12,
                color: '#9CA3AF',
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              o
            </Text>

            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor:
                  '#E5E7EB',
              }}
            />
          </View>

          {/*
          |--------------------------------------------------------------------------
          | GOOGLE
          |--------------------------------------------------------------------------
          */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              void onGoogleLogin()
            }
            disabled={bloqueado}
            style={{
              minHeight: 54,
              borderRadius: 18,
              borderWidth: 1,
              borderColor:
                '#D1D5DB',

              backgroundColor:
                '#FFFFFF',

              flexDirection:
                'row',

              alignItems:
                'center',

              justifyContent:
                'center',

              opacity:
                bloqueado
                  ? 0.6
                  : 1,
            }}
          >
            {googleLoading ? (
              <ActivityIndicator
                color="#166534"
              />
            ) : (
              <>
                <Ionicons
                  name="logo-google"
                  size={21}
                  color="#111827"
                />

                <Text
                  style={{
                    marginLeft: 10,
                    color:
                      '#1F2937',

                    fontSize: 16,

                    fontWeight:
                      '700',
                  }}
                >
                  Continuar con Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={
              cambiarModo
            }
            disabled={bloqueado}
            style={{
              marginTop: 18,
              alignItems:
                'center',
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color:
                  '#166534',
                fontWeight:
                  '700',
                textAlign:
                  'center',
              }}
            >
              {mode === 'login'
                ? '¿No tienes cuenta? Regístrate'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.replace(
              '/(tabs)'
            )
          }
          disabled={bloqueado}
          style={{
            marginTop: 22,
            alignItems: 'center',
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              color: '#6B7280',
              fontSize: 14,
            }}
          >
            ¿Quieres explorar
            primero?
          </Text>

          <Text
            style={{
              color: '#166534',
              fontWeight: '800',
              marginTop: 3,
              fontSize: 15,
            }}
          >
            Continuar como
            invitado
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            marginTop: 16,
            color: '#9CA3AF',
            textAlign: 'center',
            lineHeight: 19,
            fontSize: 12,
            paddingHorizontal: 15,
          }}
        >
          Al utilizar Yolia
          aceptas nuestros términos
          de uso y aviso de
          privacidad.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/*
|--------------------------------------------------------------------------
| CAMPO NORMAL
|--------------------------------------------------------------------------
*/

function Field({
  icon,
  ...props
}: {
  icon:
    keyof typeof Ionicons.glyphMap;
} & ComponentProps<
  typeof TextInput
>) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:
          '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 14,
        marginBottom: 12,
        minHeight: 54,
      }}
    >
      <Ionicons
        name={icon}
        size={19}
        color="#6B7280"
      />

      <TextInput
        placeholderTextColor="#9CA3AF"
        style={{
          flex: 1,
          paddingVertical: 14,
          paddingLeft: 10,
          fontSize: 16,
          color: '#111827',
        }}
        {...props}
      />
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| CAMPO CONTRASEÑA
|--------------------------------------------------------------------------
*/

function PasswordField({
  visible,
  onToggle,
  ...props
}: {
  visible: boolean;
  onToggle: () => void;
} & ComponentProps<
  typeof TextInput
>) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:
          '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 14,
        marginBottom: 12,
        minHeight: 54,
      }}
    >
      <Ionicons
        name="lock-closed-outline"
        size={19}
        color="#6B7280"
      />

      <TextInput
        placeholderTextColor="#9CA3AF"
        secureTextEntry={
          !visible
        }
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          flex: 1,
          paddingVertical: 14,
          paddingHorizontal: 10,
          fontSize: 16,
          color: '#111827',
        }}
        {...props}
      />

      <TouchableOpacity
        onPress={onToggle}
        hitSlop={10}
      >
        <Ionicons
          name={
            visible
              ? 'eye-off-outline'
              : 'eye-outline'
          }
          size={21}
          color="#6B7280"
        />
      </TouchableOpacity>
    </View>
  );
}