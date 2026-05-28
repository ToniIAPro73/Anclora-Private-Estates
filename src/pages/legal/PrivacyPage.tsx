import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type LocaleKey = 'es' | 'ca' | 'de' | 'en' | 'sv' | 'fr' | 'it' | 'da' | 'nl' | 'no' | 'pt';

interface PrivacyContent {
  backToHome: string;
  title: string;
  lastUpdated: string;
  intro: string;
  rights: string;
  rightsEmail: string;
  section1Title: string;
  identity: string;
  nif: string;
  address: string;
  email: string;
  phone: string;
  section2Title: string;
  section21Title: string;
  purpose21: string;
  legalBasis21: string;
  retention21: string;
  recipients21: string;
  section22Title: string;
  purpose22: string;
  legalBasis22: string;
  retention22: string;
  recipients22: string;
  section23Title: string;
  purpose23: string;
  legalBasis23: string;
  retention23: string;
  recipients23: string;
  section3Title: string;
  rightsIntro: string;
  right1: string;
  right2: string;
  right3: string;
  right4: string;
  right5: string;
  right6: string;
  right7: string;
  section4Title: string;
  exerciseIntro: string;
  exerciseAddress: string;
  exerciseNote: string;
  responseTime: string;
  complain: string;
  aepd: string;
  section5Title: string;
  securityIntro: string;
  security1: string;
  security2: string;
  security3: string;
  security4: string;
  security5: string;
  section6Title: string;
  transfersIntro: string;
  transfer1: string;
  transfer2: string;
  transfer3: string;
}

