import { useAuth } from '@/store/authStore';
import { scanHistory } from '@/store/historyStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HistoryScreen() {
  const router = useRouter();
  const { user, token, ready } = useAuth();

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
          backgroundColor: '#F4F6F8',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#166534"
        />
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | INVITADO
  |--------------------------------------------------------------------------
  */

  if (!user || !token) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F4F6F8',
          paddingTop: 60,
          paddingHorizontal: 24,
        }}
      >
        {/* HEADER */}

        <View>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '900',
              color: '#111827',
            }}
          >
            Historial
          </Text>

          <Text
            style={{
              color: '#6B7280',
              marginTop: 6,
              fontSize: 15,
            }}
          >
            Plantas escaneadas recientemente
          </Text>
        </View>

        {/* MENSAJE PARA INVITADO */}

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 100,
          }}
        >
          <View
            style={{
              width: 130,
              height: 130,
              borderRadius: 65,
              backgroundColor: '#DCFCE7',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: '#BBF7D0',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="time-outline"
                size={52}
                color="#166534"
              />
            </View>
          </View>

          <Text
            style={{
              marginTop: 28,
              fontSize: 23,
              fontWeight: '900',
              color: '#111827',
              textAlign: 'center',
            }}
          >
            Guarda tu historial
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 23,
              maxWidth: 320,
            }}
          >
            Inicia sesión para guardar las plantas que
            escanees y consultar tus identificaciones
            anteriores.
          </Text>

          {/* INICIAR SESIÓN */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/login')}
            style={{
              marginTop: 28,
              width: '100%',
              maxWidth: 320,
              height: 54,
              borderRadius: 18,
              backgroundColor: '#166534',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="log-in-outline"
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
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              marginTop: 18,
              color: '#9CA3AF',
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            Puedes seguir explorando Yolia sin iniciar sesión.
          </Text>
        </View>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | USUARIO CON SESIÓN
  |--------------------------------------------------------------------------
  */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F4F6F8',
        paddingTop: 60,
        paddingHorizontal: 20,
      }}
    >
      {/* HEADER */}

      <Text
        style={{
          fontSize: 32,
          fontWeight: '900',
          color: '#111827',
        }}
      >
        Historial
      </Text>

      <Text
        style={{
          color: '#6B7280',
          marginTop: 6,
          marginBottom: 30,
          fontSize: 15,
        }}
      >
        Plantas escaneadas recientemente
      </Text>

      {/* HISTORIAL */}

      <FlatList
        data={scanHistory}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 120,
        }}

        /*
        |--------------------------------------------------------------------------
        | HISTORIAL VACÍO
        |--------------------------------------------------------------------------
        */

        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 100,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: '#DCFCE7',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="time-outline"
                size={58}
                color="#166534"
              />
            </View>

            <Text
              style={{
                marginTop: 22,
                fontSize: 20,
                fontWeight: '800',
                color: '#111827',
              }}
            >
              Aún no hay escaneos
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 15,
                color: '#6B7280',
                textAlign: 'center',
                lineHeight: 22,
                maxWidth: 300,
              }}
            >
              Las plantas que identifiques con Yolia
              aparecerán aquí.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/scan')}
              style={{
                marginTop: 22,
                backgroundColor: '#166534',
                paddingHorizontal: 22,
                paddingVertical: 13,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="camera-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: '800',
                  marginLeft: 8,
                }}
              >
                Escanear planta
              </Text>
            </TouchableOpacity>
          </View>
        }

        /*
        |--------------------------------------------------------------------------
        | TARJETAS
        |--------------------------------------------------------------------------
        */

        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 28,
              padding: 16,
              marginBottom: 18,
              flexDirection: 'row',

              shadowColor: '#000000',
              shadowOpacity: 0.05,
              shadowRadius: 10,

              shadowOffset: {
                width: 0,
                height: 4,
              },

              elevation: 4,
            }}
          >
            {/* IMAGEN */}

            <Image
              source={{
                uri: item.image,
              }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 20,
                marginRight: 16,
              }}
            />

            {/* INFORMACIÓN */}

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: '#111827',
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  color: '#6B7280',
                  marginTop: 4,
                }}
              >
                Precisión IA: {item.confidence}
              </Text>

              <Text
                numberOfLines={2}
                style={{
                  color: '#4B5563',
                  marginTop: 10,
                  lineHeight: 22,
                }}
              >
                {item.description}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 12,
                }}
              >
                <Ionicons
                  name="time"
                  size={16}
                  color="#166534"
                />

                <Text
                  style={{
                    marginLeft: 6,
                    color: '#166534',
                    fontWeight: '600',
                  }}
                >
                  {item.date}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}