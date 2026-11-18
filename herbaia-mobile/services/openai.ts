export async function askHerbalAI(message: string) {
  const text = message.toLowerCase();

  // SALUDOS
  if (
    text.includes('hola') ||
    text.includes('buenas') ||
    text.includes('hey')
  ) {
    return '👋 Hola, soy HerbalIA 🌿 Tu asistente inteligente sobre plantas medicinales. ¿Qué te gustaría saber?';
  }

  // MANZANILLA
  if (text.includes('manzanilla')) {
    return '🌼 La manzanilla es una planta medicinal muy conocida por ayudar a aliviar dolores estomacales, ansiedad y estrés. También puede tomarse en té para relajarse.';
  }

  // SÁBILA
  if (
    text.includes('sábila') ||
    text.includes('aloe vera')
  ) {
    return '🌿 La sábila o aloe vera ayuda a cicatrizar quemaduras, hidratar la piel y reducir irritaciones. También es muy usada en productos naturales.';
  }

  // HIERBABUENA
  if (
    text.includes('hierbabuena') ||
    text.includes('digestión')
  ) {
    return '🍃 La hierbabuena ayuda con la digestión, dolores estomacales y refresca el organismo. Muchas personas la usan en infusiones.';
  }

  // LAVANDA
  if (
    text.includes('lavanda') ||
    text.includes('relajarse') ||
    text.includes('dormir')
  ) {
    return '💜 La lavanda ayuda a relajarse, reducir estrés y mejorar el sueño gracias a su aroma natural.';
  }

  // ROMERO
  if (
    text.includes('romero') ||
    text.includes('memoria')
  ) {
    return '🌱 El romero puede ayudar a mejorar la memoria, la concentración y la circulación sanguínea.';
  }

  // QUEMADURAS
  if (text.includes('quemadura')) {
    return '🔥 Algunas plantas útiles para quemaduras son la sábila y la caléndula por sus propiedades cicatrizantes.';
  }

  // ANSIEDAD
  if (
    text.includes('ansiedad') ||
    text.includes('estrés')
  ) {
    return '😌 Para ansiedad y estrés suelen recomendarse plantas como manzanilla, lavanda y valeriana.';
  }

  // TÉ
  if (
    text.includes('té') ||
    text.includes('infusión')
  ) {
    return '🍵 Muchas plantas medicinales pueden prepararse en té o infusión usando agua caliente y hojas naturales.';
  }

  // DEFAULT
  return '🌿 Aún estoy aprendiendo sobre esa planta o tema medicinal. Intenta preguntar sobre manzanilla, sábila, romero, lavanda o hierbabuena.';
}