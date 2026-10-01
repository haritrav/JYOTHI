import { SupportedLanguage } from '@/types';
import {
  VERIFIED_SCHEMES,
  VERIFIED_ELECTRICITY_UPDATES,
  VERIFIED_RATION_UPDATES,
  VERIFIED_WORK_OPPORTUNITIES,
  VERIFIED_HEALTH_CAMPS,
  VERIFIED_VACCINATION_SESSIONS,
  VERIFIED_SUPPORT_CENTRES,
  VERIFIED_COUNSELLING_SERVICES
} from '@/data/verifiedData';

export interface AIResponse {
  intent: string;
  responseText: string;
  audioSpeechText: string;
  actionType:
    | 'safety_immediate'
    | 'safety_support'
    | 'show_schemes'
    | 'show_electricity'
    | 'show_ration'
    | 'show_work'
    | 'show_health'
    | 'show_vaccination'
    | 'show_counselling'
    | 'general_guidance';
  matchedData?: Record<string, unknown>;
  suggestedFollowUps: string[];
}

export function processAIQuery(
  rawQuery: string,
  language: SupportedLanguage,
  userVillage?: string
): AIResponse {
  const query = rawQuery.toLowerCase().trim();

  // 1. SAFETY & IMMEDIATE DANGER INTENTS
  const emergencyKeywords = [
    'danger', 'help me', 'emergency', 'hurt', 'threat', 'kill', 'attack', 'police', 'abuse',
    'ஆபத்து', 'காப்பாற்று', 'அடிக்கிறார்', 'பயம்', 'மிரட்டல்', 'காவல்துறை', 'அவசரம்', 'கொடுமை',
    'खतरा', 'बचाओ', 'मारपीट', 'धमकी', 'डर', 'पुलिस', 'आपातकाल', 'हिंसा',
    'ప్రమాదం', 'కాపాడండి', 'కొడుతున్నారు', 'భయం', 'బెదిరింపు', 'పోలీస్', 'ఎమర్జెన్సీ',
    'അപകടം', 'രക്ഷിക്കൂ', 'ഉപദ്രവം', 'ഭയം', 'ഭീഷണി', 'പോലീസ്', 'അടിയന്തരം'
  ];

  const isEmergency = emergencyKeywords.some(k => query.includes(k));

  if (isEmergency) {
    const responses: Record<SupportedLanguage, { text: string; speech: string }> = {
      ta: {
        text: 'தயவுசெய்து பயப்படாதீர்கள். உங்கள் பாதுகாப்பு மிக முக்கியம். நீங்கள் உடனடி ஆபத்தில் இருந்தால் உடனடியாக 112 அல்லது மகளிர் உதவி எண் 181-ஐ அழையுங்கள். நாங்கள் உங்களுக்கு முழு ஆதரவாக உள்ளோம்.',
        speech: 'தயவுசெய்து பயப்படாதீர்கள் சகோதரி. உங்கள் பாதுகாப்பு மிக முக்கியம். உடனடியாக 112 அல்லது 181-ஐ அழைக்கவும்.'
      },
      hi: {
        text: 'कृपया घबराएं नहीं। आपकी सुरक्षा सबसे महत्वपूर्ण है। यदि आप तुरंत खतरे में हैं तो अभी 112 या महिला हेल्पलाइन 181 पर कॉल करें। हम आपकी पूरी सहायता के लिए तत्पर हैं।',
        speech: 'कृपया घबराएं नहीं दीदी। आपकी सुरक्षा सबसे महत्वपूर्ण है। तुरंत 112 या 181 पर कॉल करें।'
      },
      te: {
        text: 'దయచేసి భయపడవద్దు. మీ భద్రత చాలా ముఖ్యం. మీరు తక్షణ ప్రమాదంలో ఉంటే వెంటనే 112 లేదా మహిళా హెల్ప్‌లైన్ 181కి కాల్ చేయండి.',
        speech: 'దయచేసి భయపడవద్దు అక్కా. మీ భద్రత మాకు ముఖ్యం. వెంటనే 112 లేదా 181కి కాల్ చేయండి.'
      },
      ml: {
        text: 'ദയവായി പേടിക്കേണ്ടതില്ല. നിങ്ങളുടെ സുരക്ഷയാണ് പ്രധാനം. നിങ്ങൾ പെട്ടെന്നുള്ള അപകടത്തിലാണെങ്കിൽ ഉടൻ 112 അല്ലെങ്കിൽ വനിതാ ഹെൽപ്പ്‌ലൈൻ 181 ലേക്ക് വിളിക്കുക.',
        speech: 'ദയവായി പേടിക്കരുത്. നിങ്ങളുടെ സുരക്ഷയാണ് പ്രധാനം. ഉടൻ 112 അല്ലെങ്കിൽ 181 ലേക്ക് വിളിക്കുക.'
      }
    };

    return {
      intent: 'SAFETY_EMERGENCY',
      responseText: responses[language].text,
      audioSpeechText: responses[language].speech,
      actionType: 'safety_immediate',
      matchedData: { supportCentres: VERIFIED_SUPPORT_CENTRES },
      suggestedFollowUps: ['112 Call', '181 Women Helpline', 'Nearby Sakhi Centre']
    };
  }

  // 2. DOMESTIC VIOLENCE & DOWRY SUPPORT
  const safetyKeywords = [
    'dowry', 'domestic', 'husband', 'in laws', 'harass', 'violence', 'torture',
    'வரதட்சணை', 'கணவர்', 'மாமியார்', 'துன்புறுத்தல்', 'குடும்ப வன்முறை',
    'दहेज', 'पति', 'ससुराल', 'प्रताड़ना', 'घरेलू हिंसा',
    'వరకట్నం', 'భర్త', 'అత్తమామలు', 'వేధింపులు', 'గృహ హింస',
    'സ്ത്രീധനം', 'ഭർത്താവ്', 'പീഡനം', 'ഗാർഹിക പീഡനം'
  ];

  if (safetyKeywords.some(k => query.includes(k))) {
    const responses: Record<SupportedLanguage, { text: string; speech: string }> = {
      ta: {
        text: 'நீங்கள் தனியாக இல்லை. குடும்ப வன்முறை அல்லது வரதட்சணை கொடுமைக்கு எதிராக உங்களுக்கு சட்டம் மற்றும் அரசு ஆதரவு மையங்கள் உள்ளன. சகி ஒன் ஸ்டாப் மையம் மற்றும் இலவச சட்ட உதவி மைய விவரங்கள் இங்கே உள்ளன.',
        speech: 'நீங்கள் தனியாக இல்லை. உங்களுக்கு உதவ அரசு ஆதரவு மையங்களும் இலவச சட்ட உதவிகளும் உள்ளன.'
      },
      hi: {
        text: 'आप अकेली नहीं हैं। घरेलू हिंसा या दहेज प्रताड़ना के खिलाफ कानून आपके साथ है। आप सखी वन स्टॉप सेंटर में मुफ्त आश्रय, कानूनी मदद और महिला हेल्पलाइन 181 से संपर्क कर सकती हैं।',
        speech: 'आप अकेली नहीं हैं दीदी। सखी सेंटर और महिला हेल्पलाइन 181 आपकी पूरी सहायता करेंगे।'
      },
      te: {
        text: 'మీరు ఒంటరిగా లేరు. గృహ హింస మరియు వరకట్న వేధింపుల నుండి రక్షణ పొందడానికి సఖి కేంద్రం మరియు ఉచిత న్యాయ సహాయం అందుబాటులో ఉన్నాయి.',
        speech: 'మీరు ఒంటరిగా లేరు అక్కా. మీకు ఉచిత న్యాయ సహాయం మరియు సఖి కేంద్ర మద్దతు ఉన్నాయి.'
      },
      ml: {
        text: 'നിങ്ങൾ തനിച്ചല്ല. ഗാർഹിക പീഡനത്തിനെതിരെ സൗജന്യ നിയമസഹായവും സഖി വൺ സ്റ്റോപ്പ് സെന്ററിന്റെ സംരക്ഷണവും ലഭ്യമാണ്.',
        speech: 'നിങ്ങൾ തനിച്ചല്ല. സൗജന്യ നിയമസഹായവും സഖി സെന്ററിന്റെ പിന്തുണയും ലഭ്യമാണ്.'
      }
    };

    return {
      intent: 'SAFETY_SUPPORT',
      responseText: responses[language].text,
      audioSpeechText: responses[language].speech,
      actionType: 'safety_support',
      matchedData: { supportCentres: VERIFIED_SUPPORT_CENTRES },
      suggestedFollowUps: ['Sakhi One Stop Centre', 'Free Legal Aid', 'Safety Plan']
    };
  }

  // 3. ELECTRICITY OUTAGE INTENTS
  const electricityKeywords = [
    'electric', 'power', 'current', 'light cut', 'shutdown',
    'மின்சாரம்', 'மின்வெட்டு', 'கரண்ட்', 'லைட்',
    'बिजली', 'लाइट', 'पावर कट', 'विद्युत',
    'కరెంట్', 'విద్యుత్', 'లైట్',
    'വൈദ്യുതി', 'കറന്റ്', 'പവർ കട്ട്'
  ];

  if (electricityKeywords.some(k => query.includes(k))) {
    const matched = VERIFIED_ELECTRICITY_UPDATES[0];
    const responses: Record<SupportedLanguage, { text: string; speech: string }> = {
      ta: {
        text: `மின் வாரிய அறிவிப்பின்படி, ${matched.scheduleDate} அன்று காலை ${matched.startTime} முதல் மாலை ${matched.endTime} வரை ${matched.affectedVillages.join(', ')} பகுதிகளில் மாதாந்திர பராமரிப்பு பணி காரணமாக மின் தடை திட்டமிடப்பட்டுள்ளது. உதவி எண்: 1912.`,
        speech: `மின் வாரிய அறிவிப்பின்படி, நாளை காலை ${matched.startTime} முதல் மாலை ${matched.endTime} வரை உங்கள் பகுதியில் பராமரிப்பு பணி காரணமாக மின்சாரம் நிறுத்தப்படும்.`
      },
      hi: {
        text: `विद्युत विभाग के अनुसार, ${matched.scheduleDate} को प्रातः ${matched.startTime} से दोपहर ${matched.endTime} तक रखरखाव कार्य के कारण बिजली आपूर्ति बंद रहेगी। हेल्पलाइन: 1912.`,
        speech: `विद्युत विभाग के अनुसार, कल प्रातः ${matched.startTime} से दोपहर ${matched.endTime} तक बिजली बंद रहेगी।`
      },
      te: {
        text: `విద్యుత్ శాఖ సమాచారం ప్రకారం, ${matched.scheduleDate} ఉదయం ${matched.startTime} నుండి సాయంత్రం ${matched.endTime} వరకు నిర్వహణ పనుల వల్ల కరెంట్ సరఫరా ఉండదు. హెల్ప్‌లైన్: 1912.`,
        speech: `విద్యుత్ సమాచారం ప్రకారం రేపు ఉదయం ${matched.startTime} నుండి ${matched.endTime} వరకు కరెంట్ కోత ఉంటుంది.`
      },
      ml: {
        text: `വൈദ്യുതി ബോർഡിന്റെ അറിയിപ്പ് പ്രകാരം, ${matched.scheduleDate} രാവിലെ ${matched.startTime} മുതൽ വൈകുന്നേരം ${matched.endTime} വരെ മെയിന്റനൻസ് കാരണം വൈദ്യുതി മുടങ്ങും. ഹെൽപ്പ്‌ലൈൻ: 1912.`,
        speech: `നാളെ രാവിലെ ${matched.startTime} മുതൽ വൈകുന്നേരം ${matched.endTime} വരെ വൈദ്യുതി മുടങ്ങും.`
      }
    };

    return {
      intent: 'LOCAL_ELECTRICITY',
      responseText: responses[language].text,
      audioSpeechText: responses[language].speech,
      actionType: 'show_electricity',
      matchedData: { electricity: matched },
      suggestedFollowUps: ['Electricity Helpline 1912', 'Affected Areas', 'Local Updates']
    };
  }

  // 4. RATION UPDATES INTENTS
  const rationKeywords = [
    'ration', 'pds', 'rice', 'sugar', 'dal', 'oil', 'food grain',
    'ரேஷன்', 'அரிசி', 'பருப்பு', 'சர்க்கரை', 'சீனி', 'எண்ணெய்', 'நியாயவிலை',
    'राशन', 'चावल', 'गेहूं', 'दाल', 'शक्कर', 'कोटा', 'दुकान',
    'రేషన్', 'బియ్యం', 'పప్పు', 'చక్కెర', 'నూనె', 'కోటా',
    'റേഷൻ', 'അരി', 'പഞ്ചസാര', 'പയർ', 'പാം ഓയിൽ'
  ];

  if (rationKeywords.some(k => query.includes(k))) {
    const matched = VERIFIED_RATION_UPDATES[0];
    const responses: Record<SupportedLanguage, { text: string; speech: string }> = {
      ta: {
        text: `உங்கள் நியாயவிலைக் கடையில் (${matched.shopNumber}) அக்டோபர் மாதத்திற்கான இலவச அரிசி (20 கிலோ), துவரம் பருப்பு (₹30), பாமாயில் (₹25), சர்க்கரை இருப்பு வைக்கப்பட்டு விநியோகம் நடைபெற்று வருகிறது. கடை நேரம்: ${matched.openTimings}.`,
        speech: `உங்கள் ரேஷன் கடையில் இலவச அரிசி மற்றும் பொருட்கள் இருப்பு உள்ளன. கடை நேரம் காலை 8:30 முதல் மாலை 7 மணி வரை.`
      },
      hi: {
        text: `आपकी उचित मूल्य राशन दुकान (${matched.shopNumber}) पर अक्टूबर माह का मुफ्त चावल, दाल, चीनी एवं तेल उपलब्ध है। दुकान का समय: ${matched.openTimings}.`,
        speech: `आपकी राशन दुकान पर मुफ्त चावल और खाद्यान्न उपलब्ध है।`
      },
      te: {
        text: `మీ రేషన్ షాపులో (${matched.shopNumber}) అక్టోబర్ నెలకు ఉచిత బియ్యం, పప్పు మరియు నూనె అందుబాటులో ఉన్నాయి. షాప్ సమయం: ${matched.openTimings}.`,
        speech: `మీ రేషన్ షాపులో ఉచిత బియ్యం మరియు సరుకులు అందుబాటులో ఉన్నాయి.`
      },
      ml: {
        text: `റേഷൻ കടയിൽ (${matched.shopNumber}) ഒക്ടോബർ മാസത്തെ സൗജന്യ അരിയും സാധനങ്ങളും ലഭ്യമാണ്. സമയക്രമം: ${matched.openTimings}.`,
        speech: `റേഷൻ കടയിൽ സൗജന്യ അരിയും സാധനങ്ങളും സ്റ്റോക്കുണ്ട്.`
      }
    };

    return {
      intent: 'LOCAL_RATION',
      responseText: responses[language].text,
      audioSpeechText: responses[language].speech,
      actionType: 'show_ration',
      matchedData: { ration: matched },
      suggestedFollowUps: ['Ration Shop Timings', 'Helpline 1967', 'Stock Details']
    };
  }

  // 5. 100-DAY MGNREGA WORK INTENTS
  const workKeywords = [
    '100 day', 'mgnrega', 'nrega', 'work', 'job', 'wages', 'pond',
    '100 நாள்', 'நூறு நாள்', 'வேலை', 'கூலி', 'ஊரணி', 'குளம்', 'மகாத்மா காந்தி',
    '100 दिन', 'मनरेगा', 'नरेगा', 'रोजगार', 'मजदूरी', 'तालाब',
    '100 రోజుల పని', 'ఉపాధి హామీ', 'నరేగా', 'కూలి', 'చెరువు',
    'തൊഴിലുറപ്പ്', '100 ദിനം', 'തൊഴിൽ', 'കൂലി'
  ];

  if (workKeywords.some(k => query.includes(k))) {
    const matched = VERIFIED_WORK_OPPORTUNITIES[0];
    const responses: Record<SupportedLanguage, { text: string; speech: string }> = {
      ta: {
        text: `மகாத்மா காந்தி 100 நாள் வேலை திட்டத்தின் கீழ், ஜமீன் உத்துகுளி ஊரணி தூர்வாருதல் பணி வரும் அக்டோபர் 5 முதல் தொடங்குகிறது. தினசரி கூலி ₹319. ஜாப் கார்டு உள்ளவர்கள் ஊராட்சி செயலாளரிடம் பெயர் பதிவு செய்யலாம்.`,
        speech: `அக்டோபர் 5 முதல் ஊரணி தூர்வாரும் 100 நாள் வேலை தொடங்குகிறது. தினசரி கூலி ₹319.`
      },
      hi: {
        text: `मनरेगा 100-दिवसीय योजना के तहत 5 अक्टूबर से गाँव के तालाब की खुदाई कार्य शुरू हो रहा है। दैनिक मजदूरी ₹319 है। जॉब कार्ड धारक पंचायत में नाम दर्ज कराएं।`,
        speech: `5 अक्टूबर से मनरेगा 100 दिन का कार्य शुरू हो रहा है। मजदूरी ₹319 प्रतिदिन है।`
      },
      te: {
        text: `ఉపాధి హామీ 100 రోజుల పథకం కింద అక్టోబర్ 5 నుండి చెరువు పనులు ప్రారంభమవుతాయి. రోజువారీ కూలి ₹319. పంచాయతీ కార్యదర్శి వద్ద పేరు నమోదు చేసుకోండి.`,
        speech: `అక్టోబర్ 5 నుండి ఉపాధి హామీ పనులు ప్రారంభం. రోజువారీ కూలి ₹319.`
      },
      ml: {
        text: `മഹാത്മാഗാന്ധി തൊഴിലുറപ്പ് പദ്ധതി പ്രകാരം ഒക്ടോബർ 5 മുതൽ കുളം നവീകരണ ജോലികൾ ആരംഭിക്കുന്നു. ദിവസ വേതനം ₹319. പഞ്ചായത്തിൽ പേര് രജിസ്റ്റർ ചെയ്യാം.`,
        speech: `ഒക്ടോബർ 5 മുതൽ തൊഴിലുറപ്പ് ജോലി ആരംഭിക്കുന്നു. ദിവസ വേതനം ₹319.`
      }
    };

    return {
      intent: 'LOCAL_WORK',
      responseText: responses[language].text,
      audioSpeechText: responses[language].speech,
      actionType: 'show_work',
      matchedData: { work: matched },
      suggestedFollowUps: ['Apply for MGNREGA', 'Daily Wage ₹319', 'Panchayat Office']
    };
  }

  // 6. HEALTH CAMPS INTENTS
  const healthKeywords = [
    'health', 'camp', 'doctor', 'hospital', 'cancer', 'eye', 'bp', 'sugar', 'clinic',
    'மருத்துவம்', 'முகாம்', 'மருத்துவர்', 'பரிசோதனை', 'கண்', 'புற்றுநோய்', 'சர்க்கரை',
    'स्वास्थ्य', 'कैंप', 'डॉक्टर', 'अस्पताल', 'जांच', 'आंख', 'महिला जांच',
    'ఆరోగ్యం', 'క్యాంప్', 'డాక్టర్', 'ఆసుపత్రి', 'కంటి పరీక్ష', 'పరీక్షలు',
    'ആരോഗ്യം', 'മെഡിക്കൽ ക്യാമ്പ്', 'ഡോക്ടർ', 'ആശുപത്രി', 'നേത്ര പരിശോധന'
  ];

  if (healthKeywords.some(k => query.includes(k))) {
    const matched = VERIFIED_HEALTH_CAMPS[0];
    const responses: Record<SupportedLanguage, { text: string; speech: string }> = {
      ta: {
        text: `அருகிலுள்ள அரசு ஆரம்ப சுகாதார நிலையத்தில் (PHC) வரும் ஞாயிற்றுக்கிழமை (04-அக்) காலை 9:00 முதல் இலவச மகளிர் சிறப்பு மருத்துவ முகாம் நடைபெறுகிறது. ரத்த சோகை, சர்க்கரை, கர்ப்பப்பை வாய் மற்றும் மார்பக புற்றுநோய் இலவச பரிசோதனை செய்யப்படும்.`,
        speech: `வரும் ஞாயிற்றுக்கிழமை ஆரம்ப சுகாதார நிலையத்தில் இலவச மகளிர் சிறப்பு மருத்துவ முகாம் நடக்கிறது.`
      },
      hi: {
        text: `नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) पर आगामी रविवार (04 अक्टूबर) को निःशुल्क महिला विशेष स्वास्थ्य जांच शिविर आयोजित है। हीमोग्लोबिन, बीपी व कैंसर स्क्रीनिंग मुफ्त होगी।`,
        speech: `रविवार को प्राथमिक स्वास्थ्य केंद्र पर मुफ्त महिला स्वास्थ्य जांच शिविर है।`
      },
      te: {
        text: `సమీప ప్రాథమిక ఆరోగ్య కేంద్రంలో (PHC) ఆదివారం ఉచిత మహిళా ప్రత్యేక ఆరోగ్య శిబిరం జరుగుతుంది. రక్త పరీక్షలు, క్యాన్సర్ స్క్రీనింగ్ ఉచితంగా చేస్తారు.`,
        speech: `ఆదివారం పీహెచ్‌సీలో ఉచిత మహిళా వైద్య శిబిరం జరుగుతుంది.`
      },
      ml: {
        text: `സമീപത്തെ പി.എച്ച്.സിയിൽ ഞായറാഴ്ച രാവിലെ 9 മുതൽ സൗജന്യ വനിതാ ആരോഗ്യ ക്യാമ്പ് നടക്കും. വിളർച്ച, കാൻസർ സ്ക്രീനിംഗ് സൗജന്യമായിരിക്കും.`,
        speech: `ഞായറാഴ്ച പി.എച്ച്.സിയിൽ സൗജന്യ വനിതാ മെഡിക്കൽ ക്യാമ്പ് നടക്കും.`
      }
    };

    return {
      intent: 'HEALTH_CAMPS',
      responseText: responses[language].text,
      audioSpeechText: responses[language].speech,
      actionType: 'show_health',
      matchedData: { healthCamps: VERIFIED_HEALTH_CAMPS },
      suggestedFollowUps: ['Women Health Camp', 'Free Eye Camp', 'Health Helpline 104']
    };
  }

  // 7. VACCINATION INTENTS
  const vaccineKeywords = [
    'vaccin', 'baby', 'child', 'polio', 'bcg', 'injection', 'drop',
    'தடுப்பூசி', 'குழந்தை', 'போலியோ', 'ஊசி', 'சொட்டு மருந்து', 'ஆஷா',
    'टीका', 'टीकाकरण', 'शिशु', 'पोलियो', 'सुई', 'आशा',
    'టీకా', 'వ్యాక్సిన్', 'పిల్లలు', 'పోలియో', 'శిశువు',
    'വാക്സിൻ', 'കുത്തിവയ്പ്പ്', 'കുഞ്ഞ്', 'പോളിയോ'
  ];

  if (vaccineKeywords.some(k => query.includes(k))) {
    const matched = VERIFIED_VACCINATION_SESSIONS[0];
    const responses: Record<SupportedLanguage, { text: string; speech: string }> = {
      ta: {
        text: `கிராம அங்கன்வாடி மையத்தில் வரும் புதன்கிழமை (07-அக்) காலை 9:00 மணி முதல் 0-5 வயது குழந்தைகளுக்கு BCG, போலியோ, பெண்டாவேலன்ட் இலவச தடுப்பூசி முகாம் நடைபெறுகிறது. ஆஷா பணியாளர் சுமதி: 98421-55120.`,
        speech: `வரும் புதன்கிழமை காலை 9 மணிக்கு அங்கன்வாடியில் குழந்தை தடுப்பூசி முகாம் நடைபெறுகிறது.`
      },
      hi: {
        text: `गाँव के आंगनवाड़ी केंद्र पर आगामी बुधवार (07 अक्टूबर) को प्रातः 9:00 बजे से 0-5 वर्ष के बच्चों का निःशुल्क टीकाकरण सत्र है। आशा कार्यकर्ता सुमति से संपर्क करें।`,
        speech: `बुधवार को आंगनवाड़ी केंद्र में शिशु टीकाकरण सत्र है।`
      },
      te: {
        text: `గ్రామ అంగన్‌వాడీ కేంద్రంలో బుధవారం ఉదయం 9 గంటల నుండి 0-5 సంవత్సరాల పిల్లలకు ఉచిత టీకాల కార్యక్రమం జరుగుతుంది.`,
        speech: `బుధవారం అంగన్‌వాడీలో శిశు టీకాల శిబిరం జరుగుతుంది.`
      },
      ml: {
        text: `അങ്കണവാടിയിൽ ബുധനാഴ്ച രാവിലെ 9 മുതൽ 0-5 വയസ്സുള്ള കുട്ടികൾക്കായി സൗജന്യ വാക്സിനേഷൻ ക്യാമ്പ് നടക്കും.`,
        speech: `ബുധനാഴ്ച അങ്കണവാടിയിൽ കുട്ടികൾക്കുള്ള വാക്സിനേഷൻ ക്യാമ്പ് നടക്കും.`
      }
    };

    return {
      intent: 'CHILD_VACCINATION',
      responseText: responses[language].text,
      audioSpeechText: responses[language].speech,
      actionType: 'show_vaccination',
      matchedData: { vaccination: matched },
      suggestedFollowUps: ['Vaccine Schedule', 'ASHA Contact', 'Set Reminder']
    };
  }

  // 8. COUNSELLING & MENTAL HEALTH INTENTS
  const mentalKeywords = [
    'talk', 'counsel', 'sad', 'depress', 'crying', 'mind', 'stress', 'peace', 'manas',
    'மனசு', 'பேச வேண்டும்', 'கவலை', 'அழுத்தம்', 'அழுகை', 'மனநலம்', 'ஆலோசனை',
    'बात करनी है', 'परामर्श', 'तनाव', 'चिंता', 'उदास', 'मानसिक', 'काउंसलिंग',
    'మాట్లాడాలి', 'కౌన్సెలింగ్', 'ఆందోళన', 'బాధ', 'ఒత్తిడి', 'మానసిక మద్దతు',
    'സംസാരിക്കണം', 'കൗൺസിലിംഗ്', 'വിഷമം', 'സമ്മർദ്ദം', 'മാനസികാരോഗ്യം'
  ];

  if (mentalKeywords.some(k => query.includes(k))) {
    const responses: Record<SupportedLanguage, { text: string; speech: string }> = {
      ta: {
        text: 'மனக்கவலை, பயம் அல்லது அழுத்தத்தை உள்ளுக்குள்ளேயே பூட்டி வைக்காதீர்கள். உங்கள் தாய்மொழியிலேயே பேச Tele-MANAS இலவச 24/7 எண்: 14416 அல்லது 1800-89-14416. நீங்கள் எங்கள் பெண் ஆலோசகரிடம் இலவச ஆலோசனைக்கு இப்போது பதிவு செய்யலாம்.',
        speech: 'மனக்கவலையை உள்ளேயே பூட்டி வைக்காதீர்கள். Tele-MANAS 14416 அல்லது எங்கள் இலவச ஆலோசனையை நீங்கள் அணுகலாம்.'
      },
      hi: {
        text: 'तनाव या चिंता को अकेले न सहें। अपनी भाषा में बात करने के लिए टेली-मानस 24/7 मुफ्त नंबर 14416 या 1800-89-14416 डायल करें। आप निःशुल्क महिला काउंसलर सत्र के लिए यहाँ पंजीकरण भी कर सकती हैं।',
        speech: 'तनाव में अकेले न रहें। टेली-मानस 14416 पर कॉल करें या मुफ्त परामर्श बुक करें।'
      },
      te: {
        text: 'మీ బాధను లోపలే దాచుకోకండి. మీ మాతృభాషలోనే మాట్లాడటానికి Tele-MANAS ఉచిత హెల్ప్‌లైన్ 14416 లేదా ఉచిత మహిళా కౌన్సెలింగ్ కోసం నమోదు చేసుకోండి.',
        speech: 'మీ బాధను లోపలే ఉంచుకోవద్దు. Tele-MANAS 14416 కాల్ చేయండి లేదా ఉచిత కౌన్సెలింగ్ పొందండి.'
      },
      ml: {
        text: 'മനസ്സിലെ വിഷമങ്ങൾ പങ്കുവെക്കൂ. ടെലി-മാനസ് 24/7 സൗജന്യ നമ്പർ 14416 ലേക്ക് വിളിക്കാം. അല്ലെങ്കിൽ സൗജന്യ വനിതാ കൗൺസിലിംഗിനായി രജിസ്റ്റർ ചെയ്യാം.',
        speech: 'വിഷമങ്ങൾ ആരോടെങ്കിലും പങ്കുവെക്കൂ. ടെലി-മാനസ് 14416 ലേക്ക് വിളിക്കുക.'
      }
    };

    return {
      intent: 'MENTAL_HEALTH',
      responseText: responses[language].text,
      audioSpeechText: responses[language].speech,
      actionType: 'show_counselling',
      matchedData: { counselling: VERIFIED_COUNSELLING_SERVICES },
      suggestedFollowUps: ['Call Tele-MANAS 14416', 'Register Free Session', 'Self-Care Tips']
    };
  }

  // 9. GOVERNMENT SCHEME INTENTS (DEFAULT MATCH OR KEYWORD MATCH)
  const schemeKeywords = [
    'scheme', 'money', '1000', 'grant', 'financial', 'government', 'kmut', 'ujjwala', 'gas', 'house', 'pmay', 'pregnant', 'pmmvy',
    'திட்டம்', 'பணம்', '1000 ரூபாய்', 'உதவித்தொகை', 'மகளிர் உரிமை', 'கேஸ்', 'வீடு', 'கர்ப்பிணி', 'அரசு',
    'योजना', 'पैसा', '1000', 'आर्थिक सहायता', 'सरकारी', 'उज्ज्वला', 'आवास', 'गर्भवती', 'मातृत्व',
    'పథకం', 'డబ్బులు', '1000', 'ఆర్థిక సాయం', 'ప్రభుత్వ', 'గ్యాస్', 'ఇల్లు', 'గర్భిణీ',
    'പദ്ധതി', 'പണം', '1000', 'ധനസഹായം', 'സർക്കാർ', 'ഗ്യാസ്', 'വീട്'
  ];

  const matchedSchemes = VERIFIED_SCHEMES;
  const responses: Record<SupportedLanguage, { text: string; speech: string }> = {
    ta: {
      text: 'பெண்களுக்கான முக்கிய அரசு திட்டங்கள்: கலைஞர் மகளிர் உரிமைத் திட்டம் (மாதம் ₹1,000), பிரதான் மந்திரி மாத்ரு வந்தனா யோஜனா (கர்ப்பிணி உதவி ₹5,000), லக் பதி தீதி சுயஉதவிக் குழு கடன் மற்றும் இலவச உஜ்வாலா கேஸ் இணைப்பு. உங்கள் தகுதியை இங்கேயே சோதிக்கலாம்.',
      speech: 'பெண்களுக்கான மாதாந்திர ₹1,000 திட்டம், கர்ப்பிணி உதவி மற்றும் உஜ்வாலா கேஸ் திட்டங்களின் விவரங்கள் இதோ.'
    },
    hi: {
      text: 'महिलाओं हेतु प्रमुख सरकारी योजनाएं: महिला आर्थिक सहायता (₹1,000/माह), प्रधानमंत्री मातृ वंदना योजना (₹5,000 मातृत्व लाभ), लखपति दीदी एसएचजी ऋण, एवं उज्ज्वला मुफ्त गैस कनेक्शन। आप अपनी पात्रता की जांच तुरंत कर सकती हैं।',
      speech: 'महिलाओं के लिए मासिक आर्थिक सहायता, मातृत्व योजना और उज्ज्वला गैस योजना की जानकारी यहाँ उपलब्ध है।'
    },
    te: {
      text: 'మహిళల సంక్షేమ పథకాలు: మహిళా సాధికారత నెలకు ₹1,000 సహాయం, మాతృ వందన యోజన ₹5,000, లఖ్‌పతి దీదీ రుణాలు మరియు ఉచిత గ్యాస్ కనెక్షన్. మీరు వెంటనే అర్హత తనిఖీ చేసుకోవచ్చు.',
      speech: 'మహిళల ఆర్థిక సహాయం, గర్భిణీ సాయం మరియు గ్యాస్ పథకాల వివరాలు ఇక్కడ ఉన్నాయి.'
    },
    ml: {
      text: 'വനിതകൾക്കായുള്ള പ്രധാന പദ്ധതികൾ: പ്രതിമാസ ധനസഹായം (₹1,000), മാതൃ വന്ദന യോജന (₹5,000), ലഖ്പതി ദീദി വായ്പ, സൗജന്യ ഗ്യാസ് കണക്ഷൻ. നിങ്ങളുടെ അർഹത പരിശോധിക്കാം.',
      speech: 'വനിതാ ക്ഷേമ പദ്ധതികളുടെയും സൗജന്യ ഗ്യാസ് കണക്ഷന്റെയും വിവരങ്ങൾ ഇതാ.'
    }
  };

  return {
    intent: 'GOVERNMENT_SCHEMES',
    responseText: responses[language].text,
    audioSpeechText: responses[language].speech,
    actionType: 'show_schemes',
    matchedData: { schemes: matchedSchemes },
    suggestedFollowUps: ['Check My Eligibility', 'Step-by-Step Guide', 'Required Documents']
  };
}