const content: Record<LocaleKey, PrivacyContent> = {
  en: {
    backToHome: 'Back to home',
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 24, 2026',
    intro: 'At Anclora Group, we take your personal data protection seriously. In compliance with GDPR, we inform you that your data will be processed solely to manage your requests and keep you informed about our luxury properties. We do not share data with third parties without your express consent, except when legally required.',
    rights: 'Rights:',
    rightsEmail: 'Access, rectification, deletion, and portability via',
    section1Title: '1. Data Controller',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Purposes of Processing',
    section21Title: '2.1 Contact Forms',
    purpose21: 'Attend to inquiries about properties and services',
    legalBasis21: 'Consent of the interested party (Art. 6.1.a GDPR)',
    retention21: '24 months from last contact',
    recipients21: 'Data is not transferred to third parties except as required by law',
    section22Title: '2.2 Newsletter / Commercial Communications',
    purpose22: 'Sending information about properties, events, and news',
    legalBasis22: 'Consent of the interested party (Art. 6.1.a GDPR)',
    retention22: 'Until unsubscribe is requested',
    recipients22: 'Mailchimp (USA, Privacy Shield), n8n (EU)',
    section23Title: '2.3 Property Valuations',
    purpose23: 'Conducting indicative appraisals',
    legalBasis23: 'Consent of the interested party',
    retention23: '12 months',
    recipients23: 'Data is not transferred',
    section3Title: '3. Your Rights',
    rightsIntro: 'Under GDPR, you have the right to:',
    right1: 'Access: Know what data we have about you',
    right2: 'Rectification: Correct inaccurate data',
    right3: 'Erasure: "Right to be forgotten" (with legal exceptions)',
    right4: 'Restriction: Limit processing in certain cases',
    right5: 'Portability: Receive your data in a structured format',
    right6: 'Objection: Object to processing for marketing purposes',
    right7: 'No automated decisions: We do not apply automated profiling',
    section4Title: '4. How to Exercise Your Rights',
    exerciseIntro: 'You can exercise your rights by contacting us:',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    exerciseNote: '(Please attach a copy of your ID/NIE/Passport)',
    responseTime: 'Response time: 1 month (extendable by 2 more months in complex cases)',
    complain: 'Right to complain:',
    aepd: 'Spanish Data Protection Agency (AEPD)',
    section5Title: '5. Security Measures',
    securityIntro: 'We implement technical and organizational measures to protect your data:',
    security1: 'SSL/TLS encryption on all communications',
    security2: 'Restricted access via strong passwords',
    security3: 'Encrypted backups',
    security4: 'Continuous staff training in data protection',
    security5: 'Periodic security audits',
    section6Title: '6. International Transfers',
    transfersIntro: 'We use third-party services that may involve transfers outside the EEA:',
    transfer1: 'Google Analytics (USA): European Commission Adequacy Decision',
    transfer2: 'Mailchimp (USA): EU-approved Standard Contractual Clauses',
    transfer3: 'Meta Pixel (USA): EU-US Adequacy Decision',
  },
  es: {
    backToHome: 'Volver al inicio',
    title: 'Política de Privacidad',
    lastUpdated: 'Última actualización: 24 de enero de 2026',
    intro: 'En Anclora Group tomamos muy en serio la protección de sus datos personales. En cumplimiento del RGPD, le informamos de que sus datos serán tratados exclusivamente para gestionar sus solicitudes y mantenerle informado sobre nuestras propiedades de lujo. No compartimos datos con terceros sin su consentimiento expreso, salvo cuando sea legalmente exigible.',
    rights: 'Derechos:',
    rightsEmail: 'Acceso, rectificación, supresión y portabilidad a través de',
    section1Title: '1. Responsable del Tratamiento',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Finalidades del Tratamiento',
    section21Title: '2.1 Formularios de Contacto',
    purpose21: 'Atender consultas sobre inmuebles y servicios',
    legalBasis21: 'Consentimiento del interesado (Art. 6.1.a RGPD)',
    retention21: '24 meses desde el último contacto',
    recipients21: 'Los datos no se ceden a terceros salvo obligación legal',
    section22Title: '2.2 Newsletter / Comunicaciones Comerciales',
    purpose22: 'Envío de información sobre propiedades, eventos y novedades',
    legalBasis22: 'Consentimiento del interesado (Art. 6.1.a RGPD)',
    retention22: 'Hasta que se solicite la baja',
    recipients22: 'Mailchimp (EE.UU., Privacy Shield), n8n (UE)',
    section23Title: '2.3 Valoraciones de Inmuebles',
    purpose23: 'Realización de tasaciones orientativas',
    legalBasis23: 'Consentimiento del interesado',
    retention23: '12 meses',
    recipients23: 'Los datos no se ceden',
    section3Title: '3. Sus Derechos',
    rightsIntro: 'En virtud del RGPD, usted tiene derecho a:',
    right1: 'Acceso: Conocer qué datos tenemos sobre usted',
    right2: 'Rectificación: Corregir datos inexactos',
    right3: 'Supresión: «Derecho al olvido» (con las excepciones legales)',
    right4: 'Limitación: Restringir el tratamiento en determinados casos',
    right5: 'Portabilidad: Recibir sus datos en un formato estructurado',
    right6: 'Oposición: Oponerse al tratamiento con fines de marketing',
    right7: 'No decisiones automatizadas: No aplicamos elaboración de perfiles automatizada',
    section4Title: '4. Cómo Ejercer Sus Derechos',
    exerciseIntro: 'Puede ejercer sus derechos contactándonos:',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    exerciseNote: '(Adjunte copia de su DNI/NIE/Pasaporte)',
    responseTime: 'Plazo de respuesta: 1 mes (ampliable 2 meses más en casos complejos)',
    complain: 'Derecho de reclamación:',
    aepd: 'Agencia Española de Protección de Datos (AEPD)',
    section5Title: '5. Medidas de Seguridad',
    securityIntro: 'Aplicamos medidas técnicas y organizativas para proteger sus datos:',
    security1: 'Cifrado SSL/TLS en todas las comunicaciones',
    security2: 'Acceso restringido mediante contraseñas robustas',
    security3: 'Copias de seguridad cifradas',
    security4: 'Formación continua del personal en protección de datos',
    security5: 'Auditorías de seguridad periódicas',
    section6Title: '6. Transferencias Internacionales',
    transfersIntro: 'Utilizamos servicios de terceros que pueden implicar transferencias fuera del EEE:',
    transfer1: 'Google Analytics (EE.UU.): Decisión de Adecuación de la Comisión Europea',
    transfer2: 'Mailchimp (EE.UU.): Cláusulas Contractuales Tipo aprobadas por la UE',
    transfer3: 'Meta Pixel (EE.UU.): Decisión de Adecuación UE-EE.UU.',
  },
  ca: {
    backToHome: 'Tornar a l\'inici',
    title: 'Política de Privacitat',
    lastUpdated: 'Darrera actualització: 24 de gener de 2026',
    intro: 'A Anclora Group prenem molt seriosament la protecció de les vostres dades personals. En compliment del RGPD, us informem que les vostres dades seran tractades exclusivament per gestionar les vostres sol·licituds i mantenir-vos informats sobre les nostres propietats de luxe. No compartim dades amb tercers sense el vostre consentiment exprés, excepte quan sigui legalment exigible.',
    rights: 'Drets:',
    rightsEmail: 'Accés, rectificació, supressió i portabilitat a través de',
    section1Title: '1. Responsable del Tractament',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Passeig del Born, 15, 07012 Palma de Mallorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Finalitats del Tractament',
    section21Title: '2.1 Formularis de Contacte',
    purpose21: 'Atendre consultes sobre immobles i serveis',
    legalBasis21: 'Consentiment de l\'interessat (Art. 6.1.a RGPD)',
    retention21: '24 mesos des de l\'últim contacte',
    recipients21: 'Les dades no es cedeixen a tercers excepte obligació legal',
    section22Title: '2.2 Newsletter / Comunicacions Comercials',
    purpose22: 'Enviament d\'informació sobre propietats, esdeveniments i novetats',
    legalBasis22: 'Consentiment de l\'interessat (Art. 6.1.a RGPD)',
    retention22: 'Fins que es sol·liciti la baixa',
    recipients22: 'Mailchimp (EUA, Privacy Shield), n8n (UE)',
    section23Title: '2.3 Valoracions d\'Immobles',
    purpose23: 'Realització de taxacions orientatives',
    legalBasis23: 'Consentiment de l\'interessat',
    retention23: '12 mesos',
    recipients23: 'Les dades no es cedeixen',
    section3Title: '3. Els Vostres Drets',
    rightsIntro: 'En virtut del RGPD, teniu dret a:',
    right1: 'Accés: Conèixer quines dades tenim sobre vosaltres',
    right2: 'Rectificació: Corregir dades inexactes',
    right3: 'Supressió: «Dret a l\'oblit» (amb les excepcions legals)',
    right4: 'Limitació: Restringir el tractament en determinats casos',
    right5: 'Portabilitat: Rebre les vostres dades en un format estructurat',
    right6: 'Oposició: Oposar-vos al tractament amb fins de màrqueting',
    right7: 'Sense decisions automatitzades: No apliquem elaboració de perfils automatitzada',
    section4Title: '4. Com Exercir els Vostres Drets',
    exerciseIntro: 'Podeu exercir els vostres drets contactant-nos:',
    exerciseAddress: 'Passeig del Born, 15, 07012 Palma de Mallorca',
    exerciseNote: '(Adjunteu còpia del vostre DNI/NIE/Passaport)',
    responseTime: 'Termini de resposta: 1 mes (ampliable 2 mesos més en casos complexos)',
    complain: 'Dret de reclamació:',
    aepd: 'Agència Espanyola de Protecció de Dades (AEPD)',
    section5Title: '5. Mesures de Seguretat',
    securityIntro: 'Apliquem mesures tècniques i organitzatives per protegir les vostres dades:',
    security1: 'Xifratge SSL/TLS en totes les comunicacions',
    security2: 'Accés restringit mitjançant contrasenyes robustes',
    security3: 'Còpies de seguretat xifrades',
    security4: 'Formació contínua del personal en protecció de dades',
    security5: 'Auditories de seguretat periòdiques',
    section6Title: '6. Transferències Internacionals',
    transfersIntro: 'Fem servir serveis de tercers que poden implicar transferències fora de l\'EEE:',
    transfer1: 'Google Analytics (EUA): Decisió d\'Adequació de la Comissió Europea',
    transfer2: 'Mailchimp (EUA): Clàusules Contractuals Tipus aprovades per la UE',
    transfer3: 'Meta Pixel (EUA): Decisió d\'Adequació UE-EUA',
  },
  de: {
    backToHome: 'Zur Startseite',
    title: 'Datenschutzerklärung',
    lastUpdated: 'Zuletzt aktualisiert: 24. Januar 2026',
    intro: 'Bei Anclora Group nehmen wir den Schutz Ihrer personenbezogenen Daten sehr ernst. In Übereinstimmung mit der DSGVO teilen wir Ihnen mit, dass Ihre Daten ausschließlich zur Bearbeitung Ihrer Anfragen und zur Information über unsere Luxusimmobilien verarbeitet werden. Wir geben keine Daten ohne Ihre ausdrückliche Einwilligung an Dritte weiter, außer wenn dies gesetzlich vorgeschrieben ist.',
    rights: 'Rechte:',
    rightsEmail: 'Auskunft, Berichtigung, Löschung und Datenübertragbarkeit über',
    section1Title: '1. Verantwortlicher',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Verarbeitungszwecke',
    section21Title: '2.1 Kontaktformulare',
    purpose21: 'Bearbeitung von Anfragen zu Immobilien und Dienstleistungen',
    legalBasis21: 'Einwilligung der betroffenen Person (Art. 6 Abs. 1 lit. a DSGVO)',
    retention21: '24 Monate ab dem letzten Kontakt',
    recipients21: 'Daten werden nicht an Dritte weitergegeben, außer aufgrund gesetzlicher Verpflichtung',
    section22Title: '2.2 Newsletter / Kommerzielle Kommunikation',
    purpose22: 'Versand von Informationen über Immobilien, Veranstaltungen und Neuigkeiten',
    legalBasis22: 'Einwilligung der betroffenen Person (Art. 6 Abs. 1 lit. a DSGVO)',
    retention22: 'Bis zum Widerruf der Einwilligung',
    recipients22: 'Mailchimp (USA, Privacy Shield), n8n (EU)',
    section23Title: '2.3 Immobilienbewertungen',
    purpose23: 'Durchführung orientierender Bewertungen',
    legalBasis23: 'Einwilligung der betroffenen Person',
    retention23: '12 Monate',
    recipients23: 'Daten werden nicht weitergegeben',
    section3Title: '3. Ihre Rechte',
    rightsIntro: 'Gemäß DSGVO haben Sie das Recht auf:',
    right1: 'Auskunft: Kenntnis darüber, welche Daten wir über Sie gespeichert haben',
    right2: 'Berichtigung: Korrektur unrichtiger Daten',
    right3: 'Löschung: „Recht auf Vergessenwerden" (mit gesetzlichen Ausnahmen)',
    right4: 'Einschränkung: Beschränkung der Verarbeitung in bestimmten Fällen',
    right5: 'Datenübertragbarkeit: Erhalt Ihrer Daten in einem strukturierten Format',
    right6: 'Widerspruch: Widerspruch gegen die Verarbeitung zu Marketingzwecken',
    right7: 'Keine automatisierten Entscheidungen: Wir wenden kein automatisiertes Profiling an',
    section4Title: '4. Ausübung Ihrer Rechte',
    exerciseIntro: 'Sie können Ihre Rechte geltend machen, indem Sie uns kontaktieren:',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    exerciseNote: '(Bitte legen Sie eine Kopie Ihres Ausweises/NIE/Reisepasses bei)',
    responseTime: 'Antwortfrist: 1 Monat (in komplexen Fällen um weitere 2 Monate verlängerbar)',
    complain: 'Beschwerderecht:',
    aepd: 'Spanische Datenschutzbehörde (AEPD)',
    section5Title: '5. Sicherheitsmaßnahmen',
    securityIntro: 'Wir ergreifen technische und organisatorische Maßnahmen zum Schutz Ihrer Daten:',
    security1: 'SSL/TLS-Verschlüsselung bei allen Kommunikationen',
    security2: 'Zugangsbeschränkung durch sichere Passwörter',
    security3: 'Verschlüsselte Datensicherungen',
    security4: 'Kontinuierliche Datenschutzschulung der Mitarbeiter',
    security5: 'Regelmäßige Sicherheitsaudits',
    section6Title: '6. Internationale Übermittlungen',
    transfersIntro: 'Wir nutzen Drittanbieterdienste, die Übermittlungen außerhalb des EWR beinhalten können:',
    transfer1: 'Google Analytics (USA): Angemessenheitsbeschluss der Europäischen Kommission',
    transfer2: 'Mailchimp (USA): EU-genehmigte Standardvertragsklauseln',
    transfer3: 'Meta Pixel (USA): EU-US-Angemessenheitsbeschluss',
  },
  sv: {
    backToHome: 'Tillbaka till startsidan',
    title: 'Integritetspolicy',
    lastUpdated: 'Senast uppdaterad: 24 januari 2026',
    intro: 'På Anclora Group tar vi skyddet av dina personuppgifter på allvar. I enlighet med GDPR informerar vi dig om att dina uppgifter behandlas uteslutande för att hantera dina förfrågningar och hålla dig informerad om våra lyxfastigheter. Vi delar inte uppgifter med tredje part utan ditt uttryckliga samtycke, utom när det krävs enligt lag.',
    rights: 'Rättigheter:',
    rightsEmail: 'Tillgång, rättelse, radering och dataportabilitet via',
    section1Title: '1. Personuppgiftsansvarig',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Ändamål med behandlingen',
    section21Title: '2.1 Kontaktformulär',
    purpose21: 'Hantera förfrågningar om fastigheter och tjänster',
    legalBasis21: 'Den registrerades samtycke (Art. 6.1.a GDPR)',
    retention21: '24 månader från senaste kontakt',
    recipients21: 'Uppgifter lämnas inte ut till tredje part utom vid laglig skyldighet',
    section22Title: '2.2 Nyhetsbrev / Kommersiell kommunikation',
    purpose22: 'Utskick av information om fastigheter, evenemang och nyheter',
    legalBasis22: 'Den registrerades samtycke (Art. 6.1.a GDPR)',
    retention22: 'Tills avregistrering begärs',
    recipients22: 'Mailchimp (USA, Privacy Shield), n8n (EU)',
    section23Title: '2.3 Fastighetsvärderingar',
    purpose23: 'Utförande av vägledande värderingar',
    legalBasis23: 'Den registrerades samtycke',
    retention23: '12 månader',
    recipients23: 'Uppgifter lämnas inte ut',
    section3Title: '3. Dina rättigheter',
    rightsIntro: 'Enligt GDPR har du rätt till:',
    right1: 'Tillgång: Kännedom om vilka uppgifter vi har om dig',
    right2: 'Rättelse: Korrigering av felaktiga uppgifter',
    right3: 'Radering: "Rätten att bli bortglömd" (med lagliga undantag)',
    right4: 'Begränsning: Begränsning av behandlingen i vissa fall',
    right5: 'Dataportabilitet: Ta emot dina uppgifter i ett strukturerat format',
    right6: 'Invändning: Invända mot behandling för marknadsföringsändamål',
    right7: 'Inga automatiserade beslut: Vi tillämpar inte automatiserad profilering',
    section4Title: '4. Hur du utövar dina rättigheter',
    exerciseIntro: 'Du kan utöva dina rättigheter genom att kontakta oss:',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    exerciseNote: '(Bifoga en kopia av ditt ID/NIE/Pass)',
    responseTime: 'Svarstid: 1 månad (kan förlängas med ytterligare 2 månader i komplexa fall)',
    complain: 'Rätt att klaga:',
    aepd: 'Spanska dataskyddsmyndigheten (AEPD)',
    section5Title: '5. Säkerhetsåtgärder',
    securityIntro: 'Vi vidtar tekniska och organisatoriska åtgärder för att skydda dina uppgifter:',
    security1: 'SSL/TLS-kryptering vid all kommunikation',
    security2: 'Begränsad åtkomst via starka lösenord',
    security3: 'Krypterade säkerhetskopior',
    security4: 'Kontinuerlig personalutbildning inom dataskydd',
    security5: 'Periodiska säkerhetsrevisioner',
    section6Title: '6. Internationella överföringar',
    transfersIntro: 'Vi använder tredjepartstjänster som kan innebära överföringar utanför EES:',
    transfer1: 'Google Analytics (USA): Europeiska kommissionens adekvansalbeslut',
    transfer2: 'Mailchimp (USA): EU-godkända standardavtalsklausuler',
    transfer3: 'Meta Pixel (USA): EU-US-adekvansbeslut',
  },
  fr: {
    backToHome: 'Retour à l\'accueil',
    title: 'Politique de Confidentialité',
    lastUpdated: 'Dernière mise à jour : 24 janvier 2026',
    intro: 'Chez Anclora Group, nous accordons une grande importance à la protection de vos données personnelles. Conformément au RGPD, nous vous informons que vos données seront traitées uniquement pour gérer vos demandes et vous tenir informé de nos propriétés de luxe. Nous ne partageons pas vos données avec des tiers sans votre consentement exprès, sauf obligation légale.',
    rights: 'Droits :',
    rightsEmail: 'Accès, rectification, suppression et portabilité via',
    section1Title: '1. Responsable du traitement',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Majorque',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Finalités du traitement',
    section21Title: '2.1 Formulaires de contact',
    purpose21: 'Traiter les demandes relatives aux biens et services',
    legalBasis21: 'Consentement de la personne concernée (Art. 6.1.a RGPD)',
    retention21: '24 mois à compter du dernier contact',
    recipients21: 'Les données ne sont pas transmises à des tiers sauf obligation légale',
    section22Title: '2.2 Newsletter / Communications commerciales',
    purpose22: 'Envoi d\'informations sur les propriétés, événements et actualités',
    legalBasis22: 'Consentement de la personne concernée (Art. 6.1.a RGPD)',
    retention22: 'Jusqu\'à désinscription',
    recipients22: 'Mailchimp (USA, Privacy Shield), n8n (UE)',
    section23Title: '2.3 Estimations immobilières',
    purpose23: 'Réalisation d\'évaluations indicatives',
    legalBasis23: 'Consentement de la personne concernée',
    retention23: '12 mois',
    recipients23: 'Les données ne sont pas transmises',
    section3Title: '3. Vos droits',
    rightsIntro: 'En vertu du RGPD, vous disposez des droits suivants :',
    right1: 'Accès : Connaître les données que nous détenons sur vous',
    right2: 'Rectification : Corriger des données inexactes',
    right3: 'Effacement : « Droit à l\'oubli » (sous réserve d\'exceptions légales)',
    right4: 'Limitation : Restreindre le traitement dans certains cas',
    right5: 'Portabilité : Recevoir vos données dans un format structuré',
    right6: 'Opposition : Vous opposer au traitement à des fins de marketing',
    right7: 'Pas de décisions automatisées : Nous n\'appliquons pas de profilage automatisé',
    section4Title: '4. Exercice de vos droits',
    exerciseIntro: 'Vous pouvez exercer vos droits en nous contactant :',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Majorque',
    exerciseNote: '(Veuillez joindre une copie de votre pièce d\'identité/NIE/Passeport)',
    responseTime: 'Délai de réponse : 1 mois (prolongeable de 2 mois supplémentaires dans les cas complexes)',
    complain: 'Droit de réclamation :',
    aepd: 'Agence espagnole de protection des données (AEPD)',
    section5Title: '5. Mesures de sécurité',
    securityIntro: 'Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :',
    security1: 'Chiffrement SSL/TLS sur toutes les communications',
    security2: 'Accès restreint via des mots de passe robustes',
    security3: 'Sauvegardes chiffrées',
    security4: 'Formation continue du personnel en matière de protection des données',
    security5: 'Audits de sécurité périodiques',
    section6Title: '6. Transferts internationaux',
    transfersIntro: 'Nous utilisons des services tiers pouvant impliquer des transferts en dehors de l\'EEE :',
    transfer1: 'Google Analytics (USA) : Décision d\'adéquation de la Commission européenne',
    transfer2: 'Mailchimp (USA) : Clauses contractuelles types approuvées par l\'UE',
    transfer3: 'Meta Pixel (USA) : Décision d\'adéquation UE-USA',
  },
  it: {
    backToHome: 'Torna alla home',
    title: 'Informativa sulla Privacy',
    lastUpdated: 'Ultimo aggiornamento: 24 gennaio 2026',
    intro: 'Presso Anclora Group prendiamo molto sul serio la protezione dei Suoi dati personali. In conformità con il GDPR, La informiamo che i Suoi dati saranno trattati esclusivamente per gestire le Sue richieste e tenerLa informato sulle nostre proprietà di lusso. Non condividiamo i dati con terzi senza il Suo consenso esplicito, salvo obblighi di legge.',
    rights: 'Diritti:',
    rightsEmail: 'Accesso, rettifica, cancellazione e portabilità tramite',
    section1Title: '1. Titolare del Trattamento',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Finalità del Trattamento',
    section21Title: '2.1 Moduli di Contatto',
    purpose21: 'Gestire le richieste relative a immobili e servizi',
    legalBasis21: 'Consenso dell\'interessato (Art. 6.1.a GDPR)',
    retention21: '24 mesi dall\'ultimo contatto',
    recipients21: 'I dati non vengono ceduti a terzi salvo obbligo di legge',
    section22Title: '2.2 Newsletter / Comunicazioni Commerciali',
    purpose22: 'Invio di informazioni su proprietà, eventi e novità',
    legalBasis22: 'Consenso dell\'interessato (Art. 6.1.a GDPR)',
    retention22: 'Fino alla richiesta di cancellazione',
    recipients22: 'Mailchimp (USA, Privacy Shield), n8n (UE)',
    section23Title: '2.3 Valutazioni Immobiliari',
    purpose23: 'Esecuzione di perizie orientative',
    legalBasis23: 'Consenso dell\'interessato',
    retention23: '12 mesi',
    recipients23: 'I dati non vengono ceduti',
    section3Title: '3. I Suoi Diritti',
    rightsIntro: 'In base al GDPR, Lei ha il diritto di:',
    right1: 'Accesso: Sapere quali dati conserviamo su di Lei',
    right2: 'Rettifica: Correggere dati inesatti',
    right3: 'Cancellazione: «Diritto all\'oblio» (con le eccezioni previste dalla legge)',
    right4: 'Limitazione: Limitare il trattamento in determinati casi',
    right5: 'Portabilità: Ricevere i Suoi dati in un formato strutturato',
    right6: 'Opposizione: Opporsi al trattamento per finalità di marketing',
    right7: 'Nessuna decisione automatizzata: Non applichiamo profilazione automatizzata',
    section4Title: '4. Come Esercitare i Suoi Diritti',
    exerciseIntro: 'Può esercitare i Suoi diritti contattandoci:',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    exerciseNote: '(Si prega di allegare copia del documento d\'identità/NIE/Passaporto)',
    responseTime: 'Tempi di risposta: 1 mese (prorogabile di ulteriori 2 mesi nei casi complessi)',
    complain: 'Diritto di reclamo:',
    aepd: 'Autorità spagnola per la protezione dei dati (AEPD)',
    section5Title: '5. Misure di Sicurezza',
    securityIntro: 'Adottiamo misure tecniche e organizzative per proteggere i Suoi dati:',
    security1: 'Crittografia SSL/TLS su tutte le comunicazioni',
    security2: 'Accesso limitato tramite password robuste',
    security3: 'Backup crittografati',
    security4: 'Formazione continua del personale in materia di protezione dei dati',
    security5: 'Audit di sicurezza periodici',
    section6Title: '6. Trasferimenti Internazionali',
    transfersIntro: 'Utilizziamo servizi di terze parti che possono comportare trasferimenti al di fuori del SEE:',
    transfer1: 'Google Analytics (USA): Decisione di adeguatezza della Commissione europea',
    transfer2: 'Mailchimp (USA): Clausole contrattuali standard approvate dall\'UE',
    transfer3: 'Meta Pixel (USA): Decisione di adeguatezza UE-USA',
  },
  da: {
    backToHome: 'Tilbage til forsiden',
    title: 'Privatlivspolitik',
    lastUpdated: 'Sidst opdateret: 24. januar 2026',
    intro: 'Hos Anclora Group tager vi beskyttelsen af dine personoplysninger alvorligt. I overensstemmelse med GDPR informerer vi dig om, at dine oplysninger alene behandles med henblik på at håndtere dine forespørgsler og holde dig informeret om vores luksusejendomme. Vi deler ikke oplysninger med tredjeparter uden dit udtrykkelige samtykke, medmindre det er lovpligtigt.',
    rights: 'Rettigheder:',
    rightsEmail: 'Indsigt, berigtigelse, sletning og dataportabilitet via',
    section1Title: '1. Dataansvarlig',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Behandlingsformål',
    section21Title: '2.1 Kontaktformularer',
    purpose21: 'Behandle forespørgsler om ejendomme og tjenesteydelser',
    legalBasis21: 'Den registreredes samtykke (Art. 6.1.a GDPR)',
    retention21: '24 måneder fra sidste kontakt',
    recipients21: 'Oplysninger videregives ikke til tredjeparter undtagen ved lovpligtig forpligtelse',
    section22Title: '2.2 Nyhedsbrev / Kommerciel kommunikation',
    purpose22: 'Udsendelse af information om ejendomme, arrangementer og nyheder',
    legalBasis22: 'Den registreredes samtykke (Art. 6.1.a GDPR)',
    retention22: 'Indtil afmelding anmodes',
    recipients22: 'Mailchimp (USA, Privacy Shield), n8n (EU)',
    section23Title: '2.3 Ejendomsvurderinger',
    purpose23: 'Udførelse af vejledende vurderinger',
    legalBasis23: 'Den registreredes samtykke',
    retention23: '12 måneder',
    recipients23: 'Oplysninger videregives ikke',
    section3Title: '3. Dine rettigheder',
    rightsIntro: 'I henhold til GDPR har du ret til:',
    right1: 'Indsigt: At kende hvilke oplysninger vi har om dig',
    right2: 'Berigtigelse: Korrektion af urigtige oplysninger',
    right3: 'Sletning: "Retten til at blive glemt" (med lovmæssige undtagelser)',
    right4: 'Begrænsning: Begrænsning af behandlingen i visse tilfælde',
    right5: 'Dataportabilitet: Modtagelse af dine oplysninger i et struktureret format',
    right6: 'Indsigelse: Gøre indsigelse mod behandling med markedsføringsformål',
    right7: 'Ingen automatiserede afgørelser: Vi anvender ikke automatiseret profilering',
    section4Title: '4. Sådan udøver du dine rettigheder',
    exerciseIntro: 'Du kan udøve dine rettigheder ved at kontakte os:',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    exerciseNote: '(Vedlæg venligst kopi af dit ID/NIE/Pas)',
    responseTime: 'Svartid: 1 måned (kan forlænges med yderligere 2 måneder i komplekse sager)',
    complain: 'Klageret:',
    aepd: 'Den spanske databeskyttelsesmyndighed (AEPD)',
    section5Title: '5. Sikkerhedsforanstaltninger',
    securityIntro: 'Vi iværksætter tekniske og organisatoriske foranstaltninger til beskyttelse af dine oplysninger:',
    security1: 'SSL/TLS-kryptering på al kommunikation',
    security2: 'Begrænset adgang via stærke adgangskoder',
    security3: 'Krypterede sikkerhedskopier',
    security4: 'Løbende medarbejderuddannelse i databeskyttelse',
    security5: 'Periodiske sikkerhedsrevisioner',
    section6Title: '6. Internationale overførsler',
    transfersIntro: 'Vi anvender tredjepartstjenester, der kan indebære overførsler uden for EØS:',
    transfer1: 'Google Analytics (USA): Europa-Kommissionens adequacyafgørelse',
    transfer2: 'Mailchimp (USA): EU-godkendte standardkontraktbestemmelser',
    transfer3: 'Meta Pixel (USA): EU-US-adequacyafgørelse',
  },
  nl: {
    backToHome: 'Terug naar home',
    title: 'Privacybeleid',
    lastUpdated: 'Laatste update: 24 januari 2026',
    intro: 'Bij Anclora Group nemen wij de bescherming van uw persoonsgegevens serieus. In overeenstemming met de AVG informeren wij u dat uw gegevens uitsluitend worden verwerkt om uw verzoeken te verwerken en u te informeren over onze luxe vastgoedprojecten. Wij delen geen gegevens met derden zonder uw uitdrukkelijke toestemming, tenzij dit wettelijk vereist is.',
    rights: 'Rechten:',
    rightsEmail: 'Inzage, rectificatie, verwijdering en gegevensoverdraagbaarheid via',
    section1Title: '1. Verwerkingsverantwoordelijke',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Verwerkingsdoeleinden',
    section21Title: '2.1 Contactformulieren',
    purpose21: 'Het behandelen van vragen over vastgoed en diensten',
    legalBasis21: 'Toestemming van de betrokkene (Art. 6.1.a AVG)',
    retention21: '24 maanden na het laatste contact',
    recipients21: 'Gegevens worden niet aan derden doorgegeven tenzij wettelijk verplicht',
    section22Title: '2.2 Nieuwsbrief / Commerciële communicatie',
    purpose22: 'Verzending van informatie over vastgoed, evenementen en nieuws',
    legalBasis22: 'Toestemming van de betrokkene (Art. 6.1.a AVG)',
    retention22: 'Totdat afmelding wordt gevraagd',
    recipients22: 'Mailchimp (VS, Privacy Shield), n8n (EU)',
    section23Title: '2.3 Vastgoedwaarderingen',
    purpose23: 'Uitvoering van indicatieve taxaties',
    legalBasis23: 'Toestemming van de betrokkene',
    retention23: '12 maanden',
    recipients23: 'Gegevens worden niet doorgegeven',
    section3Title: '3. Uw rechten',
    rightsIntro: 'Op grond van de AVG heeft u recht op:',
    right1: 'Inzage: Weten welke gegevens wij over u bewaren',
    right2: 'Rectificatie: Correctie van onjuiste gegevens',
    right3: 'Verwijdering: "Recht op vergetelheid" (met wettelijke uitzonderingen)',
    right4: 'Beperking: Beperking van de verwerking in bepaalde gevallen',
    right5: 'Gegevensoverdraagbaarheid: Ontvangst van uw gegevens in een gestructureerd formaat',
    right6: 'Bezwaar: Bezwaar maken tegen verwerking voor marketingdoeleinden',
    right7: 'Geen geautomatiseerde beslissingen: Wij passen geen geautomatiseerde profilering toe',
    section4Title: '4. Uitoefening van uw rechten',
    exerciseIntro: 'U kunt uw rechten uitoefenen door contact met ons op te nemen:',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    exerciseNote: '(Voeg een kopie van uw ID/NIE/Paspoort bij)',
    responseTime: 'Reactietermijn: 1 maand (verlengbaar met 2 maanden in complexe gevallen)',
    complain: 'Recht op klacht:',
    aepd: 'Spaanse Autoriteit Persoonsgegevens (AEPD)',
    section5Title: '5. Beveiligingsmaatregelen',
    securityIntro: 'Wij treffen technische en organisatorische maatregelen ter bescherming van uw gegevens:',
    security1: 'SSL/TLS-versleuteling op alle communicatie',
    security2: 'Beperkte toegang via sterke wachtwoorden',
    security3: 'Versleutelde back-ups',
    security4: 'Doorlopende personeelsopleiding in gegevensbescherming',
    security5: 'Periodieke beveiligingsaudits',
    section6Title: '6. Internationale doorgiften',
    transfersIntro: 'Wij maken gebruik van diensten van derden waarbij gegevens buiten de EER kunnen worden doorgegeven:',
    transfer1: 'Google Analytics (VS): Adequaatheidsbesluit van de Europese Commissie',
    transfer2: 'Mailchimp (VS): Door de EU goedgekeurde standaardcontractbepalingen',
    transfer3: 'Meta Pixel (VS): EU-VS-adequaatheidsbesluit',
  },
  no: {
    backToHome: 'Tilbake til forsiden',
    title: 'Personvernerklæring',
    lastUpdated: 'Sist oppdatert: 24. januar 2026',
    intro: 'Hos Anclora Group tar vi beskyttelsen av dine personopplysninger på alvor. I samsvar med GDPR informerer vi deg om at dine opplysninger behandles utelukkende for å håndtere dine forespørsler og holde deg informert om våre luksuriøse eiendommer. Vi deler ikke opplysninger med tredjeparter uten ditt uttrykkelige samtykke, med unntak av der dette er lovpålagt.',
    rights: 'Rettigheter:',
    rightsEmail: 'Innsyn, retting, sletting og dataportabilitet via',
    section1Title: '1. Behandlingsansvarlig',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Behandlingsformål',
    section21Title: '2.1 Kontaktskjemaer',
    purpose21: 'Behandle forespørsler om eiendommer og tjenester',
    legalBasis21: 'Den registrertes samtykke (Art. 6.1.a GDPR)',
    retention21: '24 måneder fra siste kontakt',
    recipients21: 'Opplysninger utleveres ikke til tredjeparter unntatt ved lovpålagt forpliktelse',
    section22Title: '2.2 Nyhetsbrev / Kommersiell kommunikasjon',
    purpose22: 'Utsendelse av informasjon om eiendommer, arrangementer og nyheter',
    legalBasis22: 'Den registrertes samtykke (Art. 6.1.a GDPR)',
    retention22: 'Inntil avmelding anmodes',
    recipients22: 'Mailchimp (USA, Privacy Shield), n8n (EU)',
    section23Title: '2.3 Eiendomsvurderinger',
    purpose23: 'Gjennomføring av veiledende verdivurderinger',
    legalBasis23: 'Den registrertes samtykke',
    retention23: '12 måneder',
    recipients23: 'Opplysninger utleveres ikke',
    section3Title: '3. Dine rettigheter',
    rightsIntro: 'I henhold til GDPR har du rett til:',
    right1: 'Innsyn: Vite hvilke opplysninger vi har om deg',
    right2: 'Retting: Korrigere unøyaktige opplysninger',
    right3: 'Sletting: "Retten til å bli glemt" (med lovmessige unntak)',
    right4: 'Begrensning: Begrense behandlingen i visse tilfeller',
    right5: 'Dataportabilitet: Motta dine opplysninger i et strukturert format',
    right6: 'Innsigelse: Gjøre innsigelse mot behandling for markedsføringsformål',
    right7: 'Ingen automatiserte avgjørelser: Vi benytter ikke automatisert profilering',
    section4Title: '4. Slik utøver du dine rettigheter',
    exerciseIntro: 'Du kan utøve dine rettigheter ved å kontakte oss:',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Mallorca',
    exerciseNote: '(Vedlegg kopi av ditt ID/NIE/Pass)',
    responseTime: 'Svartid: 1 måned (kan forlenges med ytterligere 2 måneder i komplekse saker)',
    complain: 'Klagerett:',
    aepd: 'Den spanske datatilsynsmyndigheten (AEPD)',
    section5Title: '5. Sikkerhetstiltak',
    securityIntro: 'Vi iverksetter tekniske og organisatoriske tiltak for å beskytte dine opplysninger:',
    security1: 'SSL/TLS-kryptering på all kommunikasjon',
    security2: 'Begrenset tilgang via sterke passord',
    security3: 'Krypterte sikkerhetskopier',
    security4: 'Kontinuerlig opplæring av ansatte i personvern',
    security5: 'Periodiske sikkerhetsrevisjoner',
    section6Title: '6. Internasjonale overføringer',
    transfersIntro: 'Vi benytter tredjepartstjenester som kan innebære overføringer utenfor EØS:',
    transfer1: 'Google Analytics (USA): Europakommisjonens adequacy-beslutning',
    transfer2: 'Mailchimp (USA): EU-godkjente standardkontraktklausuler',
    transfer3: 'Meta Pixel (USA): EU-US-adequacy-beslutning',
  },
  pt: {
    backToHome: 'Voltar ao início',
    title: 'Política de Privacidade',
    lastUpdated: 'Última atualização: 24 de janeiro de 2026',
    intro: 'Na Anclora Group, levamos muito a sério a proteção dos seus dados pessoais. Em conformidade com o RGPD, informamos que os seus dados serão tratados exclusivamente para gerir as suas solicitações e mantê-lo informado sobre as nossas propriedades de luxo. Não partilhamos dados com terceiros sem o seu consentimento expresso, exceto quando legalmente exigido.',
    rights: 'Direitos:',
    rightsEmail: 'Acesso, retificação, eliminação e portabilidade através de',
    section1Title: '1. Responsável pelo Tratamento',
    identity: 'Anclora Group',
    nif: 'B-XXXXXXXX',
    address: 'Paseo del Borne, 15, 07012 Palma de Maiorca',
    email: 'privacidad@ancloraprivateestates.com',
    phone: '+34 971 000 000',
    section2Title: '2. Finalidades do Tratamento',
    section21Title: '2.1 Formulários de Contacto',
    purpose21: 'Tratar consultas sobre imóveis e serviços',
    legalBasis21: 'Consentimento do titular (Art. 6.º, n.º 1, al. a) RGPD)',
    retention21: '24 meses a partir do último contacto',
    recipients21: 'Os dados não são cedidos a terceiros salvo obrigação legal',
    section22Title: '2.2 Newsletter / Comunicações Comerciais',
    purpose22: 'Envio de informação sobre propriedades, eventos e novidades',
    legalBasis22: 'Consentimento do titular (Art. 6.º, n.º 1, al. a) RGPD)',
    retention22: 'Até à solicitação de cancelamento',
    recipients22: 'Mailchimp (EUA, Privacy Shield), n8n (UE)',
    section23Title: '2.3 Avaliações de Imóveis',
    purpose23: 'Realização de avaliações indicativas',
    legalBasis23: 'Consentimento do titular',
    retention23: '12 meses',
    recipients23: 'Os dados não são cedidos',
    section3Title: '3. Os Seus Direitos',
    rightsIntro: 'Ao abrigo do RGPD, tem direito a:',
    right1: 'Acesso: Conhecer os dados que temos sobre si',
    right2: 'Retificação: Corrigir dados inexatos',
    right3: 'Eliminação: «Direito ao esquecimento» (com exceções legais)',
    right4: 'Limitação: Restringir o tratamento em determinados casos',
    right5: 'Portabilidade: Receber os seus dados num formato estruturado',
    right6: 'Oposição: Opor-se ao tratamento para fins de marketing',
    right7: 'Sem decisões automatizadas: Não aplicamos definição de perfis automatizada',
    section4Title: '4. Como Exercer os Seus Direitos',
    exerciseIntro: 'Pode exercer os seus direitos contactando-nos:',
    exerciseAddress: 'Paseo del Borne, 15, 07012 Palma de Maiorca',
    exerciseNote: '(Anexe cópia do seu BI/NIE/Passaporte)',
    responseTime: 'Prazo de resposta: 1 mês (prorrogável por mais 2 meses em casos complexos)',
    complain: 'Direito de reclamação:',
    aepd: 'Autoridade Espanhola de Proteção de Dados (AEPD)',
    section5Title: '5. Medidas de Segurança',
    securityIntro: 'Implementamos medidas técnicas e organizacionais para proteger os seus dados:',
    security1: 'Encriptação SSL/TLS em todas as comunicações',
    security2: 'Acesso restrito através de palavras-passe robustas',
    security3: 'Cópias de segurança encriptadas',
    security4: 'Formação contínua dos colaboradores em proteção de dados',
    security5: 'Auditorias de segurança periódicas',
    section6Title: '6. Transferências Internacionais',
    transfersIntro: 'Utilizamos serviços de terceiros que podem implicar transferências para fora do EEE:',
    transfer1: 'Google Analytics (EUA): Decisão de adequação da Comissão Europeia',
    transfer2: 'Mailchimp (EUA): Cláusulas Contratuais-Tipo aprovadas pela UE',
    transfer3: 'Meta Pixel (EUA): Decisão de adequação UE-EUA',
  },
};

