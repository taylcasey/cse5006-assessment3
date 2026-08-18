import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:4000';

// server use case: CRUD lifecycle for a Post via RSS server API. Uses Playwright's `request` fixture
// to call API directly without using browser.
test('RSS server supports full CRUD lifecycle for a post', async ({ request }) => {
    // ensures existing feed and author are true to enable test
    const feedsRes = await request.get(`${API_URL}/api/feeds`);
    expect(feedsRes.ok()).toBeTruthy();
    const feeds = await feedsRes.json();
    expect(feeds.length).toBeGreaterThan(0);

    const authorsRes = await request.get(`${API_URL}/api/authors`);
    expect(authorsRes.ok()).toBeTruthy();
    const authors = await authorsRes.json();
    expect(authors.length).toBeGreaterThan(0);

    // CREATE
    const createRes = await request.post(`${API_URL}/api/posts`, {
        data: {
            title: 'Playwright Test Post',
            content: 'Created by an automated server-side CRUD test.',
            link: 'https://example.com/playwright-test',
            feedId: feeds[0].id,
            authorId: authors[0].id,
        },
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.title).toBe('Playwright Test Post');

    // READ
    const readRes = await request.get(`${API_URL}/api/posts/${created.id}`);
    expect(readRes.ok()).toBeTruthy();
    const fetched = await readRes.json();
    expect(fetched.id).toBe(created.id);

    // UPDATE
    const updateRes = await request.put(`${API_URL}/api/posts/${created.id}`, {
        data: {
            title: 'Playwright Test Post (Updated)',
            content: fetched.content,
            link: fetched.link,
        },
    });
    expect(updateRes.ok()).toBeTruthy();
    const updated = await updateRes.json();
    expect(updated.title).toBe('Playwright Test Post (Updated)');

    // DELETE
    const deleteRes = await request.delete(`${API_URL}/api/posts/${created.id}`);
    expect(deleteRes.ok()).toBeTruthy();

    // confirm it's actually gone
    const confirmRes = await request.get(`${API_URL}/api/posts/${created.id}`);
    expect(confirmRes.status()).toBe(404);
});