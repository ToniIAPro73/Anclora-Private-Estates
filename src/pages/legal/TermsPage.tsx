import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type LocaleKey = 'es' | 'ca' | 'de' | 'en' | 'sv' | 'fr' | 'it' | 'da' | 'nl' | 'no' | 'pt';

interface TermsContent {
  backToHome: string;
  title: string;
  lastUpdated: string;
  intro: string;
  s1Title: string;
  s1Text: string;
  s2Title: string;
  s21Title: string;
  s21Text: string;
  permitted: string;
  p1: string; p2: string; p3: string;
  prohibited: string;
  q1: string; q2: string; q3: string; q4: string;
  s22Title: string;
  s22Text1: string;
  s22Text2: string;
  s3Title: string;
  s31Title: string;
  s31Text: string;
  notLabel: string;
  not1: string; not2: string; not3: string;
  s32Title: string;
  commStandard: string;
  commExclusive: string;
  commEarned: string;
  ce1: string; ce2: string;
  commSpecial: string;
  cs1: string; cs2: string;
  s4Title: string;
  s41Title: string;
  s41Text: string;
  w1: string; w2: string; w3: string; w4: string;
  recommend: string;
  r1: string; r2: string; r3: string; r4: string;
  s42Title: string;
  s42Text1: string;
  s42Text2: string;
  s5Title: string;
  s5Text1: string;
  s5NotLabel: string;
  s5not1: string; s5not2: string; s5not3: string;
  s5Consult: string;
  s6Title: string;
  s6Text1: string;
  s6Implies: string;
  s6i1: string; s6i2: string; s6i3: string; s6i4: string;
  s6DocsLabel: string;
  s6d1: string; s6d2: string; s6d3: string;
  s7Title: string;
  s7Text: string;
  s7list1: string; s7list2: string; s7list3: string;
  s7list4: string; s7list5: string; s7list6: string;
  s7maxLiability: string;
  s8Title: string;
  s8Text1: string;
  s8Notify: string;
  s8n1: string; s8n2: string;
  s8Continued: string;
  s9Title: string;
  s91Title: string;
  s91Text: string;
  s92Title: string;
  s92Text: string;
  s93Title: string;
  s93Text: string;
  s10Title: string;
  s10Text: string;
  confirmation: string;
}

