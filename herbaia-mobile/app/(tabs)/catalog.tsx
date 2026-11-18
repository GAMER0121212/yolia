import Screen from '@/components/ui/Screen';
import { API_URL } from '@/services/apiUrl';
import {
  obtenerPlantas,
  PlantaApi,
} from '@/services/plantsApi';

import { Ionicons } from '@expo/vector-icons';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/*
|--------------------------------------------------------------------------
| OBTENER URL DE IMAGEN
|--------------------------------------------------------------------------
*/

function obtenerImagenPlanta(
  imagen?: string | null
) {
  if (!imagen) {
    return null;
  }

  if (
    imagen.startsWith('http://') ||
    imagen.startsWith('https://')
  ) {
    return imagen;
  }

  return `${API_URL}/uploads/${imagen}`;
}

/*
|--------------------------------------------------------------------------
| COMPONENTE IMAGEN
|--------------------------------------------------------------------------
|
| Si imagen_principal está vacío o el archivo ya no existe en el servidor,
| mostramos un placeholder.
|
*/

function PlantImage({
  imagen,
}: {
  imagen?: string | null;
}) {
  const [errorImagen, setErrorImagen] =
    useState(false);

  const uri =
    obtenerImagenPlanta(imagen);

  /*
  |--------------------------------------------------------------------------
  | PLACEHOLDER
  |--------------------------------------------------------------------------
  */

  if (!uri || errorImagen) {
    return (
      <View
        style={{
          height: 160,
          width: '100%',
          backgroundColor: '#E8F5E9',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name="leaf"
          size={55}
          color="#166534"
        />

        <Text
          style={{
            marginTop: 8,
            color: '#166534',
            fontSize: 12,
            fontWeight: '600',
          }}
        >
          Imagen no disponible
        </Text>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | IMAGEN REAL
  |--------------------------------------------------------------------------
  */

  return (
    <Image
      source={{
        uri,
      }}
      onError={() =>
        setErrorImagen(true)
      }
      style={{
        height: 160,
        width: '100%',
      }}
      resizeMode="cover"
    />
  );
}

/*
|--------------------------------------------------------------------------
| CATÁLOGO
|--------------------------------------------------------------------------
*/

export default function Catalog() {
  const router = useRouter();

  /*
  |--------------------------------------------------------------------------
  | PARÁMETROS
  |--------------------------------------------------------------------------
  |
  | Cuando entramos desde Categorías podemos recibir:
  |
  | /catalog?categoria=Digestiva
  |
  */

  const params =
    useLocalSearchParams<{
      categoria?: string;
    }>();

  const categoriaSeleccionada =
    typeof params.categoria ===
    'string'
      ? params.categoria
      : '';

  /*
  |--------------------------------------------------------------------------
  | ESTADOS
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] =
    useState('');

  const [plants, setPlants] =
    useState<PlantaApi[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState('');

  /*
  |--------------------------------------------------------------------------
  | REFRESCAR PLANTAS
  |--------------------------------------------------------------------------
  |
  | Esta función se utiliza cuando:
  |
  | - El usuario desliza hacia abajo.
  | - El usuario toca "Intentar nuevamente".
  |
  */

  const cargarPlantas = async (
    actualizando = false
  ) => {
    try {
      setError('');

      if (actualizando) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const datos =
        await obtenerPlantas();

      setPlants(datos);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las plantas';

      setError(mensaje);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PRIMERA CARGA
  |--------------------------------------------------------------------------
  |
  | No llamamos directamente cargarPlantas() desde el efecto para evitar
  | la advertencia:
  |
  | "Calling setState synchronously within an effect..."
  |
  */

  useEffect(() => {
    let activo = true;

    const cargarInicial =
      async () => {
        try {
          const datos =
            await obtenerPlantas();

          if (!activo) {
            return;
          }

          setPlants(datos);
          setError('');
        } catch (error) {
          if (!activo) {
            return;
          }

          const mensaje =
            error instanceof Error
              ? error.message
              : 'No se pudieron cargar las plantas';

          setError(mensaje);
        } finally {
          if (activo) {
            setLoading(false);
          }
        }
      };

    void cargarInicial();

    return () => {
      activo = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTRAR PLANTAS
  |--------------------------------------------------------------------------
  |
  | Primero filtramos por la categoría seleccionada.
  |
  | Después aplicamos la búsqueda por:
  |
  | - Nombre común
  | - Nombre científico
  | - Categoría
  |
  */

  const filtered = useMemo(() => {
    let resultado = [...plants];

    /*
    |--------------------------------------------------------------------------
    | CATEGORÍA
    |--------------------------------------------------------------------------
    */

    if (categoriaSeleccionada) {
      const categoriaBuscada =
        categoriaSeleccionada
          .trim()
          .toLowerCase();

      resultado =
        resultado.filter(
          (plant) =>
            plant.categoria
              ?.trim()
              .toLowerCase() ===
            categoriaBuscada
        );
    }

    /*
    |--------------------------------------------------------------------------
    | BÚSQUEDA
    |--------------------------------------------------------------------------
    */

    const texto =
      search
        .trim()
        .toLowerCase();

    if (texto) {
      resultado =
        resultado.filter(
          (plant) => {
            const nombreComun =
              plant.nombre_comun
                ?.toLowerCase() ||
              '';

            const nombreCientifico =
              plant.nombre_cientifico
                ?.toLowerCase() ||
              '';

            const categoria =
              plant.categoria
                ?.toLowerCase() ||
              '';

            return (
              nombreComun.includes(
                texto
              ) ||
              nombreCientifico.includes(
                texto
              ) ||
              categoria.includes(
                texto
              )
            );
          }
        );
    }

    return resultado;
  }, [
    plants,
    search,
    categoriaSeleccionada,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CARGANDO
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <Screen>
        <View
          style={{
            flex: 1,
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
            Cargando plantas...
          </Text>
        </View>
      </Screen>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <Screen>
        <View
          style={{
            flex: 1,
            justifyContent:
              'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor:
                '#FEE2E2',
              justifyContent:
                'center',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="cloud-offline-outline"
              size={50}
              color="#B91C1C"
            />
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#B91C1C',
              textAlign: 'center',
              marginTop: 18,
            }}
          >
            No se pudo cargar el
            catálogo
          </Text>

          <Text
            style={{
              color: '#6B7280',
              textAlign: 'center',
              marginTop: 10,
              lineHeight: 21,
            }}
          >
            {error}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              void cargarPlantas()
            }
            style={{
              backgroundColor:
                '#166534',
              paddingHorizontal: 22,
              paddingVertical: 13,
              borderRadius: 14,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
              }}
            >
              Intentar nuevamente
            </Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | CATÁLOGO
  |--------------------------------------------------------------------------
  */

  return (
    <Screen>
      <FlatList
        style={{
          flex: 1,
        }}
        data={filtered}
        keyExtractor={(item) =>
          item.id_planta.toString()
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}

        /*
        |--------------------------------------------------------------------------
        | REFRESH
        |--------------------------------------------------------------------------
        */

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              void cargarPlantas(
                true
              )
            }
            colors={[
              '#166534',
            ]}
            tintColor="#166534"
          />
        }

        /*
        |--------------------------------------------------------------------------
        | HEADER
        |--------------------------------------------------------------------------
        */

        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection:
                  'row',
                alignItems:
                  'center',
                marginTop: 20,
              }}
            >
              {categoriaSeleccionada ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    router.back()
                  }
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor:
                      '#FFFFFF',
                    justifyContent:
                      'center',
                    alignItems:
                      'center',
                    marginRight: 12,

                    elevation: 2,

                    shadowColor:
                      '#000000',
                    shadowOpacity:
                      0.05,
                    shadowRadius: 5,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                  }}
                >
                  <Ionicons
                    name="arrow-back"
                    size={21}
                    color="#166534"
                  />
                </TouchableOpacity>
              ) : null}

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight:
                      '900',
                    color:
                      '#111827',
                  }}
                >
                  🌿 Catálogo
                </Text>

                {categoriaSeleccionada ? (
                  <Text
                    style={{
                      marginTop: 3,
                      color:
                        '#166534',
                      fontWeight:
                        '600',
                    }}
                  >
                    {
                      categoriaSeleccionada
                    }
                  </Text>
                ) : (
                  <Text
                    style={{
                      marginTop: 3,
                      color:
                        '#6B7280',
                    }}
                  >
                    Explora nuestras
                    plantas medicinales
                  </Text>
                )}
              </View>
            </View>

            {/*
            |--------------------------------------------------------------------------
            | BUSCADOR
            |--------------------------------------------------------------------------
            */}

            <View
              style={{
                flexDirection:
                  'row',
                alignItems:
                  'center',

                backgroundColor:
                  '#FFFFFF',

                borderRadius: 18,

                paddingHorizontal:
                  16,

                marginTop: 18,
                marginBottom: 20,

                elevation: 3,

                shadowColor:
                  '#000000',
                shadowOpacity:
                  0.05,
                shadowRadius: 8,

                shadowOffset: {
                  width: 0,
                  height: 3,
                },
              }}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color="#9CA3AF"
              />

              <TextInput
                placeholder={
                  categoriaSeleccionada
                    ? `Buscar en ${categoriaSeleccionada}...`
                    : 'Buscar planta...'
                }
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={
                  setSearch
                }
                autoCapitalize="none"
                style={{
                  flex: 1,
                  paddingVertical:
                    14,
                  marginLeft: 10,
                  fontSize: 15,
                  color:
                    '#111827',
                }}
              />

              {search.length > 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    setSearch('')
                  }
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </>
        }

        /*
        |--------------------------------------------------------------------------
        | SIN RESULTADOS
        |--------------------------------------------------------------------------
        */

        ListEmptyComponent={
          <View
            style={{
              alignItems:
                'center',
              marginTop: 60,
              paddingHorizontal:
                20,
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

                alignItems:
                  'center',
              }}
            >
              <Ionicons
                name="leaf-outline"
                size={48}
                color="#166534"
              />
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight:
                  '800',
                color: '#111827',
                marginTop: 18,
              }}
            >
              No se encontraron
              plantas
            </Text>

            <Text
              style={{
                color: '#6B7280',
                marginTop: 8,
                textAlign:
                  'center',
                lineHeight: 20,
              }}
            >
              {categoriaSeleccionada
                ? `No hay plantas disponibles en ${categoriaSeleccionada}.`
                : 'Intenta buscar con otro nombre.'}
            </Text>
          </View>
        }

        /*
        |--------------------------------------------------------------------------
        | TARJETA DE PLANTA
        |--------------------------------------------------------------------------
        */

        renderItem={({
          item,
        }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname:
                  '/plant/[id]',
                params: {
                  id: item.id_planta.toString(),
                },
              })
            }
            style={{
              backgroundColor:
                '#FFFFFF',

              borderRadius: 24,

              marginBottom: 18,

              overflow:
                'hidden',

              shadowColor:
                '#000000',
              shadowOpacity:
                0.07,
              shadowRadius: 10,

              shadowOffset: {
                width: 0,
                height: 4,
              },

              elevation: 4,
            }}
          >
            {/*
            |--------------------------------------------------------------------------
            | IMAGEN
            |--------------------------------------------------------------------------
            */}

            <PlantImage
              imagen={
                item.imagen_principal
              }
            />

            {/*
            |--------------------------------------------------------------------------
            | INFORMACIÓN
            |--------------------------------------------------------------------------
            */}

            <View
              style={{
                padding: 16,
              }}
            >
              <Text
                style={{
                  fontWeight:
                    '800',
                  fontSize: 19,
                  color:
                    '#111827',
                }}
              >
                {
                  item.nombre_comun
                }
              </Text>

              <Text
                style={{
                  color:
                    '#6B7280',
                  fontStyle:
                    'italic',
                  marginTop: 4,
                  fontSize: 15,
                }}
              >
                {
                  item.nombre_cientifico
                }
              </Text>

              {/*
              |--------------------------------------------------------------------------
              | CATEGORÍA
              |--------------------------------------------------------------------------
              */}

              <View
                style={{
                  alignSelf:
                    'flex-start',

                  backgroundColor:
                    '#DCFCE7',

                  borderRadius: 12,

                  paddingHorizontal:
                    10,

                  paddingVertical:
                    5,

                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    color:
                      '#166534',
                    fontWeight:
                      '700',
                    fontSize: 13,
                  }}
                >
                  {item.categoria ||
                    'Sin categoría'}
                </Text>
              </View>

              {/*
              |--------------------------------------------------------------------------
              | DESCRIPCIÓN
              |--------------------------------------------------------------------------
              |
              | El listado actual del backend no devuelve descripción.
              | Pero lo dejamos preparado por si posteriormente la agregamos.
              |
              */}

              {item.descripcion ? (
                <Text
                  numberOfLines={2}
                  style={{
                    color:
                      '#6B7280',
                    marginTop: 10,
                    lineHeight: 20,
                  }}
                >
                  {
                    item.descripcion
                  }
                </Text>
              ) : null}

              {/*
              |--------------------------------------------------------------------------
              | VER INFORMACIÓN
              |--------------------------------------------------------------------------
              */}

              <View
                style={{
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  marginTop: 14,
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
                  Ver información
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color="#166534"
                  style={{
                    marginLeft: 5,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}