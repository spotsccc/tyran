import { weiToEth } from './wei-to-eth'

describe('wei-to-eth', () => {
  it('1 eth', () => {
    expect(weiToEth('1000000000000000000')).toEqual('1')
  })

  it('100 eth', () => {
    expect(weiToEth('100000000000000000000')).toEqual('100')
  })

  it('0.100000000000 eth', () => {
    expect(weiToEth('100000000000000000')).toEqual('0.1')
  })

  it('0.102030000000 eth', () => {
    expect(weiToEth('102030000000000000')).toEqual('0.10203')
  })

  it('0.102030000001 eth', () => {
    expect(weiToEth('102030000001000000')).toEqual('0.102030000001')
  })
})
