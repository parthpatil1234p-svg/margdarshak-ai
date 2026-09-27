/**
 * Pathway Simulation Service
 * Generates 3 sequential multi-stage pathways from Class 10 to Career:
 * 1. Primary Aspirant Path
 * 2. Applied Industry Path
 * 3. Cost-Optimized / High-ROI Path
 */

const { calculateEducationLoan } = require('./loanCalculatorService');
const streamsData = require('../data/streams.json');
const institutionsData = require('../data/institutions.json');
const careersData = require('../data/careers.json');

/**
 * Generate 3 distinct pathways tailored to student profile
 */
const simulatePathways = (profile) => {
  const {
    marks = { math: 75, science: 75, english: 75, social: 75 },
    interests = ['Coding & Software', 'Robotics'],
    maxBudgetINR = 800000,
    preferredLocation = 'India',
    riskTolerance = 'Moderate',
    category = 'General'
  } = profile;

  const avgStem = (marks.math + marks.science) / 2;
  const avgBio = marks.science;
  const isBioOriented = interests.some(i => i.toLowerCase().includes('bio') || i.toLowerCase().includes('health') || i.toLowerCase().includes('medic'));
  const isCommerceOriented = interests.some(i => i.toLowerCase().includes('commerce') || i.toLowerCase().includes('finance') || i.toLowerCase().includes('business'));
  const isDesignOrLaw = interests.some(i => i.toLowerCase().includes('design') || i.toLowerCase().includes('law') || i.toLowerCase().includes('human'));

  // Determine Primary Stream code
  let primaryStreamCode = 'STREAM_PCM';
  if (isBioOriented && !interests.includes('Coding & Software')) {
    primaryStreamCode = 'STREAM_PCB';
  } else if (isBioOriented && (interests.includes('Coding & Software') || marks.math >= 70)) {
    primaryStreamCode = 'STREAM_PCMB';
  } else if (isCommerceOriented) {
    primaryStreamCode = marks.math >= 55 ? 'STREAM_COMMERCE_MATH' : 'STREAM_COMMERCE_NON_MATH';
  } else if (isDesignOrLaw) {
    primaryStreamCode = 'STREAM_HUMANITIES';
  }

  // 1. Primary Aspirant Pathway
  const primaryPath = buildPrimaryAspirantPath(primaryStreamCode, marks, maxBudgetINR, preferredLocation, riskTolerance);

  // 2. Applied Industry Pathway
  const industryPath = buildAppliedIndustryPath(primaryStreamCode, marks, maxBudgetINR, preferredLocation);

  // 3. Cost-Optimized / High-ROI Pathway
  const costOptimizedPath = buildCostOptimizedPath(primaryStreamCode, marks, maxBudgetINR, category);

  return [primaryPath, industryPath, costOptimizedPath];
};

