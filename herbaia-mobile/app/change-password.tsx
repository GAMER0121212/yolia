import { cambiarPasswordApi } from '@/services/authApi';
import { useAuth } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ChangePasswordScreen() {
  const router = useRouter();

  const { user, token } = useAuth();

  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNuevo, setPasswordNuevo] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [saving, setSaving] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CAMBIAR CONTRASEÑA
  |--------------------------------------------------------------------------
  */

  async function cambiarPassword() {
    if (saving) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | CAMPOS VACÍOS
    |--------------------------------------------------------------------------
    */

    if (
      !passwordActual ||
      !passwordNuevo ||
      !confirmarPassword
    ) {
      Alert.alert(
        'Campos incompletos',
        'Completa todos los campos.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | LONGITUD MÍNIMA
    |--------------------------------------------------------------------------
    */

    if (passwordNuevo.length < 6) {
      Alert.alert(
        'Contraseña muy corta',
        'La nueva contraseña debe tener al menos 6 caracteres.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | CONFIRMACIÓN
    |--------------------------------------------------------------------------
    */

    if (passwordNuevo !== confirmarPassword) {
      Alert.alert(
        'Las contraseñas no coinciden',
        'La nueva contraseña y su confirmación deben ser iguales.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | MISMA CONTRASEÑA
    |--------------------------------------------------------------------------
    */

    if (passwordActual === passwordNuevo) {
      Alert.alert(
        'Usa otra contraseña',
        'La nueva contraseña debe ser diferente de la contraseña actual.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | TOKEN
    |--------------------------------------------------------------------------
    */

    if (!token) {
      Alert.alert(
        'Sesión requerida',
        'Tu sesión no está disponible. Inicia sesión nuevamente.'
      );

      router.replace('/login');

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | CAMBIAR EN BACKEND
    |--------------------------------------------------------------------------
    */

    try {
      setSaving(true);

      await cambiarPasswordApi(
        token,
        passwordActual,
        passwordNuevo
      );

      /*
      |--------------------------------------------------------------------------
      | LIMPIAR CAMPOS
      |--------------------------------------------------------------------------
      */

      setPasswordActual('');
      setPasswordNuevo('');
      setConfirmarPassword('');

      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña se cambió correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No fue posible cambiar la contraseña.';

      Alert.alert(
        'No se pudo cambiar',
        mensaje
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SIN USUARIO
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F4F6F8',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 30,
        }}
      >
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: '#DCFCE7',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="lock-closed-outline"
            size={40}
            color="#166534"
          />
        </View>

        <Text
          style={{
            marginTop: 20,
            fontSize: 24,
            fontWeight: '900',
            color: '#111827',
          }}
        >
          Inicia sesión
        </Text>

        <Text
          style={{
            marginTop: 8,
            textAlign: 'center',
            color: '#6B7280',
            lineHeight: 21,
          }}
        >
          Necesitas iniciar sesión para cambiar tu contraseña.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            router.replace('/login');
          }}
          style={{
            marginTop: 24,
            backgroundColor: '#166534',
            paddingHorizontal: 28,
            paddingVertical: 14,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '800',
            }}
          >
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        {/*
        |--------------------------------------------------------------------------
        | RECUPERAR SIN SESIÓN
        |--------------------------------------------------------------------------
        */}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push('/forgot-password');
          }}
          style={{
            marginTop: 14,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              color: '#166534',
              fontSize: 14,
              fontWeight: '800',
            }}
          >
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PANTALLA PRINCIPAL
  |--------------------------------------------------------------------------
  */

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: '#F4F6F8',
      }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
      keyboardVerticalOffset={0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 65,

          /*
          |--------------------------------------------------------------------------
          | Espacio extra inferior para evitar sobreposición
          |--------------------------------------------------------------------------
          */

          paddingBottom: 100,
        }}
      >
        {/*
        |--------------------------------------------------------------------------
        | HEADER
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              router.back();
            }}
            disabled={saving}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#FFFFFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 14,
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
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 27,
                fontWeight: '900',
                color: '#111827',
              }}
            >
              Cambiar contraseña
            </Text>

            <Text
              style={{
                marginTop: 2,
                color: '#6B7280',
                fontSize: 13,
              }}
            >
              Protege tu cuenta de Yolia
            </Text>
          </View>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | ICONO
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            alignItems: 'center',
            marginBottom: 26,
          }}
        >
          <View
            style={{
              width: 86,
              height: 86,
              borderRadius: 43,
              backgroundColor: '#DCFCE7',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="key-outline"
              size={39}
              color="#166534"
            />
          </View>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | FORMULARIO
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            padding: 20,
          }}
        >
          {/*
          |--------------------------------------------------------------------------
          | CONTRASEÑA ACTUAL
          |--------------------------------------------------------------------------
          */}

          <PasswordField
            label="Contraseña actual"
            value={passwordActual}
            onChangeText={setPasswordActual}
            visible={mostrarActual}
            onToggle={() => {
              setMostrarActual(!mostrarActual);
            }}
            placeholder="Ingresa tu contraseña actual"
          />

          {/*
          |--------------------------------------------------------------------------
          | NUEVA CONTRASEÑA
          |--------------------------------------------------------------------------
          */}

          <PasswordField
            label="Nueva contraseña"
            value={passwordNuevo}
            onChangeText={setPasswordNuevo}
            visible={mostrarNuevo}
            onToggle={() => {
              setMostrarNuevo(!mostrarNuevo);
            }}
            placeholder="Ingresa tu nueva contraseña"
          />

          {/*
          |--------------------------------------------------------------------------
          | CONFIRMAR CONTRASEÑA
          |--------------------------------------------------------------------------
          */}

          <PasswordField
            label="Confirmar contraseña"
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
            visible={mostrarConfirmacion}
            onToggle={() => {
              setMostrarConfirmacion(
                !mostrarConfirmacion
              );
            }}
            placeholder="Repite tu nueva contraseña"
            ultimo
          />
        </View>

        {/*
        |--------------------------------------------------------------------------
        | OLVIDÉ MI CONTRASEÑA
        |--------------------------------------------------------------------------
        */}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push('/forgot-password');
          }}
          style={{
            alignSelf: 'center',
            marginTop: 18,
            marginBottom: 6,
            paddingVertical: 10,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              color: '#166534',
              fontSize: 14,
              fontWeight: '800',
              textAlign: 'center',
            }}
          >
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {/*
        |--------------------------------------------------------------------------
        | RECOMENDACIÓN
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            marginTop: 10,
            backgroundColor: '#FEFCE8',
            borderRadius: 18,
            padding: 16,
            flexDirection: 'row',
          }}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={22}
            color="#A16207"
          />

          <View
            style={{
              flex: 1,
              marginLeft: 10,
            }}
          >
            <Text
              style={{
                fontWeight: '800',
                color: '#713F12',
                fontSize: 13,
              }}
            >
              Contraseña segura
            </Text>

            <Text
              style={{
                marginTop: 4,
                color: '#854D0E',
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              Utiliza una combinación de letras, números y
              símbolos que sea difícil de adivinar.
            </Text>
          </View>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | BOTÓN CAMBIAR CONTRASEÑA
        |--------------------------------------------------------------------------
        */}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            void cambiarPassword();
          }}
          disabled={saving}
          style={{
            marginTop: 26,
            minHeight: 56,
            borderRadius: 18,

            backgroundColor:
              saving
                ? '#86A995'
                : '#166534',

            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          {saving ? (
            <>
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '800',
                  marginLeft: 10,
                }}
              >
                Actualizando...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '800',
                  marginLeft: 8,
                }}
              >
                Cambiar contraseña
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/*
|--------------------------------------------------------------------------
| COMPONENTE CAMPO CONTRASEÑA
|--------------------------------------------------------------------------
*/

