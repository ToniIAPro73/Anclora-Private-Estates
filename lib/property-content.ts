/**
 * Property Content Templates System
 * Anclora Private Estates
 * 
 * Rich, SEO-optimized property description templates
 */

// ==============================================
// PROPERTY DESCRIPTION TEMPLATES
// ==============================================

export interface PropertyContent {
  title: string;
  subtitle: string;
  introduction: string;
  mainDescription: string;
  locationHighlight: string;
  featuresHighlight: string;
  lifestyleDescription: string;
  investmentNote?: string;
  callToAction: string;
}

/**
 * Generate rich property description
 */
export function generatePropertyDescription({
  propertyType,
  location,
  bedrooms,
  bathrooms,
  size,
  plotSize,
  price,
  features,
  uniqueSellingPoints,
  viewType,
  yearBuilt,
  style,
}: {
  propertyType: 'Villa' | 'Apartment' | 'Penthouse' | 'Finca' | 'Townhouse';
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  plotSize?: number;
  price: number;
  features: string[];
  uniqueSellingPoints: string[];
  viewType?: 'sea' | 'mountain' | 'golf' | 'city' | 'garden';
  yearBuilt?: number;
  style?: 'contemporary' | 'mediterranean' | 'modern' | 'traditional' | 'rustic';
}): PropertyContent {
  const priceFormatted = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);

  // Property type intro
  const typeIntros = {
    Villa: 'Espectacular villa de lujo',
    Apartment: 'Exclusivo apartamento',
    Penthouse: 'Impresionante ático',
    Finca: 'Magnífica finca mediterránea',
    Townhouse: 'Elegante casa adosada',
  };

  // Style descriptors
  const styleDescriptors = {
    contemporary: 'diseño contemporáneo',
    mediterranean: 'estilo mediterráneo',
    modern: 'arquitectura moderna',
    traditional: 'encanto tradicional',
    rustic: 'carácter rústico auténtico',
  };

  // View descriptors
  const viewDescriptors = {
    sea: 'impresionantes vistas al mar Mediterráneo',
    mountain: 'espectaculares vistas a la Sierra de Tramuntana',
    golf: 'magníficas vistas al campo de golf',
    city: 'panorámicas vistas de la ciudad',
    garden: 'vistas a exuberantes jardines',
  };

  const title = `${typeIntros[propertyType]} en ${location}`;
  const subtitle = `${bedrooms} dormitorios, ${bathrooms} banos, ${size}m2 ${plotSize ? `en ${plotSize}m2 de parcela` : ''} | ${priceFormatted}`;

  const introduction = style && viewType
    ? `${typeIntros[propertyType]} de ${styleDescriptors[style]} situada en la exclusiva zona de ${location}. Esta propiedad única ofrece ${viewDescriptors[viewType]} y representa la perfecta combinación de lujo, privacidad y ubicación privilegiada en Mallorca.`
    : `${typeIntros[propertyType]} situada en la prestigiosa zona de ${location}, Mallorca. Una propiedad excepcional que combina elegancia, confort y una ubicación inmejorable.`;

  const mainDescription = generateMainDescription({
    propertyType,
    size,
    bedrooms,
    bathrooms,
    features,
    yearBuilt,
  });

  const locationHighlight = generateLocationHighlight(location);

  const featuresHighlight = generateFeaturesHighlight(features, uniqueSellingPoints);

  const lifestyleDescription = generateLifestyleDescription(location, propertyType);

  const investmentNote = price > 2000000 
    ? `Esta propiedad representa una excelente oportunidad de inversión en el mercado inmobiliario de lujo de Mallorca, una de las zonas más demandadas del Mediterráneo con alta revalorización anual.`
    : undefined;

  const callToAction = `Contacte con Anclora Private Estates para más información sobre esta excepcional propiedad en ${location} o para agendar una visita privada. Nuestro equipo de expertos está a su disposición para asesorarle en todo el proceso.`;

  return {
    title,
    subtitle,
    introduction,
    mainDescription,
    locationHighlight,
    featuresHighlight,
    lifestyleDescription,
    investmentNote,
    callToAction,
  };
}

/**
 * Generate main property description
 */
