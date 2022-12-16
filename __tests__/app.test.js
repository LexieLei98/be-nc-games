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
            expect(body.review).toMatchObject({
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

describe('6. GET /api/reviews/:review_id/comments', () => {
    test('status:200 returns the array of comments of the given review_id', () => {
        return request(app)
        .get(`/api/reviews/2/comments`)
        .expect(200)
        .then(({body}) => {
            const {comments} = body;
                expect(comments).toHaveLength(3);
                expect(comments).toBeSortedBy('created_at', {descending: true});
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes:expect.any(Number),
                            created_at:expect.any(String),
                            author:expect.any(String),
                            body: expect.any(String),
                            review_id: 2,
                        })
                    )
                })
        })
    })

    test('status:200 returns an empty array when review_id is valid but no comments of the given id', () => {
        return request(app)
        .get(`/api/reviews/1/comments`)
        .expect(200)
        .then(({body}) => {
            const {comments} = body;
            expect(comments).toEqual([])
        })
    })

    test('status:404 returns NOT FOUND when review_id is not valid', () => {
        const ID = 999;
        return request(app)
        .get(`/api/reviews/${ID}/comments`)
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('NOT FOUND!')
        })
    })

    test('status:400 returns BAD REQUEST when review_id is not a number', () => {
        return request(app)
        .get(`/api/reviews/snow/comments`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST!')
        })
    })
})

describe('7. POST /api/reviews/:review_id/comments', () => {
    test('status:201 returns the posted comment ', () => {
        const newComment = {
            username:'bainesface',
            body:'I love this game!',
        }
        return request(app)
        .post('/api/reviews/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            expect(body.comments).toEqual({
                comment_id:7,
                author:'bainesface',
                body:'I love this game!',
                created_at: expect.any(String),
                review_id: 2,
                votes: 0,
            })
        })
    });
    test('status:400 returns BAD REQUEST when missing keys in the body', () => {
        const newComment = {};
        return request(app)
        .post('/api/reviews/2/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST!')
        })
    })
    test('status:400 returns BAD REQUEST when review id is not a number ', () => {
        const newComment = {
            username:'coctealei',
            body:'I love this game!',
        }
        return request(app)
        .post('/api/reviews/snow/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST!')
        })
    })
    test('status:404 returns NOT FOUND when non existent review_id ', () => {
        const newComment = {
            username:'bainesface',
            body:'I love this game!',
        }
        return request(app)
        .post('/api/reviews/99/comments')
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('NOT FOUND!')
        })
    })
    test('status:404 returns NOT FOUND when non existent username ', () => {
        const newComment = {
            username:'cocatealei',
            body:'I love this game!',
        }
        return request(app)
        .post('/api/reviews/2/comments')
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('NOT FOUND!')
        })
    })
    test('status:201 returns the posted comment ', () => {
        const newComment = {
            username:'bainesface',
            body:'I love this game!',
            location:'London'
        }
        return request(app)
        .post('/api/reviews/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            expect(body.comments).toEqual({
                comment_id:7,
                author:'bainesface',
                body:'I love this game!',
                created_at: expect.any(String),
                review_id: 2,
                votes: 0,
            })
        })
    });
})

describe('8. PATCH /api/reviews/:review_id', () => {
    test('status:200 returns the updated review', () => {
        const newVotes = { inc_votes : 1 }
        return request(app)
        .patch('/api/reviews/1')
        .send(newVotes)
        .expect(200)
        .then(({body}) => {
            expect(body.review).toEqual({
                review_id: 1,
                title: 'Agricola',
                category: 'euro game',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_body: 'Farmyard fun!',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                created_at: '2021-01-18T10:00:20.514Z',
                votes: 2
            })
        })
    });

    test('status:200 when body with extra keys', () => {
        const newVotes = { inc_votes : 1, location : 'London' }
        return request(app)
        .patch('/api/reviews/1')
        .send(newVotes)
        .expect(200)
        .then(({body}) => {
            expect(body.review).toEqual({
                review_id: 1,
                title: 'Agricola',
                category: 'euro game',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_body: 'Farmyard fun!',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                created_at: '2021-01-18T10:00:20.514Z',
                votes: 2
            })
        })
    });

    test('status:400 returns BAD REQUEST when missing keys in the body', () => {
        const newVotes = {};
        return request(app)
        .patch('/api/reviews/1')
        .send(newVotes)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST!')
        })
    });

    test('status:404 returns NOT FOUND when non existent review_id ', () => {
        const newVotes = { inc_votes : 1 }
        return request(app)
        .patch('/api/reviews/99')
        .send(newVotes)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('NOT FOUND!')
        })
    });

    test('status:400 returns BAD REQUEST when review id is not a number ', () => {
        const newVotes = { inc_votes : 1 }
        return request(app)
        .patch('/api/reviews/snow')
        .send(newVotes)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST!')
        })
    });

    test('status:400 returns BAD REQUEST when given the wrong key', () => {
        const newVotes = { 'snow' : 1 }
        return request(app)
        .patch('/api/reviews/1')
        .send(newVotes)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST!')
        })
    });
    test('status:400 returns BAD REQUEST when the votes are not a number', () => {
        const newVotes = { inc_votes : 'snow' }
        return request(app)
        .patch('/api/reviews/1')
        .send(newVotes)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST!')
        })
    });
})

