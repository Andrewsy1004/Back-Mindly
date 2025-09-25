const categoriaMap = {
  // Tecnología
  'programacion': 'Tecnología',
  'programación': 'Tecnología',
  'coding': 'Tecnología',
  'software': 'Tecnología',
  'desarrollo': 'Tecnología',
  'apps': 'Tecnología',
  'web': 'Tecnología',
  'movil': 'Tecnología',
  'móvil': 'Tecnología',
  'tech': 'Tecnología',
  'ia': 'Tecnología',
  'inteligencia artificial': 'Tecnología',
  'machine learning': 'Tecnología',

  // Salud
  'salud': 'Salud',
  'medicina': 'Salud',
  'fitness': 'Salud',
  'nutricion': 'Salud',
  'nutrición': 'Salud',
  'ejercicio': 'Salud',
  'bienestar': 'Salud',
  'psicologia': 'Salud',
  'psicología': 'Salud',

  // Arte
  'arte': 'Arte',
  'pintura': 'Arte',
  'dibujo': 'Arte',
  'escultura': 'Arte',
  'fotografia': 'Arte',
  'fotografía': 'Arte',
  'cine': 'Arte',
  'teatro': 'Arte',
  'musica': 'Arte',
  'música': 'Arte',
  'literatura': 'Arte',

  // Ciencia
  'ciencia': 'Ciencia',
  'biología': 'Ciencia',
  'biologia': 'Ciencia',
  'física': 'Ciencia',
  'fisica': 'Ciencia',
  'química': 'Ciencia',
  'quimica': 'Ciencia',
  'astronomía': 'Ciencia',
  'astronomia': 'Ciencia',
  'investigación': 'Ciencia',
  'investigacion': 'Ciencia',

  // Deportes
  'deporte': 'Deportes',
  'deportes': 'Deportes',
  'futbol': 'Deportes',
  'fútbol': 'Deportes',
  'basket': 'Deportes',
  'baloncesto': 'Deportes',
  'tenis': 'Deportes',
  'running': 'Deportes',
  'natacion': 'Deportes',
  'natación': 'Deportes',

  // Negocios y Finanzas
  'negocios': 'Negocios',
  'empresa': 'Negocios',
  'emprendimiento': 'Negocios',
  'startup': 'Negocios',
  'marketing': 'Negocios',
  'finanzas': 'Finanzas',
  'dinero': 'Finanzas',
  'economia': 'Finanzas',
  'economía': 'Finanzas',
  'inversion': 'Finanzas',
  'inversión': 'Finanzas',
  'trading': 'Finanzas',
  'cripto': 'Finanzas',
  'criptomonedas': 'Finanzas',

  // Educación
  'educacion': 'Educación',
  'educación': 'Educación',
  'aprendizaje': 'Educación',
  'estudio': 'Educación',
  'universidad': 'Educación',
  'colegio': 'Educación',

  // Viajes y Cultura
  'viaje': 'Viajes',
  'viajes': 'Viajes',
  'turismo': 'Viajes',
  'aventura': 'Viajes',
  'cultura': 'Cultura',
  'historia': 'Cultura',
  'tradiciones': 'Cultura',

  // Gastronomía
  'comida': 'Gastronomía',
  'cocina': 'Gastronomía',
  'recetas': 'Gastronomía',
  'gastronomia': 'Gastronomía',
  'gastronomía': 'Gastronomía',

  // Gaming
  'gaming': 'Gaming',
  'videojuegos': 'Gaming',
  'juegos': 'Gaming',

  // Medio Ambiente
  'medio ambiente': 'Medio Ambiente',
  'ecologia': 'Medio Ambiente',
  'ecología': 'Medio Ambiente',
  'sostenibilidad': 'Medio Ambiente',
  'naturaleza': 'Medio Ambiente',
};

export const normalizarCategoria = (categoria) => {
  const key = categoria.toLowerCase().trim();
  return categoriaMap[key] || 'Otros'; 
};
