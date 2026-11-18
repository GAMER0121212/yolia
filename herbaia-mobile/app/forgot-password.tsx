import { solicitarRecuperacionPassword } from '@/services/authApi';
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

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    enviado,
    setEnviado,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | ENVIAR RECUPERACIÓN
  |--------------------------------------------------------------------------
  */

  async function enviarRecuperacion() {
    if (sending) {
      return;
    }

    const correo =
      email
        .trim()
        .toLowerCase();

    if (!correo) {
      Alert.alert(
        'Correo requerido',
        'Ingresa el correo electrónico de tu cuenta.'
      );

      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailValido.test(correo)
    ) {
      Alert.alert(
        'Correo no válido',
        'Ingresa un correo electrónico válido.'
      );

      return;
    }

    try {
      setSending(true);

      await solicitarRecuperacionPassword(
        correo
      );

      setEnviado(true);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No fue posible enviar el correo de recuperación.';

      Alert.alert(
        'No se pudo enviar',
        mensaje
      );
    } finally {
      setSending(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CORREO ENVIADO
  |--------------------------------------------------------------------------
  */

  if (enviado) {
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
            name="mail-open-outline"
            size={46}
            color="#166534"
          />
        </View>

        <Text
          style={{
            marginTop: 24,
            fontSize: 27,
            fontWeight: '900',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          Revisa tu correo
        </Text>

        <Text
          style={{
            marginTop: 12,
            color: '#6B7280',
            fontSize: 15,
            lineHeight: 23,
            textAlign: 'center',
          }}
        >
          Enviamos las instrucciones
          para recuperar tu contraseña a:
        </Text>

        <Text
          style={{
            marginTop: 10,
            color: '#166534',
            fontWeight: '800',
            fontSize: 15,
            textAlign: 'center',
          }}
        >
          {email
            .trim()
            .toLowerCase()}
        </Text>

        <View
          style={{
            marginTop: 24,
            backgroundColor:
              '#FEFCE8',
            borderRadius: 18,
            padding: 16,
            flexDirection: 'row',
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#A16207"
          />

          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              color: '#854D0E',
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            Si no encuentras el
            correo, revisa también
            tu carpeta de spam o
            correo no deseado.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.replace('/login')
          }
          style={{
            marginTop: 28,
            width: '100%',
            backgroundColor:
              '#166534',
            borderRadius: 18,
            minHeight: 56,
            justifyContent:
              'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: 16,
            }}
          >
            Volver al inicio de sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setEnviado(false);
          }}
          style={{
            marginTop: 16,
            padding: 10,
          }}
        >
          <Text
            style={{
              color: '#166534',
              fontWeight: '700',
            }}
          >
            Enviar nuevamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | FORMULARIO
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
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 65,
          paddingBottom: 40,
        }}
      >
        {/*
        |--------------------------------------------------------------------------
        | REGRESAR
        |--------------------------------------------------------------------------
        */}

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
          }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#166534"
          />
        </TouchableOpacity>

        {/*
        |--------------------------------------------------------------------------
        | CONTENIDO
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            marginTop: 45,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 46,
              backgroundColor:
                '#DCFCE7',
              justifyContent:
                'center',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="key-outline"
              size={42}
              color="#166534"
            />
          </View>

          <Text
            style={{
              marginTop: 24,
              fontSize: 28,
              fontWeight: '900',
              color: '#111827',
              textAlign: 'center',
            }}
          >
            Recuperar contraseña
          </Text>

          <Text
            style={{
              marginTop: 10,
              color: '#6B7280',
              fontSize: 14,
              lineHeight: 21,
              textAlign: 'center',
              paddingHorizontal: 12,
            }}
          >
            Ingresa el correo
            electrónico asociado a
            tu cuenta de Yolia.
          </Text>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | CORREO
        |--------------------------------------------------------------------------
        */}

        <View
          style={{
            marginTop: 35,
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
            Correo electrónico
          </Text>

          <View
            style={{
              height: 56,
              backgroundColor:
                '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              borderColor:
                '#E5E7EB',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
            }}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color="#166534"
            />

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
              editable={!sending}
              returnKeyType="send"
              onSubmitEditing={() =>
                void enviarRecuperacion()
              }
              style={{
                flex: 1,
                marginLeft: 11,
                color: '#111827',
                fontSize: 15,
              }}
            />
          </View>
        </View>

        {/*
        |--------------------------------------------------------------------------
        | BOTÓN
        |--------------------------------------------------------------------------
        */}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={sending}
          onPress={() =>
            void enviarRecuperacion()
          }
          style={{
            marginTop: 24,
            minHeight: 56,
            backgroundColor:
              sending
                ? '#86A995'
                : '#166534',
            borderRadius: 18,
            justifyContent:
              'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          {sending ? (
            <>
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text
                style={{
                  marginLeft: 10,
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '800',
                }}
              >
                Enviando...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="mail-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text
                style={{
                  marginLeft: 8,
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '800',
                }}
              >
                Enviar instrucciones
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.replace('/login')
          }
          style={{
            alignSelf: 'center',
            marginTop: 20,
            padding: 10,
          }}
        >
          <Text
            style={{
              color: '#166534',
              fontWeight: '700',
            }}
          >
            Recordé mi contraseña
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}