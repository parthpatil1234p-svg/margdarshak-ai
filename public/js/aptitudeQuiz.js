/**
 * MargDarshak AI - 5-Question Mini Psychometric / RIASEC Aptitude Quiz
 * Measures Realistic, Investigative, Artistic, Social, Enterprising, Conventional traits
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    questionText: {
      en: "On a free weekend, what kind of project would excite you the most?",
      hi: "छुट्टी के दिन, इनमें से कौन सा काम करने में आपको सबसे ज्यादा मजा आएगा?",
      mr: "सुट्टीच्या दिवशी खालीलपैकी कोणता प्रकल्प करायला तुम्हाला सर्वात जास्त आवडेल?"
    },
    options: [
      { text: { en: "Tinkering with hardware, electronics, or assembling a robotics kit", hi: "हार्डवेयर, इलेक्ट्रॉनिक्स खोलना या रोबोटिक्स किट असेंबल करना", mr: "इलेक्ट्रॉनिक्स, रोबोटिक्स किंवा उपकरणांचे भाग जोडून प्रॅक्टिकल काम करणे" }, type: "R" },
      { text: { en: "Researching a complex scientific mystery, coding a script, or analyzing data", hi: "किसी वैज्ञानिक रहस्य पर रिसर्च करना, कोडिंग करना या डेटा समझना", mr: "एखाद्या वैज्ञानिक कोड्यावर संशोधन करणे, कोडिंग करणे किंवा डेटा अभ्यासणे" }, type: "I" },
      { text: { en: "Designing a beautiful digital UI/poster or creating digital animations", hi: "डिजिटल पोस्टर, ऐप UI या रचनात्मक कला बनाना", mr: "सुंदर ॲप डिझाइन (UI/UX), चित्रे किंवा कलात्मक काम करणे" }, type: "A" },
      { text: { en: "Brainstorming a business idea, pitching a product, or calculating profits", hi: "बिजनेस आइडिया सोचना, दोस्तों को सामान बेचना या मुनाफा गिनना", mr: "व्यवसायाची नवीन कल्पना शोधणे, विक्री करणे किंवा नफा मोजणे" }, type: "E" }
    ]
  },
  {
    id: 2,
    questionText: {
      en: "When solving a community challenge in school, what role do you naturally take?",
      hi: "स्कूल या समाज में किसी समस्या को हल करते समय, आप स्वाभाविक रूप से क्या भूमिका चुनते हैं?",
      mr: "शाळेत किंवा समाजात एखादी समस्या सोडवताना तुमची नैसर्गिक भूमिका कोणती असते?"
    },
    options: [
      { text: { en: "Finding scientific facts, digging into root causes, and testing hypotheses", hi: "गहराई में जाकर वैज्ञानिक कारण ढूँढना और तथ्यों की जाँच करना", mr: "खोलवर जाऊन वैज्ञानिक कारणे शोधणे आणि डेटा तपासणे" }, type: "I" },
      { text: { en: "Leading the group, managing the budget, and pitching to teachers/authorities", hi: "टीम का नेतृत्व करना, बजट संभालना और अधिकारियों को अपनी बात समझाना", mr: "गटाचे नेतृत्व करणे, बजेट सांभाळणे आणि व्यवस्थापनाशी चर्चा करणे" }, type: "E" },
      { text: { en: "Listening to people's personal difficulties and providing empathetic care", hi: "लोगों की परेशानियाँ ध्यान से सुनना और उनकी मदद व सेवा करना", mr: "लोकांच्या अडचणी समजून घेऊन त्यांना समुपदेशन किंवा आरोग्य मदत करणे" }, type: "S" },
      { text: { en: "Building the physical structure, setting up electricals, or doing manual tests", hi: "हाथ से मॉडल बनाना, उपकरण लगाना या प्रैक्टिकल सेटअप तैयार करना", mr: "प्रत्यक्ष मॉडेल बनवणे, वायरिंग किंवा मेकॅनिकल काम स्वतः करणे" }, type: "R" }
    ]
  },
  {
    id: 3,
    questionText: {
      en: "Which type of subject task feels least like work and most like play to you?",
      hi: "इनमें से कौन सा काम आपको बोझ नहीं बल्कि खेल जैसा रोमांचक लगता है?",
      mr: "खालीलपैकी कोणते काम करताना तुम्हाला अजिबात थकवा जाणवत नाही?"
    },
    options: [
      { text: { en: "Solving math puzzles, physics derivations, or biology experiments", hi: "गणित की पहेलियाँ, फिजिक्स के सवाल या बायो लैब के प्रयोग", mr: "गणिताची कोडी, भौतिकशास्त्राचे प्रयोग किंवा लॅबमधील संशोधन" }, type: "I" },
      { text: { en: "Writing stories, debate speeches, or creating graphic presentations", hi: "कहानियाँ लिखना, वाद-विवाद भाषण देना या सुंदर स्लाइड्स बनाना", mr: "कथा लिहिणे, वादविवाद करणे किंवा आकर्षक प्रेझेंटेशन तयार करणे" }, type: "A" },
      { text: { en: "Organizing an exhibition, managing sponsors, and selling tickets", hi: "कार्यक्रम का आयोजन करना, स्पॉन्सर लाना और टिकट बेचना", mr: "शाळेचा कार्यक्रम आयोजित करणे, पैशांचे नियोजन आणि लोकांशी संवाद" }, type: "E" },
      { text: { en: "Keeping structured records, accounting spreadsheets, or systematic files", hi: "हिसाब-किताब की डायरी बनाना, एक्सेल शीट में डेटा सहेजना", mr: "पद्धतशीर नोंदी ठेवणे, जमाखर्च (अकाउंटिंग) आणि फाईल्स व्यवस्थापन" }, type: "C" }
    ]
  },
  {
    id: 4,
    questionText: {
      en: "What would be your dream workspace environment 5 years from now?",
      hi: "आज से 5 साल बाद आप खुद को किस माहौल में काम करते हुए देखना चाहेंगे?",
      mr: "आजपासून ५ वर्षांनंतर तुम्हाला कोणत्या वातावरणात काम करायला आवडेल?"
    },
    options: [
      { text: { en: "High-tech research lab, coding workstation, or computational cluster", hi: "हाई-टेक रिसर्च लैब, कोडिंग वर्कस्टेशन या आधुनिक कंप्यूटर लैब", mr: "हाय-टेक रिसर्च लॅब, कोडिंग वर्कस्टेशन किंवा रोबोटिक्स केंद्र" }, type: "I" },
      { text: { en: "Dynamic corporate office, boardroom meetings, or managing an enterprise", hi: "तेज रफ्तार कॉर्पोरेट ऑफिस, बोर्डरूम मीटिंग्स या खुद की कंपनी", mr: "कॉर्पोरेट ऑफिस, बोर्डरूम मीटिंग्ज किंवा स्वतःचा यशस्वी व्यवसाय" }, type: "E" },
      { text: { en: "Design studio, video/audio production atelier, or creative agency", hi: "क्रिएटिव डिजाइन स्टूडियो, वीडियो/गेम प्रोडक्शन या कला संस्थान", mr: "क्रिएटिव्ह डिझाइन स्टुडिओ, गेमिंग किंवा कलात्मक संस्था" }, type: "A" },
      { text: { en: "Hospital, diagnostic clinical center, or public welfare agency", hi: "अस्पताल, मेडिकल क्लिनिक या जनहितकारी सरकारी कार्यालय", mr: "हॉस्पिटल, क्लिनिक किंवा लोकांची सेवा करणारे शासकीय कार्यालय" }, type: "S" }
    ]
  },
  {
    id: 5,
    questionText: {
      en: "What gives you the deepest sense of pride and accomplishment?",
      hi: "इनमें से क्या हासिल करके आपको सबसे ज्यादा गर्व और संतुष्टि महसूस होती है?",
      mr: "खालीलपैकी काय साध्य केल्यावर तुम्हाला सर्वाधिक समाधान आणि अभिमान वाटतो?"
    },
    options: [
      { text: { en: "Discovering why a complex algorithm or natural system works", hi: "यह समझना कि कोई जटिल सिस्टम या प्राकृतिक नियम कैसे काम करता है", mr: "एखादी गुंतागुंतीची सिस्टीम किंवा वैज्ञानिक नियम कसा चालतो हे शोधणे" }, type: "I" },
      { text: { en: "Building a working machine, robot, or physical product with my hands", hi: "अपने हाथों से कोई चलती हुई मशीन, रोबोट या फिजिकल मॉडल बनाना", mr: "स्वतःच्या हाताने चालणारे यंत्र, रोबोट किंवा हार्डवेअर मॉडेल तयार करणे" }, type: "R" },
      { text: { en: "Closing a profitable deal, launching a project, or growing an audience", hi: "कोई फायदेमंद डील पक्की करना, नया प्रोजेक्ट शुरू करना या मुनाफा कमाना", mr: "फायदेशीर व्यवहार करणे, नवीन उपक्रम सुरू करणे किंवा नफा मिळवणे" }, type: "E" },
      { text: { en: "Creating an intuitive UI design, art piece, or expressive story", hi: "लोगों को पसंद आने वाला सुंदर ऐप डिजाइन, कहानी या कलाकृति बनाना", mr: "लोकांच्या पसंतीस पडणारे सुंदर ॲप डिझाइन, कलाकृती किंवा कथा बनवणे" }, type: "A" }
    ]
  }
];

let currentQuestionIndex = 0;
let userScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

const startPsychometricQuiz = () => {
  currentQuestionIndex = 0;
  userScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  const modal = new bootstrap.Modal(document.getElementById('psychometricQuizModal'));
  modal.show();
  renderCurrentQuestion();
};

const renderCurrentQuestion = () => {
  const container = document.getElementById('quizQuestionContainer');
  const progress = document.getElementById('quizProgressBar');
  if (!container) return;

  const currentLang = typeof window.currentLanguage === 'function' ? window.currentLanguage() : 'en';
  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100);

  if (progress) progress.style.width = `${progressPercent}%`;

  const qTitle = q.questionText[currentLang] || q.questionText.en;

  container.innerHTML = `
    <div class="mb-3">
      <div class="d-flex justify-content-between text-muted small mb-2">
        <span>Question ${currentQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}</span>
        <span>${progressPercent}% Completed</span>
      </div>
      <h5 class="fw-bold mb-4">${qTitle}</h5>
      <div class="d-flex flex-column gap-2">
        ${q.options.map((opt, idx) => `
          <button class="btn btn-outline-primary text-start p-3 rounded-3 quiz-opt-btn" onclick="selectQuizOption('${opt.type}')">
            <div class="d-flex align-items-center">
              <span class="badge bg-primary-subtle text-primary me-3 fw-bold">${String.fromCharCode(65 + idx)}</span>
              <span class="small fw-medium text-white">${opt.text[currentLang] || opt.text.en}</span>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
};

const selectQuizOption = (type) => {
  userScores[type] = (userScores[type] || 0) + 1;
  currentQuestionIndex++;

  if (currentQuestionIndex < QUIZ_QUESTIONS.length) {
    renderCurrentQuestion();
  } else {
    renderQuizResults();
  }
};

const renderQuizResults = () => {
  const container = document.getElementById('quizQuestionContainer');
  const progress = document.getElementById('quizProgressBar');
  if (progress) progress.style.width = '100%';

  // Calculate top 2 Holland traits
  const sortedTraits = Object.entries(userScores).sort((a, b) => b[1] - a[1]);
  const primaryCode = sortedTraits[0][0];
  const secondaryCode = sortedTraits[1][0];

  const traitNames = {
    R: 'Realistic (Hands-On & Mechanics)',
    I: 'Investigative (Science & Analysis)',
    A: 'Artistic (Design & Creativity)',
    S: 'Social (Healthcare & Counseling)',
    E: 'Enterprising (Business & Leadership)',
    C: 'Conventional (Finance & Structured Data)'
  };

  let recommendedStream = 'STREAM_PCM';
  let recommendedInterests = ['Coding & Software'];
  let aspiration = 'Software Systems Architect';

  if (primaryCode === 'I' && (secondaryCode === 'R' || secondaryCode === 'C')) {
    recommendedStream = 'STREAM_PCM';
    recommendedInterests = ['Coding & Software', 'Robotics'];
    aspiration = 'AI & Software Systems Engineer';
  } else if (primaryCode === 'I' && (secondaryCode === 'S' || secondaryCode === 'R')) {
    recommendedStream = 'STREAM_PCB';
    recommendedInterests = ['Biology & Life Sciences', 'Robotics'];
    aspiration = 'Biotechnology & Healthcare Tech';
  } else if (primaryCode === 'E' || secondaryCode === 'E') {
    recommendedStream = 'STREAM_COMMERCE_MATH';
    recommendedInterests = ['Business & Finance'];
    aspiration = 'Fintech Analyst / Investment Manager';
  } else if (primaryCode === 'A') {
    recommendedStream = 'STREAM_HUMANITIES';
    recommendedInterests = ['UI/UX & Design', 'Law & Public Policy'];
    aspiration = 'Digital Product & UX Designer';
  } else if (primaryCode === 'R') {
    recommendedStream = 'STREAM_POLYTECHNIC_DIPLOMA';
    recommendedInterests = ['Robotics', 'Coding & Software'];
    aspiration = 'Automation & Embedded Systems Engineer';
  }

  container.innerHTML = `
    <div class="text-center py-3">
      <div class="bg-success text-white p-3 rounded-circle d-inline-flex mb-3 shadow">
        <i class="fa-solid fa-award fa-2x"></i>
      </div>
      <h4 class="fw-bold mb-1">Psychometric Aptitude Profile Complete!</h4>
      <p class="text-secondary small mb-3">Based on Holland's RIASEC Career Theory Model</p>

      <div class="p-3 glass-card rounded-3 text-start mb-4 border border-glass">
        <div class="mb-2">
          <small class="text-muted d-block">Primary Aptitude:</small>
          <strong class="text-primary fs-6"><i class="fa-solid fa-star text-warning me-1"></i>${traitNames[primaryCode]}</strong>
        </div>
        <div class="mb-2">
          <small class="text-muted d-block">Secondary Supporting Aptitude:</small>
          <strong class="text-white fs-6">${traitNames[secondaryCode]}</strong>
        </div>
        <div class="pt-2 border-top">
          <small class="text-muted d-block">Recommended Academic Stream Match:</small>
          <span class="badge bg-success fs-6 mt-1">${recommendedStream}</span>
        </div>
      </div>

      <button class="shimmer-btn w-100 py-3 fs-6 shadow-lg" onclick="applyQuizResultsToSimulator('${recommendedStream}', '${aspiration}')">
        <i class="fa-solid fa-check-double me-2"></i><span>Apply Aptitude Results to Simulator</span>
      </button>
    </div>
  `;
};

const applyQuizResultsToSimulator = (streamCode, aspiration) => {
  // Update target aspiration
  const aspInput = document.getElementById('targetAspiration');
  if (aspInput) aspInput.value = aspiration;

  // Auto-fill recommended interests
  if (streamCode === 'STREAM_PCM') {
    document.getElementById('int_coding').checked = true;
    document.getElementById('int_robotics').checked = true;
  } else if (streamCode === 'STREAM_PCB') {
    document.getElementById('int_bio').checked = true;
    document.getElementById('int_robotics').checked = true;
  } else if (streamCode.includes('COMMERCE')) {
    document.getElementById('int_business').checked = true;
  } else if (streamCode === 'STREAM_HUMANITIES') {
    document.getElementById('int_design').checked = true;
  }

  bootstrap.Modal.getInstance(document.getElementById('psychometricQuizModal'))?.hide();

  // Trigger simulation automatically
  document.getElementById('intakeAssessmentForm')?.dispatchEvent(new Event('submit'));
};

window.startPsychometricQuiz = startPsychometricQuiz;
window.selectQuizOption = selectQuizOption;
window.applyQuizResultsToSimulator = applyQuizResultsToSimulator;
