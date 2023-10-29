import { Order } from '@/infrastructure/artifacts.repository'
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class OrderParsePipe implements PipeTransform {
  transform(value: unknown) {
    if (!value) {
      return Order.direct
    }
    if (value !== Order.direct && value !== Order.reverse) {
      throw new BadRequestException(
        `Order can be only ${Order.reverse} or ${Order.direct}`,
      )
    }
    return value
  }
}

@Injectable()
export class RarityParsePipe implements PipeTransform {
  transform(value: unknown) {
    const RARITY_VALUES = ['common', 'rare', 'epic', 'legendary', 'mystery']
    if (!value) {
      return []
    }
    if (Array.isArray(value)) {
      if (value.some((v) => !RARITY_VALUES.includes(v))) {
        throw new BadRequestException(
          `Rarity should contain only ${RARITY_VALUES.join(', ')}`,
        )
      }
      return value
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('Rarity has bad type')
    }
    const arr = value.split(',')
    if (arr.some((v) => !RARITY_VALUES.includes(v))) {
      throw new BadRequestException(
        `Rarity should contain only ${RARITY_VALUES.join(', ')}`,
      )
    }
    return arr
  }
}

@Injectable()
export class GemParsePipe implements PipeTransform {
  transform(value: unknown) {
    const GEM_VALUES = ['yellow', 'green', 'red', 'blue']
    if (!value) {
      return []
    }
    if (Array.isArray(value)) {
      if (value.some((v) => !GEM_VALUES.includes(v))) {
        throw new BadRequestException(
          `Gem should contain only ${GEM_VALUES.join(', ')}`,
        )
      }
      return value
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('Gem has bad type')
    }
    const arr = value.split(',')
    if (arr.some((v) => !GEM_VALUES.includes(v))) {
      throw new BadRequestException(
        `Gem should contain only ${GEM_VALUES.join(', ')}`,
      )
    }
    return arr
  }
}

@Injectable()
export class PropertyParsePipe implements PipeTransform {
  transform(value: unknown) {
    const PROPERTY_VALUES = ['common', 'cursed', 'magic', 'enchanted']
    if (!value) {
      return []
    }
    if (Array.isArray(value)) {
      if (value.some((v) => !PROPERTY_VALUES.includes(v))) {
        throw new BadRequestException(
          `Property should contain only ${PROPERTY_VALUES.join(', ')}`,
        )
      }
      return value
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('Property has bad type')
    }
    const arr = value.split(',')
    if (arr.some((v) => !PROPERTY_VALUES.includes(v))) {
      throw new BadRequestException(
        `Property should contain only ${PROPERTY_VALUES.join(', ')}`,
      )
    }
    return arr
  }
}
