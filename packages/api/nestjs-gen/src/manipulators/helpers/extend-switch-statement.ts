import { SwitchStatement } from 'ts-morph'

export function extendSwitchStatement (statement: SwitchStatement, newCaseText: string) {
  const caseBlock = statement.getCaseBlock()
  const caseBlockText = caseBlock.getText()

  const defaultIndex = caseBlockText.indexOf('default:')

  let newCaseBlockText: string

  if (defaultIndex !== -1) {
    newCaseBlockText
      = caseBlockText.slice(0, defaultIndex).trimEnd() + '\n'
        + newCaseText + '\n'
        + caseBlockText.slice(defaultIndex)
  } else {
    const closingBraceIndex = caseBlockText.lastIndexOf('}')

    newCaseBlockText
      = caseBlockText.slice(0, closingBraceIndex).trimEnd() + '\n'
        + newCaseText + '\n'
        + caseBlockText.slice(closingBraceIndex)
  }

  caseBlock.replaceWithText(newCaseBlockText)
}
