export async function identifyPlant(imageUri: string) {
  const formData = new FormData();

  formData.append('images', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000); // ⏱ 6 segundos máx

  try {
    const res = await fetch('https://api.plant.id/v2/identify', {
      method: 'POST',
      headers: {
        'Api-Key': 'TU_API_KEY_AQUI', // 🔑 reemplaza si tienes API real
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // 👇 si la API responde con error HTTP
    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    const suggestion = data?.suggestions?.[0];

    if (!suggestion) return null;

    return {
      name: suggestion.plant_name,
      probability: suggestion.probability,
    };
  } catch {
    // ❌ ya no mostramos logs feos
    return null;
  }
}