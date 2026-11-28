#!/usr/bin/env node
// Optional helper: run `node download-galaxies.js` to save all 28 high-res NASA/ESA/JWST
// galaxy photographs locally into public/galaxies/ for offline use.
const fs = require('node:fs');
const path = require('node:path');

const outDir = path.join(__dirname, 'public', 'galaxies');
fs.mkdirSync(outDir, { recursive: true });

const wmBase = 'https://upload.wikimedia.org/wikipedia/commons/thumb';
const urls = [
  wmBase + '/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/960px-Andromeda_Galaxy_%28with_h-alpha%29.jpg',
  wmBase + '/d/db/Messier51_sRGB.jpg/960px-Messier51_sRGB.jpg',
  wmBase + '/c/c5/M101_hires_STScI-PRC2006-10a.jpg/960px-M101_hires_STScI-PRC2006-10a.jpg',
  wmBase + '/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg/960px-M104_ngc4594_sombrero_galaxy_hi-res.jpg',
  wmBase + '/5/52/Hubble2005-01-barred-spiral-galaxy-NGC1300.jpg/960px-Hubble2005-01-barred-spiral-galaxy-NGC1300.jpg',
  wmBase + '/6/63/Messier_81_HST.jpg/960px-Messier_81_HST.jpg',
  wmBase + '/2/2d/NGC_3982_galaxy_hubble.jpg/960px-NGC_3982_galaxy_hubble.jpg',
  wmBase + '/2/25/Hubble_view_of_NGC_922.jpg/960px-Hubble_view_of_NGC_922.jpg',
  wmBase + '/4/45/NGC_2566_imaged_by_the_Hubble_Space_Telescope.jpg/960px-NGC_2566_imaged_by_the_Hubble_Space_Telescope.jpg',
  wmBase + '/1/17/NGC_4710_%28captured_by_the_Hubble_Space_Telescope%29.jpg/960px-NGC_4710_%28captured_by_the_Hubble_Space_Telescope%29.jpg',
  wmBase + '/2/26/Cartwheel_Galaxy.jpg/960px-Cartwheel_Galaxy.jpg',
  wmBase + '/c/c7/The_Cartwheel_galaxy_seen_by_MUSE_%28potw2210c%29.jpg/960px-The_Cartwheel_galaxy_seen_by_MUSE_%28potw2210c%29.jpg',
  wmBase + '/f/f2/Messier_64_-_The_Black_Eye_Galaxy_%2849706813436%29.jpg/960px-Messier_64_-_The_Black_Eye_Galaxy_%2849706813436%29.jpg',
  wmBase + '/7/72/Messier_83_%28captured_by_ESO%27s_1.5-metre_Danish_telescope%29.jpg/960px-Messier_83_%28captured_by_ESO%27s_1.5-metre_Danish_telescope%29.jpg',
  wmBase + '/b/bd/Messier_33_%28M33%29.jpg/960px-Messier_33_%28M33%29.jpg',
  wmBase + '/c/c3/NGC_4414_%28NASA-med%29.jpg/960px-NGC_4414_%28NASA-med%29.jpg',
  wmBase + '/7/73/NGC_1672_%28without_SN%29_%28potw2445c%29.jpg/960px-NGC_1672_%28without_SN%29_%28potw2445c%29.jpg',
  wmBase + '/0/01/NGC_1365_%28weic2403f%29.jpg/960px-NGC_1365_%28weic2403f%29.jpg',
  wmBase + '/a/a3/The_Fireworks_Galaxy_%28NGC_6946%29.jpg/960px-The_Fireworks_Galaxy_%28NGC_6946%29.jpg',
  wmBase + '/1/1e/Centaurus_A_%28NGC_5128%29_%28eso0315a%29.jpg/960px-Centaurus_A_%28NGC_5128%29_%28eso0315a%29.jpg',
  wmBase + '/9/9d/LEDA_36252%2C_a_cosmic_tadpole.jpg/960px-LEDA_36252%2C_a_cosmic_tadpole.jpg',
  wmBase + '/5/54/Hubble_Interacting_Galaxy_NGC_6050_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_6050_%282008-04-24%29.jpg',
  wmBase + '/2/24/Hubble_Interacting_Galaxy_NGC_7674_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_7674_%282008-04-24%29.jpg',
  wmBase + '/1/17/Hubble_Interacting_Galaxy_NGC_520_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_520_%282008-04-24%29.jpg',
  wmBase + '/4/45/Hubble_Interacting_Galaxy_NGC_6670_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_6670_%282008-04-24%29.jpg',
  wmBase + '/6/60/Hubble_Interacting_Galaxy_NGC_5331_%282008-04-24%29.jpg/960px-Hubble_Interacting_Galaxy_NGC_5331_%282008-04-24%29.jpg',
  wmBase + '/5/5e/Messier83_-_Heic1403a.jpg/960px-Messier83_-_Heic1403a.jpg',
  wmBase + '/6/68/Hubble_traces_%27string-of-pearls%27_star_clusters_in_galaxy_collisions_%28opo2404a%29.jpg/960px-Hubble_traces_%27string-of-pearls%27_star_clusters_in_galaxy_collisions_%28opo2404a%29.jpg',
];

(async () => {
  let ok = 0;
  for (let i = 0; i < urls.length; i++) {
    const fname = `galaxy-${String(i + 1).padStart(2, '0')}.jpg`;
    try {
      const res = await fetch(urls[i], {
        headers: { 'User-Agent': 'RaksOmniverse/1.0 (educational school project)' },
      });
      if (!res.ok) {
        console.log(`Skipped ${fname}: HTTP ${res.status}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(outDir, fname), buf);
      ok++;
      console.log(`Saved ${fname} (${Math.round(buf.length / 1024)} KB)`);
    } catch (err) {
      console.log(`Failed ${fname}: ${err.message}`);
    }
  }
  console.log(`Done: ${ok}/${urls.length} high-res galaxy images saved to public/galaxies/`);
})();
