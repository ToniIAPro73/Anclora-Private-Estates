import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['es', 'en', 'de'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const localeValue = locale as string;
  if (!locales.includes(localeValue)) notFound();

  return {
    locale: localeValue,
    messages: (await import(`../locales/${locale}/translation.json`)).default
  };
});