function buildPrimaryAspirantPath(streamCode, marks, budget, location, risk) {
  let streamName = 'Science (PCM)';
  let targetExam = 'JEE Main & Advanced';
  let instName = 'Tier-1 Premier University (e.g., IIT Bombay / BITS Pilani)';
  let degree = 'B.Tech in Computer Science & Engineering';
  let targetRole = 'Software Development Engineer (AI / Cloud)';
  let totalCost = 1450000;
  let medianSalary = 1600000;
  let fiveYearSalary = 3200000;
  let durationYears = 4;
  let competitiveRisk = 'High';

  if (streamCode === 'STREAM_PCB') {
    streamName = 'Science (PCB)';
    targetExam = 'NEET-UG';
    instName = 'Govt Medical College / Premier Hospital';
    degree = 'MBBS (Bachelor of Medicine & Bachelor of Surgery)';
    targetRole = 'Medical Officer / Resident Doctor';
    totalCost = 1200000;
    medianSalary = 1000000;
    fiveYearSalary = 2400000;
    durationYears = 5.5;
    competitiveRisk = 'Extreme';
  } else if (streamCode === 'STREAM_COMMERCE_MATH') {
    streamName = 'Commerce with Mathematics';
    targetExam = 'IPMAT / CUET (SRCC, IIM Indore)';
    instName = 'IIM Indore (IPM) / SRCC Delhi';
    degree = 'Integrated BBA+MBA / B.Com (Hons)';
    targetRole = 'Investment Banking & Corporate Finance Analyst';
    totalCost = 2800000;
    medianSalary = 1800000;
    fiveYearSalary = 3500000;
    durationYears = 5;
    competitiveRisk = 'High';
  } else if (streamCode === 'STREAM_HUMANITIES') {
    streamName = 'Humanities & Social Sciences';
    targetExam = 'CLAT (Common Law Admission Test)';
    instName = 'National Law School of India University (NLSIU Bangalore)';
    degree = 'B.A. LL.B. (Hons) 5-Year Integrated';
    targetRole = 'Corporate Legal Counsel';
    totalCost = 1800000;
    medianSalary = 1500000;
    fiveYearSalary = 3000000;
    durationYears = 5;
    competitiveRisk = 'High';
  }

  // Location modifier if Abroad
  if (location === 'Abroad') {
    instName = 'Technical University of Munich (TUM Germany) / Public EU';
    degree = 'B.Sc Information Engineering / International STEM';
    totalCost = 3800000;
    medianSalary = 4500000;
    fiveYearSalary = 7500000;
  }

  const loanInfo = calculateEducationLoan({
    totalEducationCostINR: totalCost,
    familyContributionINR: budget,
    scholarshipINR: 100000,
    annualInterestRate: 9.5,
    tenureYears: 7,
    medianStartingSalaryINR: medianSalary
  });

  return {
    pathwayId: 'PATH_PRIMARY_ASPIRANT',
    pathwayName: 'Aspirant Tier-1 Milestone Route',
    tag: 'PRIMARY_ASPIRANT',
    badgeText: 'Highest Ambition',
    badgeColor: 'primary',
    streamCode,
    targetCareer: {
      role: targetRole,
      medianSalaryINR: medianSalary,
      fiveYearSalaryINR: fiveYearSalary,
      growthOutlook: 'Rapid (+22% YoY)'
    },
    stages: [
      {
        stepNumber: 1,
        stageType: 'CLASS_10',
        title: 'Class 10 Foundation & Diagnostic Profiling',
        subtitle: 'Board Exam Preparation & Aptitude Alignment',
        durationYears: 1,
        estimatedCostINR: 40000,
        entranceExams: ['Class 10 Board Exam (CBSE/ICSE/State)'],
        keyMilestones: ['Score >85% in core subjects', 'Diagnostic STEM/Career Aptitude Test'],
        difficultyIndex: 'Moderate'
      },
      {
        stepNumber: 2,
        stageType: 'STREAM_11_12',
        title: `Class 11 & 12: ${streamName}`,
        subtitle: 'Core Foundation + Intensive Coaching',
        durationYears: 2,
        estimatedCostINR: 220000,
        entranceExams: [targetExam],
        keyMilestones: ['Complete NCERT syllabi by Nov Year 2', 'Weekly full-length mock exams', 'Percentile target: 99+'],
        difficultyIndex: 'Extreme'
      },
      {
        stepNumber: 3,
        stageType: 'ENTRANCE_UG',
        title: `Undergraduate Degree: ${degree}`,
        subtitle: instName,
        durationYears: durationYears,
        estimatedCostINR: totalCost - 260000,
        entranceExams: [targetExam],
        keyMilestones: ['Clear cutoff rank', 'Semester GPA > 8.5', 'Industrial summer internships'],
        difficultyIndex: 'High'
      },
      {
        stepNumber: 4,
        stageType: 'SPECIALIZATION',
        title: 'Capstone Specialization & Pre-Placement Training',
        subtitle: 'Applied Research, Hackathons & Production Portfolio',
        durationYears: 1,
        estimatedCostINR: 50000,
        entranceExams: [],
        keyMilestones: ['Ship 3 open-source production projects', 'Campus recruitment drives', 'Pre-placement offer (PPO)'],
        difficultyIndex: 'Moderate'
      },
      {
        stepNumber: 5,
        stageType: 'CAREER_ENTRY',
        title: `Industry Entry: ${targetRole}`,
        subtitle: `Starting at ₹${(medianSalary / 100000).toFixed(1)} LPA`,
        durationYears: 1,
        estimatedCostINR: 0,
        entranceExams: [],
        keyMilestones: ['Onboarding at leading enterprise', 'Loan repayment initiation', 'Financial independence'],
        difficultyIndex: 'Low'
      }
    ],
    financialSummary: {
      totalCostINR: totalCost,
      estimatedScholarshipINR: 100000,
      netCostToFamilyINR: Math.max(0, totalCost - 100000),
      loanPrincipalNeededINR: loanInfo.principalLoanINR,
      monthlyEMI: loanInfo.monthlyEMI,
      loanPaybackYears: loanInfo.paybackYears,
      borrowingRiskLevel: loanInfo.riskCategory
    },
    yearsToEarning: 2 + durationYears,
    competitiveRisk,
    aiConfidenceScore: 84,
    assumptionsAndCaveats: [
      `Assumes securing top 1.5 percentile in ${targetExam}.`,
      'Tuition accounts for hostel and inflation indexed at 6% annually.',
      'Drop year cost (₹1.5L-2.5L coaching + 1 lost earning year) is NOT incurred if cleared in 1st attempt.'
    ],
    whyThisPathWorks: 'Maximizes prestige, networking alumni advantage, and day-one campus placement compensation.'
  };
}

