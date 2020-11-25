import { Condition } from '.'

export function isCondition(value: any): value is Condition {
  return Object.prototype.toString.call(value) === '[object Object]'
}