export function PrivacyPage() {
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
            <div className="bg-anclora-teal-bg/50 rounded-2xl p-8 border border-white/10 mb-8">
              <p className="text-anclora-text-muted leading-relaxed m-0">
                {c.intro.split('Anclora Group').map((part, i, arr) =>
                  i < arr.length - 1
                    ? <span key={i}>{part}<strong className="text-anclora-cream">Anclora Group</strong></span>
                    : <span key={i}>{part}</span>
                )}
              </p>
              <p className="text-anclora-gold mt-4 mb-0">
                <strong>{c.rights}</strong> {c.rightsEmail}{' '}
                <a href="mailto:privacy@ancloraprivateestates.com" className="underline">
                  privacy@ancloraprivateestates.com
                </a>
              </p>
            </div>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.section1Title}
            </h2>
            <p className="text-anclora-text-muted">
              <strong className="text-anclora-cream">Identity:</strong> {c.identity}<br />
              <strong className="text-anclora-cream">NIF:</strong> {c.nif}<br />
              <strong className="text-anclora-cream">Address:</strong> {c.address}<br />
              <strong className="text-anclora-cream">Email:</strong>{' '}
              <a href={`mailto:${c.email}`} className="text-anclora-gold hover:underline">
                {c.email}
              </a><br />
              <strong className="text-anclora-cream">Phone:</strong> {c.phone}
            </p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.section2Title}
            </h2>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">
              {c.section21Title}
            </h3>
            <ul className="text-anclora-text-muted space-y-2">
              <li><strong className="text-anclora-cream">Purpose:</strong> {c.purpose21}</li>
              <li><strong className="text-anclora-cream">Legal basis:</strong> {c.legalBasis21}</li>
              <li><strong className="text-anclora-cream">Retention period:</strong> {c.retention21}</li>
              <li><strong className="text-anclora-cream">Recipients:</strong> {c.recipients21}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">
              {c.section22Title}
            </h3>
            <ul className="text-anclora-text-muted space-y-2">
              <li><strong className="text-anclora-cream">Purpose:</strong> {c.purpose22}</li>
              <li><strong className="text-anclora-cream">Legal basis:</strong> {c.legalBasis22}</li>
              <li><strong className="text-anclora-cream">Retention period:</strong> {c.retention22}</li>
              <li><strong className="text-anclora-cream">Recipients:</strong> {c.recipients22}</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-anclora-cream mt-8 mb-3">
              {c.section23Title}
            </h3>
            <ul className="text-anclora-text-muted space-y-2">
              <li><strong className="text-anclora-cream">Purpose:</strong> {c.purpose23}</li>
              <li><strong className="text-anclora-cream">Legal basis:</strong> {c.legalBasis23}</li>
              <li><strong className="text-anclora-cream">Retention period:</strong> {c.retention23}</li>
              <li><strong className="text-anclora-cream">Recipients:</strong> {c.recipients23}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.section3Title}
            </h2>
            <p className="text-anclora-text-muted">
              {c.rightsIntro}
            </p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>✅ <strong className="text-anclora-cream">{c.right1.split(':')[0]}:</strong> {c.right1.split(':').slice(1).join(':').trim()}</li>
              <li>✅ <strong className="text-anclora-cream">{c.right2.split(':')[0]}:</strong> {c.right2.split(':').slice(1).join(':').trim()}</li>
              <li>✅ <strong className="text-anclora-cream">{c.right3.split(':')[0]}:</strong> {c.right3.split(':').slice(1).join(':').trim()}</li>
              <li>✅ <strong className="text-anclora-cream">{c.right4.split(':')[0]}:</strong> {c.right4.split(':').slice(1).join(':').trim()}</li>
              <li>✅ <strong className="text-anclora-cream">{c.right5.split(':')[0]}:</strong> {c.right5.split(':').slice(1).join(':').trim()}</li>
              <li>✅ <strong className="text-anclora-cream">{c.right6.split(':')[0]}:</strong> {c.right6.split(':').slice(1).join(':').trim()}</li>
              <li>✅ <strong className="text-anclora-cream">{c.right7.split(':')[0]}:</strong> {c.right7.split(':').slice(1).join(':').trim()}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.section4Title}
            </h2>
            <p className="text-anclora-text-muted">
              {c.exerciseIntro}<br />
              📧 <a href="mailto:privacidad@ancloraprivateestates.com" className="text-anclora-gold hover:underline">
                privacidad@ancloraprivateestates.com
              </a><br />
              📬 {c.exerciseAddress}<br />
              {c.exerciseNote}
            </p>
            <p className="text-anclora-text-muted">
              <strong className="text-anclora-cream">{c.responseTime}</strong>
            </p>
            <p className="text-anclora-text-muted">
              <strong className="text-anclora-cream">{c.complain}</strong>{' '}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-anclora-gold hover:underline">
                {c.aepd}
              </a>
            </p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.section5Title}
            </h2>
            <p className="text-anclora-text-muted">
              {c.securityIntro}
            </p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>🔒 {c.security1}</li>
              <li>🔐 {c.security2}</li>
              <li>💾 {c.security3}</li>
              <li>👥 {c.security4}</li>
              <li>📋 {c.security5}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.section6Title}
            </h2>
            <p className="text-anclora-text-muted">
              {c.transfersIntro}
            </p>
            <ul className="text-anclora-text-muted space-y-2">
              <li><strong className="text-anclora-cream">{c.transfer1.split(':')[0]}:</strong> {c.transfer1.split(':').slice(1).join(':').trim()}</li>
              <li><strong className="text-anclora-cream">{c.transfer2.split(':')[0]}:</strong> {c.transfer2.split(':').slice(1).join(':').trim()}</li>
              <li><strong className="text-anclora-cream">{c.transfer3.split(':')[0]}:</strong> {c.transfer3.split(':').slice(1).join(':').trim()}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
