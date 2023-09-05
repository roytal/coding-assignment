const { sayHey } = require('../src')

describe('sayHey', () => {
    it('should say Hey to given name', () => {
        expect(sayHey('John')).toBe('Hey John')
    })
})
