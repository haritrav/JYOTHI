import { ElectricityUpdate, RationUpdate, EmploymentUpdate } from '@/types';

export const VERIFIED_ELECTRICITY_UPDATES: ElectricityUpdate[] = [
  {
    id: 'elec-001',
    district: 'Madurai',
    area: {
      ta: 'வாடிப்பட்டி மற்றும் சுற்றுவட்டார கிராமங்கள்',
      hi: 'वाडीपट्टी एवं आसपास के ग्रामीण क्षेत्र',
      te: 'వాడిపట్టి మరియు పరిసర గ్రామాలు',
      ml: 'വാടിപ്പട്ടിയും പരിസര ഗ്രാമങ്ങളും',
    },
    date: '2026-10-05',
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    reason: {
      ta: 'மாதாந்திர துணை மின்நிலைய பராமரிப்பு மற்றும் மின் கம்பிகள் சீரமைப்பு பணிகள்',
      hi: 'मासिक उपकेंद्र रखरखाव एवं ट्रांसफार्मर मरम्मत कार्य',
      te: 'నెలవారీ సబ్‌స్టేషన్ మరమ్మతులు మరియు లైన్ల నిర్వహణ పనులు',
      ml: 'മാസാന്ത സബ്‌സ്റ്റേഷൻ അറ്റകുറ്റപ്പണികളും ലൈൻ നവീകരണവും',
    },
    affectedVillages: ['Patti', 'Katchakatti', 'Alanganallur East', 'Kulam'],
    subStation: 'Vadipatti 110/11 KV Sub-station',
    source: 'State Electricity Board Official Notice Board (TANGEDCO / TNEB)',
    contactHelpline: '1912',
    lastUpdated: '2026-10-01',
    status: 'scheduled',
  },
  {
    id: 'elec-002',
    district: 'Patna',
    area: {
      ta: 'பிக்தா மற்றும் மணேர் வட்டாரப் பகுதிகள்',
      hi: 'बिहटा एवं मनेर ग्रामीण प्रखंड क्षेत्र',
      te: 'బిహ్తా మరియు మనేర్ బ్లాక్ ప్రాంతాలు',
      ml: 'ബിഹ്ത, മനേർ റൂറൽ മേഖലകൾ',
    },
    date: '2026-10-04',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    reason: {
      ta: 'புதிய மின்மாற்றி பொருத்துதல் மற்றும் பாதுகாப்பு சோதனைகள்',
      hi: 'नए ट्रांसफार्मर की स्थापना व सुरक्षा परीक्षण कार्य',
      te: 'కొత్త ట్రాన్స్‌ఫార్మర్ అమరిక మరియు భద్రతా పరీక్షలు',
      ml: 'പുതിയ ട്രാൻസ്ഫോർമർ സ്ഥാപിക്കലും സുരക്ഷാ പരിശോധനയും',
    },
    affectedVillages: ['Raghopur', 'Sadisopur', 'Anandpur'],
    subStation: 'Bihta Grid 33/11 KV',
    source: 'Discom Official Schedule (SBPDCL)',
    contactHelpline: '1912',
    lastUpdated: '2026-10-01',
    status: 'scheduled',
  },
];

