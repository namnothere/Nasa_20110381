const request = require('supertest');
const app = require('../app');

const launchPayload = {
    mission: 'Falcon 1',
    rocket: 'Falcon 1',
    target: 'Kepler-62 f',
    launchDate: 'January 4, 2030'
}

const flightNumber = 100;

describe('GET /launches', function() {
    it('responds with json with status code 200', function(done) {
        request(app)
            .get('/launches')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
            if (err) return done(err);
                return done();
            });
      });
});
  

describe('POST /launches', function() {
    it('responds with json with status code 201', function(done) {
        request(app)
        .post('/launches')
        .send(launchPayload)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
            if (err) return done(err);
                return done();
        });
    });
});

describe('DELETE /launches/:id', function() {
    it('responds with json with status code 200', function(done) {
        request(app)
        .delete(`/launches/${flightNumber}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
                return done();
        });
    });
});

describe('DELETE non-exists /launches/:id', function() {
    it('responds with json and status code 404', function(done) {
        const id = 0;
        request(app)
        .delete(`/launches/${id}`)
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
            if (err) return done(err);
                return done();
        });
    });
});
  