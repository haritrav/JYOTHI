import { NextRequest, NextResponse } from 'next/server';
import { UserApplication } from '@/types';

// Mock in-memory application store
const applications: UserApplication[] = [
  {
    id: 'APP-PMMVY-2026-8891',
    schemeId: 'pm-matru-vandana',
    schemeName: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    applicantName: 'முத்துலட்சுமி (Muthulakshmi)',
    applicantPhone: '98421-XXXXX',
    village: 'வாடிப்பட்டி (Vadipatti)',
    district: 'Madurai',
    submissionDate: '2026-09-18',
    status: 'under_review',
    statusDetails: {
      ta: 'உங்கள் விண்ணப்பம் கிராம சுகாதார செவிலியரால் (VHN) சரிபார்க்கப்பட்டு வருகிறது. முதல் தவணை ரூ. 3,000 வங்கி கணக்கிற்கு அனுப்பப்பட உள்ளது.',
      hi: 'आपका आवेदन स्वास्थ्य कार्यकर्ता द्वारा सत्यापित किया जा रहा है। पहली किस्त जल्द ही बैंक खाते में भेजी जाएगी।',
      te: 'మీ దరఖాస్తు పరిశీలనలో ఉంది. మొదటి విడత సహాయం త్వరలో మీ బ్యాంక్ ఖాతాలో జమ అవుతుంది.',
      ml: 'നിങ്ങളുടെ അപേക്ഷ പരിശോധനയിലാണ്. ആദ്യ ഗഡു ഉടൻ തന്നെ ബാങ്ക് അക്കൗണ്ടിൽ എത്തും.',
    },
    timeline: [
      {
        date: '2026-09-18',
        step: {
          ta: 'அங்கன்வாடியில் விண்ணப்பம் பதிவு செய்யப்பட்டது',
          hi: 'आंगनवाड़ी केंद्र में आवेदन दर्ज किया गया',
          te: 'అంగన్‌వాడీ కేంద్రంలో దరఖాస్తు నమోదు చేయబడింది',
          ml: 'അപേക്ഷ രജിസ്റ്റർ ചെയ്തു',
        },
        done: true,
      },
      {
        date: '2026-09-24',
        step: {
          ta: 'ஆதார் & தாய்-சேய் நல அட்டை (MCP) சரிபார்க்கப்பட்டது',
          hi: 'आधार व एमसीपी कार्ड का सत्यापन पूर्ण',
          te: 'ఆధార్ & ఎంసిపి కార్డు ధృవీకరణ పూర్తయింది',
          ml: 'ആധാർ രേഖകൾ പരിശോധിച്ചു',
        },
        done: true,
      },
      {
        date: '2026-10-06 (எதிர்பார்க்கப்படுகிறது)',
        step: {
          ta: 'வங்கி கணக்கில் முதல் தவணை ரூ. 3,000 நேரடி வரவு (DBT)',
          hi: 'बैंक खाते में प्रथम किस्त का भुगतान',
          te: 'మొదటి విడత బ్యాంక్ ఖాతాలో జమ',
          ml: 'ബാങ്ക് അക്കൗണ്ടിലേക്ക് ആദ്യ ഗഡു തുക കൈമാറൽ',
        },
        done: false,
      },
    ],
    nextAction: {
      ta: 'வேறு எந்த நடவடிக்கையும் தேவையில்லை. உங்கள் வங்கிக் கணக்கு எஸ்.எம்.எஸ் செய்தியைப் பார்க்கவும்.',
      hi: 'किसी अन्य प्रक्रिया की आवश्यकता नहीं है। बैंक एसएमएस की प्रतीक्षा करें।',
      te: 'మరింత సమాచారం అవసరం లేదు. బ్యాంక్ మెసేజ్ కోసం వేచి ఉండండి.',
      ml: 'മറ്റ് നടപടികൾ ആവശ്യമില്ല. ബാങ്ക് സന്ദേശത്തിനായി കാത്തിരിക്കുക.',
    },
  },
];

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    total: applications.length,
    data: applications,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schemeId, schemeName, applicantName, applicantPhone, village, district } = body;

    const newApp: UserApplication = {
      id: `APP-${schemeId.toUpperCase().slice(0, 5)}-${Math.floor(1000 + Math.random() * 9000)}`,
      schemeId,
      schemeName: schemeName || 'Government Scheme',
      applicantName: applicantName || 'பயனாளி',
      applicantPhone: applicantPhone || '',
      village: village || 'Local Village',
      district: district || 'Madurai',
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      statusDetails: {
        ta: 'உங்கள் விண்ணப்பம் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது. சரிபார்ப்பிற்காக அனுப்பப்பட்டுள்ளது.',
        hi: 'आपका आवेदन सफलतापूर्वक दर्ज कर लिया गया है। सत्यापन प्रक्रिया जारी है।',
        te: 'మీ దరఖాస్తు విజయవంతంగా నమోదు చేయబడింది.',
        ml: 'നിങ്ങളുടെ അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു.',
      },
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          step: {
            ta: 'விண்ணப்பம் பூர்த்தி செய்யப்பட்டு பதிவு செய்யப்பட்டது',
            hi: 'आवेदन पत्र दर्ज किया गया',
            te: 'దరఖాస్తు నమోదు చేయబడింది',
            ml: 'അപേക്ഷ രജിസ്റ്റർ ചെയ്തു',
          },
          done: true,
        },
      ],
      nextAction: {
        ta: 'அரசு அலுவலர் ஆவணங்களை சரிபார்க்கும் வரை காத்திருக்கவும்.',
        hi: 'दस्तावेज़ सत्यापन के लिए प्रतीक्षा करें।',
        te: 'పత్రాల పరిశీలన పూర్తయ్యే వరకు వేచి ఉండండి.',
        ml: 'രേഖകൾ പരിശോധിക്കുന്നത് വരെ കാത്തിരിക്കുക.',
      },
    };

    applications.unshift(newApp);

    return NextResponse.json({
      success: true,
      applicationId: newApp.id,
      application: newApp,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
