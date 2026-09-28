/**
 * Interactive AI Counselor Chat Controller
 * Powered by Google Gemini API with Multilingual Support (English, Hindi, Marathi)
 * and High-Speed Deterministic Fallback Engine
 */

const { isGeminiAvailable, generateJSONWithGemini } = require('../config/gemini');

// Deterministic fallback counseling Q&A database
const FALLBACK_COUNSELING_QA = [
  {
    keywords: ['pcb', 'data science', 'math', 'maths'],
    en: "Yes, you can absolutely pursue Data Science after PCB! Many premier institutions like IIT Madras (BS in Data Science) and university BCA/B.Sc programs do not require 12th Maths. Alternatively, you can opt for B.Sc in Bioinformatics or Computational Genomics, which blends biology with data analytics at starting packages of ₹7–12 LPA.",
    hi: "हाँ, PCB के बाद भी आप डेटा साइंस कर सकते हैं! IIT मद्रास का BS Data Science और कई ऑटोनॉमस कॉलेज के BCA प्रोग्राम 12वीं में गणित अनिवार्य नहीं रखते। इसके अलावा बायोइन्फॉर्मेटिक्स (Bioinformatics) और हेल्थकेयर एनालिटिक्स एक बेहतरीन क्षेत्र है जहाँ शुरुआती पैकेज ₹7–12 LPA तक मिलता है।",
    mr: "होय, PCB नंतरही तुम्ही डेटा सायन्स क्षेत्रात करिअर करू शकता! IIT मद्रासचा BS Data Science आणि अनेक नामांकित महाविद्यालयांचे BCA कोर्सेस १२वीत गणिताची सक्ती करत नाहीत. तसेच बायोइन्फॉर्मेटिक्स आणि हेल्थकेयर डेटा ॲनालिटिक्समध्ये सुरुवातीचा पगार ₹७ ते १२ लाख मिळू शकतो."
  },
  {
    keywords: ['pune', '5 lakh', 'budget', 'college', 'colleges'],
    en: "In Pune with a ₹4–5 Lakh total budget, your strongest choices are: 1. Government Polytechnic Pune (bypassing coaching, then Direct Second Year DSE into COEP/VJTI/PCCOE), 2. Aided/Autonomous colleges via MHT-CET (applying for MahaDBT Rajarshi Shahu 50% fee concession), or 3. Fergusson College / SPPU for B.Sc Computer Science / Data Science.",
    hi: "पुणे में ₹4–5 लाख के बजट में आपके सबसे बेहतरीन विकल्प हैं: 1. गवर्नमेंट पॉलिटेक्निक पुणे (बिना कोचिंग, फिर COEP/PCCOE में डायरेक्ट सेकंड ईयर DSE एडमिशन), 2. MHT-CET के जरिए ऑटोनॉमस इंजीनियरिंग कॉलेज (MahaDBT 50% फीस छूट के साथ), या 3. फर्ग्युसन कॉलेज से B.Sc कंप्यूटर साइंस।",
    mr: "पुण्यात ₹४ ते ५ लाखांच्या बजेटमध्ये सर्वोत्तम पर्याय: १. गव्हर्नमेंट पॉलिटेक्निक पुणे (कोचिंगचा खर्च वाचवून थेट COEP/PCCOE मध्ये DSE इंजिनिअरिंग प्रवेश), २. MHT-CET द्वारे स्वायत्त महाविद्यालये (MahaDBT ५०% फी सवलतीसह), किंवा ३. फर्ग्युसन कॉलेजमधून B.Sc कॉम्प्युटर सायन्स / डेटा सायन्स."
  },
  {
    keywords: ['average', 'fail', 'marks', 'kam', 'kami', 'maths average'],
    en: "Scoring average in 10th Maths or Science is completely normal. Do not force yourself into high-pressure JEE/NEET 2-year coaching which leads to burnout. Instead, consider Polytechnic Diploma, Commerce with Applied Informatics, or B.Des/UX Design, where practical creativity and project portfolios matter far more than entrance ranks.",
    hi: "10वीं में गणित या विज्ञान में औसत अंक आना बिल्कुल सामान्य है। जबरन JEE या NEET की महंगी कोचिंग में न पड़ें। इसके बजाय पॉलिटेक्निक डिप्लोमा, कॉमर्स विथ बिजनेस एनालिटिक्स, या UI/UX डिजाइन चुनें जहाँ डिग्री से ज्यादा आपके प्रैक्टिकल प्रोजेक्ट्स और स्किल्स की कद्र होती है।",
    mr: "१०वीत गणितात किंवा विज्ञानात सरासरी गुण असणे अगदी स्वाभाविक आहे. अवाजवी ताण घेऊन JEE/NEET च्या कोचिंगच्या मागे धावू नका. त्याऐवजी पॉलिटेक्निक डिप्लोमा, कॉमर्स किंवा डिझाइन (UI/UX) चा विचार करा, जिथे entrance पेक्षा तुमच्या प्रात्यक्षिक कौशल्यांना जास्त महत्त्व आणि चांगला पगार मिळतो."
  },
  {
    keywords: ['neet', 'doctor', 'mbbs', 'drop'],
    en: "If you are hesitant about taking multiple drop years for NEET, remember that 24+ lakh aspirants compete for limited seats, and private MBBS costs ₹80L+. High-growth alternatives include: B.Pharm (Clinical Research), B.Sc Biotechnology & Genetics, BPT (Physiotherapy), or Biomedical Engineering—all offering dignified healthcare impact without crippling debt.",
    hi: "NEET के लिए बार-बार ड्रॉप वर्ष लेने से बचें। 24 लाख से ज्यादा बच्चे कुछ हजार सीटों के लिए लड़ते हैं और प्राइवेट कॉलेज ₹80 लाख से ज्यादा मांगते हैं। सुरक्षित विकल्प: B.Pharm (क्लिनिकल रिसर्च), बायोटेक्नोलॉजी, फिजियोथेरेपी (BPT) या बायोमेडिकल इंजीनियरिंग, जहाँ बिना भारी कर्ज के शानदार करियर बनता है।",
    mr: "NEET साठी पुन्हा पुन्हा वर्ष वाया घालवणे टाळा. २४ लाखांपेक्षा जास्त विद्यार्थी स्पर्धा करतात आणि खाजगी MBBS ची फी ₹८० लाखांपेक्षा जास्त असते. उत्तम पर्याय: B.Pharm (क्लिनिकल रिसर्च), बायोटेक्नॉलॉजी, फिजिओथेरपी किंवा बायोमेडिकल इंजिनिअरिंग - जिथे कर्जाचा बोजा न घेता उत्तम आरोग्य करिअर घडवता येते."
  }
];

