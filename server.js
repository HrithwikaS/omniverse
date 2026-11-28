const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { store, hashPassword } = require('./db.js');

const PORT = process.env.PORT || 3000;
const HARDCODED_ADMIN_USERNAME = 'admin';
const HARDCODED_ADMIN_EMAIL = 'admin@raksomniverse.edu';
const HARDCODED_ADMIN_PASSWORD = 'raksadmin123';

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

async function getAuthenticatedUser(req) {
  const authHeader = req.headers['authorization'] || '';
  let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token && req.headers.cookie) {
    const cookies = Object.fromEntries(
      req.headers.cookie.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    token = cookies['omniverse_token'];
  }

  if (token) {
    const user = await store.getUserByToken(token);
    if (user) return user;
  }

  // Fallback default demo session if header specifies X-Omniverse-User or default explorer so initial load is smooth
  const demoUserId = req.headers['x-omniverse-user'];
  if (!demoUserId) return null;
  return store.getFallbackUser(demoUserId);
}

// =============================================================================
// COSMO PROMPTING & SYSTEM INSTRUCTIONS SECTION
// =============================================================================
const COSMO_PROMPTING_CONFIG = {
  schoolName: 'Raks Pallikkoodam School, Coimbatore',
  systemPrompt: [
    'You are Cosmo, the friendly companion for Raks Pallikkoodam School in Coimbatore.',
    '1. Always reply in very brief answers with no bulleted or numbered points, and always less than 1 or 2 sentences.',
    '2. Only answer questions about Raks Pallikkoodam School Coimbatore and no other school or organization.',
    '3. Use a friendly human tone always.',
  ].join('\n'),
  rules: {
    maxSentences: 2,
    allowBulletsOrNumbers: false,
    onlyRaksPallikkoodamCoimbatore: true,
    tone: 'friendly-human',
  },
};

