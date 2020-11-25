const objectTosqlInput = require('../src/utils').transformQueryStructure

test('should return empty object', async () => {
  console.log(
    '🚀 ~ file: util.test.js ~ line 9 ~ test ~  objectTosqlInput',
    objectTosqlInput(
      {
        name: 'age',
        age: 1,
        sex: '1',
      },
      ['name', 'age', 'sex'],
    ),
  )
})
