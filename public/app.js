// =============================================================================
// RAKS OMNIVERSE — FRONTEND APPLICATION CONTROLLER (app.js)
// Deep-Space Editorial Aesthetic, Zero Emojis, Crisp SVG Line Icons,
// Stagnant Galaxies with Click-to-Zoom, True Astronomical Stars,
// and Mission Control (/missions).
// =============================================================================

(function () {
  // Minimalist 1.5px stroke SVG line icons
  const ICONS = {
    brand: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>`,
    map: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-22 12 12)"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`,
    mission: `<svg viewBox="0 0 24 24"><path d="M12 2L19 21L12 17L5 21L12 2Z"/></svg>`,
    comet: `<svg viewBox="0 0 24 24"><path d="M21 3L9 15"/><path d="M18 3L4 17"/><path d="M21 6L11 16"/><circle cx="6.5" cy="17.5" r="3.5"/></svg>`,
    cosmo: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10" stroke-dasharray="3 3"/></svg>`,
    profile: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20"/></svg>`,
    galaxy: `<svg viewBox="0 0 24 24"><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M12 10c-3.5 0 -6 2.5 -6 5.5s3 5.5 7 5.5c4.5 0 8 -3.5 8 -8"/><path d="M12 14c3.5 0 6 -2.5 6 -5.5s-3 -5.5 -7 -5.5c-4.5 0 -8 3.5 -8 8"/></svg>`,
    constellation: `<svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="8" r="2"/><circle cx="14" cy="18" r="2"/><circle cx="6" cy="17" r="2"/><path d="M7 6.5L17 7.8L14.5 16L7.8 16.8"/></svg>`,
    students: `<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5c2.5.4 4.5 2 4.5 4.5"/></svg>`,
    admin: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
    shield: `<svg viewBox="0 0 24 24"><path d="M12 3L4 7V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V7L12 3Z"/></svg>`,
    search: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20L16 16"/></svg>`,
    bell: `<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 1L14.6 9.4L23 12L14.6 14.6L12 23L9.4 14.6L1 12L9.4 9.4L12 1Z"/></svg>`,
    heart: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    mic: `<svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,
    close: `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  };

  const state = {
    route: window.location.pathname === '/' ? '/cosmic-map' : window.location.pathname,
    user: null,
    demoUsers: [],
    unreadCount: 0,
    universe: {
      galaxies: [],
      stars: [],
      constellations: [],
      comets: [],
      stats: {},
      thresholds: { bright: 2, radiant: 4, supernova: 6 },
    },
    missions: [],
    notifications: [],
    adminData: { teachers: [], students: [], logs: [] },
    membershipRequests: [],

    mapMode: 'universe',
    activeGalaxy: null,
    activeConstellation: null,
    mapSearch: '',

    missionStep: 1,
    missionDraft: {
      title: '',
      tagline: '',
      category: 'Deep Learning & AI',
      galaxy_id: 'gal-ai',
      description: '',
      objectives: '',
      outcomes: '',
      github_url: '',
      live_url: '',
      video_url: '',
      documentation: '',
      attachments: [{ name: 'Technical_Documentation.pdf', size: '2.1 MB', type: 'application/pdf' }],
    },
    missionFilter: 'All',

    teacherTab: 'mission-control',
    constellationBuilder: {
      galaxy_id: 'gal-ai',
      name: '',
      description: '',
      color: '#4A7DFF',
      selectedStars: [],
    },

    adminTab: 'analytics',
    cometCategory: 'All',

    cosmoState: 'idle',
    cosmoVoiceEnabled: true,
    cosmoChatOpen: false,
    cosmoMessages: [
      {
        sender: 'ai',
        text: "Hey there! I'm Cosmo, your friendly guide to Raks Pallikkoodam School in Coimbatore—tap the mic or ask me anything about our school clubs, student stars, or upcoming events.",
        time: "Now",
      },
    ],
    cosmoSuggestions: [
      'Hey Cosmo',
      'Which galaxies focus on artificial intelligence?',
      'Show me the most popular robotics projects.',
      'What are the upcoming school events?',
      'Tell me about the Neural Networks constellation.',
      'Has my project been approved?',
    ],

    reducedMotion: false,
  };

  let cosmicEngine = null;
  let cosmoSphere = null;
  let cometAnimFrame = null;
  let activeRecognition = null;

  function stopCosmoSpeech() {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (activeRecognition) {
      try {
        activeRecognition.abort();
      } catch {}
      activeRecognition = null;
    }
    state.cosmoState = "idle";
  }

  async function api(path, options = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    const storedUserId = localStorage.getItem('omniverse_user_id');
    if (state.user && state.user.id) {
      headers['X-Omniverse-User'] = state.user.id;
    } else if (storedUserId) {
      headers['X-Omniverse-User'] = storedUserId;
    }
    const res = await fetch(path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
  }

  function showToast(title, message, type = 'info') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const colors = {
      info: '#7CC4FA',
      success: '#38B2AC',
      gold: '#E5B869',
      error: '#E06C75',
    };
    const accent = colors[type] || '#7CC4FA';
    const el = document.createElement('div');
    el.style.cssText = `
      background: #060C1A;
      border: 1px solid rgba(140, 162, 200, 0.22);
      border-left: 3px solid ${accent};
      border-radius: 10px;
      padding: 12px 16px;
      min-width: 280px;
      max-width: 380px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.8);
      color: #EEF2FF;
      animation: fadeIn 0.2s ease;
    `;
    el.innerHTML = `
      <div style="font-family:var(--font-heading); font-weight:600; font-size:13px; color:${accent}; margin-bottom:2px;">${escapeHtml(title)}</div>
      <div style="font-size:12.5px; color:var(--text-secondary);">${escapeHtml(message)}</div>
    `;
    root.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.25s ease';
      setTimeout(() => el.remove(), 260);
    }, 4000);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatMarkdown(text) {
    const safe = escapeHtml(text);
    return safe
      .replace(/^### (.*)$/gm, '<div style="font-family:var(--font-heading); font-size:15.5px; font-weight:600; color:#7CC4FA; margin:6px 0 8px;">$1</div>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#EEF2FF;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#94A6C8;">$1</em>')
      .replace(/_(.*?)_/g, '<em style="color:var(--text-secondary);">$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(74,125,255,0.14); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:12px; color:#7CC4FA;">$1</code>')
      .replace(/\n/g, '<br/>');
  }

  function getStarBadgeClass(classification) {
    if (classification === 'Supernova') return 'badge-supernova';
    if (classification === 'Radiant Star') return 'badge-radiant';
    if (classification === 'Bright Star') return 'badge-bright';
    return 'badge-young';
  }

  // ===========================================================================
  // INITIALIZATION & DATA LOADING
  // ===========================================================================
  async function bootstrap() {
    try {
      const isSignedIn = localStorage.getItem('omniverse_logged_in') === '1' && localStorage.getItem('omniverse_user_id');
      if (!isSignedIn) {
        openAuthModal({ mandatory: true });
      } else {
        const authData = await api('/api/auth/me');
        state.user = authData.user;
        state.demoUsers = authData.demoUsers || [];
        state.unreadCount = authData.unreadCount || 0;

        if (!state.user || state.user.id !== localStorage.getItem('omniverse_user_id')) {
          localStorage.removeItem('omniverse_logged_in');
          localStorage.removeItem('omniverse_user_id');
          state.user = null;
          openAuthModal({ mandatory: true });
        } else {
          await refreshUniverseData();
          handleUrlParams();
          renderShell();
        }
      }

      const navToggleBtn = document.getElementById("nav-arrow-toggle");
      const sidebarEl = document.getElementById("sidebar");
      if (navToggleBtn && sidebarEl) {
        navToggleBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isOpen = sidebarEl.classList.toggle("open");
          navToggleBtn.classList.toggle("open", isOpen);
        });
        document.addEventListener("click", (e) => {
          if (sidebarEl.classList.contains("open") && !sidebarEl.contains(e.target) && e.target !== navToggleBtn) {
            sidebarEl.classList.remove("open");
            navToggleBtn.classList.remove("open");
          }
        });
      }

      window.addEventListener('popstate', () => {
        stopCosmoSpeech();
        state.route = window.location.pathname === '/' ? '/cosmic-map' : window.location.pathname;
        handleUrlParams();
        renderShell();
      });

      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          openSearchPalette();
        }
      });
    } catch (err) {
      console.error('Bootstrap error:', err);
      if (!state.user) {
        localStorage.removeItem('omniverse_logged_in');
        localStorage.removeItem('omniverse_user_id');
        openAuthModal({ mandatory: true });
      }
    }
  }

  async function refreshUniverseData() {
    const [univ, msnData] = await Promise.all([
      api('/api/universe'),
      api('/api/missions').catch(() => ({ missions: [] })),
    ]);
    state.universe = univ;
    state.missions = msnData.missions || [];

    if (state.user && (state.user.role === 'admin' || state.user.role === 'teacher')) {
      const [adm, reqData] = await Promise.all([
        api('/api/admin/overview').catch(() => null),
        api('/api/galaxies/requests').catch(() => ({ requests: [] })),
      ]);
      if (adm) state.adminData = adm;
      state.membershipRequests = reqData.requests || [];
    } else {
      state.membershipRequests = [];
    }

    if (cosmicEngine) {
      cosmicEngine.setData({
        galaxies: state.universe.galaxies,
        stars: state.universe.stars,
        constellations: state.universe.constellations,
      });
    }
  }

  function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const galId = params.get('galaxy');
    const starId = params.get('star');
    const conId = params.get('constellation');

    if (galId) {
      const g = state.universe.galaxies.find((x) => x.id === galId);
      if (g) {
        state.mapMode = 'galaxy';
        state.activeGalaxy = g;
        setTimeout(() => {
          if (cosmicEngine) cosmicEngine.zoomToGalaxy(g.id);
          if (conId && cosmicEngine) cosmicEngine.selectConstellation(conId);
          if (starId) {
            const st = state.universe.stars.find((s) => s.id === starId);
            if (st) openStarModal(st);
          }
        }, 120);
      }
    }
  }

  function navigate(path, query = '') {
    stopCosmoSpeech();
    if (cosmicEngine && path !== '/cosmic-map') {
      cosmicEngine.destroy();
      cosmicEngine = null;
    }
    if (cosmoSphere && path !== '/cosmo') {
      cosmoSphere.destroy();
      cosmoSphere = null;
    }
    if (cometAnimFrame && path !== '/comets') {
      cancelAnimationFrame(cometAnimFrame);
      cometAnimFrame = null;
    }

    state.route = path;
    const fullUrl = query ? `${path}?${query}` : path;
    window.history.pushState({}, '', fullUrl);
    handleUrlParams();
    renderShell();
  }

  async function switchAccount(userId) {
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      state.user = data.user;
      const authMe = await api('/api/auth/me');
      state.demoUsers = authMe.demoUsers || [];
      state.unreadCount = authMe.unreadCount || 0;
      await refreshUniverseData();
      showToast(
        `Role: ${state.user.role.toUpperCase()}`,
        `Signed in as ${state.user.name}`,
        state.user.role === 'admin' ? 'gold' : 'info'
      );
      renderShell();
    } catch (err) {
      showToast('Authentication Error', err.message, 'error');
    }
  }

  // ===========================================================================
  // SIDEBAR & TOPBAR RENDERING (ZERO EMOJIS)
  // ===========================================================================
  function renderShell() {
    renderSidebar();
    renderTopbar();
    renderActiveRoute();
  }

  function renderSidebar() {
    const sb = document.getElementById('sidebar');
    if (!sb || !state.user) return;

    const u = state.user;
    const pendingCount = state.universe.stats.total_pending_missions || 0;
    const initials = u.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const coreNav = [
      { path: '/cosmic-map', icon: ICONS.map, label: 'Cosmic Map', badge: `${state.universe.galaxies.length}` },
      { path: '/missions', icon: ICONS.mission, label: 'Mission Control', badge: pendingCount && (u.role === 'admin' || u.role === 'teacher') ? `${pendingCount}` : null },
      { path: '/comets', icon: ICONS.comet, label: 'Comets', badge: `${state.universe.comets.length}` },
      { path: '/cosmo', icon: ICONS.cosmo, label: 'Cosmo', badge: null },
      { path: '/student', icon: ICONS.profile, label: 'My Profile', badge: null },
    ];

    const teacherNav =
      u.role === 'teacher' || u.role === 'admin'
        ? [
            { path: '/teacher', tab: 'mission-control', icon: ICONS.mission, label: 'Review Submissions', badge: pendingCount ? `${pendingCount}` : null },
            { path: '/teacher', tab: 'galaxy-studio', icon: ICONS.galaxy, label: 'Galaxy Studio', badge: null },
            { path: '/teacher', tab: 'constellation-creator', icon: ICONS.constellation, label: 'Constellations', badge: null },
            { path: '/teacher', tab: 'students', icon: ICONS.students, label: 'Students', badge: null },
          ]
        : [];

    const adminNav =
      u.role === 'admin'
        ? [
            { path: '/admin', tab: 'analytics', icon: ICONS.admin, label: 'Overview', badge: null },
            { path: '/admin', tab: 'teachers', icon: ICONS.profile, label: 'Teachers', badge: null },
            { path: '/admin', tab: 'students', icon: ICONS.students, label: 'All Students', badge: null },
            { path: '/admin', tab: 'moderation', icon: ICONS.shield, label: 'Moderation', badge: null },
          ]
        : [];

    sb.innerHTML = `
      <div>
        <div class="brand-header" data-nav="/cosmic-map">
          <div class="brand-mark">${ICONS.brand}</div>
          <div>
            <div class="brand-title">Raks Omniverse</div>
            <span class="brand-subtitle">School Observatory</span>
          </div>
        </div>

        <div class="nav-section-label">Explore</div>
        <ul class="nav-list">
          ${coreNav
            .map(
              (item) => `
            <li class="nav-item ${state.route === item.path ? 'active' : ''}" data-nav="${item.path}">
              ${item.icon}
              <span class="nav-text">${item.label}</span>
              ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </li>
          `
            )
            .join('')}
        </ul>

        ${
          teacherNav.length
            ? `
          <div class="nav-section-label">Galaxy Mentor</div>
          <ul class="nav-list">
            ${teacherNav
              .map(
                (item) => `
              <li class="nav-item ${state.route === '/teacher' && state.teacherTab === item.tab ? 'active' : ''}" data-nav="${item.path}" data-teacher-tab="${item.tab}">
                ${item.icon}
                <span class="nav-text">${item.label}</span>
                ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
              </li>
            `
              )
              .join('')}
          </ul>
        `
            : ''
        }

        ${
          adminNav.length
            ? `
          <div class="nav-section-label">Administration</div>
          <ul class="nav-list">
            ${adminNav
              .map(
                (item) => `
              <li class="nav-item ${state.route === '/admin' && state.adminTab === item.tab ? 'active' : ''}" data-nav="${item.path}" data-admin-tab="${item.tab}">
                ${item.icon}
                <span class="nav-text">${item.label}</span>
                ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
              </li>
            `
              )
              .join('')}
          </ul>
        `
            : ''
        }
      </div>

      <div class="sidebar-footer">
        <div class="user-pill" style="cursor:pointer;" id="sidebar-profile-trigger" title="View My Profile">
          <div class="user-avatar">${initials}</div>
          <div style="overflow:hidden; flex:1;">
            <div style="font-family:var(--font-heading); font-weight:500; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(u.name)}</div>
            <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
              <span class="role-chip ${u.role}">${u.role === 'teacher' ? 'Mentor' : u.role === 'student' ? 'Explorer' : 'Admin'}</span>
              <span style="font-size:10.5px; color:var(--text-muted);">${escapeHtml(u.grade || u.teacher_code || '')}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    sb.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', () => {
        const navPath = el.getAttribute('data-nav');
        const tTab = el.getAttribute('data-teacher-tab');
        const aTab = el.getAttribute('data-admin-tab');
        if (tTab) state.teacherTab = tTab;
        if (aTab) state.adminTab = aTab;
        const sidebarEl = document.getElementById("sidebar");
        const navToggleBtn = document.getElementById("nav-arrow-toggle");
        if (sidebarEl) sidebarEl.classList.remove("open");
        if (navToggleBtn) navToggleBtn.classList.remove("open");
        navigate(navPath);
      });
    });

    const profTrigger = document.getElementById('sidebar-profile-trigger');
    if (profTrigger) {
      profTrigger.addEventListener('click', () => {
        const sidebarEl = document.getElementById("sidebar");
        const navToggleBtn = document.getElementById("nav-arrow-toggle");
        if (sidebarEl) sidebarEl.classList.remove("open");
        if (navToggleBtn) navToggleBtn.classList.remove("open");
        navigate('/student');
      });
    }
  }

  function renderTopbar() {
    const tb = document.getElementById('topbar');
    if (!tb || !state.user) return;

    let crumbs = `<span class="breadcrumb-crumb" data-crumb="root">Omniverse</span>`;
    if (state.route === '/cosmic-map') {
      if (state.mapMode === 'galaxy' && state.activeGalaxy) {
        crumbs += `<span style="color:var(--text-muted)">/</span><span class="breadcrumb-crumb current" style="color:${state.activeGalaxy.accent_color}">${escapeHtml(state.activeGalaxy.name)}</span>`;
        if (state.activeConstellation) {
          crumbs += `<span style="color:var(--text-muted)">/</span><span class="breadcrumb-crumb current">${escapeHtml(state.activeConstellation.name)}</span>`;
        }
      } else {
        crumbs += `<span style="color:var(--text-muted)">/</span><span class="breadcrumb-crumb current">Cosmic Map</span>`;
      }
    } else {
      const labelMap = {
        '/missions': 'Mission Control',
        '/comets': 'Comets',
        '/cosmo': 'Cosmo',
        '/student': 'Explorer Profile',
        '/teacher': 'Galaxy Mentor',
        '/admin': 'Administration',
      };
      crumbs += `<span style="color:var(--text-muted)">/</span><span class="breadcrumb-crumb current">${labelMap[state.route] || 'Cosmic Map'}</span>`;
    }

    const spaceTitle = (state.user.role === 'admin' || state.user.role === 'teacher')
      ? 'COMMANDER'
      : 'CADET';

    tb.innerHTML = `
      <div class="breadcrumb-bar">
        ${crumbs}
      </div>

      <div class="topbar-welcome-neon">
        WELCOME, ${spaceTitle} ${escapeHtml(state.user.name.toUpperCase())}
      </div>

      <div class="topbar-actions">
        <div class="search-trigger" id="global-search-btn">
          ${ICONS.search}
          <span>Search galaxies, stars, constellations...</span>
          <span class="kbd-shortcut">⌘K</span>
        </div>

        <button class="icon-btn" id="notif-toggle-btn" title="Notifications">
          ${ICONS.bell}
          ${state.unreadCount > 0 ? `<span class="unread-dot"></span>` : ''}
        </button>

        <button class="btn btn-ghost btn-sm" id="logout-btn">Sign Out</button>
      </div>
    `;

    tb.querySelectorAll('[data-crumb="root"]').forEach((el) => {
      el.addEventListener('click', () => {
        if (state.route === '/cosmic-map' && cosmicEngine) {
          cosmicEngine.zoomToUniverse();
        } else {
          navigate('/cosmic-map');
        }
      });
    });

    document.getElementById('global-search-btn').addEventListener('click', openSearchPalette);
    document.getElementById('notif-toggle-btn').addEventListener('click', toggleNotificationDrawer);
    document.getElementById('logout-btn').addEventListener('click', async () => {
      localStorage.removeItem('omniverse_logged_in');
      localStorage.removeItem('omniverse_user_id');
      await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
      state.user = null;
      openAuthModal({ mandatory: true });
    });
  }

  function renderActiveRoute() {
    const root = document.getElementById('view-root');
    if (!root) return;

    root.classList.toggle('map-mode', state.route === '/cosmic-map');

    if (state.route === '/cosmic-map') {
      renderCosmicMapView(root);
    } else if (state.route === '/missions') {
      renderMissionsView(root);
    } else if (state.route === '/comets') {
      renderCometsView(root);
    } else if (state.route === '/cosmo') {
      renderCosmoView(root);
    } else if (state.route === '/student') {
      renderStudentPortal(root);
    } else if (state.route === '/teacher') {
      renderTeacherPortal(root);
    } else if (state.route === '/admin') {
      renderAdminPortal(root);
    } else if (state.route === '/login') {
      renderCosmicMapView(root);
      openAuthModal();
    } else {
      renderCosmicMapView(root);
    }
  }

  // ===========================================================================
  // 1. COSMIC MAP (/cosmic-map) — STAGNANT GALAXIES, REAL STARS, CLEAN HUD
  // ===========================================================================
  function renderCosmicMapView(root) {
    root.innerHTML = `
      <div id="cosmic-canvas-wrap">
        <canvas id="cosmic-webgl-canvas"></canvas>
        <div id="cosmic-labels-layer"></div>

        <!-- Top-Left Minimalist Observatory Card -->
        <div class="map-hud-top-left" id="map-hud-left"></div>

        <!-- Right-Side Constellation Panel (Only shown when relevant or inside galaxy) -->
        <div class="map-hud-right" id="map-hud-right"></div>

        <!-- Bottom Galaxy Bar & Camera Controls -->
        <div class="map-hud-bottom">
          <div class="galaxy-quick-dock" id="map-galaxy-dock"></div>
          <div class="map-camera-controls">
            <button class="icon-btn" id="cam-zoom-in" title="Zoom In">+</button>
            <button class="icon-btn" id="cam-zoom-out" title="Zoom Out">−</button>
            <button class="btn btn-ghost btn-sm" id="cam-reset-btn">Reset View</button>
          </div>
        </div>
      </div>
    `;

    const canvas = document.getElementById('cosmic-webgl-canvas');
    const labelsLayer = document.getElementById('cosmic-labels-layer');

    if (cosmicEngine) cosmicEngine.destroy();
    cosmicEngine = new window.CosmicMap3DEngine(canvas, labelsLayer, {
      onModeChange: (mode, galaxy, constellation) => {
        state.mapMode = mode;
        state.activeGalaxy = galaxy;
        state.activeConstellation = constellation;
        renderTopbar();
        updateCosmicMapHUD();
      },
      onStarSelect: (star) => {
        openStarModal(star);
      },
    });

    cosmicEngine.setData({
      galaxies: state.universe.galaxies,
      stars: state.universe.stars,
      constellations: state.universe.constellations,
    });

    if (state.mapMode === 'galaxy' && state.activeGalaxy) {
      cosmicEngine.zoomToGalaxy(state.activeGalaxy.id);
    }

    document.getElementById('cam-zoom-in').addEventListener('click', () => cosmicEngine.zoomStep(45));
    document.getElementById('cam-zoom-out').addEventListener('click', () => cosmicEngine.zoomStep(-45));
    document.getElementById('cam-reset-btn').addEventListener('click', () => cosmicEngine.resetCamera());

    updateCosmicMapHUD();
  }

  function updateCosmicMapHUD() {
    const leftHud = document.getElementById('map-hud-left');
    const rightHud = document.getElementById('map-hud-right');
    const dock = document.getElementById('map-galaxy-dock');
    if (!leftHud || !rightHud || !dock) return;

    const { galaxies, stars, constellations, stats } = state.universe;

    // Bottom Dock
    dock.innerHTML = `
      <button class="dock-pill ${state.mapMode === 'universe' ? 'active' : ''}" data-dock-universe="1">
        <span>All Galaxies (${galaxies.length})</span>
      </button>
      ${galaxies
        .map(
          (g) => `
        <button class="dock-pill ${state.activeGalaxy && state.activeGalaxy.id === g.id ? 'active' : ''}" data-dock-gal="${g.id}">
          <span style="width:6px; height:6px; border-radius:50%; background:${g.accent_color};"></span>
          <span>${escapeHtml(g.name.replace(' Galaxy', ''))}</span>
          <span class="stat-num" style="font-size:11px; color:var(--text-muted);">${g.star_count || 0}</span>
        </button>
      `
        )
        .join('')}
    `;

    dock.querySelector('[data-dock-universe]').addEventListener('click', () => {
      if (cosmicEngine) cosmicEngine.zoomToUniverse();
    });
    dock.querySelectorAll('[data-dock-gal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const gId = btn.getAttribute('data-dock-gal');
        if (cosmicEngine) cosmicEngine.zoomToGalaxy(gId);
      });
    });

    // Left HUD: Clean, Editorial neal.fun-inspired Card
    if (state.mapMode === 'universe' || !state.activeGalaxy) {
      leftHud.innerHTML = `
        <div class="map-hud-card">
          <div style="font-family:var(--font-mono); font-size:10.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px;">
            DEEP SPACE OBSERVATORY
          </div>
          <h2 style="font-size:19px; font-weight:600; color:var(--text-primary); margin-bottom:6px;">Raks Omniverse</h2>
          <p style="font-size:12.5px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">
            Click any galaxy to zoom into its star system and explore student projects and constellations.
          </p>
          <div style="display:flex; gap:16px; font-size:12px; color:var(--text-secondary); padding-top:10px; border-top:1px solid var(--border-subtle);">
            <span><strong class="stat-num" style="color:var(--text-primary);">${stats.total_galaxies || 0}</strong> galaxies</span>
            <span><strong class="stat-num" style="color:var(--text-primary);">${stats.total_stars || 0}</strong> stars</span>
            <span><strong class="stat-num" style="color:var(--text-primary);">${stats.total_constellations || 0}</strong> constellations</span>
          </div>
        </div>
      `;

      // Right HUD in Universe Mode: Keep empty so the pitch-black space canvas is completely open
      rightHud.innerHTML = ``; if (false) rightHud.innerHTML = `
        <div class="map-hud-card">
          <div style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-muted); margin-bottom:10px;">
            Constellations (${constellations.length})
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${constellations
              .map(
                (c) => `
              <div class="cosmic-card interactive" style="padding:9px 12px; border-radius:8px; cursor:pointer;" data-jump-con="${c.id}">
                <div style="font-family:var(--font-heading); font-weight:500; font-size:12.5px; color:var(--text-primary);">${escapeHtml(c.name)}</div>
                <div style="font-size:11px; color:var(--text-secondary); margin-top:1px;">
                  ${escapeHtml(c.galaxy_name)} · ${(c.stars || []).length} stars
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    } else {
      // Zoomed Inside a Specific Galaxy
      const g = state.universe.galaxies.find((x) => x.id === state.activeGalaxy.id) || state.activeGalaxy;
      const galStars = stars.filter((s) => s.galaxy_id === g.id);
      const galCons = constellations.filter((c) => c.galaxy_id === g.id);

      leftHud.innerHTML = `
        <div class="map-hud-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-family:var(--font-mono); font-size:10.5px; color:${g.accent_color}; letter-spacing:0.1em;">${escapeHtml(g.code)}</span>
            <button class="btn btn-ghost btn-sm" id="back-to-universe-btn" style="padding:3px 9px; font-size:11px;">Back to Universe</button>
          </div>
          <h2 style="font-size:20px; font-weight:600; color:var(--text-primary); margin-bottom:6px;">${escapeHtml(g.name)}</h2>
          <p style="font-size:12.5px; color:var(--text-secondary); margin-bottom:10px;">${escapeHtml(g.description)}</p>
          <div style="font-size:11.5px; color:var(--text-muted); margin-bottom:12px;">
            Galaxy Head: <span style="color:var(--text-secondary);">${escapeHtml(g.teacher_name || 'Unassigned')}</span>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${
              state.user && state.user.role === 'student'
                ? g.is_member
                  ? `<span class="badge badge-approved" style="padding:6px 12px;">Member</span>`
                  : g.membership_pending
                  ? `<button class="btn btn-ghost btn-sm" disabled>Request Pending</button>`
                  : `<button class="btn btn-cyan btn-sm" id="toggle-join-galaxy-btn">Request Membership</button>`
                : ''
            }
            ${
              !state.user || state.user.role !== 'student' || g.is_member
                ? `<button class="btn btn-primary btn-sm" id="launch-into-galaxy-btn">Open Mission Control</button>`
                : `<button class="btn btn-ghost btn-sm" id="launch-into-galaxy-btn" title="Members only for contribution">View Mission Control</button>`
            }
          </div>
        </div>
      `;

      document.getElementById('back-to-universe-btn').addEventListener('click', () => {
        if (cosmicEngine) cosmicEngine.zoomToUniverse();
      });

      const joinBtn = document.getElementById('toggle-join-galaxy-btn');
      if (joinBtn) {
        joinBtn.addEventListener('click', async () => {
          try {
            const res = await api(`/api/galaxies/${g.id}/join`, { method: 'POST' });
            await refreshUniverseData();
            state.activeGalaxy = state.universe.galaxies.find((x) => x.id === g.id);
            updateCosmicMapHUD();
            showToast('Membership Requested', res.message, 'success');
          } catch (err) {
            showToast('Error', err.message, 'error');
          }
        });
      }

      const launchBtn = document.getElementById('launch-into-galaxy-btn');
      if (launchBtn) {
        launchBtn.addEventListener('click', () => {
          state.missionDraft.galaxy_id = g.id;
          navigate('/missions');
        });
      }

      rightHud.innerHTML = `
        <div class="map-hud-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-muted);">
              Constellations (${galCons.length})
            </span>
            ${
              state.activeConstellation
                ? `<button class="btn btn-ghost btn-sm" id="clear-con-filter" style="padding:2px 7px; font-size:10px;">Show All</button>`
                : ''
            }
          </div>
          ${
            galCons.length === 0
              ? `<div style="font-size:12px; color:var(--text-muted);">No constellations in this galaxy yet.</div>`
              : `<div style="display:flex; flex-direction:column; gap:6px;">
                  ${galCons
                    .map(
                      (c) => `
                    <div class="cosmic-card interactive" style="padding:9px 11px; border-radius:8px; cursor:pointer; border-color:${
                      state.activeConstellation && state.activeConstellation.id === c.id ? '#E5B869' : 'var(--border-subtle)'
                    };" data-select-con="${c.id}">
                      <div style="font-family:var(--font-heading); font-weight:600; font-size:12.5px; color:var(--text-primary);">
                        ${escapeHtml(c.name)}
                      </div>
                      <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                        ${escapeHtml(c.description)}
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>`
          }
        </div>

        <div class="map-hud-card">
          <div style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-muted); margin-bottom:8px;">
            Stars in System (${galStars.length})
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${galStars
              .map(
                (s) => `
              <div class="cosmic-card interactive" style="padding:9px 11px; border-radius:8px; cursor:pointer;" data-open-star="${s.id}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:12.5px; font-weight:500; color:var(--text-primary);">${escapeHtml(s.title)}</span>
                  <span class="stat-num" style="font-size:11px; color:var(--accent-ice);">${s.stellar_energy}</span>
                </div>
                <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                  ${escapeHtml(s.student_name)} · ${escapeHtml(s.star_classification)}
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;

      const clearConBtn = document.getElementById('clear-con-filter');
      if (clearConBtn) {
        clearConBtn.addEventListener('click', () => {
          if (cosmicEngine) cosmicEngine.selectConstellation(null);
        });
      }
    }

    rightHud.querySelectorAll('[data-open-star]').forEach((el) => {
      el.addEventListener('click', () => {
        const st = state.universe.stars.find((s) => s.id === el.getAttribute('data-open-star'));
        if (st) openStarModal(st);
      });
    });

    rightHud.querySelectorAll('[data-jump-con]').forEach((el) => {
      el.addEventListener('click', () => {
        const cId = el.getAttribute('data-jump-con');
        if (cosmicEngine) cosmicEngine.selectConstellation(cId);
      });
    });

    rightHud.querySelectorAll('[data-select-con]').forEach((el) => {
      el.addEventListener('click', () => {
        const cId = el.getAttribute('data-select-con');
        const nextId = state.activeConstellation && state.activeConstellation.id === cId ? null : cId;
        if (cosmicEngine) cosmicEngine.selectConstellation(nextId);
      });
    });
  }

  // ===========================================================================
  // STAR PROJECT DETAIL MODAL + SPARK SYSTEM (ZERO EMOJIS)
  // ===========================================================================
  function openStarModal(star) {
    const overlay = document.getElementById('overlay-root');
    if (!overlay) return;

    const isOwnStar = state.user && star.student_id === state.user.id;
    const starGal = state.universe.galaxies.find((g) => g.id === star.galaxy_id);
    const canManageStar = state.user && (state.user.role === 'admin' || !!state.user.full_access || (starGal && starGal.teacher_id === state.user.id));
    const thresholds = state.universe.thresholds || { bright: 2, radiant: 4, supernova: 6 };
    const progressPct = Math.min(100, Math.round((star.stellar_energy / thresholds.supernova) * 100));

    const memberConstellations = state.universe.constellations.filter((c) =>
      (c.stars || []).some((cs) => cs.star_id === star.id)
    );

    overlay.innerHTML = `
      <div class="modal-backdrop" id="star-modal-backdrop">
        <div class="modal-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:18px; margin-bottom:18px;">
            <div style="display:flex; align-items:center; gap:18px;">
              <!-- Live 3D Rendered Star Preview -->
              <div style="position:relative; width:96px; height:96px; flex-shrink:0; border-radius:50%; background:#000000; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <canvas id="modal-3d-star-canvas" style="width:110px; height:110px;"></canvas>
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
                  <span class="badge ${getStarBadgeClass(star.star_classification)}">
                    ${escapeHtml(star.star_classification)}
                  </span>
                  <span class="badge badge-young">
                    ${escapeHtml(star.galaxy_name)}
                  </span>
                  <span class="badge badge-young">${escapeHtml(star.category || 'Research')}</span>
                </div>
                <h2 style="font-size:24px; font-weight:600; color:var(--text-primary);">${escapeHtml(star.title)}</h2>
                <p style="font-size:13.5px; color:var(--text-secondary); margin-top:4px;">${escapeHtml(star.tagline || '')}</p>
              </div>
            </div>
            <button class="icon-btn" id="close-star-modal">${ICONS.close}</button>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; padding:14px 16px; border-radius:12px; background:rgba(0,0,0,0.65); border:1px solid var(--border-subtle); margin-bottom:18px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="user-avatar" style="width:38px; height:38px; font-size:14px;">
                ${escapeHtml((star.student_name || 'E')[0])}
              </div>
              <div>
                <div style="font-family:var(--font-heading); font-weight:600; font-size:14px;">${escapeHtml(star.student_name)}</div>
                <div style="font-size:12px; color:var(--text-secondary);">
                  ${escapeHtml(star.student_grade || 'Explorer')} · Approved by ${escapeHtml(star.reviewer_name || 'Galaxy Mentor')}
                </div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:14px;">
              <div style="text-align:right;">
                <div class="stat-num" id="modal-energy-count" style="font-size:18px; font-weight:600; color:var(--text-primary);">
                  ${star.stellar_energy} Sparks
                </div>
                <div style="font-size:11px; color:var(--text-muted);">
                  Stellar Energy
                </div>
              </div>

              <button class="like-spark-btn ${star.has_sparked ? 'sparked' : ''}" id="modal-spark-btn" ${isOwnStar ? 'title="You cannot like your own project"' : ''}>
                <span id="modal-like-icon" style="display:inline-flex; align-items:center;">${star.has_sparked ? ICONS.star : ICONS.heart}</span>
                <span id="modal-like-label">${star.has_sparked ? 'Sparked' : isOwnStar ? 'Your Star' : 'Like'}</span>
              </button>
            </div>
          </div>

          <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-bottom:6px;">
              <span>Young Star (0)</span>
              <span>Bright (${thresholds.bright})</span>
              <span>Radiant (${thresholds.radiant})</span>
              <span>Supernova (${thresholds.supernova}+)</span>
            </div>
            <div style="height:5px; border-radius:999px; background:rgba(255,255,255,0.06); overflow:hidden;">
              <div style="width:${progressPct}%; height:100%; background:linear-gradient(90deg, #4A7DFF, #7CC4FA, #E5B869); transition:width 0.35s ease;"></div>
            </div>
          </div>

          <div style="display:grid; gap:14px; margin-bottom:18px;">
            <div class="cosmic-card" style="padding:16px;">
              <div class="form-label" style="margin-bottom:6px;">Overview</div>
              <p style="font-size:13.5px; color:var(--text-primary); line-height:1.65;">${escapeHtml(star.description)}</p>
            </div>

            <div class="grid-2">
              <div class="cosmic-card" style="padding:16px;">
                <div class="form-label" style="margin-bottom:6px;">Objectives</div>
                <p style="font-size:13px; color:var(--text-secondary);">${escapeHtml(star.objectives || 'Demonstrated functional prototype and research methodology.')}</p>
              </div>
              <div class="cosmic-card" style="padding:16px;">
                <div class="form-label" style="margin-bottom:6px;">Outcomes</div>
                <p style="font-size:13px; color:var(--text-secondary);">${escapeHtml(star.outcomes || 'Validated across peer review and laboratory benchmarks.')}</p>
              </div>
            </div>
          </div>

          ${
            star.feedback
              ? `
            <div class="cosmic-card" style="padding:14px 16px; margin-bottom:16px; border-color:rgba(56,178,172,0.3);">
              <div style="font-family:var(--font-heading); font-size:11.5px; font-weight:600; color:#4FD1C5; margin-bottom:4px;">
                Mentor Review (${escapeHtml(star.reviewer_name || 'Mentor')})
              </div>
              <div style="font-size:13px; color:var(--text-primary);">"${escapeHtml(star.feedback)}"</div>
            </div>
          `
              : ''
          }

          ${
            memberConstellations.length > 0
              ? `
            <div class="cosmic-card" style="padding:14px 16px; margin-bottom:16px;">
              <div style="font-family:var(--font-heading); font-size:11.5px; font-weight:600; color:var(--accent-ice); margin-bottom:6px;">
                Connected in Constellation
              </div>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${memberConstellations
                  .map(
                    (mc) => `
                  <span class="badge badge-bright">${escapeHtml(mc.name)} (${escapeHtml(mc.galaxy_name)})</span>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
              : ''
          }

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; padding-top:14px; border-top:1px solid var(--border-subtle);">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              ${
                star.github_url
                  ? `<a href="${escapeHtml(star.github_url)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Source Code</a>`
                  : ''
              }
              ${
                star.live_url
                  ? `<a href="${escapeHtml(star.live_url)}" target="_blank" rel="noopener" class="btn btn-cyan btn-sm">Live Project</a>`
                  : ''
              }
              ${(star.attachments || [])
                .map(
                  (att) => `
                ${att.url ? `<a href="${escapeHtml(att.url)}" target="_blank" download="${escapeHtml(att.name)}" class="btn btn-cyan btn-sm">${escapeHtml(att.name)} (${escapeHtml(att.size || "File")})</a>` : `<span class="btn btn-ghost btn-sm" style="cursor:default;">${escapeHtml(att.name)} (${escapeHtml(att.size || "PDF")})</span>`}
              `
                )
                .join('')}
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              ${
                canManageStar
                  ? `<button class="btn btn-cyan btn-sm" id="edit-star-btn">Edit Star</button>
                     <button class="btn btn-danger btn-sm" id="delete-star-btn">Delete Star</button>`
                  : ''
              }
              <span style="font-size:11px; color:var(--text-muted);">
                Approved ${new Date(star.approval_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('close-star-modal').addEventListener('click', () => {
      overlay.innerHTML = '';
    });

    const editStarBtn = document.getElementById('edit-star-btn');
    if (editStarBtn) {
      editStarBtn.addEventListener('click', () => openEditStarModal(star));
    }
    const deleteStarBtn = document.getElementById('delete-star-btn');
    if (deleteStarBtn) {
      deleteStarBtn.addEventListener('click', async () => {
        if (!window.confirm(`Delete star "${star.title}"? This cannot be undone.`)) return;
        try {
          await api(`/api/stars/${star.id}`, { method: 'DELETE' });
          overlay.innerHTML = '';
          await refreshUniverseData();
          updateCosmicMapHUD();
          showToast('Star Removed', `Deleted "${star.title}".`, 'info');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    }
    document.getElementById('star-modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'star-modal-backdrop') overlay.innerHTML = '';
    });

    let modalStarBoost = 1 + (star.stellar_energy || 0) * 0.06;
    const starPreviewCanvas = document.getElementById('modal-3d-star-canvas');
    if (window.startModal3DStarPreview && starPreviewCanvas) {
      window.startModal3DStarPreview(
        starPreviewCanvas,
        star.star_color || star.galaxy_color || '#8EC8F6',
        star.star_classification === 'Supernova',
        () => modalStarBoost
      );
    }

    const sparkBtn = document.getElementById('modal-spark-btn');
    if (sparkBtn) {
      sparkBtn.addEventListener('click', async () => {
        try {
          const btnRect = sparkBtn.getBoundingClientRect();
          const startX = btnRect.left + btnRect.width / 2;
          const startY = btnRect.top + btnRect.height / 2;

          const previewRect = starPreviewCanvas
            ? starPreviewCanvas.getBoundingClientRect()
            : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
          const targetX = previewRect.left + previewRect.width / 2;
          const targetY = previewRect.top + previewRect.height / 2;

          const result = await api(`/api/stars/${star.id}/spark`, { method: 'POST' });

          if (result.sparked) {
            // 1. Transform the normal Like button into a glowing Spark!
            sparkBtn.classList.add('transforming');
            const iconEl = document.getElementById('modal-like-icon');
            const labelEl = document.getElementById('modal-like-label');
            if (iconEl) iconEl.innerHTML = ICONS.star;
            if (labelEl) labelEl.textContent = 'Spark!';

            // Also launch a secondary spark into the Star on the 3D Cosmic Map if visible
            if (cosmicEngine) {
              const mapCoords = cosmicEngine.getStarScreenCoords(star.id);
              window.launchSparkFlight(startX, startY, mapCoords.x, mapCoords.y, star.star_color || '#8EC8F6', () => {
                cosmicEngine.triggerSparkBurst(star.id);
              });
            }

            // 2. Fly the Spark from the button directly into the 3D Star preview!
            window.launchSparkFlight(startX, startY, targetX, targetY, star.star_color || '#E5B869', async () => {
              modalStarBoost = 1.65;
              await refreshUniverseData();
              const updatedStar = state.universe.stars.find((s) => s.id === star.id);

              setTimeout(() => {
                if (result.becameSupernova && updatedStar) {
                  overlay.innerHTML = '';
                  triggerSupernovaCeremony(updatedStar);
                } else if (updatedStar) {
                  openStarModal(updatedStar);
                  updateCosmicMapHUD();
                }
              }, 380);
            });
          } else {
            await refreshUniverseData();
            const updatedStar = state.universe.stars.find((s) => s.id === star.id);
            if (updatedStar) {
              openStarModal(updatedStar);
              updateCosmicMapHUD();
            }
          }
        } catch (err) {
          showToast('Notice', err.message, 'error');
        }
      });
    }
  }

  function openEditStarModal(star) {
    const overlay = document.getElementById('overlay-root');
    if (!overlay) return;
    overlay.innerHTML = `
      <div class="modal-backdrop" id="edit-star-backdrop">
        <div class="modal-panel" style="max-width:600px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h2 style="font-size:20px; font-weight:600;">Edit Star</h2>
            <button class="icon-btn" id="close-edit-star">${ICONS.close}</button>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Star Title *</label>
              <input type="text" class="form-input" id="es-title" value="${escapeHtml(star.title || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <input type="text" class="form-input" id="es-cat" value="${escapeHtml(star.category || '')}" />
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Explorer Name</label>
              <input type="text" class="form-input" id="es-exp-name" value="${escapeHtml(star.student_name || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Explorer Grade</label>
              <input type="text" class="form-input" id="es-exp-grade" value="${escapeHtml(star.student_grade || '')}" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tagline</label>
            <input type="text" class="form-input" id="es-tagline" value="${escapeHtml(star.tagline || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="es-desc">${escapeHtml(star.description || '')}</textarea>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Objectives</label>
              <textarea class="form-textarea" id="es-obj" style="min-height:70px;">${escapeHtml(star.objectives || '')}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Outcomes</label>
              <textarea class="form-textarea" id="es-out" style="min-height:70px;">${escapeHtml(star.outcomes || '')}</textarea>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
            <button class="btn btn-ghost" id="cancel-edit-star">Cancel</button>
            <button class="btn btn-primary" id="save-edit-star">Save Changes</button>
          </div>
        </div>
      </div>
    `;
    const closeBack = () => openStarModal(state.universe.stars.find((s) => s.id === star.id) || star);
    document.getElementById('close-edit-star').addEventListener('click', closeBack);
    document.getElementById('cancel-edit-star').addEventListener('click', closeBack);
    document.getElementById('save-edit-star').addEventListener('click', async () => {
      const title = document.getElementById('es-title').value.trim();
      if (!title) {
        showToast('Validation Error', 'Star title is required.', 'error');
        return;
      }
      try {
        await api(`/api/stars/${star.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title,
            category: document.getElementById('es-cat').value.trim(),
            explorer_name: document.getElementById('es-exp-name').value.trim(),
            explorer_grade: document.getElementById('es-exp-grade').value.trim(),
            tagline: document.getElementById('es-tagline').value.trim(),
            description: document.getElementById('es-desc').value.trim(),
            objectives: document.getElementById('es-obj').value.trim(),
            outcomes: document.getElementById('es-out').value.trim(),
          }),
        });
        await refreshUniverseData();
        const updated = state.universe.stars.find((s) => s.id === star.id);
        if (updated) openStarModal(updated);
        else overlay.innerHTML = '';
        updateCosmicMapHUD();
        showToast('Star Updated', `Saved changes to "${title}".`, 'success');
      } catch (err) {
        showToast('Error', err.message, 'error');
      }
    });
  }

  function openEditGalaxyModal(galaxy, onSaved) {
    const overlay = document.getElementById('overlay-root');
    if (!overlay) return;
    overlay.innerHTML = `
      <div class="modal-backdrop" id="edit-gal-backdrop">
        <div class="modal-panel" style="max-width:580px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h2 style="font-size:20px; font-weight:600;">Edit Galaxy</h2>
            <button class="icon-btn" id="close-edit-gal">${ICONS.close}</button>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Galaxy Name *</label>
              <input type="text" class="form-input" id="eg-name" value="${escapeHtml(galaxy.name || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <input type="text" class="form-input" id="eg-cat" value="${escapeHtml(galaxy.category || '')}" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="eg-desc">${escapeHtml(galaxy.description || '')}</textarea>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Grade Eligibility</label>
              <input type="text" class="form-input" id="eg-grades" value="${escapeHtml(galaxy.grade_eligibility || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Meeting Schedule</label>
              <input type="text" class="form-input" id="eg-meet" value="${escapeHtml(galaxy.meeting_info || '')}" />
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
            <button class="btn btn-ghost" id="cancel-edit-gal">Cancel</button>
            <button class="btn btn-primary" id="save-edit-gal">Save Galaxy</button>
          </div>
        </div>
      </div>
    `;
    const close = () => { overlay.innerHTML = ''; };
    document.getElementById('close-edit-gal').addEventListener('click', close);
    document.getElementById('cancel-edit-gal').addEventListener('click', close);
    document.getElementById('save-edit-gal').addEventListener('click', async () => {
      const name = document.getElementById('eg-name').value.trim();
      if (!name) {
        showToast('Validation Error', 'Galaxy name is required.', 'error');
        return;
      }
      try {
        await api(`/api/galaxies/${galaxy.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name,
            category: document.getElementById('eg-cat').value.trim(),
            description: document.getElementById('eg-desc').value.trim(),
            grade_eligibility: document.getElementById('eg-grades').value.trim(),
            meeting_info: document.getElementById('eg-meet').value.trim(),
          }),
        });
        overlay.innerHTML = '';
        await refreshUniverseData();
        if (onSaved) onSaved();
        showToast('Galaxy Updated', `Saved changes to "${name}".`, 'success');
      } catch (err) {
        showToast('Error', err.message, 'error');
      }
    });
  }

  function triggerSupernovaCeremony(star) {
    const root = document.getElementById('ceremony-root');
    if (!root) return;
    root.innerHTML = `
      <div class="ceremony-overlay" id="supernova-ceremony">
        <div class="shockwave-ring"></div>
        <div class="shockwave-ring delay-1"></div>
        <div class="shockwave-ring delay-2"></div>
        <svg width="96" height="96" viewBox="0 0 100 100" style="margin-bottom:20px;">
          <path d="M50 2 L57 43 L98 50 L57 57 L50 98 L43 57 L2 50 L43 43 Z" fill="#EEF2FF"/>
          <path d="M20 20 L46 44 L80 20 L56 46 L80 80 L46 56 L20 80 L44 46 Z" fill="#E5B869" opacity="0.8"/>
        </svg>
        <div class="badge badge-supernova" style="font-size:12px; padding:4px 12px; margin-bottom:12px;">
          SUPERNOVA IGNITION
        </div>
        <h1 style="font-size:32px; font-weight:600; color:var(--text-primary); margin-bottom:10px;">
          ${escapeHtml(star.title)}
        </h1>
        <p style="font-size:15px; color:var(--text-secondary); max-width:500px; margin-bottom:24px;">
          Created by <strong>${escapeHtml(star.student_name)}</strong> in <strong>${escapeHtml(star.galaxy_name)}</strong> has reached <strong>${star.stellar_energy} unique Sparks</strong> and transformed into a Supernova.
        </p>
        <button class="btn btn-gold" id="close-supernova-ceremony">Continue Exploring</button>
      </div>
    `;
    document.getElementById('close-supernova-ceremony').addEventListener('click', () => {
      root.innerHTML = '';
      openStarModal(star);
      updateCosmicMapHUD();
    });
  }

  function triggerStarActivationCeremony(star, mission) {
    const root = document.getElementById('ceremony-root');
    if (!root) return;
    root.innerHTML = `
      <div class="ceremony-overlay" id="star-activation-ceremony">
        <div class="shockwave-ring" style="border-color:#7CC4FA;"></div>
        <div class="shockwave-ring delay-1" style="border-color:#4A7DFF;"></div>
        <svg width="88" height="88" viewBox="0 0 100 100" style="margin-bottom:20px;">
          <path d="M50 4 L56 44 L96 50 L56 56 L50 96 L44 56 L4 50 L44 44 Z" fill="#EEF2FF"/>
        </svg>
        <div class="badge badge-bright" style="font-size:12px; padding:4px 12px; margin-bottom:12px;">
          STAR ACTIVATED
        </div>
        <h1 style="font-size:30px; font-weight:600; color:var(--text-primary); margin-bottom:10px;">
          "${escapeHtml(mission.title)}" is Now a Star
        </h1>
        <p style="font-size:14.5px; color:var(--text-secondary); max-width:500px; margin-bottom:24px;">
          This approved mission now shines inside <strong>${escapeHtml(mission.galaxy_name || 'its Galaxy')}</strong> on the Cosmic Map.
        </p>
        <div style="display:flex; gap:12px;">
          <button class="btn btn-primary" id="view-activated-star-btn">View Star on Cosmic Map</button>
          <button class="btn btn-ghost" id="close-activation-ceremony">Return to Mission Control</button>
        </div>
      </div>
    `;
    document.getElementById('close-activation-ceremony').addEventListener('click', () => {
      root.innerHTML = '';
    });
    document.getElementById('view-activated-star-btn').addEventListener('click', () => {
      root.innerHTML = '';
      navigate('/cosmic-map', `galaxy=${star.galaxy_id}&star=${star.id}`);
    });
  }

  // ===========================================================================
  // 2. MISSION CONTROL (/missions) — LAUNCH & TRACK MISSIONS + TEACHER REVIEW
  // ===========================================================================
  function renderMissionsView(root) {
    const d = state.missionDraft;
    const galaxies = state.universe.galaxies;
    const isMentor = state.user && (state.user.role === 'teacher' || state.user.role === 'admin');
    const stepLabels = [
      '1. Mission ID',
      '2. Destination Galaxy',
      '3. Mission Briefing',
      '4. Evidence & Links',
      '5. Review & Launch',
    ];

    const filteredMissions = state.missions.filter(
      (m) => state.missionFilter === 'All' || m.status === state.missionFilter
    );

    root.innerHTML = `
      <div class="page-wrap">
        <div class="page-hero">
          <div>
            <div class="hero-eyebrow">MISSION CONTROL</div>
            <h1 class="hero-title">Mission Control</h1>
            <p class="hero-desc">Every project begins as a Mission. Once approved by a Galaxy Mentor, your Mission activates into a permanent Star in its destination Galaxy.</p>
          </div>
          ${
            isMentor
              ? `<button class="btn btn-cyan" id="open-mentor-review-btn">Open Mentor Review Queue</button>`
              : ''
          }
        </div>

        <!-- 5-Step Mission Launch Sequence -->
        <div class="cosmic-card" style="margin-bottom:34px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-family:var(--font-heading); font-weight:600; font-size:15px; color:var(--text-primary);">
              Prepare a New Mission
            </span>
            <span style="font-family:var(--font-mono); font-size:11.5px; color:var(--text-muted);">
              STEP ${state.missionStep} OF 5
            </span>
          </div>

          <div class="wizard-steps">
            ${stepLabels
              .map(
                (lbl, idx) => `
              <div class="wizard-step ${state.missionStep === idx + 1 ? 'active' : state.missionStep > idx + 1 ? 'done' : ''}" data-wiz-step="${idx + 1}">
                <span class="stat-num">0${idx + 1}</span>
                <span>${lbl.split('. ')[1]}</span>
              </div>
            `
              )
              .join('')}
          </div>

          <div id="wizard-step-body">
            ${renderMissionWizardStep(d, galaxies)}
          </div>
        </div>

        <!-- Mission Control Tracking Log -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
          <h2 style="font-size:20px; font-weight:600;">Mission Log (${filteredMissions.length})</h2>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${['All', 'Draft', 'Submitted', 'Under Review', 'Changes Requested', 'Approved', 'Rejected']
              .map(
                (st) => `
              <button class="tab-btn ${state.missionFilter === st ? 'active' : ''}" data-msn-filter="${st}" style="padding:5px 11px; font-size:12px;">
                ${st}
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="grid-3">
          ${
            filteredMissions.length === 0
              ? `<div class="cosmic-card" style="grid-column:1/-1; text-align:center; padding:36px; color:var(--text-secondary);">No missions in this state yet.</div>`
              : filteredMissions
                  .map(
                    (m) => `
              <div class="cosmic-card interactive" style="display:flex; flex-direction:column; justify-content:space-between; gap:14px;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px;">
                    <span class="status-pill status-${m.status.replace(/\s+/g, '-')}">${escapeHtml(m.status)}</span>
                    <span style="font-size:11.5px; color:${m.galaxy_color || '#7CC4FA'}; font-weight:500;">${escapeHtml(m.galaxy_name)}</span>
                  </div>
                  <h3 style="font-size:16.5px; font-weight:600; margin-bottom:6px;">${escapeHtml(m.title)}</h3>
                  <p style="font-size:13px; color:var(--text-secondary); margin-bottom:10px;">${escapeHtml(m.description)}</p>
                </div>

                <div>
                  ${
                    m.feedback
                      ? `
                    <div style="padding:10px 12px; border-radius:8px; background:rgba(9,17,36,0.8); border-left:2px solid ${
                      m.status === 'Approved' ? '#38B2AC' : '#E5B869'
                    }; font-size:12px; margin-bottom:10px;">
                      <strong style="color:var(--text-primary);">Mentor Note (${escapeHtml(m.reviewer_name || 'Mentor')}):</strong><br/>
                      <span style="color:var(--text-secondary);">"${escapeHtml(m.feedback)}"</span>
                    </div>
                  `
                      : ''
                  }
                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:var(--text-muted); padding-top:10px; border-top:1px solid var(--border-subtle);">
                    <span>${escapeHtml(m.student_name)}</span>
                    ${
                      m.star_id
                        ? `<button class="btn btn-cyan btn-sm" data-goto-star="${m.star_id}" data-goto-gal="${m.galaxy_id}" style="padding:4px 10px; font-size:11px;">View Star (${m.stellar_energy})</button>`
                        : `<span>${new Date(m.submission_date).toLocaleDateString()}</span>`
                    }
                  </div>
                </div>
              </div>
            `
                  )
                  .join('')
          }
        </div>
      </div>
    `;

    const mentorBtn = document.getElementById('open-mentor-review-btn');
    if (mentorBtn) {
      mentorBtn.addEventListener('click', () => {
        state.teacherTab = 'mission-control';
        navigate('/teacher');
      });
    }

    bindMissionWizardEvents(root);
  }

  function renderMissionWizardStep(d, galaxies) {
    if (state.missionStep === 1) {
      return `
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Project / Mission Title *</label>
            <input type="text" class="form-input" id="msn-title" placeholder="e.g., Autonomous Line-Following Rover" value="${escapeHtml(d.title)}" />
          </div>
          <div class="form-group">
            <label class="form-label">Project Category *</label>
            <input type="text" class="form-input" id="msn-category" placeholder="e.g., Computer Vision, Mechatronics, CleanTech" value="${escapeHtml(d.category)}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Summary Tagline</label>
          <input type="text" class="form-input" id="msn-tagline" placeholder="A concise summary of your mission" value="${escapeHtml(d.tagline)}" />
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:12px;">
          <button class="btn btn-primary" id="wiz-next-btn">Next: Select Galaxy</button>
        </div>
      `;
    }

    if (state.missionStep === 2) {
      const isStudent = state.user && state.user.role === 'student';
      const selectedGal = galaxies.find((g) => g.id === d.galaxy_id) || galaxies[0];
      const canContribute = !isStudent || (selectedGal && selectedGal.is_member);
      return `
        <div class="form-label" style="margin-bottom:10px;">Select Destination Galaxy *</div>
        <div class="grid-3" style="margin-bottom:18px;">
          ${galaxies
            .map((g) => {
              const memBadge = isStudent
                ? g.is_member
                  ? `<span class="badge badge-approved">Member</span>`
                  : g.membership_pending
                  ? `<span class="badge badge-young">Request Pending</span>`
                  : `<span class="badge badge-rejected">Not a Member</span>`
                : '';
              return `
            <div class="cosmic-card interactive" style="padding:14px; cursor:pointer; border-color:${
              d.galaxy_id === g.id ? g.accent_color : 'var(--border-subtle)'
            };" data-pick-gal="${g.id}">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:4px;">
                <span style="font-family:var(--font-mono); font-size:10.5px; color:${g.accent_color};">${escapeHtml(g.code)}</span>
                <div style="display:flex; gap:6px; align-items:center;">
                  ${memBadge}
                  ${d.galaxy_id === g.id ? `<span class="badge badge-bright">Selected</span>` : ''}
                </div>
              </div>
              <div style="font-family:var(--font-heading); font-weight:600; font-size:14.5px;">${escapeHtml(g.name)}</div>
              <div style="font-size:11.5px; color:var(--text-secondary); margin-top:4px;">Galaxy Head: ${escapeHtml(g.teacher_name || 'Unassigned')}</div>
            </div>
          `;
            })
            .join('')}
        </div>
        ${
          !canContribute && selectedGal
            ? `<div class="cosmic-card" style="padding:12px 16px; margin-bottom:14px; border-color:rgba(229,184,105,0.4); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <span style="font-size:12.5px; color:var(--text-secondary);">
                  Only members of <strong>${escapeHtml(selectedGal.name)}</strong> can submit missions here.
                </span>
                ${
                  selectedGal.membership_pending
                    ? `<button class="btn btn-ghost btn-sm" disabled>Request Pending</button>`
                    : `<button class="btn btn-cyan btn-sm" data-wiz-req-gal="${selectedGal.id}">Request Membership</button>`
                }
              </div>`
            : ''
        }
        <div style="display:flex; justify-content:space-between;">
          <button class="btn btn-ghost" id="wiz-prev-btn">Back</button>
          <button class="btn btn-primary" id="wiz-next-btn" ${!canContribute ? 'disabled' : ''}>Next: Describe Mission</button>
        </div>
      `;
    }

    if (state.missionStep === 3) {
      return `
        <div class="form-group">
          <label class="form-label">Mission Description *</label>
          <textarea class="form-textarea" id="msn-desc" placeholder="Explain how your project works and how you built it...">${escapeHtml(d.description)}</textarea>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Objectives</label>
            <textarea class="form-textarea" id="msn-obj" placeholder="What problem or question did you set out to explore?">${escapeHtml(d.objectives)}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Outcomes & Results</label>
            <textarea class="form-textarea" id="msn-out" placeholder="What measurable results or findings did you achieve?">${escapeHtml(d.outcomes)}</textarea>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <button class="btn btn-ghost" id="wiz-prev-btn">Back</button>
          <button class="btn btn-primary" id="wiz-next-btn">Next: Evidence & Links</button>
        </div>
      `;
    }

    if (state.missionStep === 4) {
      return `
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Source Code / GitHub URL</label>
            <input type="url" class="form-input" id="msn-github" placeholder="https://github.com/..." value="${escapeHtml(d.github_url)}" />
          </div>
          <div class="form-group">
            <label class="form-label">Live Project Link</label>
            <input type="url" class="form-input" id="msn-live" placeholder="https://..." value="${escapeHtml(d.live_url)}" />
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Video Demo URL</label>
            <input type="url" class="form-input" id="msn-video" placeholder="https://..." value="${escapeHtml(d.video_url)}" />
          </div>
          <div class="form-group">
            <label class="form-label">Additional Documentation Notes</label>
            <input type="text" class="form-input" id="msn-doc" placeholder="Hardware specs, datasets used, or references" value="${escapeHtml(d.documentation)}" />
          </div>
        </div>

        <!-- Supporting Files Upload Zone -->
        <div class="form-group" style="margin-top:4px;">
          <label class="form-label">Upload Supporting Files (PDFs, Images, Code, ZIP, Reports)</label>
          <div id="msn-upload-dropzone" style="border:1px dashed rgba(255,255,255,0.28); border-radius:10px; padding:22px; text-align:center; background:rgba(255,255,255,0.02); cursor:pointer; transition:all 0.2s ease;">
            <input type="file" id="msn-file-input" multiple style="display:none;" />
            <div style="font-size:13px; color:#FFFFFF; font-weight:600; margin-bottom:4px;">
              Click to Select Supporting Files or Drag & Drop Here
            </div>
            <div style="font-size:11px; color:var(--text-secondary);">
              Supports PDF, PNG, JPG, ZIP, PY, IPYNB, DOCX, PPTX, CSV, MP4 (Multiple files allowed)
            </div>
          </div>

          <div id="msn-uploaded-files-list" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:12px;">
            ${(d.attachments || [])
              .map(
                (att, idx) => `
              <div class="badge badge-bright" style="padding:6px 10px; display:inline-flex; align-items:center; gap:8px; font-size:11px;">
                ${
                  att.url
                    ? `<a href="${escapeHtml(att.url)}" target="_blank" download="${escapeHtml(att.name)}" style="color:#FFFFFF; text-decoration:underline;">${escapeHtml(att.name)}</a>`
                    : `<span>${escapeHtml(att.name)}</span>`
                }
                <span style="color:var(--text-secondary);">(${escapeHtml(att.size || "File")})</span>
                <span data-remove-att="${idx}" style="cursor:pointer; color:var(--accent-coral); font-weight:700; margin-left:4px;" title="Remove file">×</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; margin-top:14px;">
          <button class="btn btn-ghost" id="wiz-prev-btn">Back</button>
          <button class="btn btn-primary" id="wiz-next-btn">Next: Review & Launch</button>
        </div>
      `;
    }

    const chosenGal = galaxies.find((g) => g.id === d.galaxy_id) || galaxies[0];
    return `
      <div class="cosmic-card" style="background:rgba(2,4,10,0.6); margin-bottom:18px;">
        <div style="font-family:var(--font-mono); font-size:10.5px; color:var(--accent-ice); margin-bottom:6px;">MISSION SUMMARY</div>
        <h3 style="font-size:18px; font-weight:600;">${escapeHtml(d.title || 'Untitled Mission')}</h3>
        <p style="font-size:12.5px; color:var(--text-secondary); margin:4px 0 10px;">
          Destination: <strong>${escapeHtml(chosenGal ? chosenGal.name : '')}</strong> · Category: <strong>${escapeHtml(d.category)}</strong>
        </p>
        <p style="font-size:13px; color:var(--text-secondary);">${escapeHtml(d.description || 'No description entered yet.')}</p>
      </div>
      <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <button class="btn btn-ghost" id="wiz-prev-btn">Back</button>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-ghost" id="save-draft-msn-btn">Save Draft</button>
          <button class="btn btn-primary" id="launch-msn-btn">${state.user && (state.user.role === 'teacher' || state.user.role === 'admin') ? 'Launch & Activate Star' : 'Launch Mission'}</button>
        </div>
      </div>
    `;
  }

  function syncWizardInputs() {
    const d = state.missionDraft;
    const val = (id) => {
      const el = document.getElementById(id);
      return el ? el.value : null;
    };
    if (val('msn-title') !== null) d.title = val('msn-title');
    if (val('msn-category') !== null) d.category = val('msn-category');
    if (val('msn-tagline') !== null) d.tagline = val('msn-tagline');
    if (val('msn-desc') !== null) d.description = val('msn-desc');
    if (val('msn-obj') !== null) d.objectives = val('msn-obj');
    if (val('msn-out') !== null) d.outcomes = val('msn-out');
    if (val('msn-github') !== null) d.github_url = val('msn-github');
    if (val('msn-live') !== null) d.live_url = val('msn-live');
    if (val('msn-video') !== null) d.video_url = val('msn-video');
    if (val('msn-doc') !== null) d.documentation = val('msn-doc');
    // Preserve uploaded attachments in state.missionDraft.attachments
  }

  function bindMissionWizardEvents(root) {
    root.querySelectorAll('[data-wiz-step]').forEach((el) => {
      el.addEventListener('click', () => {
        syncWizardInputs();
        state.missionStep = parseInt(el.getAttribute('data-wiz-step'), 10);
        renderMissionsView(root);
      });
    });

    root.querySelectorAll('[data-pick-gal]').forEach((el) => {
      el.addEventListener('click', () => {
        state.missionDraft.galaxy_id = el.getAttribute('data-pick-gal');
        renderMissionsView(root);
      });
    });

    root.querySelectorAll('[data-wiz-req-gal]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const gId = btn.getAttribute('data-wiz-req-gal');
        try {
          const res = await api(`/api/galaxies/${gId}/join`, { method: 'POST' });
          await refreshUniverseData();
          renderMissionsView(root);
          showToast('Membership Requested', res.message || 'Your request has been sent to the Galaxy Head.', 'success');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });

    const nextBtn = document.getElementById('wiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (state.missionStep === 2 && state.user && state.user.role === 'student') {
          const sel = state.universe.galaxies.find((g) => g.id === state.missionDraft.galaxy_id);
          if (sel && !sel.is_member) {
            showToast('Membership Required', 'Request and obtain membership in this galaxy before contributing.', 'error');
            return;
          }
        }
        syncWizardInputs();
        state.missionStep = Math.min(5, state.missionStep + 1);
        renderMissionsView(root);
      });
    }

    const prevBtn = document.getElementById('wiz-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        syncWizardInputs();
        state.missionStep = Math.max(1, state.missionStep - 1);
        renderMissionsView(root);
      });
    }

    // Bind Supporting File Upload Dropzone & File Input
    const dropzone = document.getElementById('msn-upload-dropzone');
    const fileInput = document.getElementById('msn-file-input');

    const handleFilesSelected = async (fileList) => {
      if (!fileList || fileList.length === 0) return;
      syncWizardInputs();
      showToast('Uploading Files', `Uploading ${fileList.length} supporting file(s)...`, 'info');

      try {
        const payloadFiles = [];
        for (const file of Array.from(fileList)) {
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          payloadFiles.push({
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : Math.max(1, Math.round(file.size / 1024)) + ' KB',
            data: dataUrl,
          });
        }

        const res = await api('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ files: payloadFiles }),
        });

        // Remove default placeholder if still present
        state.missionDraft.attachments = (state.missionDraft.attachments || []).filter(
          (a) => a.name !== 'Technical_Documentation.pdf' || a.url
        );
        state.missionDraft.attachments.push(...(res.files || []));
        renderMissionsView(root);
        showToast('Files Uploaded', `Attached ${res.files.length} file(s) to your mission.`, 'success');
      } catch (err) {
        showToast('Upload Failed', err.message, 'error');
      }
    };

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => handleFilesSelected(e.target.files));
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#FFFFFF';
        dropzone.style.background = 'rgba(255,255,255,0.07)';
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'rgba(255,255,255,0.28)';
        dropzone.style.background = 'rgba(255,255,255,0.02)';
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'rgba(255,255,255,0.28)';
        dropzone.style.background = 'rgba(255,255,255,0.02)';
        if (e.dataTransfer && e.dataTransfer.files) {
          handleFilesSelected(e.dataTransfer.files);
        }
      });
    }

    root.querySelectorAll('[data-remove-att]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        syncWizardInputs();
        const idx = parseInt(el.getAttribute('data-remove-att'), 10);
        state.missionDraft.attachments.splice(idx, 1);
        renderMissionsView(root);
      });
    });

    const submitMission = async (statusType) => {
      syncWizardInputs();
      const d = state.missionDraft;
      if (!d.title.trim() || !d.description.trim()) {
        showToast('Missing Details', 'Please enter a Mission Title (Step 1) and Description (Step 3).', 'error');
        return;
      }
      try {
        const res = await api('/api/missions', {
          method: 'POST',
          body: JSON.stringify({ ...d, status: statusType }),
        });
        state.missionDraft = {
          title: '',
          tagline: '',
          category: 'Deep Learning & AI',
          galaxy_id: d.galaxy_id,
          description: '',
          objectives: '',
          outcomes: '',
          github_url: '',
          live_url: '',
          video_url: '',
          documentation: '',
          attachments: [{ name: 'Technical_Documentation.pdf', size: '2.1 MB', type: 'application/pdf' }],
        };
        state.missionStep = 1;
        await refreshUniverseData();
        renderMissionsView(root);
        if (res.star) {
          triggerStarActivationCeremony(res.star, res.mission || d);
        } else {
          showToast(
            statusType === 'Draft' ? 'Draft Saved' : 'Mission Launched',
            statusType === 'Draft' ? 'Saved to your mission log.' : 'Submitted to your Galaxy Mentor for review.',
            'success'
          );
        }
      } catch (err) {
        showToast('Launch Error', err.message, 'error');
      }
    };

    const launchBtn = document.getElementById('launch-msn-btn');
    if (launchBtn) launchBtn.addEventListener('click', () => submitMission('Submitted'));

    const draftBtn = document.getElementById('save-draft-msn-btn');
    if (draftBtn) draftBtn.addEventListener('click', () => submitMission('Draft'));

    root.querySelectorAll('[data-msn-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.missionFilter = btn.getAttribute('data-msn-filter');
        renderMissionsView(root);
      });
    });

    root.querySelectorAll('[data-goto-star]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sId = btn.getAttribute('data-goto-star');
        const gId = btn.getAttribute('data-goto-gal');
        navigate('/cosmic-map', `galaxy=${gId}&star=${sId}`);
      });
    });
  }

  // ===========================================================================
  // 3. COMETS — SCHOOL EVENTS & ANNOUNCEMENTS (/comets)
  // ===========================================================================
  function renderCometsView(root) {
    const canManage = state.user && (state.user.role === 'teacher' || state.user.role === 'admin');
    const dynamicTypes = Array.from(new Set(state.universe.comets.map((c) => c.event_type).filter(Boolean)));
    const categories = ['All', ...dynamicTypes];

    const filteredComets = state.universe.comets.filter(
      (c) => state.cometCategory === 'All' || c.event_type === state.cometCategory
    );

    root.innerHTML = `
      <div class="page-wrap">
        <div class="page-hero">
          <div>
            <div class="hero-eyebrow">COMET TRAJECTORIES</div>
            <h1 class="hero-title">Comets — Events & Deadlines</h1>
            <p class="hero-desc">School announcements, club meetings, competitions, workshops, and submission deadlines moving across the Omniverse calendar.</p>
          </div>
          ${
            canManage
              ? `<button class="btn btn-primary" id="new-comet-btn">Publish Comet</button>`
              : ''
          }
        </div>

        <!-- Orbital Comet Trajectory Canvas -->
        <div class="cosmic-card" style="padding:0; overflow:hidden; margin-bottom:24px; position:relative; height:220px;">
          <canvas id="comet-trajectory-canvas" style="width:100%; height:100%; display:block;"></canvas>
          <div style="position:absolute; top:14px; left:18px; pointer-events:none;">
            <span style="font-family:var(--font-mono); font-size:10.5px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.12em;">
              ORBITAL TRAJECTORY VIEW (${filteredComets.length} ACTIVE COMETS)
            </span>
          </div>
        </div>

        <div class="cosmic-tabs">
          ${categories
            .map(
              (cat) => `
            <button class="tab-btn ${state.cometCategory === cat ? 'active' : ''}" data-comet-cat="${cat}">
              ${cat}
            </button>
          `
            )
            .join('')}
        </div>

        <div class="grid-3">
          ${filteredComets
            .map(
              (c) => `
            <div class="cosmic-card interactive" style="display:flex; flex-direction:column; justify-content:space-between; gap:14px;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <span class="badge badge-bright">
                    ${escapeHtml(c.event_type)}
                  </span>
                  <span class="stat-num" style="font-size:12px; color:var(--accent-amber);">
                    ${escapeHtml(c.event_date)}${c.event_time ? ' · ' + escapeHtml(c.event_time) : ''}
                  </span>
                </div>
                <h3 style="font-size:17px; font-weight:600; margin-bottom:8px; cursor:pointer;" data-open-comet="${c.id}">
                  ${escapeHtml(c.title)}
                </h3>
                <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">
                  ${escapeHtml(c.description)}
                </p>
              </div>

              <div style="font-size:12px; color:var(--text-secondary); border-top:1px solid var(--border-subtle); padding-top:12px; display:flex; flex-direction:column; gap:4px;">
                <div><strong style="color:var(--text-primary);">Location:</strong> ${escapeHtml(c.location)}</div>
                <div><strong style="color:var(--text-primary);">Galaxy:</strong> ${escapeHtml(c.galaxy_name || 'School-Wide')}</div>
                <div><strong style="color:var(--text-primary);">Eligibility:</strong> ${escapeHtml(c.eligibility || 'All Explorers')}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                  <button class="btn btn-cyan btn-sm" data-open-comet="${c.id}">View Details</button>
                  ${
                    canManage
                      ? `<button class="btn btn-danger btn-sm" data-delete-comet="${c.id}">Archive</button>`
                      : ''
                  }
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    initCometTrajectoryCanvas(filteredComets.slice(0, 6));

    root.querySelectorAll('[data-comet-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.cometCategory = btn.getAttribute('data-comet-cat');
        renderCometsView(root);
      });
    });

    root.querySelectorAll('[data-open-comet]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cm = state.universe.comets.find((x) => x.id === btn.getAttribute('data-open-comet'));
        if (cm) openCometDetailModal(cm);
      });
    });

    root.querySelectorAll('[data-delete-comet]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete-comet');
        await api(`/api/comets/${id}`, { method: 'DELETE' });
        await refreshUniverseData();
        renderCometsView(root);
        showToast('Comet Archived', 'Event removed from active trajectory.', 'info');
      });
    });

    const newCometBtn = document.getElementById('new-comet-btn');
    if (newCometBtn) {
      newCometBtn.addEventListener('click', openCreateCometModal);
    }
  }

  function initCometTrajectoryCanvas(comets) {
    const canvas = document.getElementById('comet-trajectory-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width || 900;
    const h = rect.height || 220;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let t = 0;
    function draw() {
      if (!document.getElementById('comet-trajectory-canvas')) return;
      if (!state.reducedMotion) t += 0.005;
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#02040A');
      g.addColorStop(0.5, '#071124');
      g.addColorStop(1, '#030712');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      comets.forEach((c, idx) => {
        const yBase = 42 + ((idx * 30) % (h - 65));
        ctx.strokeStyle = 'rgba(140, 162, 200, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, yBase + 18);
        ctx.quadraticCurveTo(w * 0.5, yBase - 30, w, yBase + 12);
        ctx.stroke();

        const prog = (t * (0.35 + (idx % 3) * 0.1) + idx * 0.22) % 1;
        const cx = prog * w;
        const cy =
          (1 - prog) * (1 - prog) * (yBase + 18) +
          2 * (1 - prog) * prog * (yBase - 30) +
          prog * prog * (yBase + 12);

        const tailGrad = ctx.createLinearGradient(cx, cy, cx - 85, cy + 6);
        tailGrad.addColorStop(0, '#7CC4FA');
        tailGrad.addColorStop(1, 'rgba(2,4,10,0)');
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - 85, cy + 6);
        ctx.stroke();

        if (window.drawAstronomicalStar) {
          window.drawAstronomicalStar(ctx, cx, cy, 2.8, '#7CC4FA', false, 0.95);
        }

        ctx.fillStyle = 'rgba(238,242,255,0.82)';
        ctx.font = '500 11px "Orbitron", monospace';
        ctx.fillText(`${c.title.slice(0, 32)} (${c.event_date})`, cx + 10, cy + 3);
      });

      cometAnimFrame = requestAnimationFrame(draw);
    }
    draw();
  }

  function openCometDetailModal(comet) {
    const overlay = document.getElementById('overlay-root');
    overlay.innerHTML = `
      <div class="modal-backdrop" id="comet-modal-backdrop">
        <div class="modal-panel" style="max-width:600px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
            <span class="badge badge-bright">
              ${escapeHtml(comet.event_type)}
            </span>
            <button class="icon-btn" id="close-comet-modal">${ICONS.close}</button>
          </div>
          <h2 style="font-size:22px; font-weight:600; margin-bottom:10px;">${escapeHtml(comet.title)}</h2>
          <p style="font-size:14px; color:var(--text-secondary); margin-bottom:18px;">${escapeHtml(comet.description)}</p>
          <div class="cosmic-card" style="display:grid; gap:9px; font-size:13px; margin-bottom:18px;">
            <div><strong>Date & Time:</strong> ${escapeHtml(comet.event_date)} at ${escapeHtml(comet.event_time || '10:00 IST')}</div>
            <div><strong>Location:</strong> ${escapeHtml(comet.location)}</div>
            <div><strong>Organising Galaxy:</strong> ${escapeHtml(comet.galaxy_name || 'School-Wide')}</div>
            <div><strong>Eligibility:</strong> ${escapeHtml(comet.eligibility || 'All Explorers')}</div>
            <div><strong>Registration:</strong> ${escapeHtml(comet.registration_info || 'Register via Omniverse Portal')}</div>
            <div><strong>Published By:</strong> ${escapeHtml(comet.creator_name || 'Administrator')}</div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-primary" id="rsvp-comet-btn">Track Event</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('close-comet-modal').addEventListener('click', () => (overlay.innerHTML = ''));
    document.getElementById('rsvp-comet-btn').addEventListener('click', () => {
      overlay.innerHTML = '';
      showToast('Event Tracked', `Added "${comet.title}" (${comet.event_date}) to your schedule.`, 'gold');
    });
  }

  function openCreateCometModal() {
    const overlay = document.getElementById('overlay-root');
    const categories = [
      'School Announcement',
      'Club Meeting',
      'Competition',
      'Workshop',
      'Hackathon',
      'Exhibition Date',
      'Project Deadline',
      'Important Notice',
    ];
    overlay.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-panel" style="max-width:620px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h2 style="font-size:20px; font-weight:600;">Publish New Comet</h2>
            <button class="icon-btn" id="close-new-comet">${ICONS.close}</button>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Event Title *</label>
              <input type="text" class="form-input" id="cmt-title" placeholder="e.g., Quantum Computing Workshop" />
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="cmt-type">
                ${categories.map((c) => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Event Date *</label>
              <input type="date" class="form-input" id="cmt-date" value="2026-11-15" />
            </div>
            <div class="form-group">
              <label class="form-label">Time & Location *</label>
              <input type="text" class="form-input" id="cmt-loc" placeholder="e.g., 15:30 IST · Main Auditorium" />
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Organising Galaxy</label>
              <select class="form-select" id="cmt-gal">
                <option value="">School-Wide (All Galaxies)</option>
                ${state.universe.galaxies.map((g) => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Eligibility</label>
              <input type="text" class="form-input" id="cmt-elig" value="All Explorers (Grades 8 - 12)" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description & Registration Details *</label>
            <textarea class="form-textarea" id="cmt-desc" placeholder="Describe the event agenda and registration instructions..."></textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-ghost" id="cancel-new-comet">Cancel</button>
            <button class="btn btn-primary" id="submit-new-comet">Publish Comet</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('close-new-comet').addEventListener('click', () => (overlay.innerHTML = ''));
    document.getElementById('cancel-new-comet').addEventListener('click', () => (overlay.innerHTML = ''));
    document.getElementById('submit-new-comet').addEventListener('click', async () => {
      const title = document.getElementById('cmt-title').value.trim();
      const event_type = document.getElementById('cmt-type').value;
      const event_date = document.getElementById('cmt-date').value;
      const location = document.getElementById('cmt-loc').value.trim();
      const galaxy_id = document.getElementById('cmt-gal').value || null;
      const eligibility = document.getElementById('cmt-elig').value.trim();
      const description = document.getElementById('cmt-desc').value.trim();

      if (!title || !description || !location) {
        showToast('Validation Error', 'Please fill in title, location, and description.', 'error');
        return;
      }
      await api('/api/comets', {
        method: 'POST',
        body: JSON.stringify({ title, event_type, event_date, location, galaxy_id, eligibility, description }),
      });
      overlay.innerHTML = '';
      await refreshUniverseData();
      renderActiveRoute();
      showToast('Comet Published', `"${title}" is now live on the calendar.`, 'success');
    });
  }

  // ===========================================================================
  // 4. COSMO — THE OMNIVERSE ASSISTANT (/cosmo)
  // ===========================================================================
  function renderCosmoView(root) {
    const lastAiMsg = [...state.cosmoMessages].reverse().find((m) => m.sender === "ai");

    root.innerHTML = `
      <div class="cosmo-voice-stage">
        <!-- Fullscreen Pulsing Purple Futuristic Mist Canvas -->
        <canvas id="cosmo-canvas" style="position:absolute; inset:0; width:100%; height:100%; display:block;"></canvas>

        <!-- Top Status Pill -->
        <div style="position:absolute; top:22px; display:flex; flex-direction:column; align-items:center; gap:6px; z-index:15; pointer-events:none;">
          <span class="badge" style="background:rgba(139,92,246,0.18); border:1px solid rgba(192,132,252,0.45); color:#E9D5FF; letter-spacing:0.16em; text-transform:uppercase; padding:4px 12px;">
            COSMO · ${state.cosmoState.toUpperCase()}
          </span>
          <span style="font-size:11px; color:rgba(233,213,255,0.65);">
            Voice Mode Active · Tap the orb to speak
          </span>
        </div>

        <!-- Spoken Response Floating Caption -->
        ${
          lastAiMsg
            ? `
          <div class="cosmo-voice-caption" id="cosmo-live-caption">
            ${formatMarkdown(lastAiMsg.text)}
          </div>
        `
            : ""
        }

        <!-- Bottom-Center Voice Controls (Default Interaction) -->
        <div class="cosmo-voice-controls">
          <button type="button" class="cosmo-mic-orb ${state.cosmoState === "listening" ? "listening" : ""}" id="cosmo-mic-btn" title="Tap to Speak to Cosmo">
            ${ICONS.mic}
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="cosmo-voice-toggle" style="border-radius:999px; background:rgba(24,16,42,0.5); border-color:rgba(192,132,252,0.3); color:#E9D5FF;">
            ${state.cosmoVoiceEnabled ? "Voice Audio: On" : "Voice Audio: Muted"}
          </button>
        </div>

        <!-- Small Side Option to Toggle Chat -->
        <button type="button" class="cosmo-side-chat-toggle" id="cosmo-toggle-chat-btn">
          ${state.cosmoChatOpen ? "Close Chat" : "Chat"}
        </button>

        <!-- Compact Side Chat Drawer (Hidden by Default) -->
        <aside class="cosmo-side-drawer ${state.cosmoChatOpen ? "open" : ""}" id="cosmo-side-drawer">
          <div style="padding:14px 18px; border-bottom:1px solid rgba(192,132,252,0.18); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-family:var(--font-robotic); font-weight:600; font-size:13px; color:#F5F3FF;">COSMO CHAT</div>
              <div style="font-size:10.5px; color:rgba(233,213,255,0.55);">Text Channel</div>
            </div>
            <button type="button" class="icon-btn" id="cosmo-close-drawer-btn" style="width:28px; height:28px;">${ICONS.close}</button>
          </div>

          <div class="cosmo-messages" id="cosmo-msg-list" style="padding:14px;">
            ${state.cosmoMessages
              .map(
                (m) => `
              <div class="cosmo-msg ${m.sender}" style="font-size:12.5px;">
                <div>${m.sender === "ai" ? formatMarkdown(m.text) : escapeHtml(m.text)}</div>
              </div>
            `
              )
              .join("")}
          </div>

          <div style="padding:8px 14px; display:flex; gap:6px; overflow-x:auto; border-top:1px solid rgba(192,132,252,0.12);" id="cosmo-suggestions-bar">
            ${state.cosmoSuggestions
              .map(
                (s) => `
              <button class="dock-pill" style="font-size:10px; padding:4px 10px;" data-cosmo-prompt="${escapeHtml(s)}">
                ${escapeHtml(s)}
              </button>
            `
              )
              .join("")}
          </div>

          <form id="cosmo-input-form" style="padding:12px 14px; border-top:1px solid rgba(192,132,252,0.18); display:flex; gap:8px; align-items:center;">
            <input type="text" class="form-input" id="cosmo-text-input" placeholder="Type a message..." autocomplete="off" style="flex:1; font-size:12.5px;" />
            <button type="submit" class="btn btn-primary btn-sm">Send</button>
          </form>
        </aside>
      </div>
    `;

    const canvas = document.getElementById("cosmo-canvas");
    if (cosmoSphere) cosmoSphere.destroy();
    cosmoSphere = new window.CosmoSphereEngine(canvas);
    cosmoSphere.setState(state.cosmoState);

    const msgList = document.getElementById("cosmo-msg-list");
    if (msgList) msgList.scrollTop = msgList.scrollHeight;

    document.getElementById("cosmo-voice-toggle").addEventListener("click", () => {
      state.cosmoVoiceEnabled = !state.cosmoVoiceEnabled;
      if (!state.cosmoVoiceEnabled) {
        stopCosmoSpeech();
      }
      renderCosmoView(root);
    });

    const toggleChatBtn = document.getElementById("cosmo-toggle-chat-btn");
    const closeDrawerBtn = document.getElementById("cosmo-close-drawer-btn");
    const drawer = document.getElementById("cosmo-side-drawer");

    if (toggleChatBtn && drawer) {
      toggleChatBtn.addEventListener("click", () => {
        state.cosmoChatOpen = !state.cosmoChatOpen;
        drawer.classList.toggle("open", state.cosmoChatOpen);
        toggleChatBtn.textContent = state.cosmoChatOpen ? "Close Chat" : "Chat";
      });
    }
    if (closeDrawerBtn && drawer && toggleChatBtn) {
      closeDrawerBtn.addEventListener("click", () => {
        state.cosmoChatOpen = false;
        drawer.classList.remove("open");
        toggleChatBtn.textContent = "Chat";
      });
    }

    root.querySelectorAll("[data-cosmo-prompt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sendCosmoQuery(btn.getAttribute("data-cosmo-prompt"));
      });
    });

    document.getElementById("cosmo-input-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("cosmo-text-input");
      if (inp && inp.value.trim()) {
        sendCosmoQuery(inp.value.trim());
        inp.value = "";
      }
    });

    const micBtn = document.getElementById("cosmo-mic-btn");
    if (micBtn) {
      micBtn.addEventListener("click", () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          setCosmoState("listening");
          setTimeout(() => {
            sendCosmoQuery("Which galaxies focus on artificial intelligence?");
          }, 700);
          return;
        }
        const recognition = new SpeechRecognition();
        activeRecognition = recognition;
        recognition.lang = "en-US";
        setCosmoState("listening");
        micBtn.classList.add("listening");
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          sendCosmoQuery(transcript);
        };
        recognition.onerror = () => {
          micBtn.classList.remove("listening");
          setCosmoState("error");
        };
        recognition.start();
      });
    }
  }

  function setCosmoState(st) {
    state.cosmoState = st;
    if (cosmoSphere) cosmoSphere.setState(st);
    const pill = document.getElementById('cosmo-state-pill');
    if (pill) pill.textContent = st.toUpperCase();
  }

  async function sendCosmoQuery(text) {
    state.cosmoMessages.push({ sender: 'user', text, time: 'Just now' });
    setCosmoState('thinking');
    const msgList = document.getElementById('cosmo-msg-list');
    if (msgList) {
      msgList.innerHTML = state.cosmoMessages
        .map(
          (m) => `
        <div class="cosmo-msg ${m.sender}">
          <div>${m.sender === 'ai' ? formatMarkdown(m.text) : escapeHtml(m.text)}</div>
        </div>
      `
        )
        .join('');
      msgList.scrollTop = msgList.scrollHeight;
    }

    try {
      const res = await api('/api/cosmo/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });

      setTimeout(() => {
        setCosmoState(res.state || 'responding');
        state.cosmoMessages.push({ sender: 'ai', text: res.reply, time: 'Just now' });
        if (res.suggestions) state.cosmoSuggestions = res.suggestions;

        if (state.route === "/cosmo" && state.cosmoVoiceEnabled && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
            const cleanSpeech = String(res.reply || "").replace(/[#*_`•]/g, "");
            const utter = new SpeechSynthesisUtterance(cleanSpeech);
            utter.rate = 1.0;
            window.speechSynthesis.speak(utter);
          } catch {}
        }

        if (state.route === '/cosmo') {
          const root = document.getElementById('view-root');
          renderCosmoView(root);
          setTimeout(() => setCosmoState('idle'), 2400);
        }
      }, 320);
    } catch (err) {
      setCosmoState('error');
    }
  }

  // ===========================================================================
  // 5. STUDENT EXPLORER PORTAL (/student)
  // ===========================================================================
  function renderStudentPortal(root) {
    const u = state.user;
    const myMissions = state.missions.filter((m) => m.student_id === u.id);
    const myStars = state.universe.stars.filter((s) => s.student_id === u.id);
    const myGalaxies = state.universe.galaxies.filter((g) => g.is_member);
    const myConstellations = state.universe.constellations.filter((c) =>
      (c.stars || []).some((cs) => myStars.some((ms) => ms.id === cs.star_id))
    );
    const totalSparksEarned = myStars.reduce((acc, s) => acc + (s.stellar_energy || 0), 0);

    const roleLabel = u.role === 'admin' ? 'ADMINISTRATOR PROFILE' : u.role === 'teacher' ? 'COMMANDER PROFILE' : 'EXPLORER PROFILE';
    const metaParts = [
      u.email,
      u.role === 'teacher' ? (u.teacher_code || 'Mentor') : null,
      u.department,
      u.grade ? `${u.grade}${u.section ? ' · ' + u.section : ''}` : null,
      u.account_status ? `Status: ${u.account_status}` : null,
    ].filter(Boolean);

    root.innerHTML = `
      <div class="page-wrap">
        <div class="page-hero">
          <div>
            <div class="hero-eyebrow">${roleLabel}</div>
            <h1 class="hero-title">${escapeHtml(u.name)}</h1>
            <p class="hero-desc" style="margin-bottom:8px;">${escapeHtml(u.bio || 'Exploring the Raks Omniverse through scientific and creative missions.')}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap; font-family:var(--font-mono); font-size:11.5px; color:var(--accent-ice);">
              ${metaParts.map((p) => `<span class="badge badge-young">${escapeHtml(p)}</span>`).join('')}
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-ghost" id="stu-explore-map-btn">Cosmic Map</button>
            <button class="btn btn-primary" id="stu-launch-msn-btn">Mission Control</button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Approved Stars</div>
            <div class="stat-value">${myStars.length}</div>
            <div class="stat-sub">Active in the Omniverse</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Stellar Energy</div>
            <div class="stat-value" style="color:var(--accent-amber);">${totalSparksEarned}</div>
            <div class="stat-sub">Total Sparks received</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Galaxies</div>
            <div class="stat-value">${myGalaxies.length}</div>
            <div class="stat-sub">Club memberships</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Constellations</div>
            <div class="stat-value">${myConstellations.length}</div>
            <div class="stat-sub">Featured formations</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Missions</div>
            <div class="stat-value">${myMissions.length}</div>
            <div class="stat-sub">Total submissions</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="cosmic-card">
            <h3 style="font-size:17px; font-weight:600; margin-bottom:14px;">My Approved Stars (${myStars.length})</h3>
            ${
              myStars.length === 0
                ? `<div style="color:var(--text-secondary); font-size:13px;">Submit a mission in Mission Control to activate your first Star.</div>`
                : `<div style="display:flex; flex-direction:column; gap:8px;">
                    ${myStars
                      .map(
                        (s) => `
                      <div class="cosmic-card interactive" style="padding:12px 14px; cursor:pointer;" data-stu-star="${s.id}">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                          <span style="font-weight:500;">${escapeHtml(s.title)}</span>
                          <span class="badge ${getStarBadgeClass(s.star_classification)}">${s.stellar_energy} Sparks · ${escapeHtml(s.star_classification)}</span>
                        </div>
                        <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                          ${escapeHtml(s.galaxy_name)} · ${escapeHtml(s.category)}
                        </div>
                      </div>
                    `
                      )
                      .join('')}
                  </div>`
            }
          </div>

          <div class="cosmic-card">
            <h3 style="font-size:17px; font-weight:600; margin-bottom:14px;">Galaxies & Club Memberships</h3>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${state.universe.galaxies
                .map(
                  (g) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-radius:8px; background:rgba(2,4,10,0.55); border:1px solid var(--border-subtle);">
                  <div>
                    <div style="font-family:var(--font-heading); font-weight:500; color:var(--text-primary);">${escapeHtml(g.name)}</div>
                    <div style="font-size:11.5px; color:var(--text-secondary);">Galaxy Head: ${escapeHtml(g.teacher_name || 'Unassigned')} · ${g.star_count} stars</div>
                  </div>
                  ${
                    u.role === 'teacher' || u.role === 'admin'
                      ? g.teacher_id === u.id
                        ? `<span class="badge badge-supernova" style="padding:5px 10px;">Galaxy Head</span>`
                        : `<span class="badge badge-approved" style="padding:5px 10px;">Full Access</span>`
                      : g.is_member
                      ? `<span class="badge badge-approved" style="padding:5px 10px;">Member</span>`
                      : g.membership_pending
                      ? `<button class="btn btn-ghost btn-sm" disabled>Request Pending</button>`
                      : `<button class="btn btn-cyan btn-sm" data-stu-join-gal="${g.id}">Request Membership</button>`
                  }
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>

        <div class="cosmic-card" style="margin-top:20px; max-width:560px;">
          <h3 style="font-size:17px; font-weight:600; margin-bottom:6px;">Account Security — Change Password</h3>
          <p style="font-size:12.5px; color:var(--text-secondary); margin-bottom:14px;">
            Update your account password. New teacher accounts start with temporary password <code>raks123</code>.
          </p>
          <form id="change-password-form">
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input type="password" class="form-input" id="prof-cur-pwd" placeholder="Enter current password" required />
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" class="form-input" id="prof-new-pwd" placeholder="Min 4 characters" required />
              </div>
              <div class="form-group">
                <label class="form-label">Confirm New Password</label>
                <input type="password" class="form-input" id="prof-conf-pwd" placeholder="Re-enter new password" required />
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Update Password</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('stu-explore-map-btn').addEventListener('click', () => navigate('/cosmic-map'));
    const msnBtn = document.getElementById('stu-launch-msn-btn');
    if (msnBtn) msnBtn.addEventListener('click', () => navigate('/missions'));

    const chgPwdForm = document.getElementById('change-password-form');
    if (chgPwdForm) {
      chgPwdForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('prof-cur-pwd').value;
        const newPassword = document.getElementById('prof-new-pwd').value;
        const confirmPassword = document.getElementById('prof-conf-pwd').value;
        if (newPassword !== confirmPassword) {
          showToast('Mismatch', 'New passwords do not match.', 'error');
          return;
        }
        try {
          const res = await api('/api/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
          });
          chgPwdForm.reset();
          showToast('Password Updated', res.message || 'Your password has been changed.', 'success');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    }

    root.querySelectorAll('[data-stu-star]').forEach((el) => {
      el.addEventListener('click', () => {
        const st = state.universe.stars.find((s) => s.id === el.getAttribute('data-stu-star'));
        if (st) openStarModal(st);
      });
    });

    root.querySelectorAll('[data-stu-join-gal]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const gId = btn.getAttribute('data-stu-join-gal');
        try {
          const res = await api(`/api/galaxies/${gId}/join`, { method: 'POST' });
          await refreshUniverseData();
          renderStudentPortal(root);
          showToast('Membership Requested', res.message || 'Request sent to the Galaxy Head.', 'success');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });
  }

  // ===========================================================================
  // 6. TEACHER PORTAL (/teacher)
  // ===========================================================================
  function renderTeacherPortal(root) {
    if (state.user.role !== 'teacher' && state.user.role !== 'admin') {
      root.innerHTML = `
        <div class="page-wrap">
          <div class="cosmic-card" style="text-align:center; padding:48px;">
            <h2 style="font-size:22px; margin-bottom:10px;">Galaxy Mentor Access Required</h2>
            <p style="color:var(--text-secondary); margin-bottom:20px;">Students cannot approve missions, create galaxies, or build constellations. Sign in with a Teacher account to access Mentor controls.</p>
          </div>
        </div>
      `;
      return;
    }

    const pendingMissions = state.missions.filter((m) => m.status === 'Submitted' || m.status === 'Under Review');

    root.innerHTML = `
      <div class="page-wrap">
        <div class="page-hero">
          <div>
            <div class="hero-eyebrow">GALAXY MENTOR PORTAL</div>
            <h1 class="hero-title">Teacher Portal</h1>
            <p class="hero-desc">Review student submissions in Mission Control, charter new school club Galaxies, and connect related Stars into Constellations.</p>
          </div>
        </div>

        <div class="cosmic-tabs">
          <button class="tab-btn ${state.teacherTab === 'mission-control' ? 'active' : ''}" data-t-tab="mission-control">
            Mission Control (${pendingMissions.length} Pending)
          </button>
          <button class="tab-btn ${state.teacherTab === 'galaxy-studio' ? 'active' : ''}" data-t-tab="galaxy-studio">
            Galaxy Studio (${state.universe.galaxies.length})
          </button>
          <button class="tab-btn ${state.teacherTab === 'constellation-creator' ? 'active' : ''}" data-t-tab="constellation-creator">
            Constellation Creator (${state.universe.constellations.length})
          </button>
          <button class="tab-btn ${state.teacherTab === 'students' ? 'active' : ''}" data-t-tab="students">
            Student Accounts
          </button>
          <button class="tab-btn ${state.teacherTab === 'requests' ? 'active' : ''}" data-t-tab="requests">
            Membership Requests (${state.membershipRequests.length})
          </button>
        </div>

        <div id="teacher-tab-content"></div>
      </div>
    `;

    root.querySelectorAll('[data-t-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.teacherTab = btn.getAttribute('data-t-tab');
        renderSidebar();
        renderTeacherPortal(root);
      });
    });

    const tabContainer = document.getElementById('teacher-tab-content');
    if (state.teacherTab === 'mission-control') {
      renderTeacherMissionControl(tabContainer);
    } else if (state.teacherTab === 'galaxy-studio') {
      renderTeacherGalaxyStudio(tabContainer);
    } else if (state.teacherTab === 'constellation-creator') {
      renderTeacherConstellationCreator(tabContainer);
    } else if (state.teacherTab === 'students') {
      renderTeacherStudentManagement(tabContainer);
    } else if (state.teacherTab === 'requests') {
      renderTeacherMembershipRequests(tabContainer);
    }
  }

  function renderTeacherMembershipRequests(container) {
    const reqs = state.membershipRequests || [];
    container.innerHTML = `
      <div class="cosmic-card">
        <h3 style="font-size:17.5px; font-weight:600; margin-bottom:14px;">Pending Galaxy Membership Requests (${reqs.length})</h3>
        ${
          reqs.length === 0
            ? `<div style="color:var(--text-secondary); font-size:13px; padding:18px 0;">No pending membership requests for your galaxies.</div>`
            : `<div class="cosmic-table-wrap">
                <table class="cosmic-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Galaxy</th>
                      <th>Requested</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${reqs
                      .map(
                        (r) => `
                      <tr>
                        <td>
                          <div style="font-weight:500;">${escapeHtml(r.student_name)}</div>
                          <div style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(r.student_email || '')} · ${escapeHtml(r.student_grade || '')}</div>
                        </td>
                        <td>${escapeHtml(r.galaxy_name)}</td>
                        <td style="font-size:12px; color:var(--text-secondary);">${r.joined_at ? new Date(r.joined_at).toLocaleDateString() : 'Pending'}</td>
                        <td>
                          <div style="display:flex; gap:6px;">
                            <button class="btn btn-primary btn-sm" data-req-gal="${r.galaxy_id}" data-req-stu="${r.student_id}" data-req-act="approve">Approve</button>
                            <button class="btn btn-danger btn-sm" data-req-gal="${r.galaxy_id}" data-req-stu="${r.student_id}" data-req-act="reject">Reject</button>
                          </div>
                        </td>
                      </tr>
                    `
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>`
        }
      </div>
    `;

    container.querySelectorAll('[data-req-act]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const gId = btn.getAttribute('data-req-gal');
        const sId = btn.getAttribute('data-req-stu');
        const action = btn.getAttribute('data-req-act');
        try {
          const res = await api(`/api/galaxies/${gId}/requests/${sId}`, {
            method: 'POST',
            body: JSON.stringify({ action }),
          });
          await refreshUniverseData();
          renderTeacherPortal(document.getElementById('view-root'));
          showToast(action === 'approve' ? 'Request Approved' : 'Request Rejected', res.message || `Membership ${action}ed.`, 'info');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });
  }

  function renderTeacherMissionControl(container) {
    const awaiting = state.missions.filter((m) => m.status === 'Submitted' || m.status === 'Under Review' || m.status === 'Changes Requested');
    if (awaiting.length === 0) {
      container.innerHTML = `<div class="cosmic-card" style="text-align:center; padding:36px; color:var(--text-secondary);">No pending missions awaiting review in your galaxy.</div>`;
      return;
    }
    container.innerHTML = `
      <div class="grid-2">
        ${awaiting
          .map(
            (m) => `
          <div class="cosmic-card" style="display:flex; flex-direction:column; justify-content:space-between; gap:16px;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="status-pill status-${m.status.replace(/\s+/g, '-')}">${escapeHtml(m.status)}</span>
                <span style="font-size:12px; color:${m.galaxy_color || '#7CC4FA'}; font-weight:500;">${escapeHtml(m.galaxy_name)}</span>
              </div>
              <h3 style="font-size:18px; font-weight:600; margin-bottom:4px;">${escapeHtml(m.title)}</h3>
              <div style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">
                Explorer: <strong style="color:var(--text-secondary);">${escapeHtml(m.student_name)}</strong> (${escapeHtml(m.student_grade || 'Student')}) · ${escapeHtml(m.category)}
              </div>
              <p style="font-size:13.5px; color:var(--text-secondary); margin-bottom:10px;">${escapeHtml(m.description)}</p>
              <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
                ${
                  m.github_url
                    ? `<a href="${escapeHtml(m.github_url)}" target="_blank" class="btn btn-ghost btn-sm">Source Code</a>`
                    : ''
                }
                ${
                  m.live_url
                    ? `<a href="${escapeHtml(m.live_url)}" target="_blank" class="btn btn-ghost btn-sm">Live Demo</a>`
                    : ''
                }
                ${(m.attachments || [])
                  .map((a) => a.url ? `<a href="${escapeHtml(a.url)}" target="_blank" download="${escapeHtml(a.name)}" class="badge badge-bright" style="text-decoration:underline;">${escapeHtml(a.name)} (${escapeHtml(a.size || "")})</a>` : `<span class="badge badge-young">${escapeHtml(a.name)}</span>`)
                  .join('')}
              </div>
            </div>

            <div style="border-top:1px solid var(--border-subtle); padding-top:14px;">
              <label class="form-label" style="margin-bottom:6px; display:block;">Mentor Feedback</label>
              <input type="text" class="form-input" id="rev-fb-${m.id}" placeholder="Enter constructive feedback..." value="${escapeHtml(m.feedback || '')}" style="margin-bottom:10px; font-size:13px;" />
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button class="btn btn-primary btn-sm" data-rev-id="${m.id}" data-rev-act="Approve">
                  Approve & Activate Star
                </button>
                <button class="btn btn-gold btn-sm" data-rev-id="${m.id}" data-rev-act="Request Changes">
                  Request Changes
                </button>
                <button class="btn btn-danger btn-sm" data-rev-id="${m.id}" data-rev-act="Reject">
                  Reject
                </button>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;

    container.querySelectorAll('[data-rev-act]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const mId = btn.getAttribute('data-rev-id');
        const action = btn.getAttribute('data-rev-act');
        const fbInput = document.getElementById(`rev-fb-${mId}`);
        const feedback = fbInput ? fbInput.value : '';

        try {
          const res = await api(`/api/missions/${mId}/review`, {
            method: 'POST',
            body: JSON.stringify({ action, feedback }),
          });
          await refreshUniverseData();
          renderTeacherMissionControl(container);
          if (action === 'Approve' && res.star) {
            triggerStarActivationCeremony(res.star, res.mission);
          } else {
            showToast(`Mission ${action}`, 'Updated status and notified the student.', 'info');
          }
        } catch (err) {
          showToast('Review Error', err.message, 'error');
        }
      });
    });
  }

  function renderTeacherGalaxyStudio(container) {
    container.innerHTML = `
      <div class="grid-2">
        <div class="cosmic-card">
          <h3 style="font-size:17.5px; font-weight:600; margin-bottom:14px;">Create a New Galaxy (Club)</h3>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Galaxy Name *</label>
              <input type="text" class="form-input" id="gal-name" placeholder="e.g., Quantum & Photonics Galaxy" />
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <input type="text" class="form-input" id="gal-cat" placeholder="e.g., Physics & Engineering" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-textarea" id="gal-desc" placeholder="Describe the club's purpose and research focus..."></textarea>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Club Objectives</label>
              <input type="text" class="form-input" id="gal-obj" placeholder="Build experimental optics and simulations" />
            </div>
            <div class="form-group">
              <label class="form-label">Grade Eligibility</label>
              <input type="text" class="form-input" id="gal-grades" value="Grades 8 - 12" />
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Meeting Schedule</label>
              <input type="text" class="form-input" id="gal-meet" value="Wednesdays, 15:45 IST · Innovation Lab" />
            </div>
            <div class="form-group">
              <label class="form-label">Celestial Morphology</label>
              <select class="form-select" id="gal-visual">
                <option value="spiral">Spiral Formation</option>
                <option value="nebula">Nebula Cloud</option>
                <option value="orbital">Orbital System</option>
                <option value="cluster">Star Cluster</option>
              </select>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Accent Colour</label>
              <input type="color" class="form-input" id="gal-color" value="#4A7DFF" style="height:40px; padding:4px;" />
            </div>
            <div class="form-group">
              <label class="form-label">Membership Rules</label>
              <input type="text" class="form-input" id="gal-rules" value="Open to all curious Explorers" />
            </div>
          </div>
          <button class="btn btn-primary" id="create-galaxy-btn" style="width:100%;">Create Galaxy</button>
        </div>

        <div class="cosmic-card">
          <h3 style="font-size:17.5px; font-weight:600; margin-bottom:14px;">Active Galaxies (${state.universe.galaxies.length})</h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${state.universe.galaxies
              .map(
                (g) => `
              <div style="padding:14px; border-radius:10px; background:rgba(2,4,10,0.55); border:1px solid var(--border-subtle);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-family:var(--font-mono); font-size:10.5px; color:${g.accent_color};">${escapeHtml(g.code)}</span>
                  <span class="badge badge-young">${g.star_count || 0} stars · ${g.member_count || 0} members</span>
                </div>
                <div style="font-family:var(--font-heading); font-size:15.5px; font-weight:600; margin:4px 0;">${escapeHtml(g.name)}</div>
                <div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:8px;">${escapeHtml(g.description)}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; font-size:11.5px; color:var(--text-muted);">
                  <span>Galaxy Head: ${escapeHtml(g.teacher_name || 'Unassigned')}</span>
                  <div style="display:flex; gap:6px;">
                    <button class="btn btn-cyan btn-sm" data-fly-gal="${g.id}">Open on Map</button>
                    ${(state.user.role === 'admin' || !!state.user.full_access || g.teacher_id === state.user.id) ? `<button class="btn btn-ghost btn-sm" data-edit-gal="${g.id}">Edit</button>` : ''}
                    ${(state.user.role === 'admin' || !!state.user.full_access) ? `<button class="btn btn-danger btn-sm" data-del-gal="${g.id}">Delete</button>` : ''}
                  </div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('create-galaxy-btn').addEventListener('click', async () => {
      const name = document.getElementById('gal-name').value.trim();
      const category = document.getElementById('gal-cat').value.trim();
      const description = document.getElementById('gal-desc').value.trim();
      const objectives = document.getElementById('gal-obj').value.trim();
      const grade_eligibility = document.getElementById('gal-grades').value.trim();
      const meeting_info = document.getElementById('gal-meet').value.trim();
      const visual_type = document.getElementById('gal-visual').value;
      const accent_color = document.getElementById('gal-color').value;
      const membership_rules = document.getElementById('gal-rules').value.trim();

      if (!name || !category || !description) {
        showToast('Missing Fields', 'Please enter Galaxy name, category, and description.', 'error');
        return;
      }

      try {
        const res = await api('/api/galaxies', {
          method: 'POST',
          body: JSON.stringify({
            name,
            category,
            description,
            objectives,
            grade_eligibility,
            meeting_info,
            visual_type,
            accent_color,
            membership_rules,
          }),
        });
        await refreshUniverseData();
        renderTeacherGalaxyStudio(container);
        showToast('Galaxy Created', `"${res.galaxy.name}" (${res.galaxy.code}) added to the Cosmic Map.`, 'success');
      } catch (err) {
        showToast('Error', err.message, 'error');
      }
    });

    container.querySelectorAll('[data-fly-gal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        navigate('/cosmic-map', `galaxy=${btn.getAttribute('data-fly-gal')}`);
      });
    });

    container.querySelectorAll('[data-edit-gal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const g = state.universe.galaxies.find((x) => x.id === btn.getAttribute('data-edit-gal'));
        if (g) openEditGalaxyModal(g, () => renderTeacherGalaxyStudio(container));
      });
    });

    container.querySelectorAll('[data-del-gal]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const gId = btn.getAttribute('data-del-gal');
        const g = state.universe.galaxies.find((x) => x.id === gId);
        if (!window.confirm(`Delete galaxy "${g ? g.name : gId}" and all its stars? This cannot be undone.`)) return;
        try {
          await api(`/api/galaxies/${gId}`, { method: 'DELETE' });
          await refreshUniverseData();
          renderTeacherGalaxyStudio(container);
          showToast('Galaxy Deleted', `Removed "${g ? g.name : gId}".`, 'info');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });
  }

  function renderTeacherConstellationCreator(container) {
    const cb = state.constellationBuilder;
    const galStars = state.universe.stars.filter((s) => s.galaxy_id === cb.galaxy_id);

    container.innerHTML = `
      <div class="grid-2">
        <div class="cosmic-card">
          <h3 style="font-size:17.5px; font-weight:600; margin-bottom:6px;">Create Constellation</h3>
          <p style="font-size:12.5px; color:var(--text-secondary); margin-bottom:16px;">
            Select multiple approved Stars within a Galaxy, arrange their positions, and connect them into an official Constellation.
          </p>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Select Galaxy *</label>
              <select class="form-select" id="cb-galaxy-select">
                ${state.universe.galaxies
                  .map(
                    (g) => `<option value="${g.id}" ${cb.galaxy_id === g.id ? 'selected' : ''}>${escapeHtml(g.name)}</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Constellation Name *</label>
              <input type="text" class="form-input" id="cb-name" placeholder="e.g., Neural Networks" value="${escapeHtml(cb.name)}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-textarea" id="cb-desc" placeholder="Explain how these projects relate..." style="min-height:68px;">${escapeHtml(cb.description)}</textarea>
          </div>

          <div class="form-label" style="margin-bottom:8px;">Select Stars to Connect (${cb.selectedStars.length} Selected):</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
            ${
              galStars.length === 0
                ? `<div style="font-size:12.5px; color:var(--text-muted);">No approved stars in this galaxy yet.</div>`
                : galStars
                    .map((s) => {
                      const idx = cb.selectedStars.findIndex((x) => x.star_id === s.id);
                      const isSel = idx !== -1;
                      return `
                        <button class="btn ${isSel ? 'btn-cyan' : 'btn-ghost'} btn-sm" data-toggle-cb-star="${s.id}">
                          ${isSel ? `<span class="stat-num" style="color:var(--accent-amber);">#${idx + 1}</span>` : ''}
                          <span>${escapeHtml(s.title)}</span>
                        </button>
                      `;
                    })
                    .join('')
            }
          </div>

          <div class="form-label" style="margin-bottom:6px;">Constellation Layout (Drag stars to position):</div>
          <div class="constellation-builder-canvas" id="cb-preview-wrap">
            <canvas id="cb-canvas" width="540" height="360" style="width:100%; height:100%; display:block;"></canvas>
          </div>

          <button class="btn btn-primary" id="publish-constellation-btn" style="width:100%; margin-top:16px;">
            Publish Constellation
          </button>
        </div>

        <div class="cosmic-card">
          <h3 style="font-size:17.5px; font-weight:600; margin-bottom:14px;">Published Constellations (${state.universe.constellations.length})</h3>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${state.universe.constellations
              .map(
                (c) => `
              <div class="cosmic-card" style="padding:15px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-family:var(--font-heading); font-weight:600; font-size:15.5px; color:var(--text-primary);">${escapeHtml(c.name)}</span>
                  <span class="badge badge-young">${escapeHtml(c.galaxy_name)}</span>
                </div>
                <p style="font-size:12.5px; color:var(--text-secondary); margin:6px 0 10px;">${escapeHtml(c.description)}</p>
                <div style="font-size:11.5px; color:var(--accent-ice); margin-bottom:10px;">
                  ${(c.stars || []).map((s) => escapeHtml(s.star_title)).join(' — ')}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:11px; color:var(--text-muted);">Curated by ${escapeHtml(c.teacher_name)}</span>
                  <div style="display:flex; gap:8px;">
                    <button class="btn btn-cyan btn-sm" data-view-con-map="${c.id}" data-view-con-gal="${c.galaxy_id}">View on Map</button>
                    <button class="btn btn-danger btn-sm" data-del-con="${c.id}">Delete</button>
                  </div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    drawConstellationBuilderCanvas();

    document.getElementById('cb-galaxy-select').addEventListener('change', (e) => {
      cb.galaxy_id = e.target.value;
      cb.selectedStars = [];
      renderTeacherConstellationCreator(container);
    });

    document.getElementById('cb-name').addEventListener('input', (e) => (cb.name = e.target.value));
    document.getElementById('cb-desc').addEventListener('input', (e) => (cb.description = e.target.value));

    container.querySelectorAll('[data-toggle-cb-star]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sId = btn.getAttribute('data-toggle-cb-star');
        const st = galStars.find((x) => x.id === sId);
        const existingIdx = cb.selectedStars.findIndex((x) => x.star_id === sId);
        if (existingIdx !== -1) {
          cb.selectedStars.splice(existingIdx, 1);
        } else if (st) {
          const n = cb.selectedStars.length;
          cb.selectedStars.push({
            star_id: st.id,
            title: st.title,
            coord_x: 18 + ((n * 23) % 68),
            coord_y: 25 + ((n * 31) % 55),
          });
        }
        renderTeacherConstellationCreator(container);
      });
    });

    document.getElementById('publish-constellation-btn').addEventListener('click', async () => {
      if (!cb.name.trim() || cb.selectedStars.length < 2) {
        showToast('Incomplete', 'Provide a name and select at least 2 approved Stars.', 'error');
        return;
      }
      try {
        await api('/api/constellations', {
          method: 'POST',
          body: JSON.stringify({
            galaxy_id: cb.galaxy_id,
            name: cb.name,
            description: cb.description,
            color: '#7CC4FA',
            stars: cb.selectedStars,
          }),
        });
        cb.name = '';
        cb.description = '';
        cb.selectedStars = [];
        await refreshUniverseData();
        renderTeacherConstellationCreator(container);
        showToast('Constellation Published', 'Your constellation is now live on the Cosmic Map.', 'gold');
      } catch (err) {
        showToast('Error', err.message, 'error');
      }
    });

    container.querySelectorAll('[data-view-con-map]').forEach((btn) => {
      btn.addEventListener('click', () => {
        navigate(
          '/cosmic-map',
          `galaxy=${btn.getAttribute('data-view-con-gal')}&constellation=${btn.getAttribute('data-view-con-map')}`
        );
      });
    });

    container.querySelectorAll('[data-del-con]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await api(`/api/constellations/${btn.getAttribute('data-del-con')}`, { method: 'DELETE' });
        await refreshUniverseData();
        renderTeacherConstellationCreator(container);
        showToast('Constellation Removed', 'Deleted constellation.', 'info');
      });
    });
  }

  function drawConstellationBuilderCanvas() {
    const canvas = document.getElementById('cb-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const nodes = state.constellationBuilder.selectedStars;
    let draggingNode = null;

    function render() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(140, 162, 200, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 40; x < w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 40; y < h; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (nodes.length === 0) {
        ctx.fillStyle = 'rgba(148, 166, 200, 0.5)';
        ctx.font = '500 12px "Orbitron", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Select 2 or more Stars above to plot constellation lines', w / 2, h / 2);
        return;
      }

      if (nodes.length >= 2) {
        ctx.strokeStyle = '#7CC4FA';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        nodes.forEach((n, idx) => {
          const px = (n.coord_x / 100) * w;
          const py = (n.coord_y / 100) * h;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      nodes.forEach((n, idx) => {
        const px = (n.coord_x / 100) * w;
        const py = (n.coord_y / 100) * h;

        if (window.drawAstronomicalStar) {
          window.drawAstronomicalStar(ctx, px, py, 4.2, '#7CC4FA', true, 1);
        }

        ctx.fillStyle = '#EEF2FF';
        ctx.font = '500 11px "Orbitron", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${idx + 1}. ${n.title.slice(0, 22)}`, px, py - 15);
      });
    }

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const my = ((e.clientY - rect.top) / rect.height) * canvas.height;
      for (const n of nodes) {
        const px = (n.coord_x / 100) * canvas.width;
        const py = (n.coord_y / 100) * canvas.height;
        if (Math.hypot(mx - px, my - py) < 22) {
          draggingNode = n;
          break;
        }
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!draggingNode) return;
      const rect = canvas.getBoundingClientRect();
      draggingNode.coord_x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
      draggingNode.coord_y = Math.max(12, Math.min(88, ((e.clientY - rect.top) / rect.height) * 100));
      render();
    });

    window.addEventListener('mouseup', () => {
      draggingNode = null;
    });

    render();
  }

  function renderTeacherStudentManagement(container) {
    const students = state.adminData.students || [];
    container.innerHTML = `
      <div class="grid-2">
        <div class="cosmic-card">
          <h3 style="font-size:17.5px; font-weight:600; margin-bottom:14px;">Register Student Account</h3>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Student Full Name *</label>
              <input type="text" class="form-input" id="tch-stu-name" placeholder="e.g., Meenakshi Sundaram" />
            </div>
            <div class="form-group">
              <label class="form-label">School Email Address *</label>
              <input type="email" class="form-input" id="tch-stu-email" placeholder="meenakshi@raksomniverse.edu" />
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Grade / Class</label>
              <input type="text" class="form-input" id="tch-stu-grade" value="Grade 11" />
            </div>
            <div class="form-group">
              <label class="form-label">Section</label>
              <input type="text" class="form-input" id="tch-stu-sec" value="A (Cambridge AS)" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Initial Galaxy Membership</label>
            <select class="form-select" id="tch-stu-gal">
              ${state.universe.galaxies.map((g) => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-primary" id="tch-create-student-btn" style="width:100%;">Create Student Account</button>
        </div>

        <div class="cosmic-card">
          <h3 style="font-size:17.5px; font-weight:600; margin-bottom:14px;">Registered Students (${students.length})</h3>
          <div class="cosmic-table-wrap">
            <table class="cosmic-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Galaxies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${students
                  .map((s) => {
                    const isOwner = state.user.role === 'admin' || s.created_by === state.user.id;
                    const mems = s.memberships || [];
                    return `
                  <tr>
                    <td>
                      <div style="font-weight:500;">${escapeHtml(s.name)}</div>
                      <div style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(s.email)}</div>
                    </td>
                    <td>${escapeHtml(s.grade || '')} ${escapeHtml(s.section || '')}</td>
                    <td>
                      ${
                        mems.length === 0
                          ? `<span style="font-size:11.5px; color:var(--text-muted);">None</span>`
                          : `<div style="display:flex; flex-direction:column; gap:4px;">
                              ${mems
                                .map((m) => {
                                  const gal = state.universe.galaxies.find((g) => g.id === m.galaxy_id);
                                  const canRemove = isOwner || (gal && gal.teacher_id === state.user.id);
                                  return `
                                    <div style="display:flex; align-items:center; gap:6px; font-size:11.5px;">
                                      <span>${escapeHtml(m.galaxy_name.replace(' Galaxy', ''))}</span>
                                      ${
                                        canRemove
                                          ? `<button class="btn btn-danger btn-sm" style="padding:1px 6px; font-size:10px;" data-tch-rem-gal="${m.galaxy_id}" data-tch-rem-stu="${s.id}">Remove</button>`
                                          : ''
                                      }
                                    </div>
                                  `;
                                })
                                .join('')}
                            </div>`
                      }
                    </td>
                    <td>
                      <span class="status-pill ${s.account_status === 'active' ? 'status-Approved' : 'status-Rejected'}">
                        ${escapeHtml(s.account_status || 'active')}
                      </span>
                    </td>
                    <td>
                      ${
                        isOwner
                          ? `<button class="btn btn-ghost btn-sm" data-tch-toggle-stu="${s.id}" data-cur-status="${s.account_status || 'active'}">
                              ${(s.account_status || 'active') === 'active' ? 'Suspend' : 'Activate'}
                            </button>`
                          : `<span style="font-size:11px; color:var(--text-muted);">Created by another mentor</span>`
                      }
                    </td>
                  </tr>
                `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-tch-toggle-stu]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const uId = btn.getAttribute('data-tch-toggle-stu');
        const cur = btn.getAttribute('data-cur-status');
        const nextStatus = cur === 'active' ? 'deactivated' : 'active';
        try {
          await api(`/api/users/${uId}`, {
            method: 'PUT',
            body: JSON.stringify({ account_status: nextStatus }),
          });
          await refreshUniverseData();
          renderTeacherStudentManagement(container);
          showToast('Status Updated', `Student account set to ${nextStatus}.`, 'info');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });

    container.querySelectorAll('[data-tch-rem-gal]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const galaxy_id = btn.getAttribute('data-tch-rem-gal');
        const sId = btn.getAttribute('data-tch-rem-stu');
        try {
          const res = await api(`/api/users/${sId}/remove-galaxy`, {
            method: 'POST',
            body: JSON.stringify({ galaxy_id }),
          });
          await refreshUniverseData();
          renderTeacherStudentManagement(container);
          showToast('Removed from Galaxy', res.message || 'Student removed from galaxy.', 'info');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });

    document.getElementById('tch-create-student-btn').addEventListener('click', async () => {
      const name = document.getElementById('tch-stu-name').value.trim();
      const email = document.getElementById('tch-stu-email').value.trim();
      const grade = document.getElementById('tch-stu-grade').value.trim();
      const section = document.getElementById('tch-stu-sec').value.trim();
      const galaxy_id = document.getElementById('tch-stu-gal').value;

      if (!name || !email) {
        showToast('Validation Error', 'Student name and email are required.', 'error');
        return;
      }
      try {
        const res = await api('/api/users/students', {
          method: 'POST',
          body: JSON.stringify({ name, email, grade, section, galaxy_id }),
        });
        const authMe = await api('/api/auth/me');
        state.demoUsers = authMe.demoUsers || [];
        await refreshUniverseData();
        renderTopbar();
        renderTeacherStudentManagement(container);
        showToast('Student Account Created', `Registered ${res.student.name}`, 'success');
      } catch (err) {
        showToast('Error', err.message, 'error');
      }
    });
  }

  // ===========================================================================
  // 7. ADMINISTRATION PORTAL (/admin)
  // ===========================================================================
  function renderAdminPortal(root) {
    if (state.user.role !== 'admin') {
      root.innerHTML = `
        <div class="page-wrap">
          <div class="cosmic-card" style="text-align:center; padding:48px;">
            <h2 style="font-size:22px; margin-bottom:10px;">Administrator Access Required</h2>
            <p style="color:var(--text-secondary); margin-bottom:20px;">Sign in as Swetha (Admin) to access Universe Administration.</p>
            <button class="btn btn-gold" id="switch-to-admin-btn">Switch to Administrator</button>
          </div>
        </div>
      `;
      document.getElementById('switch-to-admin-btn').addEventListener('click', () => switchAccount('usr-admin-1'));
      return;
    }

    const st = state.universe.stats;

    root.innerHTML = `
      <div class="page-wrap">
        <div class="page-hero">
          <div>
            <div class="hero-eyebrow">UNIVERSE ADMINISTRATION</div>
            <h1 class="hero-title">Administration Portal</h1>
            <p class="hero-desc">Manage teacher and student accounts, monitor galaxy activity, configure progression thresholds, and review submissions.</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Students</div>
            <div class="stat-value">${st.total_students || 0}</div>
            <div class="stat-sub">Active Explorers</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Teachers</div>
            <div class="stat-value">${st.total_teachers || 0}</div>
            <div class="stat-sub">Galaxy Mentors</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Galaxies</div>
            <div class="stat-value">${st.total_galaxies || 0}</div>
            <div class="stat-sub">Active Clubs</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Approved Stars</div>
            <div class="stat-value">${st.total_stars || 0}</div>
            <div class="stat-sub">${st.total_supernovas || 0} Supernovas</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Pending Missions</div>
            <div class="stat-value" style="color:var(--accent-amber);">${st.total_pending_missions || 0}</div>
            <div class="stat-sub">Awaiting Review</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Constellations</div>
            <div class="stat-value">${st.total_constellations || 0}</div>
            <div class="stat-sub">Connected Formations</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Sparks</div>
            <div class="stat-value" style="color:var(--accent-ice);">${st.total_sparks || 0}</div>
            <div class="stat-sub">Stellar Energy</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Active Comets</div>
            <div class="stat-value">${st.total_comets || 0}</div>
            <div class="stat-sub">Scheduled Events</div>
          </div>
        </div>

        <div class="cosmic-tabs">
          <button class="tab-btn ${state.adminTab === 'analytics' ? 'active' : ''}" data-a-tab="analytics">
            Platform Analytics
          </button>
          <button class="tab-btn ${state.adminTab === 'teachers' ? 'active' : ''}" data-a-tab="teachers">
            Teacher Accounts (${(state.adminData.teachers || []).length})
          </button>
          <button class="tab-btn ${state.adminTab === 'students' ? 'active' : ''}" data-a-tab="students">
            Student Accounts (${(state.adminData.students || []).length})
          </button>
          <button class="tab-btn ${state.adminTab === 'moderation' ? 'active' : ''}" data-a-tab="moderation">
            Moderation & Activity
          </button>
        </div>

        <div id="admin-tab-body"></div>
      </div>
    `;

    root.querySelectorAll('[data-a-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.adminTab = btn.getAttribute('data-a-tab');
        renderSidebar();
        renderAdminPortal(root);
      });
    });

    const body = document.getElementById('admin-tab-body');
    if (state.adminTab === 'analytics') {
      renderAdminAnalytics(body);
    } else if (state.adminTab === 'teachers') {
      renderAdminTeachers(body);
    } else if (state.adminTab === 'students') {
      renderAdminStudents(body);
    } else if (state.adminTab === 'moderation') {
      renderAdminModeration(body);
    }
  }

  function renderAdminAnalytics(container) {
    const galaxies = state.universe.galaxies;
    const maxEnergy = Math.max(1, ...galaxies.map((g) => g.total_energy || 0));
    const t = state.universe.thresholds || { bright: 2, radiant: 4, supernova: 6 };

    container.innerHTML = `
      <div class="grid-2">
        <div class="cosmic-card">
          <h3 style="font-size:17px; font-weight:600; margin-bottom:16px;">Galaxy Engagement & Stellar Energy</h3>
          <div style="display:flex; flex-direction:column; gap:14px;">
            ${galaxies
              .map((g) => {
                const pct = Math.max(6, Math.round(((g.total_energy || 0) / maxEnergy) * 100));
                return `
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px;">
                      <span><strong style="color:var(--text-primary);">${escapeHtml(g.name)}</strong> <span style="color:var(--text-muted);">(${escapeHtml(g.teacher_name || '')})</span></span>
                      <span class="stat-num" style="color:var(--text-secondary);">${g.star_count || 0} stars · ${g.total_energy || 0} sparks</span>
                    </div>
                    <div style="height:6px; border-radius:999px; background:rgba(255,255,255,0.06); overflow:hidden;">
                      <div style="width:${pct}%; height:100%; background:${g.accent_color}; border-radius:999px;"></div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <div class="cosmic-card">
          <h3 style="font-size:17px; font-weight:600; margin-bottom:8px;">Star Classification Thresholds</h3>
          <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">
            Configure the unique Spark thresholds required for approved Stars to progress from Young Star to Bright Star, Radiant Star, and Supernova.
          </p>
          <div class="grid-3" style="grid-template-columns:repeat(3,1fr); gap:12px;">
            <div class="form-group">
              <label class="form-label">Bright Star</label>
              <input type="number" min="1" class="form-input" id="thr-bright" value="${t.bright}" />
            </div>
            <div class="form-group">
              <label class="form-label">Radiant Star</label>
              <input type="number" min="2" class="form-input" id="thr-radiant" value="${t.radiant}" />
            </div>
            <div class="form-group">
              <label class="form-label">Supernova</label>
              <input type="number" min="3" class="form-input" id="thr-supernova" value="${t.supernova}" />
            </div>
          </div>
          <button class="btn btn-primary" id="save-thresholds-btn" style="width:100%; margin-top:6px;">
            Save Thresholds
          </button>
        </div>
      </div>

      <div class="cosmic-card" style="margin-top:20px;">
        <h3 style="font-size:17px; font-weight:600; margin-bottom:8px;">Galaxy Head Assignments</h3>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:14px;">
          Assign the Galaxy Head responsible for approving or rejecting student membership requests in each galaxy.
        </p>
        <div class="cosmic-table-wrap">
          <table class="cosmic-table">
            <thead>
              <tr>
                <th>Galaxy</th>
                <th>Assigned Galaxy Head</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${galaxies
                .map(
                  (g) => `
                <tr>
                  <td><strong>${escapeHtml(g.name)}</strong></td>
                  <td>
                    <select class="form-select" data-head-gal="${g.id}" style="max-width:260px;">
                      <option value="" ${!g.teacher_id ? 'selected' : ''}>Unassigned</option>
                      ${(state.adminData.teachers || [])
                        .map(
                          (tch) => `<option value="${tch.id}" ${g.teacher_id === tch.id ? 'selected' : ''}>${escapeHtml(tch.name)}</option>`
                        )
                        .join('')}
                    </select>
                  </td>
                  <td>
                    <button class="btn btn-cyan btn-sm" data-save-head="${g.id}">Save</button>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-save-head]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const gId = btn.getAttribute('data-save-head');
        const sel = container.querySelector(`[data-head-gal="${gId}"]`);
        const teacher_id = sel ? (sel.value || null) : null;
        try {
          await api(`/api/galaxies/${gId}`, {
            method: 'PUT',
            body: JSON.stringify({ teacher_id }),
          });
          await refreshUniverseData();
          renderAdminAnalytics(container);
          showToast('Galaxy Head Updated', 'Assigned new Galaxy Head for membership approvals.', 'success');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });

    document.getElementById('save-thresholds-btn').addEventListener('click', async () => {
      const bright = parseInt(document.getElementById('thr-bright').value, 10);
      const radiant = parseInt(document.getElementById('thr-radiant').value, 10);
      const supernova = parseInt(document.getElementById('thr-supernova').value, 10);
      await api('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ bright, radiant, supernova }),
      });
      await refreshUniverseData();
      renderAdminPortal(document.getElementById('view-root'));
      showToast('Thresholds Saved', 'All Star classifications recalculated.', 'success');
    });
  }

  function renderAdminTeachers(container) {
    const teachers = state.adminData.teachers || [];
    container.innerHTML = `
      <div class="grid-2">
        <div class="cosmic-card">
          <h3 style="font-size:17px; font-weight:600; margin-bottom:14px;">Create Teacher Account</h3>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="adm-tch-name" placeholder="e.g., Dr. Nandini Subramanian" />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" class="form-input" id="adm-tch-email" placeholder="nandini.s@raksomniverse.edu" />
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Teacher ID</label>
              <input type="text" class="form-input" id="adm-tch-code" placeholder="TCH-BIO-107" />
            </div>
            <div class="form-group">
              <label class="form-label">Default Password</label>
              <input type="text" class="form-input" id="adm-tch-pwd" value="raks123" />
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Department *</label>
              <input type="text" class="form-input" id="adm-tch-dept" placeholder="e.g., Synthetic Biology" />
            </div>
            <div class="form-group">
              <label class="form-label">Assign as Galaxy Head (Optional — overrides current head)</label>
              <select class="form-select" id="adm-tch-gal">
                <option value="">Unassigned</option>
                ${state.universe.galaxies.map((g) => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('')}
              </select>
            </div>
          </div>
          <button class="btn btn-primary" id="adm-create-teacher-btn" style="width:100%;">
            Create Teacher Account
          </button>
        </div>

        <div class="cosmic-card">
          <h3 style="font-size:17px; font-weight:600; margin-bottom:14px;">Registered Teachers (${teachers.length})</h3>
          <div class="cosmic-table-wrap">
            <table class="cosmic-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Department & Galaxies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${teachers
                  .map(
                    (t) => `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                        <span style="font-weight:500;">${escapeHtml(t.name)}</span>
                        ${t.full_access ? `<span class="badge badge-supernova">Full Access</span>` : ''}
                      </div>
                      <div style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">${escapeHtml(t.teacher_code || 'TCH')} · ${escapeHtml(t.email)}</div>
                    </td>
                    <td>
                      <div style="font-size:12.5px;">${escapeHtml(t.department || '')}</div>
                      <div style="font-size:11px; color:var(--text-secondary);">Galaxies: ${escapeHtml(t.assigned_galaxies || 'Unassigned')}</div>
                    </td>
                    <td>
                      <span class="status-pill ${t.account_status === 'active' ? 'status-Approved' : 'status-Rejected'}">
                        ${escapeHtml(t.account_status)}
                      </span>
                    </td>
                    <td>
                      <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="btn ${t.full_access ? 'btn-gold' : 'btn-ghost'} btn-sm" data-toggle-full-access="${t.id}" data-cur-fa="${t.full_access ? '1' : '0'}">
                          ${t.full_access ? 'Revoke Full Access' : 'Full Access'}
                        </button>
                        <button class="btn btn-ghost btn-sm" data-toggle-user="${t.id}" data-cur-status="${t.account_status}">
                          ${t.account_status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button class="btn btn-cyan btn-sm" data-reset-pwd="${t.id}">Reset Pwd</button>
                        <button class="btn btn-danger btn-sm" data-delete-user="${t.id}" data-user-name="${escapeHtml(t.name)}" data-user-role="teacher">Delete</button>
                      </div>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('adm-create-teacher-btn').addEventListener('click', async () => {
      const name = document.getElementById('adm-tch-name').value.trim();
      const email = document.getElementById('adm-tch-email').value.trim();
      const teacher_code = document.getElementById('adm-tch-code').value.trim();
      const password = document.getElementById('adm-tch-pwd').value.trim();
      const department = document.getElementById('adm-tch-dept').value.trim();
      const galaxy_id = document.getElementById('adm-tch-gal').value || null;

      if (!name || !email) {
        showToast('Validation Error', 'Teacher name and email address are required.', 'error');
        return;
      }

      try {
        const res = await api('/api/users/teachers', {
          method: 'POST',
          body: JSON.stringify({ name, email, teacher_code, password, department, galaxy_id }),
        });
        const authMe = await api('/api/auth/me');
        state.demoUsers = authMe.demoUsers || [];
        await refreshUniverseData();
        renderTopbar();
        renderAdminTeachers(container);
        showToast('Teacher Account Created', `Provisioned ${res.teacher.name} (${res.teacher.teacher_code}).`, 'success');
      } catch (err) {
        showToast('Error', err.message, 'error');
      }
    });

    container.querySelectorAll('[data-toggle-full-access]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const uId = btn.getAttribute('data-toggle-full-access');
        const nextFa = btn.getAttribute('data-cur-fa') === '1' ? 0 : 1;
        try {
          await api(`/api/users/${uId}`, {
            method: 'PUT',
            body: JSON.stringify({ full_access: nextFa }),
          });
          await refreshUniverseData();
          renderAdminTeachers(container);
          showToast('Permissions Updated', nextFa ? 'Teacher granted Full Access across all galaxies and stars.' : 'Teacher Full Access revoked.', 'gold');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });

    bindUserStatusButtons(container, () => renderAdminTeachers(container));
  }

  function renderAdminStudents(container) {
    const students = state.adminData.students || [];
    container.innerHTML = `
      <div class="cosmic-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <h3 style="font-size:17px; font-weight:600;">Registered Students (${students.length})</h3>
          <input type="text" class="form-input" id="adm-stu-search" placeholder="Search by name, email, grade, or section..." style="max-width:300px;" />
        </div>
        <div class="cosmic-table-wrap">
          <table class="cosmic-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade & Section</th>
                <th>Galaxy Memberships</th>
                <th>Missions & Stars</th>
                <th>Sparks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${students
                .map(
                  (s) => `
                <tr data-stu-row="${escapeHtml((s.name + ' ' + s.email + ' ' + s.grade + ' ' + s.section).toLowerCase())}">
                  <td>
                    <div style="font-weight:500;">${escapeHtml(s.name)}</div>
                    <div style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(s.email)}</div>
                  </td>
                  <td>${escapeHtml(s.grade || 'Grade 11')} · ${escapeHtml(s.section || 'A')}</td>
                  <td>
                    ${
                      (s.memberships || []).length === 0
                        ? `<span style="font-size:11.5px; color:var(--text-muted);">None</span>`
                        : `<div style="display:flex; flex-direction:column; gap:4px;">
                            ${(s.memberships || [])
                              .map(
                                (m) => `
                              <div style="display:flex; align-items:center; gap:6px; font-size:11.5px;">
                                <span>${escapeHtml(m.galaxy_name.replace(' Galaxy', ''))}</span>
                                <button class="btn btn-danger btn-sm" style="padding:1px 6px; font-size:10px;" data-adm-rem-gal="${m.galaxy_id}" data-adm-rem-stu="${s.id}">Remove</button>
                              </div>
                            `
                              )
                              .join('')}
                          </div>`
                    }
                  </td>
                  <td class="stat-num">${s.mission_count || 0} missions · ${s.star_count || 0} stars</td>
                  <td class="stat-num" style="color:var(--accent-amber);">${s.total_sparks_received || 0}</td>
                  <td>
                    <span class="status-pill ${s.account_status === 'active' ? 'status-Approved' : 'status-Rejected'}">
                      ${escapeHtml(s.account_status)}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button class="btn btn-ghost btn-sm" data-toggle-user="${s.id}" data-cur-status="${s.account_status}">
                        ${s.account_status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button class="btn btn-cyan btn-sm" data-reset-pwd="${s.id}">Reset</button>
                      <button class="btn btn-danger btn-sm" data-delete-user="${s.id}" data-user-name="${escapeHtml(s.name)}" data-user-role="student">Delete</button>
                    </div>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-adm-rem-gal]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const galaxy_id = btn.getAttribute('data-adm-rem-gal');
        const sId = btn.getAttribute('data-adm-rem-stu');
        try {
          const res = await api(`/api/users/${sId}/remove-galaxy`, {
            method: 'POST',
            body: JSON.stringify({ galaxy_id }),
          });
          await refreshUniverseData();
          renderAdminStudents(container);
          showToast('Removed from Galaxy', res.message || 'Student removed from galaxy.', 'info');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });

    document.getElementById('adm-stu-search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      container.querySelectorAll('[data-stu-row]').forEach((row) => {
        const hay = row.getAttribute('data-stu-row');
        row.style.display = !q || hay.includes(q) ? '' : 'none';
      });
    });

    bindUserStatusButtons(container, () => renderAdminStudents(container));
  }

  function bindUserStatusButtons(container, rerender) {
    container.querySelectorAll('[data-toggle-user]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const uId = btn.getAttribute('data-toggle-user');
        const cur = btn.getAttribute('data-cur-status');
        const nextStatus = cur === 'active' ? 'deactivated' : 'active';
        await api(`/api/users/${uId}`, {
          method: 'PUT',
          body: JSON.stringify({ account_status: nextStatus }),
        });
        await refreshUniverseData();
        rerender();
        showToast('Status Updated', `Account set to ${nextStatus}.`, 'info');
      });
    });

    container.querySelectorAll('[data-reset-pwd]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const uId = btn.getAttribute('data-reset-pwd');
        await api(`/api/users/${uId}`, {
          method: 'PUT',
          body: JSON.stringify({ reset_password: 'omniverse2050' }),
        });
        showToast('Password Reset', 'Temporary password reset to omniverse2050.', 'success');
      });
    });

    container.querySelectorAll('[data-delete-user]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const uId = btn.getAttribute('data-delete-user');
        const uName = btn.getAttribute('data-user-name') || 'this user';
        const uRole = btn.getAttribute('data-user-role') || 'account';
        if (!window.confirm('Permanently delete ' + uRole + ' account ' + uName + '? This cannot be undone.')) return;
        try {
          await api(`/api/users/${uId}`, { method: 'DELETE' });
          const authMe = await api('/api/auth/me');
          state.demoUsers = authMe.demoUsers || [];
          await refreshUniverseData();
          renderAdminPortal(document.getElementById('view-root'));
          showToast('Account Deleted', `Removed ${uRole} account ${uName}.`, 'info');
        } catch (err) {
          showToast('Error', err.message, 'error');
        }
      });
    });
  }

  function renderAdminModeration(container) {
    const logs = state.adminData.logs || [];
    container.innerHTML = `
      <div class="grid-2">
        <div class="cosmic-card">
          <h3 style="font-size:17px; font-weight:600; margin-bottom:14px;">Submission Moderation (${state.missions.length})</h3>
          <div style="display:flex; flex-direction:column; gap:8px; max-height:500px; overflow-y:auto;">
            ${state.missions
              .map(
                (m) => `
              <div style="padding:12px 14px; border-radius:8px; background:rgba(2,4,10,0.6); border:1px solid ${
                m.flagged ? '#E06C75' : 'var(--border-subtle)'
              }; display:flex; justify-content:space-between; align-items:center; gap:12px;">
                <div>
                  <div style="font-weight:500; font-size:13.5px;">
                    ${m.flagged ? '[Flagged] ' : ''}${escapeHtml(m.title)}
                  </div>
                  <div style="font-size:11.5px; color:var(--text-secondary);">
                    ${escapeHtml(m.student_name)} · ${escapeHtml(m.galaxy_name)} · ${escapeHtml(m.status)}
                  </div>
                </div>
                <div style="display:flex; gap:6px; flex-shrink:0;">
                  <button class="btn btn-gold btn-sm" data-mod-id="${m.id}" data-mod-act="${m.flagged ? 'unflag' : 'flag'}">
                    ${m.flagged ? 'Unflag' : 'Flag'}
                  </button>
                  <button class="btn btn-danger btn-sm" data-mod-id="${m.id}" data-mod-act="remove">Remove</button>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="cosmic-card">
          <h3 style="font-size:17px; font-weight:600; margin-bottom:14px;">Platform Activity Log</h3>
          <div style="display:flex; flex-direction:column; gap:8px; max-height:500px; overflow-y:auto;">
            ${logs
              .map(
                (l) => `
              <div style="padding:10px 14px; border-radius:8px; background:rgba(2,4,10,0.55); border-left:2px solid var(--accent-blue);">
                <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-bottom:2px;">
                  <span><strong style="color:var(--text-secondary);">${escapeHtml(l.actor_name || 'System')}</strong> (${escapeHtml(l.actor_role || '')})</span>
                  <span class="stat-num">${escapeHtml(l.action_type)}</span>
                </div>
                <div style="font-size:12.5px; color:var(--text-primary);">${escapeHtml(l.description)}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-mod-act]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const mission_id = btn.getAttribute('data-mod-id');
        const action = btn.getAttribute('data-mod-act');
        await api('/api/admin/moderate', {
          method: 'POST',
          body: JSON.stringify({ mission_id, action }),
        });
        await refreshUniverseData();
        renderAdminModeration(container);
        showToast('Moderation Updated', `Action "${action}" applied.`, 'info');
      });
    });
  }

  // ===========================================================================
  // GLOBAL UNIVERSAL SEARCH PALETTE (Cmd+K)
  // ===========================================================================
  function openSearchPalette() {
    const overlay = document.getElementById('overlay-root');
    overlay.innerHTML = `
      <div class="modal-backdrop" id="search-backdrop">
        <div class="modal-panel" style="max-width:640px; padding:20px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
            ${ICONS.search}
            <input type="text" class="form-input" id="global-search-input" placeholder="Search galaxies, stars, projects, constellations, comets..." style="font-size:14px;" autofocus />
            <button class="icon-btn" id="close-search-modal">${ICONS.close}</button>
          </div>
          <div id="global-search-results" style="max-height:60vh; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
            <div style="font-size:12.5px; color:var(--text-muted); text-align:center; padding:18px;">
              Type a keyword (e.g., Neural, Robot, Water, Pulsar, Hackathon) to search the Omniverse.
            </div>
          </div>
        </div>
      </div>
    `;

    const input = document.getElementById('global-search-input');
    const resultsBox = document.getElementById('global-search-results');

    document.getElementById('close-search-modal').addEventListener('click', () => (overlay.innerHTML = ''));
    document.getElementById('search-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'search-backdrop') overlay.innerHTML = '';
    });

    input.focus();
    input.addEventListener('input', async () => {
      const q = input.value.trim();
      if (!q) return;
      const res = await api(`/api/search?q=${encodeURIComponent(q)}`);

      let html = '';
      if (res.galaxies.length) {
        html += `<div><div class="form-label" style="margin-bottom:6px;">Galaxies (${res.galaxies.length})</div>`;
        html += res.galaxies
          .map(
            (g) => `
          <div class="cosmic-card interactive" style="padding:10px 14px; margin-bottom:6px; cursor:pointer;" data-sr-gal="${g.id}">
            <strong style="color:${g.accent_color};">${escapeHtml(g.name)}</strong> (${escapeHtml(g.code)}) — Mentor: ${escapeHtml(g.teacher_name || '')}
          </div>
        `
          )
          .join('');
        html += `</div>`;
      }

      if (res.stars.length) {
        html += `<div><div class="form-label" style="margin-bottom:6px;">Stars (${res.stars.length})</div>`;
        html += res.stars
          .map(
            (s) => `
          <div class="cosmic-card interactive" style="padding:10px 14px; margin-bottom:6px; cursor:pointer;" data-sr-star="${s.id}" data-sr-gal="${s.galaxy_id}">
            <strong>${escapeHtml(s.title)}</strong> by ${escapeHtml(s.student_name)} · <span style="color:var(--accent-ice);">${s.stellar_energy} Sparks (${escapeHtml(s.star_classification)})</span>
          </div>
        `
          )
          .join('');
        html += `</div>`;
      }

      if (res.constellations.length) {
        html += `<div><div class="form-label" style="margin-bottom:6px;">Constellations (${res.constellations.length})</div>`;
        html += res.constellations
          .map(
            (c) => `
          <div class="cosmic-card interactive" style="padding:10px 14px; margin-bottom:6px; cursor:pointer;" data-sr-con="${c.id}" data-sr-gal="${c.galaxy_id}">
            <strong>${escapeHtml(c.name)}</strong> (${escapeHtml(c.galaxy_name)}) — ${escapeHtml(c.description)}
          </div>
        `
          )
          .join('');
        html += `</div>`;
      }

      if (res.comets.length) {
        html += `<div><div class="form-label" style="margin-bottom:6px;">Comets (${res.comets.length})</div>`;
        html += res.comets
          .map(
            (cm) => `
          <div class="cosmic-card interactive" style="padding:10px 14px; margin-bottom:6px; cursor:pointer;" data-sr-comet="${cm.id}">
            <strong>${escapeHtml(cm.title)}</strong> (${escapeHtml(cm.event_date)}) · ${escapeHtml(cm.location)}
          </div>
        `
          )
          .join('');
        html += `</div>`;
      }

      resultsBox.innerHTML =
        html || `<div style="text-align:center; padding:24px; color:var(--text-muted);">No matching results found.</div>`;

      resultsBox.querySelectorAll('[data-sr-gal]').forEach((el) => {
        el.addEventListener('click', () => {
          overlay.innerHTML = '';
          navigate('/cosmic-map', `galaxy=${el.getAttribute('data-sr-gal')}`);
        });
      });
      resultsBox.querySelectorAll('[data-sr-star]').forEach((el) => {
        el.addEventListener('click', () => {
          overlay.innerHTML = '';
          navigate(
            '/cosmic-map',
            `galaxy=${el.getAttribute('data-sr-gal')}&star=${el.getAttribute('data-sr-star')}`
          );
        });
      });
      resultsBox.querySelectorAll('[data-sr-con]').forEach((el) => {
        el.addEventListener('click', () => {
          overlay.innerHTML = '';
          navigate(
            '/cosmic-map',
            `galaxy=${el.getAttribute('data-sr-gal')}&constellation=${el.getAttribute('data-sr-con')}`
          );
        });
      });
      resultsBox.querySelectorAll('[data-sr-comet]').forEach((el) => {
        el.addEventListener('click', () => {
          overlay.innerHTML = '';
          navigate('/comets');
        });
      });
    });
  }

  // ===========================================================================
  // NOTIFICATIONS DRAWER
  // ===========================================================================
  async function toggleNotificationDrawer() {
    const overlay = document.getElementById('overlay-root');
    if (document.getElementById('notif-drawer')) {
      overlay.innerHTML = '';
      return;
    }

    const data = await api('/api/notifications');
    state.notifications = data.notifications || [];

    overlay.innerHTML = `
      <div class="notification-drawer" id="notif-drawer">
        <div style="padding:14px 16px; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-family:var(--font-heading); font-size:14px;">Notifications</strong>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-ghost btn-sm" id="mark-all-read-btn" style="padding:3px 9px; font-size:11px;">Mark All Read</button>
            <button class="icon-btn" id="close-notif-drawer" style="width:26px; height:26px;">${ICONS.close}</button>
          </div>
        </div>
        <div style="overflow-y:auto; max-height:60vh; padding:10px; display:flex; flex-direction:column; gap:6px;">
          ${
            state.notifications.length === 0
              ? `<div style="padding:24px; text-align:center; color:var(--text-muted);">No notifications yet.</div>`
              : state.notifications
                  .map(
                    (n) => `
                <div class="cosmic-card interactive" style="padding:11px 13px; cursor:pointer; border-left:2px solid ${
                  n.read_status ? 'transparent' : '#7CC4FA'
                };" data-notif-id="${n.id}" data-notif-link="${escapeHtml(n.link || '/cosmic-map')}">
                  <div style="font-family:var(--font-heading); font-weight:600; font-size:12.5px; color:var(--text-primary); margin-bottom:2px;">
                    ${escapeHtml(n.title)}
                  </div>
                  <div style="font-size:12px; color:var(--text-secondary);">${escapeHtml(n.message)}</div>
                </div>
              `
                  )
                  .join('')
          }
        </div>
      </div>
    `;

    document.getElementById('close-notif-drawer').addEventListener('click', () => (overlay.innerHTML = ''));
    document.getElementById('mark-all-read-btn').addEventListener('click', async () => {
      await api('/api/notifications/read', { method: 'POST', body: JSON.stringify({}) });
      state.unreadCount = 0;
      overlay.innerHTML = '';
      renderTopbar();
    });

    overlay.querySelectorAll('[data-notif-id]').forEach((el) => {
      el.addEventListener('click', async () => {
        const id = el.getAttribute('data-notif-id');
        const link = el.getAttribute('data-notif-link') || '/cosmic-map';
        await api('/api/notifications/read', { method: 'POST', body: JSON.stringify({ id }) });
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        overlay.innerHTML = '';
        renderTopbar();
        const [p, q] = link.split('?');
        navigate(p, q || '');
      });
    });
  }

  // ===========================================================================
  // AUTHENTICATION MODAL
  // ===========================================================================
  function openAuthModal({ mandatory = false } = {}) {
    const overlay = document.getElementById("overlay-root");
    overlay.innerHTML = `
      <div class="space-login-screen" id="auth-backdrop">
        <div class="space-login-glass-card" id="login-glass-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
            <div>
              <div style="font-family:var(--font-mono); font-size:10px; letter-spacing:0.2em; color:rgba(255,255,255,0.55); margin-bottom:6px;">
                DEEP SPACE ACCESS PORTAL
              </div>
              <h2 style="font-family:var(--font-robotic); font-size:21px; font-weight:800; letter-spacing:0.08em; color:#FFFFFF;">
                RAKS OMNIVERSE
              </h2>
            </div>
            ${mandatory ? '' : `<button class="icon-btn" id="close-auth-modal" title="Return to Space">${ICONS.close}</button>`}
          </div>

          <form id="auth-login-form">
            <div class="form-group">
              <label class="form-label">Account Type</label>
              <select class="form-select" id="auth-role" style="background:rgba(0,0,0,0.55); border-color:rgba(255,255,255,0.18); border-radius:10px; padding:11px 14px; color:#FFFFFF;">
                <option value="student">Student Account</option>
                <option value="teacher">Teacher Account</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">School Email or Username</label>
              <input type="text" class="form-input" id="auth-email" placeholder="student@raksomniverse.edu" style="background:rgba(0,0,0,0.55); border-color:rgba(255,255,255,0.18); border-radius:10px; padding:11px 14px;" required />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="auth-pwd" placeholder="Enter password" style="background:rgba(0,0,0,0.55); border-color:rgba(255,255,255,0.18); border-radius:10px; padding:11px 14px;" required />
            </div>
            <button type="submit" class="start-zooming-btn">
              START ZOOMING
            </button>
          </form>
        </div>
      </div>
    `;

    const closeWithZoom = () => {
      const scr = document.getElementById("auth-backdrop");
      if (scr) {
        scr.classList.add("space-login-Screen-zoom-out");
        setTimeout(() => (overlay.innerHTML = ""), 520);
      } else {
        overlay.innerHTML = "";
      }
    };

    const closeBtn = document.getElementById("close-auth-modal");
    if (closeBtn) closeBtn.addEventListener("click", closeWithZoom);
    document.getElementById("auth-login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const role = document.getElementById("auth-role").value;
        const email = document.getElementById("auth-email").value.trim();
        const password = document.getElementById("auth-pwd").value;
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password, role }),
        });
        state.user = data.user;
        localStorage.setItem('omniverse_logged_in', '1');
        localStorage.setItem('omniverse_user_id', data.user.id);
        await refreshUniverseData();
        if (state.route !== "/cosmic-map") {
          state.route = "/cosmic-map";
          window.history.pushState({}, "", "/cosmic-map");
        }
        renderShell();
        overlay.innerHTML = "";
        const seenKey = 'omniverse_tutorial_seen_' + data.user.id;
        const shouldShowTutorial = !!data.isFirstLogin && localStorage.getItem(seenKey) !== '1';
        localStorage.setItem(seenKey, '1');
        const launchTour = () => {
          if (shouldShowTutorial) {
            setTimeout(() => startInteractiveTutorial(), 180);
          }
        };
        if (window.playOmniverseIntro) {
          window.playOmniverseIntro(launchTour);
        } else {
          launchTour();
        }
        showToast("Coordinates Locked", `Welcome to the Omniverse, ${state.user.name}.`, "success");
      } catch (err) {
        showToast("Access Denied", err.message, "error");
      }
    });
  }

  // ===========================================================================
  // PREMIUM INTERACTIVE SPOTLIGHT TUTORIAL (NAVIGATES LIVE PAGES)
  // ===========================================================================
  function startInteractiveTutorial() {
    const existing = document.getElementById('omniverse-tour-layer');
    if (existing) existing.remove();

    const role = state.user ? state.user.role : 'student';
    const isTeacher = role === 'teacher';
    const isAdmin = role === 'admin';
    const sidebarEl = document.getElementById('sidebar');
    const navToggleBtn = document.getElementById('nav-arrow-toggle');

    const steps = [
      {
        route: '/cosmic-map',
        selector: '#nav-arrow-toggle',
        pad: 10,
        radius: 999,
        eyebrow: 'NAV BAR',
        title: 'Open the Nav Bar',
        body: 'Click this edge handle anytime to slide out the nav bar and switch between pages in Raks Omniverse.',
      },
      {
        route: '/cosmic-map',
        selector: '#cosmic-webgl-canvas',
        customRect: () => {
          const w = Math.min(window.innerWidth * 0.62, 680);
          const h = Math.min(window.innerHeight * 0.52, 420);
          return {
            left: (window.innerWidth - w) / 2,
            top: (window.innerHeight - h) / 2,
            width: w,
            height: h,
          };
        },
        pad: 0,
        radius: 24,
        eyebrow: '3D COSMIC MAP',
        title: 'Explore Subject Galaxies',
        body: 'Drag anywhere to orbit deep space and click any subject Galaxy to fly inside its star system, inspect student project Stars, and award Sparks.',
      },
      {
        route: '/cosmic-map',
        selector: '#map-galaxy-dock',
        pad: 8,
        radius: 999,
        eyebrow: 'QUICK WARP DOCK',
        title: 'Jump Between Galaxies',
        body: 'Leap straight into Computer Science, Physics, English, Biology, Mathematics, or Chemistry with a single click.',
      },
    ];

    steps.push({
      route: '/missions',
      selector: '.wizard-steps',
      fallbackSelector: '.page-hero',
      pad: 12,
      radius: 14,
      eyebrow: 'MISSIONS',
      title: 'Mission Control',
      body: 'Launch new student projects as Missions, attach links and files, and track pending approvals until they ignite into permanent Stars.',
    });

    steps.push(
      {
        route: '/comets',
        selector: '#comet-trajectory-canvas',
        fallbackSelector: '.page-hero',
        pad: 6,
        radius: 14,
        eyebrow: 'SCHOOL CALENDAR',
        title: 'Comets — Events & Deadlines',
        body: 'Track upcoming school holidays, Cambridge exams, mock assessments, and celebrations moving across the orbital timeline.',
      },
      {
        route: '/cosmo',
        selector: '#cosmo-mic-btn',
        customRect: () => {
          const size = Math.min(window.innerWidth * 0.42, window.innerHeight * 0.46, 360);
          return {
            left: (window.innerWidth - size) / 2,
            top: (window.innerHeight - size) / 2,
            width: size,
            height: size,
          };
        },
        pad: 0,
        radius: 999,
        eyebrow: 'VOICE AI ASSISTANT',
        title: 'Cosmo AI',
        body: 'Tap the glowing orb to talk or open the side chat with Cosmo—your interactive Raks Pallikkoodam guide for galaxies, projects, and events.',
      },
      {
        route: '/student',
        selector: '.page-hero',
        pad: 10,
        radius: 14,
        eyebrow: 'YOUR ACCOUNT',
        title: 'My Profile & Security',
        body: isTeacher || isAdmin
          ? 'View your Commander profile details, check your galaxy access and Galaxy Head assignments, and update your password.'
          : 'View your Explorer stats, approved Stars, galaxy memberships, and update your account password anytime.',
      }
    );

    if (isTeacher || isAdmin) {
      steps.push(
        {
          route: '/teacher',
          teacherTab: 'mission-control',
          selector: '#teacher-tab-content',
          fallbackSelector: '.cosmic-tabs',
          pad: 10,
          radius: 14,
          eyebrow: 'GALAXY MENTOR',
          title: 'Pending Missions & Reviews',
          body: 'Review pending student submissions in your galaxy, leave feedback, and approve Missions to activate them as Stars on the Cosmic Map.',
        },
        {
          route: '/teacher',
          teacherTab: 'galaxy-studio',
          selector: '#teacher-tab-content',
          fallbackSelector: '.cosmic-tabs',
          pad: 10,
          radius: 14,
          eyebrow: 'GALAXY STUDIO',
          title: 'Create & Manage Galaxies',
          body: 'Charter new subject clubs and configure galaxy descriptions, schedules, and visual formations.',
        },
        {
          route: '/teacher',
          teacherTab: 'constellation-creator',
          selector: '#teacher-tab-content',
          fallbackSelector: '.cosmic-tabs',
          pad: 10,
          radius: 14,
          eyebrow: 'CONSTELLATIONS',
          title: 'Constellation Builder',
          body: 'Connect related approved Stars within a galaxy into official Constellations that appear on the 3D Cosmic Map.',
        },
        {
          route: '/teacher',
          teacherTab: 'students',
          selector: '#teacher-tab-content',
          fallbackSelector: '.cosmic-tabs',
          pad: 10,
          radius: 14,
          eyebrow: 'STUDENT ROSTER',
          title: 'Students & Membership Requests',
          body: 'Register student accounts, approve or reject galaxy membership requests as Galaxy Head, and manage student access.',
        }
      );
    }

    if (isAdmin) {
      steps.push({
        route: '/admin',
        adminTab: 'analytics',
        selector: '.stats-grid',
        fallbackSelector: '.page-hero',
        pad: 10,
        radius: 14,
        eyebrow: 'ADMINISTRATION',
        title: 'Admin Command Center',
        body: 'Access platform analytics, assign Galaxy Heads, provision teacher accounts, manage all students, and moderate submissions.',
      });
    }

    const layer = document.createElement('div');
    layer.id = 'omniverse-tour-layer';
    layer.className = 'tour-layer';
    layer.innerHTML = `
      <div class="tour-spotlight-ring" id="tour-spotlight-ring"></div>
      <div class="tour-popover" id="tour-popover">
        <div class="tour-header-row">
          <span class="tour-eyebrow" id="tour-eyebrow"></span>
          <button type="button" class="tour-skip-btn" id="tour-skip-btn">Skip Tutorial</button>
        </div>
        <h3 class="tour-title" id="tour-title"></h3>
        <p class="tour-body" id="tour-body"></p>
        <div class="tour-progress-track">
          <div class="tour-progress-fill" id="tour-progress-fill"></div>
        </div>
        <div class="tour-footer">
          <div class="tour-dots" id="tour-dots"></div>
          <div class="tour-actions">
            <button type="button" class="btn btn-ghost btn-sm" id="tour-prev-btn">Back</button>
            <button type="button" class="tour-next-btn" id="tour-next-btn">Next →</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(layer);

    const ring = document.getElementById('tour-spotlight-ring');
    const popover = document.getElementById('tour-popover');
    const eyebrowEl = document.getElementById('tour-eyebrow');
    const titleEl = document.getElementById('tour-title');
    const bodyEl = document.getElementById('tour-body');
    const fillEl = document.getElementById('tour-progress-fill');
    const dotsEl = document.getElementById('tour-dots');
    const prevBtn = document.getElementById('tour-prev-btn');
    const nextBtn = document.getElementById('tour-next-btn');
    const skipBtn = document.getElementById('tour-skip-btn');

    let currentIdx = 0;
    let stepTimer = null;

    function closeSidebar() {
      if (sidebarEl) sidebarEl.classList.remove('open');
      if (navToggleBtn) navToggleBtn.classList.remove('open');
    }

    function getTargetRect(step) {
      if (typeof step.customRect === 'function') return step.customRect();
      const el = document.querySelector(step.selector) || (step.fallbackSelector ? document.querySelector(step.fallbackSelector) : null);
      if (!el) {
        return {
          left: window.innerWidth / 2 - 160,
          top: window.innerHeight / 2 - 80,
          width: 320,
          height: 160,
        };
      }
      const r = el.getBoundingClientRect();
      const maxH = Math.min(r.height, window.innerHeight * 0.48);
      return { left: r.left, top: Math.max(66, r.top), width: r.width, height: maxH };
    }

    function positionStep(idx, animateSwap = false) {
      const step = steps[idx];
      if (stepTimer) {
        clearTimeout(stepTimer);
        stepTimer = null;
      }

      closeSidebar();

      let navigated = false;
      if (step.teacherTab && state.teacherTab !== step.teacherTab) {
        state.teacherTab = step.teacherTab;
        navigated = true;
      }
      if (step.adminTab && state.adminTab !== step.adminTab) {
        state.adminTab = step.adminTab;
        navigated = true;
      }
      if (step.route && (state.route !== step.route || navigated)) {
        navigate(step.route);
        navigated = true;
      }

      const viewRoot = document.getElementById('view-root');
      if (viewRoot && step.route !== '/cosmic-map') {
        viewRoot.scrollTop = 0;
      }

      const applyPosition = () => {
        const pad = step.pad != null ? step.pad : 8;
        const r = getTargetRect(step);

        const spotLeft = Math.max(6, r.left - pad);
        const spotTop = Math.max(6, r.top - pad);
        const spotW = Math.min(window.innerWidth - 12, r.width + pad * 2);
        const spotH = Math.min(window.innerHeight - 12, r.height + pad * 2);

        ring.style.left = `${spotLeft}px`;
        ring.style.top = `${spotTop}px`;
        ring.style.width = `${spotW}px`;
        ring.style.height = `${spotH}px`;
        ring.style.borderRadius = `${step.radius || 16}px`;

        const updateContent = () => {
          const stepNum = String(idx + 1).padStart(2, '0');
          const totalNum = String(steps.length).padStart(2, '0');
          eyebrowEl.textContent = `${step.eyebrow} · ${stepNum} / ${totalNum}`;
          titleEl.textContent = step.title;
          bodyEl.textContent = step.body;
          fillEl.style.width = `${Math.round(((idx + 1) / steps.length) * 100)}%`;
          dotsEl.innerHTML = steps
            .map((_, i) => `<span class="tour-dot ${i === idx ? 'active' : i < idx ? 'done' : ''}"></span>`)
            .join('');
          prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
          nextBtn.textContent = idx === steps.length - 1 ? 'Enter Omniverse' : 'Next →';

          const popW = Math.min(372, window.innerWidth - 32);
          const popH = popover.offsetHeight || 220;
          const margin = 20;
          let left;
          let top;

          if (spotLeft + spotW + margin + popW <= window.innerWidth - 12) {
            left = spotLeft + spotW + margin;
            top = spotTop + spotH / 2 - popH / 2;
          } else if (spotTop + spotH + margin + popH <= window.innerHeight - 14) {
            left = spotLeft + spotW / 2 - popW / 2;
            top = spotTop + spotH + margin;
          } else if (spotTop - margin - popH >= 64) {
            left = spotLeft + spotW / 2 - popW / 2;
            top = spotTop - margin - popH;
          } else {
            left = window.innerWidth - popW - 24;
            top = window.innerHeight - popH - 24;
          }

          left = Math.max(16, Math.min(window.innerWidth - popW - 16, left));
          top = Math.max(66, Math.min(window.innerHeight - popH - 16, top));

          popover.style.left = `${left}px`;
          popover.style.top = `${top}px`;
        };

        if (animateSwap && !navigated) {
          popover.classList.add('step-swap');
          setTimeout(() => {
            updateContent();
            popover.classList.remove('step-swap');
          }, 140);
        } else {
          updateContent();
        }
      };

      if (navigated) {
        popover.classList.add('step-swap');
        stepTimer = setTimeout(() => {
          applyPosition();
          popover.classList.remove('step-swap');
        }, 120);
      } else {
        applyPosition();
      }
    }

    const closeTour = () => {
      if (stepTimer) clearTimeout(stepTimer);
      closeSidebar();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      layer.classList.remove('visible');
      if (state.route !== '/cosmic-map') {
        navigate('/cosmic-map');
      }
      setTimeout(() => layer.remove(), 420);
    };

    const onResize = () => positionStep(currentIdx, false);
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeTour();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        if (currentIdx < steps.length - 1) {
          currentIdx += 1;
          positionStep(currentIdx, true);
        } else {
          closeTour();
        }
      } else if (e.key === 'ArrowLeft' && currentIdx > 0) {
        e.preventDefault();
        currentIdx -= 1;
        positionStep(currentIdx, true);
      }
    };

    prevBtn.addEventListener('click', () => {
      if (currentIdx > 0) {
        currentIdx -= 1;
        positionStep(currentIdx, true);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIdx < steps.length - 1) {
        currentIdx += 1;
        positionStep(currentIdx, true);
      } else {
        closeTour();
      }
    });

    skipBtn.addEventListener('click', closeTour);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKeyDown);

    positionStep(0, false);
    requestAnimationFrame(() => layer.classList.add('visible'));
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
