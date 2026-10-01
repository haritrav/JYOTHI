import { NextRequest, NextResponse } from 'next/server';
import { CounsellingRequest } from '@/types';

// In-memory / database store for counselling requests
const counsellingRequests: CounsellingRequest[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, preferredLanguage, ageRange, contactPreference, phoneNumber, preferredTimeSlot, optionalNotes } =
      body as Partial<CounsellingRequest>;

    if (!name || !preferredLanguage) {
      return NextResponse.json({ error: 'Name and preferred language are required' }, { status: 400 });
    }

    const newRequest: CounsellingRequest = {
      id: `JY-CNS-${Math.floor(100000 + Math.random() * 900000)}`,
      name,
      preferredLanguage: preferredLanguage || 'ta',
      ageRange: ageRange || '18-35',
      contactPreference: contactPreference || 'phone',
      phoneNumber: phoneNumber || '',
      preferredTimeSlot: preferredTimeSlot || 'Morning 10 AM - 1 PM',
      optionalNotes: optionalNotes || '',
      createdAt: new Date().toISOString(),
      status: 'received',
    };

    counsellingRequests.unshift(newRequest);

    return NextResponse.json({
      success: true,
      requestId: newRequest.id,
      message: 'Counselling request registered confidentially.',
      nextStep: {
        ta: 'உங்கள் கோரிக்கை பெறப்பட்டது. அரசு அங்கீகரிக்கப்பட்ட பெண் ஆலோசகர் விரைவில் நீங்கள் குறிப்பிட்ட நேரத்தில் தொடர்புகொள்வார். அவசர உதவிக்கு 14416 அழைக்கவும்.',
        hi: 'आपका अनुरोध सफलतापूर्वक प्राप्त हुआ है। काउंसलर दीदी आपके चुने हुए समय पर आपसे संपर्क करेंगी। आपात स्थिति में 14416 पर कॉल करें।',
        te: 'మీ అభ్యర్థన నమోదు చేయబడింది. కౌన్సెలర్ త్వరలోనే మీరు సూచించిన సమయంలో సంప్రదిస్తారు. అత్యవసరానికి 14416 కు కాల్ చేయండి.',
        ml: 'നിങ്ങളുടെ അഭ്യർത്ഥന ലഭിച്ചു. ഒരു വനിതാ കൗൺസിലർ നിങ്ങൾ തിരഞ്ഞെടുത്ത സമയത്ത് വിളിക്കും. അടിയന്തര സഹായത്തിന് 14416 വിളിക്കുക.',
      },
      emergencyFallback: 'Tele-MANAS Toll-Free: 14416',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process counselling registration' }, { status: 500 });
  }
}
