import { scanHistory } from '@/store/historyStore';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  // 1. SIN PERMISO (PANTALLA LIMPIA Y MODERNA)
  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 24, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 100, height: 100, backgroundColor: '#DCFCE7', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
          <Ionicons name="camera" size={48} color="#166534" />
        </View>
        <Text style={{ color: '#111827', fontSize: 26, fontWeight: '900', marginBottom: 12, textAlign: 'center' }}>
          Permiso de cámara
        </Text>
        <Text style={{ color: '#6B7280', textAlign: 'center', lineHeight: 24, fontSize: 16, paddingHorizontal: 20 }}>
          HerbalIA necesita acceso a tu lente para poder analizar e identificar las plantas medicinales.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{ marginTop: 40, backgroundColor: '#166534', paddingHorizontal: 32, paddingVertical: 18, borderRadius: 100, shadowColor: '#166534', shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 6 }, elevation: 8 }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Permitir acceso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. LÓGICA DE FOTO E IA (CON GUARDADO EN HISTORIAL)
  async function takePhoto() {
    if (!cameraRef.current) return;
    
    const resultPhoto = await cameraRef.current.takePictureAsync();
    setPhoto(resultPhoto.uri);
    
    // Le pasamos la URI de la imagen para que la guarde en el historial
    analyzePlant(resultPhoto.uri);
  }

  async function analyzePlant(imageUri: string) {
    setLoading(true);
    setResult(null);

    // Simulación perfecta para tu presentación
    setTimeout(() => {
      const plantData = {
        plantId: '1', // 👈 ¡CLAVE! ID simulado para que sepa qué planta abrir
        name: 'Manzanilla',
        confidence: '98%',
        description: 'Excelente infusión para aliviar la ansiedad, reducir el estrés y calmar dolores estomacales de forma natural.',
      };

      // MOSTRAR RESULTADO EN PANTALLA
      setResult(plantData);

      // GUARDAR EN HISTORIAL
      scanHistory.unshift({
        id: Date.now().toString(),
        ...plantData,
        image: imageUri,
        date: new Date().toLocaleDateString(),
      });

      setLoading(false);
    }, 2500);
  }

  // 3. PANTALLA DE ESCÁNER (ESTILO FULL-SCREEN PREMIUM)
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      
      {/* VISTA DE CÁMARA O FOTO A PANTALLA COMPLETA */}
      {!photo ? (
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />
      ) : (
        <Image source={{ uri: photo }} style={StyleSheet.absoluteFillObject} />
      )}

      {/* DEGRADADO SUPERIOR PARA QUE EL BOTÓN SE VEA SIEMPRE */}
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 140 }} />

      {/* BOTÓN DE ATRÁS FLOTANTE */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' }}
      >
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* MARCO DE ESCANEO ESTILO LÁSER */}
      {!photo && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 260, height: 260, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: 40, height: 40, borderColor: '#fff', borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 24 }} />
              <View style={{ width: 40, height: 40, borderColor: '#fff', borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 24 }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: 40, height: 40, borderColor: '#fff', borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 24 }} />
              <View style={{ width: 40, height: 40, borderColor: '#fff', borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 24 }} />
            </View>
          </View>
          <Text style={{ color: '#fff', marginTop: 24, fontSize: 16, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
            Apunta a la planta medicinal
          </Text>
        </View>
      )}

      {/* ZONA INFERIOR: CONTROLES Y RESULTADOS */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: 50 }}>
        
        {/* BOTÓN CAPTURAR */}
        {!photo && (
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={takePhoto}
              style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}
            >
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF' }} />
            </TouchableOpacity>
          </View>
        )}

        {/* TARJETA DE CARGA */}
        {loading && (
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 }}>
            <ActivityIndicator size="large" color="#166534" />
            <Text style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Analizando especie...</Text>
            <Text style={{ color: '#6B7280', marginTop: 4 }}>HerbalIA está procesando la imagen</Text>
          </View>
        )}

        {/* TARJETA DE RESULTADOS */}
        {result && !loading && (
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 32, padding: 28, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 24, elevation: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                <Text style={{ color: '#166534', fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5 }}>COINCIDENCIA EXACTA</Text>
              </View>
              <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 14 }}>{result.confidence}</Text>
            </View>

            <Text style={{ color: '#111827', fontSize: 36, fontWeight: '900', letterSpacing: -1 }}>
              {result.name}
            </Text>
            <Text style={{ color: '#4B5563', lineHeight: 24, fontSize: 16, marginTop: 12, marginBottom: 24 }}>
              {result.description}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => { setPhoto(null); setResult(null); }}
                style={{ flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 16, borderRadius: 16, alignItems: 'center' }}
              >
                <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>Reintentar</Text>
              </TouchableOpacity>
              
              {/* 👈 AQUÍ ESTÁ TU MEJORA: AHORA VA DIRECTO A LOS DETALLES */}
              <TouchableOpacity
                onPress={() =>
  router.push({
    pathname: '/plant/[id]',
    params: { id: result.plantId },
  })
}
                style={{ flex: 1, backgroundColor: '#111827', paddingVertical: 16, borderRadius: 16, alignItems: 'center' }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>Ver más detalles</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      
    </View>
  );
}