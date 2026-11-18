import Screen from '@/components/ui/Screen';
import { API_URL } from '@/services/apiUrl';
import { obtenerPlantas, PlantaApi } from '@/services/plantsApi';
import { useAuth } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/*
|--------------------------------------------------------------------------
| IMAGEN DE LA PLANTA
|--------------------------------------------------------------------------
*/

function obtenerImagenPlanta(imagen?: string | null) {
  // Imagen por defecto
  if (!imagen) {
    return 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600';
  }

  // Si la BD ya contiene una URL completa
  if (
    imagen.startsWith('http://') ||
    imagen.startsWith('https://')
  ) {
    return imagen;
  }

  // Imagen almacenada en el backend
  return `${API_URL}/uploads/${imagen}`;
}

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
*/

export default function Home() {
  const router = useRouter();

  const { user } = useAuth();

  // Si no hay sesión, mostramos Invitado
  const nombre =
    user?.nombre?.split(' ')[0] || 'Invitado';

  const [search, setSearch] = useState('');

  const [plants, setPlants] =
    useState<PlantaApi[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  /*
  |--------------------------------------------------------------------------
  | CARGAR PLANTAS
  |--------------------------------------------------------------------------
  */

  const cargarPlantas = useCallback(
    async () => {
      try {
        setError('');
        setLoading(true);

        const plantas =
          await obtenerPlantas();

        setPlants(plantas);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar las plantas'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | RECARGAR AL ENTRAR AL HOME
  |--------------------------------------------------------------------------
  */

  useFocusEffect(
    useCallback(() => {
      cargarPlantas();
    }, [cargarPlantas])
  );

  /*
  |--------------------------------------------------------------------------
  | BUSCADOR
  |--------------------------------------------------------------------------
  */

  const filtered = useMemo(() => {
    const texto =
      search.trim().toLowerCase();

    if (!texto) {
      return plants;
    }

    return plants.filter((plant) => {
      return (
        plant.nombre_comun
          .toLowerCase()
          .includes(texto) ||

        plant.nombre_cientifico
          .toLowerCase()
          .includes(texto) ||

        (plant.categoria || '')
          .toLowerCase()
          .includes(texto)
      );
    });
  }, [plants, search]);

  /*
  |--------------------------------------------------------------------------
  | PLANTAS POPULARES
  |--------------------------------------------------------------------------
  */

  const populares =
    filtered.slice(0, 8);

  /*
  |--------------------------------------------------------------------------
  | NAVEGACIÓN
  |--------------------------------------------------------------------------
  */

  function abrirCatalogo(
    params?: {
      categoria?: string;
      q?: string;
    }
  ) {
    router.push({
      pathname: '/catalog',
      params: params || {},
    });
  }

  function abrirPlanta(id: number) {
    router.push({
      pathname: '/plant/[id]',
      params: {
        id: String(id),
      },
    });
  }

  /*
  |--------------------------------------------------------------------------
  | INTERFAZ
  |--------------------------------------------------------------------------
  */

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >

        {/* ================================================================
            HERO
        ================================================================= */}

        <LinearGradient
          colors={[
            '#14532D',
            '#166534',
            '#22C55E',
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{
            marginTop: 10,
            borderRadius: 28,
            padding: 22,
            minHeight: 210,
            overflow: 'hidden',

            shadowColor: '#14532D',
            shadowOpacity: 0.25,
            shadowRadius: 14,

            shadowOffset: {
              width: 0,
              height: 8,
            },

            elevation: 8,
          }}
        >

          {/* Decoración */}

          <View
            style={{
              position: 'absolute',
              width: 160,
              height: 160,
              borderRadius: 80,

              backgroundColor:
                'rgba(255,255,255,0.08)',

              right: -45,
              top: -55,
            }}
          />

          <View
            style={{
              position: 'absolute',
              width: 100,
              height: 100,
              borderRadius: 50,

              backgroundColor:
                'rgba(255,255,255,0.06)',

              right: 55,
              bottom: -55,
            }}
          />

          {/* Encabezado */}

          <View
            style={{
              flexDirection: 'row',
              justifyContent:
                'space-between',
              alignItems: 'center',
            }}
          >

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >

              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 13,

                  backgroundColor:
                    'rgba(255,255,255,0.18)',

                  justifyContent:
                    'center',

                  alignItems: 'center',

                  marginRight: 10,
                }}
              >
                <Ionicons
                  name="leaf"
                  size={20}
                  color="#FFFFFF"
                />
              </View>

              <Text
                style={{
                  color: '#DCFCE7',
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                Bienvenido a Yolia
              </Text>

            </View>

            {/* Perfil */}

            <TouchableOpacity
              onPress={() =>
                router.push('/profile')
              }
              activeOpacity={0.8}
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,

                backgroundColor:
                  'rgba(255,255,255,0.20)',

                justifyContent:
                  'center',

                alignItems:
                  'center',
              }}
            >
              <Ionicons
                name="person-outline"
                size={23}
                color="#FFFFFF"
              />
            </TouchableOpacity>

          </View>

          {/* Mensaje */}

          <View
            style={{
              marginTop: 22,
            }}
          >

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 29,
                fontWeight: '900',
              }}
            >
              ¡Hola, {nombre}! 👋
            </Text>

            <Text
              style={{
                marginTop: 8,

                color: '#DCFCE7',

                fontSize: 15,

                lineHeight: 22,

                maxWidth: '88%',
              }}
            >
              Descubre plantas medicinales
              y conoce sus propiedades,
              usos y preparaciones.
            </Text>

          </View>

        </LinearGradient>

        {/* ================================================================
            BUSCADOR
        ================================================================= */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 14,
          }}
        >

          <View
            style={{
              flex: 1,

              backgroundColor:
                '#FFFFFF',

              borderRadius: 20,

              flexDirection: 'row',

              alignItems: 'center',

              paddingHorizontal: 16,

              shadowColor: '#000',
              shadowOpacity: 0.04,
              shadowRadius: 8,

              elevation: 3,
            }}
          >

            <Ionicons
              name="search"
              size={20}
              color="#9CA3AF"
            />

            <TextInput
              placeholder="Buscar planta..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"

              style={{
                flex: 1,

                paddingVertical: 15,

                paddingLeft: 10,

                fontSize: 15,
              }}
            />

          </View>

          <TouchableOpacity
            onPress={() =>
              abrirCatalogo(
                search
                  ? {
                      q: search,
                    }
                  : undefined
              )
            }
            style={{
              width: 52,
              height: 52,

              borderRadius: 26,

              backgroundColor:
                '#166534',

              justifyContent:
                'center',

              alignItems:
                'center',
            }}
          >
            <Ionicons
              name="options-outline"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>

        </View>

        {/* ================================================================
            TÍTULO
        ================================================================= */}

        <View
          style={{
            marginTop: 22,

            flexDirection: 'row',

            justifyContent:
              'space-between',

            alignItems: 'center',

            marginBottom: 16,
          }}
        >

          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
            }}
          >
            {search
              ? 'Resultados'
              : 'Populares'}
          </Text>

          <TouchableOpacity
            onPress={() =>
              abrirCatalogo()
            }
          >
            <Text
              style={{
                color: '#166534',

                fontWeight:
                  'bold',

                fontSize: 14,
              }}
            >
              Ver todas
            </Text>
          </TouchableOpacity>

        </View>

        {/* ================================================================
            CARGANDO
        ================================================================= */}

        {loading ? (

          <View
            style={{
              paddingVertical: 40,
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
              Cargando plantas...
            </Text>

          </View>

        ) : error ? (

          /* ==============================================================
             ERROR
          =============================================================== */

          <View
            style={{
              paddingVertical: 24,
              alignItems: 'center',
            }}
          >

            <Ionicons
              name="cloud-offline-outline"
              size={42}
              color="#B91C1C"
            />

            <Text
              style={{
                marginTop: 10,

                color: '#B91C1C',

                fontWeight: 'bold',

                textAlign: 'center',
              }}
            >
              No se pudieron cargar
              las plantas
            </Text>

            <Text
              style={{
                color: '#6B7280',

                textAlign: 'center',

                marginTop: 8,
              }}
            >
              {error}
            </Text>

            <TouchableOpacity
              onPress={cargarPlantas}
              style={{
                marginTop: 16,

                backgroundColor:
                  '#166534',

                paddingHorizontal:
                  18,

                paddingVertical:
                  10,

                borderRadius: 14,
              }}
            >

              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                }}
              >
                Reintentar
              </Text>

            </TouchableOpacity>

          </View>

        ) : populares.length === 0 ? (

          /* ==============================================================
             SIN RESULTADOS
          =============================================================== */

          <View
            style={{
              paddingVertical: 30,
              alignItems: 'center',
            }}
          >

            <Ionicons
              name="leaf-outline"
              size={40}
              color="#9CA3AF"
            />

            <Text
              style={{
                color: '#6B7280',
                marginTop: 10,
              }}
            >
              No se encontraron plantas.
            </Text>

          </View>

        ) : (

          /* ==============================================================
             PLANTAS
          =============================================================== */

          <ScrollView
            horizontal

            showsHorizontalScrollIndicator={
              false
            }

            contentContainerStyle={{
              paddingRight: 25,

              paddingBottom: 20,

              paddingTop: 10,

              paddingLeft: 4,

              gap: 14,
            }}
          >

            {populares.map(
              (item) => (

                <TouchableOpacity
                  key={
                    item.id_planta
                  }

                  onPress={() =>
                    abrirPlanta(
                      item.id_planta
                    )
                  }

                  activeOpacity={0.85}

                  style={{
                    width: 150,

                    backgroundColor:
                      '#FFFFFF',

                    borderRadius: 22,

                    overflow:
                      'hidden',

                    shadowColor:
                      '#000',

                    shadowOpacity:
                      0.05,

                    shadowRadius:
                      8,

                    elevation: 3,
                  }}
                >

                  {/* IMAGEN REAL DE LA BD */}

                  <Image
                    source={{
                      uri:
                        obtenerImagenPlanta(
                          item.imagen_principal
                        ),
                    }}
                    style={{
                      width: '100%',
                      height: 140,
                      resizeMode: 'cover',
                    }}
                  />

                  {/* INFORMACIÓN */}

                  <View
                    style={{
                      padding: 12,
                    }}
                  >

                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 16,

                        fontWeight:
                          'bold',

                        color:
                          '#111827',
                      }}
                    >
                      {
                        item.nombre_comun
                      }
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        marginTop: 4,

                        color:
                          '#166534',

                        fontWeight:
                          '600',

                        fontSize: 12,
                      }}
                    >
                      {item.categoria ||
                        'Sin categoría'}
                    </Text>

                  </View>

                </TouchableOpacity>

              )
            )}

          </ScrollView>

        )}

      </ScrollView>
    </Screen>
  );
}