describe('GET /api/users', () => {
    test('status:200, returns the array of user objects', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                const { users } = body;
                expect(users).toHaveLength(4);
                users.forEach((user) => {
                    expect.objectContaining({
                        username: expect.any(String),
                        name:expect.any(String),
                        avatar_url:expect.any(String),
                    })
                })
            })
    })
})

describe('10. GET /api/reviews (queries)', () => {
    test('status:200, returns the array with specific catergory', () => {
        return request(app)
            .get('/api/reviews?category=euro game')
            .expect(200)
            .then(({body}) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy('created_at', {descending: true});
                reviews.forEach((review) => {
                    expect.objectContaining({
                        category:'euro game',
                    })
                })
            })
    })
    test('status:200, returns the array with ASC order', () => {
        return request(app)
            .get('/api/reviews?order=ASC')
            .expect(200)
            .then(({body}) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy('created_at', {descending: false});
            })
    })
    test('status:200, returns the array sorted by title', () => {
        return request(app)
            .get('/api/reviews?sort_by=title')
            .expect(200)
            .then(({body}) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy('title', {descending: true});
            })
    })
    test('status:404, returnsBAD REQUEST when no such catergory ', () => {
        return request(app)
            .get('/api/reviews?category=snow')
            .expect(404)
            .then((response) => {
                const message = response.body.msg
                expect(message).toBe('NOT FOUND')
            })
    })
    test('status:400, returns BAD REQUEST when no such order', () => {
        return request(app)
            .get('/api/reviews?order=snow')
            .expect(400)
            .then((response) => {
                const message = response.body.msg
                expect(message).toBe('BAD REQUEST')
            })
    })
    test('status:400, returns BAD REQUEST with no such sort by', () => {
        return request(app)
            .get('/api/reviews?sort_by=snow')
            .expect(400)
            .then((response) => {
                const message = response.body.msg
                expect(message).toBe('BAD REQUEST')
            })
    })
    test("status:200, returns the empty array if category is children''s games", () => {
        return request(app)
            .get("/api/reviews?category=children''s games")
            .expect(200)
            .then(({body}) => {
                const { reviews } = body;
                expect(reviews).toEqual([])
            })
    })
    test('status:200, returns the array for multiple queries', () => {
        return request(app)
            .get('/api/reviews?sort_by=title&&order=ASC')
            .expect(200)
            .then(({body}) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy('title', {descending: false});
            })
    })
})

describe('11. GET /api/reviews/:review_id (comment count)', () => {
    test('status:200 returns an object with required properties and comment counts', () => {
        return request(app)
        .get(`/api/reviews/1`)
        .expect(200)
        .then(({body}) => {
            expect(body.review).toMatchObject({
            comment_count:'0',
            })
        })
    })
})

describe('12. DELETE /api/comments/:comment_id', () => {
    test('status:204, responds with an empty response body', () => {
      return request(app)
      .delete('/api/comments/2')
      .expect(204);
    });

    test('status:404 returns BAD REQUEST when comment id is invaild', () => {
        return request(app)
        .delete('/api/comments/99')
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('NOT FOUND!')
        })
    })

    test('status:400 returns BAD REQUEST when comment id is not a number', () => {
        return request(app)
        .delete('/api/comments/snow')
        .expect(400)
        .then((response) => {
            const message = response.body.msg
            expect(message).toBe('BAD REQUEST!')
        })
    })
  });


describe('13. GET /api', () => {
    test('200: responds with object of different endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body : {endpoints}}) => {
            expect(endpoints).toBeInstanceOf(Object)
        })
    })
});