// Enforces Cosmo prompting rules: strips bullets/numbers/headings and caps at 1-2 friendly sentences
function enforceCosmoPromptRules(text) {
  const cleaned = String(text || '')
    .replace(/^#+\s+/gm, '')
    .replace(/^[•\-*\d+.)]+\s+/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  return sentences.slice(0, COSMO_PROMPTING_CONFIG.rules.maxSentences).join(' ').trim();
}

async function generateCosmoResponse(queryText, user) {
  const raw = (queryText || '').trim();
  const q = raw.toLowerCase().replace(/[!?.]+$/g, '').trim();

  // Wake greeting
  if (q === 'hey cosmo' || q === 'hi cosmo' || q === 'hello' || q === 'hi') {
    return {
      reply: 'Hey there, how can I help you explore Raks Pallikkoodam School today?',
      state: 'responding',
      wakeTriggered: true,
      suggestions: [
        'Tell me about Raks Pallikkoodam School',
        'Which galaxies focus on AI?',
        'What are the upcoming school events?',
        'Has my project been approved?',
      ],
    };
  }

  // Rule: Only answer questions about Raks Pallikkoodam School Coimbatore and no other school or organization
  const otherOrgKeywords = [
    'dps', 'delhi public', 'psbb', 'chinmaya', 'issha', 'isha', 'amrita', 'kv ', 'kendriya',
    'harvard', 'mit', 'stanford', 'iit', 'nit', 'vit', 'psg', 'google', 'microsoft', 'apple',
    'other school', 'another school', 'chennai school', 'bangalore school', 'college', 'university',
  ];
  if (otherOrgKeywords.some((kw) => q.includes(kw)) && !q.includes('raks')) {
    return {
      reply: enforceCosmoPromptRules(
        'I only answer questions about Raks Pallikkoodam School right here in Coimbatore! Feel free to ask me anything about our school clubs, student projects, or upcoming campus events.'
      ),
      state: 'responding',
      suggestions: [
        'Tell me about Raks Pallikkoodam School',
        'Which clubs are active right now?',
        'What are the upcoming school events?',
      ],
    };
  }

  // Privacy guard
  if (q.includes('password') || q.includes('credential') || q.includes('private email') || q.includes('secret')) {
    return {
      reply: enforceCosmoPromptRules(
        'I keep all personal passwords and private details safe for everyone at Raks Pallikkoodam School. I would love to tell you about our public projects, clubs, or events instead!'
      ),
      state: 'error',
      suggestions: ['Show me all active galaxies', 'What are the upcoming school events?'],
    };
  }

  const { galaxies, stars, constellations, comets, myMissions } = await store.getCosmoContext(user);

  // Live Gemini API integration when GEMINI_API_KEY is configured in .env or Render
  const geminiApiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (geminiApiKey) {
    try {
      const galaxySummary = galaxies
        .map((g) => `${g.name} (${g.category}, head: ${g.teacher_name || 'Unassigned'}, ${g.star_count || 0} stars)`)
        .join('; ');
      const starSummary = stars
        .slice(0, 12)
        .map((s) => `"${s.title}" by ${s.student_name} in ${s.galaxy_name} (${s.stellar_energy} sparks)`)
        .join('; ');
      const cometSummary = comets
        .slice(0, 8)
        .map((c) => `${c.title} on ${c.event_date} (${c.event_type})`)
        .join('; ');
      const missionSummary = myMissions.length
        ? myMissions.slice(0, 5).map((m) => `"${m.title}" in ${m.galaxy_name} (${m.status})`).join('; ')
        : 'None';

      const contextBlock = [
        COSMO_PROMPTING_CONFIG.systemPrompt,
        `Current user: ${user ? `${user.name} (${user.role})` : 'Guest'}.`,
        `Active Galaxies: ${galaxySummary || 'None'}.`,
        `Approved Stars: ${starSummary || 'None'}.`,
        `Upcoming School Comets: ${cometSummary || 'None'}.`,
        `User Missions: ${missionSummary}.`,
      ].join('\n');

      const geminiModel = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
      const apiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiApiKey,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: contextBlock }] },
            contents: [{ role: 'user', parts: [{ text: raw }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 140,
            },
          }),
        }
      );

      if (apiRes.ok) {
        const data = await apiRes.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join(' ').trim();
        if (aiText) {
          return {
            reply: enforceCosmoPromptRules(aiText),
            state: 'responding',
            poweredBy: 'gemini',
            suggestions: [
              'Tell me about Raks Pallikkoodam School',
              'What are the upcoming school events?',
              'Show me the active galaxies',
            ],
          };
        }
      } else {
        console.warn(`Cosmo Gemini API error (${apiRes.status}): falling back to built-in responses.`);
      }
    } catch (err) {
      console.warn(`Cosmo Gemini API request failed (${err.message}): falling back to built-in responses.`);
    }
  }

  // About Raks Pallikkoodam School Coimbatore
  if (
    q.includes('raks') ||
    q.includes('pallikkoodam') ||
    q.includes('coimbatore') ||
    (q.includes('school') && (q.includes('about') || q.includes('what is') || q.includes('tell me')))
  ) {
    return {
      reply: enforceCosmoPromptRules(
        `Raks Pallikkoodam School in Coimbatore is our vibrant learning community where students turn creative ideas into real projects across ${galaxies.length} club galaxies. Right now our explorers have launched ${stars.length} approved stars and ${constellations.length} constellations!`
      ),
      state: 'responding',
      suggestions: ['Which galaxies focus on AI?', 'What are the upcoming school events?', 'Show me popular robotics projects'],
    };
  }

  // 1. User's own mission status
  if (q.includes('my project') || q.includes('my mission') || q.includes('been approved') || q.includes('mission status')) {
    if (!user) {
      return {
        reply: enforceCosmoPromptRules(
          'Please sign in with your Raks Pallikkoodam School email first so I can check on your mission for you!'
        ),
        state: 'responding',
      };
    }

    if (myMissions.length === 0) {
      return {
        reply: enforceCosmoPromptRules(
          `Hey ${user.name}, you haven't submitted any missions yet at Raks Pallikkoodam School. Head over to Mission Control whenever you're ready to launch your first idea!`
        ),
        state: 'responding',
        suggestions: ['How do I submit a mission?', 'Which galaxies can I join?'],
      };
    }

    const latest = myMissions[0];
    return {
      reply: enforceCosmoPromptRules(
        `Hey ${user.name}, your latest project "${latest.title}" in the ${latest.galaxy_name} is currently marked as ${latest.status}. ${
          latest.feedback
            ? 'Your mentor left a note saying: ' + latest.feedback
            : 'You have ' + myMissions.length + ' total mission submissions on record!'
        }`
      ),
      state: 'responding',
      suggestions: ['What are the upcoming school events?', 'Tell me about the Neural Networks constellation'],
    };
  }

  // 2. Constellations
  if (q.includes('constellation') || q.includes('neural network')) {
    const matchedCon = constellations.find((c) => q.includes(c.name.toLowerCase())) || constellations[0];
    return {
      reply: enforceCosmoPromptRules(
        `The ${matchedCon.name} constellation at Raks Pallikkoodam School was put together by ${matchedCon.teacher_name} in the ${matchedCon.galaxy_name}. It connects student projects exploring ${matchedCon.description.toLowerCase()}`
      ),
      state: 'responding',
      suggestions: ['Which galaxies focus on AI?', 'Show me popular robotics projects'],
    };
  }

  // 3. Upcoming events / Comets
  if (
    q.includes('event') ||
    q.includes('comet') ||
    q.includes('upcoming') ||
    q.includes('hackathon') ||
    q.includes('deadline') ||
    q.includes('calendar')
  ) {
    const nextEvent = comets[0];
    const secondEvent = comets[1];
    return {
      reply: enforceCosmoPromptRules(
        `Coming up soon at Raks Pallikkoodam School in Coimbatore, we have ${
          nextEvent ? nextEvent.title + ' on ' + nextEvent.event_date : 'exciting campus events'
        }${secondEvent ? ' and ' + secondEvent.title + ' on ' + secondEvent.event_date : ''}. You can check the Comets page to see all ${comets.length} scheduled school events!`
      ),
      state: 'responding',
      suggestions: ['How do I submit a mission?', 'Show me popular projects'],
    };
  }

  // 4. How to submit a mission
  if (q.includes('how do i submit') || q.includes('submit a mission') || q.includes('launch a mission') || q.includes('procedure')) {
    return {
      reply: enforceCosmoPromptRules(
        'Just open Mission Control, pick your Raks Pallikkoodam club galaxy, upload your project details and supporting files, and hit launch! Once your teacher mentor approves it, your project will shine as a star on the Cosmic Map.'
      ),
      state: 'responding',
      suggestions: ['Has my project been approved?', 'Which galaxies focus on AI?'],
    };
  }

  // 5. Domain / Club Galaxy queries
  const domainKeywords = [
    { keys: ['csci', 'computer science', 'artificial intelligence', 'ai', 'machine learning', 'vision', 'deep learning', 'coding'], galaxyId: 'gal-ai' },
    { keys: ['phy', 'physics', 'robot', 'robotics', 'rover', 'drone', 'mechanics', 'optics'], galaxyId: 'gal-robotics' },
    { keys: ['bio', 'biology', 'environment', 'water', 'ecology', 'genetics', 'eco'], galaxyId: 'gal-environment' },
    { keys: ['chem', 'chemistry', 'molecule', 'reaction', 'spectroscopy', 'astronomy', 'pulsar'], galaxyId: 'gal-astronomy' },
    { keys: ['eng', 'english', 'literature', 'writing', 'story', 'poet', 'book'], galaxyId: 'gal-literature' },
    { keys: ['math', 'mathematics', 'calculus', 'crypto', 'statistics', 'algebra'], galaxyId: 'gal-entrepreneurship' },
  ];

  for (const dom of domainKeywords) {
    if (dom.keys.some((k) => q.includes(k))) {
      const gal = galaxies.find((g) => g.id === dom.galaxyId);
      const domStars = stars.filter((s) => s.galaxy_id === dom.galaxyId);
      const topStar = domStars[0];
      return {
        reply: enforceCosmoPromptRules(
          `At Raks Pallikkoodam School, our ${gal.name} is mentored by ${gal.teacher_name} and currently features ${domStars.length} approved student stars. ${
            topStar
              ? 'One of the brightest projects there right now is ' + topStar.title + ' by ' + topStar.student_name + '!'
              : 'Students meet weekly to collaborate on hands-on projects!'
          }`
        ),
        state: 'responding',
        suggestions: ['What are the upcoming school events?', 'Has my project been approved?'],
      };
    }
  }

  // 6. Popular / Supernova projects
  if (q.includes('popular') || q.includes('supernova') || q.includes('spark') || q.includes('top') || q.includes('brightest')) {
    const s1 = stars[0];
    const s2 = stars[1];
    return {
      reply: enforceCosmoPromptRules(
        `Our brightest stars at Raks Pallikkoodam School right now are ${s1.title} by ${s1.student_name} with ${s1.stellar_energy} sparks and ${s2.title} by ${s2.student_name} with ${s2.stellar_energy} sparks. Both have reached Supernova status thanks to appreciation from fellow students and mentors!`
      ),
      state: 'responding',
      suggestions: ['Which galaxies focus on CSci?', 'What are the upcoming school events?'],
    };
  }

  // 7. General club / galaxy question
  if (q.includes('galaxy') || q.includes('galaxies') || q.includes('club') || q.includes('omniverse')) {
    return {
      reply: enforceCosmoPromptRules(
        `Raks Pallikkoodam School in Coimbatore has ${galaxies.length} active galaxies covering Chemistry, Biology, Physics, Computer Science, Mathematics, and English. Click any galaxy on the Cosmic Map to zoom in and explore its student stars!`
      ),
      state: 'responding',
      suggestions: ['Which galaxies focus on AI?', 'Show me popular robotics projects'],
    };
  }

  // Default friendly human fallback strictly scoped to Raks Pallikkoodam School Coimbatore
  return {
    reply: enforceCosmoPromptRules(
      'I am Cosmo, your friendly guide to Raks Pallikkoodam School in Coimbatore, and I only answer questions about our school and its Omniverse projects! Ask me about any of our six club galaxies, student stars, or upcoming campus events.'
    ),
    state: 'responding',
    suggestions: [
      'Tell me about Raks Pallikkoodam School',
      'Which galaxies focus on AI?',
      'What are the upcoming school events?',
      'Has my project been approved?',
    ],
  };
}

