const select = require('../src/db-builder/select').default
const insert = require('../src/db-builder/insert').default
const update = require('../src/db-builder/update').default

test('select', async () => {
  const value = select({
    type: 'SELECT',
    table: 'tb_user',
    values: ['id', 'user'],
    condition: {
      id: '?',
    },
    limit: [0, 20],
    order: ['create_time'],
    group: ['group'],
  })
  console.log('🚀 ~ file: test.test copy.js ~ line 15 ~ test ~ value', value)
})

test('update', async () => {
  const value = update({
    type: 'UPDATE',
    table: 'tb_user',
    values: {
      name: '?',
      library: '?',
    },
    condition: {
      id: '?',
    },
    limit: [0, 20],
    order: ['create_time'],
  })

  console.log('🚀 ~ file: test.test copy.js ~ line 15 ~ test ~ value', value)
})

test('insert', async () => {
  const value = insert({
    type: 'INSERT',
    table: 'tb_user',
    values: {
      name: '?',
      value: '?',
      hello: '?',
    },
  })
  console.log('🚀 ~ file: test.test copy.js ~ line 15 ~ test ~ value', value)
})
