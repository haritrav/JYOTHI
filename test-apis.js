async function testAPIs() {
  const endpoints = [
    '/api/schemes',
    '/api/local/electricity',
    '/api/local/ration',
    '/api/local/employment',
    '/api/health/camps',
    '/api/health/vaccination',
    '/api/safety/emergency',
    '/api/counselling/services',
    '/api/applications'
  ];

  console.log('Testing GET Endpoints:');
  for (const ep of endpoints) {
    try {
      const res = await fetch(`http://localhost:3000${ep}`);
      const data = await res.json();
      console.log(`[PASS] ${ep} -> status ${res.status}, data length: ${Array.isArray(data.data) ? data.data.length : 'ok'}`);
    } catch (e) {
      console.error(`[FAIL] ${ep} -> ${e.message}`);
    }
  }

  console.log('\nTesting POST AI Chat Intent & Verified Guidance:');
  try {
    const aiRes = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'எனக்கு அரசு உதவி வேண்டும்',
        language: 'ta'
      })
    });
    const aiData = await aiRes.json();
    console.log(`[PASS] /api/ai/chat -> Intent: ${aiData.intent}, Explanation: ${aiData.explanation.slice(0, 60)}...`);
  } catch (e) {
    console.error(`[FAIL] /api/ai/chat -> ${e.message}`);
  }

  console.log('\nTesting POST Preliminary Eligibility Check:');
  try {
    const eligRes = await fetch('http://localhost:3000/api/schemes/eligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schemeId: 'pm-matru-vandana',
        answers: { q1: true, q2: true, q3: true }
      })
    });
    const eligData = await eligRes.json();
    console.log(`[PASS] /api/schemes/eligibility -> isEligible: ${eligData.isEligible}, isPreliminary: ${eligData.isPreliminary}`);
  } catch (e) {
    console.error(`[FAIL] /api/schemes/eligibility -> ${e.message}`);
  }

  console.log('\nTesting POST Confidential Counselling Registration:');
  try {
    const cnsRes = await fetch('http://localhost:3000/api/counselling/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'மல்லிகா (Mallika)',
        preferredLanguage: 'ta',
        contactPreference: 'phone',
        preferredTimeSlot: 'Morning 10 AM - 1 PM'
      })
    });
    const cnsData = await cnsRes.json();
    console.log(`[PASS] /api/counselling/request -> requestId: ${cnsData.requestId}, success: ${cnsData.success}`);
  } catch (e) {
    console.error(`[FAIL] /api/counselling/request -> ${e.message}`);
  }

  console.log('\nTesting Main HTML Document:');
  try {
    const htmlRes = await fetch('http://localhost:3000/');
    const html = await htmlRes.text();
    console.log(`[PASS] Main Page / -> status ${htmlRes.status}, HTML size: ${html.length} bytes`);
  } catch (e) {
    console.error(`[FAIL] Main Page / -> ${e.message}`);
  }
}

testAPIs();
