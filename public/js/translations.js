/**
 * MargDarshak AI - Multi-Language Localization Engine (English / हिंदी / मराठी)
 */

const TRANSLATIONS = {
  en: {
    brand_title: "MargDarshak AI",
    brand_tagline: "Guiding Students & Parents Through Every Academic Crossroads (From Class 10 to Career)",
    hero_title: "From Class 10 to Career: <span class=\"text-gradient-purple-cyan\">Zero-Regret Path Simulator</span>",
    hero_subtitle: "Empowering students and parents to break binary bias (JEE/NEET), simulate financial loan risks, and evaluate real-world alternatives with AI reasoning.",
    sdg_4: "SDG 4: Quality Education",
    sdg_8: "SDG 8: Decent Work",
    demo_eval_title: "1-Click Demo Evaluation Personas:",
    tab_intake: "1. Class 10 Intake Profile",
    tab_roadmap: "2. Sequential Pathway Maps",
    tab_whatif: "3. 'What-If' Scenario Simulator",
    tab_finance: "4. Loan ROI & Scholarships",
    tab_matrix: "5. Decision Matrix & Dossier",
    tab_docs: "6. HackMatrix PPT & Arch",
    
    // Intake
    intake_title: "Class 10 Student & Parent Intake Assessment",
    intake_desc: "Captures academic performance, family budget, risk appetite, and passions to eliminate opaque advice and recommend viable pathways.",
    student_name: "Student Full Name",
    category_label: "Category (Reservation/Quota)",
    aspiration_label: "Target Aspiration",
    marks_header: "Class 10 Subject Scores (Marks out of 100)",
    marks_math: "Mathematics",
    marks_sci: "Science (Phy/Chem/Bio)",
    marks_eng: "English & Languages",
    marks_soc: "Social Science / IT",
    interests_header: "Student Interests & Affinities (Select all that apply):",
    int_coding: "Coding & Software",
    int_bio: "Biology & Health",
    int_robotics: "Robotics & Hardware",
    int_business: "Business & Finance",
    int_design: "Design & Creative",
    int_law: "Law & Civil Services",
    budget_label: "Total Family Education Budget (Without Loan)",
    location_label: "Location Preference",
    loc_india: "India (State / National)",
    loc_abroad: "Abroad (Germany / Low Tuition EU)",
    loc_both: "Open to Both",
    risk_label: "Family Risk Appetite",
    risk_conservative: "Conservative (No Debt)",
    risk_moderate: "Moderate (Manageable Loan)",
    risk_ambitious: "Ambitious (Tier-1 Focused)",
    btn_generate: "Generate Multi-Pathway Roadmaps",
    btn_save_roadmap: "Save This Roadmap",
    btn_reset: "Reset Simulation",
    btn_export_pdf: "Download Official Career Dossier (PDF)",
    
    // What If
    whatif_badge: "Core Hackathon USP",
    whatif_title: "Interactive 'What-If' Contingency Sandbox",
    whatif_subtitle: "What happens when plans change? Simulate exam failure pivots, sudden family budget cuts, or international study comparisons with real-time financial diffs.",
    whatif_presets: "Select Scenario Preset:",
    whatif_shock: "Or Adjust Custom Budget Shock:",
    cost_diff: "Cost Difference",
    time_delta: "Time Delta",
    risk_transform: "Risk Transformation",
    
    // Loan & Finance
    loan_title: "Education Loan Borrowing Index Simulator",
    loan_desc: "Calculate your exact monthly EMI, total interest paid, and realistically estimate how many years of starting salary it will take to repay.",
    loan_degree_cost: "Total Degree Cost (Tuition + Living)",
    loan_family_savings: "Family Savings Dedicated",
    loan_scholarship: "Scholarship / Grant Offset",
    loan_interest_rate: "Interest Rate (%)",
    loan_tenure: "Tenure (Years)",
    loan_target_salary: "Target Starting Package (Annual CTC)",
    loan_principal: "Loan Principal Needed",
    loan_emi: "Monthly EMI",
    loan_interest_payable: "Total Interest Payable",
    loan_total_repayment: "Total Repayment",
    loan_dti: "Debt-To-Income (DTI) Ratio",
    loan_payback_horizon: "Payback Horizon",
    
    // Quiz & Chat
    quiz_banner_title: "Confused about your natural strengths?",
    quiz_banner_btn: "Take 2-Min Psychometric Quiz",
    chat_title: "MargDarshak AI Career Counselor",
    chat_placeholder: "Ask anything in English, Hindi, or Marathi...",
    chat_send: "Send"
  },
  hi: {
    brand_title: "मार्गदर्शक AI",
    brand_tagline: "हर शैक्षणिक मोड़ पर छात्र और अभिभावकों का मार्गदर्शन (10वीं से करियर तक)",
    hero_title: "10वीं कक्षा से करियर तक: <span class=\"text-gradient-purple-cyan\">शून्य-पछतावा पाथवे सिम्युलेटर</span>",
    hero_subtitle: "छात्रों और अभिभावकों को सिर्फ इंजीनियरिंग/मेडिकल के दबाव से बाहर निकालकर, एजुकेशन लोन के जोखिम को समझकर AI द्वारा वास्तविक करियर विकल्प देना।",
    sdg_4: "SDG 4: गुणवत्तापूर्ण शिक्षा",
    sdg_8: "SDG 8: उत्कृष्ट कार्य एवं विकास",
    demo_eval_title: "1-क्लिक डेमो मूल्यांकन व्यक्तित्व (Personas):",
    tab_intake: "1. 10वीं प्रोफाइल इनटेक",
    tab_roadmap: "2. क्रमिक करियर रोडमैप",
    tab_whatif: "3. 'अगर ऐसा हुआ तो' (What-If) सिम्युलेटर",
    tab_finance: "4. लोन EMI, ROI एवं छात्रवृत्ति",
    tab_matrix: "5. निर्णय तालिका (Decision Matrix)",
    tab_docs: "6. हैकमेथॉन PPT एवं आर्किटेक्चर",
    
    // Intake
    intake_title: "10वीं कक्षा छात्र एवं अभिभावक मूल्यांकन फॉर्म",
    intake_desc: "अंक, पारिवारिक बजट, जोखिम उठाने की क्षमता और रुचियों का विश्लेषण कर पारदर्शी और सुरक्षित करियर विकल्प सुझाता है।",
    student_name: "विद्यार्थी का पूरा नाम",
    category_label: "आरक्षण / श्रेणी (Category)",
    aspiration_label: "लक्षित करियर आकांक्षा",
    marks_header: "10वीं कक्षा के विषय अंक (100 में से)",
    marks_math: "गणित (Mathematics)",
    marks_sci: "विज्ञान (Science)",
    marks_eng: "अंग्रेज़ी एवं भाषाएँ",
    marks_soc: "सामाजिक विज्ञान / IT",
    interests_header: "विद्यार्थी की रुचियाँ और पसंद (जो भी लागू हो चुनें):",
    int_coding: "कोडिंग और सॉफ्टवेयर",
    int_bio: "बायोलॉजी और स्वास्थ्य",
    int_robotics: "रोबोटिक्स और हार्डवेयर",
    int_business: "व्यापार और वित्त (Finance)",
    int_design: "डिजाइन और रचनात्मकता",
    int_law: "कानून और सिविल सेवा",
    budget_label: "परिवार का कुल शिक्षा बजट (बिना लोन के)",
    location_label: "कॉलेज स्थान प्राथमिकता",
    loc_india: "भारत (राज्य / राष्ट्रीय)",
    loc_abroad: "विदेश (जर्मनी / कम शुल्क वाले देश)",
    loc_both: "दोनों के लिए तैयार",
    risk_label: "पारिवारिक जोखिम क्षमता",
    risk_conservative: "सुरक्षित (शून्य लोन/कर्ज)",
    risk_moderate: "मध्यम (आसान लोन)",
    risk_ambitious: "उच्च महत्वाकांक्षी (टियर-1)",
    btn_generate: "करियर रोडमैप्स तैयार करें",
    btn_save_roadmap: "यह रोडमैप सेव करें",
    btn_reset: "सिम्युलेशन रीसेट करें",
    btn_export_pdf: "आधिकारिक करियर रिपोर्ट (PDF) डाउनलोड करें",
    
    // What If
    whatif_badge: "हैकमेथॉन का मुख्य आकर्षण (USP)",
    whatif_title: "इंटरैक्टिव 'अगर ऐसा हुआ तो' (What-If) सैंडबॉक्स",
    whatif_subtitle: "अगर परीक्षा पास न हो या बजट घट जाए तो क्या करें? तुरंत विकल्प देखें और लाखों रुपये और साल बचाएं।",
    whatif_presets: "सिनेरियो चुनें:",
    whatif_shock: "या पारिवारिक बजट बदलाव देखें:",
    cost_diff: "खर्च में अंतर (बचत)",
    time_delta: "बचाया गया समय",
    risk_transform: "जोखिम में बदलाव",
    
    // Loan & Finance
    loan_title: "एजुकेशन लोन borrowing इंडेक्स और ROI कैलकुलेटर",
    loan_desc: "मासिक EMI, कुल ब्याज, और पहली सैलरी से कितने सालों में लोन चुकता होगा, इसका सटीक वित्तीय विश्लेषण।",
    loan_degree_cost: "डिग्री का कुल खर्च (ट्यूशन + हॉस्टल)",
    loan_family_savings: "परिवार की खुद की बचत",
    loan_scholarship: "छात्रवृत्ति (Scholarship) छूट",
    loan_interest_rate: "ब्याज दर (% Interest)",
    loan_tenure: "लोन की अवधि (साल)",
    loan_target_salary: "अपेक्षित शुरुआती सैलरी (LPA)",
    loan_principal: "जरूरी लोन राशि",
    loan_emi: "मासिक EMI",
    loan_interest_payable: "कुल देय ब्याज",
    loan_total_repayment: "कुल भुगतान राशि",
    loan_dti: "सैलरी के मुकाबले EMI (DTI %)",
    loan_payback_horizon: "लोन चुकाने की अवधि",
    
    // Quiz & Chat
    quiz_banner_title: "क्या आप अपने स्वाभाविक कौशल को लेकर असमंजस में हैं?",
    quiz_banner_btn: "2-मिनट का साइकोमेट्रिक टेस्ट दें",
    chat_title: "मार्गदर्शक AI करियर सलाहकार",
    chat_placeholder: "हिंदी, मराठी या इंग्लिश में कुछ भी पूछें...",
    chat_send: "पूछें"
  },
  mr: {
    brand_title: "मार्गदर्शक AI",
    brand_tagline: "प्रत्येक शैक्षणिक वळणावर विद्यार्थी आणि पालकांचे विश्वासू मार्गदर्शक (१०वी ते करिअर)",
    hero_title: "इयत्ता १०वी ते करिअर: <span class=\"text-gradient-purple-cyan\">कोणतीही चूक न होणारा करिअर सिम्युलेटर</span>",
    hero_subtitle: "केवळ इंजिनिअरिंग किंवा मेडिकलचा अवाजवी ताण न घेता, शैक्षणिक कर्जाची खरी जोखीम ओळखून योग्य आणि सुरक्षित करिअर निवडण्याचे AI साधन.",
    sdg_4: "SDG 4: गुणवत्तापूर्ण शिक्षण",
    sdg_8: "SDG 8: सन्माननीय रोजगार आणि प्रगती",
    demo_eval_title: "१-क्लिक प्रात्यक्षिक मूल्यांकन (Personas):",
    tab_intake: "१. १०वी प्रोफाइल माहिती",
    tab_roadmap: "२. टप्प्याटप्प्याने करिअर रोडमॅप",
    tab_whatif: "३. 'जर असे झाले तर' (What-If) सिम्युलेटर",
    tab_finance: "४. शैक्षणिक कर्ज EMI, ROI व शिष्यवृत्ती",
    tab_matrix: "५. तुलनात्मक निर्णय तक्ता (Decision Matrix)",
    tab_docs: "६. हॅकमॅट्रिक्स PPT व आर्किटेक्चर",
    
    // Intake
    intake_title: "इयत्ता १०वी विद्यार्थी आणि पालक मूल्यमापन अर्ज",
    intake_desc: "गुण, कौटुंबिक बजेट, क्षमता आणि आवडीनुसार सर्वात योग्य आणि परवडणारे करिअर पर्याय सुचवते.",
    student_name: "विद्यार्थ्याचे पूर्ण नाव",
    category_label: "प्रवर्ग / आरक्षण (Category)",
    aspiration_label: "अपेक्षित करिअर ध्येय",
    marks_header: "इयत्ता १०वीचे विषयवार गुण (१०० पैकी)",
    marks_math: "गणित (Mathematics)",
    marks_sci: "विज्ञान (Science)",
    marks_eng: "इंग्रजी व भाषा",
    marks_soc: "सामाजिक शास्त्रे / IT",
    interests_header: "विद्यार्थ्यांची आवड आणि कौशल्ये (लागू असलेले निवडा):",
    int_coding: "कोडिंग आणि सॉफ्टवेअर",
    int_bio: "जीवशास्त्र आणि आरोग्य",
    int_robotics: "रोबोटिक्स आणि हार्डवेअर",
    int_business: "व्यवसाय आणि फायनान्स",
    int_design: "डिझाइन आणि कला",
    int_law: "कायदा आणि स्पर्धा परीक्षा",
    budget_label: "कुटुंबाचे एकूण शैक्षणिक बजेट (कर्ज न घेता)",
    location_label: "महाविद्यालय स्थान पसंती",
    loc_india: "भारत (महाराष्ट्र / राष्ट्रीय)",
    loc_abroad: "परदेश (जर्मनी / कमी शुल्क देश)",
    loc_both: "दोन्हीसाठी तयार",
    risk_label: "कुटुंबाची आर्थिक जोखीम घेण्याची क्षमता",
    risk_conservative: "सुरक्षित (कर्ज नको)",
    risk_moderate: "मध्यम (परवडणारे कर्ज)",
    risk_ambitious: "उच्च महत्त्वाकांक्षी (टियर-१)",
    btn_generate: "करिअर रोडमॅप्स तयार करा",
    btn_save_roadmap: "हा रोडमॅप सेव्ह करा",
    btn_reset: "सिम्युलेशन रीसेट करा",
    btn_export_pdf: "अधिकृत करिअर अहवाल (PDF) डाउनलोड करा",
    
    // What If
    whatif_badge: "हॅकमॅट्रिक्स मुख्य आकर्षण (USP)",
    whatif_title: "इंटरॅक्टिव्ह 'जर असे झाले तर' (What-If) सँडबॉक्स",
    whatif_subtitle: "NEET/JEE नाही निघाली किंवा बजेट कमी झाले तर काय? त्वरित पर्यायी मार्ग पाहून लाखो रुपये व वर्ष वाचवा.",
    whatif_presets: "पर्यायी परिस्थिती निवडा:",
    whatif_shock: "किंवा बजेटमधील बदल तपासा:",
    cost_diff: "खर्चातील फरक (बचत)",
    time_delta: "वाचलेला वेळ",
    risk_transform: "जोखिम बदल",
    
    // Loan & Finance
    loan_title: "शैक्षणिक कर्ज EMI व परतावा (ROI) कॅल्क्युलेटर",
    loan_desc: "महिन्याचा हप्ता (EMI), एकूण व्याज आणि पहिल्या पगारातून कर्ज फेडण्यासाठी लागणारी वर्षे याचे पारदर्शक गणित.",
    loan_degree_cost: "शिक्षणाचा एकूण खर्च (फी + वसतिगृह)",
    loan_family_savings: "कुटुंबाची स्वतःची बचत",
    loan_scholarship: "मिळणारी शिष्यवृत्ती",
    loan_interest_rate: "व्याजदर (% Interest)",
    loan_tenure: "कर्जाची मुदत (वर्षे)",
    loan_target_salary: "अपेक्षित सुरुवातीचा पगार (LPA)",
    loan_principal: "लागणारी कर्ज रक्कम",
    loan_emi: "मासिक हप्ता (EMI)",
    loan_interest_payable: "एकूण देय व्याज",
    loan_total_repayment: "एकूण परतफेड रक्कम",
    loan_dti: "पगाराच्या तुलनेत EMI (DTI %)",
    loan_payback_horizon: "कर्जमुक्तीचा कालावधी",
    
    // Quiz & Chat
    quiz_banner_title: "तुमची खरी क्षमता आणि आवड कोणती आहे हे जाणून घ्यायचे आहे का?",
    quiz_banner_btn: "२ मिनिटांची कलचाचणी (Quiz) द्या",
    chat_title: "मार्गदर्शक AI समुपदेशक",
    chat_placeholder: "मराठी, हिंदी किंवा इंग्रजीमध्ये कोणताही प्रश्न विचारा...",
    chat_send: "विचारा"
  }
};

let currentLanguage = 'en';

const getTranslation = (key, lang = currentLanguage) => {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en?.[key] || key;
};

const setLanguage = (lang) => {
  if (!TRANSLATIONS[lang]) return;
  currentLanguage = lang;
  localStorage.setItem('margdarshak_lang', lang);

  // Update dropdown button text and active state
  const langLabel = document.getElementById('currentLanguageLabel');
  if (langLabel) {
    langLabel.innerText = lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English';
  }

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
  });

  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const trans = getTranslation(key, lang);
    if (trans) {
      if (trans.includes('<')) {
        el.innerHTML = trans;
      } else {
        el.innerText = trans;
      }
    }
  });

  // Translate all elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const trans = getTranslation(key, lang);
    if (trans) el.setAttribute('placeholder', trans);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('margdarshak_lang') || 'en';
  setLanguage(savedLang);
});

window.setLanguage = setLanguage;
window.getTranslation = getTranslation;
window.currentLanguage = () => currentLanguage;
