import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { readTranslationFromDisk } from "typesafe-i18n/exporter"

// Getting the directory name from the URL of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_RAW_EXPORT_PATH = `${__dirname}/../app/i18n/raw-i18n`

const writeToFile = async (translation, locale, directory) => {
  const filePath = `${directory}/${locale}.json`
  const data = JSON.stringify(translation, null, 4) + "\n"
  console.log(`[export-language] Writing translation for '${locale}' to: ${filePath}`)
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error(`[export-language] Error writing file: ${filePath}`, err)
      throw err
    } else {
      console.log(`[export-language] Successfully wrote file: ${filePath}`)
    }
  })
}

const exportTranslationsForLocale = async (locale, directory) => {
  console.log(`[export-language] Exporting translations for locale: '${locale}'`)
  const mapping = await readTranslationFromDisk(locale)
  const translation = Array.isArray(mapping.translations)
    ? mapping.translations[0]
    : mapping.translations
  if (translation) {
    await writeToFile(translation, locale, directory)
    return true
  }
  console.warn(`[export-language] No translations found for locale: '${locale}'`)
  return false
}

const locale = process.argv[2] || "en"
const fallbackExportDirectory =
  locale === "en"
    ? `${DEFAULT_RAW_EXPORT_PATH}/source`
    : `${DEFAULT_RAW_EXPORT_PATH}/translations`
const exportDirectory = process.argv[3] || fallbackExportDirectory

console.log(`[export-language] Using export directory: ${exportDirectory}`)
exportTranslationsForLocale(locale, exportDirectory)