function buildAppliedIndustryPath(streamCode, marks, budget, location) {
  let streamName = 'Science (PCM)';
  let targetExam = 'MHT-CET / State CET / CUET';
  let instName = 'Top State Autonomous Institute (e.g. COEP / VJTI / PCCOE Pune)';
  let degree = 'B.Tech in Artificial Intelligence & Data Science';
  let targetRole = 'AI Systems & Cloud Engineer';
  let totalCost = 820000;
  let medianSalary = 1000000;
  let fiveYearSalary = 2400000;
  let durationYears = 4;

  if (streamCode === 'STREAM_PCB') {
    streamName = 'Science (PCB / PCMB)';
    targetExam = 'CUET-UG / State CET';
    instName = 'Autonomous University Life Sciences Dept (e.g., Fergusson Pune)';
    degree = 'B.Sc / B.Tech in Biotechnology & Clinical Data Analytics';
    targetRole = 'Biotech & Clinical Data Scientist';
    totalCost = 480000;
    medianSalary = 750000;
    fiveYearSalary = 1800000;
    durationYears = 3.5;
  } else if (streamCode.includes('COMMERCE')) {
    streamName = 'Commerce with Applied Mathematics';
    targetExam = 'CUET-UG / SET / College CET';
    instName = 'Top Autonomous Commerce College (Symbiosis / BMCC Pune / NMIMS)';
    degree = 'BBA in FinTech & Business Analytics';
    targetRole = 'Fintech Solutions & Business Analyst';
    totalCost = 750000;
    medianSalary = 900000;
    fiveYearSalary = 2000000;
    durationYears = 3;
  } else if (streamCode === 'STREAM_HUMANITIES') {
    streamName = 'Humanities & Applied Design';
    targetExam = 'UCEED / NID DAT / College Entrance';
    instName = 'Leading Design Institute (MIT-WPU / Srishti / Symbiosis)';
    degree = 'B.Des in UI/UX & Interaction Design';
    targetRole = 'Digital Product & UX Designer';
    totalCost = 1100000;
    medianSalary = 900000;
    fiveYearSalary = 2200000;
    durationYears = 4;
  }

  const loanInfo = calculateEducationLoan({
    totalEducationCostINR: totalCost,
    familyContributionINR: budget,
    scholarshipINR: 150000,
    annualInterestRate: 9.2,
    tenureYears: 5,
    medianStartingSalaryINR: medianSalary
  });

  return {
    pathwayId: 'PATH_APPLIED_INDUSTRY',
    pathwayName: 'Applied Industry & Skill-First Route',
    tag: 'APPLIED_INDUSTRY',
    badgeText: 'Optimal Balance',
    badgeColor: 'success',
    streamCode,
    targetCareer: {
      role: targetRole,
      medianSalaryINR: medianSalary,
      fiveYearSalaryINR: fiveYearSalary,
      growthOutlook: 'Very High (+24% YoY)'
    },
    stages: [
      {
        stepNumber: 1,
        stageType: 'CLASS_10',
        title: 'Class 10 Board Exam & Hands-on Exploration',
        subtitle: 'Foundations with weekend coding / domain projects',
        durationYears: 1,
        estimatedCostINR: 30000,
        entranceExams: ['Class 10 Board Exam'],
        keyMilestones: ['Score >75%', 'Build first portfolio artifact'],
        difficultyIndex: 'Low'
      },
      {
        stepNumber: 2,
        stageType: 'STREAM_11_12',
        title: `Class 11 & 12: ${streamName}`,
        subtitle: 'State Board / CBSE + State CET Exam Prep',
        durationYears: 2,
        estimatedCostINR: 120000,
        entranceExams: [targetExam],
        keyMilestones: ['MHT-CET / CUET >92nd percentile', 'Practical lab mastery'],
        difficultyIndex: 'Moderate'
      },
      {
        stepNumber: 3,
        stageType: 'ENTRANCE_UG',
        title: `Undergraduate Degree: ${degree}`,
        subtitle: instName,
        durationYears: durationYears,
        estimatedCostINR: totalCost - 170000,
        entranceExams: [targetExam],
        keyMilestones: ['Autonomous college curriculum', 'Build 4 real-world software/lab projects', 'Secure 6-month stipend internship'],
        difficultyIndex: 'Moderate'
      },
      {
        stepNumber: 4,
        stageType: 'SPECIALIZATION',
        title: 'Industry Certifications & Direct Placement Drives',
        subtitle: 'AWS/GCP Certifications, GitHub Contributions, Hackathons',
        durationYears: 1,
        estimatedCostINR: 20000,
        entranceExams: [],
        keyMilestones: ['Lead a technical hackathon team', 'Secure off-campus & on-campus offers'],
        difficultyIndex: 'Low'
      },
      {
        stepNumber: 5,
        stageType: 'CAREER_ENTRY',
        title: `Industry Entry: ${targetRole}`,
        subtitle: `Starting at ₹${(medianSalary / 100000).toFixed(1)} LPA`,
        durationYears: 1,
        estimatedCostINR: 0,
        entranceExams: [],
        keyMilestones: ['Rapid skill acceleration', 'Loan paid off within 2.2 years'],
        difficultyIndex: 'Low'
      }
    ],
    financialSummary: {
      totalCostINR: totalCost,
      estimatedScholarshipINR: 150000,
      netCostToFamilyINR: Math.max(0, totalCost - 150000),
      loanPrincipalNeededINR: loanInfo.principalLoanINR,
      monthlyEMI: loanInfo.monthlyEMI,
      loanPaybackYears: loanInfo.paybackYears,
      borrowingRiskLevel: loanInfo.riskCategory
    },
    yearsToEarning: 2 + durationYears,
    competitiveRisk: 'Moderate',
    aiConfidenceScore: 91,
    assumptionsAndCaveats: [
      'Accessible via state entrance exams (MHT-CET/CUET) with substantially higher success probability than JEE Advanced.',
      'Student actively builds applied portfolio projects during 2nd and 3rd year of college.',
      'Moderate academic stress with superior mental health balance.'
    ],
    whyThisPathWorks: 'Delivers 85-90% of premier college starting salaries at 50% lower total tuition cost and zero burnout.'
  };
}