const server = http.createServer(async (req, res) => {
  try {
    await store.init();

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Omniverse-User');
    if (method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const currentUser = await getAuthenticatedUser(req);

    // =========================================================================
    // AUTHENTICATION & SESSION ENDPOINTS
    // =========================================================================
    if (pathname === '/api/auth/me' && method === 'GET') {
      const demoUsers = await store.listDemoUsers();
      const unreadCount = currentUser ? await store.getUnreadNotificationCount(currentUser.id) : 0;
      return sendJson(res, 200, { user: currentUser, demoUsers, unreadCount, storage: store.getStorageMode() });
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      let user = null;
      const identifier = (body.email || body.username || '').trim().toLowerCase();

      if (body.userId) {
        user = await store.getFullUserById(body.userId);
      } else if (identifier === HARDCODED_ADMIN_USERNAME || identifier === HARDCODED_ADMIN_EMAIL) {
        user = await store.getFullUserById('usr-admin-1');
        const hashed = hashPassword(body.password || '');
        const matchesAdminPass = body.password === HARDCODED_ADMIN_PASSWORD || (user && user.password_hash === hashed);
        if (!matchesAdminPass) {
          return sendJson(res, 401, { error: 'Invalid admin credentials.' });
        }
      } else if (identifier) {
        user = await store.getFullUserByEmail(identifier);
        if (!user) {
          return sendJson(res, 404, { error: 'Account not found in the Omniverse registry.' });
        }
        const hashed = hashPassword(body.password || '');
        if (user.password_hash !== hashed) {
          return sendJson(res, 401, { error: 'Invalid email or password.' });
        }
        if (body.role && ['student', 'teacher'].includes(body.role) && user.role !== body.role) {
          return sendJson(res, 403, { error: `This account is registered as a ${user.role}. Please select ${user.role} in the dropdown.` });
        }
      }

      if (!user) {
        return sendJson(res, 404, { error: 'Account not found in the Omniverse registry.' });
      }
      if (user.account_status !== 'active') {
        return sendJson(res, 403, { error: `This account is currently ${user.account_status}. Contact the Universe Administrator.` });
      }

      const hasPriorSession = await store.hasAnySession(user.id);
      const isFirstLogin = !user.tutorial_seen && !hasPriorSession;
      if (!user.tutorial_seen) {
        await store.markTutorialSeen(user.id);
      }

      const token = crypto.randomBytes(24).toString('hex');
      await store.createSession(token, user.id);

      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teacher_code: user.teacher_code,
        department: user.department,
        grade: user.grade,
        section: user.section,
        bio: user.bio,
        avatar_color: user.avatar_color,
        account_status: user.account_status,
        full_access: user.full_access ? 1 : 0,
        tutorial_seen: 1,
      };

      res.setHeader('Set-Cookie', `omniverse_token=${token}; Path=/; HttpOnly; SameSite=Lax`);
      return sendJson(res, 200, { token, user: safeUser, isFirstLogin });
    }

    if (pathname === '/api/auth/change-password' && method === 'POST') {
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' });
      const body = await parseBody(req);
      const currentPassword = String(body.currentPassword || '');
      const newPassword = String(body.newPassword || '');
      if (newPassword.length < 4) {
        return sendJson(res, 400, { error: 'New password must be at least 4 characters long.' });
      }
      const fullUser = await store.getFullUserById(currentUser.id);
      if (!fullUser) return sendJson(res, 404, { error: 'User not found.' });
      const curHashed = hashPassword(currentPassword);
      const isAdminDefault = currentUser.role === 'admin' && currentPassword === HARDCODED_ADMIN_PASSWORD;
      if (fullUser.password_hash !== curHashed && !isAdminDefault) {
        return sendJson(res, 401, { error: 'Current password is incorrect.' });
      }
      await store.changePassword(currentUser.id, newPassword);
      await store.logActivity(currentUser, 'PASSWORD_CHANGED', `${currentUser.name} updated their account password`, 'user', currentUser.id);
      return sendJson(res, 200, { success: true, message: 'Password updated successfully.' });
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      res.setHeader('Set-Cookie', 'omniverse_token=; Path=/; Max-Age=0');
      return sendJson(res, 200, { success: true });
    }

    // =========================================================================
    // FILE UPLOAD ENDPOINT FOR MISSION CONTROL SUPPORTING FILES
    // =========================================================================
    if (pathname === '/api/upload' && method === 'POST') {
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' });
      const body = await parseBody(req);
      const files = Array.isArray(body.files) ? body.files : body.file ? [body.file] : [];
      if (files.length === 0) {
        return sendJson(res, 400, { error: 'No files provided for upload.' });
      }

      const uploadsDir = path.join(__dirname, 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const uploaded = [];
      for (const f of files) {
        const safeName = String(f.name || 'attachment.bin').replace(/[^a-zA-Z0-9._-]/g, '_');
        const uniqueName = Date.now() + '-' + crypto.randomBytes(3).toString('hex') + '-' + safeName;
        const destPath = path.join(uploadsDir, uniqueName);

        let base64Data = String(f.data || '');
        const commaIdx = base64Data.indexOf(',');
        if (commaIdx !== -1) {
          base64Data = base64Data.slice(commaIdx + 1);
        }
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(destPath, buffer);

        uploaded.push({
          name: f.name || safeName,
          url: '/uploads/' + uniqueName,
          size:
            f.size ||
            (buffer.length > 1024 * 1024
              ? (buffer.length / (1024 * 1024)).toFixed(1) + ' MB'
              : Math.max(1, Math.round(buffer.length / 1024)) + ' KB'),
          type: f.type || 'application/octet-stream',
        });
      }

      return sendJson(res, 201, { files: uploaded });
    }

    // =========================================================================
    // UNIVERSE & COSMIC MAP DATA
    // =========================================================================
    if (pathname === '/api/universe' && method === 'GET') {
      return sendJson(res, 200, await store.getUniverseData(currentUser));
    }

    // =========================================================================
    // GLOBAL SEARCH ENDPOINT
    // =========================================================================
    if (pathname === '/api/search' && method === 'GET') {
      const q = (parsedUrl.searchParams.get('q') || '').trim().toLowerCase();
      const categoryFilter = parsedUrl.searchParams.get('type') || 'all';
      return sendJson(res, 200, await store.searchUniverse(q, categoryFilter));
    }

    // =========================================================================
    // GALAXY CREATION, EDITING & STUDENT MEMBERSHIP
    // =========================================================================
    if (pathname === '/api/galaxies' && method === 'POST') {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, { error: 'Only Galaxy Mentors (Teachers) and Universe Administrators can charter new Galaxies.' });
      }
      const body = await parseBody(req);
      if (!body.name || !body.description || !body.category) {
        return sendJson(res, 400, { error: 'Galaxy name, description, and category are required.' });
      }

      const created = await store.createGalaxy(body, currentUser);
      await store.logActivity(currentUser, 'GALAXY_CREATED', `Chartered new galaxy "${created.name}" (${created.code})`, 'galaxy', created.id);
      return sendJson(res, 201, { galaxy: created });
    }

    if (pathname === '/api/galaxies/requests' && method === 'GET') {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, { error: 'Only Galaxy Heads and Administrators can view membership requests.' });
      }
      const requests = await store.getPendingMembershipRequests(currentUser);
      return sendJson(res, 200, { requests });
    }

    if (pathname.startsWith('/api/galaxies/') && pathname.includes('/requests/') && method === 'POST') {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, { error: 'Only Galaxy Heads and Administrators can process membership requests.' });
      }
      const parts = pathname.split('/');
      const galaxyId = parts[3];
      const studentId = parts[5];
      const galaxy = await store.getGalaxyById(galaxyId);
      if (!galaxy) return sendJson(res, 404, { error: 'Galaxy not found.' });
      if (currentUser.role !== 'admin' && galaxy.teacher_id !== currentUser.id) {
        return sendJson(res, 403, { error: 'Only the assigned Galaxy Head or Administrator can process requests for this galaxy.' });
      }
      const body = await parseBody(req);
      const action = body.action === 'reject' ? 'reject' : 'approve';
      const result = await store.processMembershipRequest(galaxyId, studentId, action);
      await store.createNotification({
        recipientId: studentId,
        type: 'galaxy',
        title: action === 'approve' ? 'Membership Approved' : 'Membership Request Declined',
        message: action === 'approve'
          ? `Your membership request for ${galaxy.name} was approved by ${currentUser.name}. You can now contribute missions!`
          : `Your membership request for ${galaxy.name} was declined by ${currentUser.name}.`,
        entityType: 'galaxy',
        entityId: galaxyId,
        link: `/cosmic-map?galaxy=${galaxyId}`,
      });
      await store.logActivity(currentUser, 'MEMBERSHIP_PROCESSED', `${action === 'approve' ? 'Approved' : 'Rejected'} membership for ${studentId} in ${galaxy.name}`, 'galaxy', galaxyId);
      return sendJson(res, 200, result);
    }

    if (pathname.startsWith('/api/galaxies/') && pathname.endsWith('/join') && method === 'POST') {
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' });
      const galaxyId = pathname.split('/')[3];
      const galaxy = await store.getGalaxyById(galaxyId);
      if (!galaxy || galaxy.status !== 'active') return sendJson(res, 404, { error: 'Galaxy not found.' });

      if (currentUser.role === 'student') {
        const result = await store.requestGalaxyMembership(currentUser.id, galaxyId);
        if (result.alreadyMember) {
          return sendJson(res, 200, { status: 'active', joined: true, message: `You are already a member of ${galaxy.name}.` });
        }
        if (result.alreadyPending) {
          return sendJson(res, 200, { status: 'pending', pending: true, message: `Your membership request for ${galaxy.name} is already pending.` });
        }
        if (galaxy.teacher_id) {
          await store.createNotification({
            recipientId: galaxy.teacher_id,
            type: 'galaxy',
            title: 'New Galaxy Membership Request',
            message: `${currentUser.name} requested membership in ${galaxy.name}.`,
            entityType: 'galaxy',
            entityId: galaxyId,
            link: '/teacher',
          });
        }
        await store.logActivity(currentUser, 'MEMBERSHIP_REQUESTED', `Requested membership in ${galaxy.name}`, 'galaxy', galaxyId);
        return sendJson(res, 200, { status: 'pending', pending: true, message: `Membership requested for ${galaxy.name}. Awaiting Galaxy Head approval.` });
      }

      const targetStudentId = req.headers['x-target-student'] || currentUser.id;
      const { joined } = await store.toggleGalaxyMembership(targetStudentId, galaxyId);
      return sendJson(res, 200, { joined, status: joined ? 'active' : 'removed', message: joined ? `Joined ${galaxy.name}` : `Left ${galaxy.name}` });
    }

    if (pathname.startsWith('/api/galaxies/') && method === 'PUT') {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, { error: 'Unauthorized.' });
      }
      const galaxyId = pathname.split('/')[3];
      const galaxy = await store.getGalaxyById(galaxyId);
      if (!galaxy) return sendJson(res, 404, { error: 'Galaxy not found.' });
      const hasFullAccess = currentUser.role === 'admin' || !!currentUser.full_access;
      if (!hasFullAccess && galaxy.teacher_id !== currentUser.id) {
        return sendJson(res, 403, { error: 'Only Admins, Full Access teachers, or the assigned Galaxy Head can modify this galaxy.' });
      }

      const body = await parseBody(req);
      const updated = await store.updateGalaxy(galaxyId, body, currentUser.role === 'admin');
      await store.logActivity(currentUser, 'GALAXY_UPDATED', `Updated galaxy "${galaxy.name}"`, 'galaxy', galaxyId);
      return sendJson(res, 200, { galaxy: updated });
    }

    if (pathname.startsWith('/api/galaxies/') && method === 'DELETE') {
      if (!currentUser || (currentUser.role !== 'admin' && !currentUser.full_access)) {
        return sendJson(res, 403, { error: 'Only Administrators and Full Access teachers can delete galaxies.' });
      }
      const galaxyId = pathname.split('/')[3];
      const galaxy = await store.getGalaxyById(galaxyId);
      if (!galaxy) return sendJson(res, 404, { error: 'Galaxy not found.' });
      await store.deleteGalaxy(galaxyId);
      await store.logActivity(currentUser, 'GALAXY_DELETED', `Deleted galaxy "${galaxy.name}"`, 'galaxy', galaxyId);
      return sendJson(res, 200, { deleted: true });
    }

    // =========================================================================
    // MISSIONS & TEACHER MISSION CONTROL (APPROVAL -> STAR ACTIVATION)
    // =========================================================================
    if (pathname === '/api/missions' && method === 'GET') {
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' });
      const missions = await store.getMissionsForUser(currentUser);
      return sendJson(res, 200, { missions });
    }

    if (pathname === '/api/missions' && method === 'POST') {
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' });
      const body = await parseBody(req);
      if (!body.title || !body.galaxy_id || !body.description) {
        return sendJson(res, 400, { error: 'Mission title, destination galaxy, and description are required.' });
      }

      const galaxy = await store.getGalaxyById(body.galaxy_id);
      if (!galaxy) return sendJson(res, 404, { error: 'Selected destination galaxy does not exist.' });

      if (currentUser.role === 'student') {
        const isMember = await store.isStudentMemberOfGalaxy(currentUser.id, body.galaxy_id);
        if (!isMember) {
          return sendJson(res, 403, {
            error: `Only approved members of ${galaxy.name} can contribute missions. Request membership first!`,
          });
        }
      }

      const created = await store.createMission(body, currentUser, galaxy);

      if (created.status === 'Submitted' && galaxy.teacher_id) {
        await store.createNotification({
          recipientId: galaxy.teacher_id,
          type: 'submission',
          title: 'New Mission Launched',
          message: `${currentUser.name} launched "${created.title}" into ${galaxy.name} for review.`,
          entityType: 'mission',
          entityId: created.id,
          link: '/teacher',
        });
      }

      await store.logActivity(currentUser, 'MISSION_LAUNCHED', `Launched mission "${created.title}" to ${galaxy.name}`, 'mission', created.id);
      return sendJson(res, 201, { mission: created });
    }

    if (pathname.startsWith('/api/missions/') && pathname.endsWith('/review') && method === 'POST') {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, { error: 'Students cannot approve or review missions. Only Teachers and Administrators have Mission Control authority.' });
      }

      const missionId = pathname.split('/')[3];
      const mission = await store.getMissionById(missionId);
      if (!mission) return sendJson(res, 404, { error: 'Mission not found.' });

      if (mission.student_id === currentUser.id) {
        return sendJson(res, 403, { error: 'Users cannot approve their own missions.' });
      }

      const galaxy = await store.getGalaxyById(mission.galaxy_id);
      const body = await parseBody(req);
      const action = body.action;
      const feedback = (body.feedback || '').trim();

      if (!['Approve', 'Reject', 'Request Changes'].includes(action)) {
        return sendJson(res, 400, { error: 'Invalid review action.' });
      }

      const { mission: updatedMission, star: activatedStar } = await store.reviewMission(mission, action, feedback, currentUser, galaxy);

      if (action === 'Approve') {
        await store.createNotification({
          recipientId: mission.student_id,
          type: 'approved',
          title: 'Mission Approved — Star Activated!',
          message: `Your mission "${mission.title}" was approved by ${currentUser.name} and now shines as a Star in ${galaxy ? galaxy.name : 'the Omniverse'}!`,
          entityType: 'star',
          entityId: activatedStar.id,
          link: `/cosmic-map?galaxy=${mission.galaxy_id}&star=${activatedStar.id}`,
        });

        await store.logActivity(
          currentUser,
          'STAR_ACTIVATED',
          `Approved mission "${mission.title}" into an active Star in ${galaxy ? galaxy.name : ''}`,
          'star',
          activatedStar.id
        );
      } else {
        await store.createNotification({
          recipientId: mission.student_id,
          type: 'revision',
          title: action === 'Reject' ? 'Mission Not Approved' : 'Mission Revisions Requested',
          message: `${currentUser.name} reviewed "${mission.title}": "${feedback || 'Please review mentor notes.'}"`,
          entityType: 'mission',
          entityId: mission.id,
          link: '/missions',
        });

        await store.logActivity(
          currentUser,
          'MISSION_REVIEWED',
          `Marked mission "${mission.title}" as ${updatedMission.status}`,
          'mission',
          mission.id
        );
      }

      return sendJson(res, 200, { mission: updatedMission, star: activatedStar });
    }

    // =========================================================================
    // STAR MANAGEMENT (GALAXY HEAD, FULL ACCESS TEACHER, ADMIN)
    // =========================================================================
    if (pathname.startsWith('/api/stars/') && !pathname.endsWith('/spark') && (method === 'PUT' || method === 'DELETE')) {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, { error: 'Only Administrators, Full Access teachers, or the Galaxy Head can modify or remove stars.' });
      }
      const starId = pathname.split('/')[3];
      const star = await store.getStarById(starId);
      if (!star) return sendJson(res, 404, { error: 'Star not found.' });
      const galaxy = await store.getGalaxyById(star.galaxy_id);
      const isHead = galaxy && galaxy.teacher_id === currentUser.id;
      const canManage = currentUser.role === 'admin' || !!currentUser.full_access || isHead;
      if (!canManage) {
        return sendJson(res, 403, { error: 'Only the Galaxy Head, a Full Access teacher, or an Admin can modify or delete this star.' });
      }
      if (method === 'DELETE') {
        await store.deleteStar(starId);
        await store.logActivity(currentUser, 'STAR_DELETED', `Removed star "${star.title}" from ${galaxy ? galaxy.name : 'Omniverse'}`, 'star', starId);
        return sendJson(res, 200, { deleted: true });
      }
      const body = await parseBody(req);
      const updated = await store.updateStar(starId, body);
      await store.logActivity(currentUser, 'STAR_UPDATED', `Updated star "${updated ? updated.title : star.title}"`, 'star', starId);
      return sendJson(res, 200, { star: updated });
    }

    // =========================================================================
    // SPARKS & STELLAR ENERGY / SUPERNOVA PROGRESSION
    // =========================================================================
    if (pathname.startsWith('/api/stars/') && pathname.endsWith('/spark') && method === 'POST') {
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required to give a Spark.' });
      const starId = pathname.split('/')[3];
      const star = await store.getStarById(starId);
      if (!star) return sendJson(res, 404, { error: 'Star not found.' });

      if (star.student_id === currentUser.id) {
        return sendJson(res, 400, {
          error: 'Explorers cannot spark their own Stars. Sparks must come from peers or mentors!',
        });
      }

      const result = await store.toggleSpark(star, currentUser);

      if (result.sparked) {
        await store.createNotification({
          recipientId: star.student_id,
          type: result.becameSupernova ? 'supernova' : 'spark',
          title: result.becameSupernova ? 'SUPERNOVA ACHIEVED!' : 'New Spark Received!',
          message: result.becameSupernova
            ? `${currentUser.name}'s Spark pushed "${star.title}" to ${result.stellar_energy} Stellar Energy — transforming it into a SUPERNOVA!`
            : `${currentUser.name} sent a Spark to your Star "${star.title}" (${result.stellar_energy} Stellar Energy).`,
          entityType: 'star',
          entityId: star.id,
          link: `/cosmic-map?galaxy=${star.galaxy_id}&star=${star.id}`,
        });

        if (result.becameSupernova) {
          await store.logActivity(
            currentUser,
            'SUPERNOVA_IGNITED',
            `Star "${star.title}" reached ${result.stellar_energy} Sparks and transformed into a Supernova!`,
            'star',
            star.id
          );
        }
      }

      return sendJson(res, 200, result);
    }

    // =========================================================================
    // CONSTELLATIONS (TEACHER & ADMIN ONLY)
    // =========================================================================
    if (pathname === '/api/constellations' && method === 'POST') {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, {
          error: 'Only Galaxy Mentors (Teachers) and Administrators can create official Constellations.',
        });
      }

      const body = await parseBody(req);
      if (!body.name || !body.galaxy_id || !Array.isArray(body.stars) || body.stars.length < 2) {
        return sendJson(res, 400, {
          error: 'Please provide a constellation name, galaxy, and at least 2 approved stars to connect.',
        });
      }

      const { id, notified } = await store.createConstellation(body, currentUser);
      for (const item of notified) {
        await store.createNotification({
          recipientId: item.student_id,
          type: 'constellation',
          title: 'Star Connected in Constellation!',
          message: `${currentUser.name} connected your Star "${item.title}" into the "${body.name.trim()}" constellation!`,
          entityType: 'constellation',
          entityId: id,
          link: `/cosmic-map?galaxy=${body.galaxy_id}&constellation=${id}`,
        });
      }

      await store.logActivity(
        currentUser,
        'CONSTELLATION_CREATED',
        `Created constellation "${body.name.trim()}" connecting ${body.stars.length} stars`,
        'constellation',
        id
      );

      return sendJson(res, 201, { id, message: 'Constellation published to Cosmic Map.' });
    }

    if (pathname.startsWith('/api/constellations/') && method === 'DELETE') {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, { error: 'Unauthorized.' });
      }
      const conId = pathname.split('/')[3];
      await store.deleteConstellation(conId);
      return sendJson(res, 200, { deleted: true });
    }

    // =========================================================================
    // COMETS (EVENTS & ANNOUNCEMENTS)
    // =========================================================================
    if (pathname === '/api/comets' && method === 'POST') {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, { error: 'Only Teachers and Administrators can launch Comets.' });
      }
      const body = await parseBody(req);
      if (!body.title || !body.description || !body.event_date || !body.location) {
        return sendJson(res, 400, { error: 'Comet title, description, event date, and location are required.' });
      }

      const comet = await store.createComet(body, currentUser);
      await store.logActivity(currentUser, 'COMET_LAUNCHED', `Published comet "${comet.title}" (${comet.event_type})`, 'comet', comet.id);
      return sendJson(res, 201, { comet });
    }

    if (pathname.startsWith('/api/comets/') && method === 'DELETE') {
      if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
        return sendJson(res, 403, { error: 'Unauthorized.' });
      }
      const cometId = pathname.split('/')[3];
      await store.deleteComet(cometId);
      await store.logActivity(currentUser, 'COMET_DELETED', `Removed comet ${cometId}`, 'comet', cometId);
      return sendJson(res, 200, { deleted: true });
    }

    // =========================================================================
    // NOTIFICATIONS ENDPOINTS
    // =========================================================================
    if (pathname === '/api/notifications' && method === 'GET') {
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' });
      const notifications = await store.getNotifications(currentUser.id);
      return sendJson(res, 200, { notifications });
    }

    if (pathname === '/api/notifications/read' && method === 'POST') {
      if (!currentUser) return sendJson(res, 401, { error: 'Authentication required.' });
      const body = await parseBody(req);
      await store.markNotificationsRead(currentUser.id, body.id);
      return sendJson(res, 200, { success: true });
    }

    // =========================================================================
    // COSMO AI ASSISTANT ENDPOINT
    // =========================================================================
    if (pathname === '/api/cosmo/chat' && method === 'POST') {
      const body = await parseBody(req);
      const result = await generateCosmoResponse(body.message || '', currentUser);
      return sendJson(res, 200, result);
    }

    // =========================================================================
    // ADMIN & TEACHER USER MANAGEMENT + MODERATION ENDPOINTS
    // =========================================================================
    if (pathname === '/api/admin/overview' && method === 'GET') {
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'teacher')) {
        return sendJson(res, 403, { error: 'Restricted to Universe Administrators and Galaxy Mentors.' });
      }
      return sendJson(res, 200, await store.getAdminOverview());
    }

    if (pathname === '/api/users/teachers' && method === 'POST') {
      if (!currentUser || currentUser.role !== 'admin') {
        return sendJson(res, 403, {
          error: 'Access Denied: Only Universe Administrators can create Teacher accounts.',
        });
      }
      const body = await parseBody(req);
      if (!body.name || !body.email) {
        return sendJson(res, 400, { error: 'Teacher name and email address are required.' });
      }

      const existing = await store.getFullUserByEmail(body.email);
      if (existing) {
        return sendJson(res, 400, { error: 'A user with that email address already exists.' });
      }

      const { teacher, tempPassword } = await store.createTeacher(body);
      await store.logActivity(
        currentUser,
        'TEACHER_CREATED',
        `Created teacher account for ${teacher.name} (${teacher.teacher_code})`,
        'user',
        teacher.id
      );

      return sendJson(res, 201, { teacher, tempPassword });
    }

    if (pathname === '/api/users/students' && method === 'POST') {
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'teacher')) {
        return sendJson(res, 403, {
          error: 'Only Administrators and Teachers can create Student Explorer accounts.',
        });
      }
      const body = await parseBody(req);
      if (!body.name || !body.email) {
        return sendJson(res, 400, { error: 'Student name and email address are required.' });
      }

      const existing = await store.getFullUserByEmail(body.email);
      if (existing) {
        return sendJson(res, 400, { error: 'A user with that email address already exists.' });
      }

      const { student, tempPassword } = await store.createStudent(body, currentUser);
      await store.logActivity(
        currentUser,
        'STUDENT_CREATED',
        `Created student account for ${student.name} (${student.grade})`,
        'user',
        student.id
      );

      return sendJson(res, 201, { student, tempPassword });
    }

    if (pathname.startsWith('/api/users/') && pathname.endsWith('/remove-galaxy') && method === 'POST') {
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'teacher')) {
        return sendJson(res, 403, { error: 'Only Administrators and Teachers can remove students from a galaxy.' });
      }
      const targetId = pathname.split('/')[3];
      const targetUser = await store.getFullUserById(targetId);
      if (!targetUser) return sendJson(res, 404, { error: 'User not found.' });
      const body = await parseBody(req);
      if (!body.galaxy_id) return sendJson(res, 400, { error: 'galaxy_id is required.' });
      const galaxy = await store.getGalaxyById(body.galaxy_id);
      if (!galaxy) return sendJson(res, 404, { error: 'Galaxy not found.' });

      if (currentUser.role !== 'admin' && targetUser.created_by !== currentUser.id && galaxy.teacher_id !== currentUser.id) {
        return sendJson(res, 403, { error: 'Teachers can only remove students they created or from galaxies they head.' });
      }

      await store.removeStudentFromGalaxy(targetId, body.galaxy_id);
      await store.createNotification({
        recipientId: targetId,
        type: 'galaxy',
        title: 'Removed from Galaxy',
        message: `You have been removed from ${galaxy.name} by ${currentUser.name}.`,
        entityType: 'galaxy',
        entityId: body.galaxy_id,
        link: '/cosmic-map',
      });
      await store.logActivity(currentUser, 'GALAXY_MEMBER_REMOVED', `Removed ${targetUser.name} from ${galaxy.name}`, 'galaxy', body.galaxy_id);
      return sendJson(res, 200, { removed: true });
    }

    if (pathname.startsWith('/api/users/') && method === 'PUT') {
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'teacher')) {
        return sendJson(res, 403, { error: 'Only Administrators and Teachers can modify accounts.' });
      }
      const targetId = pathname.split('/')[3];
      const targetUser = await store.getFullUserById(targetId);
      if (!targetUser) return sendJson(res, 404, { error: 'User not found.' });

      if (currentUser.role === 'teacher' && targetUser.created_by !== currentUser.id) {
        return sendJson(res, 403, { error: 'Teachers can only suspend or activate student accounts they created.' });
      }

      const body = await parseBody(req);
      const safeBody = currentUser.role === 'admin' ? body : { account_status: body.account_status };
      const updatedUser = await store.updateUserAdmin(targetId, safeBody);

      if (safeBody.account_status) {
        await store.logActivity(
          currentUser,
          'ACCOUNT_STATUS_CHANGED',
          `Changed account status of ${targetUser.name} to ${safeBody.account_status}`,
          'user',
          targetId
        );
      }
      if (safeBody.reset_password) {
        await store.logActivity(currentUser, 'PASSWORD_RESET', `Reset password for ${targetUser.name}`, 'user', targetId);
      }

      return sendJson(res, 200, { user: updatedUser });
    }

    if (pathname === '/api/admin/moderate' && method === 'POST') {
      if (!currentUser || currentUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Only Universe Administrators can execute universe-wide moderation.' });
      }
      const body = await parseBody(req);
      const { mission_id, action, reason } = body;
      const mission = await store.getMissionById(mission_id);
      if (!mission) return sendJson(res, 404, { error: 'Submission not found.' });

      await store.moderateMission(mission_id, action, reason);
      if (action === 'flag') {
        await store.logActivity(currentUser, 'SUBMISSION_FLAGGED', `Flagged mission "${mission.title}"`, 'mission', mission_id);
      } else if (action === 'unflag') {
        await store.logActivity(currentUser, 'SUBMISSION_UNFLAGGED', `Cleared flag on "${mission.title}"`, 'mission', mission_id);
      } else if (action === 'remove') {
        await store.logActivity(currentUser, 'SUBMISSION_REMOVED', `Removed mission "${mission.title}" from Omniverse`, 'mission', mission_id);
      }

      return sendJson(res, 200, { success: true });
    }

    if (pathname === '/api/admin/settings' && method === 'PUT') {
      if (!currentUser || currentUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Only Universe Administrators can update Supernova thresholds.' });
      }
      const body = await parseBody(req);
      const thresholds = await store.updateThresholds(body);
      await store.logActivity(
        currentUser,
        'THRESHOLDS_UPDATED',
        `Updated Stellar Energy thresholds (Bright: ${thresholds.bright}, Radiant: ${thresholds.radiant}, Supernova: ${thresholds.supernova})`,
        'system',
        'settings'
      );

      return sendJson(res, 200, { thresholds });
    }

    // =========================================================================
    // STATIC ASSETS & SPA FRONTEND SERVING
    // =========================================================================
    const publicDir = path.join(__dirname, 'public');
    let filePath = path.join(publicDir, pathname === '/' ? 'index.html' : pathname);

    if (!filePath.startsWith(publicDir)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.txt': 'text/plain; charset=utf-8',
        '.md': 'text/plain; charset=utf-8',
        '.csv': 'text/csv; charset=utf-8',
        '.mp4': 'video/mp4',
        '.ico': 'image/x-icon',
      };
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      return fs.createReadStream(filePath).pipe(res);
    }

    const indexHtml = path.join(publicDir, 'index.html');
    if (fs.existsSync(indexHtml)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      });
      return fs.createReadStream(indexHtml).pipe(res);
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: err.message || 'Internal Omniverse Server Error' });
  }
});

if (require.main === module) {
  store.init().then(() => {
    server.listen(PORT, () => {
      console.log(`RAKS OMNIVERSE Server orbiting at http://localhost:${PORT} [${store.getStorageMode()}]`);
    });
  });
}
module.exports = { server, store };
