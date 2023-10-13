import { expect } from '@jest/globals'
import { simplifyNumberString } from './simplify-number-string'

describe('simplify-number-string', () => {
  it('10.00000', () => {
    expect(simplifyNumberString('10.00000')).toEqual('10')
  })

  it('10.00010', () => {
    expect(simplifyNumberString('10.00010')).toEqual('10.0001')
  })

  it('10.0001', () => {
    expect(simplifyNumberString('10.0001')).toEqual('10.0001')
  })

  it('0.0001', () => {
    expect(simplifyNumberString('0.0001')).toEqual('0.0001')
  })

  it('0', () => {
    expect(simplifyNumberString('0')).toEqual('0')
  })
})
