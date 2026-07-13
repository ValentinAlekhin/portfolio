export enum LocaleCode {
  Ru = 'ru',
  En = 'en',
}

export const localeLanguageTag: Record<LocaleCode, string> = {
  [LocaleCode.Ru]: 'ru-RU',
  [LocaleCode.En]: 'en-US',
}

export const localeTimeFormat: Record<LocaleCode, string> = {
  [LocaleCode.Ru]: 'ru-RU',
  [LocaleCode.En]: 'en-GB',
}
