import { API_URL } from '@/services/apiUrl';
import { logout, useAuth } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/*
|--------------------------------------------------------------------------
| OBTENER AVATAR
|--------------------------------------------------------------------------
*/

function obtenerAvatar(
  avatar?: string | null
) {
  if (!avatar) {
    return null;
  }

  if (
    avatar.startsWith('http://') ||
    avatar.startsWith('https://')
  ) {
    return avatar;
  }

  return `${API_URL}/uploads/${avatar}`;
}

/*
|--------------------------------------------------------------------------
| NOMBRE DEL ROL
|--------------------------------------------------------------------------
*/

function obtenerNombreRol(
  rol?: string
) {
  switch (
    rol?.toLowerCase()
  ) {
    case 'admin':
      return 'Administrador';

    case 'investigador':
      return 'Investigador';

    default:
      return 'Usuario';
  }
}

/*
|--------------------------------------------------------------------------
| ICONO DEL ROL
|--------------------------------------------------------------------------
*/

function obtenerIconoRol(
  rol?: string
): keyof typeof Ionicons.glyphMap {
  switch (
    rol?.toLowerCase()
  ) {
    case 'admin':
      return 'shield-checkmark';

    case 'investigador':
      return 'flask';

    default:
      return 'person';
  }
}

/*
|--------------------------------------------------------------------------
| PERFIL
|--------------------------------------------------------------------------
*/

