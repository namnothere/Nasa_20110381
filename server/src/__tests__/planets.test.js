const request = require('supertest');
const app = require('../app');

describe('GET /planets', function() {
    it('responds with json with status code 200', function(done) {
        request(app)
            .get('/planets')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
            if (err) return done(err);
                return done();
            });
      });
});
  