function generateMainDescription({
  propertyType,
  size,
  bedrooms,
  bathrooms,
  features,
  yearBuilt,
}: {
  propertyType: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  yearBuilt?: number;
}): string {
  const hasPool = features.some(f => f.toLowerCase().includes('piscina'));
  const hasGarden = features.some(f => f.toLowerCase().includes('jardín'));
  const hasGarage = features.some(f => f.toLowerCase().includes('garaje'));
  const hasDomotics = features.some(f => f.toLowerCase().includes('domótica'));

  let description = `Esta ${propertyType.toLowerCase()} de ${size}m² construidos cuenta con ${bedrooms} amplios dormitorios y ${bathrooms} baños de diseño. `;

  if (yearBuilt && yearBuilt >= 2020) {
    description += `Construida en ${yearBuilt} con los más altos estándares de calidad y eficiencia energética. `;
  } else if (yearBuilt && yearBuilt >= 2015) {
    description += `Construcción de ${yearBuilt}, completamente actualizada con las mejores calidades. `;
  }

  description += `Los espacios interiores destacan por su luminosidad y amplitud, con acabados de primera calidad que incluyen `;

  const interiorFeatures: string[] = [];
  if (features.some(f => f.toLowerCase().includes('mármol'))) interiorFeatures.push('suelos de mármol');
  if (features.some(f => f.toLowerCase().includes('parquet'))) interiorFeatures.push('parquet de roble');
  if (features.some(f => f.toLowerCase().includes('cocina'))) interiorFeatures.push('cocina de diseño equipada con electrodomésticos de alta gama');

  if (interiorFeatures.length > 0) {
    description += interiorFeatures.join(', ') + '. ';
  } else {
    description += 'materiales nobles y acabados de lujo en todos los espacios. ';
  }

  if (propertyType === 'Villa' || propertyType === 'Finca') {
    description += `El salón principal, de generosas dimensiones, se abre a la terraza mediante amplios ventanales que inundan el espacio de luz natural y crean una perfecta conexión con el exterior. `;
  }

  if (hasPool) {
    description += `Los exteriores son igualmente impresionantes, con una piscina de diseño `;
    if (features.some(f => f.toLowerCase().includes('infinity'))) {
      description += `infinity que se funde con el horizonte, `;
    }
    description += `rodeada de elegantes terrazas ideales para disfrutar del clima mediterráneo. `;
  }

  if (hasGarden) {
    description += `El jardín mediterráneo, meticulosamente cuidado, ofrece zonas de descanso y rincones privados. `;
  }

  if (hasGarage) {
    description += `La propiedad incluye garaje privado `;
    const garageMatch = features.find(f => f.toLowerCase().includes('garaje'));
    if (garageMatch && /\d+/.test(garageMatch)) {
      const spaces = garageMatch.match(/\d+/)?.[0];
      description += `con capacidad para ${spaces} vehículos. `;
    } else {
      description += `cubierto. `;
    }
  }

  if (hasDomotics) {
    description += `Sistema de domótica integrado que permite el control completo de iluminación, climatización y seguridad. `;
  }

  return description;
}

/**
 * Generate location highlight
 */
