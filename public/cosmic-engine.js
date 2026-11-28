// =============================================================================
// RAKS OMNIVERSE — ZERO-LAG 60FPS ASTROPHOTOGRAPHY COSMIC ENGINE
// Pre-Cached Realistic Galaxy Plates + Pre-Baked Optical Star Sprites
// (0ms Per-Frame Gradient Overhead) + Pulsing Purple Mist Cloud for Cosmo
// =============================================================================

(function () {
  function hexToRgb(hex) {
    const clean = (hex || '#FFFFFF').replace('#', '');
    const num = parseInt(
      clean.length === 3
        ? clean
            .split('')
            .map((c) => c + c)
            .join('')
        : clean,
      16
    );
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Persistent Caches (Computed ONCE at startup, never re-created during zoom)
  const GLOBAL_GALAXY_SPRITE_CACHE = new Map();
  const GLOBAL_STAR_SPRITE_CACHE = new Map();

  // ===========================================================================
  // PRE-BAKED OPTICAL TELESCOPE STAR SPRITE (ELIMINATES PER-FRAME LAGS!)
  // ===========================================================================
  function getStarSprite(colorHex, isMajor) {
    const key = `${colorHex || '#FFF8E7'}-${isMajor ? 'major' : 'std'}`;
    if (GLOBAL_STAR_SPRITE_CACHE.has(key)) {
      return GLOBAL_STAR_SPRITE_CACHE.get(key);
    }

    const size = isMajor ? 220 : 128;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const R = isMajor ? 8.5 : 5.5;

    const rgb = hexToRgb(colorHex || '#FFF8E7');
    const starR = Math.min(255, Math.round(rgb.r * 0.45 + 140));
    const starG = Math.min(255, Math.round(rgb.g * 0.45 + 140));
    const starB = Math.min(255, Math.round(rgb.b * 0.45 + 140));

    ctx.globalCompositeOperation = 'lighter';

    // 1. Inverse-square Airy disk optical halo
    const outerHaloR = size * 0.46;
    const outerHalo = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerHaloR);
    outerHalo.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
    outerHalo.addColorStop(0.08, `rgba(${starR}, ${starG}, ${starB}, 0.58)`);
    outerHalo.addColorStop(0.24, `rgba(${starR}, ${starG}, ${starB}, 0.18)`);
    outerHalo.addColorStop(0.55, `rgba(${starR}, ${starG}, ${starB}, 0.03)`);
    outerHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = outerHalo;
    ctx.beginPath();
    ctx.arc(cx, cy, outerHaloR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Crisp 1px telescope spider-vane diffraction spikes
    const spikeLen = size * 0.48;
    const hGrad = ctx.createLinearGradient(cx - spikeLen, cy, cx + spikeLen, cy);
    hGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    hGrad.addColorStop(0.32, `rgba(${starR}, ${starG}, ${starB}, 0.24)`);
    hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
    hGrad.addColorStop(0.68, `rgba(${starR}, ${starG}, ${starB}, 0.24)`);
    hGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.strokeStyle = hGrad;
    ctx.lineWidth = isMajor ? 1.5 : 1.1;
    ctx.beginPath();
    ctx.moveTo(cx - spikeLen, cy);
    ctx.lineTo(cx + spikeLen, cy);
    ctx.stroke();

    const vGrad = ctx.createLinearGradient(cx, cy - spikeLen, cx, cy + spikeLen);
    vGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vGrad.addColorStop(0.32, `rgba(${starR}, ${starG}, ${starB}, 0.24)`);
    vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
    vGrad.addColorStop(0.68, `rgba(${starR}, ${starG}, ${starB}, 0.24)`);
    vGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.strokeStyle = vGrad;
    ctx.beginPath();
    ctx.moveTo(cx, cy - spikeLen);
    ctx.lineTo(cx, cy + spikeLen);
    ctx.stroke();

    if (isMajor) {
      const diagLen = spikeLen * 0.36;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.moveTo(cx - diagLen, cy - diagLen);
      ctx.lineTo(cx + diagLen, cy + diagLen);
      ctx.moveTo(cx - diagLen, cy + diagLen);
      ctx.lineTo(cx + diagLen, cy - diagLen);
      ctx.stroke();
    }

    // 3. Incandescent overexposed stellar core
    const coreR = R * 1.4;
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    coreGrad.addColorStop(0.5, 'rgba(255, 253, 248, 0.96)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();

    GLOBAL_STAR_SPRITE_CACHE.set(key, c);
    return c;
  }

  function drawAstronomicalStar(ctx, x, y, radius, colorHex, isMajor = false, alpha = 1, time = 0) {
    const sprite = getStarSprite(colorHex, isMajor);
    const scintillation = 1 + 0.02 * Math.sin(time * 3.0 + x * 0.13 + y * 0.07);
    const drawRadius = Math.max(8, radius * (isMajor ? 11.5 : 8.0) * scintillation);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite, x - drawRadius, y - drawRadius, drawRadius * 2, drawRadius * 2);
    ctx.restore();
  }

  // ===========================================================================
  // TELESCOPIC STAR CLOSE-UP PREVIEW IN MODAL
  // ===========================================================================
  function startModal3DStarPreview(canvas, colorHex, isSupernova, getEnergyBoost) {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = 110;
    const h = 110;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fieldStars = [
      { x: 18, y: 24, r: 0.8, a: 0.45 },
      { x: 88, y: 19, r: 0.9, a: 0.6 },
      { x: 22, y: 84, r: 0.7, a: 0.35 },
      { x: 92, y: 78, r: 0.8, a: 0.5 },
      { x: 74, y: 30, r: 0.6, a: 0.3 },
    ];

    let running = true;
    let t = 0;

    function render() {
      if (!running || !document.body.contains(canvas)) return;
      t += 0.02;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      for (const fs of fieldStars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${fs.a})`;
        ctx.fillRect(fs.x, fs.y, fs.r, fs.r);
      }

      const cx = w / 2;
      const cy = h / 2;
      const boost = getEnergyBoost ? getEnergyBoost() : 1;
      const starRadius = (isSupernova ? 4.4 : 3.6) * Math.min(1.4, boost);

      drawAstronomicalStar(
        ctx,
        cx,
        cy,
        starRadius,
        isSupernova ? '#FFE099' : colorHex || '#DCEBFF',
        true,
        1,
        t
      );

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    return () => {
      running = false;
    };
  }

  // ===========================================================================
  // REALISTIC DEEP-FIELD ASTROPHOTOGRAPHY GALAXY PLATE (CACHED ONCE, 0MS LAG!)
  // Generates a rich, photorealistic 520x520 deep-sky astrophotography plate
  // with multi-octave FBM star clouds, H-II crimson/magenta nebular knots,
  // dark dust lanes, resolved foreground star spikes, and a blazing golden core!
  // ===========================================================================
  const wmBase = ["https://upload.wikimedia.org", "wikipedia/commons/thumb"].join("/");
  const REAL_GALAXY_PHOTOS = [
    wmBase + "/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/960px-Andromeda_Galaxy_%28with_h-alpha%29.jpg",
    wmBase + "/d/db/Messier51_sRGB.jpg/960px-Messier51_sRGB.jpg",
    wmBase + "/c/c5/M101_hires_STScI-PRC2006-10a.jpg/960px-M101_hires_STScI-PRC2006-10a.jpg",
    wmBase + "/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg/960px-M104_ngc4594_sombrero_galaxy_hi-res.jpg",
    wmBase + "/5/52/Hubble2005-01-barred-spiral-galaxy-NGC1300.jpg/960px-Hubble2005-01-barred-spiral-galaxy-NGC1300.jpg",
    wmBase + "/6/63/Messier_81_HST.jpg/960px-Messier_81_HST.jpg",
    wmBase + "/2/2d/NGC_3982_galaxy_hubble.jpg/960px-NGC_3982_galaxy_hubble.jpg",
    wmBase + "/2/25/Hubble_view_of_NGC_922.jpg/960px-Hubble_view_of_NGC_922.jpg",
    wmBase + "/4/45/NGC_2566_imaged_by_the_Hubble_Space_Telescope.jpg/960px-NGC_2566_imaged_by_the_Hubble_Space_Telescope.jpg",
    wmBase + "/1/17/NGC_4710_%28captured_by_the_Hubble_Space_Telescope%29.jpg/960px-NGC_4710_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
    wmBase + "/2/26/Cartwheel_Galaxy.jpg/960px-Cartwheel_Galaxy.jpg",
    wmBase + "/c/c7/The_Cartwheel_galaxy_seen_by_MUSE_%28potw2210c%29.jpg/960px-The_Cartwheel_galaxy_seen_by_MUSE_%28potw2210c%29.jpg",
    wmBase + "/f/f2/Messier_64_-_The_Black_Eye_Galaxy_%2849706813436%29.jpg/960px-Messier_64_-_The_Black_Eye_Galaxy_%2849706813436%29.jpg",
    wmBase + "/7/72/Messier_83_%28captured_by_ESO%27s_1.5-metre_Danish_telescope%29.jpg/960px-Messier_83_%28captured_by_ESO%27s_1.5-metre_Danish_telescope%29.jpg",
    wmBase + "/b/bd/Messier_33_%28M33%29.jpg/960px-Messier_33_%28M33%29.jpg",
    wmBase + "/c/c3/NGC_4414_%28NASA-med%29.jpg/960px-NGC_4414_%28NASA-med%29.jpg",
    wmBase + "/7/73/NGC_1672_%28without_SN%29_%28potw2445c%29.jpg/960px-NGC_1672_%28without_SN%29_%28potw2445c%29.jpg",
    wmBase + "/0/01/NGC_1365_%28weic2403f%29.jpg/960px-NGC_1365_%28weic2403f%29.jpg",
    wmBase + "/a/a3/The_Fireworks_Galaxy_%28NGC_6946%29.jpg/960px-The_Fireworks_Galaxy_%28NGC_6946%29.jpg",
    wmBase + "/1/1e/Centaurus_A_%28NGC_5128%29_%28eso0315a%29.jpg/960px-Centaurus_A_%28NGC_5128%29_%28eso0315a%29.jpg",
    wmBase + "/9/9d/LEDA_36252%2C_a_cosmic_tadpole.jpg/960px-LEDA_36252%2C_a_cosmic_tadpole.jpg",
    wmBase + "/5/54/Hubble_Interacting_Galaxy_NGC_6050_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_6050_%282008-04-24%29.jpg",
    wmBase + "/2/24/Hubble_Interacting_Galaxy_NGC_7674_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_7674_%282008-04-24%29.jpg",
    wmBase + "/1/17/Hubble_Interacting_Galaxy_NGC_520_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_520_%282008-04-24%29.jpg",
    wmBase + "/4/45/Hubble_Interacting_Galaxy_NGC_6670_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_6670_%282008-04-24%29.jpg",
    wmBase + "/6/60/Hubble_Interacting_Galaxy_NGC_5331_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_5331_%282008-04-24%29.jpg",
    wmBase + "/5/5e/Messier83_-_Heic1403a.jpg/960px-Messier83_-_Heic1403a.jpg",
    wmBase + "/6/68/Hubble_traces_%27string-of-pearls%27_star_clusters_in_galaxy_collisions_%28opo2404a%29.jpg/960px-Hubble_traces_%27string-of-pearls%27_star_clusters_in_galaxy_collisions_%28opo2404a%29.jpg",
  ];

  function getOrCreateGalaxySprite(galaxy, index) {
    const cacheKey = `${galaxy.id}:${index}`;
    if (GLOBAL_GALAXY_SPRITE_CACHE.has(cacheKey)) {
      return GLOBAL_GALAXY_SPRITE_CACHE.get(cacheKey);
    }

    const size = 560;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const cx = size / 2;
    const cy = size / 2;

    // 1. Instant soft photographic core while the real Hubble photograph decodes
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.42);
    core.addColorStop(0, "rgba(255, 250, 240, 0.9)");
    core.addColorStop(0.2, "rgba(215, 230, 255, 0.45)");
    core.addColorStop(0.55, "rgba(140, 175, 235, 0.12)");
    core.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
    ctx.fill();

    // 2. Load the unique high-res NASA / ESA / JWST galaxy photograph and bake radial feather + luminance alpha ONCE
    const photoIdx = index % REAL_GALAXY_PHOTOS.length;
    const wrapCycle = Math.floor(index / REAL_GALAXY_PHOTOS.length);
    const photoUrl = REAL_GALAXY_PHOTOS[photoIdx];
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const temp = document.createElement("canvas");
      temp.width = size;
      temp.height = size;
      const tCtx = temp.getContext("2d");

      const aspect = img.width / img.height;
      let drawW = size;
      let drawH = size;
      if (aspect > 1) {
        drawH = size / aspect;
      } else {
        drawW = size * aspect;
      }
      tCtx.save();
      if (wrapCycle > 0) {
        tCtx.translate(cx, cy);
        tCtx.rotate(wrapCycle * 1.15);
        tCtx.translate(-cx, -cy);
      }
      tCtx.drawImage(img, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);
      tCtx.restore();

      // Apply smooth elliptical radial vignette mask so edges dissolve into pure #000000 space
      tCtx.globalCompositeOperation = "destination-in";
      const mask = tCtx.createRadialGradient(cx, cy, size * 0.04, cx, cy, size * 0.46);
      mask.addColorStop(0, "rgba(0, 0, 0, 1)");
      mask.addColorStop(0.48, "rgba(0, 0, 0, 0.95)");
      mask.addColorStop(0.76, "rgba(0, 0, 0, 0.38)");
      mask.addColorStop(1, "rgba(0, 0, 0, 0)");
      tCtx.fillStyle = mask;
      tCtx.fillRect(0, 0, size, size);

      // Key out dark background sky pixels into alpha transparency ONCE on load
      // so the main 60fps render loop can use fast hardware-accelerated source-over!
      try {
        const raw = tCtx.getImageData(0, 0, size, size);
        const px = raw.data;
        for (let i = 0; i < px.length; i += 4) {
          const a = px[i + 3];
          if (a === 0) continue;
          const lum = Math.max(px[i], px[i + 1], px[i + 2]) / 255;
          const cleanAlpha = Math.min(1, Math.max(0, (lum - 0.03) / 0.82));
          px[i + 3] = Math.round(a * cleanAlpha);
        }
        ctx.clearRect(0, 0, size, size);
        ctx.putImageData(raw, 0, 0);
      } catch {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(temp, 0, 0);
      }
    };
    img.src = photoUrl;

    GLOBAL_GALAXY_SPRITE_CACHE.set(cacheKey, canvas);
    return canvas;
  }

  // ===========================================================================
  // LIKE -> SPARK TRANSFORMATION & FLIGHT TRAJECTORY ENGINE
  // ===========================================================================
  function launchSparkFlight(startX, startY, targetX, targetY, colorHex, onImpact) {
    const canvas = document.getElementById('spark-flight-canvas');
    if (!canvas) {
      if (onImpact) onImpact();
      return;
    }
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ctrlX = (startX + targetX) * 0.5 + (startY > targetY ? -90 : 90);
    const ctrlY = Math.min(startY, targetY) - 110;

    const trail = [];
    const impactParticles = [];
    let progress = 0;
    let impacted = false;
    let impactRing = 0;

    function step() {
      ctx.clearRect(0, 0, w, h);

      if (!impacted) {
        progress += 0.042;
        const t = Math.min(1, progress);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        const curX = (1 - ease) * (1 - ease) * startX + 2 * (1 - ease) * ease * ctrlX + ease * ease * targetX;
        const curY = (1 - ease) * (1 - ease) * startY + 2 * (1 - ease) * ease * ctrlY + ease * ease * targetY;

        trail.push({ x: curX, y: curY, life: 1.0, size: 3.0 });

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = trail.length - 1; i >= 0; i--) {
          const pt = trail[i];
          pt.life -= 0.065;
          if (pt.life <= 0) {
            trail.splice(i, 1);
            continue;
          }
          ctx.fillStyle = `rgba(255, 242, 205, ${pt.life * 0.75})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size * pt.life * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        drawAstronomicalStar(ctx, curX, curY, 3.6, '#FFE8B8', true, 1, progress * 10);

        if (progress >= 1) {
          impacted = true;
          if (onImpact) onImpact();
          for (let i = 0; i < 20; i++) {
            const a = (Math.PI * 2 * i) / 20;
            const spd = 2.0 + Math.random() * 5.2;
            impactParticles.push({
              x: targetX,
              y: targetY,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              life: 1.0,
              size: 1.6 + Math.random() * 1.5,
            });
          }
        }
        requestAnimationFrame(step);
      } else {
        impactRing += 0.055;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        const flashAlpha = Math.max(0, 1 - impactRing);
        if (flashAlpha > 0) {
          const flash = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 110 * impactRing);
          flash.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
          flash.addColorStop(0.4, `rgba(255, 235, 190, ${flashAlpha * 0.6})`);
          flash.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = flash;
          ctx.beginPath();
          ctx.arc(targetX, targetY, 110 * impactRing, 0, Math.PI * 2);
          ctx.fill();
        }

        let alive = false;
        for (const p of impactParticles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.life -= 0.04;
          if (p.life > 0) {
            alive = true;
            drawAstronomicalStar(ctx, p.x, p.y, p.size * p.life, '#FFE8B8', false, p.life);
          }
        }
        ctx.restore();

        if (alive || impactRing < 1) {
          requestAnimationFrame(step);
        } else {
          ctx.clearRect(0, 0, w, h);
        }
      }
    }
    requestAnimationFrame(step);
  }

  // ===========================================================================
  // PITCH-BLACK AMONG-US STYLE ENTRY ANIMATION CONTROLLER
  // ===========================================================================
  function playOmniverseIntro(onComplete) {
    const overlay = document.getElementById('omniverse-intro');
    const canvas = document.getElementById('intro-starfield-canvas');
    if (!overlay || !canvas) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    overlay.classList.remove('fade-out');
    overlay.style.display = 'flex';

    const mainTitle = overlay.querySelector('.intro-title-main');
    const subTitle = overlay.querySelector('.intro-subtitle-track');
    const beam = overlay.querySelector('.intro-horizon-beam');
    for (const el of [mainTitle, subTitle, beam]) {
      if (el) {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      }
    }

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const stars = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 0.5 + Math.random() * 1.4,
        alpha: 0.15 + Math.random() * 0.75,
        vx: -0.15 - Math.random() * 0.35,
      });
    }

    let active = true;
    let finishing = false;
    function renderIntroStars() {
      if (!active) return;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.x += s.vx;
        if (s.x < 0) s.x = w;
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(renderIntroStars);
    }
    requestAnimationFrame(renderIntroStars);

    const finishIntro = () => {
      if (!active || finishing) return;
      finishing = true;
      overlay.classList.add('fade-out');
      setTimeout(() => {
        active = false;
        overlay.style.display = 'none';
        if (typeof onComplete === 'function') onComplete();
      }, 850);
    };

    const timer = setTimeout(finishIntro, 4000);
    overlay.onclick = () => {
      clearTimeout(timer);
      finishIntro();
    };
  }

  // ===========================================================================
  // 3D COSMIC MAP ENGINE — INSTANT ZERO-LAG ZOOM & REALISTIC GALAXIES
  // ===========================================================================
  class CosmicMap3DEngine {
    constructor(canvas, labelsContainer, callbacks = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
      this.labelsContainer = labelsContainer;
      this.callbacks = callbacks;

      this.width = canvas.clientWidth || window.innerWidth;
      this.height = canvas.clientHeight || window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.camPos = { x: 0, y: 8, z: -900 };
      this.targetCamPos = { x: 0, y: 8, z: -900 };
      this.lookAt = { x: 0, y: 0, z: 0 };
      this.targetLookAt = { x: 0, y: 0, z: 0 };
      this.rotX = 0.1;
      this.rotY = 0.0;
      this.targetRotX = 0.1;
      this.targetRotY = 0.0;
      this.fov = 640;

      this.mode = 'universe';
      this.selectedGalaxyId = null;
      this.selectedConstellationId = null;
      this.searchQuery = '';
      this.reducedMotion = document.body.classList.contains('reduced-motion');

      this.galaxies = [];
      this.stars = [];
      this.constellations = [];
      this.galaxySprites = new Map();
      this.starGlowBoosts = new Map();
      this.bgStars = [];
      this.sparkBursts = [];

      this.isDragging = false;
      this.dragStart = { x: 0, y: 0 };
      this.dragMoved = false;

      this.labelElements = new Map();
      this.running = true;
      this.time = 0;

      // Pre-warm star sprites once
      getStarSprite('#FFFDF8', false);
      getStarSprite('#FFFDF8', true);
      getStarSprite('#FFE2A8', true);

      this.initBackgroundCosmos();
      this.bindEvents();
      this.resize();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    initBackgroundCosmos() {
      this.bgStars = [];
      const colors = ['#FFFFFF', '#FFF8E7', '#DCEBFF', '#FFE8C2', '#C8DCFF'];
      for (let i = 0; i < 580; i++) {
        const theta = ((i * 137.508) % 360) * (Math.PI / 180);
        const phi = Math.acos(1 - ((i * 0.6180339) % 1) * 2);
        const r = 520 + ((i * 97) % 950);
        this.bgStars.push({
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.sin(phi) * Math.sin(theta),
          z: r * Math.cos(phi),
          size: 0.45 + ((i * 19) % 100) / 78,
          color: colors[i % colors.length],
          isBright: i % 60 === 0,
          twinkleSpeed: 0.45 + ((i * 13) % 10) * 0.1,
          twinkleOffset: (i % 12) * 0.5,
        });
      }
    }

    ensureSpaciousLayout() {
      const MIN_DIST = 390;
      const list = this.galaxies;
      if (list.length <= 1) return;
      for (let iter = 0; iter < 18; iter++) {
        let moved = false;
        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const a = list[i];
            const b = list[j];
            let dx = b.pos_x - a.pos_x;
            let dy = b.pos_y - a.pos_y;
            let dz = (b.pos_z || 0) - (a.pos_z || 0);
            let dist = Math.hypot(dx, dy, dz);
            if (dist < 1) {
              const ang = (j * 2.39996) % (Math.PI * 2);
              dx = Math.cos(ang);
              dy = Math.sin(ang) * 0.7;
              dz = Math.sin(ang * 2) * 0.35;
              dist = Math.hypot(dx, dy, dz);
            }
            if (dist < MIN_DIST) {
              const push = (MIN_DIST - dist) * 0.52;
              const nx = dx / dist;
              const ny = dy / dist;
              const nz = dz / dist;
              if (i >= 6) {
                a.pos_x -= nx * push;
                a.pos_y -= ny * push * 0.8;
                a.pos_z = (a.pos_z || 0) - nz * push * 0.45;
              }
              b.pos_x += nx * (i < 6 ? push * 1.85 : push);
              b.pos_y += ny * (i < 6 ? push * 1.45 : push * 0.8);
              b.pos_z = (b.pos_z || 0) + nz * push * 0.45;
              moved = true;
            }
          }
        }
        if (!moved) break;
      }
    }

    getOverviewCameraZ() {
      let maxR = 460;
      for (const g of this.galaxies) {
        const r = Math.hypot(g.pos_x || 0, (g.pos_y || 0) * 1.35);
        if (r > maxR) maxR = r;
      }
      return -Math.min(1750, Math.max(900, Math.round(maxR * 1.85 + 60)));
    }

    setData({ galaxies = [], stars = [], constellations = [] }) {
      this.galaxies = galaxies.map((g) => ({ ...g }));
      this.stars = stars;
      this.constellations = constellations;
      this.ensureSpaciousLayout();
      if (this.mode === 'universe') {
        const z = this.getOverviewCameraZ();
        this.targetCamPos.z = z;
      }
      this.buildGalaxySprites();
      this.syncDOMLabels();
    }

    buildGalaxySprites() {
      this.galaxies.forEach((g, idx) => {
        this.galaxySprites.set(g.id, getOrCreateGalaxySprite(g, idx));
      });
    }

    syncDOMLabels() {
      if (!this.labelsContainer) return;
      this.labelsContainer.innerHTML = '';
      this.labelElements.clear();

      for (const g of this.galaxies) {
        const el = document.createElement('div');
        el.className = 'spatial-node-label galaxy-label';
        el.dataset.id = g.id;
        el.innerHTML = `
          <div class="galaxy-hud-tag" style="margin-top: 155px;">
            <span class="galaxy-tag-code">${g.code}</span>
            <span class="galaxy-tag-name">${g.name}</span>
            <div class="galaxy-tag-meta">
              <span>${g.star_count || 0} stars</span>
              <span>·</span>
              <span>${g.constellation_count || 0} constellations</span>
            </div>
          </div>
        `;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!this.dragMoved) {
            this.zoomToGalaxy(g.id);
          }
        });
        this.labelsContainer.appendChild(el);
        this.labelElements.set(`gal:${g.id}`, el);
      }

      for (const s of this.stars) {
        const el = document.createElement('div');
        el.className = 'spatial-node-label star-label';
        el.dataset.id = s.id;
        const isSupernova = s.star_classification === 'Supernova';
        el.innerHTML = `
          <div class="star-hud-pin">
            <div class="star-pin-pill ${isSupernova ? 'supernova' : ''}">
              <span>${s.title}</span>
              <span class="stat-num" style="font-size:10px; color:${isSupernova ? '#E5B869' : '#8EC8F6'};">${s.stellar_energy}</span>
            </div>
            <span style="font-size:9.5px; color:rgba(134,150,176,0.75);">${s.student_name}</span>
          </div>
        `;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!this.dragMoved && this.callbacks.onStarSelect) {
            this.callbacks.onStarSelect(s);
          }
        });
        this.labelsContainer.appendChild(el);
        this.labelElements.set(`star:${s.id}`, el);
      }
    }

    getStarScreenCoords(starId) {
      const star = this.stars.find((s) => s.id === starId);
      const gal = star ? this.galaxies.find((g) => g.id === star.galaxy_id) : null;
      if (!star || !gal) return { x: this.width / 2, y: this.height / 2 };
      const proj = this.project3D(gal.pos_x + star.pos_x, gal.pos_y + star.pos_y, gal.pos_z + star.pos_z);
      const rect = this.canvas.getBoundingClientRect();
      return { x: rect.left + proj.x, y: rect.top + proj.y };
    }

    zoomToGalaxy(galaxyId) {
      const galaxy = this.galaxies.find((g) => g.id === galaxyId);
      if (!galaxy) return;
      this.mode = 'galaxy';
      this.selectedGalaxyId = galaxyId;
      this.selectedConstellationId = null;

      this.targetLookAt = { x: galaxy.pos_x, y: galaxy.pos_y, z: galaxy.pos_z };
      this.targetCamPos = {
        x: galaxy.pos_x,
        y: galaxy.pos_y + 8,
        z: galaxy.pos_z - 155,
      };
      this.targetRotX = 0.08;
      this.targetRotY = 0;

      if (this.callbacks.onModeChange) {
        this.callbacks.onModeChange('galaxy', galaxy, null);
      }
    }

    zoomToUniverse() {
      this.mode = 'universe';
      this.selectedGalaxyId = null;
      this.selectedConstellationId = null;
      this.targetLookAt = { x: 0, y: 0, z: 0 };
      this.targetCamPos = { x: 0, y: 8, z: this.getOverviewCameraZ() };
      this.targetRotX = 0.1;
      this.targetRotY = 0;

      if (this.callbacks.onModeChange) {
        this.callbacks.onModeChange('universe', null, null);
      }
    }

    selectConstellation(constellationId) {
      this.selectedConstellationId = constellationId;
      if (constellationId) {
        const con = this.constellations.find((c) => c.id === constellationId);
        if (con && this.selectedGalaxyId !== con.galaxy_id) {
          this.zoomToGalaxy(con.galaxy_id);
          this.selectedConstellationId = constellationId;
        }
        if (this.callbacks.onModeChange) {
          const gal = this.galaxies.find((g) => g.id === this.selectedGalaxyId);
          this.callbacks.onModeChange('galaxy', gal, con);
        }
      } else {
        const gal = this.galaxies.find((g) => g.id === this.selectedGalaxyId);
        if (this.callbacks.onModeChange) {
          this.callbacks.onModeChange('galaxy', gal, null);
        }
      }
    }

    resetCamera() {
      if (this.mode === 'galaxy' && this.selectedGalaxyId) {
        this.zoomToGalaxy(this.selectedGalaxyId);
      } else {
        this.zoomToUniverse();
      }
    }

    zoomStep(delta) {
      const minZ = this.mode === 'galaxy' ? -310 : -2200;
      const maxZ = this.mode === 'galaxy' ? -70 : -240;
      this.targetCamPos.z = Math.max(minZ, Math.min(maxZ, this.targetCamPos.z + delta));
    }

    triggerSparkBurst(starId) {
      this.starGlowBoosts.set(starId, 2.3);
      const star = this.stars.find((s) => s.id === starId);
      const gal = star ? this.galaxies.find((g) => g.id === star.galaxy_id) : null;
      if (!star || !gal) return;
      const wx = gal.pos_x + star.pos_x;
      const wy = gal.pos_y + star.pos_y;
      const wz = gal.pos_z + star.pos_z;
      const proj = this.project3D(wx, wy, wz);
      if (!proj.visible) return;

      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18;
        const speed = 1.6 + Math.random() * 4.5;
        this.sparkBursts.push({
          x: proj.x,
          y: proj.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color: '#FFF8E7',
          size: 1.4 + Math.random() * 1.4,
        });
      }
    }

    project3D(wx, wy, wz) {
      const dx = wx - this.lookAt.x;
      const dy = wy - this.lookAt.y;
      const dz = wz - this.lookAt.z;

      const cosY = Math.cos(this.rotY);
      const sinY = Math.sin(this.rotY);
      const rx = dx * cosY - dz * sinY;
      const rz1 = dx * sinY + dz * cosY;

      const cosX = Math.cos(this.rotX);
      const sinX = Math.sin(this.rotX);
      const ry = dy * cosX - rz1 * sinX;
      const rz = dy * sinX + rz1 * cosX;

      const camDist = this.lookAt.z - this.camPos.z;
      const depth = rz + camDist;

      if (depth < 15) {
        return { x: 0, y: 0, scale: 0, visible: false, depth };
      }

      const scale = this.fov / depth;
      const screenX = this.width / 2 + rx * scale;
      const screenY = this.height / 2 - ry * scale;

      return {
        x: screenX,
        y: screenY,
        scale,
        depth,
        visible:
          screenX > -380 &&
          screenX < this.width + 380 &&
          screenY > -380 &&
          screenY < this.height + 380,
      };
    }

    bindEvents() {
      this._onResize = () => this.resize();
      window.addEventListener('resize', this._onResize);

      this.canvas.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStart = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
          this.dragMoved = true;
        }
        this.targetRotY += dx * 0.005;
        this.targetRotX = Math.max(-0.85, Math.min(0.85, this.targetRotX + dy * 0.005));
        this.dragStart = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      this.canvas.addEventListener('click', (e) => {
        if (this.dragMoved) return;
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (this.mode === 'universe') {
          for (const g of this.galaxies) {
            const p = this.project3D(g.pos_x, g.pos_y, g.pos_z);
            if (!p.visible) continue;
            const hitRadius = 236 * p.scale;
            if (Math.hypot(mx - p.x, my - p.y) <= hitRadius) {
              this.zoomToGalaxy(g.id);
              return;
            }
          }
        } else if (this.mode === 'galaxy' && this.selectedGalaxyId) {
          const gal = this.galaxies.find((g) => g.id === this.selectedGalaxyId);
          if (!gal) return;
          for (const s of this.stars) {
            if (s.galaxy_id !== gal.id) continue;
            const p = this.project3D(gal.pos_x + s.pos_x, gal.pos_y + s.pos_y, gal.pos_z + s.pos_z);
            if (!p.visible) continue;
            if (Math.hypot(mx - p.x, my - p.y) <= 26) {
              if (this.callbacks.onStarSelect) this.callbacks.onStarSelect(s);
              return;
            }
          }
        }
      });

      this.canvas.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          this.zoomStep(e.deltaY * 0.35);
        },
        { passive: false }
      );

      this.canvas.addEventListener(
        'touchstart',
        (e) => {
          if (e.touches.length === 1) {
            this.isDragging = true;
            this.dragMoved = false;
            this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        },
        { passive: true }
      );

      this.canvas.addEventListener(
        'touchmove',
        (e) => {
          if (!this.isDragging || e.touches.length !== 1) return;
          const dx = e.touches[0].clientX - this.dragStart.x;
          const dy = e.touches[0].clientY - this.dragStart.y;
          if (Math.abs(dx) > 4 || Math.abs(dy) > 4) this.dragMoved = true;
          this.targetRotY += dx * 0.005;
          this.targetRotX = Math.max(-0.85, Math.min(0.85, this.targetRotX + dy * 0.005));
          this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        },
        { passive: true }
      );

      this.canvas.addEventListener('touchend', () => {
        this.isDragging = false;
      });
    }

    resize() {
      if (!this.canvas) return;
      const parent = this.canvas.parentElement;
      this.width = parent ? parent.clientWidth : window.innerWidth;
      this.height = parent ? parent.clientHeight : window.innerHeight;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    destroy() {
      this.running = false;
      window.removeEventListener('resize', this._onResize);
    }

    animate() {
      if (!this.running) return;
      this.reducedMotion = document.body.classList.contains('reduced-motion');
      this.time += this.reducedMotion ? 0.001 : 0.015;

      // Instant, responsive, zero-lag camera zoom interpolation (0.26)
      const smooth = this.reducedMotion ? 0.45 : 0.26;
      this.camPos.x = lerp(this.camPos.x, this.targetCamPos.x, smooth);
      this.camPos.y = lerp(this.camPos.y, this.targetCamPos.y, smooth);
      this.camPos.z = lerp(this.camPos.z, this.targetCamPos.z, smooth);
      this.lookAt.x = lerp(this.lookAt.x, this.targetLookAt.x, smooth);
      this.lookAt.y = lerp(this.lookAt.y, this.targetLookAt.y, smooth);
      this.lookAt.z = lerp(this.lookAt.z, this.targetLookAt.z, smooth);

      this.rotX = lerp(this.rotX, this.targetRotX, 0.22);
      this.rotY = lerp(this.rotY, this.targetRotY, 0.22);

      for (const [sId, boost] of this.starGlowBoosts.entries()) {
        if (boost > 1.25) {
          this.starGlowBoosts.set(sId, Math.max(1.25, boost - 0.015));
        }
      }

      this.render();
      requestAnimationFrame(this.animate);
    }

    render() {
      const ctx = this.ctx;
      // 1. Pure #000000 Pitch-Black Void
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, this.width, this.height);

      // 2. Background Starfield (Fast fillRect + cached sprites for bright stars)
      for (const st of this.bgStars) {
        const p = this.project3D(st.x, st.y, st.z);
        if (!p.visible) continue;
        const twinkle = this.reducedMotion
          ? 0.75
          : 0.65 + 0.35 * Math.sin(this.time * st.twinkleSpeed + st.twinkleOffset);
        const alpha = twinkle * Math.min(1, p.scale * 0.9);

        if (st.isBright) {
          drawAstronomicalStar(ctx, p.x, p.y, Math.max(1.0, st.size * p.scale * 0.8), st.color, false, alpha * 0.72, this.time);
        } else {
          ctx.globalAlpha = alpha * 0.58;
          ctx.fillStyle = st.color;
          const r = Math.max(0.5, st.size * p.scale * 0.58);
          ctx.fillRect(p.x - r * 0.5, p.y - r * 0.5, r, r);
        }
      }
      ctx.globalAlpha = 1;

      // 3. Render Realistic Deep-Field Galaxies (Hardware source-over blit = 0ms lag!)
      const query = (this.searchQuery || '').toLowerCase().trim();
      for (const g of this.galaxies) {
        const isSelectedGal = this.selectedGalaxyId === g.id;
        const dimGalaxy = this.mode === 'galaxy' && !isSelectedGal;
        if (dimGalaxy) {
          const labelEl = this.labelElements.get(`gal:${g.id}`);
          if (labelEl) labelEl.style.display = 'none';
          continue;
        }

        const matchesQuery =
          !query ||
          g.name.toLowerCase().includes(query) ||
          g.category.toLowerCase().includes(query) ||
          g.code.toLowerCase().includes(query);

        const centerProj = this.project3D(g.pos_x, g.pos_y, g.pos_z);
        const sprite = this.galaxySprites.get(g.id);

        if (centerProj.visible && sprite) {
          const drawSize = Math.min(1225, (isSelectedGal ? 324 : 464) * centerProj.scale);
          ctx.globalAlpha = isSelectedGal ? 0.38 : matchesQuery ? 0.96 : 0.22;
          ctx.drawImage(
            sprite,
            centerProj.x - drawSize / 2,
            centerProj.y - drawSize / 2,
            drawSize,
            drawSize
          );
          ctx.globalAlpha = 1;
        }

        const labelEl = this.labelElements.get(`gal:${g.id}`);
        if (labelEl) {
          if (this.mode === 'universe' && centerProj.visible && matchesQuery) {
            labelEl.style.display = 'block';
            labelEl.style.left = `${centerProj.x}px`;
            labelEl.style.top = `${centerProj.y}px`;
            labelEl.style.opacity = Math.min(1, centerProj.scale * 1.15);
            labelEl.style.zIndex = String(Math.round(1000 - centerProj.depth));
          } else {
            labelEl.style.display = 'none';
          }
        }
      }

      // 4. Render Teacher-Created Constellations
      const activeConstellations =
        this.mode === 'galaxy' && this.selectedGalaxyId
          ? this.constellations.filter((c) => c.galaxy_id === this.selectedGalaxyId)
          : this.constellations;

      const highlightedStarIds = new Set();
      for (const con of activeConstellations) {
        const isConSelected = this.selectedConstellationId === con.id;
        if (this.selectedConstellationId && !isConSelected) continue;

        const gal = this.galaxies.find((g) => g.id === con.galaxy_id);
        if (!gal || !con.stars || con.stars.length < 2) continue;

        const pts = [];
        for (const cs of con.stars) {
          const st = this.stars.find((s) => s.id === cs.star_id);
          if (!st) continue;
          if (isConSelected) highlightedStarIds.add(st.id);
          const p = this.project3D(gal.pos_x + st.pos_x, gal.pos_y + st.pos_y, gal.pos_z + st.pos_z);
          if (p.visible) pts.push(p);
        }

        if (pts.length >= 2) {
          ctx.save();
          ctx.strokeStyle = isConSelected ? 'rgba(255, 248, 230, 0.85)' : 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = isConSelected ? 1.2 : this.mode === 'galaxy' ? 0.85 : 0.45;
          ctx.globalAlpha = isConSelected ? 0.9 : this.mode === 'galaxy' ? 0.45 : 0.14;

          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      // 5. Render Project Stars (Fast Cached Sprite Blit!)
      for (const s of this.stars) {
        const inSelectedGal = this.mode === 'galaxy' && this.selectedGalaxyId === s.galaxy_id;
        if (this.mode === 'galaxy' && !inSelectedGal) {
          const starLabel = this.labelElements.get(`star:${s.id}`);
          if (starLabel) starLabel.style.display = 'none';
          continue;
        }

        const gal = this.galaxies.find((g) => g.id === s.galaxy_id);
        if (!gal) continue;

        const matchesQuery =
          !query ||
          s.title.toLowerCase().includes(query) ||
          s.student_name.toLowerCase().includes(query) ||
          (s.category || '').toLowerCase().includes(query);

        const wx = gal.pos_x + s.pos_x;
        const wy = gal.pos_y + s.pos_y;
        const wz = gal.pos_z + s.pos_z;
        const proj = this.project3D(wx, wy, wz);

        const isSupernova = s.star_classification === 'Supernova';
        const isHighlighted = !this.selectedConstellationId || highlightedStarIds.has(s.id);

        if (proj.visible) {
          const sparkGlowMult = this.starGlowBoosts.get(s.id) || 1.0;
          const energyBoost = Math.min(2.0, (1 + (s.stellar_energy || 0) * 0.11) * sparkGlowMult);
          const starScale = (isSupernova ? 2.4 : 1.75) * energyBoost * proj.scale * (inSelectedGal ? 0.85 : 0.32);
          const alpha = !isHighlighted || !matchesQuery ? 0.24 : 1.0;

          const starColor = isSupernova ? '#FFE2A8' : '#FFFDF8';
          drawAstronomicalStar(ctx, proj.x, proj.y, Math.max(1.4, starScale), starColor, isSupernova || inSelectedGal, alpha, this.time);
        }

        const starLabel = this.labelElements.get(`star:${s.id}`);
        if (starLabel) {
          const showStarLabel =
            proj.visible &&
            matchesQuery &&
            (inSelectedGal || (this.mode === 'universe' && query.length > 1));

          if (showStarLabel) {
            starLabel.style.display = 'block';
            starLabel.style.left = `${proj.x}px`;
            starLabel.style.top = `${proj.y}px`;
            starLabel.style.opacity = isHighlighted ? '1' : '0.3';
            starLabel.style.zIndex = String(Math.round(1200 - proj.depth));
          } else {
            starLabel.style.display = 'none';
          }
        }
      }

      // 6. Render Spark Starlight Bursts
      for (let i = this.sparkBursts.length - 1; i >= 0; i--) {
        const b = this.sparkBursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.95;
        b.vy *= 0.95;
        b.life -= 0.025;
        if (b.life <= 0) {
          this.sparkBursts.splice(i, 1);
          continue;
        }
        drawAstronomicalStar(ctx, b.x, b.y, b.size * b.life, b.color, false, b.life, this.time);
      }
    }
  }

  // ===========================================================================
  // COSMO — PULSING PURPLE FUTURISTIC ETHEREAL MIST CLOUD ENGINE (/cosmo)
  // Renders an ultra-modern, breathing, multi-layered violet/purple/magenta
  // nebula mist cloud that undulates and pulses organically in pitch-black space
  // ===========================================================================
  class CosmoSphereEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.state = 'idle';
      this.running = true;
      this.time = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Ethereal volumetric mist lobes
      this.mistLobes = [];
      const lobeColors = [
        { r: 139, g: 92, b: 246 },  // Electric Violet #8B5CF6
        { r: 168, g: 85, b: 247 },  // Nebula Purple #A855F7
        { r: 109, g: 40, b: 217 },  // Deep Cosmic Purple #6D28D9
        { r: 192, g: 132, b: 252 }, // Soft Lavender Glow #C084FC
        { r: 124, g: 58, b: 237 },  // Royal Violet #7C3AED
        { r: 216, g: 180, b: 254 }, // Luminous Lilac Core #D8B4FE
        { r: 91, g: 33, b: 182 },   // Abyssal Indigo-Violet #5B21B6
      ];

      for (let i = 0; i < 18; i++) {
        const col = lobeColors[i % lobeColors.length];
        this.mistLobes.push({
          angle: (Math.PI * 2 * i) / 18,
          orbitDist: 0.08 + (i % 5) * 0.14,
          radiusScale: 0.55 + (i % 4) * 0.22,
          speedX: (i % 2 === 0 ? 1 : -1) * (0.35 + (i % 5) * 0.12),
          speedY: (i % 3 === 0 ? -1 : 1) * (0.28 + (i % 4) * 0.14),
          pulsePhase: i * 0.85,
          r: col.r,
          g: col.g,
          b: col.b,
        });
      }

      // Fine suspended luminescence motes drifting inside the mist
      this.motes = [];
      for (let i = 0; i < 65; i++) {
        this.motes.push({
          angle: Math.random() * Math.PI * 2,
          dist: 0.05 + Math.random() * 0.95,
          speed: 0.15 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          size: 0.7 + Math.random() * 1.5,
        });
      }

      this._onResize = () => this.resize();
      window.addEventListener('resize', this._onResize);
      this.resize();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    setState(newState) {
      this.state = newState || 'idle';
    }

    resize() {
      if (!this.canvas) return;
      const parent = this.canvas.parentElement;
      this.width = parent ? parent.clientWidth : window.innerWidth;
      this.height = parent ? parent.clientHeight : window.innerHeight;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    destroy() {
      this.running = false;
      if ("speechSynthesis" in window) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
      window.removeEventListener("resize", this._onResize);
    }

    animate() {
      if (!this.running) return;
      const reduced = document.body.classList.contains('reduced-motion');
      const speedMult =
        this.state === 'thinking'
          ? 2.4
          : this.state === 'listening'
          ? 1.85
          : this.state === 'responding'
          ? 1.55
          : 0.85;

      this.time += (reduced ? 0.002 : 0.016) * speedMult;
      this.render();
      requestAnimationFrame(this.animate);
    }

    render() {
      const ctx = this.ctx;
      const cx = this.width / 2;
      const cy = this.height / 2;

      // Pure pitch-black space backdrop
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, this.width, this.height);

      const baseScale = Math.min(this.width, this.height) * 0.27;
      // Harmonic breathing pulse of the entire mist cloud
      const globalBreath =
        this.state === 'listening'
          ? 1 + 0.12 * Math.sin(this.time * 3.6)
          : this.state === 'responding'
          ? 1 + 0.1 * Math.sin(this.time * 2.8) + 0.04 * Math.cos(this.time * 6.2)
          : 1 + 0.065 * Math.sin(this.time * 1.6);

      const cloudR = baseScale * globalBreath;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // 1. Deep Ambient Purple Mist Veil
      const outerVeil = ctx.createRadialGradient(cx, cy, 0, cx, cy, cloudR * 2.1);
      outerVeil.addColorStop(0, 'rgba(124, 58, 237, 0.22)');
      outerVeil.addColorStop(0.4, 'rgba(88, 28, 135, 0.11)');
      outerVeil.addColorStop(0.75, 'rgba(46, 16, 101, 0.03)');
      outerVeil.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerVeil;
      ctx.beginPath();
      ctx.arc(cx, cy, cloudR * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // 2. Multi-Layered Undulating Volumetric Purple Mist Clouds
      for (const lobe of this.mistLobes) {
        const ox =
          Math.cos(this.time * lobe.speedX + lobe.angle) * (cloudR * lobe.orbitDist) +
          Math.sin(this.time * 0.7 + lobe.pulsePhase) * (cloudR * 0.12);
        const oy =
          Math.sin(this.time * lobe.speedY + lobe.angle) * (cloudR * lobe.orbitDist) +
          Math.cos(this.time * 0.6 + lobe.pulsePhase) * (cloudR * 0.12);

        const lobePulse = 0.85 + 0.28 * Math.sin(this.time * 2.1 + lobe.pulsePhase);
        const rad = cloudR * lobe.radiusScale * lobePulse;

        const lx = cx + ox;
        const ly = cy + oy;

        const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, rad);
        const alphaBoost = this.state === 'listening' || this.state === 'responding' ? 1.35 : 1.0;
        grad.addColorStop(0, `rgba(${lobe.r}, ${lobe.g}, ${lobe.b}, ${0.19 * alphaBoost})`);
        grad.addColorStop(0.38, `rgba(${lobe.r}, ${lobe.g}, ${lobe.b}, ${0.095 * alphaBoost})`);
        grad.addColorStop(0.72, `rgba(${Math.round(lobe.r * 0.6)}, ${Math.round(lobe.g * 0.5)}, ${lobe.b}, ${0.025 * alphaBoost})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(lx, ly, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Soft Pulsing Luminous Violet-White Heart Inside the Mist
      const heartPulse = 0.9 + 0.18 * Math.sin(this.time * 2.4);
      const heartR = cloudR * 0.62 * heartPulse;
      const heartGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, heartR);
      heartGrad.addColorStop(0, 'rgba(245, 235, 255, 0.52)');
      heartGrad.addColorStop(0.28, 'rgba(192, 132, 252, 0.32)');
      heartGrad.addColorStop(0.65, 'rgba(139, 92, 246, 0.12)');
      heartGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = heartGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, heartR, 0, Math.PI * 2);
      ctx.fill();

      // 4. Delicate Floating Luminescent Mist Motes
      for (const m of this.motes) {
        const a = m.angle + this.time * m.speed;
        const d = m.dist * cloudR * (0.85 + 0.2 * Math.sin(this.time + m.phase));
        const mx = cx + Math.cos(a) * d;
        const my = cy + Math.sin(a * 1.3) * d * 0.85;
        const mAlpha = (0.15 + 0.35 * Math.sin(this.time * 2.5 + m.phase)) * (1 - m.dist * 0.5);
        if (mAlpha <= 0) continue;

        ctx.fillStyle = `rgba(233, 213, 255, ${mAlpha})`;
        ctx.beginPath();
        ctx.arc(mx, my, m.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  window.CosmicMap3DEngine = CosmicMap3DEngine;
  window.CosmoSphereEngine = CosmoSphereEngine;
  window.drawAstronomicalStar = drawAstronomicalStar;
  window.startModal3DStarPreview = startModal3DStarPreview;
  window.launchSparkFlight = launchSparkFlight;
  window.playOmniverseIntro = playOmniverseIntro;

  // Pre-warm all 6 real NASA Hubble galaxy photographs
  ["gal-ai", "gal-robotics", "gal-literature", "gal-environment", "gal-entrepreneurship", "gal-astronomy"].forEach((id, idx) => {
    getOrCreateGalaxySprite({ id }, idx);
  });
})();
