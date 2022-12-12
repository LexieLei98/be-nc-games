const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data')

afterAll(() => db.end());
beforeEach(() => seed(testData))

describe('GET /api/reviews', () => {
    test('status:200, returns the array of review objects', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({body}) => {
                const { reviews } = body;
                expect(reviews).toBeInstanceOf(Array);
                expect(reviews).toHaveLength(13);
                reviews.forEach((review) => {
                    expect.objectContaining({
                        owner:expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category:expect.any(String),
                        review_img_url:expect.any(String),
                        created_at:expect.any(Number),
                        votes:expect.any(Number),
                        designer:expect.any(String),
                        comment_count: expect.any(Number),
                    })
                })
            })
    })
    test('status:404, returns the message NO SUCH PATH', () => {
        return request(app)
        .get('/api/review')
        .expect(404)
        .then((response) => {
            const message = response.body.message
            expect(message).toBe('SORRY NO SUCH PATH ;(')
        })
    })
});
