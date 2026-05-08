import 'i18next';
import type { defaultResources } from './lib/i18n-resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof defaultResources;
  }
}
