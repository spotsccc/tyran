import { simplifyNumberString } from './index'

export function weiToEth(wei: string): string {
  const len = wei.length
  if (len <= 18) {
    return simplifyNumberString(
      `0.${new Array(18 - len).fill(0).join('')}${wei}`,
    )
  }
  return simplifyNumberString(
    `${wei.slice(0, len - 18)}.${wei.slice(len - 18)}`,
  )
}
