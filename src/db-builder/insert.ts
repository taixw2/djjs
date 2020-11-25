import { Options } from '.'

export default (options: Options) => {
  let statement = `INSERT INTO \`${options.table}\` `

  const keys = Object.keys(options.values)
  const values = Object.values(options.values)

  // fields
  statement += '('
  statement += keys.join(', ')
  statement += ')'

  statement += ' VALUES '

  // values
  statement += '('
  statement += values.join(', ')
  statement += ')'

  return statement
}
