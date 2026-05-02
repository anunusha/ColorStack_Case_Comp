/**
 * Generates Hindi locale JSON files from English sources + inline translations.
 * Run: node scripts/generate-hi-json.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../src/data");

function writeJson(name, data) {
  fs.writeFileSync(path.join(dataDir, name), `${JSON.stringify(data, null, 2)}\n`);
}

function patchOptions(options, labelMap) {
  if (!options) return;
  for (const opt of options) {
    if (labelMap[opt.value] != null) {
      opt.label = labelMap[opt.value];
    }
  }
}

// --- student_questions.hi.json ---
const studentQuestions = JSON.parse(
  fs.readFileSync(path.join(dataDir, "student_questions.json"), "utf8")
);

const studentQHi = {
  paid_tuition_2024: {
    question_text:
      "क्या आपने 2024 में योग्य ट्यूशन फीस का भुगतान किया?",
    help_text:
      "योग्य ट्यूशन आम तौर पर आपके T2202 फॉर्म पर दिखाई देती है और प्रति संस्थान आम तौर पर कम से कम $100 होनी चाहिए।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  tuition_amount_paid: {
    question_text: "आपने लगभग कितनी योग्य ट्यूशन का भुगतान किया?",
    placeholder: "उदाहरण: 6000",
    help_text:
      "संघीय ट्यूशन क्रेडिट आम तौर पर योग्य ट्यूशन का 15% माना जाता है।",
  },
  has_t2202: {
    question_text:
      "क्या आपके स्कूल ने आपको T2202 दिया, या विदेश में पढ़ाई के लिए TL11 फॉर्म?",
    help_text:
      "कनाडाई स्कूल आम तौर पर फरवरी के अंत तक छात्र पोर्टल के माध्यम से T2202 जारी करते हैं।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  studied_outside_canada: {
    question_text: "क्या आपने 2024 में कनाडा के बाहर किसी संस्थान में पढ़ाई की?",
    help_text:
      "यह इस बात से संबंधित है कि ट्यूशन योग्यता के नियम क्या हैं, इससे नहीं कि आप छात्र गिने जाते हैं या नहीं।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  had_tax_payable_2024: {
    question_text:
      "क्या 2024 में आपको रिफंड मिला या कर देना पड़ा? यदि आप निश्चित नहीं हैं, तो क्या आपके पास रोज़गार आय या महत्वपूर्ण कर योग्य छात्रवृत्ति आय थी?",
    help_text:
      "रिफंड का मतलब हमेशा यह नहीं कि आप पर कोई कर देय नहीं था। ट्यूशन क्रेडिट का उपयोग जाँचने के लिए Schedule 11 या अपनी Notice of Assessment देखें।",
    labels: {
      got_refund: "रिफंड मिला",
      owed_taxes: "कर देना पड़ा",
      not_sure_with_income:
        "निश्चित नहीं, और मेरे पास रोज़गार या महत्वपूर्ण कर योग्य छात्रवृत्ति आय थी",
      not_sure_low_income: "निश्चित नहीं, और मेरी आय बहुत कम या शून्य के करीब थी",
    },
  },
  paid_student_loan_interest: {
    question_text:
      "क्या आपने 2024 में या पिछले 5 वर्षों में किसी भी वर्ष सरकारी छात्र ऋण पर ब्याज चुकाया?",
    help_text:
      "निजी बैंक लाइन ऑफ़ क्रेडिट या व्यक्तिगत ऋण पर ब्याज योग्य नहीं होता।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  student_loan_interest_amount: {
    question_text:
      "आपने लगभग कितना योग्य छात्र ऋण ब्याज चुकाया? यदि निश्चित नहीं हैं तो इसे खाली छोड़ें—हम आपको NSLSC ब्याज विवरण की ओर इशारा करेंगे।",
    placeholder: "उदाहरण: 120",
  },
  moved_for_school: {
    question_text: "क्या आपने 2024 में अपने स्कूल के कम से कम 40km करीब चले गए?",
    help_text:
      "छात्र केवल तभी चलने का खर्च काट सकते हैं जब चाल कम से कम 40km करीब हो और अन्य आय नियम पूरे हों।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  income_at_new_school_location: {
    question_text: "नए स्कूल स्थान पर, क्या आपके पास निम्नलिखित में से कोई था?",
    help_text:
      "यह आम समस्या है: चलने का खर्च केवल नए स्थान से जुड़ी योग्य आय के विरुद्ध ही काटा जा सकता है।",
    labels: {
      taxable_scholarship:
        "कर योग्य छात्रवृत्ति, अनुदान, फेलोशिप, या शोध अनुदान आय",
      employment_or_self_employment: "अंशकालिक नौकरी, को-ऑप, या स्वरोज़गार आय",
      neither: "कोई नहीं",
    },
  },
  new_location_income_amount: {
    question_text:
      "नए स्कूल स्थान पर आपने लगभग कितनी रोज़गार या स्वरोज़गार आय कमाई?",
    placeholder: "उदाहरण: 3000",
    help_text:
      "चलने के खर्च की कटौती नए स्थान पर योग्य आय तक सीमित होती है।",
  },
  age_19_or_older_by_april_2026: {
    question_text: "क्या आप अप्रैल 2026 तक 19 वर्ष या उससे अधिक उम्र के होंगे?",
    help_text:
      "जो लोग अप्रैल 2026 से पहले 19 वर्ष के हो जाते हैं, उन्हें GST/HST क्रेडिट के लिए विचार में लिए जाने हेतु 2024 रिटर्न दाखिल करना चाहिए।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  is_canadian_resident_for_tax: {
    question_text: "क्या आप कर उद्देश्यों के लिए कनाडा के निवासी हैं?",
    help_text:
      "कर उद्देश्यों के लिए निवास लाभ पात्रता को प्रभावित करता है। यदि अनिश्चित हैं, तो CRA फॉर्म NR74 आपकी स्थिति निर्धारित करने में मदद कर सकता है।",
    labels: { yes: "हाँ", no: "नहीं", unsure: "अनिश्चित" },
  },
  has_canada_training_credit_limit: {
    question_text:
      "क्या आपने पिछली CRA Notice of Assessment पर Canada Training Credit limit जमा किया है?",
    help_text:
      "यह आम तौर पर 26 से 66 से कम उम्र के परिपक्व छात्रों के लिए प्रासंगिक है। अपनी नवीनतम CRA Notice of Assessment पर अपना CTCL देखें।",
    labels: { yes: "हाँ", no: "नहीं", unsure: "अनिश्चित" },
  },
  province_of_residence_dec_31_2024: {
    question_text:
      "31 दिसंबर, 2024 को आप किस प्रांत या क्षेत्र में रहते थे?",
    help_text:
      "31 दिसंबर को निवास का प्रांत यह तय करता है कि कौन से प्रांतीय क्रेडिट लागू हो सकते हैं।",
  },
};

for (const q of studentQuestions) {
  const tr = studentQHi[q.id];
  if (!tr) continue;
  if (tr.question_text) q.question_text = tr.question_text;
  if (tr.help_text) q.ui_hints = { ...q.ui_hints, help_text: tr.help_text };
  if (tr.placeholder) q.ui_hints = { ...q.ui_hints, placeholder: tr.placeholder };
  if (tr.labels) patchOptions(q.options, tr.labels);
}

writeJson("student_questions.hi.json", studentQuestions);

// --- dtc_questions.hi.json ---
const dtcQuestions = JSON.parse(
  fs.readFileSync(path.join(dataDir, "dtc_questions.json"), "utf8")
);

const dtcQHi = {
  has_impairment_12_months: {
    question_text:
      "क्या आपको शारीरिक या मानसिक स्वास्थ्य स्थिति है जो कम से कम 12 महीने तक रही है या रहने की उम्मीद है?",
    help_text: "CRA इसे दीर्घकालिक अक्षमता की आवश्यकता कहता है।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  category_of_restriction: {
    question_text: "इनमें से कौन सा वर्णन सबसे अच्छा बताता है कि आपकी स्थिति आपको कैसे प्रभावित करती है?",
    help_text: "CRA निदान के नाम के बजाय दैनिक कार्य पर ध्यान देता है।",
    labels: {
      marked: "कम से कम एक दैनिक गतिविधि को निश्चित रूप से सीमित करता है",
      significant:
        "दो या अधिक दैनिक गतिविधियों को महत्वपूर्ण रूप से सीमित करता है; संयुक्त प्रभाव एक प्रमुख प्रतिबंध के बराबर",
      life_sustaining_therapy:
        "जीवन रक्षक कार्य के लिए सप्ताह में कम से कम 14 घंटे चल रही थेरेपी की आवश्यकता है",
      none: "उपरोक्त में से कोई नहीं",
      unsure: "अनिश्चित",
    },
  },
  restriction_severity_90_percent: {
    question_text:
      "जब प्रतिबंध मौजूद हो, क्या यह आपके दिन का लगभग 90% समय, हर दिन, हर समय या लगभग हर समय मौजूद रहता है?",
    help_text: "CRA \"हर समय या लगभग हर समय\" वाक्यांश का उपयोग करता है।",
    labels: { yes: "हाँ", no: "नहीं", unsure: "अनिश्चित" },
  },
  inordinate_time_or_unable: {
    question_text:
      "उपचार, दवा या सहायक उपकरणों के बावजूद, क्या आप गतिविधि करने में असमर्थ हैं, या यह आपको बिना स्थिति वाले व्यक्ति की तुलना में काफी अधिक समय लेती है?",
    help_text:
      "CRA यह देखता है कि क्या गतिविधि असामान्य रूप से अधिक समय लेती है—अक्सर लगभग तीन गुना अधिक समय।",
    labels: { yes: "हाँ", no: "नहीं", unsure: "अनिश्चित" },
  },
  years_with_condition: {
    question_text: "आपको यह स्थिति कितने वर्षों से है?",
    placeholder: "अधिकतम 10",
    help_text:
      "अनुमोदन के बाद CRA पिछले वर्षों का पुनर्मूल्यांकन कर सकता है, लेकिन रिफंड कर देय कर पर निर्भर करता है।",
  },
  has_qualified_practitioner: {
    question_text:
      "क्या आपके पास कोई डॉक्टर, नर्स प्रैक्टिशनर, मनोवैज्ञानिक, ऑप्टोमेट्रिस्ट, ऑडियोलॉजिस्ट, ऑक्यूपेशनल थेरेपिस्ट, फिजियोथेरेपिस्ट, या स्पीच-लैंग्वेज पैथोलॉजिस्ट है जो आपकी स्थिति को अच्छी तरह जानता है?",
    help_text:
      "नर्स प्रैक्टिशनर सभी DTC खंडों को प्रमाणित कर सकते हैं—यह महत्वपूर्ण है यदि आपके पास फैमिली डॉक्टर नहीं है।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  had_tax_payable_in_recent_years: {
    question_text:
      "पिछले 10 वर्षों में किसी भी वर्ष, क्या आप पर या आपका समर्थन करने वाले परिवार के सदस्य पर संघीय आयकर देय था?",
    help_text:
      "DTC गैर-वापसी योग्य है, लेकिन यह समर्थन करने वाले परिवार के सदस्य को स्थानांतरित हो सकता है।",
    labels: { yes: "हाँ", no: "नहीं", unsure: "अनिश्चित" },
  },
  interested_in_rdsp: {
    question_text:
      "क्या आप Registered Disability Savings Plan (RDSP) के बारे में जानना चाहते हैं? यह एक बचत योजना है जहाँ सरकार अनुदान और बॉन्ड दे सकती है, भले ही आप स्वयं योगदान न करें।",
    help_text: "RDSP खोलने के लिए DTC अनुमोदन आवश्यक है।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  applying_for_self_or_other: {
    question_text:
      "क्या आप अपने लिए, 18 से कम उम्र के बच्चे के लिए, या आपके द्वारा समर्थित किसी अन्य वयस्क के लिए आवेदन कर रहे हैं?",
    labels: {
      myself: "अपने लिए",
      my_child_under_18: "मेरा 18 से कम उम्र का बच्चा",
      another_adult_i_support: "कोई अन्य वयस्क जिसे मैं समर्थन देता/देती हूँ",
    },
    help_text:
      "बच्चे और आश्रित दावों के लिए मार्गदर्शन वयस्क स्व-दावों से अलग होता है।",
  },
  province_of_residence: {
    question_text: "आप किस प्रांत या क्षेत्र में रहते हैं?",
    help_text:
      "प्रांत अनुपूरक अनुमानों और Alberta-विशिष्ट AISH/CDB संदेशों को प्रभावित करता है।",
  },
  currently_receives_disability_benefits: {
    question_text: "क्या आप वर्तमान में इनमें से कोई प्राप्त करते हैं?",
    help_text:
      "अन्य विकलांगता लाभ स्वचालित रूप से आपको DTC योग्य नहीं बनाते, और उन्हें न प्राप्त करना आपको अयोग्य नहीं बनाता।",
    labels: {
      aish: "AISH (Alberta)",
      cpp_d: "CPP-D (Canada Pension Plan disability)",
      provincial_disability_assistance: "प्रांतीय विकलांगता सहायता (अन्य प्रांत)",
      workers_compensation: "श्रमिक मुआवजा",
      private_disability_insurance: "निजी विकलांगता बीमा",
      cdb: "Canada Disability Benefit (CDB)",
      none: "कोई नहीं",
    },
  },
  previously_denied: {
    question_text: "क्या आपने पहले DTC के लिए आवेदन किया और अस्वीकार हो गए?",
    help_text:
      "2022 में संघीय नियम बदले और Alberta में कुछ AISH प्राप्तकर्ताओं के लिए पुनः आवेदन नियम विशिष्ट हैं।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
  denial_year: {
    question_text: "आपका DTC अस्वीकार कब हुआ था?",
    labels: {
      before_2022: "2022 से पहले",
      "2022_to_2024": "2022-2024",
      "2025_or_later": "2025 या बाद में",
      dont_remember: "याद नहीं",
    },
    help_text:
      "अस्वीकार का वर्ष संघीय नियम परिवर्तनों को Alberta AISH पुनः आवेदन आवश्यकताओं से अलग करने में मदद करता है।",
  },
  had_employment_income_2024: {
    question_text: "क्या आपके पास 2024 में कोई रोज़गार या स्वरोज़गार आय थी?",
    help_text:
      "केवल काम की आय Canada Workers Benefit विकलांगता अनुपूरक के लिए पर्याप्त नहीं है; CRA आय, परिवार की स्थिति, प्रांत और छात्र исключения लागू करता है।",
    labels: { yes: "हाँ", no: "नहीं" },
  },
};

for (const q of dtcQuestions) {
  const tr = dtcQHi[q.id];
  if (!tr) continue;
  if (tr.question_text) q.question_text = tr.question_text;
  if (tr.help_text) q.ui_hints = { ...q.ui_hints, help_text: tr.help_text };
  if (tr.placeholder) q.ui_hints = { ...q.ui_hints, placeholder: tr.placeholder };
  if (tr.labels) patchOptions(q.options, tr.labels);
}

writeJson("dtc_questions.hi.json", dtcQuestions);

// --- Credits: patch name, documents_needed, filing_destination, fallback_explanation, disclaimer ---
function patchCredits(pathEn, pathHi, patchMap) {
  const credits = JSON.parse(fs.readFileSync(path.join(dataDir, pathEn), "utf8"));
  for (const c of credits) {
    const tr = patchMap[c.id];
    if (!tr) continue;
    if (tr.name) c.name = tr.name;
    if (tr.documents_needed) c.documents_needed = tr.documents_needed;
    if (tr.filing_destination) c.filing_destination = tr.filing_destination;
    if (tr.fallback_explanation) c.fallback_explanation = tr.fallback_explanation;
    if (tr.disclaimer && c.estimated_dollars) {
      c.estimated_dollars = { ...c.estimated_dollars, disclaimer: tr.disclaimer };
    }
  }
  writeJson(pathHi, credits);
}

patchCredits("student_credits.json", "student_credits.hi.json", {
  tuition_credit: {
    name: "ट्यूशन टैक्स क्रेडिट",
    documents_needed: [
      "आपके स्कूल से T2202 फॉर्म, या विदेश में पढ़ाई के लिए TL11 फॉर्म",
      "आपके रिकॉर्ड के लिए ट्यूशन भुगतान रसीदें",
      "आपके टैक्स सॉफ़्टवेयर या रिटर्न से Schedule 11",
    ],
    filing_destination: "आपके T1 रिटर्न की पंक्ति 32300; Schedule 11 पूरा करें",
    fallback_explanation:
      "यदि आपने 2024 में योग्य ट्यूशन फीस का भुगतान किया है, तो हो सकता है कि आप उन फीस का 15% तक का गैर-वापसी योग्य संघीय क्रेडिट दावा कर सकें। रिफंड का मतलब स्वचालित रूप से यह नहीं कि आपके ट्यूशन क्रेडिट अप्रयुक्त थे—Schedule 11 या Notice of Assessment जाँचें। Alberta, Ontario और Saskatchewan वर्तमान में 2024 के लिए प्रांतीय ट्यूशन क्रेडिट नहीं जोड़ते।",
    disclaimer:
      "केवल संघीय अनुमान। प्रांतीय अनुपूरक प्रांत के अनुसार बदलता है; Alberta, Ontario या Saskatchewan के लिए प्रांतीय हिस्से का अनुमान न लगाएँ।",
  },
  tuition_transfer: {
    name: "अप्रयुक्त ट्यूशन माता-पिता, दादा-दादी, जीवनसाथी या सामान्य-कानून साथी को स्थानांतरित करें",
    documents_needed: [
      "T2202 या TL11 फॉर्म",
      "स्थानांतरण योग्य राशि दिखाने वाला पूरा Schedule 11",
      "यदि टैक्स सॉफ़्टवेयर आवश्यक हो तो स्थानांतरण ग्रहणकर्ता का नाम और SIN",
    ],
    filing_destination:
      "Schedule 11; स्थानांतरित राशि का दावा समर्थन करने वाला व्यक्ति करता है",
    fallback_explanation:
      "यदि आपने ट्यूशन का भुगतान किया लेकिन अपने कर को कम करने के लिए पूरे क्रेडिट की आवश्यकता नहीं थी, तो हो सकता है कि आप चालू वर्ष की राशि का एक हिस्सा माता-पिता, दादा-दादी, जीवनसाथी या सामान्य-कानून साथी को स्थानांतरित कर सकें। स्थानांतरण सीमित है और पहले आपको अपने कर देय को कम करने के लिए ट्यूशन का उपयोग करना होगा।",
    disclaimer:
      "केवल अनुमान। संघीय स्थानांतरण वर्तमान वर्ष की ट्यूशन राशि के $5,000 तक पर आधारित होता है, अपने कर को पहले कम करने के बाद।",
  },
  tuition_carryforward: {
    name: "अप्रयुक्त ट्यूशन अगले वर्ष के लिए सुरक्षित रखें",
    documents_needed: [
      "T2202 या TL11 फॉर्म",
      "Schedule 11",
      "अप्रयुक्त ट्यूशन राशि दिखाने वाली Notice of Assessment",
    ],
    filing_destination: "Schedule 11 और भविष्य के कर वर्षों के रिटर्न",
    fallback_explanation:
      "यदि आपको इस वर्ष अपने सभी 2024 ट्यूशन क्रेडिट की आवश्यकता नहीं है, तो अप्रयुक्त राशि आम तौर पर आगे के वर्ष में उपयोग के लिए सुरक्षित की जा सकती है। आपकी Notice of Assessment भविष्य के वर्षों के लिए उपलब्ध राशि दिखाएगी।",
    disclaimer:
      "केवल अनुमान। वास्तविक carryforward Schedule 11 पर उपयोग या स्थानांतरण पर निर्भर करता है।",
  },
  student_loan_interest_credit: {
    name: "छात्र ऋण ब्याज क्रेडिट",
    documents_needed: [
      "NSLSC या आपके प्रांतीय ऋण प्रदाता से छात्र ऋण ब्याज विवरण",
      "2024 या पिछले पाँच वर्षों में चुकाए गए योग्य ब्याज के रिकॉर्ड",
    ],
    filing_destination: "आपके T1 रिटर्न की पंक्ति 31900",
    fallback_explanation:
      "हो सकता है कि आप 2024 या पिछले पाँच वर्षों में सरकारी छात्र ऋण पर चुकाए गए योग्य ब्याज का दावा कर सकें। यह निजी बैंक ऋण या लाइन ऑफ़ क्रेडिट पर लागू नहीं होता; संघीय छात्र ऋण पर 1 अप्रैल 2023 से ब्याज समाप्त हो गया।",
    disclaimer:
      "केवल संघीय अनुमान यदि आपने राशि दर्ज की। निजी ऋण, लाइन ऑफ़ क्रेडिट, पुनर्गठित या समेकित ऋण पर ब्याज योग्य नहीं।",
  },
  moving_expenses_deduction: {
    name: "चलने के खर्च की कटौती",
    documents_needed: [
      "यात्रा, मूवर्स, अस्थायी आवास और अन्य योग्य चलने की लागत की रसीदें",
      "नए स्कूल स्थान पर योग्य आय का प्रमाण",
      "फॉर्म T1-M",
    ],
    filing_destination: "आपके T1 रिटर्न की पंक्ति 21900; फॉर्म T1-M पूरा करें",
    fallback_explanation:
      "यदि आप कम से कम 40km स्कूल के करीब चले गए, तो हो सकता है कि आप चलने के खर्च काट सकें, लेकिन केवल नए स्थान पर योग्य कर योग्य छात्रवृत्ति या रोज़गार आय के विरुद्ध। कई पूर्णकालिक छात्र चलने के वर्ष में इस कटौती के लिए योग्य नहीं होते।",
    disclaimer:
      "कटौती राशि योग्य चलने की लागत और नए स्कूल स्थान पर योग्य आय पर निर्भर करती है।",
  },
  gst_hst_credit: {
    name: "GST/HST क्रेडिट",
    documents_needed: [
      "दाखिल 2024 कर रिटर्न",
      "CRA My Account पहुँच या अद्यतन डाक पता",
      "यदि वर्ष के दौरान कनाडा के निवासी बने तो फॉर्म RC151",
    ],
    filing_destination:
      "2024 कर रिटर्न दाखिल करें; CRA अधिकांश दाखिलकर्ताओं के लिए GST/HST पात्रता स्वचालित रूप से आकलित करता है",
    fallback_explanation:
      "यदि आप कर उद्देश्यों के लिए कनाडा के निवासी हैं और लाभ अवधि तक 19 वर्ष के होंगे, तो अपना 2024 रिटर्न दाखिल करने से GST/HST क्रेडिट के लिए पंजीकरण हो सकता है—यह कम या शून्य आय पर भी मायने रख सकता है।",
    disclaimer:
      "एकल व्यक्ति के लिए अनुमानित अधिकतम; वास्तविक राशि आय, पारिवारिक स्थिति और लाभ वर्ष पर निर्भर करती है।",
  },
  canada_training_credit: {
    name: "Canada Training Credit",
    documents_needed: [
      "T2202 या योग्य ट्यूशन रसीद",
      "आपकी Canada Training Credit Limit दिखाने वाली Notice of Assessment",
    ],
    filing_destination: "आपके T1 रिटर्न की पंक्ति 45350",
    fallback_explanation:
      "यदि आपकी Notice of Assessment पर Canada Training Credit Limit है और आपने योग्य ट्यूशन का भुगतान किया है, तो हो सकता है कि आप वापसी योग्य क्रेडिट दावा कर सकें। यह परिपक्व छात्रों के लिए सबसे प्रासंगिक है क्योंकि सीमा आम तौर पर 26 वर्ष की उम्र से जमा होना शुरू होती है।",
    disclaimer:
      "अधिकतम वार्षिक वापसी योग्य क्रेडिट। वास्तविक राशि आपकी Canada Training Credit Limit और योग्य ट्यूशन पर निर्भर करती है।",
  },
  file_to_register: {
    name: "भविष्य के लाभों के लिए पंजीकरण हेतु रिटर्न दाखिल करें",
    documents_needed: ["SIN", "डाक पता", "प्राप्त होने वाली कोई भी स्लिप, भले ही आय कम हो"],
    filing_destination: "कम या शून्य आय पर भी 2024 कर रिटर्न दाखिल करें",
    fallback_explanation:
      "यदि आप अभी GST/HST क्रेडिट के लिए पर्याप्त उम्र के नहीं हैं, तो भी रिटर्न दाखिल करने से CRA के पास भविष्य के लाभ भुगतानों के लिए आपकी जानकारी तैयार रहती है—कम आय पर भी अक्सर यह करना लायक है।",
    disclaimer:
      "कोई तत्काल अनुमान नहीं। दाखिल करना भविष्य की लाभ पात्रता निर्धारित करने में मदद कर सकता है।",
  },
  alberta_provincial_warning: {
    name: "Alberta प्रांतीय ट्यूशन क्रेडिट चेतावनी",
    documents_needed: ["Notice of Assessment यदि आपके पास पुरानी अप्रयुक्त प्रांतीय ट्यूशन राशि है"],
    filing_destination: "अपना प्रांतीय कर फॉर्म और Notice of Assessment समीक्षा करें",
    fallback_explanation:
      "Alberta ने 2020 और बाद के कर वर्षों के लिए अपने प्रांतीय ट्यूशन और शिक्षा टैक्स क्रेडिट समाप्त कर दिए। आप अभी भी संघीय ट्यूशन क्रेडिट दावा कर सकते हैं, लेकिन TaxBridge को 2024 के लिए Alberta प्रांतीय ट्यूशन अनुमान नहीं जोड़ना चाहिए।",
    disclaimer: "केवल सूचनात्मक ध्वज।",
  },
});

patchCredits("dtc_credits.json", "dtc_credits.hi.json", {
  dtc_marked_restriction: {
    name: "Disability Tax Credit आवेदन: निश्चित प्रतिबंध मार्ग",
    documents_needed: [
      "फॉर्म T2201 Disability Tax Credit प्रमाणपत्र",
      "चिकित्सक विवरण",
      "दैनिक कार्य पर प्रतिबंध कैसे प्रभाव डालता है—उदाहरण",
    ],
    filing_destination:
      "इसे कर रिटर्न पर दावा करने से पहले CRA My Account या फॉर्म T2201 के माध्यम से DTC के लिए आवेदन करें",
    fallback_explanation:
      "आपके उत्तर सुझाव देते हैं कि निश्चित प्रतिबंध मार्ग के तहत DTC के लिए आवेदन करना जाँच सकता है। स्वीकृति CRA देता है, TaxBridge नहीं—योग्य चिकित्सक द्वारा प्रमाणित T2201 की समीक्षा के बाद।",
    disclaimer:
      "अनुमानित वार्षिक संघीय और संभावित प्रांतीय मूल्य। TaxBridge पात्रता निर्धारित नहीं कर सकता; केवल CRA T2201 आवेदन स्वीकार कर सकता है।",
  },
  dtc_significant_restriction: {
    name: "Disability Tax Credit आवेदन: संचयी प्रभाव मार्ग",
    documents_needed: [
      "फॉर्म T2201 Disability Tax Credit प्रमाणपत्र",
      "चिकित्सक विवरण",
      "कई दैनिक गतिविधियों पर संयुक्त प्रभाव के नोट",
    ],
    filing_destination:
      "इसे कर रिटर्न पर दावा करने से पहले CRA My Account या फॉर्म T2201 के माध्यम से DTC के लिए आवेदन करें",
    fallback_explanation:
      "आपके उत्तर संचयी प्रभाव मार्ग के तहत आवेदन करने का सुझाव देते हैं, जहाँ दो या अधिक महत्वपूर्ण प्रतिबंध मिलकर एक प्रमुख प्रतिबंध जैसा प्रभाव बनाते हैं। CRA स्वीकृति अभी भी प्रमाणित T2201 पर निर्भर करती है।",
    disclaimer:
      "अनुमानित वार्षिक संघीय और संभावित प्रांतीय मूल्य। यह आवेदन स्क्रीन है, पात्रता निर्णय नहीं।",
  },
  dtc_life_sustaining_therapy: {
    name: "Disability Tax Credit आवेदन: जीवन रक्षक थेरेपी मार्ग",
    documents_needed: [
      "फॉर्म T2201 Disability Tax Credit प्रमाणपत्र",
      "जीवन रक्षक थेरेपी का चिकित्सक प्रमाणन",
      "थेरेपी समय और आवृत्ति के रिकॉर्ड",
    ],
    filing_destination:
      "इसे कर रिटर्न पर दावा करने से पहले CRA My Account या फॉर्म T2201 के माध्यम से DTC के लिए आवेदन करें",
    fallback_explanation:
      "आपके उत्तर जीवन रक्षक थेरेपी मार्ग के तहत आवेदन करने का सुझाव देते हैं। CRA नियमों में विशिष्ट समय और आवृत्ति परीक्षण हैं—T2201 पूरा करने वाले चिकित्सक के पास स्पष्ट थेरेपी रिकॉर्ड लाएँ।",
    disclaimer:
      "अनुमानित वार्षिक संघीय और संभावित प्रांतीय मूल्य। CRA को T2201 स्वीकृति के बाद ही इसे दावा किया जा सकता है।",
  },
  dtc_retroactive_potential: {
    name: "संभावित पुरावृत्त DTC रिफंड",
    documents_needed: [
      "स्वीकृत फॉर्म T2201",
      "प्रत्येक वर्ष के लिए जिसे पुनर्मूल्यांकित करना है Notice of Assessment",
      "CRA My Account पहुँच या फॉर्म T1-ADJ",
    ],
    filing_destination:
      "T2201 अनुमोदन के बाद CRA My Account या फॉर्म T1-ADJ के माध्यम से पुनर्मूल्यांकन का अनुरोध करें",
    fallback_explanation:
      "यदि आपका DTC आवेदन स्वीकृत होता है, तो CRA 10 पिछले कर वर्षों तक पुनर्मूल्यांकन कर सकता है। क्या इससे रिफंड बनेगा, यह इस बात पर निर्भर करता है कि उन वर्षों में आप पर या समर्थन करने वाले परिवार के सदस्य पर कर देय था—इसे गारंटीशुदा धन नहीं, संभावित मानें।",
    disclaimer:
      "यदि आप या समर्थन करने वाले परिवार के सदस्य पर उन वर्षों में संघीय कर देय था तो ही उपयोगी। वास्तविक रिफंड बहुत भिन्न होते हैं।",
  },
  dtc_child_supplement: {
    name: "DTC बच्चे का अनुपूरक",
    documents_needed: [
      "बच्चे के लिए स्वीकृत फॉर्म T2201",
      "माता-पिता या अभिभावक कर रिटर्न जानकारी",
      "Canada Child Benefit खाता विवरण",
    ],
    filing_destination: "CRA द्वारा फॉर्म T2201 स्वीकृति के बाद 18 से कम उम्र के बच्चे के लिए DTC दावा",
    fallback_explanation:
      "यदि 18 से कम उम्र के बच्चे को DTC के लिए स्वीकृति मिलती है, तो परिवार DTC बच्चे का अनुपूरक दावा कर सकता है। यह Child Disability Benefit से अलग है और CRA स्वीकृति और परिवार की कर स्थिति पर निर्भर करता है।",
    disclaimer:
      "अनुपूरक का अधिकतम अनुमान; वास्तविक मूल्य कर देय और पारिवारिक परिस्थितियों पर निर्भर करता है।",
  },
  child_disability_benefit: {
    name: "Child Disability Benefit",
    documents_needed: [
      "बच्चे के लिए स्वीकृत फॉर्म T2201",
      "Canada Child Benefit पात्रता जानकारी",
      "माता-पिता या अभिभावक के दाखिल कर रिटर्न",
    ],
    filing_destination:
      "DTC स्वीकृति के बाद CRA Canada Child Benefit प्रणाली के माध्यम से Child Disability Benefit प्रशासित करता है",
    fallback_explanation:
      "यदि आपके बच्चे को DTC के लिए स्वीकृति मिलती है, तो हो सकता है कि आपका परिवार Canada Child Benefit प्रणाली के माध्यम से Child Disability Benefit भी प्राप्त करे। राशि लाभ वर्ष और पारिवारिक आय के अनुसार बदलती है।",
    disclaimer:
      "जुलाई 2025 से जून 2026 के लिए CRA के अनुसार वर्तमान अधिकतम; वास्तविक राशि पारिवारिक शुद्ध आय पर निर्भर करती है।",
  },
  dtc_transfer_to_supporter: {
    name: "समर्थन करने वाले परिवार के सदस्य को विकलांता राशि स्थानांतरित करें",
    documents_needed: [
      "स्वीकृत फॉर्म T2201",
      "समर्थन करने वाले परिवार के सदस्य की कर जानकारी",
      "समर्थन संबंध के रिकॉर्ड",
    ],
    filing_destination:
      "यदि लागू हो तो आश्रित से स्थानांतरित विकलांता राशि के लिए पंक्ति 31800",
    fallback_explanation:
      "यदि आपको DTC के लिए स्वीकृति मिलती है लेकिन आप स्वयं पूरी राशि उपयोग नहीं कर सकते, तो हो सकता है कि समर्थन करने वाला परिवार का सदस्य स्थानांतरित विकलांता राशि का दावा कर सके। यह संबंध, समर्थन तथ्य और उनके कर देय पर निर्भर करता है।",
    disclaimer:
      "संभावित मूल्य समर्थन करने वाले परिवार के सदस्य के कर देय और प्रांत पर निर्भर करता है।",
  },
  rdsp_unlock: {
    name: "Registered Disability Savings Plan (RDSP) खोलना",
    documents_needed: [
      "स्वीकृत फॉर्म T2201",
      "SIN",
      "बैंक या वित्तीय संस्थान RDSP आवेदन आवश्यकताएँ",
    ],
    filing_destination:
      "DTC अनुमोदन के बाद भाग लेने वाले वित्तीय संस्थान के माध्यम से RDSP खोलें",
    fallback_explanation:
      "RDSP खोलने के लिए DTC अनुमोदन आवश्यक है। RDSP सरकारी अनुदान और बॉन्ड को अनलॉक कर सकता है; Alberta में RDSP धन आम तौर पर AISH आय गणना से छूट है।",
    disclaimer:
      "वार्षिक अनुदान और बॉन्ड की संभावना; जीवन भर सरकारी योगदान बहुत अधिक हो सकते हैं। वास्तविक राशि योगदान, आय और RDSP नियमों पर निर्भर करती है।",
  },
  cwb_disability_supplement: {
    name: "संभावित Canada Workers Benefit विकलांगता अनुपूरक",
    documents_needed: [
      "रोज़गार या स्वरोज़गार आय के रिकॉर्ड",
      "स्वीकृत DTC स्थिति",
      "CRA CWB पात्रता जानकारी",
    ],
    filing_destination:
      "यदि CRA मानदंड पूरे हों तो T1 रिटर्न का Canada Workers Benefit खंड",
    fallback_explanation:
      "क्योंकि आपके पास काम की आय थी, DTC स्वीकृति के बाद Canada Workers Benefit विकलांगता अनुपूरक जाँचने योग्य हो सकता है। यह स्वचालित नहीं है: CRA आय, प्रांत, पारिवारिक स्थिति और पूर्णकालिक छात्र исключения लागू करता है।",
    disclaimer:
      "केवल संभावित पात्रता। CRA आय, प्रांत, पारिवारिक स्थिति और पूर्णकालिक छात्र исключения जाँचना होगा।",
  },
  find_practitioner_first: {
    name: "पहले योग्य चिकित्सक खोजें",
    documents_needed: [
      "वर्तमान उपचार, दवाओं और सहायक उपकरणों की सूची",
      "दैनिक कार्य पर प्रभाव के उदाहरण",
      "डॉक्टर, नर्स प्रैक्टिशनर या अन्य योग्य प्रमाणक का संपर्क",
    ],
    filing_destination:
      "CRA My Account या फोन के माध्यम से भाग A शुरू करें, फिर चिकित्सक भाग B पूरा करें",
    fallback_explanation:
      "सबसे बड़ा अगला कदम योग्य चिकित्सक खोजना है जो T2201 के सही खंड को प्रमाणित कर सके। नर्स प्रैक्टिशनर सभी खंडों को प्रमाणित कर सकते हैं, और विकलांगता वकालत संगठन तैयारी में मदद कर सकते हैं।",
    disclaimer:
      "कार्यवाही चरण। CRA निर्णय से पहले चिकित्सक को T2201 प्रमाणित करना होगा।",
  },
  consider_reapplication_federal: {
    name: "संघीय DTC नियम परिवर्तनों के बाद पुनः जाँच पर विचार करें",
    documents_needed: [
      "यदि उपलब्ध हो तो पिछला DTC अस्वीकार पत्र",
      "अद्यतन चिकित्सा जानकारी",
      "वर्तमान फॉर्म T2201",
    ],
    filing_destination:
      "वर्तमान CRA DTC पात्रता नियमों की समीक्षा करें और नया फॉर्म T2201 आवेदन विचार करें",
    fallback_explanation:
      "क्योंकि आपका अस्वीकार 2022 से पहले था, अपडेटेड DTC मानदंडों के तहत पुनः स्क्रीनिंग करना जाँच सकता है, विशेष रूप से मानसिक कार्यों या जीवन रक्षक थेरेपी के लिए। इसका मतलब स्वीकृति की गारंटी नहीं; CRA अभी भी वर्तमान चिकित्सा प्रमाणन पर निर्भर करता है।",
    disclaimer:
      "केवल पुनः आवेदन मार्गदर्शन। CRA अभी भी वर्तमान प्रमाणन और समीक्षा के आधार पर निर्णय लेता है।",
  },
  aish_reapplication_required: {
    name: "AISH DTC पुनः आवेदन आवश्यकता",
    documents_needed: [
      "यदि उपलब्ध हो तो पिछला DTC अस्वीकार पत्र",
      "AISH पत्राचार",
      "अद्यतन फॉर्म T2201 आवेदन सामग्री",
    ],
    filing_destination:
      "संघीय विकलांता सहायता के लिए आवेदन करते समय Alberta मार्गदर्शन का पालन करें",
    fallback_explanation:
      "Alberta कहता है कि DTC पात्रता से पहले अस्वीकृत AISH प्राप्तकर्ताओं को पुनः आवेदन करना आवश्यक है क्योंकि संघीय पात्रता मानदंड बदल गए। यह CRA के अंतिम DTC निर्णय से अलग है।",
    disclaimer: "Alberta-विशिष्ट कार्यवाही चेतावनी।",
  },
  aish_cdb_warning: {
    name: "AISH और Canada Disability Benefit चेतावनी",
    documents_needed: ["AISH सूचनाएँ", "यदि लागू हो तो Canada Disability Benefit आवेदन स्थिति", "DTC आवेदन स्थिति"],
    filing_destination: "Alberta की AISH संघीय विकलांता सहायता मार्गदर्शन की समीक्षा करें",
    fallback_explanation:
      "AISH प्राप्तकर्ताओं के लिए: Alberta आपसे संघीय विकलांता सहायता जिसमें Canada Disability Benefit और DTC मार्ग शामिल हैं, के लिए आवेदन करने की आवश्यकता है। Alberta सरकार की नीति के अनुसार, यदि आपके CDB आवेदन पर फरवरी 28, 2026 तक निर्णय नहीं हुआ, तो अप्रैल 2026 से आपके AISH लाभ से $200 CDB आय घटाई जा सकती है। AISH प्राप्तकर्ताओं के लिए CDB को Modified Living Allowance के लिए पात्र लोगों के लिए छूट आय माना जाता है। DTC के लिए आवेदन अभी भी पुराने कर रिफंड और RDSP पहुँच में मदद कर सकता है, लेकिन TaxBridge यह वादा नहीं कर सकता कि आपकी मासिक आय बढ़ेगी।",
    disclaimer:
      "Alberta-विशिष्ट सूचनात्मक चेतावनी। AISH प्राप्तकर्ताओं के लिए वयस्क CDB को अतिरिक्त मासिक आय के रूप में न दिखाएँ।",
  },
});

console.log("Wrote Hindi JSON files to src/data/*.hi.json");
