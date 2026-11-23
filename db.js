const { DatabaseSync } = require('node:sqlite');
const { MongoClient } = require('mongodb');
const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');

function hashPassword(password) {
  const salt = 'raks_omniverse_2050_salt';
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

function nowIso() {
  return new Date().toISOString();
}

function stripMongoId(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const { _id, ...rest } = doc;
  return rest;
}

function getSeedData() {
  const pwd = hashPassword('omniverse2050');

  const settings = [
    { key: 'bright_star_threshold', value: '2' },
    { key: 'radiant_star_threshold', value: '4' },
    { key: 'supernova_threshold', value: '6' },
    { key: 'school_name', value: 'RAKS Pallikkoodam — Omniverse Observatory' },
    { key: 'academic_year', value: '2026–2027 Cosmic Cycle' },
  ];

  const users = [
    {
      id: 'usr-admin-1',
      name: 'Commander Siddharth Nair',
      email: 'admin@raksomniverse.edu',
      password_hash: pwd,
      role: 'admin',
      teacher_code: 'ADM-001',
      department: 'Universe Directorate & Innovation Office',
      grade: null,
      section: null,
      bio: 'Chief Universe Administrator overseeing the Raks Omniverse school ecosystem, galaxy charters, and academic telemetry.',
      avatar_color: '#FFD477',
      account_status: 'active',
      is_sample: 1,
      created_at: '2026-09-01T08:00:00Z',
    },
    {
      id: 'usr-tch-1',
      name: 'Dr. Aris Thorne',
      email: 'aris.thorne@raksomniverse.edu',
      password_hash: pwd,
      role: 'teacher',
      teacher_code: 'TCH-AI-101',
      department: 'Artificial Intelligence & Computational Sciences',
      grade: null,
      section: null,
      bio: 'Lead Galaxy Mentor for Artificial Intelligence & Machine Learning research.',
      avatar_color: '#8855FF',
      account_status: 'active',
      is_sample: 1,
      created_at: '2026-09-01T08:01:00Z',
    },
    {
      id: 'usr-tch-2',
      name: 'Prof. Elena Vance',
      email: 'elena.vance@raksomniverse.edu',
      password_hash: pwd,
      role: 'teacher',
      teacher_code: 'TCH-ROB-102',
      department: 'Mechatronics & Autonomous Robotics',
      grade: null,
      section: null,
      bio: 'Mentor of the Robotics Galaxy, guiding explorers in cybernetics, kinematics, and embedded systems.',
      avatar_color: '#48DFFF',
      account_status: 'active',
      is_sample: 1,
      created_at: '2026-09-01T08:02:00Z',
    },
    {
      id: 'usr-tch-3',
      name: 'Ms. Kavya Menon',
      email: 'kavya.menon@raksomniverse.edu',
      password_hash: pwd,
      role: 'teacher',
      teacher_code: 'TCH-LIT-103',
      department: 'Humanities, Speculative Fiction & Poetics',
      grade: null,
      section: null,
      bio: 'Architect of the Literature Galaxy, nurturing world-building, rhetoric, and philosophical essays.',
      avatar_color: '#FF8ECF',
      account_status: 'active',
      is_sample: 1,
      created_at: '2026-09-01T08:03:00Z',
    },
    {
      id: 'usr-tch-4',
      name: 'Dr. Vikramaditya Rao',
      email: 'vikram.rao@raksomniverse.edu',
      password_hash: pwd,
      role: 'teacher',
      teacher_code: 'TCH-ENV-104',
      department: 'Earth Systems & CleanTech Engineering',
      grade: null,
      section: null,
      bio: 'Mentor for the Environmental Innovation Galaxy, focusing on hydrological sensors and clean energy.',
      avatar_color: '#34D399',
      account_status: 'active',
      is_sample: 1,
      created_at: '2026-09-01T08:04:00Z',
    },
    {
      id: 'usr-tch-5',
      name: 'Mr. Rohan Deshmukh',
      email: 'rohan.deshmukh@raksomniverse.edu',
      password_hash: pwd,
      role: 'teacher',
      teacher_code: 'TCH-ENT-105',
      department: 'Venture Design, FinTech & Economics',
      grade: null,
      section: null,
      bio: 'Mentor of the Entrepreneurship Galaxy, empowering student founders and social impact ventures.',
      avatar_color: '#FFD477',
      account_status: 'active',
      is_sample: 1,
      created_at: '2026-09-01T08:05:00Z',
    },
    {
      id: 'usr-tch-6',
      name: 'Dr. Meera Krishnan',
      email: 'meera.krishnan@raksomniverse.edu',
      password_hash: pwd,
      role: 'teacher',
      teacher_code: 'TCH-AST-106',
      department: 'Astrophysics & Observational Cosmology',
      grade: null,
      section: null,
      bio: 'Director of the Raks Observatory and Mentor of the Astronomy Galaxy.',
      avatar_color: '#91DFFF',
      account_status: 'active',
      is_sample: 1,
      created_at: '2026-09-01T08:06:00Z',
    },
  ];

  const galaxies = [
    {
      id: 'gal-ai',
      code: 'GAL-CSCI-01',
      name: 'Computer Science Galaxy',
      description: 'An expansive spiral galaxy dedicated to computer science, algorithms, neural architectures, and software systems.',
      category: 'Computer Science',
      objectives: 'Design, build, and benchmark computational models and software that solve real-world challenges.',
      grade_eligibility: 'Grades 9 - 12',
      membership_rules: 'Membership approval required from Galaxy Head before contributing missions.',
      meeting_info: 'Tuesdays & Thursdays, 15:45 IST • CSci Core Lab 302',
      teacher_id: 'usr-tch-1',
      accent_color: '#8855FF',
      secondary_color: '#B56BFF',
      visual_type: 'spiral',
      emblem: 'cpu',
      pos_x: -430,
      pos_y: 140,
      pos_z: 50,
      status: 'active',
      is_sample: 1,
      created_at: '2026-09-02T08:00:00Z',
    },
    {
      id: 'gal-robotics',
      code: 'GAL-PHY-02',
      name: 'Physics Galaxy',
      description: 'A kinetic orbital system exploring classical mechanics, electromagnetism, optics, robotics, and experimental physics.',
      category: 'Physics',
      objectives: 'Investigate physical laws through hands-on instrumentation, simulations, and hardware prototypes.',
      grade_eligibility: 'Grades 8 - 12',
      membership_rules: 'Safety briefing and Galaxy Head approval required.',
      meeting_info: 'Wednesdays & Fridays, 15:30 IST • Physics Hangar B',
      teacher_id: 'usr-tch-2',
      accent_color: '#48DFFF',
      secondary_color: '#91DFFF',
      visual_type: 'orbital',
      emblem: 'bot',
      pos_x: 420,
      pos_y: 150,
      pos_z: -40,
      status: 'active',
      is_sample: 1,
      created_at: '2026-09-02T08:01:00Z',
    },
    {
      id: 'gal-literature',
      code: 'GAL-ENG-03',
      name: 'English Galaxy',
      description: 'A luminous nebula of literature, creative writing, rhetoric, media studies, and cross-cultural storytelling.',
      category: 'English',
      objectives: 'Craft original anthologies, critical essays, and interactive narratives.',
      grade_eligibility: 'Grades 6 - 12',
      membership_rules: 'Request membership from the Galaxy Head to contribute.',
      meeting_info: 'Mondays, 15:30 IST • Starlight Amphitheatre',
      teacher_id: 'usr-tch-3',
      accent_color: '#FF8ECF',
      secondary_color: '#B56BFF',
      visual_type: 'nebula',
      emblem: 'feather',
      pos_x: -460,
      pos_y: -175,
      pos_z: -90,
      status: 'active',
      is_sample: 1,
      created_at: '2026-09-02T08:02:00Z',
    },
    {
      id: 'gal-environment',
      code: 'GAL-BIO-04',
      name: 'Biology Galaxy',
      description: 'A vibrant biosphere cluster exploring cellular biology, genetics, ecology, and environmental life sciences.',
      category: 'Biology',
      objectives: 'Conduct living-system experiments, ecological field studies, and sustainable bio-projects.',
      grade_eligibility: 'Grades 7 - 12',
      membership_rules: 'Fieldwork participation and Galaxy Head approval required.',
      meeting_info: 'Thursdays, 16:00 IST • Bio Lab & Eco-Deck',
      teacher_id: 'usr-tch-4',
      accent_color: '#34D399',
      secondary_color: '#48DFFF',
      visual_type: 'cluster',
      emblem: 'leaf',
      pos_x: 40,
      pos_y: -230,
      pos_z: 110,
      status: 'active',
      is_sample: 1,
      created_at: '2026-09-02T08:03:00Z',
    },
    {
      id: 'gal-entrepreneurship',
      code: 'GAL-MATH-05',
      name: 'Mathematics Galaxy',
      description: 'A golden supernova forge dedicated to pure mathematics, cryptography, statistics, and quantitative modelling.',
      category: 'Mathematics',
      objectives: 'Explore proofs, mathematical modeling, and applied quantitative problem solving.',
      grade_eligibility: 'Grades 9 - 12',
      membership_rules: 'Request membership from the Galaxy Head to contribute.',
      meeting_info: 'Fridays, 16:00 IST • Euler Studio 104',
      teacher_id: 'usr-tch-5',
      accent_color: '#FFD477',
      secondary_color: '#FF8ECF',
      visual_type: 'spiral',
      emblem: 'rocket',
      pos_x: 440,
      pos_y: -170,
      pos_z: 70,
      status: 'active',
      is_sample: 1,
      created_at: '2026-09-02T08:04:00Z',
    },
    {
      id: 'gal-astronomy',
      code: 'GAL-CHEM-06',
      name: 'Chemistry Galaxy',
      description: 'A deep-space molecular sector investigating chemical synthesis, spectroscopy, materials science, and reaction kinetics.',
      category: 'Chemistry',
      objectives: 'Design safe analytical experiments, molecular models, and green chemistry studies.',
      grade_eligibility: 'Grades 8 - 12',
      membership_rules: 'Lab coat, safety briefing, and Galaxy Head approval required.',
      meeting_info: 'Saturdays, 10:30 IST • Chemistry Synthesis Lab',
      teacher_id: 'usr-tch-6',
      accent_color: '#91DFFF',
      secondary_color: '#625CFF',
      visual_type: 'orbital',
      emblem: 'telescope',
      pos_x: -20,
      pos_y: 250,
      pos_z: -100,
      status: 'active',
      is_sample: 1,
      created_at: '2026-09-02T08:05:00Z',
    },
  ];

  const memberships = [];

  const approvedProjects = [
    {
      mission_id: 'msn-seed-1', star_id: 'str-seed-1', galaxy_id: 'gal-ai', student_id: 'usr-tch-1', reviewer_id: 'usr-admin-1',
      title: 'Neural Edge Vision', tagline: 'Lightweight CNN for real-time campus recycling sortation.',
      category: 'Computer Science', description: 'Quantized MobileNetV3 model running on edge devices to classify recyclables in real time.',
      objectives: 'Achieve >92% accuracy under 30ms inference latency.', outcomes: '94.2% validation accuracy on 4,000 test frames.',
      github_url: '', live_url: '', video_url: '', documentation: 'Model weights & dataset benchmark', attachments: [],
      submission_date: '2026-09-12T10:00:00Z', approval_date: '2026-09-15T10:00:00Z', feedback: 'Strong edge optimization.',
      pos_x: -24, pos_y: 16, pos_z: 8, star_color: '#8855FF'
    },
    {
      mission_id: 'msn-seed-2', star_id: 'str-seed-2', galaxy_id: 'gal-ai', student_id: 'usr-tch-1', reviewer_id: 'usr-admin-1',
      title: 'Distributed Graph Solver', tagline: 'Parallel shortest-path visualizer for campus transit.',
      category: 'Computer Science', description: 'Interactive WebWorker A* and Dijkstra solver benchmarking large-scale spatial graphs.',
      objectives: 'Compare heuristic pruning across 50k nodes.', outcomes: '3.8x speedup using WebWorkers.',
      github_url: '', live_url: '', video_url: '', documentation: 'Algorithmic complexity report', attachments: [],
      submission_date: '2026-09-14T10:00:00Z', approval_date: '2026-09-17T10:00:00Z', feedback: 'Clean visualization.',
      pos_x: 28, pos_y: -14, pos_z: -10, star_color: '#B56BFF'
    },
    {
      mission_id: 'msn-seed-3', star_id: 'str-seed-3', galaxy_id: 'gal-robotics', student_id: 'usr-tch-2', reviewer_id: 'usr-admin-1',
      title: 'Harmonic Pendulum Rig', tagline: 'Optical encoder rig for damped oscillation telemetry.',
      category: 'Physics', description: 'High-resolution rotary encoder capturing phase-space trajectories of coupled pendulums.',
      objectives: 'Measure damping coefficient and energy transfer.', outcomes: 'Matched theoretical ODEs within 1.4%.',
      github_url: '', live_url: '', video_url: '', documentation: 'Lab telemetry logs', attachments: [],
      submission_date: '2026-09-15T10:00:00Z', approval_date: '2026-09-18T10:00:00Z', feedback: 'Precise instrumentation.',
      pos_x: -22, pos_y: -18, pos_z: 12, star_color: '#48DFFF'
    },
    {
      mission_id: 'msn-seed-4', star_id: 'str-seed-4', galaxy_id: 'gal-robotics', student_id: 'usr-tch-2', reviewer_id: 'usr-admin-1',
      title: 'Laser Interferometer Bench', tagline: 'Michelson interferometer for sub-micron vibration sensing.',
      category: 'Physics', description: 'Desktop optical bench using photodiode fringe counting to detect micro-displacements.',
      objectives: 'Resolve sub-wavelength mirror shifts.', outcomes: 'Detected 320nm acoustic vibrations.',
      github_url: '', live_url: '', video_url: '', documentation: 'Optical alignment guide', attachments: [],
      submission_date: '2026-09-16T10:00:00Z', approval_date: '2026-09-19T10:00:00Z', feedback: 'Excellent fringe stability.',
      pos_x: 26, pos_y: 20, pos_z: -8, star_color: '#91DFFF'
    },
    {
      mission_id: 'msn-seed-5', star_id: 'str-seed-5', galaxy_id: 'gal-literature', student_id: 'usr-tch-3', reviewer_id: 'usr-admin-1',
      title: 'Solarpunk Anthology Vol. I', tagline: 'Speculative short stories on regenerative futures.',
      category: 'English', description: 'Curated collection of speculative fiction exploring ecological resilience and civic technology.',
      objectives: 'Combine world-building with literary craft.', outcomes: 'Published 12-chapter digital zine.',
      github_url: '', live_url: '', video_url: '', documentation: 'Editorial stylebook', attachments: [],
      submission_date: '2026-09-18T10:00:00Z', approval_date: '2026-09-20T10:00:00Z', feedback: 'Vivid narrative voice.',
      pos_x: -26, pos_y: 14, pos_z: -12, star_color: '#FF8ECF'
    },
    {
      mission_id: 'msn-seed-6', star_id: 'str-seed-6', galaxy_id: 'gal-literature', student_id: 'usr-tch-3', reviewer_id: 'usr-admin-1',
      title: 'Rhetoric & Civic Debate Atlas', tagline: 'Annotated archive of classical and modern speeches.',
      category: 'English', description: 'Interactive rhetorical breakdown of ethos, pathos, and logos in landmark public addresses.',
      objectives: 'Map persuasive structures for debate teams.', outcomes: '25 annotated speeches indexed.',
      github_url: '', live_url: '', video_url: '', documentation: 'Rhetorical taxonomy', attachments: [],
      submission_date: '2026-09-19T10:00:00Z', approval_date: '2026-09-21T10:00:00Z', feedback: 'Insightful annotations.',
      pos_x: 22, pos_y: -16, pos_z: 10, star_color: '#B56BFF'
    },
    {
      mission_id: 'msn-seed-7', star_id: 'str-seed-7', galaxy_id: 'gal-environment', student_id: 'usr-tch-4', reviewer_id: 'usr-admin-1',
      title: 'Hydroponic Microbiome Assay', tagline: 'Root-zone bacterial diversity in vertical farms.',
      category: 'Biology', description: 'Comparative study of beneficial rhizobacteria and dissolved oxygen on leafy green yield.',
      objectives: 'Optimize nutrient uptake without synthetic boosters.', outcomes: '22% faster biomass growth.',
      github_url: '', live_url: '', video_url: '', documentation: 'Microscopy & pH logs', attachments: [],
      submission_date: '2026-09-20T10:00:00Z', approval_date: '2026-09-22T10:00:00Z', feedback: 'Well-controlled trials.',
      pos_x: -20, pos_y: -22, pos_z: 8, star_color: '#34D399'
    },
    {
      mission_id: 'msn-seed-8', star_id: 'str-seed-8', galaxy_id: 'gal-environment', student_id: 'usr-tch-4', reviewer_id: 'usr-admin-1',
      title: 'Pollinator Acoustic Monitor', tagline: 'Wingbeat frequency classifier for campus flora.',
      category: 'Biology', description: 'Low-power acoustic sensor logging bee and hoverfly visitation patterns across seasons.',
      objectives: 'Track native pollinator biodiversity.', outcomes: 'Identified 6 distinct pollinator species.',
      github_url: '', live_url: '', video_url: '', documentation: 'Spectrogram catalog', attachments: [],
      submission_date: '2026-09-21T10:00:00Z', approval_date: '2026-09-23T10:00:00Z', feedback: 'Creative bio-acoustics.',
      pos_x: 24, pos_y: 18, pos_z: -12, star_color: '#48DFFF'
    },
    {
      mission_id: 'msn-seed-9', star_id: 'str-seed-9', galaxy_id: 'gal-entrepreneurship', student_id: 'usr-tch-5', reviewer_id: 'usr-admin-1',
      title: 'Elliptic Curve Sandbox', tagline: 'Visualizing modular arithmetic and key exchange.',
      category: 'Mathematics', description: 'Interactive geometric plotter for finite-field elliptic curves and Diffie-Hellman steps.',
      objectives: 'Demystify modern public-key cryptography.', outcomes: 'Used in Grade 11 math seminar.',
      github_url: '', live_url: '', video_url: '', documentation: 'Proof notes', attachments: [],
      submission_date: '2026-09-22T10:00:00Z', approval_date: '2026-09-24T10:00:00Z', feedback: 'Crystal-clear derivations.',
      pos_x: -25, pos_y: 15, pos_z: 10, star_color: '#FFD477'
    },
    {
      mission_id: 'msn-seed-10', star_id: 'str-seed-10', galaxy_id: 'gal-entrepreneurship', student_id: 'usr-tch-5', reviewer_id: 'usr-admin-1',
      title: 'Markov Campus Queue Model', tagline: 'Stochastic simulation of dining hall flow.',
      category: 'Mathematics', description: 'Continuous-time Markov chain model predicting peak lunch wait times and optimal serving lanes.',
      objectives: 'Minimize queue variance during peak breaks.', outcomes: 'Reduced simulated wait by 31%.',
      github_url: '', live_url: '', video_url: '', documentation: 'Transition matrix & plots', attachments: [],
      submission_date: '2026-09-23T10:00:00Z', approval_date: '2026-09-25T10:00:00Z', feedback: 'Great applied probability.',
      pos_x: 26, pos_y: -15, pos_z: -8, star_color: '#FF8ECF'
    },
    {
      mission_id: 'msn-seed-11', star_id: 'str-seed-11', galaxy_id: 'gal-astronomy', student_id: 'usr-tch-6', reviewer_id: 'usr-admin-1',
      title: 'Green Polymer Biofilm', tagline: 'Starch-chitosan biodegradable packaging film.',
      category: 'Chemistry', description: 'Tensile and moisture-barrier testing of glycerol-plasticized biopolymer films.',
      objectives: 'Replace single-use lab wrap with compostable film.', outcomes: 'Degraded 88% in 21-day soil test.',
      github_url: '', live_url: '', video_url: '', documentation: 'FTIR & tensile curves', attachments: [],
      submission_date: '2026-09-24T10:00:00Z', approval_date: '2026-09-26T10:00:00Z', feedback: 'Strong green chemistry.',
      pos_x: -22, pos_y: -16, pos_z: 12, star_color: '#91DFFF'
    },
    {
      mission_id: 'msn-seed-12', star_id: 'str-seed-12', galaxy_id: 'gal-astronomy', student_id: 'usr-tch-6', reviewer_id: 'usr-admin-1',
      title: 'UV-Vis Reaction Kinetics', tagline: 'Real-time absorbance tracking of dye degradation.',
      category: 'Chemistry', description: 'Spectrophotometric rate-law determination for photocatalytic breakdown under UV-A.',
      objectives: 'Determine reaction order and activation energy.', outcomes: 'Confirmed pseudo-first-order kinetics.',
      github_url: '', live_url: '', video_url: '', documentation: 'Beer-Lambert calibration', attachments: [],
      submission_date: '2026-09-25T10:00:00Z', approval_date: '2026-09-27T10:00:00Z', feedback: 'Rigorous kinetic analysis.',
      pos_x: 24, pos_y: 18, pos_z: -10, star_color: '#625CFF'
    },
  ];

  const nonApprovedMissions = [
    {
      id: 'msn-chem-pending-1',
      student_id: 'usr-admin-1',
      explorer_name: 'Ananya Krishnan',
      explorer_grade: 'Grade 11',
      galaxy_id: 'gal-astronomy',
      title: 'Catalytic CO2 Mineralization Bench',
      tagline: 'Testing magnesium-silicate carbonation rates under ambient pressure.',
      category: 'Chemistry',
      description: 'Experimental benchtop reactor measuring pH drop and carbonate precipitation rates using olivine and basalt powders.',
      objectives: 'Quantify CO2 capture efficiency in aqueous mineral slurries.',
      outcomes: 'Awaiting Galaxy Head review for Star Activation.',
      github_url: '',
      live_url: '',
      video_url: '',
      documentation: 'Lab titration & conductivity log',
      attachments: [],
      status: 'Submitted',
      flagged: 0,
      flag_reason: null,
      submission_date: '2026-11-22T09:30:00Z',
      reviewer_id: null,
      feedback: null,
      reviewed_at: null,
      is_sample: 1,
    },
  ];

  const sparkPairs = [];

  const constellations = [];

  const rawSchoolEvents = [
    { title: 'Diwali Holiday Begins', category: 'HOLIDAYS', target_grade: 'All', date: '2026-11-07' },
    { title: "Children's Day Celebration Afternoon", category: 'OTHERS', target_grade: 'All', date: '2026-11-13' },
    { title: "Children's Day SLC", category: 'OTHERS', target_grade: 'All', date: '2026-11-14' },
    { title: 'Winter Carnival Music & Art Show Evening', category: 'OTHERS', target_grade: 'All', date: '2026-12-18' },
    { title: 'Winter Breaks Begins', category: 'HOLIDAYS', target_grade: 'All', date: '2026-12-24' },
    { title: "New Year's Day", category: 'HOLIDAYS', target_grade: 'All', date: '2027-01-01' },
    { title: 'School Reopens & CA Mock 3 Begins', category: 'SCHOOL REOPENS', target_grade: 'All', date: '2027-01-04' },
    { title: 'Makar Sankranti / Pongal', category: 'HOLIDAYS', target_grade: 'All', date: '2027-01-14' },
    { title: 'CA Mock 4 Assessment Begins', category: 'ASSESSMENT', target_grade: 'All', date: '2027-01-18' },
    { title: 'Republic Day', category: 'HOLIDAYS', target_grade: 'All', date: '2027-01-26' },
    { title: 'Dear Week Literacy Week', category: 'OTHERS', target_grade: 'All', date: '2027-02-01' },
    { title: 'Cambridge IGCSE / AS / A LEVEL BEGIN', category: 'OTHERS', target_grade: 'All', date: '2027-02-03' },
    { title: 'Author Talks Book Exhibition', category: 'OTHERS', target_grade: 'All', date: '2027-02-05' },
    { title: 'Cambridge IGCSE / AS / A LEVEL ENDS', category: 'OTHERS', target_grade: 'All', date: '2027-03-04' },
    { title: 'Maha Shivaratri Holiday', category: 'HOLIDAYS', target_grade: 'All', date: '2027-03-06' },
    { title: 'Eid-ul-fitr Holiday', category: 'HOLIDAYS', target_grade: 'All', date: '2027-03-10' },
    { title: 'PI DAY 3 - 8', category: 'OTHERS', target_grade: 'All', date: '2027-03-15' },
  ];

  const catColors = {
    HOLIDAYS: '#34D399',
    'ADJUSTED HOLIDAYS': '#FFD477',
    'SCHOOL REOPENS': '#48DFFF',
    ASSESSMENT: '#FF8ECF',
    OTHERS: '#8855FF',
  };

  const comets = rawSchoolEvents.map((ev, idx) => ({
    id: `cmt-cal-${idx + 1}`,
    title: ev.title,
    description: `School Calendar 2026-2027 · ${ev.category}`,
    event_type: ev.category,
    event_date: ev.date,
    event_time: '',
    location: 'RAKS Pallikkoodam',
    galaxy_id: null,
    creator_id: 'usr-admin-1',
    eligibility: ev.target_grade === 'All' ? 'All Grades' : 'Selected Grades',
    registration_info: 'School Calendar 2026-2027',
    attachments_json: '[]',
    status: 'published',
    color: catColors[ev.category] || '#48DFFF',
    is_sample: 1,
    created_at: '2026-10-01T09:00:00Z',
  }));

  const notifications = [
    {
      id: 'ntf-7',
      recipient_id: 'usr-admin-1',
      notification_type: 'comet',
      title: 'Universe Telemetry Active',
      message: '6 Galaxies are ready across the Raks Omniverse.',
      related_entity_type: 'system',
      related_entity_id: 'omniverse',
      link: '/admin',
      read_status: 0,
      timestamp: '2026-10-30T08:00:00Z',
    },
  ];

  const logs = [
    { id: 'log-1', actor_id: 'usr-admin-1', actor_name: 'Commander Siddharth Nair', actor_role: 'admin', action_type: 'UNIVERSE_INIT', description: 'Initialized Raks Omniverse core sectors and chartered 6 Galaxies', entity_type: 'system', entity_id: 'omniverse', timestamp: '2026-09-01T08:00:00Z' },
  ];

  return {
    settings,
    users,
    galaxies,
    memberships,
    approvedProjects,
    nonApprovedMissions,
    sparkPairs,
    constellations,
    comets,
    notifications,
    logs,
  };
}

// =============================================================================
// STORAGE STATE: MONGODB ATLAS PRIMARY + SQLITE FALLBACK
// =============================================================================
let storageMode = 'sqlite';
let sqliteDb = null;
let mongoClient = null;
let mongoDb = null;
let initPromise = null;

function isConfiguredMongoUri(uri) {
  if (!uri || typeof uri !== 'string') return false;
  const trimmed = uri.trim();
  if (!trimmed.startsWith('mongodb://') && !trimmed.startsWith('mongodb+srv://')) return false;
  const placeholders = ['YOUR_PASSWORD', 'xxxxx', '<password>', '<db_password>', '<username>'];
  return !placeholders.some((p) => trimmed.includes(p));
}

function classifyWithThresholds(energy, t) {
  if (energy >= t.supernova) return 'Supernova';
  if (energy >= t.radiant) return 'Radiant Star';
  if (energy >= t.bright) return 'Bright Star';
  return 'Young Star';
}

function initSqlite() {
  if (sqliteDb) return sqliteDb;
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'omniverse.sqlite');
  sqliteDb = new DatabaseSync(dbPath);
  sqliteDb.exec('PRAGMA foreign_keys = ON;');
  sqliteDb.exec('PRAGMA journal_mode = WAL;');

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'teacher', 'student')),
      teacher_code TEXT,
      department TEXT,
      grade TEXT,
      section TEXT,
      bio TEXT,
      avatar_color TEXT DEFAULT '#8855FF',
      account_status TEXT NOT NULL DEFAULT 'active' CHECK(account_status IN ('active', 'deactivated', 'suspended')),
      created_by TEXT,
      is_sample INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS galaxies (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      objectives TEXT,
      grade_eligibility TEXT DEFAULT 'Grades 8 - 12',
      membership_rules TEXT DEFAULT 'Open to all curious explorers with mentor approval',
      meeting_info TEXT DEFAULT 'Thursdays, 15:30 - 17:00 IST • Innovation Lab',
      teacher_id TEXT NOT NULL,
      accent_color TEXT NOT NULL DEFAULT '#8855FF',
      secondary_color TEXT NOT NULL DEFAULT '#48DFFF',
      visual_type TEXT NOT NULL DEFAULT 'spiral' CHECK(visual_type IN ('spiral', 'nebula', 'orbital', 'cluster')),
      emblem TEXT DEFAULT 'sparkles',
      pos_x REAL NOT NULL DEFAULT 0,
      pos_y REAL NOT NULL DEFAULT 0,
      pos_z REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'archived')),
      is_sample INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS galaxy_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      galaxy_id TEXT NOT NULL,
      membership_status TEXT NOT NULL DEFAULT 'active' CHECK(membership_status IN ('pending', 'active', 'removed')),
      joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, galaxy_id),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (galaxy_id) REFERENCES galaxies(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS missions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      galaxy_id TEXT NOT NULL,
      title TEXT NOT NULL,
      tagline TEXT,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      objectives TEXT,
      outcomes TEXT,
      github_url TEXT,
      live_url TEXT,
      video_url TEXT,
      documentation TEXT,
      attachments_json TEXT DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'Submitted' CHECK(status IN ('Draft', 'Submitted', 'Under Review', 'Changes Requested', 'Approved', 'Rejected')),
      flagged INTEGER DEFAULT 0,
      flag_reason TEXT,
      explorer_name TEXT,
      explorer_grade TEXT,
      submission_date TEXT DEFAULT CURRENT_TIMESTAMP,
      reviewer_id TEXT,
      feedback TEXT,
      reviewed_at TEXT,
      is_sample INTEGER DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (galaxy_id) REFERENCES galaxies(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS stars (
      id TEXT PRIMARY KEY,
      mission_id TEXT UNIQUE NOT NULL,
      galaxy_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      title TEXT NOT NULL,
      stellar_energy INTEGER NOT NULL DEFAULT 0,
      star_classification TEXT NOT NULL DEFAULT 'Young Star' CHECK(star_classification IN ('Young Star', 'Bright Star', 'Radiant Star', 'Supernova')),
      pos_x REAL NOT NULL DEFAULT 0,
      pos_y REAL NOT NULL DEFAULT 0,
      pos_z REAL NOT NULL DEFAULT 0,
      star_color TEXT DEFAULT '#F3F5FF',
      approval_date TEXT DEFAULT CURRENT_TIMESTAMP,
      is_sample INTEGER DEFAULT 0,
      FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
      FOREIGN KEY (galaxy_id) REFERENCES galaxies(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS sparks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      star_id TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, star_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (star_id) REFERENCES stars(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS constellations (
      id TEXT PRIMARY KEY,
      galaxy_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      color TEXT DEFAULT '#48DFFF',
      published INTEGER DEFAULT 1,
      is_sample INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (galaxy_id) REFERENCES galaxies(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS constellation_stars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      constellation_id TEXT NOT NULL,
      star_id TEXT NOT NULL,
      connection_order INTEGER NOT NULL DEFAULT 0,
      coord_x REAL DEFAULT 0,
      coord_y REAL DEFAULT 0,
      UNIQUE(constellation_id, star_id),
      FOREIGN KEY (constellation_id) REFERENCES constellations(id) ON DELETE CASCADE,
      FOREIGN KEY (star_id) REFERENCES stars(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS comets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_date TEXT NOT NULL,
      event_time TEXT DEFAULT '10:00 IST',
      location TEXT NOT NULL,
      galaxy_id TEXT,
      creator_id TEXT NOT NULL,
      eligibility TEXT DEFAULT 'All Explorers (Grades 6 - 12)',
      registration_info TEXT DEFAULT 'Register via Omniverse Portal before trajectory perihelion',
      attachments_json TEXT DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'published',
      color TEXT NOT NULL DEFAULT '#48DFFF',
      is_sample INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (galaxy_id) REFERENCES galaxies(id) ON DELETE SET NULL,
      FOREIGN KEY (creator_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      recipient_id TEXT NOT NULL,
      notification_type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      related_entity_type TEXT,
      related_entity_id TEXT,
      link TEXT DEFAULT '/cosmic-map',
      read_status INTEGER NOT NULL DEFAULT 0,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT,
      actor_name TEXT,
      actor_role TEXT,
      action_type TEXT NOT NULL,
      description TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const seed = getSeedData();
  const existingSettings = sqliteDb.prepare('SELECT COUNT(*) as cnt FROM system_settings').get();
  if (existingSettings.cnt === 0) {
    const insSet = sqliteDb.prepare('INSERT INTO system_settings (key, value) VALUES (?, ?)');
    for (const s of seed.settings) insSet.run(s.key, s.value);
  }

  const userCount = sqliteDb.prepare('SELECT COUNT(*) as cnt FROM users').get();
  if (userCount.cnt === 0) {
    const insUser = sqliteDb.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, teacher_code, department, grade, section, bio, avatar_color, is_sample)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const u of seed.users) {
      insUser.run(u.id, u.name, u.email, u.password_hash, u.role, u.teacher_code, u.department, u.grade, u.section, u.bio, u.avatar_color, u.is_sample);
    }

    const insGal = sqliteDb.prepare(`
      INSERT INTO galaxies (id, code, name, description, category, objectives, grade_eligibility, membership_rules, meeting_info, teacher_id, accent_color, secondary_color, visual_type, emblem, pos_x, pos_y, pos_z, is_sample)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    for (const g of seed.galaxies) {
      insGal.run(g.id, g.code, g.name, g.description, g.category, g.objectives, g.grade_eligibility, g.membership_rules, g.meeting_info, g.teacher_id, g.accent_color, g.secondary_color, g.visual_type, g.emblem, g.pos_x, g.pos_y, g.pos_z);
    }

    const insMem = sqliteDb.prepare('INSERT INTO galaxy_members (student_id, galaxy_id, membership_status) VALUES (?, ?, ?)');
    for (const m of seed.memberships) insMem.run(m.student_id, m.galaxy_id, m.membership_status);

    const insMsn = sqliteDb.prepare(`
      INSERT INTO missions (id, student_id, galaxy_id, title, tagline, category, description, objectives, outcomes, github_url, live_url, video_url, documentation, attachments_json, status, submission_date, reviewer_id, feedback, reviewed_at, is_sample)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Approved', ?, ?, ?, ?, 1)
    `);
    const insStr = sqliteDb.prepare(`
      INSERT INTO stars (id, mission_id, galaxy_id, student_id, title, stellar_energy, star_classification, pos_x, pos_y, pos_z, star_color, approval_date, is_sample)
      VALUES (?, ?, ?, ?, ?, 0, 'Young Star', ?, ?, ?, ?, ?, 1)
    `);
    for (const p of seed.approvedProjects) {
      insMsn.run(p.mission_id, p.student_id, p.galaxy_id, p.title, p.tagline, p.category, p.description, p.objectives, p.outcomes, p.github_url, p.live_url, p.video_url, p.documentation, JSON.stringify(p.attachments), p.submission_date, p.reviewer_id, p.feedback, p.approval_date);
      insStr.run(p.star_id, p.mission_id, p.galaxy_id, p.student_id, p.title, p.pos_x, p.pos_y, p.pos_z, p.star_color, p.approval_date);
    }

    const insOther = sqliteDb.prepare(`
      INSERT INTO missions (id, student_id, explorer_name, explorer_grade, galaxy_id, title, tagline, category, description, objectives, outcomes, github_url, live_url, video_url, documentation, attachments_json, status, submission_date, reviewer_id, feedback, is_sample)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    for (const m of seed.nonApprovedMissions) {
      insOther.run(m.id, m.student_id, m.explorer_name || null, m.explorer_grade || null, m.galaxy_id, m.title, m.tagline, m.category, m.description, m.objectives, m.outcomes, m.github_url, m.live_url, m.video_url, m.documentation, JSON.stringify(m.attachments), m.status, m.submission_date, m.reviewer_id, m.feedback);
    }

    const insSpk = sqliteDb.prepare('INSERT INTO sparks (id, user_id, star_id) VALUES (?, ?, ?)');
    seed.sparkPairs.forEach(([uId, sId], idx) => insSpk.run(`spk-seed-${idx + 1}`, uId, sId));
    recalculateAllStarsSqlite();

    const insCon = sqliteDb.prepare('INSERT INTO constellations (id, galaxy_id, teacher_id, name, description, color, published, is_sample) VALUES (?, ?, ?, ?, ?, ?, 1, 1)');
    const insConStar = sqliteDb.prepare('INSERT INTO constellation_stars (constellation_id, star_id, connection_order, coord_x, coord_y) VALUES (?, ?, ?, ?, ?)');
    for (const c of seed.constellations) {
      insCon.run(c.id, c.galaxy_id, c.teacher_id, c.name, c.description, c.color);
      for (const s of c.stars) insConStar.run(c.id, s.star_id, s.order, s.x, s.y);
    }

    const insCmt = sqliteDb.prepare('INSERT INTO comets (id, title, description, event_type, event_date, event_time, location, galaxy_id, creator_id, eligibility, registration_info, color, is_sample) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)');
    for (const c of seed.comets) insCmt.run(c.id, c.title, c.description, c.event_type, c.event_date, c.event_time, c.location, c.galaxy_id, c.creator_id, c.eligibility, c.registration_info, c.color);

    const insNtf = sqliteDb.prepare('INSERT INTO notifications (id, recipient_id, notification_type, title, message, related_entity_type, related_entity_id, link, read_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const n of seed.notifications) insNtf.run(n.id, n.recipient_id, n.notification_type, n.title, n.message, n.related_entity_type, n.related_entity_id, n.link, n.read_status);

    const insLog = sqliteDb.prepare('INSERT INTO activity_logs (id, actor_id, actor_name, actor_role, action_type, description, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const l of seed.logs) insLog.run(l.id, l.actor_id, l.actor_name, l.actor_role, l.action_type, l.description, l.entity_type, l.entity_id);
  } else {
    const updGal = sqliteDb.prepare('UPDATE galaxies SET name = ?, code = ?, category = ?, description = ?, membership_rules = ?, pos_x = ?, pos_y = ?, pos_z = ? WHERE id = ?');
    for (const g of seed.galaxies) {
      updGal.run(g.name, g.code, g.category, g.description, g.membership_rules, g.pos_x, g.pos_y, g.pos_z, g.id);
    }
  }
  try { sqliteDb.exec('ALTER TABLE users ADD COLUMN created_by TEXT'); } catch {}
  try { sqliteDb.exec('ALTER TABLE missions ADD COLUMN explorer_name TEXT'); } catch {}
  try { sqliteDb.exec('ALTER TABLE missions ADD COLUMN explorer_grade TEXT'); } catch {}
  return sqliteDb;
}

function getThresholdsSqlite() {
  const rows = sqliteDb.prepare('SELECT key, value FROM system_settings').all();
  const map = {};
  for (const r of rows) map[r.key] = r.value;
  return {
    bright: parseInt(map.bright_star_threshold || '2', 10),
    radiant: parseInt(map.radiant_star_threshold || '4', 10),
    supernova: parseInt(map.supernova_threshold || '6', 10),
  };
}

function recalculateStarEnergySqlite(starId) {
  const row = sqliteDb.prepare('SELECT COUNT(*) as cnt FROM sparks WHERE star_id = ?').get(starId);
  const energy = row ? row.cnt : 0;
  const classification = classifyWithThresholds(energy, getThresholdsSqlite());
  sqliteDb.prepare('UPDATE stars SET stellar_energy = ?, star_classification = ? WHERE id = ?').run(energy, classification, starId);
  return { energy, classification };
}

function recalculateAllStarsSqlite() {
  const stars = sqliteDb.prepare('SELECT id FROM stars').all();
  for (const s of stars) recalculateStarEnergySqlite(s.id);
}

async function initMongo() {
  const uri = process.env.MONGODB_URI.trim();
  mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await mongoClient.connect();
  mongoDb = mongoClient.db();

  await Promise.all([
    mongoDb.collection('system_settings').createIndex({ key: 1 }, { unique: true }),
    mongoDb.collection('users').createIndex({ id: 1 }, { unique: true }),
    mongoDb.collection('users').createIndex({ email: 1 }, { unique: true }),
    mongoDb.collection('sessions').createIndex({ token: 1 }, { unique: true }),
    mongoDb.collection('galaxies').createIndex({ id: 1 }, { unique: true }),
    mongoDb.collection('galaxies').createIndex({ code: 1 }, { unique: true }),
    mongoDb.collection('galaxy_members').createIndex({ student_id: 1, galaxy_id: 1 }, { unique: true }),
    mongoDb.collection('missions').createIndex({ id: 1 }, { unique: true }),
    mongoDb.collection('stars').createIndex({ id: 1 }, { unique: true }),
    mongoDb.collection('stars').createIndex({ mission_id: 1 }, { unique: true }),
    mongoDb.collection('sparks').createIndex({ user_id: 1, star_id: 1 }, { unique: true }),
    mongoDb.collection('constellations').createIndex({ id: 1 }, { unique: true }),
    mongoDb.collection('constellation_stars').createIndex({ constellation_id: 1, star_id: 1 }, { unique: true }),
    mongoDb.collection('comets').createIndex({ id: 1 }, { unique: true }),
    mongoDb.collection('notifications').createIndex({ id: 1 }, { unique: true }),
    mongoDb.collection('notifications').createIndex({ recipient_id: 1 }),
    mongoDb.collection('activity_logs').createIndex({ id: 1 }, { unique: true }),
  ]);

  const seed = getSeedData();
  const settingsCount = await mongoDb.collection('system_settings').countDocuments();
  if (settingsCount === 0) {
    await mongoDb.collection('system_settings').insertMany(seed.settings.map((s) => ({ ...s, updated_at: nowIso() })));
  }

  const userCount = await mongoDb.collection('users').countDocuments();
  if (userCount === 0) {
    if (seed.users.length) await mongoDb.collection('users').insertMany(seed.users);
    if (seed.galaxies.length) await mongoDb.collection('galaxies').insertMany(seed.galaxies);
    if (seed.memberships.length) await mongoDb.collection('galaxy_members').insertMany(seed.memberships);

    const t = await getThresholdsMongo();
    const sparkCounts = {};
    const sparkDocs = seed.sparkPairs.map(([user_id, star_id], idx) => {
      sparkCounts[star_id] = (sparkCounts[star_id] || 0) + 1;
      return { id: `spk-seed-${idx + 1}`, user_id, star_id, timestamp: nowIso() };
    });

    const missionDocs = [];
    const starDocs = [];
    for (const p of seed.approvedProjects) {
      missionDocs.push({
        id: p.mission_id,
        student_id: p.student_id,
        galaxy_id: p.galaxy_id,
        title: p.title,
        tagline: p.tagline,
        category: p.category,
        description: p.description,
        objectives: p.objectives,
        outcomes: p.outcomes,
        github_url: p.github_url,
        live_url: p.live_url,
        video_url: p.video_url,
        documentation: p.documentation,
        attachments_json: JSON.stringify(p.attachments),
        status: 'Approved',
        flagged: 0,
        flag_reason: null,
        submission_date: p.submission_date,
        reviewer_id: p.reviewer_id,
        feedback: p.feedback,
        reviewed_at: p.approval_date,
        is_sample: 1,
      });
      const energy = sparkCounts[p.star_id] || 0;
      starDocs.push({
        id: p.star_id,
        mission_id: p.mission_id,
        galaxy_id: p.galaxy_id,
        student_id: p.student_id,
        title: p.title,
        stellar_energy: energy,
        star_classification: classifyWithThresholds(energy, t),
        pos_x: p.pos_x,
        pos_y: p.pos_y,
        pos_z: p.pos_z,
        star_color: p.star_color,
        approval_date: p.approval_date,
        is_sample: 1,
      });
    }
    for (const m of seed.nonApprovedMissions) {
      missionDocs.push({ ...m, attachments_json: JSON.stringify(m.attachments) });
    }

    if (missionDocs.length) await mongoDb.collection('missions').insertMany(missionDocs);
    if (starDocs.length) await mongoDb.collection('stars').insertMany(starDocs);
    if (sparkDocs.length) await mongoDb.collection('sparks').insertMany(sparkDocs);

    const conDocs = [];
    const conStarDocs = [];
    for (const c of seed.constellations) {
      const { stars, ...conDoc } = c;
      conDocs.push(conDoc);
      stars.forEach((s) => {
        conStarDocs.push({
          constellation_id: c.id,
          star_id: s.star_id,
          connection_order: s.order,
          coord_x: s.x,
          coord_y: s.y,
        });
      });
    }
    if (conDocs.length) await mongoDb.collection('constellations').insertMany(conDocs);
    if (conStarDocs.length) await mongoDb.collection('constellation_stars').insertMany(conStarDocs);
    if (seed.comets.length) await mongoDb.collection('comets').insertMany(seed.comets);
    if (seed.notifications.length) await mongoDb.collection('notifications').insertMany(seed.notifications);
    if (seed.logs.length) await mongoDb.collection('activity_logs').insertMany(seed.logs);
  } else {
    for (const g of seed.galaxies) {
      await mongoDb.collection('galaxies').updateOne(
        { id: g.id },
        { $set: { name: g.name, code: g.code, category: g.category, description: g.description, membership_rules: g.membership_rules, pos_x: g.pos_x, pos_y: g.pos_y, pos_z: g.pos_z } }
      );
    }
    // Remove previously seeded sample student accounts & sample constellations
    const sampleStudents = await mongoDb.collection('users').find({ role: 'student', is_sample: 1 }).toArray();
    if (sampleStudents.length > 0) {
      const sampleIds = sampleStudents.map((u) => u.id);
      await Promise.all([
        mongoDb.collection('users').deleteMany({ id: { $in: sampleIds } }),
        mongoDb.collection('sessions').deleteMany({ user_id: { $in: sampleIds } }),
        mongoDb.collection('galaxy_members').deleteMany({ student_id: { $in: sampleIds } }),
        mongoDb.collection('missions').deleteMany({ student_id: { $in: sampleIds }, is_sample: 1 }),
        mongoDb.collection('stars').deleteMany({ student_id: { $in: sampleIds }, is_sample: 1 }),
        mongoDb.collection('sparks').deleteMany({ $or: [{ user_id: { $in: sampleIds } }, { id: /^spk-seed-/ }] }),
        mongoDb.collection('notifications').deleteMany({ recipient_id: { $in: sampleIds } }),
      ]);
    }
    await Promise.all([
      mongoDb.collection('constellations').deleteMany({ is_sample: 1 }),
      mongoDb.collection('constellation_stars').deleteMany({ constellation_id: /^con-/ }),
      mongoDb.collection('comets').deleteMany({ is_sample: 1 }),
    ]);
    if (seed.comets.length) {
      await mongoDb.collection('comets').insertMany(seed.comets);
    }
    const pendingCount = await mongoDb.collection('missions').countDocuments({ status: { $in: ['Submitted', 'Under Review'] } });
    if (pendingCount === 0 && seed.nonApprovedMissions.length > 0) {
      for (const m of seed.nonApprovedMissions) {
        await mongoDb.collection('missions').updateOne(
          { id: m.id },
          { $setOnInsert: { ...m, attachments_json: JSON.stringify(m.attachments || []) } },
          { upsert: true }
        );
      }
    } else if (seed.nonApprovedMissions.length > 0) {
      for (const m of seed.nonApprovedMissions) {
        if (m.explorer_name) {
          await mongoDb.collection('missions').updateOne(
            { id: m.id },
            { $set: { explorer_name: m.explorer_name, explorer_grade: m.explorer_grade || null } }
          );
        }
      }
    }
    const starCount = await mongoDb.collection('stars').countDocuments();
    if (starCount === 0 && seed.approvedProjects.length > 0) {
      const t = await getThresholdsMongo();
      const mDocs = seed.approvedProjects.map((p) => ({
        id: p.mission_id, student_id: p.student_id, galaxy_id: p.galaxy_id, title: p.title, tagline: p.tagline,
        category: p.category, description: p.description, objectives: p.objectives, outcomes: p.outcomes,
        github_url: p.github_url, live_url: p.live_url, video_url: p.video_url, documentation: p.documentation,
        attachments_json: JSON.stringify(p.attachments), status: 'Approved', flagged: 0, flag_reason: null,
        submission_date: p.submission_date, reviewer_id: p.reviewer_id, feedback: p.feedback,
        reviewed_at: p.approval_date, is_sample: 1,
      }));
      const sDocs = seed.approvedProjects.map((p) => ({
        id: p.star_id, mission_id: p.mission_id, galaxy_id: p.galaxy_id, student_id: p.student_id,
        title: p.title, stellar_energy: 0, star_classification: classifyWithThresholds(0, t),
        pos_x: p.pos_x, pos_y: p.pos_y, pos_z: p.pos_z, star_color: p.star_color,
        approval_date: p.approval_date, is_sample: 1,
      }));
      await mongoDb.collection('missions').insertMany(mDocs);
      await mongoDb.collection('stars').insertMany(sDocs);
    }
  }
}

async function getThresholdsMongo() {
  const rows = await mongoDb.collection('system_settings').find({}).toArray();
  const map = {};
  for (const r of rows) map[r.key] = r.value;
  return {
    bright: parseInt(map.bright_star_threshold || '2', 10),
    radiant: parseInt(map.radiant_star_threshold || '4', 10),
    supernova: parseInt(map.supernova_threshold || '6', 10),
  };
}

async function init() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    if (isConfiguredMongoUri(process.env.MONGODB_URI)) {
      try {
        await initMongo();
        storageMode = 'mongodb';
        console.log('RAKS OMNIVERSE connected to MongoDB Atlas.');
        return storageMode;
      } catch (err) {
        console.warn(`MongoDB Atlas connection failed (${err.message}). Falling back to local SQLite.`);
      }
    }
    initSqlite();
    storageMode = 'sqlite';
    return storageMode;
  })();
  return initPromise;
}

const SAFE_USER_FIELDS = ['id', 'name', 'email', 'role', 'teacher_code', 'department', 'grade', 'section', 'bio', 'avatar_color', 'account_status', 'created_at'];
function pickSafeUser(u) {
  if (!u) return null;
  const out = {};
  for (const f of SAFE_USER_FIELDS) out[f] = u[f] ?? null;
  return out;
}

const store = {
  init,
  getStorageMode: () => storageMode,
  hashPassword,

  async getThresholds() {
    await init();
    return storageMode === 'mongodb' ? getThresholdsMongo() : getThresholdsSqlite();
  },

  async updateThresholds(body) {
    await init();
    if (storageMode === 'mongodb') {
      const col = mongoDb.collection('system_settings');
      if (body.bright != null) await col.updateOne({ key: 'bright_star_threshold' }, { $set: { value: String(Math.max(1, parseInt(body.bright, 10))), updated_at: nowIso() } }, { upsert: true });
      if (body.radiant != null) await col.updateOne({ key: 'radiant_star_threshold' }, { $set: { value: String(Math.max(2, parseInt(body.radiant, 10))), updated_at: nowIso() } }, { upsert: true });
      if (body.supernova != null) await col.updateOne({ key: 'supernova_threshold' }, { $set: { value: String(Math.max(3, parseInt(body.supernova, 10))), updated_at: nowIso() } }, { upsert: true });
      const t = await getThresholdsMongo();
      const stars = await mongoDb.collection('stars').find({}).toArray();
      for (const s of stars) {
        const cnt = await mongoDb.collection('sparks').countDocuments({ star_id: s.id });
        await mongoDb.collection('stars').updateOne({ id: s.id }, { $set: { stellar_energy: cnt, star_classification: classifyWithThresholds(cnt, t) } });
      }
      return t;
    }
    const updateStmt = sqliteDb.prepare(`
      INSERT INTO system_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);
    if (body.bright != null) updateStmt.run('bright_star_threshold', String(Math.max(1, parseInt(body.bright, 10))));
    if (body.radiant != null) updateStmt.run('radiant_star_threshold', String(Math.max(2, parseInt(body.radiant, 10))));
    if (body.supernova != null) updateStmt.run('supernova_threshold', String(Math.max(3, parseInt(body.supernova, 10))));
    recalculateAllStarsSqlite();
    return getThresholdsSqlite();
  },

  async getUserByToken(token) {
    await init();
    if (!token) return null;
    if (storageMode === 'mongodb') {
      const session = await mongoDb.collection('sessions').findOne({ token });
      if (!session) return null;
      const user = await mongoDb.collection('users').findOne({ id: session.user_id, account_status: 'active' });
      return pickSafeUser(user);
    }
    const session = sqliteDb.prepare('SELECT user_id FROM sessions WHERE token = ?').get(token);
    if (!session) return null;
    const user = sqliteDb.prepare(`
      SELECT id, name, email, role, teacher_code, department, grade, section, bio, avatar_color, account_status, created_at
      FROM users WHERE id = ?
    `).get(session.user_id);
    return user && user.account_status === 'active' ? user : null;
  },

  async getFallbackUser(demoUserId) {
    await init();
    if (storageMode === 'mongodb') {
      const u = await mongoDb.collection('users').findOne({ id: demoUserId, account_status: 'active' })
        || await mongoDb.collection('users').findOne({ account_status: 'active' });
      return pickSafeUser(u);
    }
    return sqliteDb.prepare(`
      SELECT id, name, email, role, teacher_code, department, grade, section, bio, avatar_color, account_status, created_at
      FROM users WHERE id = ? AND account_status = 'active'
    `).get(demoUserId) || sqliteDb.prepare(`
      SELECT id, name, email, role, teacher_code, department, grade, section, bio, avatar_color, account_status, created_at
      FROM users WHERE account_status = 'active' LIMIT 1
    `).get();
  },

  async getFullUserById(id) {
    await init();
    if (storageMode === 'mongodb') {
      return stripMongoId(await mongoDb.collection('users').findOne({ id }));
    }
    return sqliteDb.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  async getFullUserByEmail(email) {
    await init();
    if (storageMode === 'mongodb') {
      return stripMongoId(await mongoDb.collection('users').findOne({ email: email.trim().toLowerCase() }));
    }
    return sqliteDb.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
  },

  async listDemoUsers() {
    await init();
    if (storageMode === 'mongodb') {
      const users = await mongoDb.collection('users').find({ account_status: 'active' }).toArray();
      const order = { admin: 1, teacher: 2, student: 3 };
      return users
        .sort((a, b) => (order[a.role] || 9) - (order[b.role] || 9) || a.name.localeCompare(b.name))
        .map((u) => ({
          id: u.id, name: u.name, email: u.email, role: u.role, teacher_code: u.teacher_code,
          department: u.department, grade: u.grade, section: u.section, avatar_color: u.avatar_color, account_status: u.account_status,
        }));
    }
    return sqliteDb.prepare(`
      SELECT id, name, email, role, teacher_code, department, grade, section, avatar_color, account_status
      FROM users WHERE account_status = 'active'
      ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'teacher' THEN 2 ELSE 3 END, name ASC
    `).all();
  },

  async getUnreadNotificationCount(userId) {
    await init();
    if (!userId) return 0;
    if (storageMode === 'mongodb') {
      return mongoDb.collection('notifications').countDocuments({ recipient_id: userId, read_status: 0 });
    }
    return sqliteDb.prepare('SELECT COUNT(*) as c FROM notifications WHERE recipient_id = ? AND read_status = 0').get(userId).c;
  },

  async createSession(token, userId) {
    await init();
    if (storageMode === 'mongodb') {
      await mongoDb.collection('sessions').insertOne({ token, user_id: userId, created_at: nowIso() });
      return;
    }
    sqliteDb.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, userId);
  },

  async logActivity(actor, actionType, description, entityType = null, entityId = null) {
    await init();
    const id = 'log-' + crypto.randomBytes(6).toString('hex');
    if (storageMode === 'mongodb') {
      await mongoDb.collection('activity_logs').insertOne({
        id,
        actor_id: actor ? actor.id : null,
        actor_name: actor ? actor.name : 'System',
        actor_role: actor ? actor.role : 'system',
        action_type: actionType,
        description,
        entity_type: entityType,
        entity_id: entityId,
        timestamp: nowIso(),
      });
      return;
    }
    sqliteDb.prepare(`
      INSERT INTO activity_logs (id, actor_id, actor_name, actor_role, action_type, description, entity_type, entity_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, actor ? actor.id : null, actor ? actor.name : 'System', actor ? actor.role : 'system', actionType, description, entityType, entityId);
  },

  async createNotification({ recipientId, type, title, message, entityType = null, entityId = null, link = '/cosmic-map' }) {
    await init();
    const id = 'ntf-' + crypto.randomBytes(6).toString('hex');
    if (storageMode === 'mongodb') {
      await mongoDb.collection('notifications').insertOne({
        id,
        recipient_id: recipientId,
        notification_type: type,
        title,
        message,
        related_entity_type: entityType,
        related_entity_id: entityId,
        link,
        read_status: 0,
        timestamp: nowIso(),
      });
      return id;
    }
    sqliteDb.prepare(`
      INSERT INTO notifications (id, recipient_id, notification_type, title, message, related_entity_type, related_entity_id, link, read_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(id, recipientId, type, title, message, entityType, entityId, link);
    return id;
  },

  async getUniverseData(currentUser) {
    await init();
    if (storageMode === 'mongodb') {
      const [users, galaxiesRaw, allMembers, missions, starsRaw, sparks, constellationsRaw, conStars, cometsRaw, thresholds] = await Promise.all([
        mongoDb.collection('users').find({}).toArray(),
        mongoDb.collection('galaxies').find({ status: 'active' }).sort({ created_at: 1 }).toArray(),
        mongoDb.collection('galaxy_members').find({}).toArray(),
        mongoDb.collection('missions').find({}).toArray(),
        mongoDb.collection('stars').find({}).sort({ stellar_energy: -1, approval_date: -1 }).toArray(),
        mongoDb.collection('sparks').find({}).toArray(),
        mongoDb.collection('constellations').find({ published: 1 }).sort({ created_at: -1 }).toArray(),
        mongoDb.collection('constellation_stars').find({}).sort({ connection_order: 1 }).toArray(),
        mongoDb.collection('comets').find({ status: { $ne: 'archived' } }).sort({ event_date: 1 }).toArray(),
        getThresholdsMongo(),
      ]);

      const members = allMembers.filter((m) => m.membership_status === 'active');
      const userMap = new Map(users.map((u) => [u.id, u]));
      const missionMap = new Map(missions.map((m) => [m.id, m]));
      const galaxyMap = new Map(galaxiesRaw.map((g) => [g.id, g]));
      const activeGalaxyIds = new Set(galaxiesRaw.map((g) => g.id));

      const userMembershipStatusMap = new Map();
      if (currentUser) {
        for (const m of allMembers) {
          if (m.student_id === currentUser.id && m.membership_status !== 'removed') {
            userMembershipStatusMap.set(m.galaxy_id, m.membership_status);
          }
        }
      }
      const userSparks = new Set(
        currentUser ? sparks.filter((s) => s.user_id === currentUser.id).map((s) => s.star_id) : []
      );

      const galaxies = galaxiesRaw.map((g) => {
        const teacher = userMap.get(g.teacher_id);
        const gStars = starsRaw.filter((s) => s.galaxy_id === g.id);
        const gCons = constellationsRaw.filter((c) => c.galaxy_id === g.id);
        const gMems = members.filter((m) => m.galaxy_id === g.id);
        const memStatus = userMembershipStatusMap.get(g.id) || null;
        return {
          ...stripMongoId(g),
          teacher_name: teacher?.name || null,
          teacher_email: teacher?.email || null,
          teacher_department: teacher?.department || null,
          star_count: gStars.length,
          constellation_count: gCons.length,
          member_count: gMems.length,
          total_energy: gStars.reduce((acc, s) => acc + (s.stellar_energy || 0), 0),
          is_member: memStatus === 'active',
          membership_pending: memStatus === 'pending',
          membership_status: memStatus,
        };
      });

      const stars = starsRaw
        .filter((s) => activeGalaxyIds.has(s.galaxy_id))
        .map((s) => {
          const m = missionMap.get(s.mission_id) || {};
          const u = userMap.get(s.student_id) || {};
          const g = galaxyMap.get(s.galaxy_id) || {};
          const rev = m.reviewer_id ? userMap.get(m.reviewer_id) : null;
          let attachments = [];
          try { attachments = JSON.parse(m.attachments_json || '[]'); } catch {}
          return {
            ...stripMongoId(s),
            student_name: u.name || null,
            student_grade: u.grade || null,
            student_section: u.section || null,
            student_avatar_color: u.avatar_color || null,
            galaxy_name: g.name || null,
            galaxy_code: g.code || null,
            galaxy_color: g.accent_color || null,
            tagline: m.tagline || null,
            category: m.category || null,
            description: m.description || null,
            objectives: m.objectives || null,
            outcomes: m.outcomes || null,
            github_url: m.github_url || null,
            live_url: m.live_url || null,
            video_url: m.video_url || null,
            documentation: m.documentation || null,
            attachments_json: m.attachments_json || '[]',
            submission_date: m.submission_date || null,
            feedback: m.feedback || null,
            reviewer_name: rev?.name || null,
            has_sparked: userSparks.has(s.id),
            attachments,
          };
        });

      const starMap = new Map(stars.map((s) => [s.id, s]));
      const constellations = constellationsRaw
        .filter((c) => activeGalaxyIds.has(c.galaxy_id))
        .map((c) => {
          const g = galaxyMap.get(c.galaxy_id) || {};
          const t = userMap.get(c.teacher_id) || {};
          const cStars = conStars
            .filter((cs) => cs.constellation_id === c.id && starMap.has(cs.star_id))
            .map((cs) => {
              const st = starMap.get(cs.star_id);
              return {
                ...stripMongoId(cs),
                star_title: st.title,
                stellar_energy: st.stellar_energy,
                star_classification: st.star_classification,
                pos_x: st.pos_x,
                pos_y: st.pos_y,
                pos_z: st.pos_z,
                student_name: st.student_name,
                category: st.category,
                tagline: st.tagline,
              };
            });
          return {
            ...stripMongoId(c),
            galaxy_name: g.name || null,
            galaxy_color: g.accent_color || null,
            teacher_name: t.name || null,
            stars: cStars,
          };
        });

      const comets = cometsRaw.map((cm) => {
        const g = cm.galaxy_id ? galaxyMap.get(cm.galaxy_id) : null;
        const u = cm.creator_id ? userMap.get(cm.creator_id) : null;
        return {
          ...stripMongoId(cm),
          galaxy_name: g?.name || null,
          galaxy_color: g?.accent_color || null,
          creator_name: u?.name || null,
          creator_role: u?.role || null,
        };
      });

      const stats = {
        total_students: users.filter((u) => u.role === 'student' && u.account_status === 'active').length,
        total_teachers: users.filter((u) => u.role === 'teacher' && u.account_status === 'active').length,
        total_galaxies: galaxies.length,
        total_stars: starsRaw.length,
        total_supernovas: starsRaw.filter((s) => s.star_classification === 'Supernova').length,
        total_pending_missions: missions.filter((m) => m.status === 'Submitted' || m.status === 'Under Review').length,
        total_constellations: constellationsRaw.length,
        total_sparks: sparks.length,
        total_comets: cometsRaw.filter((c) => c.status === 'published').length,
      };

      return { galaxies, stars, constellations, comets, stats, thresholds };
    }

    // SQLite mode
    const galaxies = sqliteDb.prepare(`
      SELECT g.*, u.name as teacher_name, u.email as teacher_email, u.department as teacher_department,
        (SELECT COUNT(*) FROM stars s WHERE s.galaxy_id = g.id) as star_count,
        (SELECT COUNT(*) FROM constellations c WHERE c.galaxy_id = g.id AND c.published = 1) as constellation_count,
        (SELECT COUNT(*) FROM galaxy_members gm WHERE gm.galaxy_id = g.id AND gm.membership_status = 'active') as member_count,
        (SELECT COALESCE(SUM(s.stellar_energy), 0) FROM stars s WHERE s.galaxy_id = g.id) as total_energy
      FROM galaxies g LEFT JOIN users u ON g.teacher_id = u.id
      WHERE g.status = 'active' ORDER BY g.created_at ASC
    `).all();
    const userMemMap = new Map();
    if (currentUser) {
      for (const r of sqliteDb.prepare(`SELECT galaxy_id, membership_status FROM galaxy_members WHERE student_id = ? AND membership_status != 'removed'`).all(currentUser.id)) {
        userMemMap.set(r.galaxy_id, r.membership_status);
      }
    }
    for (const g of galaxies) {
      const st = userMemMap.get(g.id) || null;
      g.membership_status = st;
      g.is_member = st === 'active';
      g.membership_pending = st === 'pending';
    }

    const stars = sqliteDb.prepare(`
      SELECT s.*, u.name as student_name, u.grade as student_grade, u.section as student_section, u.avatar_color as student_avatar_color,
        g.name as galaxy_name, g.code as galaxy_code, g.accent_color as galaxy_color,
        m.tagline, m.category, m.description, m.objectives, m.outcomes, m.github_url, m.live_url, m.video_url, m.documentation, m.attachments_json, m.submission_date, m.feedback,
        rev.name as reviewer_name
      FROM stars s
      JOIN missions m ON s.mission_id = m.id
      JOIN users u ON s.student_id = u.id
      JOIN galaxies g ON s.galaxy_id = g.id
      LEFT JOIN users rev ON m.reviewer_id = rev.id
      WHERE g.status = 'active'
      ORDER BY s.stellar_energy DESC, s.approval_date DESC
    `).all();
    const userSparks = currentUser
      ? new Set(sqliteDb.prepare('SELECT star_id FROM sparks WHERE user_id = ?').all(currentUser.id).map((r) => r.star_id))
      : new Set();
    for (const st of stars) {
      st.has_sparked = userSparks.has(st.id);
      try { st.attachments = JSON.parse(st.attachments_json || '[]'); } catch { st.attachments = []; }
    }

    const constellations = sqliteDb.prepare(`
      SELECT c.*, g.name as galaxy_name, g.accent_color as galaxy_color, u.name as teacher_name
      FROM constellations c JOIN galaxies g ON c.galaxy_id = g.id JOIN users u ON c.teacher_id = u.id
      WHERE c.published = 1 AND g.status = 'active' ORDER BY c.created_at DESC
    `).all();
    const conStarStmt = sqliteDb.prepare(`
      SELECT cs.*, s.title as star_title, s.stellar_energy, s.star_classification, s.pos_x, s.pos_y, s.pos_z,
        u.name as student_name, m.category, m.tagline
      FROM constellation_stars cs JOIN stars s ON cs.star_id = s.id JOIN users u ON s.student_id = u.id JOIN missions m ON s.mission_id = m.id
      WHERE cs.constellation_id = ? ORDER BY cs.connection_order ASC
    `);
    for (const c of constellations) c.stars = conStarStmt.all(c.id);

    const comets = sqliteDb.prepare(`
      SELECT cm.*, g.name as galaxy_name, g.accent_color as galaxy_color, u.name as creator_name, u.role as creator_role
      FROM comets cm LEFT JOIN galaxies g ON cm.galaxy_id = g.id LEFT JOIN users u ON cm.creator_id = u.id
      WHERE cm.status != 'archived' ORDER BY cm.event_date ASC
    `).all();

    const stats = {
      total_students: sqliteDb.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'student' AND account_status = 'active'").get().c,
      total_teachers: sqliteDb.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'teacher' AND account_status = 'active'").get().c,
      total_galaxies: sqliteDb.prepare("SELECT COUNT(*) as c FROM galaxies WHERE status = 'active'").get().c,
      total_stars: sqliteDb.prepare('SELECT COUNT(*) as c FROM stars').get().c,
      total_supernovas: sqliteDb.prepare("SELECT COUNT(*) as c FROM stars WHERE star_classification = 'Supernova'").get().c,
      total_pending_missions: sqliteDb.prepare("SELECT COUNT(*) as c FROM missions WHERE status IN ('Submitted', 'Under Review')").get().c,
      total_constellations: sqliteDb.prepare('SELECT COUNT(*) as c FROM constellations WHERE published = 1').get().c,
      total_sparks: sqliteDb.prepare('SELECT COUNT(*) as c FROM sparks').get().c,
      total_comets: sqliteDb.prepare("SELECT COUNT(*) as c FROM comets WHERE status = 'published'").get().c,
    };

    return { galaxies, stars, constellations, comets, stats, thresholds: getThresholdsSqlite() };
  },

  async searchUniverse(q, categoryFilter) {
    await init();
    if (!q) return { galaxies: [], stars: [], constellations: [], comets: [] };
    if (storageMode === 'mongodb') {
      const data = await this.getUniverseData(null);
      const galaxies = (categoryFilter === 'all' || categoryFilter === 'galaxies')
        ? data.galaxies.filter((g) => [g.name, g.category, g.description, g.teacher_name].some((v) => (v || '').toLowerCase().includes(q))).slice(0, 8)
            .map((g) => ({ id: g.id, code: g.code, name: g.name, category: g.category, description: g.description, accent_color: g.accent_color, teacher_name: g.teacher_name }))
        : [];
      const stars = (categoryFilter === 'all' || categoryFilter === 'stars')
        ? data.stars.filter((s) => [s.title, s.description, s.category, s.student_name].some((v) => (v || '').toLowerCase().includes(q))).slice(0, 10)
            .map((s) => ({ id: s.id, title: s.title, galaxy_id: s.galaxy_id, stellar_energy: s.stellar_energy, star_classification: s.star_classification, star_color: s.star_color, student_name: s.student_name, galaxy_name: s.galaxy_name, category: s.category, tagline: s.tagline }))
        : [];
      const constellations = (categoryFilter === 'all' || categoryFilter === 'constellations')
        ? data.constellations.filter((c) => [c.name, c.description].some((v) => (v || '').toLowerCase().includes(q))).slice(0, 6)
            .map((c) => ({ id: c.id, name: c.name, description: c.description, galaxy_id: c.galaxy_id, color: c.color, galaxy_name: c.galaxy_name, teacher_name: c.teacher_name }))
        : [];
      const comets = (categoryFilter === 'all' || categoryFilter === 'comets')
        ? data.comets.filter((cm) => cm.status === 'published' && [cm.title, cm.description, cm.event_type].some((v) => (v || '').toLowerCase().includes(q))).slice(0, 6)
            .map((cm) => ({ id: cm.id, title: cm.title, event_type: cm.event_type, event_date: cm.event_date, location: cm.location, color: cm.color, galaxy_name: cm.galaxy_name }))
        : [];
      return { galaxies, stars, constellations, comets };
    }

    const like = `%${q}%`;
    const galaxies = categoryFilter === 'all' || categoryFilter === 'galaxies'
      ? sqliteDb.prepare(`
          SELECT g.id, g.code, g.name, g.category, g.description, g.accent_color, u.name as teacher_name
          FROM galaxies g LEFT JOIN users u ON g.teacher_id = u.id
          WHERE g.status = 'active' AND (LOWER(g.name) LIKE ? OR LOWER(g.category) LIKE ? OR LOWER(g.description) LIKE ? OR LOWER(u.name) LIKE ?)
          LIMIT 8
        `).all(like, like, like, like) : [];
    const stars = categoryFilter === 'all' || categoryFilter === 'stars'
      ? sqliteDb.prepare(`
          SELECT s.id, s.title, s.galaxy_id, s.stellar_energy, s.star_classification, s.star_color,
            u.name as student_name, g.name as galaxy_name, m.category, m.tagline
          FROM stars s JOIN missions m ON s.mission_id = m.id JOIN users u ON s.student_id = u.id JOIN galaxies g ON s.galaxy_id = g.id
          WHERE LOWER(s.title) LIKE ? OR LOWER(m.description) LIKE ? OR LOWER(m.category) LIKE ? OR LOWER(u.name) LIKE ?
          ORDER BY s.stellar_energy DESC LIMIT 10
        `).all(like, like, like, like) : [];
    const constellations = categoryFilter === 'all' || categoryFilter === 'constellations'
      ? sqliteDb.prepare(`
          SELECT c.id, c.name, c.description, c.galaxy_id, c.color, g.name as galaxy_name, u.name as teacher_name
          FROM constellations c JOIN galaxies g ON c.galaxy_id = g.id JOIN users u ON c.teacher_id = u.id
          WHERE c.published = 1 AND (LOWER(c.name) LIKE ? OR LOWER(c.description) LIKE ?) LIMIT 6
        `).all(like, like) : [];
    const comets = categoryFilter === 'all' || categoryFilter === 'comets'
      ? sqliteDb.prepare(`
          SELECT cm.id, cm.title, cm.event_type, cm.event_date, cm.location, cm.color, g.name as galaxy_name
          FROM comets cm LEFT JOIN galaxies g ON cm.galaxy_id = g.id
          WHERE cm.status = 'published' AND (LOWER(cm.title) LIKE ? OR LOWER(cm.description) LIKE ? OR LOWER(cm.event_type) LIKE ?) LIMIT 6
        `).all(like, like, like) : [];
    return { galaxies, stars, constellations, comets };
  },

  async getGalaxyById(id) {
    await init();
    if (storageMode === 'mongodb') return stripMongoId(await mongoDb.collection('galaxies').findOne({ id }));
    return sqliteDb.prepare('SELECT * FROM galaxies WHERE id = ?').get(id);
  },

  async createGalaxy(body, currentUser) {
    await init();
    const id = 'gal-' + crypto.randomBytes(4).toString('hex');
    const prefix = body.name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'GAL';
    const count = (storageMode === 'mongodb'
      ? await mongoDb.collection('galaxies').countDocuments()
      : sqliteDb.prepare('SELECT COUNT(*) as c FROM galaxies').get().c) + 1;
    const code = `GAL-${prefix}-${String(count).padStart(2, '0')}`;
    const angle = (count * 1.15) % (Math.PI * 2);
    const radius = 190 + (count % 3) * 45;
    const posX = Math.round(Math.cos(angle) * radius);
    const posY = Math.round(Math.sin(angle) * (radius * 0.55));
    const posZ = Math.round(Math.sin(angle * 2) * 70);
    const teacherId = currentUser.role === 'admin' && body.teacher_id ? body.teacher_id : currentUser.id;

    const doc = {
      id,
      code,
      name: body.name.trim(),
      description: body.description.trim(),
      category: body.category.trim(),
      objectives: body.objectives || 'Foster collaborative student missions and research.',
      grade_eligibility: body.grade_eligibility || 'Grades 8 - 12',
      membership_rules: body.membership_rules || 'Open to all Explorers',
      meeting_info: body.meeting_info || 'Fridays, 15:30 IST • Innovation Wing',
      teacher_id: teacherId,
      accent_color: body.accent_color || '#8855FF',
      secondary_color: body.secondary_color || '#48DFFF',
      visual_type: body.visual_type || 'spiral',
      emblem: body.emblem || 'sparkles',
      pos_x: posX,
      pos_y: posY,
      pos_z: posZ,
      status: 'active',
      is_sample: 0,
      created_at: nowIso(),
    };

    if (storageMode === 'mongodb') {
      await mongoDb.collection('galaxies').insertOne({ ...doc });
      return doc;
    }
    sqliteDb.prepare(`
      INSERT INTO galaxies (id, code, name, description, category, objectives, grade_eligibility, membership_rules, meeting_info, teacher_id, accent_color, secondary_color, visual_type, emblem, pos_x, pos_y, pos_z, is_sample)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(doc.id, doc.code, doc.name, doc.description, doc.category, doc.objectives, doc.grade_eligibility, doc.membership_rules, doc.meeting_info, doc.teacher_id, doc.accent_color, doc.secondary_color, doc.visual_type, doc.emblem, doc.pos_x, doc.pos_y, doc.pos_z);
    return sqliteDb.prepare('SELECT * FROM galaxies WHERE id = ?').get(id);
  },

  async toggleGalaxyMembership(targetStudentId, galaxyId) {
    await init();
    if (storageMode === 'mongodb') {
      const existing = await mongoDb.collection('galaxy_members').findOne({ student_id: targetStudentId, galaxy_id: galaxyId });
      if (existing && existing.membership_status === 'active') {
        await mongoDb.collection('galaxy_members').deleteOne({ student_id: targetStudentId, galaxy_id: galaxyId });
        return { joined: false };
      }
      await mongoDb.collection('galaxy_members').updateOne(
        { student_id: targetStudentId, galaxy_id: galaxyId },
        { $set: { membership_status: 'active', joined_at: nowIso() } },
        { upsert: true }
      );
      return { joined: true };
    }
    const existing = sqliteDb.prepare('SELECT * FROM galaxy_members WHERE student_id = ? AND galaxy_id = ?').get(targetStudentId, galaxyId);
    if (existing && existing.membership_status === 'active') {
      sqliteDb.prepare('DELETE FROM galaxy_members WHERE student_id = ? AND galaxy_id = ?').run(targetStudentId, galaxyId);
      return { joined: false };
    }
    sqliteDb.prepare(`
      INSERT INTO galaxy_members (student_id, galaxy_id, membership_status) VALUES (?, ?, 'active')
      ON CONFLICT(student_id, galaxy_id) DO UPDATE SET membership_status = 'active'
    `).run(targetStudentId, galaxyId);
    return { joined: true };
  },

  async isStudentMemberOfGalaxy(studentId, galaxyId) {
    await init();
    if (storageMode === 'mongodb') {
      const m = await mongoDb.collection('galaxy_members').findOne({ student_id: studentId, galaxy_id: galaxyId, membership_status: 'active' });
      return !!m;
    }
    const row = sqliteDb.prepare(`SELECT 1 as ok FROM galaxy_members WHERE student_id = ? AND galaxy_id = ? AND membership_status = 'active'`).get(studentId, galaxyId);
    return !!row;
  },

  async requestGalaxyMembership(studentId, galaxyId) {
    await init();
    if (storageMode === 'mongodb') {
      const existing = await mongoDb.collection('galaxy_members').findOne({ student_id: studentId, galaxy_id: galaxyId });
      if (existing && existing.membership_status === 'active') return { status: 'active', alreadyMember: true };
      if (existing && existing.membership_status === 'pending') return { status: 'pending', alreadyPending: true };
      await mongoDb.collection('galaxy_members').updateOne(
        { student_id: studentId, galaxy_id: galaxyId },
        { $set: { membership_status: 'pending', joined_at: nowIso() } },
        { upsert: true }
      );
      return { status: 'pending', requested: true };
    }
    const existing = sqliteDb.prepare('SELECT * FROM galaxy_members WHERE student_id = ? AND galaxy_id = ?').get(studentId, galaxyId);
    if (existing && existing.membership_status === 'active') return { status: 'active', alreadyMember: true };
    if (existing && existing.membership_status === 'pending') return { status: 'pending', alreadyPending: true };
    sqliteDb.prepare(`
      INSERT INTO galaxy_members (student_id, galaxy_id, membership_status) VALUES (?, ?, 'pending')
      ON CONFLICT(student_id, galaxy_id) DO UPDATE SET membership_status = 'pending', joined_at = CURRENT_TIMESTAMP
    `).run(studentId, galaxyId);
    return { status: 'pending', requested: true };
  },

  async getPendingMembershipRequests(currentUser) {
    await init();
    if (storageMode === 'mongodb') {
      const [pending, users, galaxies] = await Promise.all([
        mongoDb.collection('galaxy_members').find({ membership_status: 'pending' }).toArray(),
        mongoDb.collection('users').find({}).toArray(),
        mongoDb.collection('galaxies').find({ status: 'active' }).toArray(),
      ]);
      const userMap = new Map(users.map((u) => [u.id, u]));
      const galMap = new Map(galaxies.map((g) => [g.id, g]));
      return pending
        .filter((r) => {
          const g = galMap.get(r.galaxy_id);
          if (!g) return false;
          if (currentUser.role === 'admin') return true;
          return g.teacher_id === currentUser.id;
        })
        .map((r) => {
          const stu = userMap.get(r.student_id) || {};
          const gal = galMap.get(r.galaxy_id) || {};
          return {
            student_id: r.student_id,
            galaxy_id: r.galaxy_id,
            joined_at: r.joined_at,
            student_name: stu.name || 'Student',
            student_email: stu.email || '',
            student_grade: stu.grade || '',
            student_section: stu.section || '',
            galaxy_name: gal.name || '',
            galaxy_code: gal.code || '',
          };
        });
    }
    const sql = currentUser.role === 'admin'
      ? `SELECT gm.student_id, gm.galaxy_id, gm.joined_at, u.name as student_name, u.email as student_email, u.grade as student_grade, u.section as student_section, g.name as galaxy_name, g.code as galaxy_code
         FROM galaxy_members gm JOIN users u ON gm.student_id = u.id JOIN galaxies g ON gm.galaxy_id = g.id
         WHERE gm.membership_status = 'pending' AND g.status = 'active' ORDER BY gm.joined_at DESC`
      : `SELECT gm.student_id, gm.galaxy_id, gm.joined_at, u.name as student_name, u.email as student_email, u.grade as student_grade, u.section as student_section, g.name as galaxy_name, g.code as galaxy_code
         FROM galaxy_members gm JOIN users u ON gm.student_id = u.id JOIN galaxies g ON gm.galaxy_id = g.id
         WHERE gm.membership_status = 'pending' AND g.status = 'active' AND g.teacher_id = ? ORDER BY gm.joined_at DESC`;
    return currentUser.role === 'admin' ? sqliteDb.prepare(sql).all() : sqliteDb.prepare(sql).all(currentUser.id);
  },

  async processMembershipRequest(galaxyId, studentId, action) {
    await init();
    const nextStatus = action === 'approve' ? 'active' : 'removed';
    if (storageMode === 'mongodb') {
      await mongoDb.collection('galaxy_members').updateOne(
        { student_id: studentId, galaxy_id: galaxyId },
        { $set: { membership_status: nextStatus, joined_at: nowIso() } },
        { upsert: true }
      );
      return { membership_status: nextStatus };
    }
    sqliteDb.prepare(`
      INSERT INTO galaxy_members (student_id, galaxy_id, membership_status) VALUES (?, ?, ?)
      ON CONFLICT(student_id, galaxy_id) DO UPDATE SET membership_status = excluded.membership_status
    `).run(studentId, galaxyId, nextStatus);
    return { membership_status: nextStatus };
  },

  async removeStudentFromGalaxy(studentId, galaxyId) {
    await init();
    if (storageMode === 'mongodb') {
      await mongoDb.collection('galaxy_members').updateOne(
        { student_id: studentId, galaxy_id: galaxyId },
        { $set: { membership_status: 'removed' } }
      );
      return { removed: true };
    }
    sqliteDb.prepare(`UPDATE galaxy_members SET membership_status = 'removed' WHERE student_id = ? AND galaxy_id = ?`).run(studentId, galaxyId);
    return { removed: true };
  },

  async updateGalaxy(galaxyId, body, isAdmin) {
    await init();
    if (storageMode === 'mongodb') {
      const updates = {};
      for (const f of ['name', 'description', 'category', 'objectives', 'grade_eligibility', 'meeting_info', 'accent_color', 'visual_type', 'status']) {
        if (body[f]) updates[f] = body[f];
      }
      if (isAdmin && body.teacher_id) updates.teacher_id = body.teacher_id;
      if (Object.keys(updates).length > 0) {
        await mongoDb.collection('galaxies').updateOne({ id: galaxyId }, { $set: updates });
      }
      return stripMongoId(await mongoDb.collection('galaxies').findOne({ id: galaxyId }));
    }
    sqliteDb.prepare(`
      UPDATE galaxies
      SET name = COALESCE(?, name), description = COALESCE(?, description), category = COALESCE(?, category),
          objectives = COALESCE(?, objectives), grade_eligibility = COALESCE(?, grade_eligibility),
          meeting_info = COALESCE(?, meeting_info), accent_color = COALESCE(?, accent_color),
          visual_type = COALESCE(?, visual_type), status = COALESCE(?, status), teacher_id = COALESCE(?, teacher_id)
      WHERE id = ?
    `).run(body.name || null, body.description || null, body.category || null, body.objectives || null, body.grade_eligibility || null, body.meeting_info || null, body.accent_color || null, body.visual_type || null, body.status || null, isAdmin && body.teacher_id ? body.teacher_id : null, galaxyId);
    return sqliteDb.prepare('SELECT * FROM galaxies WHERE id = ?').get(galaxyId);
  },

  async getMissionsForUser(currentUser) {
    await init();
    let missions = [];
    if (storageMode === 'mongodb') {
      const [allMissions, users, galaxies, stars] = await Promise.all([
        mongoDb.collection('missions').find({}).sort({ submission_date: -1 }).toArray(),
        mongoDb.collection('users').find({}).toArray(),
        mongoDb.collection('galaxies').find({}).toArray(),
        mongoDb.collection('stars').find({}).toArray(),
      ]);
      const userMap = new Map(users.map((u) => [u.id, u]));
      const galaxyMap = new Map(galaxies.map((g) => [g.id, g]));
      const starByMission = new Map(stars.map((s) => [s.mission_id, s]));

      let filtered = allMissions;
      if (currentUser.role === 'teacher') {
        const ownedGalaxyIds = new Set(galaxies.filter((g) => g.teacher_id === currentUser.id).map((g) => g.id));
        filtered = allMissions.filter((m) => m.status !== 'Draft' && ownedGalaxyIds.has(m.galaxy_id)).sort((a, b) => {
          const ap = (a.status === 'Submitted' || a.status === 'Under Review') ? 0 : 1;
          const bp = (b.status === 'Submitted' || b.status === 'Under Review') ? 0 : 1;
          return ap - bp || (b.submission_date || '').localeCompare(a.submission_date || '');
        });
      } else if (currentUser.role !== 'admin') {
        filtered = allMissions.filter((m) => m.student_id === currentUser.id);
      }

      missions = filtered.map((m) => {
        const stu = userMap.get(m.student_id) || {};
        const gal = galaxyMap.get(m.galaxy_id) || {};
        const rev = m.reviewer_id ? userMap.get(m.reviewer_id) : null;
        const st = starByMission.get(m.id);
        let attachments = [];
        try { attachments = JSON.parse(m.attachments_json || '[]'); } catch {}
        return {
          ...stripMongoId(m),
          student_name: m.explorer_name || stu.name || null,
          student_grade: m.explorer_grade || stu.grade || null,
          student_email: stu.email || null,
          galaxy_name: gal.name || null,
          galaxy_color: gal.accent_color || null,
          galaxy_teacher_id: gal.teacher_id || null,
          reviewer_name: rev?.name || null,
          star_id: st?.id || null,
          stellar_energy: st?.stellar_energy ?? null,
          star_classification: st?.star_classification || null,
          attachments,
        };
      });
      return missions;
    }

    if (currentUser.role === 'admin') {
      missions = sqliteDb.prepare(`
        SELECT m.*, COALESCE(m.explorer_name, u.name) as student_name, COALESCE(m.explorer_grade, u.grade) as student_grade, u.email as student_email,
          g.name as galaxy_name, g.accent_color as galaxy_color, g.teacher_id as galaxy_teacher_id,
          rev.name as reviewer_name, s.id as star_id, s.stellar_energy, s.star_classification
        FROM missions m JOIN users u ON m.student_id = u.id JOIN galaxies g ON m.galaxy_id = g.id
        LEFT JOIN users rev ON m.reviewer_id = rev.id LEFT JOIN stars s ON s.mission_id = m.id
        ORDER BY m.submission_date DESC
      `).all();
    } else if (currentUser.role === 'teacher') {
      missions = sqliteDb.prepare(`
        SELECT m.*, COALESCE(m.explorer_name, u.name) as student_name, COALESCE(m.explorer_grade, u.grade) as student_grade, u.email as student_email,
          g.name as galaxy_name, g.accent_color as galaxy_color, g.teacher_id as galaxy_teacher_id,
          rev.name as reviewer_name, s.id as star_id, s.stellar_energy, s.star_classification
        FROM missions m JOIN users u ON m.student_id = u.id JOIN galaxies g ON m.galaxy_id = g.id
        LEFT JOIN users rev ON m.reviewer_id = rev.id LEFT JOIN stars s ON s.mission_id = m.id
        WHERE m.status != 'Draft' AND g.teacher_id = ?
        ORDER BY CASE WHEN m.status IN ('Submitted', 'Under Review') THEN 0 ELSE 1 END, m.submission_date DESC
      `).all(currentUser.id);
    } else {
      missions = sqliteDb.prepare(`
        SELECT m.*, COALESCE(m.explorer_name, u.name) as student_name, COALESCE(m.explorer_grade, u.grade) as student_grade,
          g.name as galaxy_name, g.accent_color as galaxy_color,
          rev.name as reviewer_name, s.id as star_id, s.stellar_energy, s.star_classification
        FROM missions m JOIN users u ON m.student_id = u.id JOIN galaxies g ON m.galaxy_id = g.id
        LEFT JOIN users rev ON m.reviewer_id = rev.id LEFT JOIN stars s ON s.mission_id = m.id
        WHERE m.student_id = ? ORDER BY m.submission_date DESC
      `).all(currentUser.id);
    }
    for (const m of missions) {
      try { m.attachments = JSON.parse(m.attachments_json || '[]'); } catch { m.attachments = []; }
    }
    return missions;
  },

  async createMission(body, currentUser, galaxy) {
    await init();
    const id = 'msn-' + crypto.randomBytes(5).toString('hex');
    const status = body.status === 'Draft' ? 'Draft' : 'Submitted';
    const attachments = Array.isArray(body.attachments) ? body.attachments : [];
    const doc = {
      id,
      student_id: currentUser.id,
      galaxy_id: body.galaxy_id,
      title: body.title.trim(),
      tagline: (body.tagline || body.description.slice(0, 90)).trim(),
      category: (body.category || galaxy.category).trim(),
      description: body.description.trim(),
      objectives: body.objectives || '',
      outcomes: body.outcomes || '',
      github_url: body.github_url || '',
      live_url: body.live_url || '',
      video_url: body.video_url || '',
      documentation: body.documentation || '',
      attachments_json: JSON.stringify(attachments),
      status,
      flagged: 0,
      flag_reason: null,
      submission_date: nowIso(),
      reviewer_id: null,
      feedback: null,
      reviewed_at: null,
      is_sample: 0,
    };

    if (storageMode === 'mongodb') {
      await mongoDb.collection('missions').insertOne({ ...doc });
      return doc;
    }

    sqliteDb.prepare(`
      INSERT INTO missions (id, student_id, galaxy_id, title, tagline, category, description, objectives, outcomes, github_url, live_url, video_url, documentation, attachments_json, status, is_sample)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(doc.id, doc.student_id, doc.galaxy_id, doc.title, doc.tagline, doc.category, doc.description, doc.objectives, doc.outcomes, doc.github_url, doc.live_url, doc.video_url, doc.documentation, doc.attachments_json, doc.status);
    return sqliteDb.prepare('SELECT * FROM missions WHERE id = ?').get(id);
  },

  async getMissionById(id) {
    await init();
    if (storageMode === 'mongodb') return stripMongoId(await mongoDb.collection('missions').findOne({ id }));
    return sqliteDb.prepare('SELECT * FROM missions WHERE id = ?').get(id);
  },

  async reviewMission(mission, action, feedback, currentUser, galaxy) {
    await init();
    const newStatus = action === 'Approve' ? 'Approved' : action === 'Reject' ? 'Rejected' : 'Changes Requested';
    let activatedStar = null;

    if (storageMode === 'mongodb') {
      await mongoDb.collection('missions').updateOne(
        { id: mission.id },
        { $set: { status: newStatus, reviewer_id: currentUser.id, feedback: feedback || 'Reviewed by Galaxy Mentor.', reviewed_at: nowIso() } }
      );
      if (action === 'Approve') {
        const existingStar = await mongoDb.collection('stars').findOne({ mission_id: mission.id });
        if (!existingStar) {
          const starId = 'str-' + crypto.randomBytes(5).toString('hex');
          const starCount = (await mongoDb.collection('stars').countDocuments({ galaxy_id: mission.galaxy_id })) + 1;
          const angle = starCount * 1.37;
          const radius = 22 + (starCount % 4) * 12;
          const starDoc = {
            id: starId,
            mission_id: mission.id,
            galaxy_id: mission.galaxy_id,
            student_id: mission.student_id,
            title: mission.title,
            stellar_energy: 0,
            star_classification: 'Young Star',
            pos_x: Math.round(Math.cos(angle) * radius),
            pos_y: Math.round(Math.sin(angle) * radius),
            pos_z: Math.round(Math.sin(angle * 1.7) * 20),
            star_color: galaxy ? galaxy.accent_color : '#48DFFF',
            approval_date: nowIso(),
            is_sample: 0,
          };
          await mongoDb.collection('stars').insertOne({ ...starDoc });
          activatedStar = starDoc;
        } else {
          activatedStar = stripMongoId(existingStar);
        }
      }
      const updatedMission = stripMongoId(await mongoDb.collection('missions').findOne({ id: mission.id }));
      return { mission: updatedMission, star: activatedStar };
    }

    sqliteDb.prepare(`
      UPDATE missions SET status = ?, reviewer_id = ?, feedback = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(newStatus, currentUser.id, feedback || 'Reviewed by Galaxy Mentor.', mission.id);
    if (action === 'Approve') {
      const existingStar = sqliteDb.prepare('SELECT * FROM stars WHERE mission_id = ?').get(mission.id);
      if (!existingStar) {
        const starId = 'str-' + crypto.randomBytes(5).toString('hex');
        const starCount = sqliteDb.prepare('SELECT COUNT(*) as c FROM stars WHERE galaxy_id = ?').get(mission.galaxy_id).c + 1;
        const angle = starCount * 1.37;
        const radius = 22 + (starCount % 4) * 12;
        sqliteDb.prepare(`
          INSERT INTO stars (id, mission_id, galaxy_id, student_id, title, stellar_energy, star_classification, pos_x, pos_y, pos_z, star_color, is_sample)
          VALUES (?, ?, ?, ?, ?, 0, 'Young Star', ?, ?, ?, ?, 0)
        `).run(starId, mission.id, mission.galaxy_id, mission.student_id, mission.title, Math.round(Math.cos(angle) * radius), Math.round(Math.sin(angle) * radius), Math.round(Math.sin(angle * 1.7) * 20), galaxy ? galaxy.accent_color : '#48DFFF');
        activatedStar = sqliteDb.prepare('SELECT * FROM stars WHERE id = ?').get(starId);
      } else {
        activatedStar = existingStar;
      }
    }
    return { mission: sqliteDb.prepare('SELECT * FROM missions WHERE id = ?').get(mission.id), star: activatedStar };
  },

  async getStarById(id) {
    await init();
    if (storageMode === 'mongodb') return stripMongoId(await mongoDb.collection('stars').findOne({ id }));
    return sqliteDb.prepare('SELECT * FROM stars WHERE id = ?').get(id);
  },

  async toggleSpark(star, currentUser) {
    await init();
    const prevClassification = star.star_classification;
    if (storageMode === 'mongodb') {
      const existingSpark = await mongoDb.collection('sparks').findOne({ user_id: currentUser.id, star_id: star.id });
      let sparked = false;
      if (existingSpark) {
        await mongoDb.collection('sparks').deleteOne({ id: existingSpark.id });
      } else {
        await mongoDb.collection('sparks').insertOne({
          id: 'spk-' + crypto.randomBytes(5).toString('hex'),
          user_id: currentUser.id,
          star_id: star.id,
          timestamp: nowIso(),
        });
        sparked = true;
      }
      const thresholds = await getThresholdsMongo();
      const energy = await mongoDb.collection('sparks').countDocuments({ star_id: star.id });
      const classification = classifyWithThresholds(energy, thresholds);
      await mongoDb.collection('stars').updateOne({ id: star.id }, { $set: { stellar_energy: energy, star_classification: classification } });
      return {
        sparked,
        stellar_energy: energy,
        star_classification: classification,
        becameSupernova: prevClassification !== 'Supernova' && classification === 'Supernova',
        thresholds,
      };
    }

    const existingSpark = sqliteDb.prepare('SELECT id FROM sparks WHERE user_id = ? AND star_id = ?').get(currentUser.id, star.id);
    let sparked = false;
    if (existingSpark) {
      sqliteDb.prepare('DELETE FROM sparks WHERE id = ?').run(existingSpark.id);
    } else {
      sqliteDb.prepare('INSERT INTO sparks (id, user_id, star_id) VALUES (?, ?, ?)').run('spk-' + crypto.randomBytes(5).toString('hex'), currentUser.id, star.id);
      sparked = true;
    }
    const { energy, classification } = recalculateStarEnergySqlite(star.id);
    return {
      sparked,
      stellar_energy: energy,
      star_classification: classification,
      becameSupernova: prevClassification !== 'Supernova' && classification === 'Supernova',
      thresholds: getThresholdsSqlite(),
    };
  },

  async createConstellation(body, currentUser) {
    await init();
    const id = 'con-' + crypto.randomBytes(5).toString('hex');
    const notified = [];

    if (storageMode === 'mongodb') {
      await mongoDb.collection('constellations').insertOne({
        id,
        galaxy_id: body.galaxy_id,
        teacher_id: currentUser.id,
        name: body.name.trim(),
        description: (body.description || 'Connected research formation curated by Galaxy Mentor.').trim(),
        color: body.color || '#48DFFF',
        published: 1,
        is_sample: 0,
        created_at: nowIso(),
      });
      const seen = new Set();
      for (let idx = 0; idx < body.stars.length; idx++) {
        const stItem = body.stars[idx];
        const starId = typeof stItem === 'string' ? stItem : stItem.star_id;
        const coordX = typeof stItem === 'object' && stItem.coord_x != null ? stItem.coord_x : 20 + idx * 20;
        const coordY = typeof stItem === 'object' && stItem.coord_y != null ? stItem.coord_y : 30 + (idx % 2) * 35;
        await mongoDb.collection('constellation_stars').insertOne({
          constellation_id: id,
          star_id: starId,
          connection_order: idx + 1,
          coord_x: coordX,
          coord_y: coordY,
        });
        const st = await mongoDb.collection('stars').findOne({ id: starId });
        if (st && !seen.has(st.student_id)) {
          seen.add(st.student_id);
          notified.push({ student_id: st.student_id, title: st.title });
        }
      }
      return { id, notified };
    }

    sqliteDb.prepare(`
      INSERT INTO constellations (id, galaxy_id, teacher_id, name, description, color, published, is_sample)
      VALUES (?, ?, ?, ?, ?, ?, 1, 0)
    `).run(id, body.galaxy_id, currentUser.id, body.name.trim(), (body.description || 'Connected research formation curated by Galaxy Mentor.').trim(), body.color || '#48DFFF');
    const insertCS = sqliteDb.prepare('INSERT INTO constellation_stars (constellation_id, star_id, connection_order, coord_x, coord_y) VALUES (?, ?, ?, ?, ?)');
    const seen = new Set();
    body.stars.forEach((stItem, idx) => {
      const starId = typeof stItem === 'string' ? stItem : stItem.star_id;
      const coordX = typeof stItem === 'object' && stItem.coord_x != null ? stItem.coord_x : 20 + idx * 20;
      const coordY = typeof stItem === 'object' && stItem.coord_y != null ? stItem.coord_y : 30 + (idx % 2) * 35;
      insertCS.run(id, starId, idx + 1, coordX, coordY);
      const st = sqliteDb.prepare('SELECT student_id, title FROM stars WHERE id = ?').get(starId);
      if (st && !seen.has(st.student_id)) {
        seen.add(st.student_id);
        notified.push({ student_id: st.student_id, title: st.title });
      }
    });
    return { id, notified };
  },

  async deleteConstellation(conId) {
    await init();
    if (storageMode === 'mongodb') {
      await mongoDb.collection('constellation_stars').deleteMany({ constellation_id: conId });
      await mongoDb.collection('constellations').deleteOne({ id: conId });
      return;
    }
    sqliteDb.prepare('DELETE FROM constellations WHERE id = ?').run(conId);
  },

  async createComet(body, currentUser) {
    await init();
    const id = 'cmt-' + crypto.randomBytes(5).toString('hex');
    const colorMap = {
      'School Announcement': '#FFD477', 'Club Meeting': '#B56BFF', 'Competition': '#48DFFF',
      'Workshop': '#91DFFF', 'Hackathon': '#8855FF', 'Exhibition Date': '#FFD477',
      'Project Deadline': '#FF8ECF', 'Important Notice': '#FF8ECF',
    };
    const eventType = body.event_type || 'School Announcement';
    const color = body.color || colorMap[eventType] || '#48DFFF';
    const doc = {
      id,
      title: body.title.trim(),
      description: body.description.trim(),
      event_type: eventType,
      event_date: body.event_date,
      event_time: body.event_time || '15:30 IST',
      location: body.location.trim(),
      galaxy_id: body.galaxy_id || null,
      creator_id: currentUser.id,
      eligibility: body.eligibility || 'All Explorers',
      registration_info: body.registration_info || 'Open via Omniverse Portal',
      attachments_json: '[]',
      status: body.status || 'published',
      color,
      is_sample: 0,
      created_at: nowIso(),
    };

    if (storageMode === 'mongodb') {
      await mongoDb.collection('comets').insertOne({ ...doc });
      return doc;
    }
    sqliteDb.prepare(`
      INSERT INTO comets (id, title, description, event_type, event_date, event_time, location, galaxy_id, creator_id, eligibility, registration_info, status, color, is_sample)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(doc.id, doc.title, doc.description, doc.event_type, doc.event_date, doc.event_time, doc.location, doc.galaxy_id, doc.creator_id, doc.eligibility, doc.registration_info, doc.status, doc.color);
    return sqliteDb.prepare('SELECT * FROM comets WHERE id = ?').get(id);
  },

  async deleteComet(cometId) {
    await init();
    if (storageMode === 'mongodb') {
      await mongoDb.collection('comets').deleteOne({ id: cometId });
      return;
    }
    sqliteDb.prepare('DELETE FROM comets WHERE id = ?').run(cometId);
  },

  async getNotifications(userId) {
    await init();
    if (storageMode === 'mongodb') {
      const list = await mongoDb.collection('notifications').find({ recipient_id: userId }).sort({ timestamp: -1 }).limit(30).toArray();
      return list.map(stripMongoId);
    }
    return sqliteDb.prepare('SELECT * FROM notifications WHERE recipient_id = ? ORDER BY timestamp DESC LIMIT 30').all(userId);
  },

  async markNotificationsRead(userId, id) {
    await init();
    if (storageMode === 'mongodb') {
      if (id) await mongoDb.collection('notifications').updateOne({ id, recipient_id: userId }, { $set: { read_status: 1 } });
      else await mongoDb.collection('notifications').updateMany({ recipient_id: userId }, { $set: { read_status: 1 } });
      return;
    }
    if (id) sqliteDb.prepare('UPDATE notifications SET read_status = 1 WHERE id = ? AND recipient_id = ?').run(id, userId);
    else sqliteDb.prepare('UPDATE notifications SET read_status = 1 WHERE recipient_id = ?').run(userId);
  },

  async getCosmoContext(user) {
    await init();
    if (storageMode === 'mongodb') {
      const [data, myMissionsRaw] = await Promise.all([
        this.getUniverseData(user),
        user ? mongoDb.collection('missions').find({ student_id: user.id }).sort({ submission_date: -1 }).toArray() : Promise.resolve([]),
      ]);
      const gMap = new Map(data.galaxies.map((g) => [g.id, g.name]));
      const myMissions = myMissionsRaw.map((m) => ({ ...stripMongoId(m), galaxy_name: gMap.get(m.galaxy_id) || 'Unknown Galaxy' }));
      return {
        galaxies: data.galaxies,
        stars: data.stars,
        constellations: data.constellations,
        comets: data.comets.filter((c) => c.status === 'published'),
        myMissions,
      };
    }

    const galaxies = sqliteDb.prepare(`
      SELECT g.*, u.name as teacher_name, (SELECT COUNT(*) FROM stars s WHERE s.galaxy_id = g.id) as star_count
      FROM galaxies g LEFT JOIN users u ON g.teacher_id = u.id WHERE g.status = 'active'
    `).all();
    const stars = sqliteDb.prepare(`
      SELECT s.*, u.name as student_name, g.name as galaxy_name, m.category, m.description, m.tagline
      FROM stars s JOIN missions m ON s.mission_id = m.id JOIN users u ON s.student_id = u.id JOIN galaxies g ON s.galaxy_id = g.id
      ORDER BY s.stellar_energy DESC
    `).all();
    const constellations = sqliteDb.prepare(`
      SELECT c.*, g.name as galaxy_name, u.name as teacher_name
      FROM constellations c JOIN galaxies g ON c.galaxy_id = g.id JOIN users u ON c.teacher_id = u.id WHERE c.published = 1
    `).all();
    const comets = sqliteDb.prepare(`
      SELECT cm.*, g.name as galaxy_name FROM comets cm LEFT JOIN galaxies g ON cm.galaxy_id = g.id
      WHERE cm.status = 'published' ORDER BY cm.event_date ASC
    `).all();
    const myMissions = user ? sqliteDb.prepare(`
      SELECT m.*, g.name as galaxy_name FROM missions m JOIN galaxies g ON m.galaxy_id = g.id
      WHERE m.student_id = ? ORDER BY m.submission_date DESC
    `).all(user.id) : [];

    return { galaxies, stars, constellations, comets, myMissions };
  },

  async getAdminOverview() {
    await init();
    if (storageMode === 'mongodb') {
      const [users, galaxies, missions, stars, logs, thresholds, activeMembers] = await Promise.all([
        mongoDb.collection('users').find({}).toArray(),
        mongoDb.collection('galaxies').find({}).toArray(),
        mongoDb.collection('missions').find({}).toArray(),
        mongoDb.collection('stars').find({}).toArray(),
        mongoDb.collection('activity_logs').find({}).sort({ timestamp: -1 }).limit(40).toArray(),
        getThresholdsMongo(),
        mongoDb.collection('galaxy_members').find({ membership_status: 'active' }).toArray(),
      ]);
      const galMap = new Map(galaxies.map((g) => [g.id, g]));

      const teachers = users
        .filter((u) => u.role === 'teacher')
        .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
        .map((u) => ({
          id: u.id, name: u.name, email: u.email, role: u.role, teacher_code: u.teacher_code,
          department: u.department, avatar_color: u.avatar_color, account_status: u.account_status,
          is_sample: u.is_sample, created_at: u.created_at,
          assigned_galaxies: galaxies.filter((g) => g.teacher_id === u.id).map((g) => g.name).join(', ') || null,
          reviews_completed: missions.filter((m) => m.reviewer_id === u.id).length,
        }));

      const students = users
        .filter((u) => u.role === 'student')
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((u) => {
          const uStars = stars.filter((s) => s.student_id === u.id);
          const uMemberships = activeMembers
            .filter((m) => m.student_id === u.id && galMap.has(m.galaxy_id))
            .map((m) => ({ galaxy_id: m.galaxy_id, galaxy_name: galMap.get(m.galaxy_id).name }));
          return {
            id: u.id, name: u.name, email: u.email, role: u.role, grade: u.grade, section: u.section,
            bio: u.bio, avatar_color: u.avatar_color, account_status: u.account_status, created_by: u.created_by || null,
            is_sample: u.is_sample, created_at: u.created_at,
            star_count: uStars.length,
            mission_count: missions.filter((m) => m.student_id === u.id).length,
            total_sparks_received: uStars.reduce((acc, s) => acc + (s.stellar_energy || 0), 0),
            memberships: uMemberships,
          };
        });

      return { teachers, students, logs: logs.map(stripMongoId), thresholds };
    }

    const teachers = sqliteDb.prepare(`
      SELECT u.id, u.name, u.email, u.role, u.teacher_code, u.department, u.avatar_color, u.account_status, u.is_sample, u.created_at,
        (SELECT GROUP_CONCAT(g.name, ', ') FROM galaxies g WHERE g.teacher_id = u.id) as assigned_galaxies,
        (SELECT COUNT(*) FROM missions m WHERE m.reviewer_id = u.id) as reviews_completed
      FROM users u WHERE u.role = 'teacher' ORDER BY u.created_at DESC
    `).all();
    const students = sqliteDb.prepare(`
      SELECT u.id, u.name, u.email, u.role, u.grade, u.section, u.bio, u.avatar_color, u.account_status, u.created_by, u.is_sample, u.created_at,
        (SELECT COUNT(*) FROM stars s WHERE s.student_id = u.id) as star_count,
        (SELECT COUNT(*) FROM missions m WHERE m.student_id = u.id) as mission_count,
        (SELECT COALESCE(SUM(s.stellar_energy), 0) FROM stars s WHERE s.student_id = u.id) as total_sparks_received
      FROM users u WHERE u.role = 'student' ORDER BY u.name ASC
    `).all();
    const memRows = sqliteDb.prepare(`
      SELECT gm.student_id, gm.galaxy_id, g.name as galaxy_name
      FROM galaxy_members gm JOIN galaxies g ON gm.galaxy_id = g.id
      WHERE gm.membership_status = 'active' AND g.status = 'active'
    `).all();
    const memByStu = new Map();
    for (const r of memRows) {
      if (!memByStu.has(r.student_id)) memByStu.set(r.student_id, []);
      memByStu.get(r.student_id).push({ galaxy_id: r.galaxy_id, galaxy_name: r.galaxy_name });
    }
    for (const s of students) {
      s.memberships = memByStu.get(s.id) || [];
    }
    const logs = sqliteDb.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 40').all();
    return { teachers, students, logs, thresholds: getThresholdsSqlite() };
  },

  async createTeacher(body) {
    await init();
    const id = 'usr-tch-' + crypto.randomBytes(4).toString('hex');
    const count = (storageMode === 'mongodb'
      ? await mongoDb.collection('users').countDocuments({ role: 'teacher' })
      : sqliteDb.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'teacher'").get().c) + 101;
    const teacherCode = body.teacher_code || `TCH-OMN-${count}`;
    const tempPassword = body.password || 'raks123';
    const doc = {
      id,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      password_hash: hashPassword(tempPassword),
      role: 'teacher',
      teacher_code: teacherCode,
      department: body.department || 'Interdisciplinary Sciences',
      grade: null,
      section: null,
      bio: body.bio || 'Galaxy Mentor in the Raks Omniverse.',
      avatar_color: body.avatar_color || '#8855FF',
      account_status: 'active',
      is_sample: 0,
      created_at: nowIso(),
    };

    if (storageMode === 'mongodb') {
      await mongoDb.collection('users').insertOne({ ...doc });
      if (body.galaxy_id) await mongoDb.collection('galaxies').updateOne({ id: body.galaxy_id }, { $set: { teacher_id: id } });
      return {
        teacher: { id: doc.id, name: doc.name, email: doc.email, role: doc.role, teacher_code: doc.teacher_code, department: doc.department, account_status: doc.account_status },
        tempPassword,
      };
    }

    sqliteDb.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, teacher_code, department, bio, avatar_color, account_status, is_sample)
      VALUES (?, ?, ?, ?, 'teacher', ?, ?, ?, ?, 'active', 0)
    `).run(doc.id, doc.name, doc.email, doc.password_hash, doc.teacher_code, doc.department, doc.bio, doc.avatar_color);
    if (body.galaxy_id) sqliteDb.prepare('UPDATE galaxies SET teacher_id = ? WHERE id = ?').run(id, body.galaxy_id);
    return {
      teacher: sqliteDb.prepare('SELECT id, name, email, role, teacher_code, department, account_status FROM users WHERE id = ?').get(id),
      tempPassword,
    };
  },

  async createStudent(body, creatorUser = null) {
    await init();
    const id = 'usr-stu-' + crypto.randomBytes(4).toString('hex');
    const tempPassword = body.password || 'omniverse2050';
    const createdBy = creatorUser ? creatorUser.id : null;
    const doc = {
      id,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      password_hash: hashPassword(tempPassword),
      role: 'student',
      teacher_code: null,
      department: null,
      grade: body.grade || 'Grade 11',
      section: body.section || 'A',
      bio: body.bio || 'Student Explorer in the Raks Omniverse.',
      avatar_color: body.avatar_color || '#48DFFF',
      account_status: 'active',
      created_by: createdBy,
      is_sample: 0,
      created_at: nowIso(),
    };

    if (storageMode === 'mongodb') {
      await mongoDb.collection('users').insertOne({ ...doc });
      if (body.galaxy_id) {
        await mongoDb.collection('galaxy_members').updateOne(
          { student_id: id, galaxy_id: body.galaxy_id },
          { $set: { membership_status: 'active', joined_at: nowIso() } },
          { upsert: true }
        );
      }
      return {
        student: { id: doc.id, name: doc.name, email: doc.email, role: doc.role, grade: doc.grade, section: doc.section, account_status: doc.account_status, created_by: createdBy },
        tempPassword,
      };
    }

    sqliteDb.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, grade, section, bio, avatar_color, account_status, created_by, is_sample)
      VALUES (?, ?, ?, ?, 'student', ?, ?, ?, ?, 'active', ?, 0)
    `).run(doc.id, doc.name, doc.email, doc.password_hash, doc.grade, doc.section, doc.bio, doc.avatar_color, createdBy);
    if (body.galaxy_id) {
      sqliteDb.prepare('INSERT INTO galaxy_members (student_id, galaxy_id, membership_status) VALUES (?, ?, \'active\')').run(id, body.galaxy_id);
    }
    return {
      student: sqliteDb.prepare('SELECT id, name, email, role, grade, section, account_status, created_by FROM users WHERE id = ?').get(id),
      tempPassword,
    };
  },

  async updateUserAdmin(targetId, body) {
    await init();
    if (storageMode === 'mongodb') {
      const updates = {};
      for (const f of ['account_status', 'name', 'department', 'grade', 'section', 'teacher_code']) {
        if (body[f]) updates[f] = body[f];
      }
      if (body.reset_password) updates.password_hash = hashPassword(body.reset_password);
      if (Object.keys(updates).length > 0) {
        await mongoDb.collection('users').updateOne({ id: targetId }, { $set: updates });
      }
      const u = await mongoDb.collection('users').findOne({ id: targetId });
      return { id: u.id, name: u.name, email: u.email, role: u.role, teacher_code: u.teacher_code, department: u.department, grade: u.grade, section: u.section, account_status: u.account_status };
    }

    if (body.account_status) sqliteDb.prepare('UPDATE users SET account_status = ? WHERE id = ?').run(body.account_status, targetId);
    if (body.department || body.name || body.grade || body.section || body.teacher_code) {
      sqliteDb.prepare(`
        UPDATE users SET name = COALESCE(?, name), department = COALESCE(?, department), grade = COALESCE(?, grade),
          section = COALESCE(?, section), teacher_code = COALESCE(?, teacher_code) WHERE id = ?
      `).run(body.name || null, body.department || null, body.grade || null, body.section || null, body.teacher_code || null, targetId);
    }
    if (body.reset_password) sqliteDb.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(body.reset_password), targetId);
    return sqliteDb.prepare('SELECT id, name, email, role, teacher_code, department, grade, section, account_status FROM users WHERE id = ?').get(targetId);
  },

  async changePassword(userId, newPassword) {
    await init();
    const hashed = hashPassword(newPassword);
    if (storageMode === 'mongodb') {
      await mongoDb.collection('users').updateOne({ id: userId }, { $set: { password_hash: hashed } });
      return true;
    }
    sqliteDb.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashed, userId);
    return true;
  },

  async moderateMission(missionId, action, reason) {
    await init();
    if (storageMode === 'mongodb') {
      if (action === 'flag') {
        await mongoDb.collection('missions').updateOne({ id: missionId }, { $set: { flagged: 1, flag_reason: reason || 'Flagged for administrative review' } });
      } else if (action === 'unflag') {
        await mongoDb.collection('missions').updateOne({ id: missionId }, { $set: { flagged: 0, flag_reason: null } });
      } else if (action === 'remove') {
        await mongoDb.collection('stars').deleteMany({ mission_id: missionId });
        await mongoDb.collection('missions').deleteOne({ id: missionId });
      }
      return;
    }

    if (action === 'flag') {
      sqliteDb.prepare('UPDATE missions SET flagged = 1, flag_reason = ? WHERE id = ?').run(reason || 'Flagged for administrative review', missionId);
    } else if (action === 'unflag') {
      sqliteDb.prepare('UPDATE missions SET flagged = 0, flag_reason = NULL WHERE id = ?').run(missionId);
    } else if (action === 'remove') {
      sqliteDb.prepare('DELETE FROM stars WHERE mission_id = ?').run(missionId);
      sqliteDb.prepare('DELETE FROM missions WHERE id = ?').run(missionId);
    }
  },
};

module.exports = {
  store,
  hashPassword,
};