function generateLocationHighlight(location: string): string {
  const locationDescriptions: Record<string, string> = {
    'Son Vida': `Son Vida es la zona residencial más exclusiva de Palma, conocida por sus lujosas villas y su proximidad a campos de golf de prestigio internacional. A solo 5 minutos del centro de Palma, esta ubicación ofrece privacidad absoluta sin renunciar a la comodidad de los servicios urbanos. La zona cuenta con seguridad 24 horas y es el hogar de la comunidad internacional más selecta de Mallorca.`,
    
    'Port d\'Andratx': `Port d'Andratx, en la costa suroeste de Mallorca, es uno de los puertos naturales más bellos del Mediterráneo. Esta exclusiva zona combina el encanto de un pueblo marinero con la sofisticación de un destino de lujo internacional. Con restaurantes gourmet, puerto deportivo de primer nivel y playas vírgenes en los alrededores, es el lugar perfecto para quienes buscan lo mejor del estilo de vida mediterráneo.`,
    
    'Palma Centro': `El centro histórico de Palma es un tesoro arquitectónico con más de 2000 años de historia. Vivir aquí significa estar a pasos de la Catedral de Mallorca, el Paseo del Borne con sus boutiques de lujo, restaurantes con estrella Michelin y una vibrante vida cultural. Es la elección ideal para quienes valoran la autenticidad, la cultura y la comodidad de tener todo al alcance caminando.`,
    
    'Paseo Marítimo': `El Paseo Marítimo de Palma es el corazón cosmopolita de la ciudad, donde el Mediterráneo se encuentra con la vida urbana más sofisticada. Esta zona ofrece vistas al mar, acceso directo al Club Náutico y a minutos del aeropuerto y del centro histórico. Es perfecta para quienes desean un estilo de vida urbano sin renunciar a la brisa marina.`,
    
    'Valldemossa': `Valldemossa es uno de los pueblos más pintorescos de Mallorca, enclavado en las montañas de la Serra de Tramuntana, Patrimonio de la Humanidad por la UNESCO. Famoso por haber acogido a Chopin y George Sand, este enclave combina belleza natural excepcional con un patrimonio cultural único. Ideal para amantes de la naturaleza, la tranquilidad y la autenticidad mediterránea.`,
    
    'Deià': `Deià es un pueblo bohemio y sofisticado en las montañas de Tramuntana, que ha atraído históricamente a artistas, escritores y creativos de todo el mundo. Con vistas espectaculares al Mediterráneo, calas vírgenes y una comunidad internacional vibrante, Deià ofrece un estilo de vida único que combina naturaleza, cultura y exclusividad.`,
    
    'Sóller': `Sóller, con su hermoso valle de naranjos y arquitectura modernista, es conocido como "la perla de las montañas". Este pueblo encantador mantiene su autenticidad mallorquina mientras ofrece todos los servicios modernos. El histórico tranvía conecta Sóller con su puerto, creando una atmósfera única. Perfecto para quienes buscan calidad de vida en un entorno natural privilegiado.`,
    
    'Pollensa': `Pollensa, en el norte de Mallorca, combina un casco antiguo medieval perfectamente conservado con proximidad a las mejores playas y calas de la isla. Esta zona es especialmente apreciada por las familias y por quienes buscan un ambiente más tranquilo sin renunciar a restaurantes de calidad, campos de golf y un puerto deportivo activo.`,
    
    'Santa Ponsa': `Santa Ponsa, en la costa suroeste, es conocida por sus campos de golf de campeonato y su puerto deportivo. Esta zona residencial ofrece excelentes colegios internacionales, playas de arena blanca y una comunidad internacional bien establecida. Es ideal para familias y amantes del golf que buscan un estilo de vida activo junto al mar.`,
    
    'Alcúdia': `Alcúdia, en el norte de la isla, combina una ciudad medieval amurallada con modernas instalaciones junto al mar. La zona ofrece kilómetros de playas de arena fina, un puerto deportivo activo y proximidad al Parque Natural de s'Albufera. Perfecta para quienes buscan espacio, naturaleza y un ambiente familiar.`,
  };

  return locationDescriptions[location] || `${location} es una ubicación privilegiada en Mallorca, que combina exclusividad, servicios de calidad y una excelente ubicación en la isla.`;
}

/**
 * Generate features highlight
 */
function generateFeaturesHighlight(features: string[], uniqueSellingPoints: string[]): string {
  let highlight = `Entre las características destacadas de esta propiedad se encuentran:\n\n`;

  // Group features by category
  const categories = {
    comfort: features.filter(f => 
      f.toLowerCase().includes('climatización') || 
      f.toLowerCase().includes('calefacción') ||
      f.toLowerCase().includes('aire acondicionado')
    ),
    security: features.filter(f => 
      f.toLowerCase().includes('alarma') || 
      f.toLowerCase().includes('seguridad') ||
      f.toLowerCase().includes('cámara')
    ),
    outdoor: features.filter(f => 
      f.toLowerCase().includes('terraza') || 
      f.toLowerCase().includes('jardín') ||
      f.toLowerCase().includes('piscina') ||
      f.toLowerCase().includes('barbacoa')
    ),
    technology: features.filter(f => 
      f.toLowerCase().includes('domótica') || 
      f.toLowerCase().includes('fibra') ||
      f.toLowerCase().includes('sonido')
    ),
    premium: features.filter(f => 
      f.toLowerCase().includes('bodega') || 
      f.toLowerCase().includes('gimnasio') ||
      f.toLowerCase().includes('spa') ||
      f.toLowerCase().includes('ascensor')
    ),
  };

  if (categories.comfort.length > 0) {
    highlight += `**Confort y Climatización**: ${categories.comfort.join(', ')}\n\n`;
  }

  if (categories.security.length > 0) {
    highlight += `**Seguridad**: ${categories.security.join(', ')}\n\n`;
  }

  if (categories.outdoor.length > 0) {
    highlight += `**Espacios Exteriores**: ${categories.outdoor.join(', ')}\n\n`;
  }

  if (categories.technology.length > 0) {
    highlight += `**Tecnología**: ${categories.technology.join(', ')}\n\n`;
  }

  if (categories.premium.length > 0) {
    highlight += `**Extras Premium**: ${categories.premium.join(', ')}\n\n`;
  }

  if (uniqueSellingPoints.length > 0) {
    highlight += `\n**Puntos Únicos de esta Propiedad**:\n`;
    uniqueSellingPoints.forEach(point => {
      highlight += `• ${point}\n`;
    });
  }

  return highlight;
}

