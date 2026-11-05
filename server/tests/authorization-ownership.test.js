const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/User');
const { Portfolio } = require('../src/models/Portfolio');
const config = require('../src/config/env');

describe('Portfolio Owner Authorization & Security Suite (Requirements 3 & 5)', () => {
  let userA, tokenA;
  let userB, tokenB;
  let portfolioA, portfolioB, unpublishedPortfolioB;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongodbUri);
    }
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: ['usera_auth@test.com', 'userb_auth@test.com'] } });
    await Portfolio.deleteMany({ slug: { $in: ['slug-portfolio-a', 'slug-portfolio-b', 'slug-private-b'] } });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    await User.deleteMany({ email: { $in: ['usera_auth@test.com', 'userb_auth@test.com'] } });
    await Portfolio.deleteMany({ slug: { $in: ['slug-portfolio-a', 'slug-portfolio-b', 'slug-private-b'] } });

    userA = await User.create({
      name: 'User A',
      email: 'usera_auth@test.com',
      password: 'password123',
    });
    tokenA = userA.generateAuthToken();

    userB = await User.create({
      name: 'User B',
      email: 'userb_auth@test.com',
      password: 'password123',
    });
    tokenB = userB.generateAuthToken();

    portfolioA = await Portfolio.create({
      user: userA._id,
      title: "User A's Portfolio",
      slug: 'slug-portfolio-a',
      theme: 'minimal-pro',
      isPublished: true,
      personalInfo: { fullName: 'User A', email: 'usera_auth@test.com', headline: 'Engineer A' },
      projects: [{ title: 'Project A1', description: 'Description A1' }],
    });

    portfolioB = await Portfolio.create({
      user: userB._id,
      title: "User B's Portfolio",
      slug: 'slug-portfolio-b',
      theme: 'dark-developer',
      isPublished: true,
      personalInfo: { fullName: 'User B', email: 'userb_auth@test.com', headline: 'Engineer B' },
      projects: [{ title: 'Project B1', description: 'Description B1' }],
    });

    unpublishedPortfolioB = await Portfolio.create({
      user: userB._id,
      title: "User B's Private Draft",
      slug: 'slug-private-b',
      theme: 'modern-glass',
      isPublished: false,
      personalInfo: { fullName: 'User B', email: 'userb_auth@test.com', headline: 'Private Draft' },
    });
  });

  // Scenario 1: Unauthenticated request to protected endpoint -> 401
  it('1. Rejects unauthenticated request to protected endpoint with HTTP 401', async () => {
    const res = await request(app).get(`/api/portfolios/${portfolioA._id}`);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // Scenario 2: Authenticated user accesses own portfolio -> 200
  it('2. Allows authenticated owner to access their own portfolio with HTTP 200', async () => {
    const res = await request(app)
      .get(`/api/portfolios/${portfolioA._id}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.portfolio.title).toBe("User A's Portfolio");
  });

  // Scenario 3: Authenticated user A attempts to update user B's portfolio -> 403 or 404
  it("3. Forbids user A from updating user B's portfolio with HTTP 404/403", async () => {
    const res = await request(app)
      .put(`/api/portfolios/${portfolioB._id}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: "Hacked by User A" });

    expect([403, 404]).toContain(res.status);
    expect(res.body.success).toBe(false);

    // Verify title was not modified
    const untouched = await Portfolio.findById(portfolioB._id);
    expect(untouched.title).toBe("User B's Portfolio");
  });

  // Scenario 4: Authenticated user A attempts to delete user B's portfolio -> 403 or 404
  it("4. Forbids user A from deleting user B's portfolio with HTTP 404/403", async () => {
    const res = await request(app)
      .delete(`/api/portfolios/${portfolioB._id}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect([403, 404]).toContain(res.status);
    expect(res.body.success).toBe(false);

    // Verify portfolio still exists in DB
    const existing = await Portfolio.findById(portfolioB._id);
    expect(existing).not.toBeNull();
  });

  // Scenario 5: Authenticated user A attempts to regenerate user B's portfolio section -> 403 or 404
  it("5. Forbids user A from regenerating a section of user B's portfolio with HTTP 404/403", async () => {
    const res = await request(app)
      .post(`/api/portfolios/${portfolioB._id}/regenerate-section`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ section: 'summary', sectionData: 'Injected summary' });

    expect([403, 404]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  // Scenario 6: Authenticated user A attempts to upload/delete avatar on user B's portfolio -> 403 or 404
  it("6. Forbids user A from modifying avatar on user B's portfolio with HTTP 404/403", async () => {
    const deleteRes = await request(app)
      .delete(`/api/portfolios/${portfolioB._id}/avatar`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect([403, 404]).toContain(deleteRes.status);
    expect(deleteRes.body.success).toBe(false);
  });

  // Scenario 7: Public visitor requests published portfolio via public slug -> 200 (sanitized public fields only)
  it('7. Allows public visitor to access published portfolio via public slug with HTTP 200', async () => {
    const res = await request(app).get(`/api/portfolios/public/${portfolioA.slug}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.portfolio.slug).toBe(portfolioA.slug);
    expect(res.body.portfolio.isPublished).toBe(true);
  });

  // Scenario 8: Public visitor requests unpublished portfolio via public slug -> 404
  it('8. Rejects public visitor accessing unpublished portfolio via public slug with HTTP 404', async () => {
    const res = await request(app).get(`/api/portfolios/public/${unpublishedPortfolioB.slug}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // Security Test: Password change invalidates previously issued JWT tokens
  it('9. Invalidate existing JWT tokens immediately upon password change (ASVS V3)', async () => {
    // 1. Verify tokenA is currently valid
    const preRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(preRes.status).toBe(200);

    // 2. Change password for userA
    const changeRes = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ currentPassword: 'password123', newPassword: 'newSecurePassword456' });
    expect(changeRes.status).toBe(200);

    // 3. Attempt to access protected route with the OLD tokenA -> must be rejected with 401
    const postRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(postRes.status).toBe(401);
    expect(postRes.body.message).toMatch(/password/i);
  });

  // Security Test: NoSQL injection attempts stripped
  it('10. Neutralizes NoSQL operator injection in request bodies (ASVS V5)', async () => {
    // Attacker sends MongoDB query operators inside body
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: { $gt: '' }, password: { $ne: null } });

    // Operator keys were stripped, so email and password become undefined -> 400
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Please provide both email and password');
  });
});