function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  onToggle,
  placeholder,
  ultimo = false,
}: {
  label: string;

  value: string;

  onChangeText: (
    text: string
  ) => void;

  visible: boolean;

  onToggle: () => void;

  placeholder: string;

  ultimo?: boolean;
}) {
  return (
    <View
      style={{
        marginBottom:
          ultimo
            ? 0
            : 22,
      }}
    >
      {/*
      |--------------------------------------------------------------------------
      | LABEL
      |--------------------------------------------------------------------------
      */}

      <Text
        style={{
          marginBottom: 8,
          color: '#374151',
          fontSize: 13,
          fontWeight: '800',
        }}
      >
        {label}
      </Text>

      {/*
      |--------------------------------------------------------------------------
      | INPUT
      |--------------------------------------------------------------------------
      */}

      <View
        style={{
          minHeight: 56,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 16,

          flexDirection: 'row',
          alignItems: 'center',

          paddingHorizontal: 15,

          backgroundColor: '#F9FAFB',
        }}
      >
        <Ionicons
          name="lock-closed-outline"
          size={19}
          color="#166534"
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"

          secureTextEntry={!visible}

          autoCapitalize="none"
          autoCorrect={false}

          style={{
            flex: 1,
            marginLeft: 11,
            color: '#111827',
            fontSize: 15,
            paddingVertical: 15,
          }}
        />

        {/*
        |--------------------------------------------------------------------------
        | MOSTRAR / OCULTAR
        |--------------------------------------------------------------------------
        */}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggle}
          style={{
            padding: 8,
          }}
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
    </View>
  );
}