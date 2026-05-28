import { ArrowLeft, Shield, CheckCircle, Leaf, Users, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type LocaleKey = 'es' | 'ca' | 'de' | 'en' | 'sv' | 'fr' | 'it' | 'da' | 'nl' | 'no' | 'pt';

interface Principle {
  icon: typeof Shield;
  title: string;
  description: string;
}

interface EthicsContent {
  backToHome: string;
  title: string;
  subtitle: string;
  intro: string;
  introTransparency: string;
  introIntegrity: string;
  introConfidentiality: string;
  p1Title: string; p1Desc: string;
  p2Title: string; p2Desc: string;
  p3Title: string; p3Desc: string;
  p4Title: string; p4Desc: string;
  p5Title: string; p5Desc: string;
  commitmentsTitle: string;
  toClientsTitle: string;
  tc1: string; tc2: string; tc3: string; tc4: string; tc5: string; tc6: string;
  toOwnersTitle: string;
  to1: string; to2: string; to3: string; to4: string; to5: string;
  toCommunityTitle: string;
  tcom1: string; tcom2: string; tcom3: string; tcom4: string; tcom5: string;
  toProfessionTitle: string;
  tp1: string; tp2: string; tp3: string; tp4: string; tp5: string;
  amlTitle: string;
  amlIntro: string;
  aml1: string; aml2: string; aml3: string; aml4: string; aml5: string;
  complaintsTitle: string;
  complaintsIntro: string;
  complaintsResponse: string;
  closingText: string;
}

const content: Record<LocaleKey, EthicsContent> = {
  en: {
    backToHome: 'Back to home',
    title: 'Code of Ethics',
    subtitle: 'The principles that guide everything we do',
    intro: "Anclora Group's Code of Ethics is based on",
    introTransparency: 'transparency',
    introIntegrity: 'integrity',
    introConfidentiality: 'absolute confidentiality',
    p1Title: 'Transparency', p1Desc: 'We operate with complete openness in all our dealings. All property information is presented accurately, and we disclose all relevant details to our clients.',
    p2Title: 'Integrity', p2Desc: "We uphold the highest ethical standards in every transaction. Our recommendations are always based on our clients' best interests, not commission potential.",
    p3Title: 'Absolute Confidentiality', p3Desc: 'We understand the privacy needs of UHNWI clients. All client information is treated with the strictest confidentiality and protected by robust security measures.',
    p4Title: 'Sustainable Development', p4Desc: 'We are committed to the sustainable development of the Balearic Islands. We promote properties that respect the environment and local communities.',
    p5Title: 'Professional Excellence', p5Desc: "We continuously invest in our team's training and development to maintain the highest standards of service in the luxury real estate sector.",
    commitmentsTitle: 'Our Commitments',
    toClientsTitle: 'To Our Clients',
    tc1: 'Provide accurate and complete property information',
    tc2: "Act in the client's best interest at all times",
    tc3: 'Maintain strict confidentiality of all client data',
    tc4: 'Disclose any potential conflicts of interest',
    tc5: 'Provide professional advice based on market knowledge',
    tc6: 'Respect client decisions without pressure',
    toOwnersTitle: 'To Property Owners',
    to1: 'Market properties professionally and ethically',
    to2: 'Provide regular updates on marketing activities',
    to3: 'Qualify potential buyers thoroughly',
    to4: 'Protect the property during viewings',
    to5: 'Negotiate fairly on behalf of the owner',
    toCommunityTitle: 'To the Community',
    tcom1: 'Respect and promote local culture and heritage',
    tcom2: 'Support sustainable development practices',
    tcom3: 'Comply with all applicable laws and regulations',
    tcom4: 'Contribute positively to the local economy',
    tcom5: 'Minimize environmental impact of our operations',
    toProfessionTitle: 'To Our Profession',
    tp1: 'Maintain high professional standards',
    tp2: 'Continue education and professional development',
    tp3: 'Collaborate fairly with other professionals',
    tp4: 'Uphold the reputation of the real estate industry',
    tp5: 'Comply with the code of conduct of the API College',
    amlTitle: 'Anti-Money Laundering Commitment',
    amlIntro: 'In compliance with Law 10/2010, of April 28, on the prevention of money laundering and terrorist financing, Anclora Private Estates:',
    aml1: 'Identifies and verifies all clients (KYC)',
    aml2: 'Verifies the origin of funds in transactions over €10,000',
    aml3: 'Maintains documentation for 10 years',
    aml4: 'Reports suspicious operations to SEPBLAC when required',
    aml5: 'Trains all staff in AML procedures',
    complaintsTitle: 'Complaints and Grievances',
    complaintsIntro: 'If you believe we have not met the standards set out in this Code of Ethics, please contact us:',
    complaintsResponse: 'All complaints will be handled confidentially and addressed within 15 business days.',
    closingText: 'This Code of Ethics is binding on all Anclora Private Estates employees, partners, and collaborators. Violations may result in disciplinary action, including termination of employment or business relationships.',
  },
  es: {
    backToHome: 'Volver al inicio',
    title: 'Código Ético',
    subtitle: 'Los principios que guían todo lo que hacemos',
    intro: 'El Código Ético de Anclora Group se basa en la',
    introTransparency: 'transparencia',
    introIntegrity: 'integridad',
    introConfidentiality: 'confidencialidad absoluta',
    p1Title: 'Transparencia', p1Desc: 'Operamos con total apertura en todas nuestras actuaciones. Toda la información sobre los inmuebles se presenta con exactitud y comunicamos todos los detalles relevantes a nuestros clientes.',
    p2Title: 'Integridad', p2Desc: 'Mantenemos los más altos estándares éticos en cada operación. Nuestras recomendaciones se basan siempre en el mejor interés del cliente, nunca en el potencial de comisión.',
    p3Title: 'Confidencialidad Absoluta', p3Desc: 'Comprendemos las necesidades de privacidad de los clientes UHNWI. Toda la información de los clientes se trata con la más estricta confidencialidad y está protegida por sólidas medidas de seguridad.',
    p4Title: 'Desarrollo Sostenible', p4Desc: 'Estamos comprometidos con el desarrollo sostenible de las Islas Baleares. Promovemos inmuebles que respetan el medio ambiente y las comunidades locales.',
    p5Title: 'Excelencia Profesional', p5Desc: 'Invertimos continuamente en la formación y el desarrollo de nuestro equipo para mantener los más altos estándares de servicio en el sector inmobiliario de lujo.',
    commitmentsTitle: 'Nuestros Compromisos',
    toClientsTitle: 'Con Nuestros Clientes',
    tc1: 'Proporcionar información exacta y completa sobre los inmuebles',
    tc2: 'Actuar siempre en el mejor interés del cliente',
    tc3: 'Mantener estricta confidencialidad de todos los datos del cliente',
    tc4: 'Revelar cualquier posible conflicto de intereses',
    tc5: 'Proporcionar asesoramiento profesional basado en el conocimiento del mercado',
    tc6: 'Respetar las decisiones del cliente sin presiones',
    toOwnersTitle: 'Con los Propietarios',
    to1: 'Comercializar los inmuebles de forma profesional y ética',
    to2: 'Proporcionar actualizaciones periódicas sobre las actividades de comercialización',
    to3: 'Calificar exhaustivamente a los posibles compradores',
    to4: 'Proteger el inmueble durante las visitas',
    to5: 'Negociar de forma justa en nombre del propietario',
    toCommunityTitle: 'Con la Comunidad',
    tcom1: 'Respetar y promover la cultura y el patrimonio local',
    tcom2: 'Apoyar las prácticas de desarrollo sostenible',
    tcom3: 'Cumplir todas las leyes y reglamentos aplicables',
    tcom4: 'Contribuir positivamente a la economía local',
    tcom5: 'Minimizar el impacto ambiental de nuestras operaciones',
    toProfessionTitle: 'Con Nuestra Profesión',
    tp1: 'Mantener altos estándares profesionales',
    tp2: 'Continuar con la formación y el desarrollo profesional',
    tp3: 'Colaborar de forma justa con otros profesionales',
    tp4: 'Mantener la reputación del sector inmobiliario',
    tp5: 'Cumplir el código de conducta del Colegio de API',
    amlTitle: 'Compromiso contra el Blanqueo de Capitales',
    amlIntro: 'En cumplimiento de la Ley 10/2010, de 28 de abril, de prevención del blanqueo de capitales y de la financiación del terrorismo, Anclora Private Estates:',
    aml1: 'Identifica y verifica a todos los clientes (KYC)',
    aml2: 'Verifica el origen de los fondos en operaciones superiores a 10.000 €',
    aml3: 'Conserva la documentación durante 10 años',
    aml4: 'Comunica al SEPBLAC las operaciones sospechosas cuando sea preciso',
    aml5: 'Forma a todo el personal en procedimientos de prevención del blanqueo de capitales',
    complaintsTitle: 'Quejas y Reclamaciones',
    complaintsIntro: 'Si considera que no hemos cumplido los estándares establecidos en este Código Ético, póngase en contacto con nosotros:',
    complaintsResponse: 'Todas las quejas serán tratadas de forma confidencial y atendidas en un plazo de 15 días hábiles.',
    closingText: 'Este Código Ético es vinculante para todos los empleados, socios y colaboradores de Anclora Private Estates. Las infracciones pueden dar lugar a medidas disciplinarias, incluida la rescisión de la relación laboral o empresarial.',
  },
  ca: {
    backToHome: 'Tornar a l\'inici',
    title: 'Codi Ètic',
    subtitle: 'Els principis que guien tot el que fem',
    intro: 'El Codi Ètic d\'Anclora Group es basa en la',
    introTransparency: 'transparència',
    introIntegrity: 'integritat',
    introConfidentiality: 'confidencialitat absoluta',
    p1Title: 'Transparència', p1Desc: 'Operem amb total obertura en totes les nostres actuacions. Tota la informació sobre els immobles es presenta amb exactitud i comuniquem tots els detalls rellevants als nostres clients.',
    p2Title: 'Integritat', p2Desc: 'Mantenim els estàndards ètics més elevats en cada operació. Les nostres recomanacions es basen sempre en el millor interès del client, mai en el potencial de comissió.',
    p3Title: 'Confidencialitat Absoluta', p3Desc: 'Entenem les necessitats de privacitat dels clients UHNWI. Tota la informació dels clients es tracta amb la màxima confidencialitat i està protegida per mesures de seguretat sòlides.',
    p4Title: 'Desenvolupament Sostenible', p4Desc: 'Estem compromesos amb el desenvolupament sostenible de les Illes Balears. Promovem immobles que respecten el medi ambient i les comunitats locals.',
    p5Title: 'Excel·lència Professional', p5Desc: 'Invertim contínuament en la formació i el desenvolupament del nostre equip per mantenir els estàndards de servei més elevats en el sector immobiliari de luxe.',
    commitmentsTitle: 'Els Nostres Compromisos',
    toClientsTitle: 'Amb els Nostres Clients',
    tc1: 'Proporcionar informació exacta i completa sobre els immobles',
    tc2: 'Actuar sempre en el millor interès del client',
    tc3: 'Mantenir estricta confidencialitat de totes les dades del client',
    tc4: 'Revelar qualsevol possible conflicte d\'interessos',
    tc5: 'Proporcionar assessorament professional basat en el coneixement del mercat',
    tc6: 'Respectar les decisions del client sense pressions',
    toOwnersTitle: 'Amb els Propietaris',
    to1: 'Comercialitzar els immobles de manera professional i ètica',
    to2: 'Proporcionar actualitzacions periòdiques sobre les activitats de comercialització',
    to3: 'Qualificar exhaustivament els possibles compradors',
    to4: 'Protegir l\'immoble durant les visites',
    to5: 'Negociar de manera justa en nom del propietari',
    toCommunityTitle: 'Amb la Comunitat',
    tcom1: 'Respectar i promoure la cultura i el patrimoni local',
    tcom2: 'Donar suport a les pràctiques de desenvolupament sostenible',
    tcom3: 'Complir totes les lleis i reglaments aplicables',
    tcom4: 'Contribuir positivament a l\'economia local',
    tcom5: 'Minimitzar l\'impacte ambiental de les nostres operacions',
    toProfessionTitle: 'Amb la Nostra Professió',
    tp1: 'Mantenir alts estàndards professionals',
    tp2: 'Continuar amb la formació i el desenvolupament professional',
    tp3: 'Col·laborar de manera justa amb altres professionals',
    tp4: 'Mantenir la reputació del sector immobiliari',
    tp5: 'Complir el codi de conducta del Col·legi d\'API',
    amlTitle: 'Compromís contra el Blanqueig de Capitals',
    amlIntro: 'En compliment de la Llei 10/2010, de 28 d\'abril, de prevenció del blanqueig de capitals i de finançament del terrorisme, Anclora Private Estates:',
    aml1: 'Identifica i verifica tots els clients (KYC)',
    aml2: 'Verifica l\'origen dels fons en operacions superiors a 10.000 €',
    aml3: 'Conserva la documentació durant 10 anys',
    aml4: 'Comunica al SEPBLAC les operacions sospitoses quan sigui necessari',
    aml5: 'Forma tot el personal en procediments de prevenció del blanqueig de capitals',
    complaintsTitle: 'Queixes i Reclamacions',
    complaintsIntro: 'Si considereu que no hem complert els estàndards establerts en aquest Codi Ètic, poseu-vos en contacte amb nosaltres:',
    complaintsResponse: 'Totes les queixes seran tractades de forma confidencial i ateses en un termini de 15 dies hàbils.',
    closingText: 'Aquest Codi Ètic és vinculant per a tots els empleats, socis i col·laboradors d\'Anclora Private Estates. Les infraccions poden donar lloc a mesures disciplinàries, inclosa la rescissió de la relació laboral o empresarial.',
  },
  de: {
    backToHome: 'Zur Startseite',
    title: 'Ethikkodex',
    subtitle: 'Die Grundsätze, die unser gesamtes Handeln leiten',
    intro: 'Der Ethikkodex der Anclora Group basiert auf',
    introTransparency: 'Transparenz',
    introIntegrity: 'Integrität',
    introConfidentiality: 'absoluter Vertraulichkeit',
    p1Title: 'Transparenz', p1Desc: 'Wir agieren in all unseren Geschäften mit vollständiger Offenheit. Alle Immobilieninformationen werden genau präsentiert und wir legen unseren Kunden alle relevanten Details offen.',
    p2Title: 'Integrität', p2Desc: 'Wir halten in jeder Transaktion höchste ethische Standards aufrecht. Unsere Empfehlungen basieren stets auf dem besten Interesse unserer Kunden, nicht auf dem Provisionspotenzial.',
    p3Title: 'Absolute Vertraulichkeit', p3Desc: 'Wir verstehen die Datenschutzbedürfnisse von UHNWI-Kunden. Alle Kundeninformationen werden mit strengster Vertraulichkeit behandelt und durch robuste Sicherheitsmaßnahmen geschützt.',
    p4Title: 'Nachhaltige Entwicklung', p4Desc: 'Wir sind dem nachhaltigen Entwicklung der Balearischen Inseln verpflichtet. Wir fördern Immobilien, die die Umwelt und die lokalen Gemeinschaften respektieren.',
    p5Title: 'Professionelle Exzellenz', p5Desc: 'Wir investieren kontinuierlich in die Ausbildung und Entwicklung unseres Teams, um die höchsten Servicestandards im Luxusimmobiliensektor aufrechtzuerhalten.',
    commitmentsTitle: 'Unsere Verpflichtungen',
    toClientsTitle: 'Gegenüber unseren Kunden',
    tc1: 'Genaue und vollständige Immobilieninformationen bereitstellen',
    tc2: 'Stets im besten Interesse des Kunden handeln',
    tc3: 'Strikte Vertraulichkeit aller Kundendaten wahren',
    tc4: 'Mögliche Interessenkonflikte offenlegen',
    tc5: 'Professionelle Beratung auf Basis von Marktkenntnis anbieten',
    tc6: 'Kundenentscheidungen ohne Druck respektieren',
    toOwnersTitle: 'Gegenüber Immobilieneigentümern',
    to1: 'Immobilien professionell und ethisch vermarkten',
    to2: 'Regelmäßige Updates zu Marketingaktivitäten bereitstellen',
    to3: 'Potenzielle Käufer gründlich qualifizieren',
    to4: 'Die Immobilie während Besichtigungen schützen',
    to5: 'Im Namen des Eigentümers fair verhandeln',
    toCommunityTitle: 'Gegenüber der Gemeinschaft',
    tcom1: 'Lokale Kultur und Erbe respektieren und fördern',
    tcom2: 'Nachhaltige Entwicklungspraktiken unterstützen',
    tcom3: 'Alle anwendbaren Gesetze und Vorschriften einhalten',
    tcom4: 'Positiv zur lokalen Wirtschaft beitragen',
    tcom5: 'Umweltauswirkungen unserer Tätigkeiten minimieren',
    toProfessionTitle: 'Gegenüber unserem Beruf',
    tp1: 'Hohe professionelle Standards aufrechterhalten',
    tp2: 'Weiterbildung und berufliche Entwicklung fortsetzen',
    tp3: 'Fair mit anderen Fachleuten zusammenarbeiten',
    tp4: 'Den Ruf der Immobilienbranche wahren',
    tp5: 'Den Verhaltenskodex des API-Verbandes einhalten',
    amlTitle: 'Geldwäschebekämpfungs-Verpflichtung',
    amlIntro: 'In Übereinstimmung mit Gesetz 10/2010 vom 28. April zur Verhinderung von Geldwäsche und Terrorismusfinanzierung, Anclora Private Estates:',
    aml1: 'Identifiziert und verifiziert alle Kunden (KYC)',
    aml2: 'Überprüft die Mittelherkunft bei Transaktionen über 10.000 €',
    aml3: 'Bewahrt Unterlagen 10 Jahre lang auf',
    aml4: 'Meldet verdächtige Transaktionen an SEPBLAC, wenn erforderlich',
    aml5: 'Schult alle Mitarbeiter in AML-Verfahren',
    complaintsTitle: 'Beschwerden und Beanstandungen',
    complaintsIntro: 'Wenn Sie der Ansicht sind, dass wir die in diesem Ethikkodex festgelegten Standards nicht eingehalten haben, kontaktieren Sie uns bitte:',
    complaintsResponse: 'Alle Beschwerden werden vertraulich behandelt und innerhalb von 15 Werktagen bearbeitet.',
    closingText: 'Dieser Ethikkodex ist für alle Mitarbeiter, Partner und Kooperationspartner von Anclora Private Estates verbindlich. Verstöße können zu Disziplinarmaßnahmen führen, einschließlich der Beendigung von Beschäftigungs- oder Geschäftsbeziehungen.',
  },
  sv: {
    backToHome: 'Tillbaka till startsidan',
    title: 'Uppförandekod',
    subtitle: 'De principer som vägleder allt vi gör',
    intro: 'Anclora Groups uppförandekod bygger på',
    introTransparency: 'transparens',
    introIntegrity: 'integritet',
    introConfidentiality: 'absolut konfidentialitet',
    p1Title: 'Transparens', p1Desc: 'Vi agerar med full öppenhet i alla våra affärer. All fastighetsinformation presenteras korrekt och vi redovisar alla relevanta detaljer för våra kunder.',
    p2Title: 'Integritet', p2Desc: 'Vi upprätthåller de högsta etiska standarderna i varje transaktion. Våra rekommendationer baseras alltid på kundernas bästa intresse, inte på provisionsintäkter.',
    p3Title: 'Absolut Konfidentialitet', p3Desc: 'Vi förstår UHNWI-kunders integritetsbehov. All kundinformation behandlas med striktast möjliga konfidentialitet och skyddas av robusta säkerhetsåtgärder.',
    p4Title: 'Hållbar Utveckling', p4Desc: 'Vi är engagerade i hållbar utveckling av Balearerna. Vi marknadsför fastigheter som respekterar miljön och lokala samhällen.',
    p5Title: 'Professionell Excellens', p5Desc: 'Vi investerar kontinuerligt i vårt teams utbildning och utveckling för att upprätthålla de högsta servicestandarderna inom lyxfastighetssektorn.',
    commitmentsTitle: 'Våra Åtaganden',
    toClientsTitle: 'Till Våra Kunder',
    tc1: 'Tillhandahålla korrekt och fullständig fastighetsinformation',
    tc2: 'Alltid agera i kundens bästa intresse',
    tc3: 'Upprätthålla strikt konfidentialitet för alla kunduppgifter',
    tc4: 'Redovisa eventuella intressekonflikter',
    tc5: 'Ge professionell rådgivning baserad på marknadskännedom',
    tc6: 'Respektera kundbeslut utan press',
    toOwnersTitle: 'Till Fastighetsägare',
    to1: 'Marknadsföra fastigheter professionellt och etiskt',
    to2: 'Tillhandahålla regelbundna uppdateringar om marknadsföringsaktiviteter',
    to3: 'Noggrant kvalificera potentiella köpare',
    to4: 'Skydda fastigheten under visningar',
    to5: 'Förhandla rättvist på ägarens vägnar',
    toCommunityTitle: 'Till Samhället',
    tcom1: 'Respektera och främja lokal kultur och arv',
    tcom2: 'Stödja hållbara utvecklingsmetoder',
    tcom3: 'Följa alla tillämpliga lagar och förordningar',
    tcom4: 'Bidra positivt till den lokala ekonomin',
    tcom5: 'Minimera miljöpåverkan av vår verksamhet',
    toProfessionTitle: 'Till Vår Profession',
    tp1: 'Upprätthålla höga professionella standarder',
    tp2: 'Fortsätta utbildning och professionell utveckling',
    tp3: 'Samarbeta rättvist med andra yrkesverksamma',
    tp4: 'Upprätthålla fastighetsbranschens rykte',
    tp5: 'Följa API-förbundets uppförandekod',
    amlTitle: 'Åtagande mot Penningtvätt',
    amlIntro: 'I enlighet med lag 10/2010 av den 28 april om förebyggande av penningtvätt och terrorismfinansiering, Anclora Private Estates:',
    aml1: 'Identifierar och verifierar alla kunder (KYC)',
    aml2: 'Verifierar ursprunget till medel vid transaktioner över 10 000 €',
    aml3: 'Bevarar dokumentation i 10 år',
    aml4: 'Rapporterar misstänkta transaktioner till SEPBLAC när så krävs',
    aml5: 'Utbildar all personal i AML-procedurer',
    complaintsTitle: 'Klagomål och Missnöje',
    complaintsIntro: 'Om du anser att vi inte har uppfyllt de standarder som anges i denna uppförandekod, vänligen kontakta oss:',
    complaintsResponse: 'Alla klagomål hanteras konfidentiellt och besvaras inom 15 arbetsdagar.',
    closingText: 'Denna uppförandekod är bindande för alla Anclora Private Estates anställda, partners och samarbetspartners. Överträdelser kan leda till disciplinära åtgärder, inklusive uppsägning av anställnings- eller affärsförhållanden.',
  },
  fr: {
    backToHome: 'Retour à l\'accueil',
    title: 'Code de Déontologie',
    subtitle: 'Les principes qui guident tout ce que nous faisons',
    intro: 'Le Code de déontologie d\'Anclora Group repose sur la',
    introTransparency: 'transparence',
    introIntegrity: 'l\'intégrité',
    introConfidentiality: 'la confidentialité absolue',
    p1Title: 'Transparence', p1Desc: 'Nous opérons avec une totale ouverture dans toutes nos activités. Toutes les informations sur les biens sont présentées avec exactitude et nous communiquons tous les détails pertinents à nos clients.',
    p2Title: 'Intégrité', p2Desc: 'Nous respectons les normes éthiques les plus élevées dans chaque transaction. Nos recommandations sont toujours fondées sur le meilleur intérêt de nos clients, et non sur le potentiel de commission.',
    p3Title: 'Confidentialité Absolue', p3Desc: 'Nous comprenons les besoins de confidentialité des clients UHNWI. Toutes les informations clients sont traitées avec la plus stricte confidentialité et protégées par des mesures de sécurité robustes.',
    p4Title: 'Développement Durable', p4Desc: 'Nous nous engageons en faveur du développement durable des Îles Baléares. Nous promouvons des biens qui respectent l\'environnement et les communautés locales.',
    p5Title: 'Excellence Professionnelle', p5Desc: 'Nous investissons continuellement dans la formation et le développement de notre équipe afin de maintenir les plus hauts standards de service dans le secteur de l\'immobilier de luxe.',
    commitmentsTitle: 'Nos Engagements',
    toClientsTitle: 'Envers Nos Clients',
    tc1: 'Fournir des informations précises et complètes sur les biens',
    tc2: 'Agir en toutes circonstances dans le meilleur intérêt du client',
    tc3: 'Maintenir la stricte confidentialité de toutes les données clients',
    tc4: 'Divulguer tout conflit d\'intérêts potentiel',
    tc5: 'Fournir des conseils professionnels basés sur la connaissance du marché',
    tc6: 'Respecter les décisions du client sans pression',
    toOwnersTitle: 'Envers les Propriétaires',
    to1: 'Commercialiser les biens de manière professionnelle et éthique',
    to2: 'Fournir des mises à jour régulières sur les activités de commercialisation',
    to3: 'Qualifier soigneusement les acheteurs potentiels',
    to4: 'Protéger le bien lors des visites',
    to5: 'Négocier équitablement au nom du propriétaire',
    toCommunityTitle: 'Envers la Communauté',
    tcom1: 'Respecter et promouvoir la culture et le patrimoine locaux',
    tcom2: 'Soutenir les pratiques de développement durable',
    tcom3: 'Respecter toutes les lois et réglementations applicables',
    tcom4: 'Contribuer positivement à l\'économie locale',
    tcom5: 'Minimiser l\'impact environnemental de nos activités',
    toProfessionTitle: 'Envers Notre Profession',
    tp1: 'Maintenir des normes professionnelles élevées',
    tp2: 'Poursuivre la formation et le développement professionnel',
    tp3: 'Collaborer équitablement avec les autres professionnels',
    tp4: 'Défendre la réputation du secteur immobilier',
    tp5: 'Respecter le code de conduite du Collège API',
    amlTitle: 'Engagement contre le Blanchiment de Capitaux',
    amlIntro: 'Conformément à la loi 10/2010 du 28 avril relative à la prévention du blanchiment de capitaux et du financement du terrorisme, Anclora Private Estates :',
    aml1: 'Identifie et vérifie tous les clients (KYC)',
    aml2: 'Vérifie l\'origine des fonds pour les transactions supérieures à 10 000 €',
    aml3: 'Conserve la documentation pendant 10 ans',
    aml4: 'Signale les opérations suspectes au SEPBLAC lorsque requis',
    aml5: 'Forme l\'ensemble du personnel aux procédures LCB',
    complaintsTitle: 'Réclamations et Plaintes',
    complaintsIntro: 'Si vous estimez que nous n\'avons pas respecté les normes énoncées dans ce Code de déontologie, veuillez nous contacter :',
    complaintsResponse: 'Toutes les réclamations seront traitées de manière confidentielle et feront l\'objet d\'une réponse dans un délai de 15 jours ouvrables.',
    closingText: 'Ce Code de déontologie est contraignant pour tous les employés, partenaires et collaborateurs d\'Anclora Private Estates. Tout manquement peut entraîner des mesures disciplinaires, y compris la rupture des relations de travail ou d\'affaires.',
  },
  it: {
    backToHome: 'Torna alla home',
    title: 'Codice Etico',
    subtitle: 'I principi che guidano tutto ciò che facciamo',
    intro: 'Il Codice Etico di Anclora Group si basa sulla',
    introTransparency: 'trasparenza',
    introIntegrity: 'integrità',
    introConfidentiality: 'assoluta riservatezza',
    p1Title: 'Trasparenza', p1Desc: 'Operiamo con totale apertura in tutte le nostre attività. Tutte le informazioni sugli immobili sono presentate con precisione e divulghiamo tutti i dettagli rilevanti ai nostri clienti.',
    p2Title: 'Integrità', p2Desc: 'Manteniamo i più elevati standard etici in ogni transazione. Le nostre raccomandazioni si basano sempre sul migliore interesse dei clienti, non sul potenziale di commissione.',
    p3Title: 'Riservatezza Assoluta', p3Desc: 'Comprendiamo le esigenze di privacy dei clienti UHNWI. Tutte le informazioni dei clienti sono trattate con la massima riservatezza e protette da solide misure di sicurezza.',
    p4Title: 'Sviluppo Sostenibile', p4Desc: 'Siamo impegnati nello sviluppo sostenibile delle Isole Baleari. Promuoviamo immobili che rispettano l\'ambiente e le comunità locali.',
    p5Title: 'Eccellenza Professionale', p5Desc: 'Investiamo continuamente nella formazione e nello sviluppo del nostro team per mantenere i più alti standard di servizio nel settore immobiliare di lusso.',
    commitmentsTitle: 'I Nostri Impegni',
    toClientsTitle: 'Verso i Nostri Clienti',
    tc1: 'Fornire informazioni accurate e complete sugli immobili',
    tc2: 'Agire sempre nel migliore interesse del cliente',
    tc3: 'Mantenere la stretta riservatezza di tutti i dati dei clienti',
    tc4: 'Divulgare eventuali conflitti di interesse',
    tc5: 'Fornire consulenza professionale basata sulla conoscenza del mercato',
    tc6: 'Rispettare le decisioni del cliente senza pressioni',
    toOwnersTitle: 'Verso i Proprietari',
    to1: 'Commercializzare gli immobili in modo professionale ed etico',
    to2: 'Fornire aggiornamenti periodici sulle attività di commercializzazione',
    to3: 'Qualificare accuratamente i potenziali acquirenti',
    to4: 'Proteggere l\'immobile durante le visite',
    to5: 'Negoziare equamente per conto del proprietario',
    toCommunityTitle: 'Verso la Comunità',
    tcom1: 'Rispettare e promuovere la cultura e il patrimonio locale',
    tcom2: 'Sostenere le pratiche di sviluppo sostenibile',
    tcom3: 'Rispettare tutte le leggi e i regolamenti applicabili',
    tcom4: 'Contribuire positivamente all\'economia locale',
    tcom5: 'Minimizzare l\'impatto ambientale delle nostre operazioni',
    toProfessionTitle: 'Verso la Nostra Professione',
    tp1: 'Mantenere elevati standard professionali',
    tp2: 'Continuare la formazione e lo sviluppo professionale',
    tp3: 'Collaborare equamente con altri professionisti',
    tp4: 'Mantenere la reputazione del settore immobiliare',
    tp5: 'Rispettare il codice di condotta del Collegio API',
    amlTitle: 'Impegno contro il Riciclaggio di Denaro',
    amlIntro: 'In conformità con la legge 10/2010 del 28 aprile sulla prevenzione del riciclaggio di denaro e del finanziamento del terrorismo, Anclora Private Estates:',
    aml1: 'Identifica e verifica tutti i clienti (KYC)',
    aml2: 'Verifica l\'origine dei fondi nelle transazioni superiori a 10.000 €',
    aml3: 'Conserva la documentazione per 10 anni',
    aml4: 'Segnala operazioni sospette al SEPBLAC quando richiesto',
    aml5: 'Forma tutto il personale nelle procedure AML',
    complaintsTitle: 'Reclami e Lamentele',
    complaintsIntro: 'Se ritiene che non abbiamo rispettato gli standard stabiliti in questo Codice Etico, la preghiamo di contattarci:',
    complaintsResponse: 'Tutti i reclami saranno trattati in modo riservato e gestiti entro 15 giorni lavorativi.',
    closingText: 'Questo Codice Etico è vincolante per tutti i dipendenti, partner e collaboratori di Anclora Private Estates. Le violazioni possono comportare provvedimenti disciplinari, inclusa la risoluzione del rapporto di lavoro o commerciale.',
  },
  da: {
    backToHome: 'Tilbage til forsiden',
    title: 'Etisk Kodeks',
    subtitle: 'De principper, der guider alt, hvad vi gør',
    intro: 'Anclora Groups etiske kodeks er baseret på',
    introTransparency: 'gennemsigtighed',
    introIntegrity: 'integritet',
    introConfidentiality: 'absolut fortrolighed',
    p1Title: 'Gennemsigtighed', p1Desc: 'Vi opererer med fuldstændig åbenhed i alle vores anliggender. Alle ejendomsoplysninger præsenteres nøjagtigt, og vi oplyser alle relevante detaljer til vores kunder.',
    p2Title: 'Integritet', p2Desc: 'Vi opretholder de højeste etiske standarder i enhver transaktion. Vores anbefalinger baseres altid på vores kunders bedste interesse, ikke på provisionspotentiale.',
    p3Title: 'Absolut Fortrolighed', p3Desc: 'Vi forstår fortrolighedsbehovene hos UHNWI-kunder. Alle kundeoplysninger behandles med den strengeste fortrolighed og beskyttes af robuste sikkerhedsforanstaltninger.',
    p4Title: 'Bæredygtig Udvikling', p4Desc: 'Vi er engageret i bæredygtig udvikling af Balearerne. Vi fremmer ejendomme, der respekterer miljøet og lokale samfund.',
    p5Title: 'Professionel Ekspertise', p5Desc: 'Vi investerer løbende i vores teams uddannelse og udvikling for at opretholde de højeste servicestandarder i luksus ejendomssektoren.',
    commitmentsTitle: 'Vores Forpligtelser',
    toClientsTitle: 'Over for Vores Kunder',
    tc1: 'Give nøjagtige og fuldstændige ejendomsoplysninger',
    tc2: 'Altid handle i kundens bedste interesse',
    tc3: 'Opretholde streng fortrolighed med alle kundedata',
    tc4: 'Oplyse om eventuelle interessekonflikter',
    tc5: 'Give professionel rådgivning baseret på markedsviden',
    tc6: 'Respektere kundebeslutninger uden pres',
    toOwnersTitle: 'Over for Ejendomsejere',
    to1: 'Markedsføre ejendomme professionelt og etisk',
    to2: 'Give regelmæssige opdateringer om markedsføringsaktiviteter',
    to3: 'Grundigt kvalificere potentielle købere',
    to4: 'Beskytte ejendommen under fremvisninger',
    to5: 'Forhandle retfærdigt på ejerens vegne',
    toCommunityTitle: 'Over for Samfundet',
    tcom1: 'Respektere og fremme lokal kultur og arv',
    tcom2: 'Støtte bæredygtige udviklingspraksisser',
    tcom3: 'Overholde alle gældende love og regler',
    tcom4: 'Bidrage positivt til den lokale økonomi',
    tcom5: 'Minimere miljøpåvirkningen af vores aktiviteter',
    toProfessionTitle: 'Over for Vores Profession',
    tp1: 'Opretholde høje professionelle standarder',
    tp2: 'Fortsætte uddannelse og faglig udvikling',
    tp3: 'Samarbejde redeligt med andre fagfolk',
    tp4: 'Opretholde ejendomsbranchens omdømme',
    tp5: 'Overholde API-foreningens adfærdskodeks',
    amlTitle: 'Forpligtelse til Bekæmpelse af Hvidvaskning',
    amlIntro: 'I overensstemmelse med lov 10/2010 af 28. april om forebyggelse af hvidvaskning af penge og terrorfinansiering, Anclora Private Estates:',
    aml1: 'Identificerer og verificerer alle kunder (KYC)',
    aml2: 'Verificerer midlernes oprindelse i transaktioner over €10.000',
    aml3: 'Opbevarer dokumentation i 10 år',
    aml4: 'Indberetter mistænkelige transaktioner til SEPBLAC, når det kræves',
    aml5: 'Uddanner alt personale i AML-procedurer',
    complaintsTitle: 'Klager og Henvendelser',
    complaintsIntro: 'Hvis du mener, at vi ikke har overholdt de standarder, der er fastsat i dette etiske kodeks, bedes du kontakte os:',
    complaintsResponse: 'Alle klager behandles fortroligt og besvares inden for 15 arbejdsdage.',
    closingText: 'Dette etiske kodeks er bindende for alle Anclora Private Estates medarbejdere, partnere og samarbejdspartnere. Overtrædelser kan resultere i disciplinære foranstaltninger, herunder opsigelse af ansættelses- eller forretningsforhold.',
  },
  nl: {
    backToHome: 'Terug naar home',
    title: 'Gedragscode',
    subtitle: 'De principes die alles wat we doen sturen',
    intro: 'De gedragscode van Anclora Group is gebaseerd op',
    introTransparency: 'transparantie',
    introIntegrity: 'integriteit',
    introConfidentiality: 'absolute vertrouwelijkheid',
    p1Title: 'Transparantie', p1Desc: 'Wij opereren met volledige openheid in al onze activiteiten. Alle vastgoedinformatie wordt nauwkeurig gepresenteerd en wij leggen alle relevante details aan onze klanten voor.',
    p2Title: 'Integriteit', p2Desc: 'Wij handhaven de hoogste ethische normen in elke transactie. Onze aanbevelingen zijn altijd gebaseerd op het beste belang van onze klanten, niet op commissiepotentieel.',
    p3Title: 'Absolute Vertrouwelijkheid', p3Desc: 'Wij begrijpen de privacybehoeften van UHNWI-klanten. Alle klantinformatie wordt behandeld met de strengste vertrouwelijkheid en beschermd door robuuste beveiligingsmaatregelen.',
    p4Title: 'Duurzame Ontwikkeling', p4Desc: 'Wij zijn toegewijd aan de duurzame ontwikkeling van de Balearen. Wij promoten vastgoedobjecten die het milieu en de lokale gemeenschappen respecteren.',
    p5Title: 'Professionele Uitstekendheid', p5Desc: 'Wij investeren continu in de opleiding en ontwikkeling van ons team om de hoogste servicenormen in de luxe vastgoedsector te handhaven.',
    commitmentsTitle: 'Onze Toezeggingen',
    toClientsTitle: 'Aan Onze Klanten',
    tc1: 'Nauwkeurige en volledige vastgoedinformatie verstrekken',
    tc2: 'Altijd handelen in het beste belang van de klant',
    tc3: 'Strikte vertrouwelijkheid van alle klantgegevens bewaren',
    tc4: 'Eventuele belangenconflicten bekendmaken',
    tc5: 'Professioneel advies geven op basis van marktkennis',
    tc6: 'Klantbeslissingen respecteren zonder druk',
    toOwnersTitle: 'Aan Vastgoedeigenaren',
    to1: 'Vastgoedobjecten professioneel en ethisch op de markt brengen',
    to2: 'Regelmatige updates over marketingactiviteiten verstrekken',
    to3: 'Potentiële kopers grondig kwalificeren',
    to4: 'Het vastgoedobject tijdens bezichtigingen beschermen',
    to5: 'Eerlijk onderhandelen namens de eigenaar',
    toCommunityTitle: 'Aan de Gemeenschap',
    tcom1: 'Lokale cultuur en erfgoed respecteren en bevorderen',
    tcom2: 'Duurzame ontwikkelingspraktijken ondersteunen',
    tcom3: 'Alle toepasselijke wetten en voorschriften naleven',
    tcom4: 'Positief bijdragen aan de lokale economie',
    tcom5: 'De milieu-impact van onze activiteiten minimaliseren',
    toProfessionTitle: 'Aan Onze Beroepsgroep',
    tp1: 'Hoge professionele normen handhaven',
    tp2: 'Opleiding en professionele ontwikkeling voortzetten',
    tp3: 'Eerlijk samenwerken met andere professionals',
    tp4: 'De reputatie van de vastgoedsector hooghouden',
    tp5: 'De gedragscode van het API-college naleven',
    amlTitle: 'Toezegging inzake Witwaspreventie',
    amlIntro: 'In overeenstemming met wet 10/2010 van 28 april betreffende de preventie van witwassen van geld en terrorismefinanciering, Anclora Private Estates:',
    aml1: 'Identificeert en verifieert alle klanten (KYC)',
    aml2: 'Verifieert de herkomst van gelden bij transacties boven €10.000',
    aml3: 'Bewaart documentatie gedurende 10 jaar',
    aml4: 'Meldt verdachte transacties aan SEPBLAC wanneer vereist',
    aml5: 'Leidt al het personeel op in AML-procedures',
    complaintsTitle: 'Klachten en Bezwaren',
    complaintsIntro: 'Als u van mening bent dat wij de normen van deze gedragscode niet zijn nagekomen, neem dan contact met ons op:',
    complaintsResponse: 'Alle klachten worden vertrouwelijk behandeld en binnen 15 werkdagen afgehandeld.',
    closingText: 'Deze gedragscode is bindend voor alle medewerkers, partners en medewerkers van Anclora Private Estates. Overtredingen kunnen leiden tot disciplinaire maatregelen, waaronder beëindiging van de arbeids- of zakelijke relatie.',
  },
  no: {
    backToHome: 'Tilbake til forsiden',
    title: 'Etiske Retningslinjer',
    subtitle: 'Prinsippene som veileder alt vi gjør',
    intro: 'Anclora Groups etiske retningslinjer er basert på',
    introTransparency: 'åpenhet',
    introIntegrity: 'integritet',
    introConfidentiality: 'absolutt konfidensialitet',
    p1Title: 'Åpenhet', p1Desc: 'Vi opererer med full åpenhet i alle våre aktiviteter. All eiendomsinformasjon presenteres nøyaktig, og vi oppgir alle relevante detaljer til våre kunder.',
    p2Title: 'Integritet', p2Desc: 'Vi opprettholder de høyeste etiske standardene i hver transaksjon. Våre anbefalinger er alltid basert på kundenes beste interesse, ikke provisjonspotensial.',
    p3Title: 'Absolutt Konfidensialitet', p3Desc: 'Vi forstår personvernbehovene til UHNWI-kunder. All kundeinformasjon behandles med den strengeste konfidensialiteten og beskyttes av robuste sikkerhetstiltak.',
    p4Title: 'Bærekraftig Utvikling', p4Desc: 'Vi er engasjert i bærekraftig utvikling av Balearene. Vi markedsfører eiendommer som respekterer miljøet og lokale samfunn.',
    p5Title: 'Profesjonell Fremragenhet', p5Desc: 'Vi investerer kontinuerlig i opplæring og utvikling av teamet vårt for å opprettholde de høyeste servicestandardene i luksus eiendomssektoren.',
    commitmentsTitle: 'Våre Forpliktelser',
    toClientsTitle: 'Overfor Våre Kunder',
    tc1: 'Gi nøyaktig og fullstendig eiendomsinformasjon',
    tc2: 'Alltid handle i kundens beste interesse',
    tc3: 'Opprettholde streng konfidensialitet for alle kundedata',
    tc4: 'Opplyse om eventuelle interessekonflikter',
    tc5: 'Gi profesjonell rådgivning basert på markedskunnskap',
    tc6: 'Respektere kundebeslutninger uten press',
    toOwnersTitle: 'Overfor Eiendomseiere',
    to1: 'Markedsføre eiendommer profesjonelt og etisk',
    to2: 'Gi regelmessige oppdateringer om markedsføringsaktiviteter',
    to3: 'Grundig kvalifisere potensielle kjøpere',
    to4: 'Beskytte eiendommen under visninger',
    to5: 'Forhandle rettferdig på vegne av eieren',
    toCommunityTitle: 'Overfor Samfunnet',
    tcom1: 'Respektere og fremme lokal kultur og arv',
    tcom2: 'Støtte bærekraftige utviklingspraksis',
    tcom3: 'Overholde alle gjeldende lover og forskrifter',
    tcom4: 'Bidra positivt til den lokale økonomien',
    tcom5: 'Minimere miljøpåvirkningen av vår virksomhet',
    toProfessionTitle: 'Overfor Vår Profesjon',
    tp1: 'Opprettholde høye profesjonelle standarder',
    tp2: 'Fortsette utdanning og faglig utvikling',
    tp3: 'Samarbeide rettferdig med andre fagpersoner',
    tp4: 'Opprettholde eiendomsbransjens omdømme',
    tp5: 'Overholde API-foreningens atferdskodeks',
    amlTitle: 'Forpliktelse mot Hvitvasking av Penger',
    amlIntro: 'I samsvar med lov 10/2010 av 28. april om forebygging av hvitvasking av penger og terrorfinansiering, Anclora Private Estates:',
    aml1: 'Identifiserer og verifiserer alle kunder (KYC)',
    aml2: 'Verifiserer opprinnelsen til midler i transaksjoner over €10 000',
    aml3: 'Oppbevarer dokumentasjon i 10 år',
    aml4: 'Rapporterer mistenkelige transaksjoner til SEPBLAC når det kreves',
    aml5: 'Opplærer alt personale i AML-prosedyrer',
    complaintsTitle: 'Klager og Henvendelser',
    complaintsIntro: 'Hvis du mener at vi ikke har overholdt standardene som er fastsatt i disse etiske retningslinjene, ta kontakt med oss:',
    complaintsResponse: 'Alle klager behandles konfidensielt og besvares innen 15 virkedager.',
    closingText: 'Disse etiske retningslinjene er bindende for alle Anclora Private Estates ansatte, partnere og samarbeidspartnere. Brudd kan resultere i disiplinære tiltak, inkludert oppsigelse av arbeids- eller forretningsforhold.',
  },
  pt: {
    backToHome: 'Voltar ao início',
    title: 'Código de Ética',
    subtitle: 'Os princípios que guiam tudo o que fazemos',
    intro: 'O Código de Ética da Anclora Group baseia-se na',
    introTransparency: 'transparência',
    introIntegrity: 'integridade',
    introConfidentiality: 'confidencialidade absoluta',
    p1Title: 'Transparência', p1Desc: 'Operamos com total abertura em todas as nossas atividades. Toda a informação sobre os imóveis é apresentada com exatidão e divulgamos todos os detalhes relevantes aos nossos clientes.',
    p2Title: 'Integridade', p2Desc: 'Mantemos os mais elevados padrões éticos em cada transação. As nossas recomendações baseiam-se sempre no melhor interesse dos clientes, nunca no potencial de comissão.',
    p3Title: 'Confidencialidade Absoluta', p3Desc: 'Compreendemos as necessidades de privacidade dos clientes UHNWI. Toda a informação dos clientes é tratada com a mais estrita confidencialidade e protegida por medidas de segurança robustas.',
    p4Title: 'Desenvolvimento Sustentável', p4Desc: 'Estamos empenhados no desenvolvimento sustentável das Ilhas Baleares. Promovemos imóveis que respeitam o ambiente e as comunidades locais.',
    p5Title: 'Excelência Profissional', p5Desc: 'Investimos continuamente na formação e desenvolvimento da nossa equipa para manter os mais elevados padrões de serviço no sector imobiliário de luxo.',
    commitmentsTitle: 'Os Nossos Compromissos',
    toClientsTitle: 'Para com os Nossos Clientes',
    tc1: 'Fornecer informação exata e completa sobre os imóveis',
    tc2: 'Agir sempre no melhor interesse do cliente',
    tc3: 'Manter a estrita confidencialidade de todos os dados dos clientes',
    tc4: 'Divulgar quaisquer potenciais conflitos de interesse',
    tc5: 'Prestar aconselhamento profissional baseado no conhecimento do mercado',
    tc6: 'Respeitar as decisões do cliente sem pressões',
    toOwnersTitle: 'Para com os Proprietários',
    to1: 'Comercializar os imóveis de forma profissional e ética',
    to2: 'Fornecer atualizações regulares sobre as atividades de comercialização',
    to3: 'Qualificar exaustivamente os potenciais compradores',
    to4: 'Proteger o imóvel durante as visitas',
    to5: 'Negociar de forma justa em nome do proprietário',
    toCommunityTitle: 'Para com a Comunidade',
    tcom1: 'Respeitar e promover a cultura e o património local',
    tcom2: 'Apoiar práticas de desenvolvimento sustentável',
    tcom3: 'Cumprir todas as leis e regulamentos aplicáveis',
    tcom4: 'Contribuir positivamente para a economia local',
    tcom5: 'Minimizar o impacto ambiental das nossas operações',
    toProfessionTitle: 'Para com a Nossa Profissão',
    tp1: 'Manter elevados padrões profissionais',
    tp2: 'Prosseguir a formação e o desenvolvimento profissional',
    tp3: 'Colaborar de forma justa com outros profissionais',
    tp4: 'Manter a reputação do sector imobiliário',
    tp5: 'Cumprir o código de conduta do Colégio API',
    amlTitle: 'Compromisso contra o Branqueamento de Capitais',
    amlIntro: 'Em cumprimento da Lei 10/2010, de 28 de abril, de prevenção do branqueamento de capitais e do financiamento do terrorismo, a Anclora Private Estates:',
    aml1: 'Identifica e verifica todos os clientes (KYC)',
    aml2: 'Verifica a origem dos fundos em transações superiores a 10.000 €',
    aml3: 'Conserva a documentação durante 10 anos',
    aml4: 'Comunica ao SEPBLAC operações suspeitas quando necessário',
    aml5: 'Forma todos os colaboradores em procedimentos AML',
    complaintsTitle: 'Reclamações e Queixas',
    complaintsIntro: 'Se considerar que não cumprimos os padrões estabelecidos neste Código de Ética, contacte-nos:',
    complaintsResponse: 'Todas as reclamações serão tratadas de forma confidencial e respondidas no prazo de 15 dias úteis.',
    closingText: 'Este Código de Ética é vinculativo para todos os colaboradores, parceiros e colaboradores da Anclora Private Estates. As infrações podem resultar em medidas disciplinares, incluindo a cessação da relação laboral ou comercial.',
  },
};

export function EthicsPage() {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) as LocaleKey) in content
    ? (i18n.language.slice(0, 2) as LocaleKey)
    : 'en';
  const c = content[lang] ?? content['en'];

  const principles: Principle[] = [
    { icon: Shield, title: c.p1Title, description: c.p1Desc },
    { icon: CheckCircle, title: c.p2Title, description: c.p2Desc },
    { icon: Lock, title: c.p3Title, description: c.p3Desc },
    { icon: Leaf, title: c.p4Title, description: c.p4Desc },
    { icon: Users, title: c.p5Title, description: c.p5Desc },
  ];

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
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-anclora-cream mb-4">{c.title}</h1>
          <p className="text-anclora-text-muted mb-12">{c.subtitle}</p>

          <div className="bg-anclora-teal-bg/50 rounded-2xl p-8 border border-white/10 mb-12">
            <p className="text-anclora-text-muted leading-relaxed m-0">
              {c.intro}{' '}
              <strong className="text-anclora-cream">{c.introTransparency}</strong>,{' '}
              <strong className="text-anclora-cream">{c.introIntegrity}</strong>{' '}
              {lang === 'en' ? 'and' : lang === 'de' ? 'und' : lang === 'fr' ? 'et' : lang === 'it' ? 'e' : lang === 'pt' ? 'e' : lang === 'ca' ? 'i' : 'och'.includes(lang) ? 'och' : 'y'}{' '}
              <strong className="text-anclora-cream">{c.introConfidentiality}</strong>{' '}
              (UHNWI).{' '}
              {lang === 'en'
                ? 'We are committed to the sustainable development of the Balearic Islands and professional excellence in the luxury real estate sector.'
                : lang === 'es'
                ? 'Estamos comprometidos con el desarrollo sostenible de las Islas Baleares y la excelencia profesional en el sector inmobiliario de lujo.'
                : lang === 'de'
                ? 'Wir sind dem nachhaltigen Entwicklung der Balearen und professioneller Exzellenz im Luxusimmobiliensektor verpflichtet.'
                : ''}
            </p>
          </div>

          <div className="grid gap-6 mb-12">
            {principles.map((principle) => (
              <div key={principle.title} className="bg-anclora-teal-bg/50 rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-anclora-gold/10 flex items-center justify-center flex-shrink-0">
                    <principle.icon className="w-6 h-6 text-anclora-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-anclora-cream mb-2">{principle.title}</h3>
                    <p className="text-anclora-text-muted leading-relaxed">{principle.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.commitmentsTitle}</h2>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.toClientsTitle}</h3>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.tc1}</li><li>{c.tc2}</li><li>{c.tc3}</li>
              <li>{c.tc4}</li><li>{c.tc5}</li><li>{c.tc6}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.toOwnersTitle}</h3>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.to1}</li><li>{c.to2}</li><li>{c.to3}</li><li>{c.to4}</li><li>{c.to5}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.toCommunityTitle}</h3>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.tcom1}</li><li>{c.tcom2}</li><li>{c.tcom3}</li><li>{c.tcom4}</li><li>{c.tcom5}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">{c.toProfessionTitle}</h3>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.tp1}</li><li>{c.tp2}</li><li>{c.tp3}</li><li>{c.tp4}</li><li>{c.tp5}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.amlTitle}</h2>
            <p className="text-anclora-text-muted">{c.amlIntro}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>{c.aml1}</li><li>{c.aml2}</li><li>{c.aml3}</li><li>{c.aml4}</li><li>{c.aml5}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">{c.complaintsTitle}</h2>
            <p className="text-anclora-text-muted">{c.complaintsIntro}</p>
            <p className="text-anclora-text-muted">
              📧 <a href="mailto:ethics@ancloraprivateestates.com" className="text-anclora-gold hover:underline">
                ethics@ancloraprivateestates.com
              </a><br />
              📞 +34 971 000 000<br />
              📬 Paseo del Borne, 15, 07012 Palma de Mallorca
            </p>
            <p className="text-anclora-text-muted">{c.complaintsResponse}</p>

            <div className="bg-anclora-gold/10 rounded-2xl p-6 border border-anclora-gold/30 mt-12">
              <p className="text-anclora-cream m-0"><strong>{c.closingText}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
