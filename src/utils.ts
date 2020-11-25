// UTF8 的世界
export const UTF8Date = () => {
  return new Date(Date.now() + 8 * 60 * 60 * 1000)
}

/**
 * 获取秒树
 */
export const getSecond = () => {
  return ~~(UTF8Date().getTime() / 1000)
}

/**
 * 用于 sql update 时源数据与用户输入的数据合并
 * @param object
 * @param sources
 */
export const defaults = (object, ...sources) => {
  object = Object(object)
  sources.forEach((source) => {
    if (source != null) {
      source = Object(source)
      for (const key in source) {
        const value = object[key]
        if (value === undefined) {
          object[key] = source[key]
        }
      }
    }
  })
  return object
}

/**
 * 取出参数中的数据，并转换成对象
 *
 * input { name: "abc", age: 12 }
 * output: [
 *  { name: "?", age: ? },
 *  ["abc", 12]
 * ]
 * @param object
 * @param sources
 */
export const transformQueryStructure = (object: Record<string, any>, keys: string[]) => {
  const output: [Record<string, string>, any[]] = [{}, []]

  keys.forEach((key) => {
    output[0][key] = '?'
    output[1].push(object[key])
  })

  return output
}
