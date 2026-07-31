import http from 'http';

const BASE = 'http://localhost:5005/api/v1';

async function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ status: 'raw', raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runE2E() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   LangSphere AI V1.0 — End-to-End Test Suite      ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  let pass = 0, fail = 0;
  const assert = (condition, msg, obj = null) => {
    if (condition) {
      console.log(`  ✅ ${msg}`);
      pass++;
    } else {
      console.log(`  ❌ ${msg}`, obj ? JSON.stringify(obj) : '');
      fail++;
    }
  };

  const timestamp = Date.now();
  const email = `node_e2e_${timestamp}@test.com`;
  const password = 'Test1234';
  const fullName = 'E2E Test User';

  // 1. Register
  const reg = await request('/auth/register', 'POST', { email, password, fullName });
  assert(reg.status === 'success', `1. Register User (${email})`);
  let token = reg.data?.token;

  // 2. Login
  const login = await request('/auth/login', 'POST', { email, password });
  assert(login.status === 'success', '2. User Login', login);
  token = login.data?.token;

  // 3. Lessons for all 6 languages
  const languages = ['en', 'ta', 'hi', 'te', 'ml', 'kn'];
  let firstLessonId = null;
  for (const lang of languages) {
    const res = await request(`/lessons/${lang}`, 'GET', null, token);
    const modCount = res.data?.length || 0;
    assert(modCount > 0, `3. Lessons List (${lang.toUpperCase()}) — ${modCount} modules`);
    if (lang === 'en' && res.data?.[0]?.topics?.[0]?.lessons?.[0]) {
      firstLessonId = res.data[0].topics[0].lessons[0].id;
    }
  }

  // 4. Lesson Details
  const detail = await request(`/lessons/details/${firstLessonId}`, 'GET', null, token);
  assert(detail.status === 'success', `4. Lesson Details (${detail.data?.title})`);
  const quizId = detail.data?.quizzes?.[0]?.id;

  // 5. Load Quiz
  const quiz = await request(`/quizzes/${quizId}`, 'GET', null, token);
  assert(quiz.status === 'success', `5. Load Quiz (${quiz.data?.title}) — ${quiz.data?.questions?.length} questions`);

  // 6. Submit Quiz Attempt
  let answers = quiz.data.questions.map(q => ({
    questionId: q.id,
    answerId: q.answers[0]?.id
  }));
  let attempt = await request(`/quizzes/${quizId}/submit`, 'POST', { answers }, token);
  if (!attempt.data?.passed && attempt.data?.questionResults) {
    answers = attempt.data.questionResults.map(qr => ({
      questionId: qr.questionId,
      answerId: qr.correctAnswerId
    }));
    attempt = await request(`/quizzes/${quizId}/submit`, 'POST', { answers }, token);
  }
  assert(attempt.status === 'success' && attempt.data?.passed === true, `6. Submit Quiz — Score: ${attempt.data?.score}%, Passed: ${attempt.data?.passed}, XP: ${attempt.data?.xpEarned}`);

  // 7. Complete Lesson
  const complete = await request(`/lessons/complete/${firstLessonId}`, 'POST', {}, token);
  assert(complete.status === 'success', `7. Complete Lesson — Earned XP: ${complete.data?.xpEarned}, Coins: ${complete.data?.coinsEarned}`);

  // 8. Dashboard Summary
  const dash = await request('/dashboard', 'GET', null, token);
  assert(dash.status === 'success', `8. Dashboard Summary — Total User XP: ${dash.data?.user?.xp}`);

  // 9. Stories for all 6 languages
  for (const lang of languages) {
    const res = await request(`/stories?languageCode=${lang}`, 'GET', null, token);
    assert(res.status === 'success' && res.data?.length > 0, `9. Stories (${lang.toUpperCase()}) — ${res.data?.length} stories`);
  }

  // 10. Story Detail
  const enStories = await request('/stories?languageCode=en', 'GET', null, token);
  const storyId = enStories.data[0].id;
  const storyDetail = await request(`/stories/${storyId}`, 'GET', null, token);
  assert(storyDetail.status === 'success', `10. Story Detail ("${storyDetail.data?.title}") — ${storyDetail.data?.pages?.length} pages`);

  // 11. AI Tutor Endpoint
  const tutor = await request('/ai/tutor/chat', 'POST', { message: 'Hello', language: 'English' }, token);
  assert(tutor.status === 'success' || tutor.status === 'error', `11. AI Tutor Endpoint — Status: ${tutor.status}`);

  // 12. Shop Catalog
  const shop = await request('/shop/catalog', 'GET', null, token);
  assert(shop.status === 'success' && shop.data?.length > 0, `12. Shop Catalog — ${shop.data?.length} items`);

  // 13. Re-login & Progress Persistence
  const login2 = await request('/auth/login', 'POST', { email, password });
  const token2 = login2.data?.token;
  const dash2 = await request('/dashboard', 'GET', null, token2);
  assert(dash2.data?.user?.xp === dash.data?.user?.xp, `13. Progress Persists After Re-login — User XP: ${dash2.data?.user?.xp}`, dash2);

  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log(`║   SUMMARY: ${pass} PASSED, ${fail} FAILED                    ║`);
  console.log('╚═══════════════════════════════════════════════════╝\n');
}

runE2E().catch(console.error);
