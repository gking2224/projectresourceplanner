
const StringUtils = {
  toTitleCase: s => s.replace(/^([a-zA-Z]{1})(.*)$/, (m, g1, g2) => `${g1.toUpperCase()}${g2.toLowerCase()}`)
}

export default StringUtils