function buildCostOptimizedPath(streamCode, marks, budget, category) {
  let streamName = 'Polytechnic Diploma or Govt Autonomous College';
  let instName = 'Government Polytechnic (Pune/Mumbai) ➔ DSE Govt B.Tech';
  let degree = 'Diploma in Engg (3 yrs) + Direct 2nd Year B.Tech (3 yrs)';
  let targetRole = 'Industrial Automation & Software Engineer';
  let totalCost = 310000;
  let medianSalary = 750000;
  let fiveYearSalary = 1600000;
  let durationYears = 5;

  if (streamCode === 'STREAM_PCB') {
    instName = 'Govt College of Pharmacy / Autonomous Science Dept';
    degree = 'B.Pharm (State Govt Quota) / B.Sc Biotechnology';
    targetRole = 'Pharmaceutical QA & Clinical Trials Coordinator';
    totalCost = 280000;
    medianSalary = 600000;
    fiveYearSalary = 1400000;
    durationYears = 4;
  } else if (streamCode.includes('COMMERCE')) {
    instName = 'Government / Aided Commerce College (e.g. BMCC Pune / Sydenham)';
    degree = 'B.Com (Aided) + CA Foundation + Self-Paced Certifications';
    targetRole = 'Audit Associate & Financial Consultant';
    totalCost = 190000;
    medianSalary = 700000;
    fiveYearSalary = 1700000;
    durationYears = 3;
  } else if (streamCode === 'STREAM_HUMANITIES') {
    instName = 'State University Central Campus (Aided)';
    degree = 'BA in Economics / Psychology + UI/UX Certifications';
    targetRole = 'UX Researcher & Public Relations Specialist';
    totalCost = 160000;
    medianSalary = 600000;
    fiveYearSalary = 1500000;
    durationYears = 3;
  }

  // Calculate scholarship
  const scholarshipEstimate = category === 'General' ? 80000 : 180000;

  const loanInfo = calculateEducationLoan({
    totalEducationCostINR: totalCost,
    familyContributionINR: budget,
    scholarshipINR: scholarshipEstimate,
    annualInterestRate: 8.8,
    tenureYears: 3,
    medianStartingSalaryINR: medianSalary
  });

  return {
    pathwayId: 'PATH_COST_OPTIMIZED',
    pathwayName: 'Cost-Optimized & Debt-Free High-ROI Route',
    tag: 'COST_OPTIMIZED',
    badgeText: 'Highest ROI & Debt-Free',
    badgeColor: 'warning',
    streamCode: 'STREAM_POLYTECHNIC_DIPLOMA',
    targetCareer: {
      role: targetRole,
      medianSalaryINR: medianSalary,
      fiveYearSalaryINR: fiveYearSalary,
      growthOutlook: 'Consistent (+18% YoY)'
    },
    stages: [
      {
        stepNumber: 1,
        stageType: 'CLASS_10',
        title: 'Class 10 Merit CAP Admission',
        subtitle: 'Direct entry based on SSC marks without entrance coaching',
        durationYears: 1,
        estimatedCostINR: 15000,
        entranceExams: ['Class 10 Board Exam (Min 60%)'],
        keyMilestones: ['Secure CAP round merit rank', 'Zero coaching fees spent'],
        difficultyIndex: 'Low'
      },
      {
        stepNumber: 2,
        stageType: 'STREAM_11_12',
        title: 'Polytechnic Diploma (Years 1 & 2)',
        subtitle: 'Government Polytechnic Pune',
        durationYears: 2,
        estimatedCostINR: 60000,
        entranceExams: ['Semester Board Exams (MSBTE)'],
        keyMilestones: ['Hands-on laboratory training', 'No JEE stress', 'Scoring >80% for direct 2nd yr engg'],
        difficultyIndex: 'Moderate'
      },
      {
        stepNumber: 3,
        stageType: 'ENTRANCE_UG',
        title: 'Diploma Final Year ➔ Direct Second Year (DSE) B.Tech',
        subtitle: 'Lateral Entry into Tier-1/Tier-2 State Govt Engineering',
        durationYears: 3,
        estimatedCostINR: totalCost - 110000,
        entranceExams: ['DSE Centralized Admission (No JEE required!)'],
        keyMilestones: ['Directly enter 2nd year B.Tech', 'Complete same degree as JEE students at 1/4th cost'],
        difficultyIndex: 'Moderate'
      },
      {
        stepNumber: 4,
        stageType: 'SPECIALIZATION',
        title: 'Core Technical Internships & Open-Source Projects',
        subtitle: 'Hardware-Software Interfacing & Applied Coding',
        durationYears: 1,
        estimatedCostINR: 15000,
        entranceExams: [],
        keyMilestones: ['6-month industry apprenticeship', 'Direct campus placements'],
        difficultyIndex: 'Low'
      },
      {
        stepNumber: 5,
        stageType: 'CAREER_ENTRY',
        title: `Industry Entry: ${targetRole}`,
        subtitle: `Starting at ₹${(medianSalary / 100000).toFixed(1)} LPA with ZERO DEBT`,
        durationYears: 1,
        estimatedCostINR: 0,
        entranceExams: [],
        keyMilestones: ['Start career completely debt-free', '100% of income available for family savings'],
        difficultyIndex: 'Low'
      }
    ],
    financialSummary: {
      totalCostINR: totalCost,
      estimatedScholarshipINR: scholarshipEstimate,
      netCostToFamilyINR: Math.max(0, totalCost - scholarshipEstimate),
      loanPrincipalNeededINR: loanInfo.principalLoanINR,
      monthlyEMI: loanInfo.monthlyEMI,
      loanPaybackYears: loanInfo.paybackYears,
      borrowingRiskLevel: loanInfo.riskCategory
    },
    yearsToEarning: 6,
    competitiveRisk: 'Low',
    aiConfidenceScore: 94,
    assumptionsAndCaveats: [
      'Utilizes state government subsidized tuition (MahaDBT / State Polytechnic).',
      'Requires maintaining >75% aggregate in Diploma to guarantee DSE engineering seat.',
      'Saves family ₹10L - ₹20L in private coaching and tuition expenses.'
    ],
    whyThisPathWorks: 'Flawless safety net: Guaranteed technical skills, lateral degree mobility, and complete financial peace of mind for parents.'
  };
}

module.exports = { simulatePathways };
