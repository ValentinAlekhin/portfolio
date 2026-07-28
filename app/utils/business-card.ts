import type { BusinessCardSide } from '../types/business-card'
import { LocaleCode } from '../types/i18n'

export function getBusinessCardShareFilename(locale: LocaleCode): string {
  return `valentin-alekhin-business-card-${locale}.png`
}

export function getBusinessCardPrintFilename(
  locale: LocaleCode,
  side: BusinessCardSide,
): string {
  return `valentin-alekhin-business-card-${side}-${locale}-90x50-300dpi.png`
}

export function getBusinessCardArchiveFilename(locale: LocaleCode): string {
  return `valentin-alekhin-business-card-print-${locale}.zip`
}

export function getBusinessCardHomeUrl(locale: LocaleCode): string {
  return locale === LocaleCode.En
    ? 'https://alekhin.dev/en/'
    : 'https://alekhin.dev/'
}
