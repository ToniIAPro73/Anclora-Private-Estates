import { ArrowLeft, Cookie, BarChart3, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type LocaleKey = 'es' | 'ca' | 'de' | 'en' | 'sv' | 'fr' | 'it' | 'da' | 'nl' | 'no' | 'pt';

interface CookieType {
  icon: typeof Cookie;
  title: string;
  description: string;
  examples: string[];
  required: boolean;
}

interface CookiesContent {
  backToHome: string;
  title: string;
  lastUpdated: string;
  intro: string;
  requiredBadge: string;
  cookie1Title: string;
  cookie1Desc: string;
  cookie1Ex: string[];
  cookie2Title: string;
  cookie2Desc: string;
  cookie2Ex: string[];
  cookie3Title: string;
  cookie3Desc: string;
  cookie3Ex: string[];
  whatTitle: string;
  whatText: string;
  howTitle: string;
  howIntro: string;
  how1Label: string;
  how1Text: string;
  how2Label: string;
  how2Text: string;
  how3Label: string;
  how3Text: string;
  how4Label: string;
  how4Text: string;
  thirdTitle: string;
  thirdIntro: string;
  googleLabel: string;
  googleText: string;
  metaLabel: string;
  metaText: string;
  privacyPolicy: string;
  managingTitle: string;
  managingText1: string;
  managingText2: string;
  contactTitle: string;
  contactText: string;
}

const content: Record<LocaleKey, CookiesContent> = {
  en: {
    backToHome: 'Back to home',
    title: 'Cookie Policy',
    lastUpdated: 'Last updated: January 24, 2026',
    intro: 'We use first-party and third-party cookies to improve your browsing experience, perform statistical analysis, and show you personalized advertising. By continuing to browse, you accept their use. You can configure or reject cookies at any time through our consent manager.',
    requiredBadge: 'Required',
    cookie1Title: 'Necessary Cookies',
    cookie1Desc: 'Essential for the website to function properly. These cannot be disabled.',
    cookie1Ex: ['Session cookies', 'Authentication cookies', 'Security cookies'],
    cookie2Title: 'Analytics Cookies',
    cookie2Desc: 'Help us understand how visitors interact with our website.',
    cookie2Ex: ['Google Analytics', 'Page view tracking', 'User behavior analysis'],
    cookie3Title: 'Marketing Cookies',
    cookie3Desc: 'Used to deliver relevant advertisements and track their performance.',
    cookie3Ex: ['Meta Pixel', 'Remarketing cookies', 'Social media pixels'],
    whatTitle: 'What Are Cookies?',
    whatText: 'Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.',
    howTitle: 'How We Use Cookies',
    howIntro: 'At Anclora Private Estates, we use cookies for the following purposes:',
    how1Label: 'Essential functionality:',
    how1Text: 'To enable core website features like navigation and access to secure areas',
    how2Label: 'Performance and analytics:',
    how2Text: 'To understand how visitors interact with our website and improve user experience',
    how3Label: 'Marketing:',
    how3Text: 'To deliver personalized advertisements and measure their effectiveness',
    how4Label: 'Preferences:',
    how4Text: 'To remember your settings and preferences for future visits',
    thirdTitle: 'Third-Party Cookies',
    thirdIntro: 'We use services from the following third parties that may set cookies:',
    googleLabel: 'Google Analytics:',
    googleText: 'Used to analyze website traffic and user behavior.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'Used for advertising and conversion tracking.',
    privacyPolicy: 'Privacy Policy',
    managingTitle: 'Managing Your Cookie Preferences',
    managingText1: 'You can manage your cookie preferences at any time by clicking the button below or through the cookie banner that appears when you first visit our website.',
    managingText2: 'You can also control cookies through your browser settings:',
    contactTitle: 'Contact Us',
    contactText: 'If you have any questions about our Cookie Policy, please contact us at',
  },
  es: {
    backToHome: 'Volver al inicio',
    title: 'Política de Cookies',
    lastUpdated: 'Última actualización: 24 de enero de 2026',
    intro: 'Utilizamos cookies propias y de terceros para mejorar su experiencia de navegación, realizar análisis estadísticos y mostrarle publicidad personalizada. Al continuar navegando, acepta su uso. Puede configurar o rechazar las cookies en cualquier momento a través de nuestro gestor de consentimiento.',
    requiredBadge: 'Obligatoria',
    cookie1Title: 'Cookies Necesarias',
    cookie1Desc: 'Imprescindibles para el funcionamiento correcto del sitio web. No pueden desactivarse.',
    cookie1Ex: ['Cookies de sesión', 'Cookies de autenticación', 'Cookies de seguridad'],
    cookie2Title: 'Cookies Analíticas',
    cookie2Desc: 'Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.',
    cookie2Ex: ['Google Analytics', 'Seguimiento de páginas vistas', 'Análisis del comportamiento del usuario'],
    cookie3Title: 'Cookies de Marketing',
    cookie3Desc: 'Se utilizan para mostrar publicidad relevante y hacer seguimiento de su rendimiento.',
    cookie3Ex: ['Meta Pixel', 'Cookies de remarketing', 'Píxeles de redes sociales'],
    whatTitle: '¿Qué Son las Cookies?',
    whatText: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Se utilizan ampliamente para que los sitios web funcionen de manera más eficiente y proporcionen información a los propietarios del sitio.',
    howTitle: 'Cómo Utilizamos las Cookies',
    howIntro: 'En Anclora Private Estates utilizamos cookies para los siguientes fines:',
    how1Label: 'Funcionalidad esencial:',
    how1Text: 'Para habilitar las funciones principales del sitio web, como la navegación y el acceso a áreas seguras',
    how2Label: 'Rendimiento y analítica:',
    how2Text: 'Para entender cómo los visitantes interactúan con nuestro sitio web y mejorar la experiencia de usuario',
    how3Label: 'Marketing:',
    how3Text: 'Para mostrar publicidad personalizada y medir su efectividad',
    how4Label: 'Preferencias:',
    how4Text: 'Para recordar sus ajustes y preferencias en futuras visitas',
    thirdTitle: 'Cookies de Terceros',
    thirdIntro: 'Utilizamos servicios de los siguientes terceros que pueden instalar cookies:',
    googleLabel: 'Google Analytics:',
    googleText: 'Se utiliza para analizar el tráfico del sitio web y el comportamiento del usuario.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'Se utiliza para publicidad y seguimiento de conversiones.',
    privacyPolicy: 'Política de Privacidad',
    managingTitle: 'Gestión de sus Preferencias de Cookies',
    managingText1: 'Puede gestionar sus preferencias de cookies en cualquier momento haciendo clic en el botón a continuación o a través del banner de cookies que aparece cuando visita nuestro sitio web por primera vez.',
    managingText2: 'También puede controlar las cookies a través de la configuración de su navegador:',
    contactTitle: 'Contacto',
    contactText: 'Si tiene alguna pregunta sobre nuestra Política de Cookies, contáctenos en',
  },
  ca: {
    backToHome: 'Tornar a l\'inici',
    title: 'Política de Cookies',
    lastUpdated: 'Darrera actualització: 24 de gener de 2026',
    intro: 'Fem servir cookies pròpies i de tercers per millorar la vostra experiència de navegació, realitzar anàlisis estadístiques i mostrar-vos publicitat personalitzada. En continuar navegant, accepteu el seu ús. Podeu configurar o rebutjar les cookies en qualsevol moment a través del nostre gestor de consentiment.',
    requiredBadge: 'Obligatòria',
    cookie1Title: 'Cookies Necessàries',
    cookie1Desc: 'Imprescindibles per al funcionament correcte del lloc web. No es poden desactivar.',
    cookie1Ex: ['Cookies de sessió', 'Cookies d\'autenticació', 'Cookies de seguretat'],
    cookie2Title: 'Cookies Analítiques',
    cookie2Desc: 'Ens ajuden a entendre com els visitants interactuen amb el nostre lloc web.',
    cookie2Ex: ['Google Analytics', 'Seguiment de pàgines visitades', 'Anàlisi del comportament de l\'usuari'],
    cookie3Title: 'Cookies de Màrqueting',
    cookie3Desc: 'S\'utilitzen per mostrar publicitat rellevant i fer seguiment del seu rendiment.',
    cookie3Ex: ['Meta Pixel', 'Cookies de remarketing', 'Píxels de xarxes socials'],
    whatTitle: 'Què Són les Cookies?',
    whatText: 'Les cookies són petits arxius de text que s\'emmagatzemen al vostre dispositiu quan visiteu un lloc web. S\'utilitzen àmpliament perquè els llocs web funcionin de manera més eficient i proporcionin informació als propietaris del lloc.',
    howTitle: 'Com Fem Servir les Cookies',
    howIntro: 'A Anclora Private Estates fem servir cookies per als fins següents:',
    how1Label: 'Funcionalitat essencial:',
    how1Text: 'Per habilitar les funcions principals del lloc web, com la navegació i l\'accés a àrees segures',
    how2Label: 'Rendiment i analítica:',
    how2Text: 'Per entendre com els visitants interactuen amb el nostre lloc web i millorar l\'experiència d\'usuari',
    how3Label: 'Màrqueting:',
    how3Text: 'Per mostrar publicitat personalitzada i mesurar-ne l\'efectivitat',
    how4Label: 'Preferències:',
    how4Text: 'Per recordar els vostres ajustos i preferències en futures visites',
    thirdTitle: 'Cookies de Tercers',
    thirdIntro: 'Fem servir serveis dels tercers següents que poden instal·lar cookies:',
    googleLabel: 'Google Analytics:',
    googleText: 'S\'utilitza per analitzar el trànsit del lloc web i el comportament de l\'usuari.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'S\'utilitza per a publicitat i seguiment de conversions.',
    privacyPolicy: 'Política de Privacitat',
    managingTitle: 'Gestió de les Vostres Preferències de Cookies',
    managingText1: 'Podeu gestionar les vostres preferències de cookies en qualsevol moment fent clic al botó de sota o a través del bàner de cookies que apareix quan visiteu el nostre lloc web per primera vegada.',
    managingText2: 'També podeu controlar les cookies a través de la configuració del vostre navegador:',
    contactTitle: 'Contacte',
    contactText: 'Si teniu alguna pregunta sobre la nostra Política de Cookies, contacteu-nos a',
  },
  de: {
    backToHome: 'Zur Startseite',
    title: 'Cookie-Richtlinie',
    lastUpdated: 'Zuletzt aktualisiert: 24. Januar 2026',
    intro: 'Wir verwenden eigene Cookies und Cookies von Drittanbietern, um Ihr Surferlebnis zu verbessern, statistische Analysen durchzuführen und Ihnen personalisierte Werbung anzuzeigen. Durch weiteres Surfen stimmen Sie deren Verwendung zu. Sie können Cookies jederzeit über unser Einwilligungstool konfigurieren oder ablehnen.',
    requiredBadge: 'Erforderlich',
    cookie1Title: 'Notwendige Cookies',
    cookie1Desc: 'Für das ordnungsgemäße Funktionieren der Website unerlässlich. Diese können nicht deaktiviert werden.',
    cookie1Ex: ['Sitzungs-Cookies', 'Authentifizierungs-Cookies', 'Sicherheits-Cookies'],
    cookie2Title: 'Analyse-Cookies',
    cookie2Desc: 'Helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.',
    cookie2Ex: ['Google Analytics', 'Seitenaufruf-Tracking', 'Nutzerverhalten-Analyse'],
    cookie3Title: 'Marketing-Cookies',
    cookie3Desc: 'Werden verwendet, um relevante Werbung zu schalten und deren Leistung zu verfolgen.',
    cookie3Ex: ['Meta Pixel', 'Remarketing-Cookies', 'Social-Media-Pixel'],
    whatTitle: 'Was sind Cookies?',
    whatText: 'Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie eine Website besuchen. Sie werden häufig eingesetzt, damit Websites effizienter funktionieren und den Website-Betreibern Informationen liefern.',
    howTitle: 'Wie wir Cookies verwenden',
    howIntro: 'Bei Anclora Private Estates verwenden wir Cookies für folgende Zwecke:',
    how1Label: 'Grundlegende Funktionen:',
    how1Text: 'Zur Aktivierung grundlegender Website-Funktionen wie Navigation und Zugang zu sicheren Bereichen',
    how2Label: 'Leistung und Analyse:',
    how2Text: 'Um zu verstehen, wie Besucher mit unserer Website interagieren, und die Benutzererfahrung zu verbessern',
    how3Label: 'Marketing:',
    how3Text: 'Zur Bereitstellung personalisierter Werbung und Messung deren Wirksamkeit',
    how4Label: 'Einstellungen:',
    how4Text: 'Um Ihre Einstellungen und Präferenzen für künftige Besuche zu speichern',
    thirdTitle: 'Cookies von Drittanbietern',
    thirdIntro: 'Wir nutzen Dienste folgender Drittanbieter, die Cookies setzen können:',
    googleLabel: 'Google Analytics:',
    googleText: 'Wird zur Analyse des Website-Traffics und des Nutzerverhaltens verwendet.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'Wird für Werbung und Conversion-Tracking verwendet.',
    privacyPolicy: 'Datenschutzerklärung',
    managingTitle: 'Verwaltung Ihrer Cookie-Einstellungen',
    managingText1: 'Sie können Ihre Cookie-Einstellungen jederzeit über die Schaltfläche unten oder über das Cookie-Banner verwalten, das bei Ihrem ersten Besuch unserer Website erscheint.',
    managingText2: 'Sie können Cookies auch über Ihre Browser-Einstellungen steuern:',
    contactTitle: 'Kontakt',
    contactText: 'Bei Fragen zu unserer Cookie-Richtlinie wenden Sie sich bitte an uns unter',
  },
  sv: {
    backToHome: 'Tillbaka till startsidan',
    title: 'Cookiepolicy',
    lastUpdated: 'Senast uppdaterad: 24 januari 2026',
    intro: 'Vi använder egna cookies och tredjepartscookies för att förbättra din surfupplevelse, utföra statistiska analyser och visa dig personanpassad reklam. Genom att fortsätta surfa godkänner du deras användning. Du kan konfigurera eller avvisa cookies när som helst via vår samtyckeshanterare.',
    requiredBadge: 'Obligatorisk',
    cookie1Title: 'Nödvändiga cookies',
    cookie1Desc: 'Nödvändiga för att webbplatsen ska fungera korrekt. Dessa kan inte inaktiveras.',
    cookie1Ex: ['Sessionscookies', 'Autentiseringscookies', 'Säkerhetscookies'],
    cookie2Title: 'Analyscookies',
    cookie2Desc: 'Hjälper oss förstå hur besökare interagerar med vår webbplats.',
    cookie2Ex: ['Google Analytics', 'Sidvisningsspårning', 'Analys av användarbeteende'],
    cookie3Title: 'Marknadsföringscookies',
    cookie3Desc: 'Används för att visa relevant reklam och spåra dess prestanda.',
    cookie3Ex: ['Meta Pixel', 'Remarketingcookies', 'Sociala mediepixlar'],
    whatTitle: 'Vad är cookies?',
    whatText: 'Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De används i stor utsträckning för att göra webbplatser mer effektiva och för att ge information till webbplatsernas ägare.',
    howTitle: 'Hur vi använder cookies',
    howIntro: 'På Anclora Private Estates använder vi cookies för följande ändamål:',
    how1Label: 'Grundläggande funktioner:',
    how1Text: 'För att aktivera grundläggande webbplatsfunktioner som navigering och åtkomst till säkra områden',
    how2Label: 'Prestanda och analys:',
    how2Text: 'För att förstå hur besökare interagerar med vår webbplats och förbättra användarupplevelsen',
    how3Label: 'Marknadsföring:',
    how3Text: 'För att leverera personanpassad reklam och mäta dess effektivitet',
    how4Label: 'Inställningar:',
    how4Text: 'För att komma ihåg dina inställningar och preferenser för framtida besök',
    thirdTitle: 'Tredjepartscookies',
    thirdIntro: 'Vi använder tjänster från följande tredjeparter som kan sätta cookies:',
    googleLabel: 'Google Analytics:',
    googleText: 'Används för att analysera webbplatstrafik och användarbeteende.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'Används för annonsering och konverteringsspårning.',
    privacyPolicy: 'Integritetspolicy',
    managingTitle: 'Hantera dina cookieinställningar',
    managingText1: 'Du kan hantera dina cookieinställningar när som helst genom att klicka på knappen nedan eller via cookiebannern som visas vid ditt första besök på vår webbplats.',
    managingText2: 'Du kan också styra cookies via dina webbläsarinställningar:',
    contactTitle: 'Kontakta oss',
    contactText: 'Om du har frågor om vår cookiepolicy, kontakta oss på',
  },
  fr: {
    backToHome: 'Retour à l\'accueil',
    title: 'Politique en matière de cookies',
    lastUpdated: 'Dernière mise à jour : 24 janvier 2026',
    intro: 'Nous utilisons des cookies propres et tiers pour améliorer votre expérience de navigation, réaliser des analyses statistiques et vous afficher de la publicité personnalisée. En continuant à naviguer, vous acceptez leur utilisation. Vous pouvez configurer ou refuser les cookies à tout moment via notre gestionnaire de consentement.',
    requiredBadge: 'Obligatoire',
    cookie1Title: 'Cookies nécessaires',
    cookie1Desc: 'Indispensables au bon fonctionnement du site. Ils ne peuvent pas être désactivés.',
    cookie1Ex: ['Cookies de session', 'Cookies d\'authentification', 'Cookies de sécurité'],
    cookie2Title: 'Cookies analytiques',
    cookie2Desc: 'Nous aident à comprendre comment les visiteurs interagissent avec notre site.',
    cookie2Ex: ['Google Analytics', 'Suivi des pages vues', 'Analyse du comportement des utilisateurs'],
    cookie3Title: 'Cookies marketing',
    cookie3Desc: 'Utilisés pour afficher des publicités pertinentes et suivre leurs performances.',
    cookie3Ex: ['Meta Pixel', 'Cookies de remarketing', 'Pixels des réseaux sociaux'],
    whatTitle: 'Que sont les cookies ?',
    whatText: 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils sont largement utilisés pour permettre aux sites web de fonctionner plus efficacement et fournir des informations à leurs propriétaires.',
    howTitle: 'Comment nous utilisons les cookies',
    howIntro: 'Chez Anclora Private Estates, nous utilisons les cookies aux fins suivantes :',
    how1Label: 'Fonctionnalités essentielles :',
    how1Text: 'Pour activer les fonctions de base du site, comme la navigation et l\'accès aux zones sécurisées',
    how2Label: 'Performance et analyse :',
    how2Text: 'Pour comprendre comment les visiteurs interagissent avec notre site et améliorer l\'expérience utilisateur',
    how3Label: 'Marketing :',
    how3Text: 'Pour diffuser des publicités personnalisées et mesurer leur efficacité',
    how4Label: 'Préférences :',
    how4Text: 'Pour mémoriser vos paramètres et préférences lors de vos prochaines visites',
    thirdTitle: 'Cookies tiers',
    thirdIntro: 'Nous utilisons des services de tiers qui peuvent déposer des cookies :',
    googleLabel: 'Google Analytics :',
    googleText: 'Utilisé pour analyser le trafic du site et le comportement des utilisateurs.',
    metaLabel: 'Meta (Facebook/Instagram) :',
    metaText: 'Utilisé pour la publicité et le suivi des conversions.',
    privacyPolicy: 'Politique de confidentialité',
    managingTitle: 'Gestion de vos préférences en matière de cookies',
    managingText1: 'Vous pouvez gérer vos préférences en matière de cookies à tout moment en cliquant sur le bouton ci-dessous ou via la bannière de cookies qui s\'affiche lors de votre première visite sur notre site.',
    managingText2: 'Vous pouvez également contrôler les cookies via les paramètres de votre navigateur :',
    contactTitle: 'Nous contacter',
    contactText: 'Pour toute question concernant notre politique en matière de cookies, contactez-nous à',
  },
  it: {
    backToHome: 'Torna alla home',
    title: 'Informativa sui Cookie',
    lastUpdated: 'Ultimo aggiornamento: 24 gennaio 2026',
    intro: 'Utilizziamo cookie propri e di terze parti per migliorare la Sua esperienza di navigazione, effettuare analisi statistiche e mostrarLe pubblicità personalizzata. Continuando a navigare, accetta il loro utilizzo. Può configurare o rifiutare i cookie in qualsiasi momento tramite il nostro gestore del consenso.',
    requiredBadge: 'Obbligatorio',
    cookie1Title: 'Cookie necessari',
    cookie1Desc: 'Indispensabili per il corretto funzionamento del sito. Non possono essere disattivati.',
    cookie1Ex: ['Cookie di sessione', 'Cookie di autenticazione', 'Cookie di sicurezza'],
    cookie2Title: 'Cookie analitici',
    cookie2Desc: 'Ci aiutano a capire come i visitatori interagiscono con il nostro sito.',
    cookie2Ex: ['Google Analytics', 'Tracciamento delle visualizzazioni di pagina', 'Analisi del comportamento degli utenti'],
    cookie3Title: 'Cookie di marketing',
    cookie3Desc: 'Utilizzati per mostrare annunci pertinenti e monitorarne le prestazioni.',
    cookie3Ex: ['Meta Pixel', 'Cookie di remarketing', 'Pixel dei social media'],
    whatTitle: 'Cosa sono i cookie?',
    whatText: 'I cookie sono piccoli file di testo che vengono memorizzati sul Suo dispositivo quando visita un sito web. Sono ampiamente utilizzati per far funzionare i siti web in modo più efficiente e fornire informazioni ai proprietari del sito.',
    howTitle: 'Come utilizziamo i cookie',
    howIntro: 'In Anclora Private Estates utilizziamo i cookie per i seguenti scopi:',
    how1Label: 'Funzionalità essenziali:',
    how1Text: 'Per abilitare le funzioni principali del sito, come la navigazione e l\'accesso alle aree protette',
    how2Label: 'Performance e analisi:',
    how2Text: 'Per capire come i visitatori interagiscono con il nostro sito e migliorare l\'esperienza utente',
    how3Label: 'Marketing:',
    how3Text: 'Per mostrare pubblicità personalizzata e misurarne l\'efficacia',
    how4Label: 'Preferenze:',
    how4Text: 'Per ricordare le Sue impostazioni e preferenze nelle visite future',
    thirdTitle: 'Cookie di terze parti',
    thirdIntro: 'Utilizziamo servizi delle seguenti terze parti che possono impostare cookie:',
    googleLabel: 'Google Analytics:',
    googleText: 'Utilizzato per analizzare il traffico del sito e il comportamento degli utenti.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'Utilizzato per la pubblicità e il tracciamento delle conversioni.',
    privacyPolicy: 'Informativa sulla Privacy',
    managingTitle: 'Gestione delle preferenze sui cookie',
    managingText1: 'Può gestire le Sue preferenze sui cookie in qualsiasi momento facendo clic sul pulsante sottostante o tramite il banner dei cookie che appare alla Sua prima visita sul nostro sito.',
    managingText2: 'Può anche controllare i cookie tramite le impostazioni del Suo browser:',
    contactTitle: 'Contattaci',
    contactText: 'Per qualsiasi domanda sulla nostra Informativa sui Cookie, contattaci a',
  },
  da: {
    backToHome: 'Tilbage til forsiden',
    title: 'Cookiepolitik',
    lastUpdated: 'Sidst opdateret: 24. januar 2026',
    intro: 'Vi bruger egne cookies og tredjepartscookies for at forbedre din browsingoplevelse, udføre statistiske analyser og vise dig personaliseret reklame. Ved at fortsætte med at browse accepterer du deres brug. Du kan konfigurere eller afvise cookies til enhver tid via vores samtykkestyring.',
    requiredBadge: 'Påkrævet',
    cookie1Title: 'Nødvendige cookies',
    cookie1Desc: 'Nødvendige for, at websitet fungerer korrekt. Disse kan ikke deaktiveres.',
    cookie1Ex: ['Sessionscookies', 'Autentificeringscookies', 'Sikkerhedscookies'],
    cookie2Title: 'Analytiske cookies',
    cookie2Desc: 'Hjælper os med at forstå, hvordan besøgende interagerer med vores website.',
    cookie2Ex: ['Google Analytics', 'Sidevisningssporing', 'Analyse af brugeradfærd'],
    cookie3Title: 'Marketingcookies',
    cookie3Desc: 'Bruges til at vise relevante annoncer og spore deres ydeevne.',
    cookie3Ex: ['Meta Pixel', 'Remarketingcookies', 'Pixels fra sociale medier'],
    whatTitle: 'Hvad er cookies?',
    whatText: 'Cookies er små tekstfiler, der gemmes på din enhed, når du besøger et website. De bruges i vid udstrækning til at få websites til at fungere mere effektivt og til at give information til websiteejerne.',
    howTitle: 'Sådan bruger vi cookies',
    howIntro: 'Hos Anclora Private Estates bruger vi cookies til følgende formål:',
    how1Label: 'Grundlæggende funktionalitet:',
    how1Text: 'For at aktivere grundlæggende websitefunktioner som navigation og adgang til sikre områder',
    how2Label: 'Ydeevne og analyse:',
    how2Text: 'For at forstå, hvordan besøgende interagerer med vores website og forbedre brugeroplevelsen',
    how3Label: 'Marketing:',
    how3Text: 'For at levere personaliserede annoncer og måle deres effektivitet',
    how4Label: 'Præferencer:',
    how4Text: 'For at huske dine indstillinger og præferencer til fremtidige besøg',
    thirdTitle: 'Tredjepartscookies',
    thirdIntro: 'Vi bruger tjenester fra følgende tredjeparter, der kan sætte cookies:',
    googleLabel: 'Google Analytics:',
    googleText: 'Bruges til at analysere websitetrafik og brugeradfærd.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'Bruges til annoncering og konverteringssporing.',
    privacyPolicy: 'Privatlivspolitik',
    managingTitle: 'Håndtering af dine cookiepræferencer',
    managingText1: 'Du kan håndtere dine cookiepræferencer til enhver tid ved at klikke på knappen nedenfor eller via det cookiebanner, der vises, når du første gang besøger vores website.',
    managingText2: 'Du kan også styre cookies via dine browserindstillinger:',
    contactTitle: 'Kontakt os',
    contactText: 'Har du spørgsmål om vores cookiepolitik, er du velkommen til at kontakte os på',
  },
  nl: {
    backToHome: 'Terug naar home',
    title: 'Cookiebeleid',
    lastUpdated: 'Laatste update: 24 januari 2026',
    intro: 'Wij gebruiken eigen cookies en cookies van derden om uw surfervaring te verbeteren, statistische analyses uit te voeren en u gepersonaliseerde advertenties te tonen. Door verder te surfen gaat u akkoord met het gebruik ervan. U kunt cookies op elk moment configureren of weigeren via ons toestemmingsbeheer.',
    requiredBadge: 'Vereist',
    cookie1Title: 'Noodzakelijke cookies',
    cookie1Desc: 'Essentieel voor het correct functioneren van de website. Deze kunnen niet worden uitgeschakeld.',
    cookie1Ex: ['Sessiecookies', 'Authenticatiecookies', 'Beveiligingscookies'],
    cookie2Title: 'Analytische cookies',
    cookie2Desc: 'Helpen ons begrijpen hoe bezoekers met onze website omgaan.',
    cookie2Ex: ['Google Analytics', 'Paginaweergavebeheer', 'Analyse van gebruikersgedrag'],
    cookie3Title: 'Marketingcookies',
    cookie3Desc: 'Worden gebruikt om relevante advertenties te tonen en hun prestaties bij te houden.',
    cookie3Ex: ['Meta Pixel', 'Remarketingcookies', 'Social media pixels'],
    whatTitle: 'Wat zijn cookies?',
    whatText: 'Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u een website bezoekt. Ze worden veel gebruikt om websites efficiënter te laten werken en informatie te verstrekken aan de website-eigenaren.',
    howTitle: 'Hoe wij cookies gebruiken',
    howIntro: 'Bij Anclora Private Estates gebruiken wij cookies voor de volgende doeleinden:',
    how1Label: 'Essentiële functionaliteit:',
    how1Text: 'Om basisfuncties van de website mogelijk te maken, zoals navigatie en toegang tot beveiligde gebieden',
    how2Label: 'Prestaties en analyse:',
    how2Text: 'Om te begrijpen hoe bezoekers met onze website omgaan en de gebruikerservaring te verbeteren',
    how3Label: 'Marketing:',
    how3Text: 'Om gepersonaliseerde advertenties te tonen en hun effectiviteit te meten',
    how4Label: 'Voorkeuren:',
    how4Text: 'Om uw instellingen en voorkeuren te onthouden voor toekomstige bezoeken',
    thirdTitle: 'Cookies van derden',
    thirdIntro: 'Wij gebruiken diensten van de volgende derden die cookies kunnen plaatsen:',
    googleLabel: 'Google Analytics:',
    googleText: 'Gebruikt om websiteverkeer en gebruikersgedrag te analyseren.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'Gebruikt voor advertenties en conversietracking.',
    privacyPolicy: 'Privacybeleid',
    managingTitle: 'Uw cookievoorkeuren beheren',
    managingText1: 'U kunt uw cookievoorkeuren op elk moment beheren door op de onderstaande knop te klikken of via de cookiebanner die verschijnt wanneer u onze website voor het eerst bezoekt.',
    managingText2: 'U kunt cookies ook beheren via uw browserinstellingen:',
    contactTitle: 'Contact',
    contactText: 'Als u vragen heeft over ons cookiebeleid, neem dan contact met ons op via',
  },
  no: {
    backToHome: 'Tilbake til forsiden',
    title: 'Informasjonskapselpolicy',
    lastUpdated: 'Sist oppdatert: 24. januar 2026',
    intro: 'Vi bruker egne informasjonskapsler og tredjeparts informasjonskapsler for å forbedre nettleseropplevelsen din, utføre statistiske analyser og vise deg personalisert reklame. Ved å fortsette å surfe aksepterer du bruken av dem. Du kan konfigurere eller avvise informasjonskapsler når som helst via vår samtykkesbehandler.',
    requiredBadge: 'Påkrevd',
    cookie1Title: 'Nødvendige informasjonskapsler',
    cookie1Desc: 'Nødvendige for at nettstedet skal fungere korrekt. Disse kan ikke deaktiveres.',
    cookie1Ex: ['Sesjonscookies', 'Autentiseringscookies', 'Sikkerhetscookies'],
    cookie2Title: 'Analytiske informasjonskapsler',
    cookie2Desc: 'Hjelper oss å forstå hvordan besøkende interagerer med nettstedet vårt.',
    cookie2Ex: ['Google Analytics', 'Sporing av sidevisninger', 'Analyse av brukeratferd'],
    cookie3Title: 'Markedsføringsinformasjonskapsler',
    cookie3Desc: 'Brukes til å vise relevante annonser og spore ytelsen deres.',
    cookie3Ex: ['Meta Pixel', 'Remarketingcookies', 'Sosiale medier-piksler'],
    whatTitle: 'Hva er informasjonskapsler?',
    whatText: 'Informasjonskapsler er små tekstfiler som lagres på enheten din når du besøker et nettsted. De brukes mye for å få nettsteder til å fungere mer effektivt og for å gi informasjon til nettstedseierne.',
    howTitle: 'Slik bruker vi informasjonskapsler',
    howIntro: 'Hos Anclora Private Estates bruker vi informasjonskapsler til følgende formål:',
    how1Label: 'Grunnleggende funksjonalitet:',
    how1Text: 'For å aktivere grunnleggende nettstedsfunksjoner som navigering og tilgang til sikre områder',
    how2Label: 'Ytelse og analyse:',
    how2Text: 'For å forstå hvordan besøkende interagerer med nettstedet vårt og forbedre brukeropplevelsen',
    how3Label: 'Markedsføring:',
    how3Text: 'For å levere personaliserte annonser og måle effektiviteten deres',
    how4Label: 'Preferanser:',
    how4Text: 'For å huske innstillingene og preferansene dine ved fremtidige besøk',
    thirdTitle: 'Tredjeparts informasjonskapsler',
    thirdIntro: 'Vi bruker tjenester fra følgende tredjeparter som kan sette informasjonskapsler:',
    googleLabel: 'Google Analytics:',
    googleText: 'Brukes til å analysere nettstedstrafikk og brukeratferd.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'Brukes til annonsering og konverteringssporing.',
    privacyPolicy: 'Personvernerklæring',
    managingTitle: 'Behandling av informasjonskapselpreferanser',
    managingText1: 'Du kan behandle preferansene dine for informasjonskapsler når som helst ved å klikke på knappen nedenfor eller via informasjonskapselbanneret som vises ved ditt første besøk på nettstedet vårt.',
    managingText2: 'Du kan også styre informasjonskapsler via nettleserinnstillingene dine:',
    contactTitle: 'Kontakt oss',
    contactText: 'Hvis du har spørsmål om informasjonskapselpolicyen vår, kan du kontakte oss på',
  },
  pt: {
    backToHome: 'Voltar ao início',
    title: 'Política de Cookies',
    lastUpdated: 'Última atualização: 24 de janeiro de 2026',
    intro: 'Utilizamos cookies próprios e de terceiros para melhorar a sua experiência de navegação, realizar análises estatísticas e mostrar-lhe publicidade personalizada. Ao continuar a navegar, aceita a sua utilização. Pode configurar ou recusar cookies a qualquer momento através do nosso gestor de consentimento.',
    requiredBadge: 'Obrigatório',
    cookie1Title: 'Cookies Necessários',
    cookie1Desc: 'Imprescindíveis para o correto funcionamento do sítio web. Não podem ser desativados.',
    cookie1Ex: ['Cookies de sessão', 'Cookies de autenticação', 'Cookies de segurança'],
    cookie2Title: 'Cookies Analíticos',
    cookie2Desc: 'Ajudam-nos a compreender como os visitantes interagem com o nosso sítio web.',
    cookie2Ex: ['Google Analytics', 'Rastreamento de visualizações de página', 'Análise do comportamento do utilizador'],
    cookie3Title: 'Cookies de Marketing',
    cookie3Desc: 'Utilizados para mostrar publicidade relevante e monitorizar o seu desempenho.',
    cookie3Ex: ['Meta Pixel', 'Cookies de remarketing', 'Píxeis de redes sociais'],
    whatTitle: 'O que são cookies?',
    whatText: 'Os cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo quando visita um sítio web. São amplamente utilizados para que os sítios web funcionem de forma mais eficiente e para fornecer informações aos proprietários do sítio.',
    howTitle: 'Como utilizamos os cookies',
    howIntro: 'Na Anclora Private Estates, utilizamos cookies para os seguintes fins:',
    how1Label: 'Funcionalidade essencial:',
    how1Text: 'Para ativar as funcionalidades principais do sítio, como navegação e acesso a áreas seguras',
    how2Label: 'Desempenho e análise:',
    how2Text: 'Para compreender como os visitantes interagem com o nosso sítio e melhorar a experiência do utilizador',
    how3Label: 'Marketing:',
    how3Text: 'Para apresentar publicidade personalizada e medir a sua eficácia',
    how4Label: 'Preferências:',
    how4Text: 'Para recordar as suas definições e preferências em futuras visitas',
    thirdTitle: 'Cookies de Terceiros',
    thirdIntro: 'Utilizamos serviços dos seguintes terceiros que podem instalar cookies:',
    googleLabel: 'Google Analytics:',
    googleText: 'Utilizado para analisar o tráfego do sítio web e o comportamento do utilizador.',
    metaLabel: 'Meta (Facebook/Instagram):',
    metaText: 'Utilizado para publicidade e rastreamento de conversões.',
    privacyPolicy: 'Política de Privacidade',
    managingTitle: 'Gestão das suas preferências de cookies',
    managingText1: 'Pode gerir as suas preferências de cookies a qualquer momento clicando no botão abaixo ou através do banner de cookies que aparece na sua primeira visita ao nosso sítio web.',
    managingText2: 'Também pode controlar os cookies através das definições do seu browser:',
    contactTitle: 'Contacte-nos',
    contactText: 'Se tiver alguma questão sobre a nossa Política de Cookies, contacte-nos em',
  },
};

export function CookiesPage() {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) as LocaleKey) in content
    ? (i18n.language.slice(0, 2) as LocaleKey)
    : 'en';
  const c = content[lang] ?? content['en'];

  const cookieTypes: CookieType[] = [
    {
      icon: Cookie,
      title: c.cookie1Title,
      description: c.cookie1Desc,
      examples: c.cookie1Ex,
      required: true,
    },
    {
      icon: BarChart3,
      title: c.cookie2Title,
      description: c.cookie2Desc,
      examples: c.cookie2Ex,
      required: false,
    },
    {
      icon: Target,
      title: c.cookie3Title,
      description: c.cookie3Desc,
      examples: c.cookie3Ex,
      required: false,
    },
  ];

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
          <div className="flex items-center gap-4 mb-4">
            <Cookie className="w-10 h-10 text-anclora-gold" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-anclora-cream">
              {c.title}
            </h1>
          </div>
          <p className="text-anclora-text-muted mb-12">
            {c.lastUpdated}
          </p>

          <div className="bg-anclora-teal-bg/50 rounded-2xl p-8 border border-white/10 mb-12">
            <p className="text-anclora-text-muted leading-relaxed m-0">
              {c.intro}
            </p>
          </div>

          {/* Cookie Types */}
          <div className="grid gap-6 mb-12">
            {cookieTypes.map((type) => (
              <div
                key={type.title}
                className="bg-anclora-teal-bg/50 rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-anclora-gold/10 flex items-center justify-center flex-shrink-0">
                    <type.icon className="w-6 h-6 text-anclora-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-xl font-semibold text-anclora-cream">
                        {type.title}
                      </h3>
                      {type.required && (
                        <span className="text-xs font-mono uppercase tracking-wider bg-anclora-gold/20 text-anclora-gold px-2 py-1 rounded">
                          {c.requiredBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-anclora-text-muted mb-3">
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((example) => (
                        <span
                          key={example}
                          className="text-xs text-anclora-text-muted bg-white/5 px-3 py-1 rounded-full"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Information */}
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.whatTitle}
            </h2>
            <p className="text-anclora-text-muted">{c.whatText}</p>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.howTitle}
            </h2>
            <p className="text-anclora-text-muted">{c.howIntro}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li><strong className="text-anclora-cream">{c.how1Label}</strong>{' '}{c.how1Text}</li>
              <li><strong className="text-anclora-cream">{c.how2Label}</strong>{' '}{c.how2Text}</li>
              <li><strong className="text-anclora-cream">{c.how3Label}</strong>{' '}{c.how3Text}</li>
              <li><strong className="text-anclora-cream">{c.how4Label}</strong>{' '}{c.how4Text}</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.thirdTitle}
            </h2>
            <p className="text-anclora-text-muted">{c.thirdIntro}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>
                <strong className="text-anclora-cream">{c.googleLabel}</strong>{' '}
                {c.googleText}{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-anclora-gold hover:underline"
                >
                  {c.privacyPolicy}
                </a>
              </li>
              <li>
                <strong className="text-anclora-cream">{c.metaLabel}</strong>{' '}
                {c.metaText}{' '}
                <a
                  href="https://www.facebook.com/privacy/policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-anclora-gold hover:underline"
                >
                  {c.privacyPolicy}
                </a>
              </li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.managingTitle}
            </h2>
            <p className="text-anclora-text-muted">{c.managingText1}</p>
            <p className="text-anclora-text-muted">{c.managingText2}</p>
            <ul className="text-anclora-text-muted space-y-2">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-anclora-gold hover:underline">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-anclora-gold hover:underline">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-anclora-gold hover:underline">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-anclora-gold hover:underline">
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-anclora-cream mt-12 mb-4">
              {c.contactTitle}
            </h2>
            <p className="text-anclora-text-muted">
              {c.contactText}{' '}
              <a href="mailto:privacidad@ancloraprivateestates.com" className="text-anclora-gold hover:underline">
                privacidad@ancloraprivateestates.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
