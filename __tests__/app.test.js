const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data')

afterAll(() => db.end());
beforeEach(() => seed(testData))

describe('GET /api/categories', () => {
    test('status:200, returns the array of category objects', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({body}) => {
                const { categories } = body;
                expect(categories).toBeInstanceOf(Array);
                expect(categories).toHaveLength(4);
                categories.forEach((category) => {
                    expect.objectContaining({
                        slug: expect.any(String),
                        description:expect.any(String),
                    })
                })
            })
    })
    test('status:404, returns the message NO SUCH PATH', () => {
        return request(app)
        .get('/api/category')
        .expect(404)
        .then((response) => {
            const message = response.body.msg
            expect(message).toBe('NOT FOUND!')
        })
    })
});

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
                        created_at:expect.any(String),
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
            const message = response.body.msg
            expect(message).toBe('NOT FOUND!')
        })
    })
});

describe('GET /api/reviews/:review_id', () => {
    test('status:200 returns an object with required properties', () => {
        const ID = 1;
        return request(app)
        .get(`/api/reviews/${ID}`)
        .expect(200)
        .then(({body}) => {
            expect(body.review).toEqual({
                review_id: ID,
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: '2021-01-18T10:00:20.514Z',
                votes: 1
            })
        })
    })

    test('status:404 returns the bad request message when review id is invaild', () => {
        return request(app)
        .get(`/api/reviews/9999`)
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('NOT FOUND!')
        })
    })

    test('status:400 returns the bad request message when review id is not a number', () => {
        return request(app)
        .get(`/api/reviews/snow`)
        .expect(400)
        .then((response) => {
            const message = response.body.msg
            expect(message).toBe('BAD REQUEST!')
        })
    })

})
