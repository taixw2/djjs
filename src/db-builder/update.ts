import { Options } from '.'
import { isCondition } from './util'

//
export default (options: Options) => {
  let statement = `UPDATE \`${options.table}\` SET `

  const keys = Object.keys(options.values)

  const assignmentList = []
  keys.forEach((key, index) => {
    assignmentList.push(`${key} = ${options.values[key]}`)
  })

  statement += assignmentList.join(',')
  statement += ' '

  let where = ''
  if (options.condition && Object.keys(options.condition).length) {
    const whereConditions = Object.keys(options.condition).reduce((where, key) => {
      let value = options.condition[key]
      if (isCondition(value)) {
        value = value.condition + value.value
      } else {
        value = ' = ' + value
      }

      where.push(key + value)

      return where
    }, [])

    where = whereConditions.join(',')
  }

  statement += where

  // ORDER BY
  let order = ''
  if (options.order) {
    const [field, position] = options.order
    order += ' ORDER BY '
    order += Array.isArray(field) ? field.join(',') : field
    order += ' ' + (position || '')
    order += ' '
  }
  statement += order

  let limit = ''
  if (options.limit) {
    limit += ' LIMIT '
    limit += options.limit.join(',')
    limit += ' '
  }
  statement += limit

  return statement
}