const handleAICounselorChat = async (req, res) => {
  try {
    const {
      message = '',
      history = [],
      studentProfile = {},
      language = 'en'
    } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    const cleanMsg = message.trim().toLowerCase();
    const lang = ['en', 'hi', 'mr'].includes(language) ? language : 'en';

    // 1. Check Gemini Live API
    if (isGeminiAvailable()) {
      const systemInstruction = `
You are MargDarshak AI (मार्गदर्शक सहायक), an empathetic, deeply knowledgeable educational and financial counselor for Indian Class 10 students and their parents at PCCOE Pune.
Respond fluently and naturally in the requested language: ${lang === 'mr' ? 'MARATHI (मराठी)' : lang === 'hi' ? 'HINDI (हिंदी)' : 'ENGLISH'}.
Ground all advice in realistic Indian academic options: CBSE/State board, MHT-CET, JEE, NEET, CUET, Polytechnic DSE lateral entry, Pune colleges (COEP, PCCOE, Fergusson), and transparent education loan realities.
Keep your response concise, empowering, structured (bullet points if needed), and friendly.

Student Profile Context:
- Full Name: ${studentProfile.fullName || 'Student'}
- 10th Marks: Math: ${studentProfile.marks?.math || 'N/A'}%, Science: ${studentProfile.marks?.science || 'N/A'}%
- Interests: ${studentProfile.interests?.join(', ') || 'General'}
- Annual Budget: ₹${studentProfile.maxBudgetINR || '5,00,000'}
- Location: ${studentProfile.preferredLocation || 'India'}
`;

      const prompt = `Student/Parent Question: "${message}"\nProvide immediate, structured counseling guidance.`;

      const responseSchema = `
Return JSON with this schema:
{
  "reply": "Your detailed counseling answer in ${lang === 'mr' ? 'Marathi' : lang === 'hi' ? 'Hindi' : 'English'}",
  "suggestedFollowUps": ["Follow up question 1", "Follow up question 2"],
  "source": "Google Gemini (Live AI Counselor)"
}
`;

      const aiData = await generateJSONWithGemini(prompt + '\n' + responseSchema, systemInstruction);
      if (aiData && aiData.reply) {
        return res.status(200).json({
          success: true,
          reply: aiData.reply,
          suggestedFollowUps: aiData.suggestedFollowUps || [],
          source: 'Google Gemini (Live AI Counselor)',
          language: lang
        });
      }
    }

    // 2. Deterministic Heuristic Fallback
    let matchedAnswer = null;
    for (const item of FALLBACK_COUNSELING_QA) {
      if (item.keywords.some(kw => cleanMsg.includes(kw))) {
        matchedAnswer = item[lang] || item.en;
        break;
      }
    }

    if (!matchedAnswer) {
      if (lang === 'mr') {
        matchedAnswer = `मार्गदर्शक AI चे समुपदेशन: इयत्ता १०वीनंतर करिअर निवडताना फक्त मित्र काय करतात यावर जाऊ नका. तुमचे १०वीचे गुण, विषयांची आवड आणि कुटुंबाचे आर्थिक बजेट या तिन्हीचा समतोल साधा. आमचा 'What-If' सिम्युलेटर वापरून पर्यायी करिअरचे पर्याय नक्की तपासा.`;
      } else if (lang === 'hi') {
        matchedAnswer = `मार्गदर्शक AI की सलाह: 10वीं के बाद सिर्फ दोस्तों की देखा-देखी स्ट्रीम न चुनें। अपने मार्क्स, वास्तविक रुचि और परिवार के बजट का ध्यान रखें। हमारे 'What-If' सिम्युलेटर की मदद से कम खर्चीले और सुरक्षित करियर विकल्प जरूर देखें।`;
      } else {
        matchedAnswer = `MargDarshak AI Counseling: When choosing post-10th streams, balance student aptitude with family financial reality. Avoid taking heavy loans for private colleges when state autonomous institutions or lateral polytechnic routes offer on-par starting salaries with zero debt.`;
      }
    }

    const followUps = lang === 'mr'
      ? ['१०वी नंतर पॉलिटेक्निक की ११वी-१२वी?', 'पुण्यातील सर्वोत्तम ऑटोनॉमस कॉलेज कोणते?']
      : lang === 'hi'
      ? ['10वीं के बाद पॉलिटेक्निक या 11वीं-12वीं?', 'पुणे में 5 लाख के अंदर बेस्ट कॉलेज?']
      : ['Polytechnic Diploma vs 11th-12th?', 'Best colleges in Pune under ₹5 Lakh?'];

    return res.status(200).json({
      success: true,
      reply: matchedAnswer,
      suggestedFollowUps: followUps,
      source: 'MargDarshak AI Counseling Knowledge Base (Zero-Failure Fallback)',
      language: lang
    });
  } catch (err) {
    console.error('[AI Chat Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAICounselorChat };
