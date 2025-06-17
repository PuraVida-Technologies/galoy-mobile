import { Translation } from "../i18n-types"
import en from '../en'
import rawTranslated from '../raw-i18n/translations/es.json'
const merge = require("lodash.merge")

const translated: Translation = merge({}, en as Translation, rawTranslated)

export default translated