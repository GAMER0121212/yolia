import Screen from '@/components/ui/Screen';
import { API_URL } from '@/services/apiUrl';
import {
  obtenerPlantaPorId,
  PlantaApi,
} from '@/services/plantsApi';
import { useAuth } from '@/store/authStore';
import { useFavorites } from '@/store/favoritesStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/*
|--------------------------------------------------------------------------
| IMAGEN PREDETERMINADA
|--------------------------------------------------------------------------
*/

const IMAGEN_PREDETERMINADA =
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=1000';

/*
|--------------------------------------------------------------------------
| OBTENER IMAGEN
|--------------------------------------------------------------------------
*/

function obtenerImagen(
  imagen?: string | null
) {
  if (!imagen) {
    return IMAGEN_PREDETERMINADA;
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
| FORMATEAR FECHA
|--------------------------------------------------------------------------
*/

function formatearFecha(
  fecha?: string | null
) {
  if (!fecha) {
    return 'No especificada';
  }

  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return fecha;
  }

  return date.toLocaleDateString(
    'es-MX',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  );
}

/*
|--------------------------------------------------------------------------
| VALIDAR TEXTO
|--------------------------------------------------------------------------
*/

function tieneContenido(
  valor?: string | null
) {
  return Boolean(
    valor &&
      valor.trim().length > 0
  );
}

/*
|--------------------------------------------------------------------------
| COMPONENTE PARA INFORMACIÓN
|--------------------------------------------------------------------------
*/

function InfoItem({
  icon,
  titulo,
  contenido,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  titulo: string;
  contenido?: string | null;
}) {
  if (!tieneContenido(contenido)) {
    return null;
  }

  return (
    <View
      style={{
        marginBottom: 18,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 7,
        }}
      >
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: '#DCFCE7',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          <Ionicons
            name={icon}
            size={18}
            color="#166534"
          />
        </View>

        <Text
          style={{
            flex: 1,
            color: '#111827',
            fontSize: 16,
            fontWeight: '800',
          }}
        >
          {titulo}
        </Text>
      </View>

      <Text
        style={{
          color: '#4B5563',
          fontSize: 15,
          lineHeight: 24,
          paddingLeft: 44,
        }}
      >
        {contenido}
      </Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| TARJETA DE SECCIÓN
|--------------------------------------------------------------------------
*/

function Seccion({
  titulo,
  icon,
  children,
  color = '#166534',
  fondo = '#FFFFFF',
}: {
  titulo: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  color?: string;
  fondo?: string;
}) {
  return (
    <View
      style={{
        marginTop: 22,
        backgroundColor: fondo,
        borderRadius: 24,
        padding: 20,

        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: {
          width: 0,
          height: 4,
        },

        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor:
              color === '#B91C1C'
                ? '#FEE2E2'
                : '#DCFCE7',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons
            name={icon}
            size={22}
            color={color}
          />
        </View>

        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: '900',
            color: '#111827',
          }}
        >
          {titulo}
        </Text>
      </View>

      {children}
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| DETALLE DE PLANTA
|--------------------------------------------------------------------------
*/

export default function PlantDetail() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const router = useRouter();

  /*
  |--------------------------------------------------------------------------
  | AUTH
  |--------------------------------------------------------------------------
  */

  const {
    user,
    token,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | FAVORITOS
  |--------------------------------------------------------------------------
  */

  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  /*
  |--------------------------------------------------------------------------
  | ESTADOS
  |--------------------------------------------------------------------------
  */

  const [plant, setPlant] =
    useState<PlantaApi | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const [
    errorImagen,
    setErrorImagen,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CARGAR PLANTA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let activo = true;

    const cargar =
      async () => {
        if (!id) {
          if (activo) {
            setError(
              'ID de planta no válido'
            );

            setLoading(false);
          }

          return;
        }

        try {
          const resultado =
            await obtenerPlantaPorId(
              id
            );

          if (!activo) {
            return;
          }

          setPlant(resultado);
          setError('');
        } catch (err) {
          if (!activo) {
            return;
          }

          setError(
            err instanceof Error
              ? err.message
              : 'No fue posible cargar la planta'
          );
        } finally {
          if (activo) {
            setLoading(false);
          }
        }
      };

    void cargar();

    return () => {
      activo = false;
    };
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | FAVORITO
  |--------------------------------------------------------------------------
  */

  async function cambiarFavorito() {
    if (!plant || guardando) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | INVITADO
    |--------------------------------------------------------------------------
    */

    if (!user || !token) {
      Alert.alert(
        'Inicia sesión',
        'Necesitas iniciar sesión para guardar plantas en tus favoritos.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Iniciar sesión',
            onPress: () =>
              router.push('/login'),
          },
        ]
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | USUARIO AUTENTICADO
    |--------------------------------------------------------------------------
    */

    try {
      setGuardando(true);

      await toggleFavorite(
        plant
      );
    } catch (err) {
      Alert.alert(
        'No se pudo guardar',
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al modificar favoritos'
      );
    } finally {
      setGuardando(false);
    }
  }

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
            Cargando planta...
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

  if (error || !plant) {
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
          <Ionicons
            name="leaf-outline"
            size={70}
            color="#9CA3AF"
          />

          <Text
            style={{
              marginTop: 18,
              textAlign: 'center',
              fontSize: 18,
              fontWeight: '700',
              color: '#B91C1C',
            }}
          >
            {error ||
              'Planta no encontrada'}
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.back()
            }
            style={{
              marginTop: 20,
              backgroundColor:
                '#166534',
              borderRadius: 16,
              paddingHorizontal:
                20,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
              }}
            >
              Regresar
            </Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | FAVORITO ACTUAL
  |--------------------------------------------------------------------------
  */

  const esFavorita =
    user && token
      ? isFavorite(
          plant.id_planta
        )
      : false;

  /*
  |--------------------------------------------------------------------------
  | IMAGEN
  |--------------------------------------------------------------------------
  */

  const imagen =
    errorImagen
      ? IMAGEN_PREDETERMINADA
      : obtenerImagen(
          plant.imagen_principal
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
        backgroundColor: '#F4F6F8',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 130,
        }}
        bounces={false}
      >
        {/*
        |--------------------------------------------------------------------------
        | HERO / IMAGEN
        |--------------------------------------------------------------------------
        */}

        <ImageBackground
          source={{
            uri: imagen,
          }}
          onError={() =>
            setErrorImagen(true)
          }
          style={{
            height: 440,
            width: '100%',
          }}
        >
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.12)',
              'rgba(0,0,0,0.85)',
            ]}
            style={{
              flex: 1,
              justifyContent:
                'flex-end',
              paddingHorizontal: 24,
              paddingBottom: 60,
            }}
          >
            {/*
            |--------------------------------------------------------------------------
            | BOTONES SUPERIORES
            |--------------------------------------------------------------------------
            */}

            <View
              style={{
                position: 'absolute',
                top: 50,
                left: 20,
                right: 20,
                flexDirection: 'row',
                justifyContent:
                  'space-between',
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  router.back()
                }
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor:
                    'rgba(255,255,255,0.25)',
                  justifyContent:
                    'center',
                  alignItems:
                    'center',
                }}
              >
                <Ionicons
                  name="chevron-back"
                  size={26}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  void cambiarFavorito()
                }
                disabled={guardando}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,

                  backgroundColor:
                    esFavorita
                      ? '#FFFFFF'
                      : 'rgba(255,255,255,0.25)',

                  justifyContent:
                    'center',

                  alignItems:
                    'center',

                  opacity:
                    guardando
                      ? 0.6
                      : 1,
                }}
              >
                {guardando ? (
                  <ActivityIndicator
                    size="small"
                    color="#EF4444"
                  />
                ) : (
                  <Ionicons
                    name={
                      esFavorita
                        ? 'heart'
                        : 'heart-outline'
                    }
                    size={25}
                    color={
                      esFavorita
                        ? '#EF4444'
                        : '#FFFFFF'
                    }
                  />
                )}
              </TouchableOpacity>
            </View>

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
                  '#166534',
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 13,
                }}
              >
                🌿{' '}
                {plant.categoria ||
                  'PLANTA MEDICINAL'}
              </Text>
            </View>

            {/*
            |--------------------------------------------------------------------------
            | NOMBRE
            |--------------------------------------------------------------------------
            */}

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 40,
                fontWeight: '900',
                letterSpacing: -1,
                lineHeight: 44,
              }}
            >
              {plant.nombre_comun}
            </Text>

            <Text
              style={{
                marginTop: 6,
                color: '#D1FAE5',
                fontSize: 16,
                fontStyle: 'italic',
              }}
            >
              {
                plant.nombre_cientifico
              }
            </Text>

            {plant.familia_botanica ? (
              <Text
                style={{
                  marginTop: 6,
                  color: '#E5E7EB',
                  fontSize: 14,
                }}
              >
                Familia:{' '}
                {
                  plant.familia_botanica
                }
              </Text>
            ) : null}
          </LinearGradient>
        </ImageBackground>

        {/*
        |--------------------------------------------------------------------------
        | CONTENIDO
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            marginTop: -40,
            backgroundColor:
              '#F4F6F8',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingHorizontal: 20,
            paddingTop: 32,
            minHeight: 600,
          }}
        >
          {/*
          |--------------------------------------------------------------------------
          | DESCRIPCIÓN
          |--------------------------------------------------------------------------
          */}

          <Text
            style={{
              fontSize: 23,
              fontWeight: '900',
              color: '#111827',
            }}
          >
            Acerca de esta planta
          </Text>

          <Text
            style={{
              color: '#4B5563',
              lineHeight: 27,
              fontSize: 16,
              marginTop: 12,
            }}
          >
            {plant.descripcion ||
              'No hay una descripción disponible para esta planta.'}
          </Text>

          {/*
          |--------------------------------------------------------------------------
          | BOTÓN FAVORITOS
          |--------------------------------------------------------------------------
          */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => void cambiarFavorito()}
            disabled={guardando}
            style={{
              marginTop: 22,
              backgroundColor: esFavorita ? '#FFF1F2' : '#166534',
              borderWidth: 1,
              borderColor: esFavorita ? '#FECDD3' : '#166534',
              borderRadius: 18,
              paddingVertical: 16,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: guardando ? 0.65 : 1,
              shadowColor: esFavorita ? '#EF4444' : '#166534',
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              elevation: 3,
            }}
          >
            {guardando ? (
              <>
                <ActivityIndicator
                  size="small"
                  color={esFavorita ? '#E11D48' : '#FFFFFF'}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    color: esFavorita ? '#E11D48' : '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '800',
                  }}
                >
                  Actualizando...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name={esFavorita ? 'heart' : 'heart-outline'}
                  size={22}
                  color={esFavorita ? '#E11D48' : '#FFFFFF'}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    color: esFavorita ? '#E11D48' : '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '800',
                  }}
                >
                  {esFavorita
                    ? 'Quitar de favoritos'
                    : 'Agregar a favoritos'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/*
          |--------------------------------------------------------------------------
          | INFORMACIÓN BOTÁNICA
          |--------------------------------------------------------------------------
          */}

          <Seccion
            titulo="Información botánica"
            icon="leaf-outline"
          >
            <InfoItem
              icon="flower-outline"
              titulo="Familia botánica"
              contenido={
                plant.familia_botanica
              }
            />

            <InfoItem
              icon="location-outline"
              titulo="Hábitat"
              contenido={
                plant.habitat
              }
            />

            <InfoItem
              icon="earth-outline"
              titulo="Distribución geográfica"
              contenido={
                plant.distribucion_geografica
              }
            />

            <InfoItem
              icon="cut-outline"
              titulo="Parte utilizada"
              contenido={
                plant.parte_utilizada
              }
            />
          </Seccion>

          {/*
          |--------------------------------------------------------------------------
          | USOS Y BENEFICIOS
          |--------------------------------------------------------------------------
          */}

          <Seccion
            titulo="Usos y beneficios"
            icon="sparkles-outline"
          >
            <InfoItem
              icon="medical-outline"
              titulo="Indicaciones"
              contenido={
                plant.indicaciones
              }
            />

            <InfoItem
              icon="heart-outline"
              titulo="Beneficios"
              contenido={
                plant.beneficios
              }
            />
          </Seccion>

          {/*
          |--------------------------------------------------------------------------
          | PREPARACIÓN
          |--------------------------------------------------------------------------
          */}

          <Seccion
            titulo="Preparación y uso"
            icon="flask-outline"
          >
            <InfoItem
              icon="leaf-outline"
              titulo="Preparación"
              contenido={
                plant.preparacion
              }
            />

            <InfoItem
              icon="water-outline"
              titulo="Administración"
              contenido={
                plant.administracion
              }
            />

            <InfoItem
              icon="speedometer-outline"
              titulo="Dosis"
              contenido={
                plant.dosis
              }
            />

            <InfoItem
              icon="cube-outline"
              titulo="Presentaciones"
              contenido={
                plant.presentaciones
              }
            />
          </Seccion>

          {/*
          |--------------------------------------------------------------------------
          | SEGURIDAD
          |--------------------------------------------------------------------------
          */}

          <Seccion
            titulo="Seguridad y precauciones"
            icon="warning-outline"
            color="#B91C1C"
            fondo="#FFF7F7"
          >
            <InfoItem
              icon="alert-circle-outline"
              titulo="Contraindicaciones"
              contenido={
                plant.contraindicaciones
              }
            />

            <InfoItem
              icon="medkit-outline"
              titulo="Efectos secundarios"
              contenido={
                plant.efectos_secundarios
              }
            />

            <InfoItem
              icon="git-compare-outline"
              titulo="Interacciones"
              contenido={
                plant.interacciones
              }
            />

            <InfoItem
              icon="people-outline"
              titulo="Embarazo y lactancia"
              contenido={
                plant.embarazo_lactancia
              }
            />
          </Seccion>

          {/*
          |--------------------------------------------------------------------------
          | EVIDENCIA
          |--------------------------------------------------------------------------
          */}

          <Seccion
            titulo="Evidencia"
            icon="school-outline"
          >
            <InfoItem
              icon="analytics-outline"
              titulo="Nivel de evidencia"
              contenido={
                plant.nivel_evidencia
              }
            />
          </Seccion>

          {/*
          |--------------------------------------------------------------------------
          | INFORMACIÓN DEL REGISTRO
          |--------------------------------------------------------------------------
          */}

          <Seccion
            titulo="Información del registro"
            icon="document-text-outline"
          >
            <InfoItem
              icon="pricetag-outline"
              titulo="ID de planta"
              contenido={String(
                plant.id_planta
              )}
            />

            <InfoItem
              icon="grid-outline"
              titulo="ID de categoría"
              contenido={
                plant.id_categoria !=
                null
                  ? String(
                      plant.id_categoria
                    )
                  : null
              }
            />

            <InfoItem
              icon="folder-outline"
              titulo="Categoría"
              contenido={
                plant.categoria
              }
            />

            <InfoItem
              icon="checkmark-circle-outline"
              titulo="Estado de revisión"
              contenido={
                plant.estado_revision
              }
            />

            <InfoItem
              icon="person-outline"
              titulo="Aprobado por"
              contenido={
                plant.nombre_aprobador ||
                (plant.aprobado_por !=
                null
                  ? `Usuario #${plant.aprobado_por}`
                  : null)
              }
            />

            <InfoItem
              icon="business-outline"
              titulo="Centro de investigación"
              contenido={
                plant.centro_investigacion
              }
            />

            <InfoItem
              icon="calendar-outline"
              titulo="Fecha de aprobación"
              contenido={
                plant.fecha_aprobacion
                  ? formatearFecha(
                      plant.fecha_aprobacion
                    )
                  : null
              }
            />

            <InfoItem
              icon="chatbox-ellipses-outline"
              titulo="Observaciones de revisión"
              contenido={
                plant.observaciones_revision
              }
            />

            <InfoItem
              icon="add-circle-outline"
              titulo="Fecha de registro"
              contenido={
                plant.created_at
                  ? formatearFecha(
                      plant.created_at
                    )
                  : null
              }
            />

            <InfoItem
              icon="refresh-outline"
              titulo="Última actualización"
              contenido={
                plant.updated_at
                  ? formatearFecha(
                      plant.updated_at
                    )
                  : null
              }
            />
          </Seccion>

          {/*
          |--------------------------------------------------------------------------
          | AVISO
          |--------------------------------------------------------------------------
          */}

          <View
            style={{
              marginTop: 22,
              backgroundColor:
                '#FEF3C7',
              borderRadius: 22,
              padding: 20,
              flexDirection: 'row',
            }}
          >
            <Ionicons
              name="information-circle"
              size={27}
              color="#92400E"
              style={{
                marginRight: 12,
              }}
            />

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: '#92400E',
                  fontWeight: '800',
                  fontSize: 15,
                }}
              >
                Aviso importante
              </Text>

              <Text
                style={{
                  color: '#92400E',
                  lineHeight: 21,
                  fontSize: 13,
                  marginTop: 5,
                }}
              >
                La información de
                Yolia es informativa
                y no sustituye la
                valoración de un
                profesional de la
                salud.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/*
      |--------------------------------------------------------------------------
      | PREGUNTAR A YOLIA
      |--------------------------------------------------------------------------
      */}

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          backgroundColor:
            'rgba(255,255,255,0.95)',
          borderTopWidth: 1,
          borderColor:
            'rgba(0,0,0,0.05)',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: '/chat',
              params: {
                plant:
                  plant.nombre_comun,
              },
            })
          }
          style={{
            backgroundColor:
              '#166534',
            borderRadius: 100,
            paddingVertical: 16,
            justifyContent:
              'center',
            alignItems: 'center',
            flexDirection: 'row',

            shadowColor:
              '#166534',
            shadowOpacity: 0.3,
            shadowRadius: 15,

            shadowOffset: {
              width: 0,
              height: 6,
            },

            elevation: 8,
          }}
        >
          <Ionicons
            name="sparkles"
            size={20}
            color="#FFFFFF"
          />

          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: 16,
              marginLeft: 10,
              letterSpacing: 0.5,
            }}
          >
            Preguntar a Yolia
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}