const content: Record<LocaleKey, TermsContent> = {
  en: {
    backToHome: 'Back to home',
    title: 'Terms & Conditions',
    lastUpdated: 'Last updated: January 24, 2026',
    intro: 'By accessing and using www.ancloraprivateestates.com (the "Website"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Website.',
    s1Title: '1. Acceptance of Terms',
    s1Text: 'By accessing and using www.ancloraprivateestates.com (the "Website"), you accept to be bound by these Terms and Conditions. If you do not agree, please do not use the Website.',
    s2Title: '2. Permitted Use of the Website',
    s21Title: '2.1 Personal and Non-Commercial Use',
    s21Text: 'The Website is intended exclusively for your personal and non-commercial use.',
    permitted: 'Permitted:',
    p1: 'Browse published properties',
    p2: 'Contact Anclora to request information',
    p3: 'Share links to specific properties',
    prohibited: 'Prohibited:',
    q1: 'Copy content without express authorization',
    q2: 'Use scrapers, bots, or automated tools',
    q3: 'Reproduce photographs for commercial purposes',
    q4: 'Republish listings on other platforms',
    s22Title: '2.2 Intellectual Property',
    s22Text1: 'All content on the Website (texts, photographs, logos, designs) is the property of Anclora Group or third parties who have authorized its use.',
    s22Text2: 'Unauthorized use may constitute copyright infringement and give rise to legal action.',
    s3Title: '3. Real Estate Intermediation Services',
    s31Title: '3.1 Nature of the Service',
    s31Text: 'Anclora Group acts as a professional intermediary between:',
    notLabel: 'We are NOT:',
    not1: 'Owners of the published properties (unless expressly indicated)',
    not2: 'Real estate developers (unless indicated as own projects)',
    not3: 'Financial or tax advisors',
    s32Title: '3.2 Intermediation Fees',
    commStandard: 'Standard commission: 3% + VAT on the sale price (payable by the buyer)',
    commExclusive: 'Exclusive properties commission: According to individual agreement with the seller',
    commEarned: 'The commission is earned:',
    ce1: 'When the purchase contract is signed (public deed)',
    ce2: 'Or when the deposit/earnest money contract is formalized if so stipulated',
    commSpecial: 'Special conditions:',
    cs1: 'Properties > €5,000,000: Commission negotiable',
    cs2: 'Partners/Brokers: See Partner Program',
    s4Title: '4. Property Information',
    s41Title: '4.1 Accuracy of Information',
    s41Text: 'We make reasonable efforts to ensure the accuracy of information, but:',
    w1: 'Descriptions, photographs, and plans are indicative',
    w2: 'Prices are subject to change without prior notice',
    w3: 'Areas are approximate (verify with official documentation)',
    w4: 'Legal/urban status must be verified with the seller/notary',
    recommend: 'We strongly recommend:',
    r1: 'Complete legal due diligence',
    r2: 'Physical inspection of the property',
    r3: 'Cadastral and registry verification',
    r4: 'Consultation with an architect (if renovation/extension is planned)',
    s42Title: '4.2 Availability',
    s42Text1: 'Properties may have been sold, withdrawn, or had their price changed without this information being immediately updated on the Website.',
    s42Text2: 'Anclora Group is not responsible for the unavailability of published properties.',
    s5Title: '5. Market Data and Investment',
    s5Text1: 'Market data, return estimates, and projections are for informational purposes only.',
    s5NotLabel: 'This does NOT constitute:',
    s5not1: 'Investment advice',
    s5not2: 'Guaranteed returns',
    s5not3: 'Personalized recommendation',
    s5Consult: 'Consult professional advisors before making investment decisions.',
    s6Title: '6. Anti-Money Laundering',
    s6Text1: 'Under Law 10/2010, of April 28, Anclora Group is subject to anti-money laundering obligations.',
    s6Implies: 'This implies:',
    s6i1: '1. Customer identification and verification (KYC)',
    s6i2: '2. Verification of fund origin in transactions > €10,000',
    s6i3: '3. Document retention for 10 years',
    s6i4: '4. Possible communication to SEPBLAC of suspicious operations',
    s6DocsLabel: 'Required documentation:',
    s6d1: 'Valid ID/NIE/Passport',
    s6d2: 'Proof of address (census, utility bill)',
    s6d3: 'Declaration of fund origin (if applicable)',
    s7Title: '7. Limitation of Liability',
    s7Text: 'Anclora Group is NOT responsible for:',
    s7list1: 'Errors or omissions in property descriptions',
    s7list2: 'Hidden defects in properties',
    s7list3: 'Contractual breaches by sellers/buyers',
    s7list4: 'Financial losses from investment decisions',
    s7list5: 'Service interruptions on the Website',
    s7list6: 'Computer viruses or harmful elements',
    s7maxLiability: 'Maximum liability: Limited to the fees actually received by Anclora Group in the specific transaction that causes the damage.',
    s8Title: '8. Modifications',
    s8Text1: 'Anclora Group reserves the right to modify these Terms and Conditions at any time.',
    s8Notify: 'Substantial changes will be notified via:',
    s8n1: 'Prominent notice on the Website',
    s8n2: 'Email to registered users',
    s8Continued: 'Continued use of the Website after changes are published constitutes acceptance.',
    s9Title: '9. Dispute Resolution',
    s91Title: '9.1 Prior Mediation',
    s91Text: 'Before going to court, the parties agree to attempt to resolve any dispute through mediation with the College of Real Estate Agents of the Balearic Islands.',
    s92Title: '9.2 Jurisdiction and Applicable Law',
    s92Text: 'These Terms are governed by Spanish law. For any dispute, the parties submit to the Courts and Tribunals of Palma de Mallorca, unless the law establishes a different mandatory jurisdiction.',
    s93Title: '9.3 Online Dispute Resolution Platform (EU)',
    s93Text: 'In accordance with Regulation (EU) 524/2013, consumers can access the European online dispute resolution platform:',
    s10Title: '10. Contact',
    s10Text: 'For inquiries about these Terms and Conditions:',
    confirmation: 'By using the Website, you confirm that you have read, understood, and accepted these Terms and Conditions.',
  },
  es: {
    backToHome: 'Volver al inicio',
    title: 'Términos y Condiciones',
    lastUpdated: 'Última actualización: 24 de enero de 2026',
    intro: 'Al acceder y utilizar www.ancloraprivateestates.com (el «Sitio Web»), usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo, le rogamos que no utilice el Sitio Web.',
    s1Title: '1. Aceptación de los Términos',
    s1Text: 'Al acceder y utilizar www.ancloraprivateestates.com (el «Sitio Web»), usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo, le rogamos que no utilice el Sitio Web.',
    s2Title: '2. Uso Permitido del Sitio Web',
    s21Title: '2.1 Uso Personal y No Comercial',
    s21Text: 'El Sitio Web está destinado exclusivamente a su uso personal y no comercial.',
    permitted: 'Permitido:',
    p1: 'Consultar las propiedades publicadas',
    p2: 'Contactar con Anclora para solicitar información',
    p3: 'Compartir enlaces a propiedades específicas',
    prohibited: 'Prohibido:',
    q1: 'Copiar contenidos sin autorización expresa',
    q2: 'Utilizar scrapers, bots o herramientas automatizadas',
    q3: 'Reproducir fotografías con fines comerciales',
    q4: 'Republicar anuncios en otras plataformas',
    s22Title: '2.2 Propiedad Intelectual',
    s22Text1: 'Todos los contenidos del Sitio Web (textos, fotografías, logotipos, diseños) son propiedad de Anclora Group o de terceros que han autorizado su uso.',
    s22Text2: 'El uso no autorizado puede constituir una infracción de los derechos de autor y dar lugar a acciones legales.',
    s3Title: '3. Servicios de Intermediación Inmobiliaria',
    s31Title: '3.1 Naturaleza del Servicio',
    s31Text: 'Anclora Group actúa como intermediario profesional entre:',
    notLabel: 'NO somos:',
    not1: 'Propietarios de los inmuebles publicados (salvo indicación expresa)',
    not2: 'Promotores inmobiliarios (salvo que se indique como proyectos propios)',
    not3: 'Asesores financieros o fiscales',
    s32Title: '3.2 Honorarios de Intermediación',
    commStandard: 'Comisión estándar: 3% + IVA sobre el precio de venta (a cargo del comprador)',
    commExclusive: 'Comisión en propiedades en exclusiva: Según acuerdo individual con el vendedor',
    commEarned: 'La comisión se devenga:',
    ce1: 'Cuando se firma el contrato de compraventa (escritura pública)',
    ce2: 'O cuando se formaliza el contrato de arras si así se estipula',
    commSpecial: 'Condiciones especiales:',
    cs1: 'Propiedades > 5.000.000 €: Comisión negociable',
    cs2: 'Partners/Brokers: Ver Programa de Partners',
    s4Title: '4. Información sobre Inmuebles',
    s41Title: '4.1 Exactitud de la Información',
    s41Text: 'Realizamos esfuerzos razonables para garantizar la exactitud de la información, pero:',
    w1: 'Las descripciones, fotografías y planos son orientativos',
    w2: 'Los precios están sujetos a cambio sin previo aviso',
    w3: 'Las superficies son aproximadas (verificar con documentación oficial)',
    w4: 'La situación legal/urbanística debe verificarse con el vendedor/notario',
    recommend: 'Recomendamos encarecidamente:',
    r1: 'Due diligence legal completa',
    r2: 'Inspección física del inmueble',
    r3: 'Verificación catastral y registral',
    r4: 'Consulta con arquitecto (si se prevé reforma/ampliación)',
    s42Title: '4.2 Disponibilidad',
    s42Text1: 'Los inmuebles pueden haber sido vendidos, retirados o haber cambiado de precio sin que esta información se actualice de forma inmediata en el Sitio Web.',
    s42Text2: 'Anclora Group no se responsabiliza de la no disponibilidad de los inmuebles publicados.',
    s5Title: '5. Datos de Mercado e Inversión',
    s5Text1: 'Los datos de mercado, estimaciones de rentabilidad y proyecciones tienen carácter meramente informativo.',
    s5NotLabel: 'Esto NO constituye:',
    s5not1: 'Asesoramiento de inversión',
    s5not2: 'Rentabilidades garantizadas',
    s5not3: 'Recomendación personalizada',
    s5Consult: 'Consulte con asesores profesionales antes de tomar decisiones de inversión.',
    s6Title: '6. Prevención del Blanqueo de Capitales',
    s6Text1: 'En virtud de la Ley 10/2010, de 28 de abril, Anclora Group está sujeto a obligaciones en materia de prevención del blanqueo de capitales.',
    s6Implies: 'Esto implica:',
    s6i1: '1. Identificación y verificación de clientes (KYC)',
    s6i2: '2. Verificación del origen de los fondos en operaciones > 10.000 €',
    s6i3: '3. Conservación de documentación durante 10 años',
    s6i4: '4. Posible comunicación al SEPBLAC de operaciones sospechosas',
    s6DocsLabel: 'Documentación requerida:',
    s6d1: 'DNI/NIE/Pasaporte en vigor',
    s6d2: 'Justificante de domicilio (empadronamiento, recibo de suministro)',
    s6d3: 'Declaración de origen de fondos (si procede)',
    s7Title: '7. Limitación de Responsabilidad',
    s7Text: 'Anclora Group NO se responsabiliza de:',
    s7list1: 'Errores u omisiones en las descripciones de los inmuebles',
    s7list2: 'Vicios ocultos de los inmuebles',
    s7list3: 'Incumplimientos contractuales de vendedores/compradores',
    s7list4: 'Pérdidas económicas derivadas de decisiones de inversión',
    s7list5: 'Interrupciones del servicio en el Sitio Web',
    s7list6: 'Virus informáticos o elementos dañinos',
    s7maxLiability: 'Responsabilidad máxima: Limitada a los honorarios efectivamente percibidos por Anclora Group en la operación concreta que origina el daño.',
    s8Title: '8. Modificaciones',
    s8Text1: 'Anclora Group se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento.',
    s8Notify: 'Los cambios sustanciales se notificarán mediante:',
    s8n1: 'Aviso destacado en el Sitio Web',
    s8n2: 'Correo electrónico a los usuarios registrados',
    s8Continued: 'El uso continuado del Sitio Web tras la publicación de cambios implica su aceptación.',
    s9Title: '9. Resolución de Conflictos',
    s91Title: '9.1 Mediación Previa',
    s91Text: 'Antes de acudir a los tribunales, las partes acuerdan intentar resolver cualquier controversia mediante mediación ante el Colegio de Agentes de la Propiedad Inmobiliaria de Baleares.',
    s92Title: '9.2 Jurisdicción y Ley Aplicable',
    s92Text: 'Estos Términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Palma de Mallorca, salvo que la ley establezca una jurisdicción obligatoria diferente.',
    s93Title: '9.3 Plataforma de Resolución de Litigios en Línea (UE)',
    s93Text: 'De conformidad con el Reglamento (UE) 524/2013, los consumidores pueden acceder a la plataforma europea de resolución de litigios en línea:',
    s10Title: '10. Contacto',
    s10Text: 'Para consultas sobre estos Términos y Condiciones:',
    confirmation: 'Al utilizar el Sitio Web, usted confirma que ha leído, comprendido y aceptado estos Términos y Condiciones.',
  },
  ca: {
    backToHome: 'Tornar a l\'inici',
    title: 'Termes i Condicions',
    lastUpdated: 'Darrera actualització: 24 de gener de 2026',
    intro: 'En accedir i utilitzar www.ancloraprivateestates.com (el «Lloc Web»), accepteu quedar vinculats per aquests Termes i Condicions. Si no hi esteu d\'acord, us preguem que no utilitzeu el Lloc Web.',
    s1Title: '1. Acceptació dels Termes',
    s1Text: 'En accedir i utilitzar www.ancloraprivateestates.com (el «Lloc Web»), accepteu quedar vinculats per aquests Termes i Condicions. Si no hi esteu d\'acord, us preguem que no utilitzeu el Lloc Web.',
    s2Title: '2. Ús Permès del Lloc Web',
    s21Title: '2.1 Ús Personal i No Comercial',
    s21Text: 'El Lloc Web està destinat exclusivament al vostre ús personal i no comercial.',
    permitted: 'Permès:',
    p1: 'Consultar les propietats publicades',
    p2: 'Contactar amb Anclora per sol·licitar informació',
    p3: 'Compartir enllaços a propietats específiques',
    prohibited: 'Prohibit:',
    q1: 'Copiar continguts sense autorització expressa',
    q2: 'Utilitzar scrapers, bots o eines automatitzades',
    q3: 'Reproduir fotografies amb fins comercials',
    q4: 'Republicar anuncis en altres plataformes',
    s22Title: '2.2 Propietat Intel·lectual',
    s22Text1: 'Tots els continguts del Lloc Web (textos, fotografies, logotips, dissenys) són propietat d\'Anclora Group o de tercers que n\'han autoritzat l\'ús.',
    s22Text2: 'L\'ús no autoritzat pot constituir una infracció dels drets d\'autor i donar lloc a accions legals.',
    s3Title: '3. Serveis d\'Intermediació Immobiliària',
    s31Title: '3.1 Naturalesa del Servei',
    s31Text: 'Anclora Group actua com a intermediari professional entre:',
    notLabel: 'NO som:',
    not1: 'Propietaris dels immobles publicats (llevat d\'indicació expressa)',
    not2: 'Promotors immobiliaris (llevat que s\'indiqui com a projectes propis)',
    not3: 'Assessors financers o fiscals',
    s32Title: '3.2 Honoraris d\'Intermediació',
    commStandard: 'Comissió estàndard: 3% + IVA sobre el preu de venda (a càrrec del comprador)',
    commExclusive: 'Comissió en propietats en exclusiva: Segons acord individual amb el venedor',
    commEarned: 'La comissió es merita:',
    ce1: 'Quan se signa el contracte de compravenda (escriptura pública)',
    ce2: 'O quan es formalitza el contracte d\'arres si així s\'estipula',
    commSpecial: 'Condicions especials:',
    cs1: 'Propietats > 5.000.000 €: Comissió negociable',
    cs2: 'Partners/Brokers: Veure Programa de Partners',
    s4Title: '4. Informació sobre Immobles',
    s41Title: '4.1 Exactitud de la Informació',
    s41Text: 'Realitzem esforços raonables per garantir l\'exactitud de la informació, però:',
    w1: 'Les descripcions, fotografies i plans són orientatius',
    w2: 'Els preus estan subjectes a canvi sense previ avís',
    w3: 'Les superfícies són aproximades (verificar amb documentació oficial)',
    w4: 'La situació legal/urbanística s\'ha de verificar amb el venedor/notari',
    recommend: 'Recomanem encaridament:',
    r1: 'Due diligence legal completa',
    r2: 'Inspecció física de l\'immoble',
    r3: 'Verificació cadastral i registral',
    r4: 'Consulta amb arquitecte (si es preveu reforma/ampliació)',
    s42Title: '4.2 Disponibilitat',
    s42Text1: 'Els immobles poden haver estat venuts, retirats o haver canviat de preu sense que aquesta informació s\'actualitzi de forma immediata al Lloc Web.',
    s42Text2: 'Anclora Group no es responsabilitza de la no disponibilitat dels immobles publicats.',
    s5Title: '5. Dades de Mercat i Inversió',
    s5Text1: 'Les dades de mercat, estimacions de rendibilitat i projeccions tenen caràcter merament informatiu.',
    s5NotLabel: 'Això NO constitueix:',
    s5not1: 'Assessorament d\'inversió',
    s5not2: 'Rendibilitats garantides',
    s5not3: 'Recomanació personalitzada',
    s5Consult: 'Consulteu amb assessors professionals abans de prendre decisions d\'inversió.',
    s6Title: '6. Prevenció del Blanqueig de Capitals',
    s6Text1: 'En virtut de la Llei 10/2010, de 28 d\'abril, Anclora Group està subjecte a obligacions en matèria de prevenció del blanqueig de capitals.',
    s6Implies: 'Això implica:',
    s6i1: '1. Identificació i verificació de clients (KYC)',
    s6i2: '2. Verificació de l\'origen dels fons en operacions > 10.000 €',
    s6i3: '3. Conservació de documentació durant 10 anys',
    s6i4: '4. Possible comunicació al SEPBLAC d\'operacions sospitoses',
    s6DocsLabel: 'Documentació requerida:',
    s6d1: 'DNI/NIE/Passaport en vigor',
    s6d2: 'Justificant de domicili (empadronament, rebut de subministrament)',
    s6d3: 'Declaració d\'origen de fons (si escau)',
    s7Title: '7. Limitació de Responsabilitat',
    s7Text: 'Anclora Group NO es responsabilitza de:',
    s7list1: 'Errors o omissions en les descripcions dels immobles',
    s7list2: 'Vicis ocults dels immobles',
    s7list3: 'Incompliments contractuals de venedors/compradors',
    s7list4: 'Pèrdues econòmiques derivades de decisions d\'inversió',
    s7list5: 'Interrupcions del servei al Lloc Web',
    s7list6: 'Virus informàtics o elements nocius',
    s7maxLiability: 'Responsabilitat màxima: Limitada als honoraris efectivament percebuts per Anclora Group en l\'operació concreta que origina el dany.',
    s8Title: '8. Modificacions',
    s8Text1: 'Anclora Group es reserva el dret de modificar aquests Termes i Condicions en qualsevol moment.',
    s8Notify: 'Els canvis substancials es notificaran mitjançant:',
    s8n1: 'Avís destacat al Lloc Web',
    s8n2: 'Correu electrònic als usuaris registrats',
    s8Continued: 'L\'ús continuat del Lloc Web després de la publicació dels canvis implica la seva acceptació.',
    s9Title: '9. Resolució de Conflictes',
    s91Title: '9.1 Mediació Prèvia',
    s91Text: 'Abans d\'acudir als tribunals, les parts acorden intentar resoldre qualsevol controvèrsia per mediació davant el Col·legi d\'Agents de la Propietat Immobiliària de Balears.',
    s92Title: '9.2 Jurisdicció i Llei Aplicable',
    s92Text: 'Aquests Termes es regeixen per la legislació espanyola. Per a qualsevol controvèrsia, les parts se sotmeten als Jutjats i Tribunals de Palma de Mallorca, tret que la llei estableixi una jurisdicció obligatòria diferent.',
    s93Title: '9.3 Plataforma de Resolució de Litigis en Línia (UE)',
    s93Text: 'De conformitat amb el Reglament (UE) 524/2013, els consumidors poden accedir a la plataforma europea de resolució de litigis en línia:',
    s10Title: '10. Contacte',
    s10Text: 'Per a consultes sobre aquests Termes i Condicions:',
    confirmation: 'En utilitzar el Lloc Web, confirmeu que heu llegit, comprès i acceptat aquests Termes i Condicions.',
  },
  de: {
    backToHome: 'Zur Startseite',
    title: 'Allgemeine Geschäftsbedingungen',
    lastUpdated: 'Zuletzt aktualisiert: 24. Januar 2026',
    intro: 'Durch den Zugriff auf und die Nutzung von www.ancloraprivateestates.com (die „Website") erklären Sie sich damit einverstanden, an diese Allgemeinen Geschäftsbedingungen gebunden zu sein. Wenn Sie nicht einverstanden sind, bitten wir Sie, die Website nicht zu nutzen.',
    s1Title: '1. Annahme der Bedingungen',
    s1Text: 'Durch den Zugriff auf und die Nutzung von www.ancloraprivateestates.com (die „Website") erklären Sie sich damit einverstanden, an diese Allgemeinen Geschäftsbedingungen gebunden zu sein. Wenn Sie nicht einverstanden sind, bitten wir Sie, die Website nicht zu nutzen.',
    s2Title: '2. Zulässige Nutzung der Website',
    s21Title: '2.1 Persönliche und nicht-kommerzielle Nutzung',
    s21Text: 'Die Website ist ausschließlich für Ihre persönliche und nicht-kommerzielle Nutzung bestimmt.',
    permitted: 'Erlaubt:',
    p1: 'Veröffentlichte Immobilien browsern',
    p2: 'Anclora kontaktieren, um Informationen anzufordern',
    p3: 'Links zu bestimmten Immobilien teilen',
    prohibited: 'Verboten:',
    q1: 'Inhalte ohne ausdrückliche Genehmigung kopieren',
    q2: 'Scraper, Bots oder automatisierte Tools verwenden',
    q3: 'Fotografien für kommerzielle Zwecke reproduzieren',
    q4: 'Listings auf anderen Plattformen erneut veröffentlichen',
    s22Title: '2.2 Geistiges Eigentum',
    s22Text1: 'Alle Inhalte der Website (Texte, Fotografien, Logos, Designs) sind Eigentum der Anclora Group oder von Dritten, die ihre Nutzung genehmigt haben.',
    s22Text2: 'Unbefugte Nutzung kann einen Urheberrechtsverstoß darstellen und rechtliche Schritte nach sich ziehen.',
    s3Title: '3. Immobilienvermittlungsdienstleistungen',
    s31Title: '3.1 Art der Dienstleistung',
    s31Text: 'Anclora Group handelt als professioneller Vermittler zwischen:',
    notLabel: 'Wir sind NICHT:',
    not1: 'Eigentümer der veröffentlichten Immobilien (sofern nicht ausdrücklich angegeben)',
    not2: 'Immobilienentwickler (sofern nicht als eigene Projekte angegeben)',
    not3: 'Finanz- oder Steuerberater',
    s32Title: '3.2 Vermittlungsgebühren',
    commStandard: 'Standardprovision: 3% + MwSt. auf den Verkaufspreis (vom Käufer zu zahlen)',
    commExclusive: 'Provision bei Exklusivobjekten: Gemäß individueller Vereinbarung mit dem Verkäufer',
    commEarned: 'Die Provision entsteht:',
    ce1: 'Bei Unterzeichnung des Kaufvertrags (notarielle Urkunde)',
    ce2: 'Oder bei Formalisierung des Reservierungsvertrags, sofern so vereinbart',
    commSpecial: 'Sonderbedingungen:',
    cs1: 'Immobilien > 5.000.000 €: Provision verhandelbar',
    cs2: 'Partner/Broker: Siehe Partnerprogramm',
    s4Title: '4. Immobilieninformationen',
    s41Title: '4.1 Richtigkeit der Informationen',
    s41Text: 'Wir bemühen uns in zumutbarer Weise um die Richtigkeit der Informationen, jedoch:',
    w1: 'Beschreibungen, Fotografien und Pläne sind richtungweisend',
    w2: 'Preise können ohne vorherige Ankündigung geändert werden',
    w3: 'Flächen sind Näherungswerte (bitte mit offiziellen Unterlagen verifizieren)',
    w4: 'Die rechtliche/baurechtliche Situation muss mit dem Verkäufer/Notar verifiziert werden',
    recommend: 'Wir empfehlen dringend:',
    r1: 'Vollständige rechtliche Due-Diligence-Prüfung',
    r2: 'Physische Besichtigung der Immobilie',
    r3: 'Kataster- und Grundbuchprüfung',
    r4: 'Beratung durch einen Architekten (bei geplantem Umbau/Erweiterung)',
    s42Title: '4.2 Verfügbarkeit',
    s42Text1: 'Immobilien können verkauft, zurückgezogen oder im Preis geändert worden sein, ohne dass diese Information sofort auf der Website aktualisiert wird.',
    s42Text2: 'Anclora Group haftet nicht für die Nichtverfügbarkeit veröffentlichter Immobilien.',
    s5Title: '5. Marktdaten und Investitionen',
    s5Text1: 'Marktdaten, Renditeabschätzungen und Projektionen dienen ausschließlich zu Informationszwecken.',
    s5NotLabel: 'Dies stellt KEINE dar:',
    s5not1: 'Anlageberatung',
    s5not2: 'Garantierte Renditen',
    s5not3: 'Personalisierte Empfehlung',
    s5Consult: 'Konsultieren Sie professionelle Berater, bevor Sie Investitionsentscheidungen treffen.',
    s6Title: '6. Geldwäschebekämpfung',
    s6Text1: 'Gemäß Gesetz 10/2010 vom 28. April unterliegt Anclora Group Verpflichtungen zur Geldwäschebekämpfung.',
    s6Implies: 'Dies beinhaltet:',
    s6i1: '1. Kundenidentifikation und -verifizierung (KYC)',
    s6i2: '2. Überprüfung der Mittelherkunft bei Transaktionen > 10.000 €',
    s6i3: '3. Dokumentenaufbewahrung für 10 Jahre',
    s6i4: '4. Mögliche Meldung verdächtiger Transaktionen an SEPBLAC',
    s6DocsLabel: 'Erforderliche Unterlagen:',
    s6d1: 'Gültiger Ausweis/NIE/Reisepass',
    s6d2: 'Adressnachweis (Melderegister, Versorgungsrechnung)',
    s6d3: 'Erklärung über die Mittelherkunft (falls zutreffend)',
    s7Title: '7. Haftungsbeschränkung',
    s7Text: 'Anclora Group haftet NICHT für:',
    s7list1: 'Fehler oder Auslassungen in Immobilienbeschreibungen',
    s7list2: 'Versteckte Mängel an Immobilien',
    s7list3: 'Vertragsverletzungen durch Verkäufer/Käufer',
    s7list4: 'Finanzielle Verluste aus Investitionsentscheidungen',
    s7list5: 'Serviceunterbrechungen auf der Website',
    s7list6: 'Computerviren oder schädliche Elemente',
    s7maxLiability: 'Maximale Haftung: Begrenzt auf die tatsächlich von Anclora Group erhaltenen Honorare in der spezifischen Transaktion, die den Schaden verursacht.',
    s8Title: '8. Änderungen',
    s8Text1: 'Anclora Group behält sich das Recht vor, diese Allgemeinen Geschäftsbedingungen jederzeit zu ändern.',
    s8Notify: 'Wesentliche Änderungen werden mitgeteilt über:',
    s8n1: 'Prominenten Hinweis auf der Website',
    s8n2: 'E-Mail an registrierte Nutzer',
    s8Continued: 'Die weitere Nutzung der Website nach der Veröffentlichung von Änderungen gilt als Annahme.',
    s9Title: '9. Streitbeilegung',
    s91Title: '9.1 Vorherige Mediation',
    s91Text: 'Vor Anrufung eines Gerichts vereinbaren die Parteien, etwaige Streitigkeiten durch Mediation mit dem Berufsverband der Immobilienmakler der Balearen beizulegen.',
    s92Title: '9.2 Gerichtsstand und anwendbares Recht',
    s92Text: 'Diese Bedingungen unterliegen spanischem Recht. Für etwaige Streitigkeiten unterwerfen sich die Parteien den Gerichten von Palma de Mallorca, sofern das Gesetz keinen anderen zwingenden Gerichtsstand vorschreibt.',
    s93Title: '9.3 Online-Streitbeilegungsplattform (EU)',
    s93Text: 'Gemäß Verordnung (EU) 524/2013 können Verbraucher auf die europäische Online-Streitbeilegungsplattform zugreifen:',
    s10Title: '10. Kontakt',
    s10Text: 'Für Anfragen zu diesen Allgemeinen Geschäftsbedingungen:',
    confirmation: 'Durch die Nutzung der Website bestätigen Sie, dass Sie diese Allgemeinen Geschäftsbedingungen gelesen, verstanden und akzeptiert haben.',
  },
  sv: {
    backToHome: 'Tillbaka till startsidan',
    title: 'Allmänna villkor',
    lastUpdated: 'Senast uppdaterad: 24 januari 2026',
    intro: 'Genom att gå in på och använda www.ancloraprivateestates.com ("Webbplatsen") godkänner du att vara bunden av dessa allmänna villkor. Om du inte godkänner dem, vänligen använd inte Webbplatsen.',
    s1Title: '1. Godkännande av villkor',
    s1Text: 'Genom att gå in på och använda www.ancloraprivateestates.com ("Webbplatsen") godkänner du att vara bunden av dessa allmänna villkor. Om du inte godkänner dem, vänligen använd inte Webbplatsen.',
    s2Title: '2. Tillåten användning av Webbplatsen',
    s21Title: '2.1 Personlig och icke-kommersiell användning',
    s21Text: 'Webbplatsen är avsedd uteslutande för din personliga och icke-kommersiella användning.',
    permitted: 'Tillåtet:',
    p1: 'Bläddra bland publicerade fastigheter',
    p2: 'Kontakta Anclora för att begära information',
    p3: 'Dela länkar till specifika fastigheter',
    prohibited: 'Förbjudet:',
    q1: 'Kopiera innehåll utan uttryckligt tillstånd',
    q2: 'Använda scrapers, bottar eller automatiserade verktyg',
    q3: 'Reproducera fotografier för kommersiella ändamål',
    q4: 'Återpublicera annonser på andra plattformar',
    s22Title: '2.2 Immateriella rättigheter',
    s22Text1: 'Allt innehåll på Webbplatsen (texter, fotografier, logotyper, designer) tillhör Anclora Group eller tredje parter som har godkänt dess användning.',
    s22Text2: 'Obehörig användning kan utgöra upphovsrättsintrång och ge upphov till rättsliga åtgärder.',
    s3Title: '3. Fastighetsmäklartjänster',
    s31Title: '3.1 Tjänstens art',
    s31Text: 'Anclora Group agerar som professionell mellanhand mellan:',
    notLabel: 'Vi är INTE:',
    not1: 'Ägare till de publicerade fastigheterna (om inte uttryckligen angivet)',
    not2: 'Fastighetsutvecklare (om inte angivet som egna projekt)',
    not3: 'Finans- eller skatterådgivare',
    s32Title: '3.2 Förmedlingsarvoden',
    commStandard: 'Standardprovision: 3% + moms på försäljningspriset (betalas av köparen)',
    commExclusive: 'Provision för exklusiva fastigheter: Enligt individuell överenskommelse med säljaren',
    commEarned: 'Provisionen intjänas:',
    ce1: 'När köpekontraktet undertecknas (offentlig handling)',
    ce2: 'Eller när handpenningsavtalet formaliseras om så stipuleras',
    commSpecial: 'Särskilda villkor:',
    cs1: 'Fastigheter > 5 000 000 €: Provision förhandlingsbar',
    cs2: 'Partners/mäklare: Se Partnerprogram',
    s4Title: '4. Fastighetsinformation',
    s41Title: '4.1 Informationens riktighet',
    s41Text: 'Vi gör rimliga ansträngningar för att säkerställa informationens riktighet, men:',
    w1: 'Beskrivningar, fotografier och planer är vägledande',
    w2: 'Priser kan ändras utan föregående meddelande',
    w3: 'Ytor är ungefärliga (verifiera med officiell dokumentation)',
    w4: 'Rättslig/stadsplanestatus måste verifieras med säljaren/notarien',
    recommend: 'Vi rekommenderar starkt:',
    r1: 'Fullständig legal due diligence',
    r2: 'Fysisk besiktning av fastigheten',
    r3: 'Fastighets- och inskrivningsregisterkontroll',
    r4: 'Konsultation med arkitekt (om renovering/utbyggnad planeras)',
    s42Title: '4.2 Tillgänglighet',
    s42Text1: 'Fastigheter kan ha sålts, dragits tillbaka eller haft sitt pris ändrat utan att denna information omedelbart uppdateras på Webbplatsen.',
    s42Text2: 'Anclora Group ansvarar inte för otillgänglighet av publicerade fastigheter.',
    s5Title: '5. Marknadsdata och investeringar',
    s5Text1: 'Marknadsdata, avkastningsuppskattningar och prognoser är enbart för informationsändamål.',
    s5NotLabel: 'Detta utgör INTE:',
    s5not1: 'Investeringsrådgivning',
    s5not2: 'Garanterad avkastning',
    s5not3: 'Personlig rekommendation',
    s5Consult: 'Konsultera professionella rådgivare innan du fattar investeringsbeslut.',
    s6Title: '6. Penningtvättsbekämpning',
    s6Text1: 'Enligt lag 10/2010 av den 28 april är Anclora Group underkastad skyldigheter för bekämpning av penningtvätt.',
    s6Implies: 'Detta innebär:',
    s6i1: '1. Kundidentifiering och -verifiering (KYC)',
    s6i2: '2. Verifiering av fondens ursprung vid transaktioner > 10 000 €',
    s6i3: '3. Dokumentbevarande i 10 år',
    s6i4: '4. Möjlig rapportering till SEPBLAC av misstänkta transaktioner',
    s6DocsLabel: 'Nödvändig dokumentation:',
    s6d1: 'Giltigt ID/NIE/Pass',
    s6d2: 'Adressbevis (folkbokföring, räkning)',
    s6d3: 'Förklaring om fondens ursprung (om tillämpligt)',
    s7Title: '7. Ansvarsbegränsning',
    s7Text: 'Anclora Group ansvarar INTE för:',
    s7list1: 'Fel eller utelämnanden i fastighetsbeskrivningar',
    s7list2: 'Dolda fel i fastigheter',
    s7list3: 'Avtalsmissbruk av säljare/köpare',
    s7list4: 'Ekonomiska förluster till följd av investeringsbeslut',
    s7list5: 'Avbrott i tjänsten på Webbplatsen',
    s7list6: 'Datavirus eller skadliga element',
    s7maxLiability: 'Maximalt ansvar: Begränsat till de arvoden som faktiskt mottagits av Anclora Group i den specifika transaktion som orsakar skadan.',
    s8Title: '8. Ändringar',
    s8Text1: 'Anclora Group förbehåller sig rätten att ändra dessa allmänna villkor när som helst.',
    s8Notify: 'Väsentliga ändringar meddelas via:',
    s8n1: 'Framträdande meddelande på Webbplatsen',
    s8n2: 'E-post till registrerade användare',
    s8Continued: 'Fortsatt användning av Webbplatsen efter att ändringar publicerats utgör godkännande.',
    s9Title: '9. Tvistlösning',
    s91Title: '9.1 Föregående medling',
    s91Text: 'Innan parterna går till domstol, är de överens om att försöka lösa eventuella tvister genom medling med fastighetsmäklarförbundet på Balearerna.',
    s92Title: '9.2 Jurisdiktion och tillämplig lag',
    s92Text: 'Dessa villkor regleras av spansk lag. För eventuella tvister underkastade sig parterna domstolarna i Palma de Mallorca, om inte lagen fastställer en annan obligatorisk jurisdiktion.',
    s93Title: '9.3 EU:s plattform för onlinetvistelösning',
    s93Text: 'I enlighet med förordning (EU) 524/2013 kan konsumenter få tillgång till den europeiska plattformen för onlinetvistelösning:',
    s10Title: '10. Kontakt',
    s10Text: 'För frågor om dessa allmänna villkor:',
    confirmation: 'Genom att använda Webbplatsen bekräftar du att du har läst, förstått och accepterat dessa allmänna villkor.',
  },
  fr: {
    backToHome: 'Retour à l\'accueil',
    title: 'Conditions Générales d\'Utilisation',
    lastUpdated: 'Dernière mise à jour : 24 janvier 2026',
    intro: 'En accédant à www.ancloraprivateestates.com (le « Site ») et en l\'utilisant, vous acceptez d\'être lié par ces Conditions Générales d\'Utilisation. Si vous n\'êtes pas d\'accord, veuillez ne pas utiliser le Site.',
    s1Title: '1. Acceptation des conditions',
    s1Text: 'En accédant à www.ancloraprivateestates.com (le « Site ») et en l\'utilisant, vous acceptez d\'être lié par ces Conditions Générales d\'Utilisation. Si vous n\'êtes pas d\'accord, veuillez ne pas utiliser le Site.',
    s2Title: '2. Utilisation autorisée du Site',
    s21Title: '2.1 Usage personnel et non commercial',
    s21Text: 'Le Site est destiné exclusivement à votre usage personnel et non commercial.',
    permitted: 'Autorisé :',
    p1: 'Consulter les biens publiés',
    p2: 'Contacter Anclora pour demander des informations',
    p3: 'Partager des liens vers des biens spécifiques',
    prohibited: 'Interdit :',
    q1: 'Copier des contenus sans autorisation expresse',
    q2: 'Utiliser des scrapers, bots ou outils automatisés',
    q3: 'Reproduire des photographies à des fins commerciales',
    q4: 'Republier des annonces sur d\'autres plateformes',
    s22Title: '2.2 Propriété intellectuelle',
    s22Text1: 'Tout le contenu du Site (textes, photographies, logos, designs) est la propriété d\'Anclora Group ou de tiers ayant autorisé son utilisation.',
    s22Text2: 'Toute utilisation non autorisée peut constituer une violation des droits d\'auteur et donner lieu à des poursuites judiciaires.',
    s3Title: '3. Services d\'intermédiation immobilière',
    s31Title: '3.1 Nature du service',
    s31Text: 'Anclora Group agit en tant qu\'intermédiaire professionnel entre :',
    notLabel: 'Nous NE sommes PAS :',
    not1: 'Propriétaires des biens publiés (sauf indication expresse)',
    not2: 'Promoteurs immobiliers (sauf indication comme projets propres)',
    not3: 'Conseillers financiers ou fiscaux',
    s32Title: '3.2 Honoraires d\'intermédiation',
    commStandard: 'Commission standard : 3% + TVA sur le prix de vente (à la charge de l\'acheteur)',
    commExclusive: 'Commission pour les biens en exclusivité : Selon accord individuel avec le vendeur',
    commEarned: 'La commission est acquise :',
    ce1: 'Lors de la signature du compromis de vente (acte authentique)',
    ce2: 'Ou lors de la formalisation du contrat d\'arrhes si ainsi stipulé',
    commSpecial: 'Conditions particulières :',
    cs1: 'Biens > 5 000 000 € : Commission négociable',
    cs2: 'Partenaires/Courtiers : Voir Programme Partenaires',
    s4Title: '4. Informations sur les biens',
    s41Title: '4.1 Exactitude des informations',
    s41Text: 'Nous faisons des efforts raisonnables pour garantir l\'exactitude des informations, mais :',
    w1: 'Les descriptions, photographies et plans sont indicatifs',
    w2: 'Les prix sont susceptibles de changer sans préavis',
    w3: 'Les surfaces sont approximatives (à vérifier avec la documentation officielle)',
    w4: 'Le statut juridique/urbanistique doit être vérifié avec le vendeur/notaire',
    recommend: 'Nous recommandons vivement :',
    r1: 'Une due diligence juridique complète',
    r2: 'Une inspection physique du bien',
    r3: 'Une vérification cadastrale et au registre foncier',
    r4: 'Une consultation avec un architecte (si une rénovation/extension est prévue)',
    s42Title: '4.2 Disponibilité',
    s42Text1: 'Des biens peuvent avoir été vendus, retirés ou avoir subi une modification de prix sans que cette information soit immédiatement mise à jour sur le Site.',
    s42Text2: 'Anclora Group n\'est pas responsable de l\'indisponibilité des biens publiés.',
    s5Title: '5. Données de marché et investissement',
    s5Text1: 'Les données de marché, estimations de rendement et projections sont fournies à titre purement informatif.',
    s5NotLabel: 'Cela ne constitue PAS :',
    s5not1: 'Un conseil en investissement',
    s5not2: 'Des rendements garantis',
    s5not3: 'Une recommandation personnalisée',
    s5Consult: 'Consultez des conseillers professionnels avant de prendre des décisions d\'investissement.',
    s6Title: '6. Lutte contre le blanchiment de capitaux',
    s6Text1: 'En vertu de la loi 10/2010 du 28 avril, Anclora Group est soumis à des obligations en matière de lutte contre le blanchiment de capitaux.',
    s6Implies: 'Cela implique :',
    s6i1: '1. Identification et vérification des clients (KYC)',
    s6i2: '2. Vérification de l\'origine des fonds pour les transactions > 10 000 €',
    s6i3: '3. Conservation des documents pendant 10 ans',
    s6i4: '4. Signalement possible d\'opérations suspectes au SEPBLAC',
    s6DocsLabel: 'Documents requis :',
    s6d1: 'Pièce d\'identité/NIE/Passeport en cours de validité',
    s6d2: 'Justificatif de domicile (avis de recensement, facture de service public)',
    s6d3: 'Déclaration d\'origine des fonds (le cas échéant)',
    s7Title: '7. Limitation de responsabilité',
    s7Text: 'Anclora Group n\'est PAS responsable de :',
    s7list1: 'Erreurs ou omissions dans les descriptions de biens',
    s7list2: 'Vices cachés des biens',
    s7list3: 'Manquements contractuels des vendeurs/acheteurs',
    s7list4: 'Pertes financières résultant de décisions d\'investissement',
    s7list5: 'Interruptions de service sur le Site',
    s7list6: 'Virus informatiques ou éléments nuisibles',
    s7maxLiability: 'Responsabilité maximale : Limitée aux honoraires effectivement perçus par Anclora Group dans la transaction spécifique à l\'origine du préjudice.',
    s8Title: '8. Modifications',
    s8Text1: 'Anclora Group se réserve le droit de modifier ces Conditions Générales d\'Utilisation à tout moment.',
    s8Notify: 'Les modifications substantielles seront notifiées via :',
    s8n1: 'Un avis bien visible sur le Site',
    s8n2: 'Un e-mail aux utilisateurs enregistrés',
    s8Continued: 'L\'utilisation continue du Site après la publication des modifications vaut acceptation.',
    s9Title: '9. Résolution des litiges',
    s91Title: '9.1 Médiation préalable',
    s91Text: 'Avant de saisir un tribunal, les parties conviennent de tenter de résoudre tout litige par médiation auprès du Collège des agents immobiliers des Baléares.',
    s92Title: '9.2 Juridiction et droit applicable',
    s92Text: 'Ces Conditions sont régies par le droit espagnol. Pour tout litige, les parties se soumettent aux tribunaux de Palma de Majorque, sauf si la loi prévoit une juridiction obligatoire différente.',
    s93Title: '9.3 Plateforme européenne de règlement en ligne des litiges (UE)',
    s93Text: 'Conformément au règlement (UE) 524/2013, les consommateurs peuvent accéder à la plateforme européenne de règlement en ligne des litiges :',
    s10Title: '10. Contact',
    s10Text: 'Pour toute question relative à ces Conditions Générales :',
    confirmation: 'En utilisant le Site, vous confirmez avoir lu, compris et accepté ces Conditions Générales d\'Utilisation.',
  },
  it: {
    backToHome: 'Torna alla home',
    title: 'Termini e Condizioni',
    lastUpdated: 'Ultimo aggiornamento: 24 gennaio 2026',
    intro: 'Accedendo a www.ancloraprivateestates.com (il «Sito») e utilizzandolo, l\'utente accetta di essere vincolato dai presenti Termini e Condizioni. In caso di disaccordo, si prega di non utilizzare il Sito.',
    s1Title: '1. Accettazione dei termini',
    s1Text: 'Accedendo a www.ancloraprivateestates.com (il «Sito») e utilizzandolo, l\'utente accetta di essere vincolato dai presenti Termini e Condizioni. In caso di disaccordo, si prega di non utilizzare il Sito.',
    s2Title: '2. Uso consentito del Sito',
    s21Title: '2.1 Uso personale e non commerciale',
    s21Text: 'Il Sito è destinato esclusivamente all\'uso personale e non commerciale dell\'utente.',
    permitted: 'Consentito:',
    p1: 'Consultare gli immobili pubblicati',
    p2: 'Contattare Anclora per richiedere informazioni',
    p3: 'Condividere link a immobili specifici',
    prohibited: 'Vietato:',
    q1: 'Copiare contenuti senza autorizzazione espressa',
    q2: 'Utilizzare scraper, bot o strumenti automatizzati',
    q3: 'Riprodurre fotografie per scopi commerciali',
    q4: 'Ripubblicare annunci su altre piattaforme',
    s22Title: '2.2 Proprietà intellettuale',
    s22Text1: 'Tutti i contenuti del Sito (testi, fotografie, loghi, design) sono di proprietà di Anclora Group o di terzi che ne hanno autorizzato l\'utilizzo.',
    s22Text2: 'L\'uso non autorizzato può costituire violazione del diritto d\'autore e dar luogo ad azioni legali.',
    s3Title: '3. Servizi di intermediazione immobiliare',
    s31Title: '3.1 Natura del servizio',
    s31Text: 'Anclora Group opera come intermediario professionale tra:',
    notLabel: 'NON siamo:',
    not1: 'Proprietari degli immobili pubblicati (salvo indicazione espressa)',
    not2: 'Sviluppatori immobiliari (salvo indicazione come progetti propri)',
    not3: 'Consulenti finanziari o fiscali',
    s32Title: '3.2 Commissioni di intermediazione',
    commStandard: 'Commissione standard: 3% + IVA sul prezzo di vendita (a carico dell\'acquirente)',
    commExclusive: 'Commissione per immobili in esclusiva: Secondo accordo individuale con il venditore',
    commEarned: 'La commissione matura:',
    ce1: 'Alla firma del contratto di compravendita (atto notarile)',
    ce2: 'O alla formalizzazione del contratto di caparra se così stipulato',
    commSpecial: 'Condizioni speciali:',
    cs1: 'Immobili > 5.000.000 €: Commissione negoziabile',
    cs2: 'Partner/Broker: Vedi Programma Partner',
    s4Title: '4. Informazioni sugli immobili',
    s41Title: '4.1 Accuratezza delle informazioni',
    s41Text: 'Facciamo sforzi ragionevoli per garantire l\'accuratezza delle informazioni, ma:',
    w1: 'Descrizioni, fotografie e planimetrie hanno carattere indicativo',
    w2: 'I prezzi sono soggetti a variazioni senza preavviso',
    w3: 'Le superfici sono indicative (da verificare con documentazione ufficiale)',
    w4: 'Lo stato giuridico/urbanistico deve essere verificato con il venditore/notaio',
    recommend: 'Si raccomanda vivamente:',
    r1: 'Due diligence legale completa',
    r2: 'Ispezione fisica dell\'immobile',
    r3: 'Verifica catastale e ipotecaria',
    r4: 'Consulenza con un architetto (se si prevede ristrutturazione/ampliamento)',
    s42Title: '4.2 Disponibilità',
    s42Text1: 'Gli immobili potrebbero essere stati venduti, ritirati o avere avuto il prezzo modificato senza che tale informazione venga immediatamente aggiornata sul Sito.',
    s42Text2: 'Anclora Group non è responsabile dell\'indisponibilità degli immobili pubblicati.',
    s5Title: '5. Dati di mercato e investimento',
    s5Text1: 'I dati di mercato, le stime di rendimento e le proiezioni hanno carattere puramente informativo.',
    s5NotLabel: 'Ciò NON costituisce:',
    s5not1: 'Consulenza in materia di investimenti',
    s5not2: 'Rendimenti garantiti',
    s5not3: 'Raccomandazione personalizzata',
    s5Consult: 'Consultare consulenti professionali prima di prendere decisioni di investimento.',
    s6Title: '6. Antiriciclaggio',
    s6Text1: 'Ai sensi della legge 10/2010 del 28 aprile, Anclora Group è soggetto agli obblighi in materia di antiriciclaggio.',
    s6Implies: 'Ciò implica:',
    s6i1: '1. Identificazione e verifica dei clienti (KYC)',
    s6i2: '2. Verifica dell\'origine dei fondi per transazioni > 10.000 €',
    s6i3: '3. Conservazione dei documenti per 10 anni',
    s6i4: '4. Possibile segnalazione al SEPBLAC di operazioni sospette',
    s6DocsLabel: 'Documentazione richiesta:',
    s6d1: 'Documento d\'identità/NIE/Passaporto in corso di validità',
    s6d2: 'Prova di residenza (certificato di residenza, bolletta)',
    s6d3: 'Dichiarazione di origine dei fondi (se applicabile)',
    s7Title: '7. Limitazione di responsabilità',
    s7Text: 'Anclora Group NON è responsabile per:',
    s7list1: 'Errori o omissioni nelle descrizioni degli immobili',
    s7list2: 'Vizi occulti degli immobili',
    s7list3: 'Inadempimenti contrattuali di venditori/acquirenti',
    s7list4: 'Perdite economiche derivanti da decisioni di investimento',
    s7list5: 'Interruzioni del servizio sul Sito',
    s7list6: 'Virus informatici o elementi dannosi',
    s7maxLiability: 'Responsabilità massima: Limitata agli onorari effettivamente percepiti da Anclora Group nella specifica transazione che ha causato il danno.',
    s8Title: '8. Modifiche',
    s8Text1: 'Anclora Group si riserva il diritto di modificare i presenti Termini e Condizioni in qualsiasi momento.',
    s8Notify: 'Le modifiche sostanziali saranno notificate tramite:',
    s8n1: 'Avviso ben visibile sul Sito',
    s8n2: 'E-mail agli utenti registrati',
    s8Continued: 'Il continuo utilizzo del Sito dopo la pubblicazione delle modifiche ne costituisce accettazione.',
    s9Title: '9. Risoluzione delle controversie',
    s91Title: '9.1 Mediazione preliminare',
    s91Text: 'Prima di adire le vie legali, le parti concordano di tentare di risolvere qualsiasi controversia tramite mediazione con il Collegio degli Agenti Immobiliari delle Baleari.',
    s92Title: '9.2 Giurisdizione e legge applicabile',
    s92Text: 'I presenti Termini sono disciplinati dalla legge spagnola. Per qualsiasi controversia, le parti si sottomettono ai Tribunali di Palma di Maiorca, salvo che la legge stabilisca una diversa giurisdizione obbligatoria.',
    s93Title: '9.3 Piattaforma europea per la risoluzione delle controversie online (UE)',
    s93Text: 'In conformità con il Regolamento (UE) 524/2013, i consumatori possono accedere alla piattaforma europea per la risoluzione delle controversie online:',
    s10Title: '10. Contatti',
    s10Text: 'Per domande sui presenti Termini e Condizioni:',
    confirmation: 'Utilizzando il Sito, l\'utente conferma di aver letto, compreso e accettato i presenti Termini e Condizioni.',
  },
  da: {
    backToHome: 'Tilbage til forsiden',
    title: 'Vilkår og betingelser',
    lastUpdated: 'Sidst opdateret: 24. januar 2026',
    intro: 'Ved at tilgå og bruge www.ancloraprivateestates.com ("Websitet") accepterer du at være bundet af disse vilkår og betingelser. Hvis du ikke accepterer dem, bedes du ikke bruge Websitet.',
    s1Title: '1. Accept af vilkår',
    s1Text: 'Ved at tilgå og bruge www.ancloraprivateestates.com ("Websitet") accepterer du at være bundet af disse vilkår og betingelser. Hvis du ikke accepterer dem, bedes du ikke bruge Websitet.',
    s2Title: '2. Tilladt brug af Websitet',
    s21Title: '2.1 Personlig og ikke-kommerciel brug',
    s21Text: 'Websitet er udelukkende beregnet til din personlige og ikke-kommercielle brug.',
    permitted: 'Tilladt:',
    p1: 'Browse publicerede ejendomme',
    p2: 'Kontakte Anclora for at anmode om oplysninger',
    p3: 'Dele links til specifikke ejendomme',
    prohibited: 'Forbudt:',
    q1: 'Kopiere indhold uden udtrykkelig tilladelse',
    q2: 'Bruge scrapers, bots eller automatiserede værktøjer',
    q3: 'Reproducere fotografier til kommercielle formål',
    q4: 'Genudgive opslag på andre platforme',
    s22Title: '2.2 Intellektuel ejendomsret',
    s22Text1: 'Alt indhold på Websitet (tekster, fotografier, logoer, design) tilhører Anclora Group eller tredjeparter, der har autoriseret dets anvendelse.',
    s22Text2: 'Uautoriseret brug kan udgøre en krænkelse af ophavsretten og give anledning til retlige skridt.',
    s3Title: '3. Ejendomsmæglertjenester',
    s31Title: '3.1 Tjenesteydelsens art',
    s31Text: 'Anclora Group fungerer som professionel mellemmand mellem:',
    notLabel: 'Vi er IKKE:',
    not1: 'Ejere af de publicerede ejendomme (medmindre udtrykkeligt angivet)',
    not2: 'Ejendomsudviklere (medmindre angivet som egne projekter)',
    not3: 'Finans- eller skatterådgivere',
    s32Title: '3.2 Formidlingsgebyrer',
    commStandard: 'Standardprovision: 3% + moms af salgsprisen (betales af køber)',
    commExclusive: 'Provision for eksklusive ejendomme: Ifølge individuel aftale med sælger',
    commEarned: 'Provisionen optjenes:',
    ce1: 'Når købsaftalen underskrives (skøde)',
    ce2: 'Eller når depositumkontrakten formaliseres, hvis dette er aftalt',
    commSpecial: 'Særlige betingelser:',
    cs1: 'Ejendomme > 5.000.000 €: Provision forhandles',
    cs2: 'Partnere/mæglere: Se Partnerprogram',
    s4Title: '4. Ejendomsoplysninger',
    s41Title: '4.1 Oplysningernes nøjagtighed',
    s41Text: 'Vi gør rimelige bestræbelser på at sikre oplysningernes nøjagtighed, men:',
    w1: 'Beskrivelser, fotografier og planer er vejledende',
    w2: 'Priser kan ændres uden forudgående varsel',
    w3: 'Arealer er omtrentlige (kontroller med officiel dokumentation)',
    w4: 'Juridisk/bygningsmæssig status skal verificeres med sælger/notar',
    recommend: 'Vi anbefaler på det kraftigste:',
    r1: 'Fuld juridisk due diligence',
    r2: 'Fysisk besigtigelse af ejendommen',
    r3: 'Matrikel- og tinglysningskontrol',
    r4: 'Konsultation med en arkitekt (ved planlagt renovering/udvidelse)',
    s42Title: '4.2 Tilgængelighed',
    s42Text1: 'Ejendomme kan være solgt, trukket tilbage eller have haft deres pris ændret uden at denne information straks opdateres på Websitet.',
    s42Text2: 'Anclora Group er ikke ansvarlig for manglende tilgængelighed af publicerede ejendomme.',
    s5Title: '5. Markedsdata og investering',
    s5Text1: 'Markedsdata, afkastestimater og prognoser er udelukkende til orientering.',
    s5NotLabel: 'Dette udgør IKKE:',
    s5not1: 'Investeringsrådgivning',
    s5not2: 'Garanterede afkast',
    s5not3: 'Personlig anbefaling',
    s5Consult: 'Konsulter professionelle rådgivere, inden du træffer investeringsbeslutninger.',
    s6Title: '6. Bekæmpelse af hvidvaskning af penge',
    s6Text1: 'I henhold til lov 10/2010 af 28. april er Anclora Group underlagt forpligtelser til bekæmpelse af hvidvaskning af penge.',
    s6Implies: 'Dette indebærer:',
    s6i1: '1. Kundeidentifikation og -verifikation (KYC)',
    s6i2: '2. Verifikation af midlernes oprindelse ved transaktioner > 10.000 €',
    s6i3: '3. Opbevaring af dokumenter i 10 år',
    s6i4: '4. Mulig indberetning til SEPBLAC af mistænkelige transaktioner',
    s6DocsLabel: 'Påkrævet dokumentation:',
    s6d1: 'Gyldigt ID/NIE/Pas',
    s6d2: 'Adressedokumentation (folkeregisterudskrift, forsyningsregning)',
    s6d3: 'Erklæring om midlernes oprindelse (hvis relevant)',
    s7Title: '7. Ansvarsbegrænsning',
    s7Text: 'Anclora Group er IKKE ansvarlig for:',
    s7list1: 'Fejl eller udeladelser i ejendomsbeskrivelser',
    s7list2: 'Skjulte fejl ved ejendomme',
    s7list3: 'Kontraktbrud fra sælgere/købere',
    s7list4: 'Økonomiske tab fra investeringsbeslutninger',
    s7list5: 'Serviceafbrydelser på Websitet',
    s7list6: 'Computervira eller skadelige elementer',
    s7maxLiability: 'Maksimalt ansvar: Begrænset til det honorar, som Anclora Group faktisk har modtaget i den specifikke transaktion, der forårsager skaden.',
    s8Title: '8. Ændringer',
    s8Text1: 'Anclora Group forbeholder sig ret til at ændre disse vilkår og betingelser til enhver tid.',
    s8Notify: 'Væsentlige ændringer vil blive meddelt via:',
    s8n1: 'Fremtrædende meddelelse på Websitet',
    s8n2: 'E-mail til registrerede brugere',
    s8Continued: 'Fortsat brug af Websitet efter offentliggørelse af ændringer udgør accept.',
    s9Title: '9. Tvistbilæggelse',
    s91Title: '9.1 Forudgående mægling',
    s91Text: 'Inden parterne indleder retssag, er de enige om at forsøge at løse enhver tvist ved mægling med Ejendomsmæglerforeningen på Balearerne.',
    s92Title: '9.2 Værneting og gældende ret',
    s92Text: 'Disse vilkår er underlagt spansk ret. For enhver tvist underkaster parterne sig domstolene i Palma de Mallorca, medmindre loven foreskriver en anden obligatorisk jurisdiktion.',
    s93Title: '9.3 EU\'s platform for onlinetvistelæggelse',
    s93Text: 'I overensstemmelse med forordning (EU) 524/2013 kan forbrugere tilgå den europæiske platform for onlinetvistelæggelse:',
    s10Title: '10. Kontakt',
    s10Text: 'Har du spørgsmål om disse vilkår og betingelser:',
    confirmation: 'Ved at bruge Websitet bekræfter du, at du har læst, forstået og accepteret disse vilkår og betingelser.',
  },
  nl: {
    backToHome: 'Terug naar home',
    title: 'Algemene Voorwaarden',
    lastUpdated: 'Laatste update: 24 januari 2026',
    intro: 'Door toegang te krijgen tot en gebruik te maken van www.ancloraprivateestates.com (de "Website") gaat u akkoord met deze Algemene Voorwaarden. Als u niet akkoord gaat, verzoeken wij u de Website niet te gebruiken.',
    s1Title: '1. Aanvaarding van de voorwaarden',
    s1Text: 'Door toegang te krijgen tot en gebruik te maken van www.ancloraprivateestates.com (de "Website") gaat u akkoord met deze Algemene Voorwaarden. Als u niet akkoord gaat, verzoeken wij u de Website niet te gebruiken.',
    s2Title: '2. Toegestaan gebruik van de Website',
    s21Title: '2.1 Persoonlijk en niet-commercieel gebruik',
    s21Text: 'De Website is uitsluitend bedoeld voor uw persoonlijk en niet-commercieel gebruik.',
    permitted: 'Toegestaan:',
    p1: 'Gepubliceerde vastgoedprojecten bekijken',
    p2: 'Contact opnemen met Anclora om informatie te vragen',
    p3: 'Links naar specifieke vastgoedprojecten delen',
    prohibited: 'Verboden:',
    q1: 'Inhoud kopiëren zonder uitdrukkelijke toestemming',
    q2: 'Scrapers, bots of geautomatiseerde tools gebruiken',
    q3: 'Foto\'s voor commerciële doeleinden reproduceren',
    q4: 'Vermeldingen op andere platforms opnieuw publiceren',
    s22Title: '2.2 Intellectuele eigendom',
    s22Text1: 'Alle inhoud op de Website (teksten, foto\'s, logo\'s, designs) is eigendom van Anclora Group of van derden die het gebruik hebben geautoriseerd.',
    s22Text2: 'Ongeautoriseerd gebruik kan een inbreuk op het auteursrecht vormen en aanleiding geven tot juridische stappen.',
    s3Title: '3. Vastgoedmakelaarsdiensten',
    s31Title: '3.1 Aard van de dienst',
    s31Text: 'Anclora Group treedt op als professionele tussenpersoon tussen:',
    notLabel: 'Wij zijn GEEN:',
    not1: 'Eigenaren van de gepubliceerde vastgoedprojecten (tenzij uitdrukkelijk vermeld)',
    not2: 'Vastgoedontwikkelaars (tenzij vermeld als eigen projecten)',
    not3: 'Financiële of fiscale adviseurs',
    s32Title: '3.2 Bemiddelingskosten',
    commStandard: 'Standaardprovisie: 3% + btw op de verkoopprijs (te betalen door de koper)',
    commExclusive: 'Provisie voor exclusieve panden: Volgens individuele overeenkomst met de verkoper',
    commEarned: 'De provisie wordt verdiend:',
    ce1: 'Bij ondertekening van het koopcontract (notariële akte)',
    ce2: 'Of bij formalisering van het voorlopig koopcontract indien zo bepaald',
    commSpecial: 'Bijzondere voorwaarden:',
    cs1: 'Panden > € 5.000.000: Provisie onderhandelbaar',
    cs2: 'Partners/makelaars: Zie Partnerprogramma',
    s4Title: '4. Informatie over vastgoed',
    s41Title: '4.1 Nauwkeurigheid van informatie',
    s41Text: 'Wij stellen alles in het werk om de nauwkeurigheid van informatie te waarborgen, maar:',
    w1: 'Beschrijvingen, foto\'s en plattegronden zijn indicatief',
    w2: 'Prijzen kunnen zonder voorafgaande kennisgeving wijzigen',
    w3: 'Oppervlakten zijn bij benadering (te verifiëren met officiële documentatie)',
    w4: 'Juridische/bestemmingsstatus moet worden geverifieerd bij de verkoper/notaris',
    recommend: 'Wij raden sterk aan:',
    r1: 'Volledige juridische due diligence',
    r2: 'Fysieke inspectie van het pand',
    r3: 'Kadastrale en hypothecaire verificatie',
    r4: 'Overleg met een architect (bij geplande renovatie/uitbreiding)',
    s42Title: '4.2 Beschikbaarheid',
    s42Text1: 'Vastgoedprojecten kunnen zijn verkocht, teruggetrokken of een prijswijziging hebben ondergaan zonder dat deze informatie onmiddellijk op de Website wordt bijgewerkt.',
    s42Text2: 'Anclora Group is niet verantwoordelijk voor de onbeschikbaarheid van gepubliceerde vastgoedprojecten.',
    s5Title: '5. Marktgegevens en beleggingen',
    s5Text1: 'Marktgegevens, rendementsschattingen en prognoses zijn uitsluitend ter informatie.',
    s5NotLabel: 'Dit vormt GEEN:',
    s5not1: 'Beleggingsadvies',
    s5not2: 'Gegarandeerde rendementen',
    s5not3: 'Gepersonaliseerde aanbeveling',
    s5Consult: 'Raadpleeg professionele adviseurs voordat u beleggingsbeslissingen neemt.',
    s6Title: '6. Witwaspreventie',
    s6Text1: 'Op grond van wet 10/2010 van 28 april is Anclora Group onderworpen aan witwaspreventie-verplichtingen.',
    s6Implies: 'Dit houdt in:',
    s6i1: '1. Identificatie en verificatie van klanten (KYC)',
    s6i2: '2. Verificatie van de herkomst van gelden bij transacties > € 10.000',
    s6i3: '3. Bewaring van documenten gedurende 10 jaar',
    s6i4: '4. Mogelijke melding van verdachte transacties aan SEPBLAC',
    s6DocsLabel: 'Vereiste documentatie:',
    s6d1: 'Geldig ID/NIE/Paspoort',
    s6d2: 'Adresbewijs (gemeentelijke inschrijving, nutsrekening)',
    s6d3: 'Verklaring van herkomst van gelden (indien van toepassing)',
    s7Title: '7. Beperking van aansprakelijkheid',
    s7Text: 'Anclora Group is NIET verantwoordelijk voor:',
    s7list1: 'Fouten of omissies in vastgoedbeschrijvingen',
    s7list2: 'Verborgen gebreken in vastgoed',
    s7list3: 'Contractuele tekortkomingen van verkopers/kopers',
    s7list4: 'Financiële verliezen als gevolg van beleggingsbeslissingen',
    s7list5: 'Serviceonderbrekingen op de Website',
    s7list6: 'Computervirussen of schadelijke elementen',
    s7maxLiability: 'Maximale aansprakelijkheid: Beperkt tot de honoraria die Anclora Group daadwerkelijk heeft ontvangen in de specifieke transactie die de schade veroorzaakt.',
    s8Title: '8. Wijzigingen',
    s8Text1: 'Anclora Group behoudt zich het recht voor deze Algemene Voorwaarden te allen tijde te wijzigen.',
    s8Notify: 'Wezenlijke wijzigingen worden meegedeeld via:',
    s8n1: 'Prominente kennisgeving op de Website',
    s8n2: 'E-mail aan geregistreerde gebruikers',
    s8Continued: 'Voortgezet gebruik van de Website na publicatie van wijzigingen geldt als aanvaarding.',
    s9Title: '9. Geschillenbeslechting',
    s91Title: '9.1 Voorafgaande mediation',
    s91Text: 'Alvorens naar de rechter te stappen, komen de partijen overeen te proberen elk geschil op te lossen via mediation bij de Orde van Vastgoedmakelaars van de Balearen.',
    s92Title: '9.2 Bevoegde rechter en toepasselijk recht',
    s92Text: 'Deze Voorwaarden worden beheerst door het Spaanse recht. Voor elk geschil onderwerpen de partijen zich aan de rechtbanken van Palma de Mallorca, tenzij de wet een andere verplichte bevoegde rechter bepaalt.',
    s93Title: '9.3 EU-platform voor onlinegeschillenbeslechting',
    s93Text: 'In overeenstemming met Verordening (EU) 524/2013 kunnen consumenten toegang krijgen tot het Europese platform voor onlinegeschillenbeslechting:',
    s10Title: '10. Contact',
    s10Text: 'Voor vragen over deze Algemene Voorwaarden:',
    confirmation: 'Door gebruik te maken van de Website bevestigt u dat u deze Algemene Voorwaarden heeft gelezen, begrepen en aanvaard.',
  },
  no: {
    backToHome: 'Tilbake til forsiden',
    title: 'Vilkår og betingelser',
    lastUpdated: 'Sist oppdatert: 24. januar 2026',
    intro: 'Ved å gå inn på og bruke www.ancloraprivateestates.com («Nettstedet») aksepterer du å være bundet av disse vilkårene og betingelsene. Hvis du ikke aksepterer dem, ber vi deg om ikke å bruke Nettstedet.',
    s1Title: '1. Aksept av vilkår',
    s1Text: 'Ved å gå inn på og bruke www.ancloraprivateestates.com («Nettstedet») aksepterer du å være bundet av disse vilkårene og betingelsene. Hvis du ikke aksepterer dem, ber vi deg om ikke å bruke Nettstedet.',
    s2Title: '2. Tillatt bruk av Nettstedet',
    s21Title: '2.1 Personlig og ikke-kommersiell bruk',
    s21Text: 'Nettstedet er utelukkende beregnet for din personlige og ikke-kommersielle bruk.',
    permitted: 'Tillatt:',
    p1: 'Bla gjennom publiserte eiendommer',
    p2: 'Kontakte Anclora for å be om informasjon',
    p3: 'Dele lenker til spesifikke eiendommer',
    prohibited: 'Forbudt:',
    q1: 'Kopiere innhold uten uttrykkelig tillatelse',
    q2: 'Bruke scrapers, bots eller automatiserte verktøy',
    q3: 'Reprodusere fotografier for kommersielle formål',
    q4: 'Gjengi annonser på andre plattformer',
    s22Title: '2.2 Immaterielle rettigheter',
    s22Text1: 'Alt innhold på Nettstedet (tekster, fotografier, logoer, design) tilhører Anclora Group eller tredjeparter som har autorisert bruken.',
    s22Text2: 'Uautorisert bruk kan utgjøre opphavsrettskrenkelse og gi grunnlag for rettslige skritt.',
    s3Title: '3. Eiendomsmeglertjenester',
    s31Title: '3.1 Tjenestens art',
    s31Text: 'Anclora Group opptrer som profesjonell mellommann mellom:',
    notLabel: 'Vi er IKKE:',
    not1: 'Eiere av de publiserte eiendommene (med mindre uttrykkelig angitt)',
    not2: 'Eiendomsutviklere (med mindre angitt som egne prosjekter)',
    not3: 'Finans- eller skatterådgivere',
    s32Title: '3.2 Formidlingsgebyrer',
    commStandard: 'Standardprovisjon: 3% + mva av salgsprisen (betales av kjøper)',
    commExclusive: 'Provisjon for eksklusive eiendommer: I henhold til individuell avtale med selger',
    commEarned: 'Provisjonen opptjenes:',
    ce1: 'Når kjøpekontrakten undertegnes (skjøte)',
    ce2: 'Eller når depositumkontrakten formaliseres hvis dette er avtalt',
    commSpecial: 'Særlige betingelser:',
    cs1: 'Eiendommer > 5 000 000 €: Provisjon kan forhandles',
    cs2: 'Partnere/meglere: Se Partnerprogram',
    s4Title: '4. Eiendomsinformasjon',
    s41Title: '4.1 Informasjonens nøyaktighet',
    s41Text: 'Vi gjør rimelige anstrengelser for å sikre informasjonens nøyaktighet, men:',
    w1: 'Beskrivelser, fotografier og plantegninger er veiledende',
    w2: 'Priser kan endres uten forhåndsvarsel',
    w3: 'Arealer er omtrentlige (kontroller med offisiell dokumentasjon)',
    w4: 'Juridisk/reguleringstatus må verifiseres med selger/notar',
    recommend: 'Vi anbefaler på det sterkeste:',
    r1: 'Fullstendig juridisk due diligence',
    r2: 'Fysisk besiktigelse av eiendommen',
    r3: 'Matrikkels- og grunnboksverifisering',
    r4: 'Konsultasjon med arkitekt (ved planlagt renovering/utbygging)',
    s42Title: '4.2 Tilgjengelighet',
    s42Text1: 'Eiendommer kan ha blitt solgt, trukket tilbake eller fått endret pris uten at denne informasjonen umiddelbart oppdateres på Nettstedet.',
    s42Text2: 'Anclora Group er ikke ansvarlig for manglende tilgjengelighet av publiserte eiendommer.',
    s5Title: '5. Markedsdata og investering',
    s5Text1: 'Markedsdata, avkastningsestimater og prognoser er utelukkende til informasjonsformål.',
    s5NotLabel: 'Dette utgjør IKKE:',
    s5not1: 'Investeringsrådgivning',
    s5not2: 'Garantert avkastning',
    s5not3: 'Personlig anbefaling',
    s5Consult: 'Konsulter profesjonelle rådgivere før du tar investeringsbeslutninger.',
    s6Title: '6. Tiltak mot hvitvasking av penger',
    s6Text1: 'I henhold til lov 10/2010 av 28. april er Anclora Group underlagt forpliktelser vedrørende tiltak mot hvitvasking av penger.',
    s6Implies: 'Dette innebærer:',
    s6i1: '1. Kundeidentifikasjon og -verifikasjon (KYC)',
    s6i2: '2. Verifikasjon av midlenes opprinnelse ved transaksjoner > 10 000 €',
    s6i3: '3. Dokumentoppbevaring i 10 år',
    s6i4: '4. Mulig rapportering av mistenkelige transaksjoner til SEPBLAC',
    s6DocsLabel: 'Nødvendig dokumentasjon:',
    s6d1: 'Gyldig ID/NIE/Pass',
    s6d2: 'Adressedokumentasjon (folkeregisterutskrift, regning)',
    s6d3: 'Erklæring om midlenes opprinnelse (hvis relevant)',
    s7Title: '7. Ansvarsbegrensning',
    s7Text: 'Anclora Group er IKKE ansvarlig for:',
    s7list1: 'Feil eller utelatelser i eiendomsbeskrivelser',
    s7list2: 'Skjulte feil ved eiendommer',
    s7list3: 'Kontraktbrudd fra selgere/kjøpere',
    s7list4: 'Økonomiske tap fra investeringsbeslutninger',
    s7list5: 'Tjenesteavbrudd på Nettstedet',
    s7list6: 'Datavirus eller skadelige elementer',
    s7maxLiability: 'Maksimalt ansvar: Begrenset til det honoraret Anclora Group faktisk har mottatt i den spesifikke transaksjonen som forårsaker skaden.',
    s8Title: '8. Endringer',
    s8Text1: 'Anclora Group forbeholder seg retten til å endre disse vilkårene og betingelsene til enhver tid.',
    s8Notify: 'Vesentlige endringer vil bli varslet via:',
    s8n1: 'Fremtredende varsel på Nettstedet',
    s8n2: 'E-post til registrerte brukere',
    s8Continued: 'Fortsatt bruk av Nettstedet etter publisering av endringer utgjør aksept.',
    s9Title: '9. Tvisteløsning',
    s91Title: '9.1 Forutgående megling',
    s91Text: 'Før partene går til retten, er de enige om å forsøke å løse enhver tvist gjennom megling med Eiendomsmeglerforeningen på Balearene.',
    s92Title: '9.2 Verneting og gjeldende rett',
    s92Text: 'Disse vilkårene er underlagt spansk rett. For enhver tvist underkastede partene seg domstolene i Palma de Mallorca, med mindre loven fastsetter en annen obligatorisk jurisdiksjon.',
    s93Title: '9.3 EUs plattform for nettbasert tvisteløsning',
    s93Text: 'I samsvar med forordning (EU) 524/2013 kan forbrukere få tilgang til den europeiske plattformen for nettbasert tvisteløsning:',
    s10Title: '10. Kontakt',
    s10Text: 'For spørsmål om disse vilkårene og betingelsene:',
    confirmation: 'Ved å bruke Nettstedet bekrefter du at du har lest, forstått og akseptert disse vilkårene og betingelsene.',
  },
  pt: {
    backToHome: 'Voltar ao início',
    title: 'Termos e Condições',
    lastUpdated: 'Última atualização: 24 de janeiro de 2026',
    intro: 'Ao aceder e utilizar www.ancloraprivateestates.com (o «Sítio Web»), aceita ficar vinculado pelos presentes Termos e Condições. Se não concordar, solicitamos que não utilize o Sítio Web.',
    s1Title: '1. Aceitação dos Termos',
    s1Text: 'Ao aceder e utilizar www.ancloraprivateestates.com (o «Sítio Web»), aceita ficar vinculado pelos presentes Termos e Condições. Se não concordar, solicitamos que não utilize o Sítio Web.',
    s2Title: '2. Utilização Permitida do Sítio Web',
    s21Title: '2.1 Uso Pessoal e Não Comercial',
    s21Text: 'O Sítio Web destina-se exclusivamente ao seu uso pessoal e não comercial.',
    permitted: 'Permitido:',
    p1: 'Consultar as propriedades publicadas',
    p2: 'Contactar a Anclora para solicitar informações',
    p3: 'Partilhar ligações para propriedades específicas',
    prohibited: 'Proibido:',
    q1: 'Copiar conteúdos sem autorização expressa',
    q2: 'Utilizar scrapers, bots ou ferramentas automatizadas',
    q3: 'Reproduzir fotografias para fins comerciais',
    q4: 'Republicar anúncios noutras plataformas',
    s22Title: '2.2 Propriedade Intelectual',
    s22Text1: 'Todos os conteúdos do Sítio Web (textos, fotografias, logótipos, designs) são propriedade da Anclora Group ou de terceiros que autorizaram a sua utilização.',
    s22Text2: 'A utilização não autorizada pode constituir violação dos direitos de autor e dar origem a ações legais.',
    s3Title: '3. Serviços de Intermediação Imobiliária',
    s31Title: '3.1 Natureza do Serviço',
    s31Text: 'A Anclora Group atua como intermediária profissional entre:',
    notLabel: 'NÃO somos:',
    not1: 'Proprietários dos imóveis publicados (salvo indicação expressa)',
    not2: 'Promotores imobiliários (salvo indicação como projetos próprios)',
    not3: 'Consultores financeiros ou fiscais',
    s32Title: '3.2 Honorários de Intermediação',
    commStandard: 'Comissão padrão: 3% + IVA sobre o preço de venda (a cargo do comprador)',
    commExclusive: 'Comissão em imóveis em exclusividade: Segundo acordo individual com o vendedor',
    commEarned: 'A comissão é devida:',
    ce1: 'Quando o contrato de compra e venda é assinado (escritura pública)',
    ce2: 'Ou quando o contrato promessa é formalizado se assim estipulado',
    commSpecial: 'Condições especiais:',
    cs1: 'Imóveis > 5.000.000 €: Comissão negociável',
    cs2: 'Parceiros/Brokers: Ver Programa de Parceiros',
    s4Title: '4. Informação sobre Imóveis',
    s41Title: '4.1 Exatidão da Informação',
    s41Text: 'Fazemos esforços razoáveis para garantir a exatidão da informação, mas:',
    w1: 'As descrições, fotografias e plantas são indicativas',
    w2: 'Os preços estão sujeitos a alteração sem aviso prévio',
    w3: 'As áreas são aproximadas (verificar com documentação oficial)',
    w4: 'A situação legal/urbanística deve ser verificada com o vendedor/notário',
    recommend: 'Recomendamos vivamente:',
    r1: 'Due diligence legal completa',
    r2: 'Inspeção física do imóvel',
    r3: 'Verificação cadastral e registal',
    r4: 'Consulta com arquiteto (se estiver prevista renovação/ampliação)',
    s42Title: '4.2 Disponibilidade',
    s42Text1: 'Os imóveis podem ter sido vendidos, retirados ou ter tido o preço alterado sem que essa informação seja imediatamente atualizada no Sítio Web.',
    s42Text2: 'A Anclora Group não é responsável pela indisponibilidade dos imóveis publicados.',
    s5Title: '5. Dados de Mercado e Investimento',
    s5Text1: 'Os dados de mercado, estimativas de rentabilidade e projeções têm carácter meramente informativo.',
    s5NotLabel: 'Isto NÃO constitui:',
    s5not1: 'Aconselhamento de investimento',
    s5not2: 'Rentabilidades garantidas',
    s5not3: 'Recomendação personalizada',
    s5Consult: 'Consulte consultores profissionais antes de tomar decisões de investimento.',
    s6Title: '6. Prevenção do Branqueamento de Capitais',
    s6Text1: 'Nos termos da Lei 10/2010, de 28 de abril, a Anclora Group está sujeita a obrigações em matéria de prevenção do branqueamento de capitais.',
    s6Implies: 'Isto implica:',
    s6i1: '1. Identificação e verificação de clientes (KYC)',
    s6i2: '2. Verificação da origem dos fundos em transações > 10.000 €',
    s6i3: '3. Conservação de documentação durante 10 anos',
    s6i4: '4. Possível comunicação ao SEPBLAC de operações suspeitas',
    s6DocsLabel: 'Documentação exigida:',
    s6d1: 'BI/NIE/Passaporte válido',
    s6d2: 'Comprovativo de morada (recenseamento, fatura de serviço)',
    s6d3: 'Declaração de origem de fundos (se aplicável)',
    s7Title: '7. Limitação de Responsabilidade',
    s7Text: 'A Anclora Group NÃO é responsável por:',
    s7list1: 'Erros ou omissões nas descrições dos imóveis',
    s7list2: 'Defeitos ocultos dos imóveis',
    s7list3: 'Incumprimentos contratuais de vendedores/compradores',
    s7list4: 'Perdas económicas decorrentes de decisões de investimento',
    s7list5: 'Interrupções do serviço no Sítio Web',
    s7list6: 'Vírus informáticos ou elementos prejudiciais',
    s7maxLiability: 'Responsabilidade máxima: Limitada aos honorários efetivamente recebidos pela Anclora Group na operação específica que origina o dano.',
    s8Title: '8. Modificações',
    s8Text1: 'A Anclora Group reserva-se o direito de modificar os presentes Termos e Condições a qualquer momento.',
    s8Notify: 'As alterações substanciais serão notificadas através de:',
    s8n1: 'Aviso destacado no Sítio Web',
    s8n2: 'Correio eletrónico aos utilizadores registados',
    s8Continued: 'A utilização continuada do Sítio Web após a publicação das alterações constitui a sua aceitação.',
    s9Title: '9. Resolução de Litígios',
    s91Title: '9.1 Mediação Prévia',
    s91Text: 'Antes de recorrer aos tribunais, as partes concordam em tentar resolver qualquer litígio através de mediação junto da Ordem dos Agentes Imobiliários das Ilhas Baleares.',
    s92Title: '9.2 Jurisdição e Lei Aplicável',
    s92Text: 'Estes Termos são regidos pela lei espanhola. Para qualquer litígio, as partes submetem-se aos Tribunais de Palma de Maiorca, salvo quando a lei estabeleça uma jurisdição obrigatória diferente.',
    s93Title: '9.3 Plataforma de Resolução de Litígios em Linha (UE)',
    s93Text: 'Em conformidade com o Regulamento (UE) 524/2013, os consumidores podem aceder à plataforma europeia de resolução de litígios em linha:',
    s10Title: '10. Contacto',
    s10Text: 'Para questões sobre estes Termos e Condições:',
    confirmation: 'Ao utilizar o Sítio Web, confirma que leu, compreendeu e aceitou os presentes Termos e Condições.',
  },
};

