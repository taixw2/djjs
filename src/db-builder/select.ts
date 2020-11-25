import { Options } from '.'
import { isCondition } from './util'

const select = (options: Options) => {
  let statement = 'SELECT '

  let fields = '*'
  if (Array.isArray(options.values)) {
    fields = options.values.join(',')
  }

  statement += `${fields} FROM \`${options.table}\` `

  // WHERE
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

    where = 'WHERE ' + whereConditions.join(',')
  }

  statement += where

  // GROUP BY
  let group = ''
  if (options.group) {
    group += ' GROUP BY '
    group += options.group.join(',')
    group += ' '
  }
  statement += group

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

export default select
