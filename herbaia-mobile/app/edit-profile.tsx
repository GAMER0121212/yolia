import { actualizarPerfilApi } from '@/services/authApi';
import {
  updateAuthUser,
  useAuth,
} from '@/store/authStore';

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

export default function EditProfileScreen() {
  const router = useRouter();

  const {
    user,
    token,
  } = useAuth();

  const [nombre, setNombre] =
    useState(user?.nombre || '');

  const [email, setEmail] =
    useState(
      user?.email ||
        user?.correo ||
        ''
    );

  const [telefono, setTelefono] =
    useState(
      user?.telefono || ''
    );

  const [saving, setSaving] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | GUARDAR
  |--------------------------------------------------------------------------
  */

  async function guardarPerfil() {
    if (saving) {
      return;
    }

    const nombreLimpio =
      nombre.trim();

    const emailLimpio =
      email
        .trim()
        .toLowerCase();

    const telefonoLimpio =
      telefono.trim();

    /*
    |--------------------------------------------------------------------------
    | VALIDACIONES
    |--------------------------------------------------------------------------
    */

    if (!nombreLimpio) {
      Alert.alert(
        'Nombre requerido',
        'Ingresa tu nombre.'
      );

      return;
    }

    if (nombreLimpio.length < 3) {
      Alert.alert(
        'Nombre no válido',
        'El nombre debe tener al menos 3 caracteres.'
      );

      return;
    }

    if (!emailLimpio) {
      Alert.alert(
        'Correo requerido',
        'Ingresa tu correo electrónico.'
      );

      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailValido.test(
        emailLimpio
      )
    ) {
      Alert.alert(
        'Correo no válido',
        'Ingresa un correo electrónico válido.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | TELÉFONO
    |--------------------------------------------------------------------------
    */

    if (
      telefonoLimpio &&
      !/^[0-9+\-\s()]{7,20}$/.test(
        telefonoLimpio
      )
    ) {
      Alert.alert(
        'Teléfono no válido',
        'Ingresa un número de teléfono válido.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | SESIÓN
    |--------------------------------------------------------------------------
    */

    if (!token) {
      Alert.alert(
        'Sesión requerida',
        'Inicia sesión nuevamente para editar tu perfil.'
      );

      router.replace('/login');

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR
    |--------------------------------------------------------------------------
    */

    try {
      setSaving(true);

      const usuarioActualizado =
        await actualizarPerfilApi(
          token,
          {
            nombre:
              nombreLimpio,

            email:
              emailLimpio,

            telefono:
              telefonoLimpio,
          }
        );

      /*
      |--------------------------------------------------------------------------
      | ACTUALIZAR AUTH STORE
      |--------------------------------------------------------------------------
      */

      updateAuthUser(
        usuarioActualizado
      );

      Alert.alert(
        'Perfil actualizado',
        'Tus datos se actualizaron correctamente.',
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
          : 'No fue posible actualizar tu perfil.';

      Alert.alert(
        'No se pudo actualizar',
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
          backgroundColor:
            '#F4F6F8',
          justifyContent:
            'center',
          alignItems: 'center',
          paddingHorizontal: 30,
        }}
      >
        <Ionicons
          name="person-outline"
          size={60}
          color="#166534"
        />

        <Text
          style={{
            marginTop: 20,
            fontSize: 22,
            fontWeight: '900',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          Inicia sesión
        </Text>

        <Text
          style={{
            marginTop: 8,
            color: '#6B7280',
            textAlign: 'center',
          }}
        >
          Necesitas iniciar sesión
          para editar tu perfil.
        </Text>

        <TouchableOpacity
          onPress={() =>
            router.replace(
              '/login'
            )
          }
          style={{
            marginTop: 24,
            backgroundColor:
              '#166534',
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
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PANTALLA
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 65,
          paddingBottom: 50,
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
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.back()
            }
            disabled={saving}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor:
                '#FFFFFF',
              justifyContent:
                'center',
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
                fontSize: 28,
                fontWeight: '900',
                color: '#111827',
              }}
            >
              Editar perfil
            </Text>

            <Text
              style={{
                color: '#6B7280',
                marginTop: 2,
                fontSize: 13,
              }}
            >
              Actualiza tus datos personales
            </Text>
          </View>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | AVATAR VISUAL
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          <View
            style={{
              width: 94,
              height: 94,
              borderRadius: 47,
              backgroundColor:
                '#DCFCE7',
              justifyContent:
                'center',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="person"
              size={42}
              color="#166534"
            />
          </View>

          <Text
            style={{
              marginTop: 10,
              color: '#9CA3AF',
              fontSize: 12,
            }}
          >
            La foto de perfil la configuraremos después
          </Text>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | FORMULARIO
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            backgroundColor:
              '#FFFFFF',
            borderRadius: 28,
            padding: 20,
          }}
        >
          {/*
          |--------------------------------------------------------------------------
          | NOMBRE
          |--------------------------------------------------------------------------
          */}

          <Campo
            label="Nombre"
            icon="person-outline"
          >
            <TextInput
              value={nombre}
              onChangeText={
                setNombre
              }
              placeholder="Tu nombre"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              editable={!saving}
              style={{
                flex: 1,
                fontSize: 15,
                color: '#111827',
                paddingVertical: 0,
              }}
            />
          </Campo>

          {/*
          |--------------------------------------------------------------------------
          | CORREO
          |--------------------------------------------------------------------------
          */}

          <Campo
            label="Correo electrónico"
            icon="mail-outline"
          >
            <TextInput
              value={email}
              onChangeText={
                setEmail
              }
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!saving}
              style={{
                flex: 1,
                fontSize: 15,
                color: '#111827',
                paddingVertical: 0,
              }}
            />
          </Campo>

          {/*
          |--------------------------------------------------------------------------
          | TELÉFONO
          |--------------------------------------------------------------------------
          */}

          <Campo
            label="Teléfono"
            icon="call-outline"
            ultimo
          >
            <TextInput
              value={telefono}
              onChangeText={
                setTelefono
              }
              placeholder="Tu número de teléfono"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              editable={!saving}
              maxLength={10}
              style={{
                flex: 1,
                fontSize: 15,
                color: '#111827',
                paddingVertical: 0,
              }}
            />
          </Campo>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | INFORMACIÓN
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            marginTop: 18,
            flexDirection: 'row',
            backgroundColor:
              '#EFF6FF',
            borderRadius: 18,
            padding: 15,
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#2563EB"
          />

          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              color: '#475569',
              fontSize: 12,
              lineHeight: 18,
            }}
          >
            El correo electrónico
            debe ser único. Si otro
            usuario ya utiliza el
            correo o teléfono,
            Yolia no permitirá el
            cambio.
          </Text>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | GUARDAR
        |--------------------------------------------------------------------------
        */}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            void guardarPerfil()
          }
          disabled={saving}
          style={{
            marginTop: 26,
            minHeight: 56,
            borderRadius: 18,
            backgroundColor:
              saving
                ? '#86A995'
                : '#166534',
            justifyContent:
              'center',
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
                  marginLeft: 10,
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: 16,
                }}
              >
                Guardando...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#FFFFFF"
              />

              <Text
                style={{
                  marginLeft: 8,
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: 16,
                }}
              >
                Guardar cambios
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
| CAMPO
|--------------------------------------------------------------------------
*/

function Campo({
  label,
  icon,
  ultimo = false,
  children,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  ultimo?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        marginBottom:
          ultimo ? 0 : 22,
      }}
    >
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

      <View
        style={{
          height: 54,
          borderWidth: 1,
          borderColor:
            '#E5E7EB',
          borderRadius: 16,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          backgroundColor:
            '#F9FAFB',
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color="#166534"
        />

        <View
          style={{
            flex: 1,
            marginLeft: 11,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}