export function TermsPage() {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) as LocaleKey) in content
    ? (i18n.language.slice(0, 2) as LocaleKey)
    : 'en';
  const c = content[lang] ?? content['en'];

  return (
    <div className="min-h-screen bg-anclora-teal">
      {/* Header */}
      <div className="w-full px-6 lg:px-12 py-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-anclora-gold hover:text-anclora-gold-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {c.backToHome}
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 lg:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-anclora-cream mb-4">
            {c.title}
          </h1>
          <p className="text-anclora-text-muted mb-12">
            {c.lastUpdated}
          </p>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-anclora-teal-bg/50 rounded-2xl p-8 border border-white/10 mb-12">
              <p className="text-anclora-text-muted leading-relaxed m-0">
                {c.intro}
              </p>
            </div>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s1Title}</h2>
            <p className="text-anclora-text-muted">{c.s1Text}</p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s2Title}</h2>
            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s21Title}</h3>
            <p className="text-anclora-text-muted">{c.s21Text}</p>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.permitted}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>✅ {c.p1}</li>
              <li>✅ {c.p2}</li>
              <li>✅ {c.p3}</li>
            </ul>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.prohibited}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>❌ {c.q1}</li>
              <li>❌ {c.q2}</li>
              <li>❌ {c.q3}</li>
              <li>❌ {c.q4}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s22Title}</h3>
            <p className="text-anclora-text-muted">{c.s22Text1}</p>
            <p className="text-anclora-text-muted">{c.s22Text2}</p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s3Title}</h2>
            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s31Title}</h3>
            <p className="text-anclora-text-muted">{c.s31Text}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>Buyers/Tenants (Demand)</li>
              <li>Sellers/Owners/Developers (Supply)</li>
            </ul>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.notLabel}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>❌ {c.not1}</li>
              <li>❌ {c.not2}</li>
              <li>❌ {c.not3}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s32Title}</h3>
            <p className="text-anclora-text-muted">
              <strong className="text-anclora-cream">{c.commStandard.split(':')[0]}:</strong> {c.commStandard.split(':').slice(1).join(':').trim()}<br />
              <strong className="text-anclora-cream">{c.commExclusive.split(':')[0]}:</strong> {c.commExclusive.split(':').slice(1).join(':').trim()}
            </p>
            <p className="text-anclora-text-muted">{c.commEarned}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.ce1}</li>
              <li>{c.ce2}</li>
            </ul>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.commSpecial}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.cs1}</li>
              <li>{c.cs2}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s4Title}</h2>
            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s41Title}</h3>
            <p className="text-anclora-text-muted">{c.s41Text}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>⚠️ {c.w1}</li>
              <li>⚠️ {c.w2}</li>
              <li>⚠️ {c.w3}</li>
              <li>⚠️ {c.w4}</li>
            </ul>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.recommend}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.r1}</li>
              <li>{c.r2}</li>
              <li>{c.r3}</li>
              <li>{c.r4}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s42Title}</h3>
            <p className="text-anclora-text-muted">{c.s42Text1}</p>
            <p className="text-anclora-text-muted">{c.s42Text2}</p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s5Title}</h2>
            <p className="text-anclora-text-muted">
              {c.s5Text1.includes('informational purposes only')
                ? <>{c.s5Text1.replace('informational purposes only', '')}<strong className="text-anclora-cream">informational purposes only</strong>.</>
                : c.s5Text1
              }
            </p>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.s5NotLabel}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>❌ {c.s5not1}</li>
              <li>❌ {c.s5not2}</li>
              <li>❌ {c.s5not3}</li>
            </ul>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.s5Consult}</strong></p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s6Title}</h2>
            <p className="text-anclora-text-muted">{c.s6Text1}</p>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.s6Implies}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.s6i1}</li>
              <li>{c.s6i2}</li>
              <li>{c.s6i3}</li>
              <li>{c.s6i4}</li>
            </ul>
            <p className="text-anclora-text-muted"><strong className="text-anclora-cream">{c.s6DocsLabel}</strong></p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.s6d1}</li>
              <li>{c.s6d2}</li>
              <li>{c.s6d3}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s7Title}</h2>
            <p className="text-anclora-text-muted">{c.s7Text}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>❌ {c.s7list1}</li>
              <li>❌ {c.s7list2}</li>
              <li>❌ {c.s7list3}</li>
              <li>❌ {c.s7list4}</li>
              <li>❌ {c.s7list5}</li>
              <li>❌ {c.s7list6}</li>
            </ul>
            <p className="text-anclora-text-muted">
              <strong className="text-anclora-cream">{c.s7maxLiability.split(':')[0]}:</strong> {c.s7maxLiability.split(':').slice(1).join(':').trim()}
            </p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s8Title}</h2>
            <p className="text-anclora-text-muted">{c.s8Text1}</p>
            <p className="text-anclora-text-muted">{c.s8Notify}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.s8n1}</li>
              <li>{c.s8n2}</li>
            </ul>
            <p className="text-anclora-text-muted">{c.s8Continued}</p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s9Title}</h2>
            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s91Title}</h3>
            <p className="text-anclora-text-muted">{c.s91Text}</p>
            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s92Title}</h3>
            <p className="text-anclora-text-muted">{c.s92Text}</p>
            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.s93Title}</h3>
            <p className="text-anclora-text-muted">
              {c.s93Text}{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-anclora-gold hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.s10Title}</h2>
            <p className="text-anclora-text-muted">{c.s10Text}</p>
            <p className="text-anclora-text-muted">
              📧 <a href="mailto:legal@ancloraprivateestates.com" className="text-anclora-gold hover:underline">
                legal@ancloraprivateestates.com
              </a><br />
              📞 +34 971 000 000<br />
              📬 Paseo del Borne, 15, 07012 Palma de Mallorca
            </p>

            <div className="bg-anclora-gold/10 rounded-2xl p-6 border border-anclora-gold/30 mt-12">
              <p className="text-anclora-cream m-0">
                <strong>{c.confirmation}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
