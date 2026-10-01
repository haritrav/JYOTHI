import { NextRequest, NextResponse } from 'next/server';
import { SupportedLanguage } from '@/types';
import { VERIFIED_SCHEMES } from '@/data/verifiedSchemes';
import { VERIFIED_ELECTRICITY_UPDATES, VERIFIED_RATION_UPDATES, VERIFIED_EMPLOYMENT_UPDATES } from '@/data/verifiedUpdates';
import { VERIFIED_HEALTH_CAMPS, VERIFIED_VACCINATIONS } from '@/data/verifiedHealth';
import { EMERGENCY_NUMBERS, VERIFIED_SUPPORT_CENTRES } from '@/data/verifiedSafety';
import { VERIFIED_COUNSELLING_SERVICES } from '@/data/verifiedCounselling';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, language = 'ta', userLocation } = body as {
      query: string;
      language: SupportedLanguage;
      userLocation?: any;
    };

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const q = query.toLowerCase().trim();

    // 1. Detect Intent
    let intent:
      | 'emergency_danger'
      | 'domestic_violence'
      | 'dowry_abuse'
      | 'safety_general'
      | 'counselling_mental_health'
      | 'electricity'
      | 'ration'
      | 'employment_100days'
      | 'health_camp'
      | 'vaccination_child'
      | 'government_scheme'
      | 'general_help' = 'general_help';

    // Emergency & Safety Triggers
    if (
      q.includes('danger') ||
      q.includes('help me') ||
      q.includes('ஆபத்து') ||
      q.includes('காப்பாற்று') ||
      q.includes('खतरा') ||
      q.includes('बचाओ') ||
      q.includes('ప్రమాదం') ||
      q.includes('కాపాడండి') ||
      q.includes('അപകടം') ||
      q.includes('രക്ഷിക്കൂ') ||
      q.includes('emergency') ||
      q.includes('kill') ||
      q.includes('police')
    ) {
      intent = 'emergency_danger';
    } else if (
      q.includes('husband') ||
      q.includes('beat') ||
      q.includes('hit') ||
      q.includes('violence') ||
      q.includes('அடிக்கிறார்') ||
      q.includes('வன்முறை') ||
      q.includes('मारपीट') ||
      q.includes('हिंसा') ||
      q.includes('కొడుతున్నారు') ||
      q.includes('వేధింపు') ||
      q.includes('മർദ്ദനം') ||
      q.includes('പീഡനം') ||
      q.includes('threat')
    ) {
      intent = 'domestic_violence';
    } else if (
      q.includes('dowry') ||
      q.includes('வரதட்சணை') ||
      q.includes('दहेज') ||
      q.includes('వరకట్నం') ||
      q.includes('സ്ത്രീധനം')
    ) {
      intent = 'dowry_abuse';
    } else if (
      q.includes('counsel') ||
      q.includes('mental') ||
      q.includes('talk to someone') ||
      q.includes('sad') ||
      q.includes('depress') ||
      q.includes('மன அழுத்தம்') ||
      q.includes('பேச வேண்டும்') ||
      q.includes('तनाव') ||
      q.includes('बात करनी है') ||
      q.includes('మాట్లాడాలి') ||
      q.includes('ఆందోళన') ||
      q.includes('വിഷമം') ||
      q.includes('സംസാരിക്കണം') ||
      q.includes('tele-manas')
    ) {
      intent = 'counselling_mental_health';
    } else if (
      q.includes('electric') ||
      q.includes('power cut') ||
      q.includes('current') ||
      q.includes('மின்சாரம்') ||
      q.includes('கரண்ட்') ||
      q.includes('बिजली') ||
      q.includes('విద్యుత్') ||
      q.includes('కరెంట్') ||
      q.includes('വൈദ്യുതി')
    ) {
      intent = 'electricity';
    } else if (
      q.includes('ration') ||
      q.includes('rice') ||
      q.includes('sugar') ||
      q.includes('ரேஷன்') ||
      q.includes('அரிசி') ||
      q.includes('பருப்பு') ||
      q.includes('राशन') ||
      q.includes('चावल') ||
      q.includes('రేషన్') ||
      q.includes('రైస్') ||
      q.includes('റേഷൻ') ||
      q.includes('അരി')
    ) {
      intent = 'ration';
    } else if (
      q.includes('100 day') ||
      q.includes('nrega') ||
      q.includes('mgnregs') ||
      q.includes('job card') ||
      q.includes('வேலை') ||
      q.includes('100 நாள்') ||
      q.includes('रोजगार') ||
      q.includes('मनरेगा') ||
      q.includes('ఉపాధి') ||
      q.includes('100 రోజుల') ||
      q.includes('തൊഴിലുറപ്പ്') ||
      q.includes('100 ദിന')
    ) {
      intent = 'employment_100days';
    } else if (
      q.includes('vaccin') ||
      q.includes('polio') ||
      q.includes('child') ||
      q.includes('baby') ||
      q.includes('தடுப்பூசி') ||
      q.includes('குழந்தை') ||
      q.includes('टीका') ||
      q.includes('बच्चा') ||
      q.includes('టీకా') ||
      q.includes('పిల్లలు') ||
      q.includes('കുത്തിവയ്പ്പ്') ||
      q.includes('കുട്ടി')
    ) {
      intent = 'vaccination_child';
    } else if (
      q.includes('health') ||
      q.includes('camp') ||
      q.includes('eye') ||
      q.includes('doctor') ||
      q.includes('மருத்துவம்') ||
      q.includes('முகாம்') ||
      q.includes('கண்') ||
      q.includes('अस्पताल') ||
      q.includes('शिविर') ||
      q.includes('डॉक्टर') ||
      q.includes('వైద్య') ||
      q.includes('క్యాంప్') ||
      q.includes('ఆరోగ్య') ||
      q.includes('ക്യാമ്പ്') ||
      q.includes('ഡോക്ടർ')
    ) {
      intent = 'health_camp';
    } else if (
      q.includes('scheme') ||
      q.includes('money') ||
      q.includes('financial') ||
      q.includes('pm') ||
      q.includes('ujjwala') ||
      q.includes('matru') ||
      q.includes('sukanya') ||
      q.includes('திட்டம்') ||
      q.includes('பணம்') ||
      q.includes('உதவி') ||
      q.includes('योजना') ||
      q.includes('पैसे') ||
      q.includes('सहायता') ||
      q.includes('పథకం') ||
      q.includes('డబ్బులు') ||
      q.includes('పధకాలు') ||
      q.includes('പദ്ധതി') ||
      q.includes('സഹായം')
    ) {
      intent = 'government_scheme';
    }

    // Prepare response data payload
    let explanation = '';
    let cards: any[] = [];
    let actionType: 'none' | 'call' | 'navigate' | 'emergency' = 'none';
    let actionPayload: any = null;

    if (intent === 'emergency_danger') {
      actionType = 'emergency';
      const responses: Record<SupportedLanguage, string> = {
        ta: 'உடனடியாக அமைதியாக இருங்கள். நீங்கள் தனியாக இல்லை. 112 அல்லது மகளிர் உதவி எண் 181-ஐ உடனே அழைக்கவும். கீழே உள்ள பட்டனைத் தொட்டு உடனே பேசலாம்.',
        hi: 'बिल्कुल घबराएं नहीं। आप अकेली नहीं हैं। तुरंत 112 या महिला हेल्पलाइन 181 पर कॉल करें। नीचे दिए गए बटन को दबाकर सीधे बात करें।',
        te: 'దయచేసి భయపడవద్దు. మీరు ఒంటరిగా లేరు. వెంటనే 112 లేదా మహిళా హెల్ప్‌లైన్ 181 కు కాల్ చేయండి. కింద ఉన్న బటన్ నొక్కి వెంటనే మాట్లాడండి.',
        ml: 'ഭയപ്പെടേണ്ടതില്ല. നിങ്ങൾ തനിച്ചല്ല. ഉടൻ തന്നെ 112 അല്ലെങ്കിൽ വനിതാ ഹെൽപ്പ്‌ലൈൻ 181 ലേക്ക് വിളിക്കൂ. താഴെയുള്ള ബട്ടൺ അമർത്തി സംസാരിക്കാം.',
      };
      explanation = responses[language] || responses.ta;
      cards = EMERGENCY_NUMBERS.map((e) => ({
        id: e.number,
        title: e.name[language] || e.name.ta,
        phone: e.number,
        description: e.description[language] || e.description.ta,
        tollFree: e.tollFree,
      }));
    } else if (intent === 'domestic_violence') {
      const responses: Record<SupportedLanguage, string> = {
        ta: 'வீட்டு வன்முறையை நீங்கள் பொறுத்துக்கொள்ள வேண்டியதில்லை. சட்டம் மற்றும் மகளிர் உதவி மையம் (181) உங்களுக்கு இலவச பாதுகாப்பு, தங்குமிடம் மற்றும் சட்ட உதவிகளை வழங்க தயாராக உள்ளது.',
        hi: 'घरेलू हिंसा सहने की बिल्कुल आवश्यकता नहीं है। कानून और सखी वन स्टॉप सेंटर (181) आपको मुफ्त सुरक्षा, कानूनी मदद और रहने की जगह प्रदान करेंगे।',
        te: 'గృహహింసను భరించాల్సిన అవసరం లేదు. చట్టం మరియు సఖి వన్ స్టాప్ సెంటర్ (181) మీకు ఉచిత రక్షణ, వసతి మరియు న్యాయ సహాయం అందిస్తాయి.',
        ml: 'ഗാർഹിക പീഡനം സഹിക്കേണ്ടതില്ല. നിയമവും സഖി വൺ സ്റ്റോപ്പ് സെന്ററും (181) നിങ്ങൾക്ക് സൗജന്യ സംരക്ഷണവും നിയമസഹായവും നൽകും.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_SUPPORT_CENTRES;
    } else if (intent === 'dowry_abuse') {
      const responses: Record<SupportedLanguage, string> = {
        ta: 'வரதட்சணை கேட்பதும் அதற்காக துன்புறுத்துவதும் சட்டப்படி கடுமையான குற்றமாகும். மகளிர் காவல் பிரிவு (1091) அல்லது இலவச சட்ட உதவி மையத்தை (DLSA) அணுகலாம்.',
        hi: 'दहेज मांगना और प्रताड़ित करना कानूनी रूप से गंभीर अपराध है। आप महिला पुलिस सेल (1091) या मुफ्त कानूनी सहायता केंद्र से पूरी मदद ले सकती हैं।',
        te: 'వరకట్నం డిమాండ్ చేయడం చట్టరీత్యా నేరం. మహిళా పోలీస్ సెల్ (1091) లేదా ఉచిత న్యాయ సేవాధికార సంస్థను సంప్రదించండి.',
        ml: 'സ്ത്രീധനം ചോദിക്കുന്നതും ഉപദ്രവിക്കുന്നതും ഗുരുതരമായ കുറ്റമാണ്. വനിതാ പോലീസ് സെൽ (1091) അല്ലെങ്കിൽ സൗജന്യ നിയമസഹായ കേന്ദ്രത്തെ സമീപിക്കാം.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_SUPPORT_CENTRES;
    } else if (intent === 'counselling_mental_health') {
      const responses: Record<SupportedLanguage, string> = {
        ta: 'உங்கள் மனக்குமுறலை யாரிடமாவது பகிர்ந்து கொள்ள விரும்பினால், மத்திய அரசின் இலவச Tele-MANAS (14416) எண்ணில் 24 மணி நேரமும் ரகசியமாகப் பேசலாம்.',
        hi: 'यदि आपका मन भारी है और आप किसी से बात करना चाहती हैं, तो भारत सरकार की मुफ्त टेली-मानस (14416) सेवा पर 24 घंटे किसी भी समय बात कर सकती हैं।',
        te: 'మీరు ఎవరితోనైనా మాట్లాడాలని అనుకుంటే, భారత ప్రభుత్వ ఉచిత టెలి-మానస్ (14416) నంబరుకు 24 గంటల్లో ఎప్పుడైనా ఫోన్ చేయవచ్చు.',
        ml: 'മനസ്സ് തുറന്ന് സംസാരിക്കാൻ ആഗ്രഹിക്കുന്നുവെങ്കിൽ, കേന്ദ്ര സർക്കാരിന്റെ സൗജന്യ ടെലി-മാനസ് (14416) ലേക്ക് എപ്പോഴും വിളിക്കാം.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_COUNSELLING_SERVICES;
    } else if (intent === 'electricity') {
      const responses: Record<SupportedLanguage, string> = {
        ta: 'உங்கள் பகுதியில் திட்டமிடப்பட்ட மின் பராமரிப்பு பணிகளின் விவரங்கள் இதோ. சரிபார்க்கப்பட்ட அரசு மின்வாரிய தகவல் கீழே கொடுக்கப்பட்டுள்ளது.',
        hi: 'आपके क्षेत्र में निर्धारित बिजली कटौती की आधिकारिक सूचना यहाँ दी गई है।',
        te: 'మీ ప్రాంతంలో షెడ్యూల్ చేయబడిన విద్యుత్ కోత వివరాలు ఇక్కడ ఉన్నాయి.',
        ml: 'നിങ്ങളുടെ പ്രദേശത്തെ വൈദ്യുതി മുടക്ക വിവരങ്ങൾ താഴെ നൽകുന്നു.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_ELECTRICITY_UPDATES;
    } else if (intent === 'ration') {
      const responses: Record<SupportedLanguage, string> = {
        ta: 'உங்கள் அருகிலுள்ள நியாய விலைக்கடை (ரேஷன் கடை) பொருட்கள் மற்றும் விநியோக விவரங்கள் இதோ.',
        hi: 'आपकी नजदीकी राशन दुकान में उपलब्ध खाद्यान्न और वितरण समय की जानकारी यहाँ है।',
        te: 'మీ సమీప రేషన్ దుకాణంలో సరుకుల లభ్యత మరియు పంపిణీ వివరాలు ఇక్కడ ఉన్నాయి.',
        ml: 'അടുത്തുള്ള റേഷൻ കടയിലെ സാധനങ്ങളുടെ ലഭ്യതയും സമയവും താഴെ നൽകുന്നു.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_RATION_UPDATES;
    } else if (intent === 'employment_100days') {
      const responses: Record<SupportedLanguage, string> = {
        ta: '100 நாள் மகாத்மா காந்தி ஊரக வேலைவாய்ப்பு திட்டத்தின் கீழ் உங்கள் கிராமத்தில் நடக்கும் நடப்பு பணிகள் மற்றும் விண்ணப்பிக்கும் விபரம் இதோ.',
        hi: 'मनरेगा 100 दिन रोजगार के तहत आपके गाँव में चल रहे कार्यों और मजदूरी की जानकारी यहाँ है।',
        te: 'మహాత్మా గాంధీ 100 రోజుల ఉపాధి హామీ పథకం పనులు మరియు దరఖాస్తు వివరాలు ఇక్కడ ఉన్నాయి.',
        ml: 'മഹാത്മാഗാന്ധി 100 ദിന തൊഴിലുറപ്പ് പദ്ധതിയുടെ വിവരങ്ങളും വേതനവും താഴെ നൽകുന്നു.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_EMPLOYMENT_UPDATES;
    } else if (intent === 'health_camp') {
      const responses: Record<SupportedLanguage, string> = {
        ta: 'உங்கள் பகுதியில் நடைபெறும் இலவச மகளிர் மற்றும் பொது மருத்துவ முகாம்களின் விவரங்கள் கீழே உள்ளன. பரிசோதனைகள் முற்றிலும் இலவசம்.',
        hi: 'आपके क्षेत्र में होने वाले निःशुल्क महिला व स्वास्थ्य जांच शिविरों की जानकारी नीचे दी गई है।',
        te: 'మీ ప్రాంతంలో జరిగే ఉచిత వైద్య శిబిరాల వివరాలు కింద ఉన్నాయి. పరీక్షలు పూర్తిగా ఉచితం.',
        ml: 'നിങ്ങളുടെ പ്രദേശത്ത് നടക്കുന്ന സൗജന്യ മെഡിക്കൽ ക്യാമ്പുകളുടെ വിവരങ്ങൾ താഴെ നൽകുന്നു.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_HEALTH_CAMPS;
    } else if (intent === 'vaccination_child') {
      const responses: Record<SupportedLanguage, string> = {
        ta: 'அங்கன்வாடி மையத்தில் நடைபெறும் குழந்தைகள் தடுப்பூசி மற்றும் போலியோ முகாம் விவரங்கள் இதோ. ஆஷா பணியாளரைத் தொடர்பு கொள்ளவும்.',
        hi: 'आंगनवाड़ी केंद्र में बाल टीकाकरण और पोलियो ड्रॉप सत्र की आधिकारिक जानकारी यहाँ है।',
        te: 'అంగన్‌వాడీ కేంద్రంలో పిల్లల వ్యాక్సినేషన్ వివరాలు ఇక్కడ ఉన్నాయి. ఆశా కార్యకర్తను సంప్రదించండి.',
        ml: 'അങ്കണവാടിയിൽ നടക്കുന്ന കുട്ടികളുടെ പ്രതിരോധ കുത്തിവയ്പ്പ് വിവരങ്ങൾ താഴെ നൽകുന്നു.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_VACCINATIONS;
    } else if (intent === 'government_scheme') {
      const responses: Record<SupportedLanguage, string> = {
        ta: 'பெண்களுக்கான முக்கிய அரசு நலத்திட்டங்கள் இதோ. உங்கள் தகுதியை ஒரு நிமிடத்தில் எளிதாக சரிபார்த்துக் கொள்ளலாம்.',
        hi: 'महिलाओं के लिए प्रमुख सरकारी कल्याणकारी योजनाएं यहाँ हैं। आप अपनी पात्रता की तुरंत जांच कर सकती हैं।',
        te: 'మహిళల కోసం ముఖ్యమైన ప్రభుత్వ పథకాలు ఇక్కడ ఉన్నాయి. మీ అర్హతను సులభంగా తనిఖీ చేసుకోండి.',
        ml: 'വനിതകൾക്കായുള്ള പ്രധാന സർക്കാർ പദ്ധതികൾ താഴെ നൽകുന്നു. നിങ്ങളുടെ അർഹത പരിശോധിക്കാം.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_SCHEMES;
    } else {
      const responses: Record<SupportedLanguage, string> = {
        ta: 'நான் உங்களுக்கு உதவ தயாராக உள்ளேன். அரசு திட்டங்கள், ரேஷன், மின்சாரம், 100 நாள் வேலை, மருத்துவ முகாம்கள் அல்லது பாதுகாப்பு பற்றி என்னிடம் கேட்கலாம்.',
        hi: 'मैं आपकी सहायता के लिए यहाँ हूँ। आप मुझसे सरकारी योजनाएं, राशन, बिजली, मनरेगा, स्वास्थ्य शिविर या सुरक्षा के बारे में पूछ सकती हैं।',
        te: 'నేను మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను. ప్రభుత్వ పథకాలు, రేషన్, విద్యుత్, ఉపాధి హామీ, వైద్య శిబిరాలు లేదా రక్షణ గురించి నన్ను అడగండి.',
        ml: 'ഞാൻ നിങ്ങളെ സഹായിക്കാൻ ഇവിടെയുണ്ട്. സർക്കാർ പദ്ധതികൾ, റേഷൻ, വൈദ്യുതി, തൊഴിലുറപ്പ്, മെഡിക്കൽ ക്യാമ്പുകൾ അല്ലെങ്കിൽ സുരക്ഷ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.',
      };
      explanation = responses[language] || responses.ta;
      cards = VERIFIED_SCHEMES.slice(0, 2);
    }

    return NextResponse.json({
      intent,
      explanation,
      cards,
      actionType,
      actionPayload,
    });
  } catch (error) {
    console.error('AI chat route error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process voice/chat request',
        explanation: 'மன்னிக்கவும், தற்போது தகவலைப் பெற முடியவில்லை. சிறிது நேரம் கழித்து முயற்சிக்கவும்.',
      },
      { status: 500 }
    );
  }
}
