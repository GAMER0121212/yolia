import { API_URL } from '@/services/apiUrl';
import Screen from '@/components/ui/Screen';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion?: string | null;
}

/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN VISUAL
|--------------------------------------------------------------------------
|
| Las categorías vienen de la BD.
| Aquí solamente decidimos qué icono/color tendrá cada una.
|
*/

function obtenerEstiloCategoria(nombre: string) {
  const categoria = nombre.toLowerCase();

  if (categoria.includes('digest')) {
    return {
      icono: 'restaurant-outline' as const,
      color: '#DCFCE7',
    };
  }

  if (categoria.includes('calm')) {
    return {
      icono: 'flower-outline' as const,
      color: '#FCE7F3',
    };
  }

  if (categoria.includes('cicatriz')) {
    return {
      icono: 'medkit-outline' as const,
      color: '#DBEAFE',
    };
  }

  if (categoria.includes('respirat')) {
    return {
      icono: 'fitness-outline' as const,
      color: '#E0F2FE',
    };
  }

  if (categoria.includes('inflam')) {
    return {
      icono: 'leaf-outline' as const,
      color: '#FEF3C7',
    };
  }

  // Para cualquier categoría nueva agregada desde el admin
  return {
    icono: 'leaf-outline' as const,
    color: '#ECFDF5',
  };
}

export default function CategoriesScreen() {
  const router = useRouter();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | CARGAR CATEGORÍAS DESDE LA API
  |--------------------------------------------------------------------------
  */

  const cargarCategorias = useCallback(async () => {
    try {
      setError('');

      const respuesta = await fetch(
        `${API_URL}/api/categorias`
      );

      if (!respuesta.ok) {
        throw new Error(
          `Error HTTP ${respuesta.status}`
        );
      }

      const datos = await respuesta.json();

      /*
      |--------------------------------------------------------------------------
      | TU API PUEDE DEVOLVER:
      |
      | [...]
      |
      | o
      |
      | {
      |   categorias: [...]
      | }
      |--------------------------------------------------------------------------
      */

      let lista: Categoria[] = [];

      if (Array.isArray(datos)) {
        lista = datos;
      } else if (Array.isArray(datos?.categorias)) {
        lista = datos.categorias;
      }

      setCategorias(lista);
    } catch (err) {
      console.error(
        'Error cargando categorías:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las categorías'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | ACTUALIZAR AL ENTRAR A LA PANTALLA
  |--------------------------------------------------------------------------
  */

  useFocusEffect(
    useCallback(() => {
      cargarCategorias();
    }, [cargarCategorias])
  );

  /*
  |--------------------------------------------------------------------------
  | PULL TO REFRESH
  |--------------------------------------------------------------------------
  */

  async function actualizar() {
    try {
      setRefreshing(true);
      await cargarCategorias();
    } finally {
      setRefreshing(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ABRIR CATÁLOGO FILTRADO
  |--------------------------------------------------------------------------
  */

  function abrirCategoria(categoria: Categoria) {
    router.push({
      pathname: '/catalog',
      params: {
        categoria: categoria.nombre,
      },
    });
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={actualizar}
            colors={['#166534']}
            tintColor="#166534"
          />
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#FFFFFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 14,
              elevation: 2,

              shadowColor: '#000000',
              shadowOpacity: 0.05,
              shadowRadius: 5,
              shadowOffset: {
                width: 0,
                height: 2,
              },
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
                fontWeight: 'bold',
                color: '#111827',
              }}
            >
              Categorías
            </Text>

            <Text
              style={{
                marginTop: 3,
                color: '#6B7280',
              }}
            >
              Explora las plantas por categoría
            </Text>
          </View>
        </View>

        {/* CARGANDO */}

        {cargando ? (
          <View
            style={{
              paddingTop: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator
              size="large"
              color="#166534"
            />

            <Text
              style={{
                marginTop: 14,
                color: '#6B7280',
              }}
            >
              Cargando categorías...
            </Text>
          </View>
        ) : error ? (
          /*
          |--------------------------------------------------------------------------
          | ERROR
          |--------------------------------------------------------------------------
          */

          <View
            style={{
              paddingTop: 90,
              paddingHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#FEE2E2',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="cloud-offline-outline"
                size={48}
                color="#B91C1C"
              />
            </View>

            <Text
              style={{
                marginTop: 20,
                fontSize: 19,
                fontWeight: '800',
                color: '#111827',
                textAlign: 'center',
              }}
            >
              No se pudieron cargar las categorías
            </Text>

            <Text
              style={{
                marginTop: 8,
                color: '#6B7280',
                textAlign: 'center',
              }}
            >
              {error}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={cargarCategorias}
              style={{
                marginTop: 22,
                backgroundColor: '#166534',
                paddingHorizontal: 22,
                paddingVertical: 13,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: '800',
                }}
              >
                Reintentar
              </Text>
            </TouchableOpacity>
          </View>
        ) : categorias.length === 0 ? (
          /*
          |--------------------------------------------------------------------------
          | SIN CATEGORÍAS
          |--------------------------------------------------------------------------
          */

          <View
            style={{
              paddingTop: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="grid-outline"
              size={60}
              color="#D1D5DB"
            />

            <Text
              style={{
                marginTop: 16,
                fontSize: 19,
                fontWeight: '800',
                color: '#111827',
              }}
            >
              No hay categorías
            </Text>

            <Text
              style={{
                marginTop: 6,
                color: '#6B7280',
                textAlign: 'center',
              }}
            >
              Aún no existen categorías registradas.
            </Text>
          </View>
        ) : (
          /*
          |--------------------------------------------------------------------------
          | CATEGORÍAS DE LA BD
          |--------------------------------------------------------------------------
          */

          <View
            style={{
              marginTop: 20,
              gap: 16,
            }}
          >
            {categorias.map((categoria) => {
              const estilo =
                obtenerEstiloCategoria(
                  categoria.nombre
                );

              return (
                <TouchableOpacity
                  key={categoria.id_categoria}
                  onPress={() =>
                    abrirCategoria(categoria)
                  }
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: 18,

                    flexDirection: 'row',
                    alignItems: 'center',

                    elevation: 3,

                    shadowColor: '#000000',
                    shadowOpacity: 0.06,
                    shadowRadius: 10,

                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                  }}
                >
                  {/* ICONO */}

                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 20,

                      backgroundColor:
                        estilo.color,

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons
                      name={estilo.icono}
                      size={28}
                      color="#166534"
                    />
                  </View>

                  {/* INFORMACIÓN */}

                  <View
                    style={{
                      flex: 1,
                      marginLeft: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#111827',
                      }}
                    >
                      {categoria.nombre}
                    </Text>

                    <Text
                      style={{
                        marginTop: 5,
                        color: '#6B7280',
                        lineHeight: 20,
                      }}
                    >
                      {categoria.descripcion ||
                        `Explora las plantas de la categoría ${categoria.nombre}.`}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}