export const VERIFIED_RATION_UPDATES: RationUpdate[] = [
  {
    id: 'ration-001',
    shopNumber: 'TN-FP-3401',
    district: 'Madurai',
    shopName: {
      ta: 'நியாய விலைக்கடை - வாடிப்பட்டி மேற்கு',
      hi: 'उचित मूल्य की दुकान - वाडीपट्टी पश्चिम',
      te: 'చౌకధరల దుకాణం - వాడిపట్టి వెస్ట్',
      ml: 'റേഷൻ കട - വാടിപ്പട്ടി വെസ്റ്റ്',
    },
    location: {
      ta: 'பஞ்சாயத்து அலுவலக வளாகம் அருகில், வாடிப்பட்டி',
      hi: 'पंचायत भवन के पास, मुख्य मार्ग',
      te: 'పంచాయతీ ఆఫీస్ దగ్గర, మెయిన్ రోడ్డు',
      ml: 'പഞ്ചായത്ത് ഓഫീസിന് സമീപം, വാടിപ്പട്ടി',
    },
    distributionDates: 'அனைத்து வேலை நாட்களும் (திங்கள் - சனி) / 1st to 28th',
    timings: '08:30 AM - 12:30 PM & 04:00 PM - 07:00 PM',
    commodities: [
      {
        item: { ta: 'புழுங்கல் / பச்சரிசி', hi: 'चावल (मुफ्त)', te: 'బియ్యం (ఉచితం)', ml: 'അരി (സൗജന്യം)' },
        quantityPerCard: '20 கிலோ வரை (அரிசி குடும்ப அட்டை)',
        price: 'இலவசம் (₹0)',
        stockStatus: 'available',
      },
      {
        item: { ta: 'துவரம் பருப்பு', hi: 'अरहर दाल', te: 'కందిపప్పు', ml: 'തുവരപ്പരിപ്പ്' },
        quantityPerCard: '1 கிலோ',
        price: '₹30 / கிலோ',
        stockStatus: 'available',
      },
      {
        item: { ta: 'பாமாயில் எண்ணெய்', hi: 'पाम ऑयल', te: 'పామాయిల్', ml: 'പാം ഓയിൽ' },
        quantityPerCard: '1 பாக்கெட் (1 லிட்டர்)',
        price: '₹25',
        stockStatus: 'available',
      },
      {
        item: { ta: 'சர்க்கரை', hi: 'चीनी', te: 'చక్కెర', ml: 'പഞ്ചസാര' },
        quantityPerCard: '1 கிலோ',
        price: '₹25 / கிலோ',
        stockStatus: 'low-stock',
      },
    ],
    specialInstructions: {
      ta: 'பயோமெட்ரிக் விரல்ரேகை பதிவு வேலை செய்யாவிடில், பதிவு செய்யப்பட்ட மொபைல் OTP மூலம் பொருட்களைப் பெற்றுக் கொள்ளலாம்.',
      hi: 'यदि फिंगरप्रिंट में समस्या आए तो पंजीकृत मोबाइल नंबर पर ओटीपी के माध्यम से राशन प्राप्त किया जा सकता है।',
      te: 'వేలిముద్ర రాకపోతే రిజిస్టర్డ్ మొబైల్ ఓటీపీ (OTP) ద్వారా రేషన్ సరుకులు తీసుకోవచ్చు.',
      ml: 'വിരലടയാളം ലഭിച്ചില്ലെങ്കിൽ രജിസ്റ്റർ ചെയ്ത മൊബൈലിൽ വരുന്ന ഒ.ടി.പി വഴി റേഷൻ വാങ്ങാം.',
    },
    source: 'Department of Civil Supplies and Consumer Protection Portal',
    lastUpdated: '2026-10-01',
  },
];

export const VERIFIED_EMPLOYMENT_UPDATES: EmploymentUpdate[] = [
  {
    id: 'emp-001',
    schemeName: 'MGNREGS 100-Day Work (மகாத்மா காந்தி ஊரக வேலை)',
    district: 'Madurai',
    title: {
      ta: 'கிராம குளம் தூர்வாருதல் மற்றும் வரப்பு அமைக்கும் பணி',
      hi: 'ग्राम तालाब गहरीकरण एवं मेड़बंदी कार्य (मनरेगा)',
      te: 'గ్రామ చెరువు పూడికతీత మరియు గట్ల నిర్మాణం పనులు',
      ml: 'ഗ്രാമക്കുളം നവീകരണവും വരമ്പ് നിർമ്മാണവും',
    },
    location: {
      ta: 'தெற்கு ஊரணி மற்றும் பெரிய ஏரி பாசனக் கால்வாய் பகுதி',
      hi: 'दक्षिणी तालाब एवं नहर क्षेत्र',
      te: 'దక్షిణ చెరువు మరియు కాలువ పరిసరాలు',
      ml: 'തെക്കേ കുളവും തോട് പരിസരവും',
    },
    dailyWageOrStipend: '₹319 / நாள் (வங்கி கணக்கில் நேரடி வரவு)',
    duration: 'அக்டோபர் 06 முதல் 15 நாட்கள் வரை',
    eligibility: {
      ta: 'ஊராட்சி வேலை அட்டை (Job Card) வைத்துள்ள 18 வயதுக்கு மேற்பட்ட அனைத்து பெண்களும்.',
      hi: 'जॉब कार्ड धारक 18 वर्ष से अधिक आयु की सभी महिलाएं।',
      te: 'జాబ్ కార్డు ఉన్న 18 సంవత్సరాలు నిండిన మహిళలందరూ.',
      ml: 'തൊഴിൽ കാർഡുള്ള 18 വയസ്സ് തികഞ്ഞ എല്ലാ വനിതകളും.',
    },
    howToApply: {
      ta: 'ஊராட்சி மன்ற செயலர் அல்லது பணித்தள பொறுப்பாளரிடம் (Workmate) உங்கள் ஜாப் கார்டை காட்டி பெயரைப் பதிவு செய்யுங்கள்.',
      hi: 'पंचायत भवन में रोजगार सेवक को जॉब कार्ड दिखाकर मस्टर रोल में नाम दर्ज कराएं।',
      te: 'గ్రామ సచివాలయం లేదా ఫీల్డ్ అసిస్టెంట్ వద్ద జాబ్ కార్డుతో పేరు నమోదు చేయించుకోండి.',
      ml: 'പഞ്ചായത്ത് മേറ്റിനെയോ സെക്രട്ടറിയെയോ കണ്ട് പേര് രജിസ്റ്റർ ചെയ്യുക.',
    },
    contactPerson: 'கள உதவியாளர் (Field Assistant / Panchayat Sec)',
    contactNumber: '1800-425-4567 (Toll-Free Helpdesk)',
    officialSource: 'District Rural Development Agency (DRDA)',
    lastUpdated: '2026-10-01',
  },
];
