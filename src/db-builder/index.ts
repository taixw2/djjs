import insert from './insert'
import select from './select'
import update from './update'

export interface Condition {
  condition: '=' | '<' | '>' | '>=' | '<=' | '<>'
  value: any
}

/**
 * 优先处理最简单的，以后再搞其他的
 */
export interface Options {
  type: 'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE'

  table: string

  values: Record<string, any> | string[]
  // 条件
  condition: Record<string, Condition | string>
  // limit
  limit: [number, number]
  // ORDER BY
  order: [string | string[], 'ASC', 'DESC']
  // GROUP
  group: string[]
}

export default function dbBuilder(option: Options) {
  switch (option.type) {
    case 'INSERT':
      return insert(option)
    case 'SELECT':
      return select(option)
    case 'UPDATE':
      return update(option)
    default:
      break
  }
}
