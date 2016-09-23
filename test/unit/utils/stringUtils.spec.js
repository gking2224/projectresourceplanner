import { expect } from 'chai'


describe('StringUtils.toTitleCase', () => {
  it ('should convert mixed case words to title case', () => {

    const values = [
      ['BOB', 'Bob'],
      ['Dick', 'Dick'],
      ['harry', 'Harry'],
      ['jOsEpHiNe', 'Josephine'],
    ]

    values.forEach(v => {
      const word = v[0]
      const expected = v[1]

      const toTitleCase = w => w.replace(/^([a-zA-Z]{1})(.*)$/, (m, g1, g2) => `${g1.toUpperCase()}${g2.toLowerCase()}`)
      expect(toTitleCase(word)).to.equal(expected)
    })
  })
})
