import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type LocaleKey = 'es' | 'ca' | 'de' | 'en' | 'sv' | 'fr' | 'it' | 'da' | 'nl' | 'no' | 'pt';

interface DisclaimerContent {
  backToHome: string;
  title: string;
  lastUpdated: string;
  importantNotice: string;
  importantText: string;
  s1Title: string;
  s1Intro: string;
  companyName: string;
  nifCif: string;
  registered: string;
  emailLabel: string;
  phoneLabel: string;
  registeredIn: string;
  activity: string;
  assoc: string;
  apiNumber: string;
  s2Title: string;
  s2Text1: string;
  s2Text2: string;
  s3Title: string;
  s3Text1: string;
  s3Text2: string;
  s3Text3: string;
  s3list1: string; s3list2: string; s3list3: string; s3list4: string;
  s4Title: string;
  s41Title: string;
  s41Text1: string;
  s41Text2: string;
  pricesNotInclude: string;
  pni1: string; pni2: string; pni3: string; pni4: string; pni5: string;
  estimatedCosts: string;
  s42Title: string;
  s42Text1: string;
  s42Text2: string;
  s43Title: string;
  s43Text: string;
  s5Title: string;
  s5Text1: string;
  s5NotLabel: string;
  s5not1: string; s5not2: string; s5not3: string; s5not4: string;
  s5OfferLabel: string;
  s5offer1: string; s5offer2: string; s5offer3: string;
  s6Title: string;
  s61Title: string;
  s61Text: string;
  s61list1: string; s61list2: string; s61list3: string;
  s62Title: string;
  s62Warning: string;
  s62Text: string;
  s62list1: string; s62list2: string; s62list3: string; s62list4: string;
  s63Title: string;
  s63Text1: string;
  s63Text2: string;
  s7Title: string;
  s7Text1: string;
  s7ProhibitedLabel: string;
  s7p1: string; s7p2: string; s7p3: string;
  s7Text2: string;
  s8Title: string;
  s8Text: string;
  s9Title: string;
  s9Text: string;
  privacyPolicy: string;
  s10Title: string;
  s10Text1: string;
  s11Title: string;
  s11Text: string;
  contactLabel: string;
}

const content: Record<LocaleKey, DisclaimerContent> = {
  en: {
    backToHome: 'Back to home',
    title: 'Legal Notice',
    lastUpdated: 'Last updated: January 24, 2026',
    importantNotice: 'Important Notice:',
    importantText: 'The information contained on this website is for informational purposes only and does not constitute legal, tax, or investment advice. Property photographs and renders may not exactly match reality. All prices are subject to change without notice. Anclora Group is not responsible for errors or omissions in the published information. Please verify all information directly with our agents before making any decisions.',
    s1Title: '1. Identification of the Owner',
    s1Intro: 'In compliance with Article 10 of Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI-CE), the following information is provided:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Mallorca, Islas Baleares',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Real estate intermediation',
    assoc: 'Colegio de Agentes de la Propiedad Inmobiliaria de Baleares',
    apiNumber: 'XXXX',
    s2Title: '2. Purpose and Scope',
    s2Text1: 'This Legal Notice regulates the use of the website www.ancloraprivateestates.com (hereinafter, the "Website"), owned by Anclora Group.',
    s2Text2: 'Browsing the Website confers the status of user and implies full and unreserved acceptance of all provisions included in this Legal Notice.',
    s3Title: '3. Responsibility for Content',
    s3Text1: 'Anclora Group reserves the right to modify, without prior notice, the presentation, configuration, and content of the Website, as well as the conditions required for its access and/or use.',
    s3Text2: 'Photographs, renders, and property descriptions are for guidance only and may not exactly match reality. We recommend verifying all information directly with our agents.',
    s3Text3: 'Anclora Group does NOT guarantee:',
    s3list1: 'The accuracy, updating, completeness, or truthfulness of the content',
    s3list2: 'The absence of errors in such content',
    s3list3: 'The uninterrupted availability of the Website',
    s3list4: 'The absence of viruses, malware, or other harmful elements',
    s4Title: '4. Real Estate Property Information',
    s41Title: '4.1 Prices',
    s41Text1: 'All published prices are subject to change without prior notice and must be confirmed directly with Anclora Group before any commitment.',
    s41Text2: 'Prices do NOT include:',
    pricesNotInclude: 'Prices do NOT include:',
    pni1: 'Applicable taxes (ITP, VAT as appropriate)',
    pni2: 'Notary fees',
    pni3: 'Property registration fees',
    pni4: 'Administrative agency fees',
    pni5: 'Other costs inherent to the purchase',
    estimatedCosts: 'Estimated additional costs: 10-12% of the sale price.',
    s42Title: '4.2 Availability',
    s42Text1: 'Properties may have been sold, withdrawn from the market, or had their price modified without this information being immediately updated on the Website.',
    s42Text2: 'Anclora Group is not responsible for the unavailability of published properties.',
    s43Title: '4.3 Certifications',
    s43Text: 'All properties have a valid Energy Efficiency Certificate, available upon request in accordance with Royal Decree 390/2021.',
    s5Title: '5. Role of Anclora Group',
    s5Text1: 'Anclora Group acts as a professional real estate intermediary between buyers and sellers/developers.',
    s5NotLabel: 'We are NOT:',
    s5not1: 'Regulated financial advisors (CNMV)',
    s5not2: 'Wealth managers',
    s5not3: 'Credit institutions',
    s5not4: 'Tax advisors',
    s5OfferLabel: 'We DO offer:',
    s5offer1: 'Professional intermediation in real estate transactions',
    s5offer2: 'Market information for guidance',
    s5offer3: 'Coordination with independent professionals (lawyers, notaries, agencies)',
    s6Title: '6. Market Data and Investment',
    s61Title: '6.1 Nature of Information',
    s61Text: 'Market data, return projections, and capital appreciation are for INFORMATIONAL PURPOSES ONLY and are based on:',
    s61list1: 'Historical data from public and private sources',
    s61list2: 'Third-party reports (Idealista, Fotocasa, INE, etc.)',
    s61list3: 'Financial institution projections',
    s62Title: '6.2 Absence of Guarantees',
    s62Warning: 'PAST PERFORMANCE DOES NOT GUARANTEE FUTURE RESULTS.',
    s62Text: 'Anclora Group:',
    s62list1: 'Does NOT guarantee any level of return',
    s62list2: 'Does NOT promise specific property revaluation',
    s62list3: 'Does NOT ensure liquidity of real estate assets',
    s62list4: 'Does NOT assume responsibility for losses from investments',
    s63Title: '6.3 Calculators and Tools',
    s63Text1: 'ROI, mortgage, and cost calculators are illustrative tools that use general parameters. Results do NOT constitute personalized financial advice.',
    s63Text2: 'Consult with independent tax, legal, and financial advisors before making any investment decision.',
    s7Title: '7. Intellectual and Industrial Property',
    s7Text1: 'All content on the Website (texts, photographs, graphics, images, technology, software, links, graphic designs, source code, etc.) is the intellectual property of Anclora Private Estates or third parties who have authorized its use.',
    s7ProhibitedLabel: 'Prohibited:',
    s7p1: 'The reproduction, distribution, or public communication of content',
    s7p2: 'The transformation or modification of content',
    s7p3: 'Commercial use without express authorization',
    s7Text2: 'Property photographs are protected by copyright and/or are the property of the owners/developers. Their use is limited to promotion on the Website.',
    s8Title: '8. Links to Third Parties',
    s8Text: 'The Website may contain links to third-party websites. Anclora Group does not control or assume responsibility for the content, privacy policies, or practices of such sites.',
    s9Title: '9. Disclaimer of Warranties and Liability',
    s9Text: 'Anclora Group is not responsible for:',
    privacyPolicy: 'Privacy Policy',
    s10Title: '10. Personal Data Protection',
    s10Text1: 'The processing of personal data is governed by our',
    s11Title: '11. Applicable Law and Jurisdiction',
    s11Text: 'This Legal Notice is governed by Spanish law. For the resolution of any dispute arising from the use of the Website, the parties submit to the Courts and Tribunals of Palma de Mallorca, expressly waiving any other jurisdiction that may correspond to them.',
    contactLabel: 'For inquiries about this Legal Notice:',
  },
  es: {
    backToHome: 'Volver al inicio',
    title: 'Aviso Legal',
    lastUpdated: 'Última actualización: 24 de enero de 2026',
    importantNotice: 'Aviso Importante:',
    importantText: 'La información contenida en este sitio web tiene carácter meramente informativo y no constituye asesoramiento legal, fiscal ni de inversión. Las fotografías y renders de las propiedades pueden no coincidir exactamente con la realidad. Todos los precios están sujetos a cambio sin previo aviso. Anclora Group no se responsabiliza de los errores u omisiones en la información publicada. Verifique toda la información directamente con nuestros agentes antes de tomar cualquier decisión.',
    s1Title: '1. Identificación del Titular',
    s1Intro: 'En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Mallorca, Islas Baleares',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Intermediación inmobiliaria',
    assoc: 'Colegio de Agentes de la Propiedad Inmobiliaria de Baleares',
    apiNumber: 'XXXX',
    s2Title: '2. Objeto y Ámbito',
    s2Text1: 'El presente Aviso Legal regula el uso del sitio web www.ancloraprivateestates.com (en adelante, el «Sitio Web»), titularidad de Anclora Group.',
    s2Text2: 'La navegación por el Sitio Web atribuye la condición de usuario e implica la aceptación plena y sin reservas de todas las disposiciones contenidas en este Aviso Legal.',
    s3Title: '3. Responsabilidad sobre los Contenidos',
    s3Text1: 'Anclora Group se reserva el derecho de modificar, sin previo aviso, la presentación, configuración y contenidos del Sitio Web, así como las condiciones requeridas para su acceso y/o uso.',
    s3Text2: 'Las fotografías, renders y descripciones de los inmuebles son orientativos y pueden no coincidir exactamente con la realidad. Recomendamos verificar toda la información directamente con nuestros agentes.',
    s3Text3: 'Anclora Group NO garantiza:',
    s3list1: 'La exactitud, actualización, exhaustividad o veracidad de los contenidos',
    s3list2: 'La ausencia de errores en dichos contenidos',
    s3list3: 'La disponibilidad ininterrumpida del Sitio Web',
    s3list4: 'La ausencia de virus, malware u otros elementos dañinos',
    s4Title: '4. Información sobre Inmuebles',
    s41Title: '4.1 Precios',
    s41Text1: 'Todos los precios publicados están sujetos a cambio sin previo aviso y deben confirmarse directamente con Anclora Group antes de cualquier compromiso.',
    s41Text2: 'Los precios NO incluyen:',
    pricesNotInclude: 'Los precios NO incluyen:',
    pni1: 'Impuestos aplicables (ITP, IVA según corresponda)',
    pni2: 'Honorarios notariales',
    pni3: 'Gastos de registro de la propiedad',
    pni4: 'Honorarios de gestoría',
    pni5: 'Otros gastos inherentes a la compraventa',
    estimatedCosts: 'Costes adicionales estimados: 10-12% del precio de venta.',
    s42Title: '4.2 Disponibilidad',
    s42Text1: 'Los inmuebles pueden haber sido vendidos, retirados del mercado o haber modificado su precio sin que esta información se actualice de forma inmediata en el Sitio Web.',
    s42Text2: 'Anclora Group no se responsabiliza de la no disponibilidad de los inmuebles publicados.',
    s43Title: '4.3 Certificaciones',
    s43Text: 'Todos los inmuebles disponen de Certificado de Eficiencia Energética vigente, disponible bajo petición de conformidad con el Real Decreto 390/2021.',
    s5Title: '5. Papel de Anclora Group',
    s5Text1: 'Anclora Group actúa como intermediario inmobiliario profesional entre compradores y vendedores/promotores.',
    s5NotLabel: 'NO somos:',
    s5not1: 'Asesores financieros regulados (CNMV)',
    s5not2: 'Gestores de patrimonio',
    s5not3: 'Entidades de crédito',
    s5not4: 'Asesores fiscales',
    s5OfferLabel: 'SÍ ofrecemos:',
    s5offer1: 'Intermediación profesional en operaciones inmobiliarias',
    s5offer2: 'Información de mercado orientativa',
    s5offer3: 'Coordinación con profesionales independientes (abogados, notarios, gestorías)',
    s6Title: '6. Datos de Mercado e Inversión',
    s61Title: '6.1 Naturaleza de la Información',
    s61Text: 'Los datos de mercado, proyecciones de rentabilidad y revalorización tienen carácter meramente INFORMATIVO y se basan en:',
    s61list1: 'Datos históricos de fuentes públicas y privadas',
    s61list2: 'Informes de terceros (Idealista, Fotocasa, INE, etc.)',
    s61list3: 'Proyecciones de entidades financieras',
    s62Title: '6.2 Ausencia de Garantías',
    s62Warning: 'LOS RESULTADOS PASADOS NO GARANTIZAN RESULTADOS FUTUROS.',
    s62Text: 'Anclora Group:',
    s62list1: 'NO garantiza ningún nivel de rentabilidad',
    s62list2: 'NO promete revalorizaciones concretas del inmueble',
    s62list3: 'NO asegura la liquidez de los activos inmobiliarios',
    s62list4: 'NO asume responsabilidad por pérdidas derivadas de inversiones',
    s63Title: '6.3 Calculadoras y Herramientas',
    s63Text1: 'Las calculadoras de ROI, hipoteca y costes son herramientas ilustrativas que utilizan parámetros generales. Los resultados NO constituyen asesoramiento financiero personalizado.',
    s63Text2: 'Consulte con asesores fiscales, legales y financieros independientes antes de tomar cualquier decisión de inversión.',
    s7Title: '7. Propiedad Intelectual e Industrial',
    s7Text1: 'Todos los contenidos del Sitio Web (textos, fotografías, gráficos, imágenes, tecnología, software, enlaces, diseños gráficos, código fuente, etc.) son propiedad intelectual de Anclora Private Estates o de terceros que han autorizado su uso.',
    s7ProhibitedLabel: 'Queda prohibido:',
    s7p1: 'La reproducción, distribución o comunicación pública de los contenidos',
    s7p2: 'La transformación o modificación de los contenidos',
    s7p3: 'El uso comercial sin autorización expresa',
    s7Text2: 'Las fotografías de los inmuebles están protegidas por derechos de autor y/o son propiedad de los titulares/promotores. Su uso queda limitado a la promoción en el Sitio Web.',
    s8Title: '8. Enlaces a Terceros',
    s8Text: 'El Sitio Web puede contener enlaces a sitios web de terceros. Anclora Group no controla ni asume responsabilidad por los contenidos, políticas de privacidad o prácticas de dichos sitios.',
    s9Title: '9. Exclusión de Garantías y Responsabilidad',
    s9Text: 'Anclora Group no se responsabiliza de:',
    privacyPolicy: 'Política de Privacidad',
    s10Title: '10. Protección de Datos Personales',
    s10Text1: 'El tratamiento de los datos personales se rige por nuestra',
    s11Title: '11. Ley Aplicable y Jurisdicción',
    s11Text: 'El presente Aviso Legal se rige por la legislación española. Para la resolución de cualquier controversia derivada del uso del Sitio Web, las partes se someten a los Juzgados y Tribunales de Palma de Mallorca, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.',
    contactLabel: 'Para consultas sobre este Aviso Legal:',
  },
  ca: {
    backToHome: 'Tornar a l\'inici',
    title: 'Avís Legal',
    lastUpdated: 'Darrera actualització: 24 de gener de 2026',
    importantNotice: 'Avís Important:',
    importantText: 'La informació continguda en aquest lloc web té caràcter merament informatiu i no constitueix assessorament legal, fiscal ni d\'inversió. Les fotografies i renders de les propietats poden no coincidir exactament amb la realitat. Tots els preus estan subjectes a canvi sense previ avís. Anclora Group no es responsabilitza dels errors o omissions en la informació publicada. Verifiqueu tota la informació directament amb els nostres agents abans de prendre cap decisió.',
    s1Title: '1. Identificació del Titular',
    s1Intro: 'En compliment de l\'article 10 de la Llei 34/2002, d\'11 de juliol, de Serveis de la Societat de la Informació i de Comerç Electrònic (LSSI-CE), es faciliten les dades següents:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Passeig del Born, 15, 07012 Palma de Mallorca, Illes Balears',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registre Mercantil de Palma de Mallorca, Tom XXXX, Foli XX, Full PM-XXXXX',
    activity: 'Intermediació immobiliària',
    assoc: 'Col·legi d\'Agents de la Propietat Immobiliària de Balears',
    apiNumber: 'XXXX',
    s2Title: '2. Objecte i Àmbit',
    s2Text1: 'Aquest Avís Legal regula l\'ús del lloc web www.ancloraprivateestates.com (d\'ara endavant, el «Lloc Web»), titularitat d\'Anclora Group.',
    s2Text2: 'La navegació pel Lloc Web atorga la condició d\'usuari i implica l\'acceptació plena i sense reserves de totes les disposicions contingudes en aquest Avís Legal.',
    s3Title: '3. Responsabilitat sobre els Continguts',
    s3Text1: 'Anclora Group es reserva el dret de modificar, sense previ avís, la presentació, configuració i continguts del Lloc Web, així com les condicions requerides per al seu accés i/o ús.',
    s3Text2: 'Les fotografies, renders i descripcions dels immobles són orientatius i poden no coincidir exactament amb la realitat. Recomanem verificar tota la informació directament amb els nostres agents.',
    s3Text3: 'Anclora Group NO garanteix:',
    s3list1: 'L\'exactitud, actualització, exhaustivitat o veracitat dels continguts',
    s3list2: 'L\'absència d\'errors en aquests continguts',
    s3list3: 'La disponibilitat ininterrompuda del Lloc Web',
    s3list4: 'L\'absència de virus, malware o altres elements nocius',
    s4Title: '4. Informació sobre Immobles',
    s41Title: '4.1 Preus',
    s41Text1: 'Tots els preus publicats estan subjectes a canvi sense previ avís i s\'han de confirmar directament amb Anclora Group abans de qualsevol compromís.',
    s41Text2: 'Els preus NO inclouen:',
    pricesNotInclude: 'Els preus NO inclouen:',
    pni1: 'Impostos aplicables (ITP, IVA segons correspongui)',
    pni2: 'Honoraris notarials',
    pni3: 'Despeses de registre de la propietat',
    pni4: 'Honoraris de gestoria',
    pni5: 'Altres despeses inherents a la compravenda',
    estimatedCosts: 'Costos addicionals estimats: 10-12% del preu de venda.',
    s42Title: '4.2 Disponibilitat',
    s42Text1: 'Els immobles poden haver estat venuts, retirats del mercat o haver modificat el seu preu sense que aquesta informació s\'actualitzi de forma immediata al Lloc Web.',
    s42Text2: 'Anclora Group no es responsabilitza de la no disponibilitat dels immobles publicats.',
    s43Title: '4.3 Certificacions',
    s43Text: 'Tots els immobles disposen de Certificat d\'Eficiència Energètica vigent, disponible sota petició de conformitat amb el Reial Decret 390/2021.',
    s5Title: '5. Paper d\'Anclora Group',
    s5Text1: 'Anclora Group actua com a intermediari immobiliari professional entre compradors i venedors/promotors.',
    s5NotLabel: 'NO som:',
    s5not1: 'Assessors financers regulats (CNMV)',
    s5not2: 'Gestors de patrimoni',
    s5not3: 'Entitats de crèdit',
    s5not4: 'Assessors fiscals',
    s5OfferLabel: 'SÍ oferim:',
    s5offer1: 'Intermediació professional en operacions immobiliàries',
    s5offer2: 'Informació de mercat orientativa',
    s5offer3: 'Coordinació amb professionals independents (advocats, notaris, gestories)',
    s6Title: '6. Dades de Mercat i Inversió',
    s61Title: '6.1 Naturalesa de la Informació',
    s61Text: 'Les dades de mercat, projeccions de rendibilitat i revalorització tenen caràcter merament INFORMATIU i es basen en:',
    s61list1: 'Dades històriques de fonts públiques i privades',
    s61list2: 'Informes de tercers (Idealista, Fotocasa, INE, etc.)',
    s61list3: 'Projeccions d\'entitats financeres',
    s62Title: '6.2 Absència de Garanties',
    s62Warning: 'ELS RESULTATS PASSATS NO GARANTEIXEN RESULTATS FUTURS.',
    s62Text: 'Anclora Group:',
    s62list1: 'NO garanteix cap nivell de rendibilitat',
    s62list2: 'NO promet revalorizacions concretes de l\'immoble',
    s62list3: 'NO assegura la liquiditat dels actius immobiliaris',
    s62list4: 'NO assumeix responsabilitat per pèrdues derivades d\'inversions',
    s63Title: '6.3 Calculadores i Eines',
    s63Text1: 'Les calculadores de ROI, hipoteca i costos són eines il·lustratives que utilitzen paràmetres generals. Els resultats NO constitueixen assessorament financer personalitzat.',
    s63Text2: 'Consulteu amb assessors fiscals, legals i financers independents abans de prendre cap decisió d\'inversió.',
    s7Title: '7. Propietat Intel·lectual i Industrial',
    s7Text1: 'Tots els continguts del Lloc Web (textos, fotografies, gràfics, imatges, tecnologia, programari, enllaços, dissenys gràfics, codi font, etc.) són propietat intel·lectual d\'Anclora Private Estates o de tercers que n\'han autoritzat l\'ús.',
    s7ProhibitedLabel: 'Queda prohibit:',
    s7p1: 'La reproducció, distribució o comunicació pública dels continguts',
    s7p2: 'La transformació o modificació dels continguts',
    s7p3: 'L\'ús comercial sense autorització expressa',
    s7Text2: 'Les fotografies dels immobles estan protegides per drets d\'autor i/o són propietat dels titulars/promotors. El seu ús queda limitat a la promoció al Lloc Web.',
    s8Title: '8. Enllaços a Tercers',
    s8Text: 'El Lloc Web pot contenir enllaços a llocs web de tercers. Anclora Group no controla ni assumeix responsabilitat pels continguts, polítiques de privacitat o pràctiques d\'aquests llocs.',
    s9Title: '9. Exclusió de Garanties i Responsabilitat',
    s9Text: 'Anclora Group no es responsabilitza de:',
    privacyPolicy: 'Política de Privacitat',
    s10Title: '10. Protecció de Dades Personals',
    s10Text1: 'El tractament de les dades personals es regeix per la nostra',
    s11Title: '11. Llei Aplicable i Jurisdicció',
    s11Text: 'El present Avís Legal es regeix per la legislació espanyola. Per a la resolució de qualsevol controvèrsia derivada de l\'ús del Lloc Web, les parts se sotmeten als Jutjats i Tribunals de Palma de Mallorca, amb renúncia expressa a qualsevol altre fur que pogués correspondre\'ls.',
    contactLabel: 'Per a consultes sobre aquest Avís Legal:',
  },
  de: {
    backToHome: 'Zur Startseite',
    title: 'Impressum / Rechtlicher Hinweis',
    lastUpdated: 'Zuletzt aktualisiert: 24. Januar 2026',
    importantNotice: 'Wichtiger Hinweis:',
    importantText: 'Die auf dieser Website enthaltenen Informationen dienen ausschließlich zu Informationszwecken und stellen keine Rechts-, Steuer- oder Anlageberatung dar. Immobilienfotos und Visualisierungen entsprechen möglicherweise nicht exakt der Realität. Alle Preise können ohne Vorankündigung geändert werden. Anclora Group haftet nicht für Fehler oder Auslassungen in den veröffentlichten Informationen. Bitte verifizieren Sie alle Informationen direkt bei unseren Agenten, bevor Sie Entscheidungen treffen.',
    s1Title: '1. Angaben zum Betreiber',
    s1Intro: 'In Übereinstimmung mit Artikel 10 des Gesetzes 34/2002 vom 11. Juli über Dienste der Informationsgesellschaft und den elektronischen Geschäftsverkehr (LSSI-CE) werden folgende Angaben bereitgestellt:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Mallorca, Islas Baleares',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Immobilienvermittlung',
    assoc: 'Berufsverband der Immobilienmakler der Balearen',
    apiNumber: 'XXXX',
    s2Title: '2. Zweck und Geltungsbereich',
    s2Text1: 'Dieser Rechtliche Hinweis regelt die Nutzung der Website www.ancloraprivateestates.com (nachfolgend „Website"), die Eigentum der Anclora Group ist.',
    s2Text2: 'Das Surfen auf der Website verleiht den Status eines Nutzers und impliziert die vollständige und vorbehaltlose Annahme aller Bestimmungen dieses Rechtlichen Hinweises.',
    s3Title: '3. Haftung für Inhalte',
    s3Text1: 'Anclora Group behält sich das Recht vor, ohne vorherige Ankündigung die Darstellung, Konfiguration und Inhalte der Website sowie die für den Zugang und/oder die Nutzung erforderlichen Bedingungen zu ändern.',
    s3Text2: 'Fotos, Visualisierungen und Immobilienbeschreibungen sind orientierend und entsprechen möglicherweise nicht exakt der Realität. Wir empfehlen, alle Informationen direkt bei unseren Agenten zu verifizieren.',
    s3Text3: 'Anclora Group garantiert NICHT:',
    s3list1: 'Die Richtigkeit, Aktualität, Vollständigkeit oder Wahrhaftigkeit der Inhalte',
    s3list2: 'Das Fehlen von Fehlern in diesen Inhalten',
    s3list3: 'Die ununterbrochene Verfügbarkeit der Website',
    s3list4: 'Das Fehlen von Viren, Malware oder anderen schädlichen Elementen',
    s4Title: '4. Immobilieninformationen',
    s41Title: '4.1 Preise',
    s41Text1: 'Alle veröffentlichten Preise können ohne vorherige Ankündigung geändert werden und müssen vor jeder Verpflichtung direkt mit Anclora Group bestätigt werden.',
    s41Text2: 'Preise beinhalten NICHT:',
    pricesNotInclude: 'Preise beinhalten NICHT:',
    pni1: 'Anfallende Steuern (ITP, MwSt. je nach Anwendbarkeit)',
    pni2: 'Notargebühren',
    pni3: 'Grundbucheintragungsgebühren',
    pni4: 'Verwaltungsgebühren',
    pni5: 'Sonstige beim Kauf anfallende Kosten',
    estimatedCosts: 'Geschätzte zusätzliche Kosten: 10-12% des Verkaufspreises.',
    s42Title: '4.2 Verfügbarkeit',
    s42Text1: 'Immobilien können verkauft, vom Markt zurückgezogen oder im Preis geändert worden sein, ohne dass diese Information sofort auf der Website aktualisiert wird.',
    s42Text2: 'Anclora Group haftet nicht für die Nichtverfügbarkeit veröffentlichter Immobilien.',
    s43Title: '4.3 Zertifizierungen',
    s43Text: 'Alle Immobilien verfügen über einen gültigen Energieeffizienzausweis, der auf Anfrage gemäß Königlichem Erlass 390/2021 erhältlich ist.',
    s5Title: '5. Rolle der Anclora Group',
    s5Text1: 'Anclora Group fungiert als professioneller Immobilienvermittler zwischen Käufern und Verkäufern/Entwicklern.',
    s5NotLabel: 'Wir sind NICHT:',
    s5not1: 'Regulierte Finanzberater (CNMV)',
    s5not2: 'Vermögensverwalter',
    s5not3: 'Kreditinstitute',
    s5not4: 'Steuerberater',
    s5OfferLabel: 'Wir BIETEN:',
    s5offer1: 'Professionelle Vermittlung bei Immobilientransaktionen',
    s5offer2: 'Orientierungs-Marktinformationen',
    s5offer3: 'Koordination mit unabhängigen Fachleuten (Rechtsanwälten, Notaren, Agenturen)',
    s6Title: '6. Marktdaten und Investitionen',
    s61Title: '6.1 Art der Informationen',
    s61Text: 'Marktdaten, Renditeprognosen und Wertsteigerungen dienen ausschließlich zu INFORMATIONSZWECKEN und basieren auf:',
    s61list1: 'Historischen Daten aus öffentlichen und privaten Quellen',
    s61list2: 'Berichten Dritter (Idealista, Fotocasa, INE usw.)',
    s61list3: 'Prognosen von Finanzinstituten',
    s62Title: '6.2 Keine Garantien',
    s62Warning: 'VERGANGENE WERTENTWICKLUNGEN SIND KEIN INDIKATOR FÜR ZUKÜNFTIGE ERGEBNISSE.',
    s62Text: 'Anclora Group:',
    s62list1: 'GARANTIERT kein Renditeniveau',
    s62list2: 'VERSPRICHT keine spezifische Immobilienwertsteigerung',
    s62list3: 'STELLT keine Liquidität von Immobilienaktiva sicher',
    s62list4: 'ÜBERNIMMT keine Verantwortung für Verluste aus Investitionen',
    s63Title: '6.3 Rechner und Tools',
    s63Text1: 'ROI-, Hypotheken- und Kostenrechner sind illustrative Werkzeuge, die allgemeine Parameter verwenden. Die Ergebnisse stellen KEINE personalisierte Finanzberatung dar.',
    s63Text2: 'Konsultieren Sie unabhängige Steuer-, Rechts- und Finanzberater, bevor Sie Investitionsentscheidungen treffen.',
    s7Title: '7. Geistiges und gewerbliches Eigentum',
    s7Text1: 'Alle Inhalte der Website (Texte, Fotografien, Grafiken, Bilder, Technologie, Software, Links, Grafikdesigns, Quellcode usw.) sind geistiges Eigentum von Anclora Private Estates oder Dritter, die ihre Nutzung genehmigt haben.',
    s7ProhibitedLabel: 'Verboten:',
    s7p1: 'Die Reproduktion, Verbreitung oder öffentliche Übermittlung von Inhalten',
    s7p2: 'Die Transformation oder Veränderung von Inhalten',
    s7p3: 'Kommerzielle Nutzung ohne ausdrückliche Genehmigung',
    s7Text2: 'Immobilienfotos sind urheberrechtlich geschützt und/oder Eigentum der Eigentümer/Entwickler. Ihre Verwendung ist auf die Werbung auf der Website beschränkt.',
    s8Title: '8. Links zu Dritten',
    s8Text: 'Die Website kann Links zu Websites Dritter enthalten. Anclora Group kontrolliert nicht und übernimmt keine Verantwortung für die Inhalte, Datenschutzrichtlinien oder Praktiken solcher Websites.',
    s9Title: '9. Haftungsausschluss',
    s9Text: 'Anclora Group haftet nicht für:',
    privacyPolicy: 'Datenschutzerklärung',
    s10Title: '10. Schutz personenbezogener Daten',
    s10Text1: 'Die Verarbeitung personenbezogener Daten richtet sich nach unserer',
    s11Title: '11. Anwendbares Recht und Gerichtsstand',
    s11Text: 'Dieser Rechtliche Hinweis unterliegt spanischem Recht. Für die Beilegung etwaiger Streitigkeiten aus der Nutzung der Website unterwerfen sich die Parteien den Gerichten von Palma de Mallorca und verzichten ausdrücklich auf jeden anderen zuständigen Gerichtsstand.',
    contactLabel: 'Für Anfragen zu diesem Rechtlichen Hinweis:',
  },
  sv: {
    backToHome: 'Tillbaka till startsidan',
    title: 'Juridiskt meddelande',
    lastUpdated: 'Senast uppdaterad: 24 januari 2026',
    importantNotice: 'Viktigt meddelande:',
    importantText: 'Informationen på denna webbplats är enbart för informationsändamål och utgör inte juridisk, skattemässig eller investeringsrådgivning. Fastighetsfotografier och visualiseringar kanske inte exakt stämmer överens med verkligheten. Alla priser kan ändras utan föregående meddelande. Anclora Group ansvarar inte för fel eller utelämnanden i den publicerade informationen. Kontrollera all information direkt med våra agenter innan du fattar några beslut.',
    s1Title: '1. Identifiering av ägaren',
    s1Intro: 'I enlighet med artikel 10 i lag 34/2002 av den 11 juli om informationssamhällets tjänster och elektronisk handel (LSSI-CE) lämnas följande uppgifter:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Mallorca, Islas Baleares',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Fastighetsmäkling',
    assoc: 'Fastighetsmäklarförbundet på Balearerna',
    apiNumber: 'XXXX',
    s2Title: '2. Syfte och tillämpningsområde',
    s2Text1: 'Detta juridiska meddelande reglerar användningen av webbplatsen www.ancloraprivateestates.com (nedan kallad "Webbplatsen"), ägd av Anclora Group.',
    s2Text2: 'Att surfa på Webbplatsen ger status som användare och innebär fullt och förbehållslöst godkännande av alla bestämmelser i detta juridiska meddelande.',
    s3Title: '3. Ansvar för innehåll',
    s3Text1: 'Anclora Group förbehåller sig rätten att utan föregående meddelande ändra presentation, konfiguration och innehåll på Webbplatsen samt de villkor som krävs för åtkomst och/eller användning.',
    s3Text2: 'Fotografier, visualiseringar och fastighetsbeskrivningar är vägledande och kanske inte exakt stämmer överens med verkligheten. Vi rekommenderar att all information kontrolleras direkt med våra agenter.',
    s3Text3: 'Anclora Group GARANTERAR INTE:',
    s3list1: 'Riktigheten, aktualiteten, fullständigheten eller sanningsenligheten i innehållet',
    s3list2: 'Avsaknaden av fel i sådant innehåll',
    s3list3: 'Oavbruten tillgänglighet till Webbplatsen',
    s3list4: 'Avsaknaden av virus, skadlig programvara eller andra skadliga element',
    s4Title: '4. Information om fastigheter',
    s41Title: '4.1 Priser',
    s41Text1: 'Alla publicerade priser kan ändras utan föregående meddelande och måste bekräftas direkt med Anclora Group innan något åtagande.',
    s41Text2: 'Priser inkluderar INTE:',
    pricesNotInclude: 'Priser inkluderar INTE:',
    pni1: 'Tillämpliga skatter (ITP, moms beroende på fall)',
    pni2: 'Notariearvoden',
    pni3: 'Fastighetsregistreringsavgifter',
    pni4: 'Administrativa avgifter',
    pni5: 'Andra kostnader som är inneboende i köpet',
    estimatedCosts: 'Uppskattade tillkommande kostnader: 10-12% av försäljningspriset.',
    s42Title: '4.2 Tillgänglighet',
    s42Text1: 'Fastigheter kan ha sålts, dragits tillbaka från marknaden eller fått sitt pris ändrat utan att denna information omedelbart uppdateras på Webbplatsen.',
    s42Text2: 'Anclora Group ansvarar inte för otillgänglighet av publicerade fastigheter.',
    s43Title: '4.3 Certifieringar',
    s43Text: 'Alla fastigheter har ett giltigt energieffektivitetsintyg, tillgängligt på begäran i enlighet med kunglig förordning 390/2021.',
    s5Title: '5. Anclora Groups roll',
    s5Text1: 'Anclora Group fungerar som professionell fastighetsmäklare mellan köpare och säljare/utvecklare.',
    s5NotLabel: 'Vi är INTE:',
    s5not1: 'Reglerade finansiella rådgivare (CNMV)',
    s5not2: 'Förmögenhetsförvaltare',
    s5not3: 'Kreditinstitut',
    s5not4: 'Skatterådgivare',
    s5OfferLabel: 'Vi ERBJUDER:',
    s5offer1: 'Professionell förmedling vid fastighetstransaktioner',
    s5offer2: 'Vägledande marknadsinformation',
    s5offer3: 'Samordning med oberoende yrkesverksamma (advokater, notarier, byråer)',
    s6Title: '6. Marknadsdata och investeringar',
    s61Title: '6.1 Informationens karaktär',
    s61Text: 'Marknadsdata, avkastningsprognoser och värdeökning är enbart för INFORMATIONSÄNDAMÅL och baseras på:',
    s61list1: 'Historiska data från offentliga och privata källor',
    s61list2: 'Rapporter från tredje parter (Idealista, Fotocasa, INE osv.)',
    s61list3: 'Prognoser från finansinstitut',
    s62Title: '6.2 Avsaknad av garantier',
    s62Warning: 'HISTORISK AVKASTNING GARANTERAR INTE FRAMTIDA RESULTAT.',
    s62Text: 'Anclora Group:',
    s62list1: 'GARANTERAR ingen avkastningsnivå',
    s62list2: 'LOVAR inga specifika fastighetsuppskattningar',
    s62list3: 'SÄKERSTÄLLER inte likviditet i fastighetstillgångar',
    s62list4: 'TAR INTE ansvar för förluster från investeringar',
    s63Title: '6.3 Kalkylatorer och verktyg',
    s63Text1: 'ROI-, bolåne- och kostnadskalkylatorer är illustrativa verktyg som använder allmänna parametrar. Resultaten utgör INTE personlig finansiell rådgivning.',
    s63Text2: 'Konsultera oberoende skatte-, juridiska och finansiella rådgivare innan du fattar investeringsbeslut.',
    s7Title: '7. Immateriell och industriell äganderätt',
    s7Text1: 'Allt innehåll på Webbplatsen (texter, fotografier, grafik, bilder, teknik, programvara, länkar, grafisk design, källkod osv.) är immateriell egendom tillhörande Anclora Private Estates eller tredje parter som har godkänt dess användning.',
    s7ProhibitedLabel: 'Förbjudet:',
    s7p1: 'Reproduktion, distribution eller offentliggörande av innehåll',
    s7p2: 'Transformation eller modifiering av innehåll',
    s7p3: 'Kommersiell användning utan uttryckligt tillstånd',
    s7Text2: 'Fastighetsfotografier är upphovsrättsligt skyddade och/eller ägs av ägarna/utvecklarna. Deras användning är begränsad till marknadsföring på Webbplatsen.',
    s8Title: '8. Länkar till tredje parter',
    s8Text: 'Webbplatsen kan innehålla länkar till tredjepartswebbplatser. Anclora Group kontrollerar inte och tar inget ansvar för innehåll, integritetspolicyer eller praxis på sådana webbplatser.',
    s9Title: '9. Friskrivning från garantier och ansvar',
    s9Text: 'Anclora Group ansvarar inte för:',
    privacyPolicy: 'Integritetspolicy',
    s10Title: '10. Skydd av personuppgifter',
    s10Text1: 'Behandlingen av personuppgifter regleras av vår',
    s11Title: '11. Tillämplig lag och jurisdiktion',
    s11Text: 'Detta juridiska meddelande regleras av spansk lag. För att lösa eventuella tvister som uppstår från användningen av Webbplatsen underkastar sig parterna domstolarna i Palma de Mallorca och avsäger sig uttryckligen varje annan jurisdiktion.',
    contactLabel: 'För frågor om detta juridiska meddelande:',
  },
  fr: {
    backToHome: 'Retour à l\'accueil',
    title: 'Mentions légales',
    lastUpdated: 'Dernière mise à jour : 24 janvier 2026',
    importantNotice: 'Avis important :',
    importantText: 'Les informations contenues sur ce site web sont fournies à titre purement informatif et ne constituent pas un conseil juridique, fiscal ou en investissement. Les photographies et rendus de propriétés peuvent ne pas correspondre exactement à la réalité. Tous les prix sont susceptibles de modification sans préavis. Anclora Group décline toute responsabilité pour les erreurs ou omissions dans les informations publiées. Veuillez vérifier toutes les informations directement auprès de nos agents avant toute prise de décision.',
    s1Title: '1. Identification du propriétaire',
    s1Intro: 'Conformément à l\'article 10 de la loi 34/2002 du 11 juillet relative aux services de la société de l\'information et au commerce électronique (LSSI-CE), les informations suivantes sont fournies :',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Majorque, Îles Baléares',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Intermédiation immobilière',
    assoc: 'Collège des agents immobiliers des Baléares',
    apiNumber: 'XXXX',
    s2Title: '2. Objet et portée',
    s2Text1: 'Les présentes mentions légales régissent l\'utilisation du site web www.ancloraprivateestates.com (ci-après le « Site »), propriété d\'Anclora Group.',
    s2Text2: 'La navigation sur le Site confère la qualité d\'utilisateur et implique l\'acceptation pleine et entière, sans réserve, de toutes les dispositions des présentes mentions légales.',
    s3Title: '3. Responsabilité éditoriale',
    s3Text1: 'Anclora Group se réserve le droit de modifier, sans préavis, la présentation, la configuration et le contenu du Site, ainsi que les conditions requises pour y accéder et/ou l\'utiliser.',
    s3Text2: 'Les photographies, rendus et descriptions de biens sont indicatifs et peuvent ne pas correspondre exactement à la réalité. Nous recommandons de vérifier toutes les informations directement auprès de nos agents.',
    s3Text3: 'Anclora Group ne garantit PAS :',
    s3list1: 'L\'exactitude, l\'actualité, l\'exhaustivité ou la véracité des contenus',
    s3list2: 'L\'absence d\'erreurs dans ces contenus',
    s3list3: 'La disponibilité ininterrompue du Site',
    s3list4: 'L\'absence de virus, de logiciels malveillants ou d\'autres éléments nuisibles',
    s4Title: '4. Informations sur les biens immobiliers',
    s41Title: '4.1 Prix',
    s41Text1: 'Tous les prix publiés sont susceptibles de modification sans préavis et doivent être confirmés directement auprès d\'Anclora Group avant tout engagement.',
    s41Text2: 'Les prix N\'incluent PAS :',
    pricesNotInclude: 'Les prix N\'incluent PAS :',
    pni1: 'Les taxes applicables (ITP, TVA selon le cas)',
    pni2: 'Les honoraires notariaux',
    pni3: 'Les frais d\'enregistrement foncier',
    pni4: 'Les honoraires d\'agence administrative',
    pni5: 'Les autres frais inhérents à l\'acquisition',
    estimatedCosts: 'Frais supplémentaires estimés : 10 à 12 % du prix de vente.',
    s42Title: '4.2 Disponibilité',
    s42Text1: 'Des biens peuvent avoir été vendus, retirés du marché ou avoir fait l\'objet d\'une modification de prix sans que cette information soit immédiatement mise à jour sur le Site.',
    s42Text2: 'Anclora Group n\'est pas responsable de l\'indisponibilité des biens publiés.',
    s43Title: '4.3 Certifications',
    s43Text: 'Tous les biens disposent d\'un Certificat de Performance Énergétique en cours de validité, disponible sur demande conformément au Décret royal 390/2021.',
    s5Title: '5. Rôle d\'Anclora Group',
    s5Text1: 'Anclora Group intervient en tant qu\'intermédiaire immobilier professionnel entre acheteurs et vendeurs/promoteurs.',
    s5NotLabel: 'Nous NE sommes PAS :',
    s5not1: 'Conseillers financiers réglementés (CNMV)',
    s5not2: 'Gestionnaires de patrimoine',
    s5not3: 'Établissements de crédit',
    s5not4: 'Conseillers fiscaux',
    s5OfferLabel: 'Nous OFFRONS :',
    s5offer1: 'Intermédiation professionnelle dans les transactions immobilières',
    s5offer2: 'Informations de marché à titre indicatif',
    s5offer3: 'Coordination avec des professionnels indépendants (avocats, notaires, agences)',
    s6Title: '6. Données de marché et investissement',
    s61Title: '6.1 Nature des informations',
    s61Text: 'Les données de marché, projections de rendement et plus-values sont fournies à titre purement INFORMATIF et sont fondées sur :',
    s61list1: 'Des données historiques provenant de sources publiques et privées',
    s61list2: 'Des rapports de tiers (Idealista, Fotocasa, INE, etc.)',
    s61list3: 'Des projections d\'institutions financières',
    s62Title: '6.2 Absence de garanties',
    s62Warning: 'LES PERFORMANCES PASSÉES NE GARANTISSENT PAS LES RÉSULTATS FUTURS.',
    s62Text: 'Anclora Group :',
    s62list1: 'NE garantit aucun niveau de rendement',
    s62list2: 'NE promet pas de plus-value spécifique sur les biens',
    s62list3: 'N\'assure pas la liquidité des actifs immobiliers',
    s62list4: 'N\'assume pas la responsabilité des pertes découlant d\'investissements',
    s63Title: '6.3 Calculateurs et outils',
    s63Text1: 'Les calculateurs de ROI, de prêt hypothécaire et de coûts sont des outils illustratifs utilisant des paramètres généraux. Les résultats ne constituent PAS un conseil financier personnalisé.',
    s63Text2: 'Consultez des conseillers fiscaux, juridiques et financiers indépendants avant toute décision d\'investissement.',
    s7Title: '7. Propriété intellectuelle et industrielle',
    s7Text1: 'Tous les contenus du Site (textes, photographies, graphiques, images, technologies, logiciels, liens, design graphique, code source, etc.) sont la propriété intellectuelle d\'Anclora Private Estates ou de tiers ayant autorisé leur utilisation.',
    s7ProhibitedLabel: 'Sont interdits :',
    s7p1: 'La reproduction, distribution ou communication publique des contenus',
    s7p2: 'La transformation ou modification des contenus',
    s7p3: 'L\'utilisation commerciale sans autorisation expresse',
    s7Text2: 'Les photographies de biens sont protégées par le droit d\'auteur et/ou sont la propriété des propriétaires/promoteurs. Leur utilisation est limitée à la promotion sur le Site.',
    s8Title: '8. Liens vers des tiers',
    s8Text: 'Le Site peut contenir des liens vers des sites tiers. Anclora Group ne contrôle pas et n\'assume aucune responsabilité concernant le contenu, les politiques de confidentialité ou les pratiques de ces sites.',
    s9Title: '9. Exclusion de garanties et de responsabilité',
    s9Text: 'Anclora Group n\'est pas responsable :',
    privacyPolicy: 'Politique de confidentialité',
    s10Title: '10. Protection des données personnelles',
    s10Text1: 'Le traitement des données personnelles est régi par notre',
    s11Title: '11. Loi applicable et juridiction compétente',
    s11Text: 'Les présentes mentions légales sont régies par le droit espagnol. Pour le règlement de tout litige lié à l\'utilisation du Site, les parties se soumettent aux tribunaux de Palma de Majorque, renonçant expressément à tout autre for compétent.',
    contactLabel: 'Pour toute question relative aux présentes mentions légales :',
  },
  it: {
    backToHome: 'Torna alla home',
    title: 'Note Legali',
    lastUpdated: 'Ultimo aggiornamento: 24 gennaio 2026',
    importantNotice: 'Avviso Importante:',
    importantText: 'Le informazioni contenute in questo sito web hanno carattere puramente informativo e non costituiscono consulenza legale, fiscale né in materia di investimenti. Le fotografie e i rendering delle proprietà potrebbero non corrispondere esattamente alla realtà. Tutti i prezzi sono soggetti a variazione senza preavviso. Anclora Group non è responsabile per errori o omissioni nelle informazioni pubblicate. Si prega di verificare tutte le informazioni direttamente con i nostri agenti prima di prendere qualsiasi decisione.',
    s1Title: '1. Identificazione del Titolare',
    s1Intro: 'In conformità all\'articolo 10 della legge 34/2002 dell\'11 luglio sui servizi della società dell\'informazione e il commercio elettronico (LSSI-CE), si forniscono le seguenti informazioni:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Mallorca, Isole Baleari',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Intermediazione immobiliare',
    assoc: 'Collegio degli Agenti Immobiliari delle Baleari',
    apiNumber: 'XXXX',
    s2Title: '2. Oggetto e Ambito',
    s2Text1: 'Le presenti note legali regolano l\'utilizzo del sito web www.ancloraprivateestates.com (di seguito il «Sito»), di proprietà di Anclora Group.',
    s2Text2: 'La navigazione sul Sito conferisce la qualità di utente e implica la piena e incondizionata accettazione di tutte le disposizioni contenute nelle presenti note legali.',
    s3Title: '3. Responsabilità sui Contenuti',
    s3Text1: 'Anclora Group si riserva il diritto di modificare, senza preavviso, la presentazione, la configurazione e i contenuti del Sito, nonché le condizioni richieste per il suo accesso e/o utilizzo.',
    s3Text2: 'Le fotografie, i rendering e le descrizioni degli immobili hanno carattere orientativo e potrebbero non corrispondere esattamente alla realtà. Si raccomanda di verificare tutte le informazioni direttamente con i nostri agenti.',
    s3Text3: 'Anclora Group NON garantisce:',
    s3list1: 'L\'esattezza, l\'aggiornamento, la completezza o la veridicità dei contenuti',
    s3list2: 'L\'assenza di errori in tali contenuti',
    s3list3: 'La disponibilità ininterrotta del Sito',
    s3list4: 'L\'assenza di virus, malware o altri elementi dannosi',
    s4Title: '4. Informazioni sugli Immobili',
    s41Title: '4.1 Prezzi',
    s41Text1: 'Tutti i prezzi pubblicati sono soggetti a variazione senza preavviso e devono essere confermati direttamente con Anclora Group prima di qualsiasi impegno.',
    s41Text2: 'I prezzi NON includono:',
    pricesNotInclude: 'I prezzi NON includono:',
    pni1: 'Imposte applicabili (ITP, IVA secondo il caso)',
    pni2: 'Onorari notarili',
    pni3: 'Spese di registrazione immobiliare',
    pni4: 'Onorari di agenzia amministrativa',
    pni5: 'Altri costi inerenti all\'acquisto',
    estimatedCosts: 'Costi aggiuntivi stimati: 10-12% del prezzo di vendita.',
    s42Title: '4.2 Disponibilità',
    s42Text1: 'Gli immobili potrebbero essere stati venduti, ritirati dal mercato o aver subito una variazione di prezzo senza che tale informazione venga immediatamente aggiornata sul Sito.',
    s42Text2: 'Anclora Group non è responsabile dell\'indisponibilità degli immobili pubblicati.',
    s43Title: '4.3 Certificazioni',
    s43Text: 'Tutti gli immobili dispongono di un Attestato di Prestazione Energetica in corso di validità, disponibile su richiesta in conformità con il Decreto Reale 390/2021.',
    s5Title: '5. Ruolo di Anclora Group',
    s5Text1: 'Anclora Group opera come intermediario immobiliare professionale tra acquirenti e venditori/promotori.',
    s5NotLabel: 'NON siamo:',
    s5not1: 'Consulenti finanziari regolamentati (CNMV)',
    s5not2: 'Gestori patrimoniali',
    s5not3: 'Istituti di credito',
    s5not4: 'Consulenti fiscali',
    s5OfferLabel: 'OFFRIAMO:',
    s5offer1: 'Intermediazione professionale nelle transazioni immobiliari',
    s5offer2: 'Informazioni di mercato a carattere orientativo',
    s5offer3: 'Coordinamento con professionisti indipendenti (avvocati, notai, agenzie)',
    s6Title: '6. Dati di Mercato e Investimento',
    s61Title: '6.1 Natura delle Informazioni',
    s61Text: 'I dati di mercato, le proiezioni di rendimento e la rivalutazione del capitale hanno carattere puramente INFORMATIVO e si basano su:',
    s61list1: 'Dati storici da fonti pubbliche e private',
    s61list2: 'Report di terze parti (Idealista, Fotocasa, INE, ecc.)',
    s61list3: 'Proiezioni di istituti finanziari',
    s62Title: '6.2 Assenza di Garanzie',
    s62Warning: 'I RISULTATI PASSATI NON GARANTISCONO RISULTATI FUTURI.',
    s62Text: 'Anclora Group:',
    s62list1: 'NON garantisce alcun livello di rendimento',
    s62list2: 'NON promette specifiche rivalutazioni dell\'immobile',
    s62list3: 'NON assicura la liquidità degli asset immobiliari',
    s62list4: 'NON assume responsabilità per perdite derivanti da investimenti',
    s63Title: '6.3 Calcolatori e Strumenti',
    s63Text1: 'I calcolatori di ROI, mutuo e costi sono strumenti illustrativi che utilizzano parametri generali. I risultati NON costituiscono consulenza finanziaria personalizzata.',
    s63Text2: 'Consultare consulenti fiscali, legali e finanziari indipendenti prima di prendere qualsiasi decisione di investimento.',
    s7Title: '7. Proprietà Intellettuale e Industriale',
    s7Text1: 'Tutti i contenuti del Sito (testi, fotografie, grafici, immagini, tecnologia, software, link, design grafici, codice sorgente, ecc.) sono proprietà intellettuale di Anclora Private Estates o di terze parti che ne hanno autorizzato l\'uso.',
    s7ProhibitedLabel: 'È vietato:',
    s7p1: 'La riproduzione, distribuzione o comunicazione pubblica dei contenuti',
    s7p2: 'La trasformazione o modifica dei contenuti',
    s7p3: 'L\'uso commerciale senza autorizzazione espressa',
    s7Text2: 'Le fotografie degli immobili sono protette da copyright e/o sono di proprietà dei proprietari/promotori. Il loro utilizzo è limitato alla promozione sul Sito.',
    s8Title: '8. Link a Terze Parti',
    s8Text: 'Il Sito può contenere link a siti web di terze parti. Anclora Group non controlla né assume responsabilità per i contenuti, le politiche sulla privacy o le pratiche di tali siti.',
    s9Title: '9. Esclusione di Garanzie e Responsabilità',
    s9Text: 'Anclora Group non è responsabile per:',
    privacyPolicy: 'Informativa sulla Privacy',
    s10Title: '10. Protezione dei Dati Personali',
    s10Text1: 'Il trattamento dei dati personali è regolato dalla nostra',
    s11Title: '11. Legge applicabile e giurisdizione',
    s11Text: 'Le presenti note legali sono disciplinate dalla legge spagnola. Per la risoluzione di qualsiasi controversia derivante dall\'uso del Sito, le parti si sottomettono ai Tribunali di Palma di Maiorca, rinunciando espressamente a qualsiasi altro foro competente.',
    contactLabel: 'Per domande relative alle presenti note legali:',
  },
  da: {
    backToHome: 'Tilbage til forsiden',
    title: 'Juridisk meddelelse',
    lastUpdated: 'Sidst opdateret: 24. januar 2026',
    importantNotice: 'Vigtigt:',
    importantText: 'Oplysningerne på dette website er udelukkende til orientering og udgør ikke juridisk, skattemæssig eller investeringsrådgivning. Ejendomsfotografier og visualiseringer svarer muligvis ikke nøjagtigt til virkeligheden. Alle priser er med forbehold for ændringer uden varsel. Anclora Group er ikke ansvarlig for fejl eller udeladelser i de offentliggjorte oplysninger. Kontroller alle oplysninger direkte hos vores agenter, inden du træffer beslutninger.',
    s1Title: '1. Identifikation af ejeren',
    s1Intro: 'I overensstemmelse med artikel 10 i lov 34/2002 af 11. juli om informationssamfundstjenester og elektronisk handel (LSSI-CE) gives følgende oplysninger:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Mallorca, Balearerne',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Ejendomsmægling',
    assoc: 'Ejendomsmæglerforeningen på Balearerne',
    apiNumber: 'XXXX',
    s2Title: '2. Formål og anvendelsesområde',
    s2Text1: 'Denne juridiske meddelelse regulerer brugen af websitet www.ancloraprivateestates.com (herefter "Websitet"), ejet af Anclora Group.',
    s2Text2: 'At bruge Websitet medfører brugerstatussen og indebærer fuld og ubetinget accept af alle bestemmelser i denne juridiske meddelelse.',
    s3Title: '3. Ansvar for indhold',
    s3Text1: 'Anclora Group forbeholder sig retten til uden varsel at ændre præsentationen, konfigurationen og indholdet af Websitet samt de betingelser, der kræves for adgang og/eller brug.',
    s3Text2: 'Fotografier, visualiseringer og ejendomsbeskrivelser er vejledende og svarer muligvis ikke nøjagtigt til virkeligheden. Vi anbefaler at verificere alle oplysninger direkte hos vores agenter.',
    s3Text3: 'Anclora Group garanterer IKKE:',
    s3list1: 'Nøjagtighed, aktualitet, fuldstændighed eller sandfærdighed af indholdet',
    s3list2: 'Fraværet af fejl i sådant indhold',
    s3list3: 'Uafbrudt tilgængelighed af Websitet',
    s3list4: 'Fraværet af virus, malware eller andre skadelige elementer',
    s4Title: '4. Information om ejendomme',
    s41Title: '4.1 Priser',
    s41Text1: 'Alle offentliggjorte priser er med forbehold for ændringer uden varsel og skal bekræftes direkte hos Anclora Group inden ethvert tilsagn.',
    s41Text2: 'Priser INKLUDERER IKKE:',
    pricesNotInclude: 'Priser INKLUDERER IKKE:',
    pni1: 'Gældende skatter (ITP, moms alt efter omstændighederne)',
    pni2: 'Notargebyrer',
    pni3: 'Ejendomsregistreringsgebyrer',
    pni4: 'Administrative gebyrer',
    pni5: 'Andre omkostninger forbundet med købet',
    estimatedCosts: 'Estimerede tillægsomkostninger: 10-12% af salgsprisen.',
    s42Title: '4.2 Tilgængelighed',
    s42Text1: 'Ejendomme kan have været solgt, trukket tilbage fra markedet eller have fået ændret deres pris uden at denne information straks opdateres på Websitet.',
    s42Text2: 'Anclora Group er ikke ansvarlig for manglende tilgængelighed af publicerede ejendomme.',
    s43Title: '4.3 Certifikater',
    s43Text: 'Alle ejendomme har et gyldigt energieffektivitetscertifikat, tilgængeligt på anmodning i overensstemmelse med kongelig bekendtgørelse 390/2021.',
    s5Title: '5. Anclora Groups rolle',
    s5Text1: 'Anclora Group fungerer som professionel ejendomsmægler mellem købere og sælgere/udviklere.',
    s5NotLabel: 'Vi er IKKE:',
    s5not1: 'Regulerede finansielle rådgivere (CNMV)',
    s5not2: 'Kapitalforvaltere',
    s5not3: 'Kreditinstitutter',
    s5not4: 'Skatterådgivere',
    s5OfferLabel: 'Vi TILBYDER:',
    s5offer1: 'Professionel formidling ved ejendomstransaktioner',
    s5offer2: 'Vejledende markedsinformation',
    s5offer3: 'Koordinering med uafhængige fagfolk (advokater, notarer, bureauer)',
    s6Title: '6. Markedsdata og investering',
    s61Title: '6.1 Informationens karakter',
    s61Text: 'Markedsdata, afkastprognoser og kapitalvækst er udelukkende til INFORMATIONSFORMÅL og er baseret på:',
    s61list1: 'Historiske data fra offentlige og private kilder',
    s61list2: 'Tredjepartsrapporter (Idealista, Fotocasa, INE osv.)',
    s61list3: 'Prognoser fra finansielle institutioner',
    s62Title: '6.2 Fravær af garantier',
    s62Warning: 'HISTORISKE RESULTATER GARANTERER IKKE FREMTIDIGE RESULTATER.',
    s62Text: 'Anclora Group:',
    s62list1: 'GARANTERER IKKE noget afkastniveau',
    s62list2: 'LOVER IKKE specifik ejendomsopskrivning',
    s62list3: 'SIKRER IKKE likviditet af ejendomsaktiver',
    s62list4: 'PÅTAGER SIG IKKE ansvar for tab fra investeringer',
    s63Title: '6.3 Regnemaskiner og værktøjer',
    s63Text1: 'ROI-, realkreditlåns- og omkostningsberegner er illustrative værktøjer, der anvender generelle parametre. Resultaterne udgør IKKE personaliseret finansiel rådgivning.',
    s63Text2: 'Konsulter uafhængige skatte-, juridiske og finansielle rådgivere, inden du træffer investeringsbeslutninger.',
    s7Title: '7. Intellektuel og industriel ejendomsret',
    s7Text1: 'Alt indhold på Websitet (tekster, fotografier, grafik, billeder, teknologi, software, links, grafisk design, kildekode osv.) er intellektuel ejendom tilhørende Anclora Private Estates eller tredjeparter, der har autoriseret dets brug.',
    s7ProhibitedLabel: 'Forbudt:',
    s7p1: 'Reproduktion, distribution eller offentlig kommunikation af indhold',
    s7p2: 'Transformation eller ændring af indhold',
    s7p3: 'Kommerciel brug uden udtrykkelig tilladelse',
    s7Text2: 'Ejendomsfotografier er beskyttet af ophavsret og/eller ejes af ejerne/udviklerne. Deres brug er begrænset til promovering på Websitet.',
    s8Title: '8. Links til tredjeparter',
    s8Text: 'Websitet kan indeholde links til tredjeparts websites. Anclora Group kontrollerer ikke og påtager sig ikke ansvar for indhold, privatlivspolitikker eller praksis på sådanne sites.',
    s9Title: '9. Fraskrivelse af garantier og ansvar',
    s9Text: 'Anclora Group er ikke ansvarlig for:',
    privacyPolicy: 'Privatlivspolitik',
    s10Title: '10. Beskyttelse af personoplysninger',
    s10Text1: 'Behandlingen af personoplysninger er reguleret af vores',
    s11Title: '11. Gældende ret og værneting',
    s11Text: 'Denne juridiske meddelelse er underlagt spansk ret. For løsning af enhver tvist, der opstår fra brugen af Websitet, underkaster parterne sig domstolene i Palma de Mallorca og giver udtrykkeligt afkald på enhver anden jurisdiktion.',
    contactLabel: 'For spørgsmål om denne juridiske meddelelse:',
  },
  nl: {
    backToHome: 'Terug naar home',
    title: 'Juridische mededeling',
    lastUpdated: 'Laatste update: 24 januari 2026',
    importantNotice: 'Belangrijke mededeling:',
    importantText: 'De informatie op deze website is uitsluitend voor informatieve doeleinden en vormt geen juridisch, fiscaal of beleggingsadvies. Vastgoedfoto\'s en renders komen mogelijk niet exact overeen met de werkelijkheid. Alle prijzen zijn onder voorbehoud van wijzigingen zonder voorafgaande kennisgeving. Anclora Group is niet verantwoordelijk voor fouten of omissies in de gepubliceerde informatie. Verifieer alle informatie rechtstreeks bij onze agenten alvorens beslissingen te nemen.',
    s1Title: '1. Identificatie van de eigenaar',
    s1Intro: 'In overeenstemming met artikel 10 van wet 34/2002 van 11 juli betreffende diensten van de informatiemaatschappij en elektronische handel (LSSI-CE) worden de volgende gegevens verstrekt:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Mallorca, Balearen',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Vastgoedmakelaardij',
    assoc: 'Orde van Vastgoedmakelaars van de Balearen',
    apiNumber: 'XXXX',
    s2Title: '2. Doel en toepassingsgebied',
    s2Text1: 'Deze juridische mededeling regelt het gebruik van de website www.ancloraprivateestates.com (hierna de "Website"), eigendom van Anclora Group.',
    s2Text2: 'Door de Website te bezoeken krijgt u de status van gebruiker en impliceert u volledige en onvoorwaardelijke aanvaarding van alle bepalingen van deze juridische mededeling.',
    s3Title: '3. Verantwoordelijkheid voor inhoud',
    s3Text1: 'Anclora Group behoudt zich het recht voor om zonder voorafgaande kennisgeving de presentatie, configuratie en inhoud van de Website te wijzigen, alsook de vereiste voorwaarden voor toegang en/of gebruik.',
    s3Text2: 'Foto\'s, renders en vastgoedbeschrijvingen zijn indicatief en komen mogelijk niet exact overeen met de werkelijkheid. Wij raden aan alle informatie rechtstreeks bij onze agenten te verifiëren.',
    s3Text3: 'Anclora Group garandeert NIET:',
    s3list1: 'De nauwkeurigheid, actualiteit, volledigheid of waarheidsgetrouwheid van de inhoud',
    s3list2: 'De afwezigheid van fouten in dergelijke inhoud',
    s3list3: 'De ononderbroken beschikbaarheid van de Website',
    s3list4: 'De afwezigheid van virussen, malware of andere schadelijke elementen',
    s4Title: '4. Informatie over vastgoed',
    s41Title: '4.1 Prijzen',
    s41Text1: 'Alle gepubliceerde prijzen zijn onder voorbehoud van wijziging zonder voorafgaande kennisgeving en moeten rechtstreeks bij Anclora Group worden bevestigd vóór enige verplichting.',
    s41Text2: 'Prijzen zijn EXCLUSIEF:',
    pricesNotInclude: 'Prijzen zijn EXCLUSIEF:',
    pni1: 'Van toepassing zijnde belastingen (ITP, btw naargelang het geval)',
    pni2: 'Notariskosten',
    pni3: 'Kosten voor eigendomsregistratie',
    pni4: 'Administratiekosten',
    pni5: 'Andere kosten die inherent zijn aan de aankoop',
    estimatedCosts: 'Geschatte bijkomende kosten: 10-12% van de verkoopprijs.',
    s42Title: '4.2 Beschikbaarheid',
    s42Text1: 'Vastgoedprojecten kunnen verkocht zijn, van de markt zijn gehaald of een prijswijziging hebben ondergaan zonder dat deze informatie onmiddellijk op de Website wordt bijgewerkt.',
    s42Text2: 'Anclora Group is niet verantwoordelijk voor de onbeschikbaarheid van gepubliceerde vastgoedprojecten.',
    s43Title: '4.3 Certificeringen',
    s43Text: 'Alle vastgoedprojecten beschikken over een geldig Energieprestatieattest, op verzoek beschikbaar overeenkomstig Koninklijk Besluit 390/2021.',
    s5Title: '5. Rol van Anclora Group',
    s5Text1: 'Anclora Group treedt op als professionele vastgoedmakelaar tussen kopers en verkopers/ontwikkelaars.',
    s5NotLabel: 'Wij zijn GEEN:',
    s5not1: 'Gereglementeerde financiële adviseurs (CNMV)',
    s5not2: 'Vermogensbeheerders',
    s5not3: 'Kredietinstellingen',
    s5not4: 'Fiscale adviseurs',
    s5OfferLabel: 'Wij BIEDEN:',
    s5offer1: 'Professionele bemiddeling bij vastgoedtransacties',
    s5offer2: 'Indicatieve marktinformatie',
    s5offer3: 'Coördinatie met onafhankelijke professionals (advocaten, notarissen, bureaus)',
    s6Title: '6. Marktgegevens en beleggingen',
    s61Title: '6.1 Aard van de informatie',
    s61Text: 'Marktgegevens, rendementsprojecties en kapitaalgroei zijn UITSLUITEND TER INFORMATIE en zijn gebaseerd op:',
    s61list1: 'Historische gegevens uit publieke en private bronnen',
    s61list2: 'Rapporten van derden (Idealista, Fotocasa, INE, enz.)',
    s61list3: 'Prognoses van financiële instellingen',
    s62Title: '6.2 Afwezigheid van garanties',
    s62Warning: 'HISTORISCHE RESULTATEN GARANDEREN GEEN TOEKOMSTIGE RESULTATEN.',
    s62Text: 'Anclora Group:',
    s62list1: 'GARANDEERT geen rendementspercentage',
    s62list2: 'BELOOFT geen specifieke vastgoedwaardering',
    s62list3: 'WAARBORGT geen liquiditeit van vastgoedactiva',
    s62list4: 'NEEMT geen verantwoordelijkheid voor verliezen uit beleggingen',
    s63Title: '6.3 Rekenmachines en tools',
    s63Text1: 'ROI-, hypotheek- en kostenrekenmachines zijn illustratieve tools die algemene parameters gebruiken. Resultaten vormen GEEN gepersonaliseerd financieel advies.',
    s63Text2: 'Raadpleeg onafhankelijke fiscale, juridische en financiële adviseurs alvorens beleggingsbeslissingen te nemen.',
    s7Title: '7. Intellectuele en industriële eigendom',
    s7Text1: 'Alle inhoud op de Website (teksten, foto\'s, grafieken, afbeeldingen, technologie, software, links, grafisch ontwerp, broncode, enz.) is intellectueel eigendom van Anclora Private Estates of van derden die het gebruik hebben toegestaan.',
    s7ProhibitedLabel: 'Verboden:',
    s7p1: 'De reproductie, verspreiding of openbare mededeling van inhoud',
    s7p2: 'De transformatie of wijziging van inhoud',
    s7p3: 'Commercieel gebruik zonder uitdrukkelijke toestemming',
    s7Text2: 'Vastgoedfoto\'s zijn auteursrechtelijk beschermd en/of eigendom van de eigenaren/ontwikkelaars. Het gebruik ervan is beperkt tot promotie op de Website.',
    s8Title: '8. Links naar derden',
    s8Text: 'De Website kan links naar websites van derden bevatten. Anclora Group controleert niet en neemt geen verantwoordelijkheid voor de inhoud, het privacybeleid of de praktijken van dergelijke sites.',
    s9Title: '9. Uitsluiting van garanties en aansprakelijkheid',
    s9Text: 'Anclora Group is niet verantwoordelijk voor:',
    privacyPolicy: 'Privacybeleid',
    s10Title: '10. Bescherming van persoonsgegevens',
    s10Text1: 'De verwerking van persoonsgegevens wordt geregeld door ons',
    s11Title: '11. Toepasselijk recht en bevoegde rechter',
    s11Text: 'Deze juridische mededeling wordt beheerst door het Spaanse recht. Voor de beslechting van eventuele geschillen voortvloeiend uit het gebruik van de Website onderwerpen de partijen zich aan de rechtbanken van Palma de Mallorca, met uitdrukkelijke afstand van elke andere bevoegde rechtbank.',
    contactLabel: 'Voor vragen over deze juridische mededeling:',
  },
  no: {
    backToHome: 'Tilbake til forsiden',
    title: 'Juridisk merknad',
    lastUpdated: 'Sist oppdatert: 24. januar 2026',
    importantNotice: 'Viktig merknad:',
    importantText: 'Informasjonen på dette nettstedet er utelukkende til informasjonsformål og utgjør ikke juridisk, skattemessig eller investeringsrådgivning. Eiendomsbilder og visualiseringer samsvarer muligens ikke nøyaktig med virkeligheten. Alle priser er med forbehold om endringer uten varsel. Anclora Group er ikke ansvarlig for feil eller utelatelser i den publiserte informasjonen. Kontroller all informasjon direkte med våre agenter før du tar beslutninger.',
    s1Title: '1. Identifikasjon av eieren',
    s1Intro: 'I samsvar med artikkel 10 i lov 10/2010 av 11. juli om informasjonssamfunnstjenester og elektronisk handel (LSSI-CE) gis følgende opplysninger:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Mallorca, Balearene',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Eiendomsmegling',
    assoc: 'Eiendomsmeglerforeningen på Balearene',
    apiNumber: 'XXXX',
    s2Title: '2. Formål og omfang',
    s2Text1: 'Denne juridiske merknaden regulerer bruken av nettstedet www.ancloraprivateestates.com (heretter «Nettstedet»), eid av Anclora Group.',
    s2Text2: 'Å surfe på Nettstedet gir status som bruker og innebærer full og uforbeholden aksept av alle bestemmelser i denne juridiske merknaden.',
    s3Title: '3. Ansvar for innhold',
    s3Text1: 'Anclora Group forbeholder seg retten til uten varsel å endre presentasjonen, konfigurasjonen og innholdet på Nettstedet, samt vilkårene for tilgang og/eller bruk.',
    s3Text2: 'Fotografier, visualiseringer og eiendomsbeskrivelser er veiledende og samsvarer muligens ikke nøyaktig med virkeligheten. Vi anbefaler å verifisere all informasjon direkte med våre agenter.',
    s3Text3: 'Anclora Group GARANTERER IKKE:',
    s3list1: 'Nøyaktighet, aktualitet, fullstendighet eller sannferdighet i innholdet',
    s3list2: 'Fravær av feil i slikt innhold',
    s3list3: 'Uavbrutt tilgjengelighet av Nettstedet',
    s3list4: 'Fravær av virus, skadelig programvare eller andre skadelige elementer',
    s4Title: '4. Informasjon om eiendommer',
    s41Title: '4.1 Priser',
    s41Text1: 'Alle publiserte priser er med forbehold om endringer uten varsel og må bekreftes direkte med Anclora Group før forpliktelse.',
    s41Text2: 'Priser INKLUDERER IKKE:',
    pricesNotInclude: 'Priser INKLUDERER IKKE:',
    pni1: 'Gjeldende skatter (ITP, mva etter omstendighetene)',
    pni2: 'Notargebyrer',
    pni3: 'Eiendomsregistreringsgebyrer',
    pni4: 'Administrative gebyrer',
    pni5: 'Andre kostnader forbundet med kjøpet',
    estimatedCosts: 'Estimerte tilleggskostnader: 10-12% av salgsprisen.',
    s42Title: '4.2 Tilgjengelighet',
    s42Text1: 'Eiendommer kan ha blitt solgt, trukket tilbake fra markedet eller hatt prisen endret uten at denne informasjonen umiddelbart oppdateres på Nettstedet.',
    s42Text2: 'Anclora Group er ikke ansvarlig for manglende tilgjengelighet av publiserte eiendommer.',
    s43Title: '4.3 Sertifiseringer',
    s43Text: 'Alle eiendommer har gyldig Energiytelsesattest, tilgjengelig på forespørsel i samsvar med kongelig dekret 390/2021.',
    s5Title: '5. Anclora Groups rolle',
    s5Text1: 'Anclora Group opptrer som profesjonell eiendomsmegler mellom kjøpere og selgere/utviklere.',
    s5NotLabel: 'Vi er IKKE:',
    s5not1: 'Regulerte finansielle rådgivere (CNMV)',
    s5not2: 'Formuesforvaltere',
    s5not3: 'Kredittinstitusjoner',
    s5not4: 'Skatterådgivere',
    s5OfferLabel: 'Vi TILBYR:',
    s5offer1: 'Profesjonell megling i eiendomstransaksjoner',
    s5offer2: 'Veiledende markedsinformasjon',
    s5offer3: 'Koordinering med uavhengige fagpersoner (advokater, notarer, byråer)',
    s6Title: '6. Markedsdata og investering',
    s61Title: '6.1 Informasjonens karakter',
    s61Text: 'Markedsdata, avkastningsprognoser og kapitalvekst er utelukkende til INFORMASJONSFORMÅL og er basert på:',
    s61list1: 'Historiske data fra offentlige og private kilder',
    s61list2: 'Tredjepartsrapporter (Idealista, Fotocasa, INE osv.)',
    s61list3: 'Prognoser fra finansinstitusjoner',
    s62Title: '6.2 Fravær av garantier',
    s62Warning: 'HISTORISK AVKASTNING GARANTERER IKKE FREMTIDIGE RESULTATER.',
    s62Text: 'Anclora Group:',
    s62list1: 'GARANTERER ikke noe avkastningsnivå',
    s62list2: 'LOVER ikke spesifikk eiendomsverdistigning',
    s62list3: 'SIKRER ikke likviditet av eiendomsaktiva',
    s62list4: 'PÅTAR SEG ikke ansvar for tap fra investeringer',
    s63Title: '6.3 Kalkulatorer og verktøy',
    s63Text1: 'ROI-, boliglåns- og kostnadskalkulatorer er illustrative verktøy som bruker generelle parametere. Resultatene utgjør IKKE personalisert finansiell rådgivning.',
    s63Text2: 'Konsulter uavhengige skatte-, juridiske og finansielle rådgivere før du tar investeringsbeslutninger.',
    s7Title: '7. Immateriell og industriell eiendomsrett',
    s7Text1: 'Alt innhold på Nettstedet (tekster, fotografier, grafikk, bilder, teknologi, programvare, lenker, grafisk design, kildekode osv.) er immateriell eiendom tilhørende Anclora Private Estates eller tredjeparter som har autorisert bruken.',
    s7ProhibitedLabel: 'Forbudt:',
    s7p1: 'Reproduksjon, distribusjon eller offentlig kommunikasjon av innhold',
    s7p2: 'Transformasjon eller endring av innhold',
    s7p3: 'Kommersiell bruk uten uttrykkelig tillatelse',
    s7Text2: 'Eiendomsfotografier er opphavsrettsbeskyttet og/eller eies av eierne/utviklerne. Bruken er begrenset til markedsføring på Nettstedet.',
    s8Title: '8. Lenker til tredjeparter',
    s8Text: 'Nettstedet kan inneholde lenker til tredjeparts nettsteder. Anclora Group kontrollerer ikke og påtar seg ikke ansvar for innhold, personvernpolicyer eller praksis på slike nettsteder.',
    s9Title: '9. Fraskrivelse av garantier og ansvar',
    s9Text: 'Anclora Group er ikke ansvarlig for:',
    privacyPolicy: 'Personvernerklæring',
    s10Title: '10. Beskyttelse av personopplysninger',
    s10Text1: 'Behandlingen av personopplysninger er regulert av vår',
    s11Title: '11. Gjeldende rett og verneting',
    s11Text: 'Denne juridiske merknaden er underlagt spansk rett. For løsning av eventuelle tvister som oppstår fra bruk av Nettstedet, underkaster partene seg domstolene i Palma de Mallorca, med uttrykkelig avkall på enhver annen jurisdiksjon.',
    contactLabel: 'For spørsmål om denne juridiske merknaden:',
  },
  pt: {
    backToHome: 'Voltar ao início',
    title: 'Aviso Legal',
    lastUpdated: 'Última atualização: 24 de janeiro de 2026',
    importantNotice: 'Aviso Importante:',
    importantText: 'A informação contida neste sítio web tem carácter meramente informativo e não constitui aconselhamento jurídico, fiscal nem de investimento. As fotografias e renders das propriedades podem não corresponder exatamente à realidade. Todos os preços estão sujeitos a alteração sem aviso prévio. A Anclora Group não é responsável por erros ou omissões na informação publicada. Verifique toda a informação diretamente com os nossos agentes antes de tomar quaisquer decisões.',
    s1Title: '1. Identificação do Titular',
    s1Intro: 'Em cumprimento do artigo 10.º da Lei 34/2002, de 11 de julho, dos Serviços da Sociedade da Informação e Comércio Eletrónico (LSSI-CE), são fornecidos os seguintes dados:',
    companyName: 'Anclora Group',
    nifCif: 'B-XXXXXXXX',
    registered: 'Paseo del Borne, 15, 07012 Palma de Maiorca, Ilhas Baleares',
    emailLabel: 'legal@ancloraprivateestates.com',
    phoneLabel: '+34 971 000 000',
    registeredIn: 'Registro Mercantil de Palma de Mallorca, Tomo XXXX, Folio XX, Hoja PM-XXXXX',
    activity: 'Intermediação imobiliária',
    assoc: 'Colégio de Agentes da Propriedade Imobiliária das Baleares',
    apiNumber: 'XXXX',
    s2Title: '2. Objeto e Âmbito',
    s2Text1: 'O presente Aviso Legal regula a utilização do sítio web www.ancloraprivateestates.com (doravante o «Sítio Web»), propriedade da Anclora Group.',
    s2Text2: 'A navegação no Sítio Web atribui a condição de utilizador e implica a aceitação plena e sem reservas de todas as disposições contidas neste Aviso Legal.',
    s3Title: '3. Responsabilidade pelos Conteúdos',
    s3Text1: 'A Anclora Group reserva-se o direito de modificar, sem aviso prévio, a apresentação, configuração e conteúdos do Sítio Web, bem como as condições requeridas para o seu acesso e/ou utilização.',
    s3Text2: 'As fotografias, renders e descrições dos imóveis são orientativas e podem não corresponder exatamente à realidade. Recomendamos verificar toda a informação diretamente com os nossos agentes.',
    s3Text3: 'A Anclora Group NÃO garante:',
    s3list1: 'A exatidão, atualização, exaustividade ou veracidade dos conteúdos',
    s3list2: 'A ausência de erros nesses conteúdos',
    s3list3: 'A disponibilidade ininterrupta do Sítio Web',
    s3list4: 'A ausência de vírus, malware ou outros elementos prejudiciais',
    s4Title: '4. Informação sobre Imóveis',
    s41Title: '4.1 Preços',
    s41Text1: 'Todos os preços publicados estão sujeitos a alteração sem aviso prévio e devem ser confirmados diretamente com a Anclora Group antes de qualquer compromisso.',
    s41Text2: 'Os preços NÃO incluem:',
    pricesNotInclude: 'Os preços NÃO incluem:',
    pni1: 'Impostos aplicáveis (ITP, IVA conforme o caso)',
    pni2: 'Honorários notariais',
    pni3: 'Custos de registo predial',
    pni4: 'Honorários de gestoria',
    pni5: 'Outros custos inerentes à compra e venda',
    estimatedCosts: 'Custos adicionais estimados: 10-12% do preço de venda.',
    s42Title: '4.2 Disponibilidade',
    s42Text1: 'Os imóveis podem ter sido vendidos, retirados do mercado ou ter tido o preço alterado sem que essa informação seja imediatamente atualizada no Sítio Web.',
    s42Text2: 'A Anclora Group não é responsável pela indisponibilidade dos imóveis publicados.',
    s43Title: '4.3 Certificações',
    s43Text: 'Todos os imóveis dispõem de Certificado de Desempenho Energético válido, disponível mediante pedido em conformidade com o Decreto Real 390/2021.',
    s5Title: '5. Papel da Anclora Group',
    s5Text1: 'A Anclora Group atua como intermediária imobiliária profissional entre compradores e vendedores/promotores.',
    s5NotLabel: 'NÃO somos:',
    s5not1: 'Consultores financeiros regulados (CNMV)',
    s5not2: 'Gestores de patrimónios',
    s5not3: 'Instituições de crédito',
    s5not4: 'Consultores fiscais',
    s5OfferLabel: 'OFERECEMOS:',
    s5offer1: 'Intermediação profissional em operações imobiliárias',
    s5offer2: 'Informação de mercado orientativa',
    s5offer3: 'Coordenação com profissionais independentes (advogados, notários, gestoras)',
    s6Title: '6. Dados de Mercado e Investimento',
    s61Title: '6.1 Natureza da Informação',
    s61Text: 'Os dados de mercado, projeções de rentabilidade e valorização de capital têm carácter meramente INFORMATIVO e baseiam-se em:',
    s61list1: 'Dados históricos de fontes públicas e privadas',
    s61list2: 'Relatórios de terceiros (Idealista, Fotocasa, INE, etc.)',
    s61list3: 'Projeções de instituições financeiras',
    s62Title: '6.2 Ausência de Garantias',
    s62Warning: 'RESULTADOS PASSADOS NÃO GARANTEM RESULTADOS FUTUROS.',
    s62Text: 'A Anclora Group:',
    s62list1: 'NÃO garante qualquer nível de rentabilidade',
    s62list2: 'NÃO promete valorizações concretas do imóvel',
    s62list3: 'NÃO assegura a liquidez dos ativos imobiliários',
    s62list4: 'NÃO assume responsabilidade por perdas decorrentes de investimentos',
    s63Title: '6.3 Calculadoras e Ferramentas',
    s63Text1: 'As calculadoras de ROI, hipoteca e custos são ferramentas ilustrativas que utilizam parâmetros gerais. Os resultados NÃO constituem aconselhamento financeiro personalizado.',
    s63Text2: 'Consulte consultores fiscais, jurídicos e financeiros independentes antes de tomar qualquer decisão de investimento.',
    s7Title: '7. Propriedade Intelectual e Industrial',
    s7Text1: 'Todos os conteúdos do Sítio Web (textos, fotografias, gráficos, imagens, tecnologia, software, ligações, designs gráficos, código fonte, etc.) são propriedade intelectual da Anclora Private Estates ou de terceiros que autorizaram a sua utilização.',
    s7ProhibitedLabel: 'É proibido:',
    s7p1: 'A reprodução, distribuição ou comunicação pública dos conteúdos',
    s7p2: 'A transformação ou modificação dos conteúdos',
    s7p3: 'A utilização comercial sem autorização expressa',
    s7Text2: 'As fotografias dos imóveis estão protegidas por direitos de autor e/ou são propriedade dos titulares/promotores. A sua utilização fica limitada à promoção no Sítio Web.',
    s8Title: '8. Ligações a Terceiros',
    s8Text: 'O Sítio Web pode conter ligações para sítios web de terceiros. A Anclora Group não controla nem assume responsabilidade pelos conteúdos, políticas de privacidade ou práticas desses sítios.',
    s9Title: '9. Exclusão de Garantias e Responsabilidade',
    s9Text: 'A Anclora Group não é responsável por:',
    privacyPolicy: 'Política de Privacidade',
    s10Title: '10. Proteção de Dados Pessoais',
    s10Text1: 'O tratamento dos dados pessoais é regido pela nossa',
    s11Title: '11. Lei Aplicável e Jurisdição',
    s11Text: 'O presente Aviso Legal é regido pela legislação espanhola. Para a resolução de qualquer litígio decorrente da utilização do Sítio Web, as partes submetem-se aos Tribunais de Palma de Maiorca, com renúncia expressa a qualquer outro foro que lhes possa corresponder.',
    contactLabel: 'Para questões sobre este Aviso Legal:',
  },
};

export function DisclaimerPage() {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) as LocaleKey) in content
    ? (i18n.language.slice(0, 2) as LocaleKey)
    : 'en';
  const c = content[lang] ?? content['en'];

  return (
    <div className="min-h-screen bg-anclora-teal">
      <div className="w-full px-6 lg:px-12 py-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-anclora-gold hover:text-anclora-gold-light transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {c.backToHome}
          </Link>
        </div>
      </div>

      <div className="w-full px-6 lg:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="w-10 h-10 text-anclora-gold" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-anclora-cream">{c.title}</h1>
          </div>
          <p className="text-anclora-text-muted mb-12">{c.lastUpdated}</p>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-anclora-gold/10 rounded-2xl p-8 border border-anclora-gold/30 mb-12">
              <p className="text-anclora-cream leading-relaxed m-0">
                <strong>{c.importantNotice}</strong> {c.importantText}
              </p>
            </div>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s1Title}</h2>
            <p className="text-anclora-text-muted">{c.s1Intro}</p>
            <div className="bg-anclora-teal-bg/50 rounded-2xl p-6 border border-white/10 mt-6">
              <p className="text-anclora-text-muted m-0">
                <strong className="text-anclora-cream">Company name:</strong> {c.companyName}<br />
                <strong className="text-anclora-cream">NIF/CIF:</strong> {c.nifCif}<br />
                <strong className="text-anclora-cream">Registered office:</strong> {c.registered}<br />
                <strong className="text-anclora-cream">Email:</strong>{' '}
                <a href={`mailto:${c.emailLabel}`} className="text-anclora-gold hover:underline">{c.emailLabel}</a><br />
                <strong className="text-anclora-cream">Phone:</strong> {c.phoneLabel}<br />
                <strong className="text-anclora-cream">Registered in:</strong> {c.registeredIn}<br />
                <strong className="text-anclora-cream">Activity:</strong> {c.activity}<br />
                <strong className="text-anclora-cream">Professional Association:</strong> {c.assoc}<br />
                <strong className="text-anclora-cream">API Member Number:</strong> {c.apiNumber}
              </p>
            </div>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s2Title}</h2>
            <p className="text-anclora-text-muted">{c.s2Text1}</p>
            <p className="text-anclora-text-muted">{c.s2Text2}</p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s3Title}</h2>
            <p className="text-anclora-text-muted">{c.s3Text1}</p>
            <p className="text-anclora-text-muted">{c.s3Text2}</p>
            <p className="text-anclora-text-muted">{c.s3Text3}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.s3list1}</li>
              <li>{c.s3list2}</li>
              <li>{c.s3list3}</li>
              <li>{c.s3list4}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s4Title}</h2>
            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s41Title}</h3>
            <p className="text-anclora-text-muted">{c.s41Text1}</p>
            <p className="text-anclora-text-muted">{c.pricesNotInclude}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.pni1}</li><li>{c.pni2}</li><li>{c.pni3}</li><li>{c.pni4}</li><li>{c.pni5}</li>
            </ul>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.estimatedCosts}</strong></p>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s42Title}</h3>
            <p className="text-anclora-text-muted">{c.s42Text1}</p>
            <p className="text-anclora-text-muted">{c.s42Text2}</p>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s43Title}</h3>
            <p className="text-anclora-text-muted">{c.s43Text}</p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s5Title}</h2>
            <p className="text-anclora-text-muted">{c.s5Text1}</p>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.s5NotLabel}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>❌ {c.s5not1}</li><li>❌ {c.s5not2}</li><li>❌ {c.s5not3}</li><li>❌ {c.s5not4}</li>
            </ul>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.s5OfferLabel}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>✅ {c.s5offer1}</li><li>✅ {c.s5offer2}</li><li>✅ {c.s5offer3}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s6Title}</h2>
            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s61Title}</h3>
            <p className="text-anclora-text-muted">{c.s61Text}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.s61list1}</li><li>{c.s61list2}</li><li>{c.s61list3}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s62Title}</h3>
            <div className="bg-anclora-gold/10 rounded-xl p-6 border border-anclora-gold/30">
              <p className="text-anclora-cream font-semibold m-0">{c.s62Warning}</p>
            </div>
            <p className="text-anclora-text-muted mt-4">{c.s62Text}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.s62list1}</li><li>{c.s62list2}</li><li>{c.s62list3}</li><li>{c.s62list4}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s63Title}</h3>
            <p className="text-anclora-text-muted">{c.s63Text1}</p>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.s63Text2}</strong></p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s7Title}</h2>
            <p className="text-anclora-text-muted">{c.s7Text1}</p>
            <p className="text-anclora-text-muted">{c.s7ProhibitedLabel}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.s7p1}</li><li>{c.s7p2}</li><li>{c.s7p3}</li>
            </ul>
            <p className="text-anclora-text-muted">{c.s7Text2}</p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s8Title}</h2>
            <p className="text-anclora-text-muted">{c.s8Text}</p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s9Title}</h2>
            <p className="text-anclora-text-muted">{c.s9Text}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>Errors or omissions in the content</li>
              <li>Lack of availability of the Website</li>
              <li>Damages resulting from the use of the Website</li>
              <li>Computer viruses or harmful elements</li>
              <li>Improper use of the Website by users</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s10Title}</h2>
            <p className="text-anclora-text-muted">
              {c.s10Text1}{' '}
              <Link to="/legal/privacidad" className="text-anclora-gold hover:underline">
                {c.privacyPolicy}
              </Link>.
            </p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s11Title}</h2>
            <p className="text-anclora-text-muted">{c.s11Text}</p>

            <div className="border-t border-white/10 pt-8 mt-12">
              <p className="text-anclora-text-muted">
                <strong className="text-anclora-cream">{c.contactLabel}</strong><br />
                📧 <a href="mailto:legal@ancloraprivateestates.com" className="text-anclora-gold hover:underline">legal@ancloraprivateestates.com</a><br />
                📞 +34 971 000 000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
