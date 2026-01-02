import type { BlogPost, BlogAuthor } from '@/types';

/**
 * AUTORES DEL BLOG
 */
export const blogAuthors: BlogAuthor[] = [
  {
    id: 'author-001',
    name: 'Antonio García',
    title: {
      es: 'Director Anclora Private Estates',
      en: 'Director Anclora Private Estates',
      de: 'Direktor Anclora Private Estates',
    },
    avatar: '/assets/images/team/antonio-garcia.jpg',
    bio: {
      es: 'Experto en real estate de lujo con más de 15 años de experiencia en el mercado mediterráneo.',
      en: 'Luxury real estate expert with over 15 years of experience in the Mediterranean market.',
      de: 'Experte für Luxusimmobilien mit über 15 Jahren Erfahrung auf dem mediterranen Markt.',
    },
  },
  {
    id: 'author-002',
    name: 'María Sánchez',
    title: {
      es: 'Analista de Mercado Inmobiliario',
      en: 'Real Estate Market Analyst',
      de: 'Immobilienmarkt-Analystin',
    },
    avatar: '/assets/images/team/maria-sanchez.jpg',
    bio: {
      es: 'Especialista en análisis de datos y tendencias del mercado inmobiliario en Mallorca.',
      en: 'Specialist in data analysis and real estate market trends in Mallorca.',
      de: 'Spezialistin für Datenanalyse und Immobilienmarkttrends auf Mallorca.',
    },
  },
];

/**
 * BLOG POSTS DE EJEMPLO
 */