export default function ProfileScreen() {
  const router = useRouter();

  const {
    user,
    ready,
  } = useAuth();

  const [
    leaving,
    setLeaving,
  ] = useState(false);

  const [
    errorAvatar,
    setErrorAvatar,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CERRAR SESIÓN
  |--------------------------------------------------------------------------
  */

  async function onLogout() {
    if (leaving) {
      return;
    }

    Alert.alert(
      'Cerrar sesión',
      '¿Quieres cerrar tu sesión en Yolia?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',

          onPress: async () => {
            try {
              setLeaving(true);

              await logout();

              router.replace(
                '/login'
              );
            } finally {
              setLeaving(false);
            }
          },
        },
      ]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | CARGANDO SESIÓN
  |--------------------------------------------------------------------------
  */

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            '#F4F6F8',
          justifyContent:
            'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#166534"
        />

        <Text
          style={{
            marginTop: 12,
            color: '#6B7280',
          }}
        >
          Cargando perfil...
        </Text>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | INVITADO
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
          paddingHorizontal: 28,
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor:
              '#DCFCE7',
            justifyContent:
              'center',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="person-outline"
            size={48}
            color="#166534"
          />
        </View>

        <Text
          style={{
            marginTop: 24,
            fontSize: 26,
            fontWeight: '900',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          Tu perfil de Yolia
        </Text>

        <Text
          style={{
            marginTop: 10,
            color: '#6B7280',
            fontSize: 15,
            lineHeight: 23,
            textAlign: 'center',
          }}
        >
          Inicia sesión para
          acceder a tu perfil,
          favoritos, historial y
          demás funciones
          personales.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push('/login')
          }
          style={{
            marginTop: 28,
            backgroundColor:
              '#166534',
            borderRadius: 18,
            paddingVertical: 15,
            paddingHorizontal: 32,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '800',
            }}
          >
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.replace(
              '/(tabs)'
            )
          }
          style={{
            marginTop: 16,
            padding: 8,
          }}
        >
          <Text
            style={{
              color: '#166534',
              fontWeight: '700',
            }}
          >
            Continuar como invitado
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DATOS
  |--------------------------------------------------------------------------
  */

  const avatar =
    obtenerAvatar(
      user.avatar
    );

  const nombreRol =
    obtenerNombreRol(
      user.rol
    );

  const iconoRol =
    obtenerIconoRol(
      user.rol
    );

  const premium =
    Boolean(
      user.es_premium ??
        user.premium
    );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          '#F4F6F8',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 65,
          paddingBottom: 130,
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
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.back()
            }
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

          <Text
            style={{
              fontSize: 30,
              fontWeight: '900',
              color: '#111827',
            }}
          >
            Mi perfil
          </Text>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | TARJETA DEL USUARIO
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            backgroundColor:
              '#FFFFFF',
            borderRadius: 30,
            padding: 24,
            alignItems: 'center',

            shadowColor:
              '#000000',
            shadowOpacity: 0.05,
            shadowRadius: 12,
            shadowOffset: {
              width: 0,
              height: 4,
            },

            elevation: 3,
          }}
        >
          {/*
          |--------------------------------------------------------------------------
          | AVATAR
          |--------------------------------------------------------------------------
          */}

          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor:
                '#DCFCE7',
              justifyContent:
                'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {avatar &&
            !errorAvatar ? (
              <Image
                source={{
                  uri: avatar,
                }}
                onError={() =>
                  setErrorAvatar(
                    true
                  )
                }
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="person"
                size={45}
                color="#166534"
              />
            )}
          </View>

          {/*
          |--------------------------------------------------------------------------
          | NOMBRE
          |--------------------------------------------------------------------------
          */}

          <Text
            style={{
              fontSize: 24,
              fontWeight: '900',
              color: '#111827',
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {user.nombre}
          </Text>

          <Text
            style={{
              color: '#6B7280',
              marginTop: 6,
              fontSize: 15,
              textAlign: 'center',
            }}
          >
            {user.email ||
              user.correo}
          </Text>

          {/*
          |--------------------------------------------------------------------------
          | ROL
          |--------------------------------------------------------------------------
          */}

          <View
            style={{
              marginTop: 14,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor:
                '#DCFCE7',
              paddingHorizontal: 13,
              paddingVertical: 7,
              borderRadius: 100,
            }}
          >
            <Ionicons
              name={iconoRol}
              size={16}
              color="#166534"
            />

            <Text
              style={{
                marginLeft: 6,
                color: '#166534',
                fontWeight: '800',
                fontSize: 13,
              }}
            >
              {nombreRol}
            </Text>
          </View>

          {/*
          |--------------------------------------------------------------------------
          | PREMIUM
          |--------------------------------------------------------------------------
          */}

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',

              backgroundColor:
                premium
                  ? '#FEF3C7'
                  : '#F3F4F6',

              paddingHorizontal: 13,
              paddingVertical: 7,
              borderRadius: 100,
            }}
          >
            <Ionicons
              name={
                premium
                  ? 'diamond'
                  : 'leaf-outline'
              }
              size={15}
              color={
                premium
                  ? '#A16207'
                  : '#6B7280'
              }
            />

            <Text
              style={{
                marginLeft: 6,

                color:
                  premium
                    ? '#A16207'
                    : '#6B7280',

                fontWeight: '800',
                fontSize: 13,
              }}
            >
              {premium
                ? 'Yolia Premium'
                : 'Plan gratuito'}
            </Text>
          </View>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | INFORMACIÓN PERSONAL
        |--------------------------------------------------------------------------
        */}

        <Text
          style={{
            marginTop: 28,
            marginBottom: 10,
            marginLeft: 4,
            fontSize: 14,
            fontWeight: '800',
            color: '#6B7280',
            textTransform:
              'uppercase',
            letterSpacing: 0.7,
          }}
        >
          Información personal
        </Text>

        <View
          style={{
            backgroundColor:
              '#FFFFFF',
            borderRadius: 24,
            overflow: 'hidden',
          }}
        >
          <InfoRow
            icon="mail-outline"
            title="Correo"
            value={
              user.email ||
              user.correo
            }
          />

          <Divider />

          <InfoRow
            icon="call-outline"
            title="Teléfono"
            value={
              user.telefono ||
              'No registrado'
            }
          />

          <Divider />

          <InfoRow
            icon="shield-checkmark-outline"
            title="Tipo de cuenta"
            value={nombreRol}
          />
        </View>

        {/*
        |--------------------------------------------------------------------------
        | MI YOLIA
        |--------------------------------------------------------------------------
        */}

        <Text
          style={{
            marginTop: 28,
            marginBottom: 10,
            marginLeft: 4,
            fontSize: 14,
            fontWeight: '800',
            color: '#6B7280',
            textTransform:
              'uppercase',
            letterSpacing: 0.7,
          }}
        >
          Mi Yolia
        </Text>

        <View
          style={{
            backgroundColor:
              '#FFFFFF',
            borderRadius: 24,
            overflow: 'hidden',
          }}
        >
          <MenuRow
            icon="heart-outline"
            title="Mis favoritos"
            subtitle="Plantas que has guardado"
            onPress={() =>
              router.push(
                '/(tabs)/favorites'
              )
            }
          />

          <Divider />

          <MenuRow
            icon="time-outline"
            title="Mi historial"
            subtitle="Consulta tu actividad"
            onPress={() =>
              router.push(
                '/(tabs)/history'
              )
            }
          />
        </View>

        {/*
        |--------------------------------------------------------------------------
        | CUENTA
        |--------------------------------------------------------------------------
        */}

        <Text
          style={{
            marginTop: 28,
            marginBottom: 10,
            marginLeft: 4,
            fontSize: 14,
            fontWeight: '800',
            color: '#6B7280',
            textTransform:
              'uppercase',
            letterSpacing: 0.7,
          }}
        >
          Cuenta
        </Text>

        <View
          style={{
            backgroundColor:
              '#FFFFFF',
            borderRadius: 24,
            overflow: 'hidden',
          }}
        >
          <MenuRow
            icon="create-outline"
            title="Editar perfil"
            subtitle="Nombre, correo, teléfono y foto"
           onPress={() => {
              router.push('/edit-profile');
            }}
          />

          <Divider />

        <MenuRow
          icon="key-outline"
          title="Cambiar contraseña"
          subtitle="Actualiza la seguridad de tu cuenta"
          onPress={() => {
            router.push('/change-password');
          }}
        />
        </View>

        {/*
        |--------------------------------------------------------------------------
        | PREMIUM
        |--------------------------------------------------------------------------
        */}

        {!premium ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              Alert.alert(
                'Yolia Premium',
                'La suscripción Premium se configurará posteriormente.'
              );
            }}
            style={{
              marginTop: 24,
              backgroundColor:
                '#183326',
              borderRadius: 24,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor:
                  '#FEF3C7',
                justifyContent:
                  'center',
                alignItems: 'center',
                marginRight: 14,
              }}
            >
              <Ionicons
                name="diamond"
                size={23}
                color="#A16207"
              />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 17,
                  fontWeight: '900',
                }}
              >
                Yolia Premium
              </Text>

              <Text
                style={{
                  color: '#D1D5DB',
                  fontSize: 13,
                  marginTop: 3,
                }}
              >
                Descubre todas las
                funciones de Yolia
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        ) : null}

        {/*
        |--------------------------------------------------------------------------
        | CERRAR SESIÓN
        |--------------------------------------------------------------------------
        */}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            void onLogout()
          }
          disabled={leaving}
          style={{
            marginTop: 24,
            backgroundColor:
              '#FFFFFF',
            borderRadius: 18,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent:
              'center',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor:
              '#FECACA',
            minHeight: 55,
          }}
        >
          {leaving ? (
            <ActivityIndicator
              color="#B91C1C"
            />
          ) : (
            <>
              <Ionicons
                name="log-out-outline"
                size={21}
                color="#B91C1C"
              />

              <Text
                style={{
                  color: '#B91C1C',
                  fontWeight: '800',
                  fontSize: 16,
                  marginLeft: 8,
                }}
              >
                Cerrar sesión
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/*
        |--------------------------------------------------------------------------
        | APP
        |--------------------------------------------------------------------------
        */}

        <Text
          style={{
            marginTop: 24,
            textAlign: 'center',
            color: '#9CA3AF',
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          Yolia{'\n'}
          Versión 1.0
        </Text>
      </ScrollView>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| INFORMACIÓN
|--------------------------------------------------------------------------
*/

function InfoRow({
  icon,
  title,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 16,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor:
            '#DCFCE7',
          justifyContent:
            'center',
          alignItems: 'center',
          marginRight: 13,
        }}
      >
        <Ionicons
          name={icon}
          size={19}
          color="#166534"
        />
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            color: '#6B7280',
            fontSize: 12,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: '#111827',
            fontSize: 15,
            fontWeight: '700',
            marginTop: 2,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| OPCIÓN DE MENÚ
|--------------------------------------------------------------------------
*/

function MenuRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 16,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor:
            '#DCFCE7',
          justifyContent:
            'center',
          alignItems: 'center',
          marginRight: 13,
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color="#166534"
        />
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            color: '#111827',
            fontSize: 15,
            fontWeight: '800',
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: '#9CA3AF',
            fontSize: 12,
            marginTop: 3,
          }}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#9CA3AF"
      />
    </TouchableOpacity>
  );
}

/*
|--------------------------------------------------------------------------
| DIVISOR
|--------------------------------------------------------------------------
*/

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor:
          '#F3F4F6',
        marginLeft: 71,
      }}
    />
  );
}