/**
 * Generate lifestyle description
 */
function generateLifestyleDescription(location: string, _propertyType: string): string {
  const lifestyleTemplates: Record<string, string> = {
    'Son Vida': `Vivir en Son Vida significa despertar con vistas a la bahía de Palma, disfrutar de una ronda de golf en campos de prestigio internacional y regresar a la privacidad de su villa en solo minutos. Los fines de semana puede explorar el casco antiguo de Palma, disfrutar de la gastronomía de la isla o simplemente relajarse en su jardín mediterráneo. Es el equilibrio perfecto entre actividad y tranquilidad.`,
    
    'Port d\'Andratx': `La vida en Port d'Andratx gira en torno al mar. Imagine iniciar su día con un café en la terraza contemplando el puerto, pasar la tarde navegando por calas vírgenes y cerrar el día con una cena en uno de los restaurantes gourmet del paseo marítimo. Los domingos, el mercado semanal ofrece productos locales y artesanía. Es el Mediterráneo en su máxima expresión.`,
    
    'Palma Centro': `Vivir en el centro de Palma es disfrutar de la ciudad a pie. Desde su hogar puede caminar a la Catedral, visitar galerías de arte contemporáneo, hacer compras en boutiques de diseño o tomar un vermut en plazas históricas. Por la noche, la ciudad ofrece desde ópera en el Teatre Principal hasta jazz en clubs íntimos. Es vida urbana con alma mediterránea.`,
    
    'Deià': `La vida en Deià es para quienes valoran la creatividad y la belleza natural. Puede comenzar el día con una caminata por la montaña, trabajar en su estudio con vistas al mar, y terminar el día con una cena en Ca's Xorc o en Sebastián. Los fines de semana, la cala de Deià ofrece aguas cristalinas. Es un refugio creativo en un entorno natural único.`,
  };

  return lifestyleTemplates[location] || `Esta propiedad en ${location} ofrece un estilo de vida único que combina las mejores características de Mallorca: clima excepcional, gastronomía mediterránea, actividades al aire libre y una comunidad internacional acogedora.`;
}

// ==============================================
// SEO-OPTIMIZED CONTENT HELPERS
// ==============================================

/**
 * Generate SEO-friendly property title
 */
export function generateSEOTitle({
  propertyType,
  location,
  bedrooms,
  uniqueFeature,
}: {
  propertyType: string;
  location: string;
  bedrooms: number;
  uniqueFeature?: string;
}): string {
  const templates = [
    `${propertyType} de Lujo ${bedrooms} Dormitorios en ${location}`,
    `${propertyType} Exclusiva en ${location} - ${bedrooms} Dormitorios`,
    `${propertyType} ${uniqueFeature || 'Premium'} en ${location} Mallorca`,
  ];

  return templates[0]; // Default to first template
}

/**
 * Generate SEO-friendly meta description
 */
export function generateSEODescription({
  propertyType,
  location,
  bedrooms,
  bathrooms,
  size,
  price,
  keyFeatures,
}: {
  propertyType: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  price: number;
  keyFeatures: string[];
}): string {
  const priceFormatted = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  const featuresText = keyFeatures.slice(0, 3).join(', ');

  return `${propertyType} de lujo en ${location}: ${bedrooms} dormitorios, ${bathrooms} baños, ${size}m². ${featuresText}. ${priceFormatted}. Visita virtual disponible. ☎ +34 971 XXX XXX`;
}

/**
 * Generate property keywords
 */
export function generatePropertyKeywords({
  propertyType,
  location,
  features,
}: {
  propertyType: string;
  location: string;
  features: string[];
}): string[] {
  const baseKeywords = [
    `${propertyType.toLowerCase()} ${location.toLowerCase()}`,
    `${propertyType.toLowerCase()} lujo ${location.toLowerCase()}`,
    `comprar ${propertyType.toLowerCase()} ${location.toLowerCase()}`,
    `${propertyType.toLowerCase()} venta ${location.toLowerCase()}`,
    `inmobiliaria ${location.toLowerCase()}`,
    'propiedad exclusiva mallorca',
    'real estate mallorca',
  ];

  const featureKeywords = features.map(f => 
    `${propertyType.toLowerCase()} ${f.toLowerCase()} ${location.toLowerCase()}`
  );

  return [...baseKeywords, ...featureKeywords.slice(0, 5)];
}