export const sampleBlogPosts: BlogPost[] = [
  {
    id: 'post-001',
    slug: 'mercado-inmobiliario-mallorca-2025',
    title: {
      es: 'El Mercado Inmobiliario de Lujo en Mallorca 2025: Análisis y Proyecciones',
      en: 'Luxury Real Estate Market in Mallorca 2025: Analysis and Projections',
      de: 'Der Luxusimmobilienmarkt auf Mallorca 2025: Analyse und Prognosen',
    },
    excerpt: {
      es: 'Un análisis exhaustivo de las tendencias del mercado inmobiliario de lujo en Mallorca, con proyecciones para 2025 basadas en datos demográficos, económicos y de inversión.',
      en: 'A comprehensive analysis of luxury real estate market trends in Mallorca, with projections for 2025 based on demographic, economic and investment data.',
      de: 'Eine umfassende Analyse der Trends am Luxusimmobilienmarkt auf Mallorca, mit Prognosen für 2025 basierend auf demografischen, wirtschaftlichen und Investitionsdaten.',
    },
    content: {
      es: `El mercado inmobiliario de lujo en Mallorca continúa mostrando una resiliencia notable en 2025, impulsado por una demanda internacional sostenida y un inventario limitado de propiedades premium.

## Tendencias Clave

**Escasez de Inventario Premium**: Las propiedades de ultra-lujo (>5M€) han visto una reducción del 23% en el inventario disponible durante 2024, lo que ha ejercido presión al alza sobre los precios en zonas exclusivas como Son Vida y Port d'Andratx.

**Compradores Internacionales**: Los compradores de Latinoamérica, particularmente de México y Argentina, representan el 31% de las transacciones de alto valor, seguidos por compradores alemanes (24%) y británicos (18%).

**Off-Market como Norma**: Cada vez más propietarios de alto patrimonio prefieren la discreción de transacciones off-market, con un 47% de las ventas >2M€ ocurriendo fuera de portales públicos.

## Proyecciones para 2025

Esperamos un crecimiento moderado del 4-6% en valores de propiedades premium, con particular fortaleza en fincas históricas rehabilitadas y propiedades con certificación de sostenibilidad.`,
      en: `The luxury real estate market in Mallorca continues to show remarkable resilience in 2025, driven by sustained international demand and limited premium property inventory.

## Key Trends

**Premium Inventory Shortage**: Ultra-luxury properties (>€5M) have seen a 23% reduction in available inventory during 2024, putting upward pressure on prices in exclusive areas like Son Vida and Port d'Andratx.

**International Buyers**: Latin American buyers, particularly from Mexico and Argentina, represent 31% of high-value transactions, followed by German (24%) and British (18%) buyers.

**Off-Market as Norm**: Increasingly, high-net-worth property owners prefer the discretion of off-market transactions, with 47% of sales >€2M occurring outside public portals.

## 2025 Projections

We expect moderate growth of 4-6% in premium property values, with particular strength in rehabilitated historic estates and properties with sustainability certification.`,
      de: `Der Luxusimmobilienmarkt auf Mallorca zeigt auch im Jahr 2025 eine bemerkenswerte Resilienz, angetrieben durch eine anhaltende internationale Nachfrage und ein begrenztes Inventar an Premiumimmobilien.

## Haupttrends

**Mangel an Premium-Inventar**: Bei Ultra-Luxusimmobilien (>5 Mio. €) sank das verfügbare Inventar im Jahr 2024 um 23 %, was in exklusiven Gegenden wie Son Vida und Port d'Andratx zu einem Aufwärtspreisdruck führte.

**Internationale Käufer**: Käufer aus Lateinamerika, insbesondere aus Mexiko und Argentinien, machen 31 % der Transaktionen mit hohem Wert aus, gefolgt von deutschen (24 %) und britischen (18 %) Käufern.

**Off-Market als Norm**: Immer mehr wohlhabende Immobilienbesitzer bevorzugen die Diskretion von Off-Market-Transaktionen, wobei 47 % der Verkäufe >2 Mio. € außerhalb öffentlicher Portale stattfinden.

## Prognosen für 2025

Wir erwarten ein moderates Wachstum von 4-6 % bei den Premiumimmobilienwerten, mit besonderer Stärke bei sanierten historischen Anwesen und Immobilien mit Nachhaltigkeitszertifizierung.`,
    },
    category: 'market-insights',
    author: blogAuthors[1],
    coverImage: '/assets/images/blog/mallorca-market-2025.jpg',
    tags: ['mercado', 'análisis', 'proyecciones', 'lujo', 'Mallorca'],
    readingTime: 8,
    isPublished: true,
    publishedAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'post-002',
    slug: 'inversion-inmobiliaria-ia-predictiva',
    title: {
      es: 'Inversión Inmobiliaria con IA Predictiva: El Futuro Ya Está Aquí',
      en: 'Real Estate Investment with Predictive AI: The Future is Here',
      de: 'Immobilieninvestitionen mit prädiktiver KI: Die Zukunft ist da',
    },
    excerpt: {
      es: 'Cómo la inteligencia artificial está revolucionando la forma en que identificamos oportunidades de inversión antes que la competencia.',
      en: 'How artificial intelligence is revolutionizing the way we identify investment opportunities before the competition.',
      de: 'Wie künstliche Intelligenz die Art und Weise revolutioniert, wie wir Investitionsmöglichkeiten vor der Konkurrenz identifizieren.',
    },
    content: {
      es: `La inteligencia artificial predictiva está transformando radicalmente el sector inmobiliario, permitiendo identificar propiedades con alto potencial de revalorización meses antes de que salgan al mercado.

## La Ventaja Competitiva del Dato

En Anclora Private Estates, utilizamos algoritmos de machine learning que analizan patrones demográficos, económicos y de comportamiento para generar "scores de propensión a venta" de propiedades específicas.

**Fuentes de Datos**: Catastro, INE, BOE (subastas y herencias), patrones de compra/venta históricos, y señales públicas en redes sociales.

**Precisión**: Nuestros modelos han demostrado una tasa de acierto del 67% en predecir ventas en los siguientes 6 meses.

## Casos de Éxito

Un cliente internacional pudo adquirir una finca histórica en Valldemossa 4 meses antes de su listado público, gracias a que nuestro sistema identificó señales tempranas de intención de venta por parte del propietario.`,
      en: `Predictive artificial intelligence is radically transforming the real estate sector, enabling the identification of properties with high appreciation potential months before they hit the market.

## The Competitive Advantage of Data

At Anclora Private Estates, we use machine learning algorithms that analyze demographic, economic, and behavioral patterns to generate "propensity to sell scores" for specific properties.

**Data Sources**: Land Registry, National Statistics Institute, Official Gazette (auctions and inheritances), historical purchase/sale patterns, and public signals on social media.

**Accuracy**: Our models have demonstrated a 67% accuracy rate in predicting sales within the next 6 months.

## Success Stories

An international client was able to acquire a historic estate in Valldemossa 4 months before its public listing, thanks to our system identifying early signals of the owner's intention to sell.`,
      de: `Vorausschauende künstliche Intelligenz verändert den Immobiliensektor radikal und ermöglicht die Identifizierung von Immobilien mit hohem Wertsteigerungspotenzial Monate bevor sie auf den Markt kommen.

## Der Wettbewerbsvorteil durch Daten

Bei Anclora Private Estates nutzen wir Algorithmen für maschinelles Lernen, die demografische, wirtschaftliche und verhaltensbezogene Muster analysieren, um „Verkaufsneigungswerte“ für bestimmte Immobilien zu generieren.

**Datenquellen**: Kataster, statistische Ämter, offizielle Bekanntmachungen (Auktionen und Erbschaften), historische Kauf-/Verkaufsmuster und öffentliche Signale in sozialen Medien.

**Genauigkeit**: Unsere Modelle haben eine Erfolgsquote von 67 % bei der Vorhersage von Verkäufen innerhalb der nächsten 6 Monate gezeigt.

## Erfolgsgeschichten

Ein internationaler Kunde konnte ein historisches Anwesen in Valldemossa 4 Monate vor seiner öffentlichen Listung erwerben, da unser System frühzeitige Anzeichen für die Verkaufsabsicht des Eigentümers identifizierte.`,
    },
    category: 'investment',
    author: blogAuthors[0],
    coverImage: '/assets/images/blog/ai-predictive-investment.jpg',
    tags: ['inteligencia artificial', 'inversión', 'tecnología', 'predictivo'],
    readingTime: 6,
    isPublished: true,
    publishedAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'post-003',
    slug: 'vivir-mallorca-guia-completa',
    title: {
      es: 'Vivir en Mallorca: Guía Completa para Expatriados de Alto Patrimonio',
      en: 'Living in Mallorca: Complete Guide for High-Net-Worth Expats',
      de: 'Leben auf Mallorca: Vollständiger Leitfaden für vermögende Expats',
    },
    excerpt: {
      es: 'Todo lo que necesitas saber sobre residencia fiscal, educación internacional, healthcare premium y estilo de vida mediterráneo.',
      en: 'Everything you need to know about tax residency, international education, premium healthcare, and Mediterranean lifestyle.',
      de: 'Alles, was Sie über steuerlichen Wohnsitz, internationale Bildung, erstklassige Gesundheitsversorgung und mediterranen Lebensstil wissen müssen.',
    },
    content: {
      es: `Mallorca se ha consolidado como uno de los destinos preferidos para familias de alto patrimonio que buscan calidad de vida, seguridad y ventajas fiscales en Europa.

## Residencia Fiscal

España ofrece el régimen de **Beckham Law** para nuevos residentes, permitiendo tributar como no residente durante 6 años bajo ciertas condiciones. Ideal para ejecutivos y deportistas.

**Requisitos**: Permanecer más de 183 días al año en España, no haber sido residente fiscal en los últimos 10 años.

## Educación Internacional

Mallorca cuenta con colegios internacionales de primer nivel:

- **Bellver International College**: Currículo británico, IB Diploma
- **Agora Portals International School**: Bachillerato Internacional
- **Lycée Français de Palma**: Sistema educativo francés

## Healthcare Premium

Centros médicos como Clínica Juaneda y Hospital Quirónsalud ofrecen atención de nivel mundial con equipamiento de última generación.

## Conectividad

El aeropuerto de Palma (PMI) conecta con más de 180 destinos, con vuelos directos a todas las principales ciudades europeas y conexiones intercontinentales vía Madrid y Barcelona.`,
      en: `Mallorca has established itself as one of the preferred destinations for high-net-worth families seeking quality of life, security, and tax advantages in Europe.

## Tax Residency

Spain offers the **Beckham Law** regime for new residents, allowing taxation as a non-resident for 6 years under certain conditions. Ideal for executives and athletes.

**Requirements**: Stay more than 183 days per year in Spain, not having been a tax resident in the last 10 years.

## International Education

Mallorca has top-tier international schools:

- **Bellver International College**: British curriculum, IB Diploma
- **Agora Portals International School**: International Baccalaureate
- **Lycée Français de Palma**: French educational system

## Premium Healthcare

Medical centers like Clínica Juaneda and Hospital Quirónsalud offer world-class care with state-of-the-art equipment.

## Connectivity

Palma Airport (PMI) connects to over 180 destinations, with direct flights to all major European cities and intercontinental connections via Madrid and Barcelona.`,
      de: `Mallorca hat sich als eines der beliebtesten Ziele für vermögende Familien etabliert, die Lebensqualität, Sicherheit und Steuervorteile in Europa suchen.

## Steuerlicher Wohnsitz

Spanien bietet die **Beckham-Law**-Regelung für neue Einwohner an, die unter bestimmten Bedingungen eine Besteuerung als Nichtansässiger für 6 Jahre ermöglicht. Ideal für Führungskräfte und Sportler.

**Anforderungen**: Aufenthalt von mehr als 183 Tagen pro Jahr in Spanien, kein steuerlicher Wohnsitz in den letzten 10 Jahren.

## Internationale Bildung

Mallorca verfügt über erstklassige internationale Schulen:

- **Bellver International College**: Britischer Lehrplan, IB-Diplom
- **Agora Portals International School**: International Baccalaureate
- **Lycée Français de Palma**: Französisches Bildungssystem

## Erstklassige Gesundheitsversorgung

Medizinische Zentren wie die Clínica Juaneda und das Hospital Quirónsalud bieten erstklassige Versorgung mit modernster Ausstattung.

## Konnektivität

Der Flughafen Palma (PMI) bietet Verbindungen zu über 180 Zielen mit Direktflügen zu allen europäischen Großstädten und Interkontinentalverbindungen über Madrid und Barcelona.`,
    },
    category: 'lifestyle',
    author: blogAuthors[0],
    coverImage: '/assets/images/blog/living-in-mallorca.jpg',
    tags: ['Mallorca', 'expatriados', 'lifestyle', 'residencia'],
    readingTime: 10,
    isPublished: true,
    publishedAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'post-004',
    slug: 'son-vida-exclusividad-privilegio',
    title: {
      es: 'Son Vida: Donde la Exclusividad se Encuentra con el Privilegio',
      en: 'Son Vida: Where Exclusivity Meets Privilege',
      de: 'Son Vida: Wo Exklusivität auf Privilegien trifft',
    },
    excerpt: {
      es: 'Un recorrido por la zona residencial más prestigiosa de Mallorca, hogar de campos de golf de campeonato y villas de ensueño.',
      en: 'A tour through Mallorca\'s most prestigious residential area, home to championship golf courses and dream villas.',
      de: 'Ein Rundgang durch das prestigeträchtigste Wohngebiet Mallorcas, Heimat von Meisterschafts-Golfplätzen und Traumvillen.',
    },
    content: {
      es: `Son Vida representa el pináculo del real estate de lujo en Mallorca. Esta urbanización exclusiva, situada en las colinas sobre Palma, combina privacidad absoluta con proximidad a los servicios de la capital.

## La Zona

Ubicada a solo 5 km del centro de Palma y 15 minutos del aeropuerto, Son Vida ofrece vistas panorámicas a la bahía y la ciudad.

**Superficie**: Aproximadamente 3.5 km²
**Altitud**: 100-130 metros sobre el nivel del mar
**Habitantes**: Menos de 1,000 residentes permanentes

## Golf de Clase Mundial

Tres campos de golf de campeonato:
- **Son Vida Golf**: Diseñado por F.W. Hawtree, el más antiguo de Mallorca (1964)
- **Son Muntaner Golf**: Par 72, diseño de Kurt Rossknecht
- **Son Quint Golf**: Par 67, ideal para jugadores de todos los niveles

## Arquitectura y Propiedades

Las villas en Son Vida se caracterizan por arquitectura mediterránea contemporánea, parcelas generosas (1,000-5,000 m²) y acabados de máxima calidad.

**Rango de precios**: 2M€ - 15M€
**M² construcción promedio**: 500-1,200 m²`,
      en: `Son Vida represents the pinnacle of luxury real estate in Mallorca. This exclusive urbanization, situated in the hills above Palma, combines absolute privacy with proximity to capital services.

## The Area

Located just 5 km from Palma center and 15 minutes from the airport, Son Vida offers panoramic views of the bay and city.

**Area**: Approximately 3.5 km²
**Altitude**: 100-130 meters above sea level
**Residents**: Fewer than 1,000 permanent residents

## World-Class Golf

Three championship golf courses:
- **Son Vida Golf**: Designed by F.W. Hawtree, Mallorca's oldest (1964)
- **Son Muntaner Golf**: Par 72, Kurt Rossknecht design
- **Son Quint Golf**: Par 67, ideal for players of all levels

## Architecture and Properties

Villas in Son Vida are characterized by contemporary Mediterranean architecture, generous plots (1,000-5,000 m²), and top-quality finishes.

**Price range**: €2M - €15M
**Average built area**: 500-1,200 m²`,
      de: `Son Vida ist der Inbegriff von Luxusimmobilien auf Mallorca. Diese exklusive Urbanisation in den Hügeln über Palma verbindet absolute Privatsphäre mit der Nähe zu den Dienstleistungen der Hauptstadt.

## Das Gebiet

Nur 5 km vom Zentrum Palmas und 15 Minuten vom Flughafen entfernt bietet Son Vida einen Panoramablick auf die Bucht und die Stadt.

**Fläche**: Ca. 3,5 km²
**Höhe**: 100-130 Meter über dem Meeresspiegel
**Einwohner**: Weniger als 1.000 ständige Einwohner

## Weltklasse-Golf

Drei Meisterschafts-Golfplätze:
- **Son Vida Golf**: Entworfen von F.W. Hawtree, Mallorcas ältester Platz (1964)
- **Son Muntaner Golf**: Par 72, Entwurf von Kurt Rossknecht
- **Son Quint Golf**: Par 67, ideal für Spieler aller Stärken

## Architektur und Immobilien

Villen in Son Vida zeichnen sich durch zeitgenössische mediterrane Architektur, großzügige Grundstücke (1.000-5.000 m²) und hochwertigste Ausstattungen aus.

**Preisspanne**: 2 Mio. € - 15 Mio. €
**Durchschnittliche bebaute Fläche**: 500-1.200 m²`,
    },
    category: 'property-spotlight',
    author: blogAuthors[0],
    coverImage: '/assets/images/blog/son-vida-spotlight.jpg',
    tags: ['Son Vida', 'lujo', 'golf', 'villas'],
    readingTime: 7,
    isPublished: true,
    publishedAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
  },
  {
    id: 'post-005',
    slug: 'sostenibilidad-real-estate-lujo',
    title: {
      es: 'Sostenibilidad en el Real Estate de Lujo: Más que una Tendencia',
      en: 'Sustainability in Luxury Real Estate: More Than a Trend',
      de: 'Nachhaltigkeit in Luxusimmobilien: Mehr als ein Trend',
    },
    excerpt: {
      es: 'Las certificaciones de sostenibilidad están agregando valor tangible a las propiedades de lujo. Descubre por qué.',
      en: 'Sustainability certifications are adding tangible value to luxury properties. Discover why.',
      de: 'Nachhaltigkeitszertifizierungen verleihen Luxusimmobilien einen greifbaren Wert. Erfahren Sie warum.',
    },
    content: {
      es: `La sostenibilidad ha dejado de ser un "nice to have" para convertirse en un factor determinante del valor inmobiliario en el segmento de lujo.

## El Comprador Consciente

Los compradores de alto patrimonio, especialmente millennials y Gen Z herederos, priorizan cada vez más la eficiencia energética y el impacto ambiental.

**Datos**: El 73% de compradores de propiedades >2M€ consideran las certificaciones de sostenibilidad como factor decisivo de compra (estudio Savills 2024).

## Certificaciones Relevantes

- **BREEAM**: Building Research Establishment Environmental Assessment Method
- **LEED**: Leadership in Energy and Environmental Design
- **Passivhaus**: Estándar alemán de eficiencia energética extrema
- **VERDE**: Certificación española de edificación sostenible

## Retorno de Inversión

Propiedades con certificaciones premium muestran:
- **+12% valor de mercado** vs. comparables sin certificación
- **-40% costes energéticos** operacionales
- **+25% velocidad de venta** en mercados competitivos

## Tendencias 2025

Aerotermia, paneles solares integrados arquitectónicamente, sistemas de recogida de agua de lluvia y jardines xerófilos son el nuevo estándar en nuevas construcciones de lujo.`,
      en: `Sustainability has ceased to be a "nice to have" to become a determining factor of real estate value in the luxury segment.

## The Conscious Buyer

High-net-worth buyers, especially millennials and Gen Z heirs, increasingly prioritize energy efficiency and environmental impact.

**Data**: 73% of buyers of properties >€2M consider sustainability certifications as a decisive purchase factor (Savills 2024 study).

## Relevant Certifications

- **BREEAM**: Building Research Establishment Environmental Assessment Method
- **LEED**: Leadership in Energy and Environmental Design
- **Passivhaus**: German extreme energy efficiency standard
- **VERDE**: Spanish sustainable building certification

## Return on Investment

Properties with premium certifications show:
- **+12% market value** vs. comparable without certification
- **-40% operational energy costs**
- **+25% sales velocity** in competitive markets

## 2025 Trends

Aerothermal energy, architecturally integrated solar panels, rainwater collection systems, and xerophytic gardens are the new standard in luxury new builds.`,
      de: `Nachhaltigkeit ist kein „Nice-to-have“ mehr, sondern ein entscheidender Faktor für den Immobilienwert im Luxussegment.

## Der bewusste Käufer

Wohlhabende Käufer, insbesondere Erben der Millennials und der Gen Z, legen zunehmend Wert auf Energieeffizienz und Umweltauswirkungen.

**Daten**: 73 % der Käufer von Immobilien >2 Mio. € betrachten Nachhaltigkeitszertifizierungen als entscheidenden Kauffaktor (Savills-Studie 2024).

## Relevante Zertifizierungen

- **BREEAM**: Building Research Establishment Environmental Assessment Method
- **LEED**: Leadership in Energy and Environmental Design
- **Passivhaus**: Deutscher Standard für extreme Energieeffizienz
- **VERDE**: Spanische Zertifizierung für nachhaltiges Bauen

## Kapitalrendite

Immobilien mit Premium-Zertifizierungen weisen auf:
- **+12 % Marktwert** gegenüber vergleichbaren Immobilien ohne Zertifizierung
- **-40 % betriebliche Energiekosten**
- **+25 % Verkaufsgeschwindigkeit** in wettbewerbsintensiven Märkten

## Trends 2025

Luftwärmepumpen, architektonisch integrierte Sonnenkollektoren, Regenwasser-Auffangsysteme und xerophytische Gärten sind der neue Standard bei luxuriösen Neubauten.`,
    },
    category: 'investment',
    author: blogAuthors[1],
    coverImage: '/assets/images/blog/sustainability-luxury.jpg',
    tags: ['sostenibilidad', 'inversión', 'certificaciones', 'eco-luxury'],
    readingTime: 6,
    isPublished: true,
    publishedAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
];

/**
 * Blog posts destacados (featured)
 */
export const featuredBlogPosts = sampleBlogPosts.filter(
  (post) => post.category === 'market-insights' || post.category === 'investment'
).slice(0, 3);

/**
 * Posts más recientes
 */
export const latestBlogPosts = [...sampleBlogPosts]
  .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  .slice(0, 6);

/**
 * Posts por categoría
 */
export const getBlogPostsByCategory = (category: string) => {
  return sampleBlogPosts.filter((post) => post.category === category);
};

/**
 * Estadísticas del blog
 */
export const blogStats = {
  totalPosts: sampleBlogPosts.length,
  categories: [...new Set(sampleBlogPosts.map((p) => p.category))].length,
  authors: blogAuthors.length,
  averageReadingTime: Math.round(
    sampleBlogPosts.reduce((sum, p) => sum + p.readingTime, 0) / sampleBlogPosts.length
  ),
};
