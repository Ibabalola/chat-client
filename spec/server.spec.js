const request = require('request');

// describe is test suite / grouping of unit tests
describe('calc', () => {
    it('should multiple 2 and 2', () => {
        expect(2*2).toBe(4);
    })
})

describe('get messages', () => {
    // need to make a http get request, which we can't do natively 
    // so we'd to use a library 'request'

    // with async test, test are completed before
    // callback is called
    // to resolve this pass back done 
    // in order to set test as an async test
    // and call done when async code finishes
    it('should return 200 OK', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(res.statusCode).toEqual(200);
            done();
        })
    })

    it('should return a list that is not empty', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(JSON.parse(res.body).length).toBeGreaterThan(0)
            done();
        })
    })
})