import { profile } from '../data/profile'
import { LocaleCode } from '../types/i18n'
import type { PresentationFormat, PresentationPalette } from '../types/presentation'

export function getPresentationHomeUrl(locale: LocaleCode): string {
  return `https://${profile.domain}/${locale === LocaleCode.En ? `${LocaleCode.En}/` : ''}`
}

export function getPresentationFilename(
  locale: LocaleCode,
  format: PresentationFormat,
  palette: PresentationPalette,
): string {
  return `valentin-alekhin-presentation-${locale}-${format}-${palette}.png`
}
