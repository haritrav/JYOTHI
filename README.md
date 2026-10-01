# 🌟 JYOTHI (ஜோதி / ज्योति / జ్యోతి / ജ്യോതി)
> **"Her Voice. Her Language. Her Access."**  
> *"Technology should adapt to the woman, not the woman to technology."*

---

## 📖 Product Overview

**JYOTHI** is a mobile-first, voice-first, multilingual AI companion designed specifically for women in rural and underserved communities in India. It bridges literacy, technical, language, and institutional gaps, acting like a patient, empathetic guide rather than a complicated government portal.

---

## ✨ Key Features & Capabilities

### 1. 🌐 True Multilingual Support (4 Regional Languages)
- **Tamil (தமிழ்)**
- **Hindi (हिन्दी)**
- **Telugu (తెలుగు)**
- **Malayalam (മലയാളം)**
- Full translation across UI labels, buttons, error messages, voice inputs, and audio read-aloud responses.

### 2. 🎙️ Voice-First AI & Web Speech Companion
- **"🎙️ ASK JYOTHI" Modal**: Web Speech API Speech-to-Text (`ta-IN`, `hi-IN`, `te-IN`, `ml-IN`).
- **Audio Read-Aloud (`🔊 Listen`)**: Attached to every card, eligibility question, document requirement, public notice, and health event.
- **AI Intent Router & Provenance Guarantee**: Routes questions directly to verified government, health, public utility, and emergency registries. **Never invents schedules or rules.**

### 3. 🏛️ Government Schemes & Step-by-Step Eligibility Engine
- Verified Indian schemes: *PMMVY, PM Ujjwala 2.0, Sukanya Samriddhi Yojana, MGNREGS 100-Day Work, and more.*
- **Interactive 1-Question-at-a-Time Eligibility Checker**: Clear progress indicator (`Step 1 of 3`), large Yes/No touch buttons, audio reading.
- **Document Guidance Checklist**: What it is, why needed, how to get it (Aadhaar, Bank Passbook, MCP Card).
- **Conversational Form Assistant**: Voice/text filling with a **Mandatory Review Screen & Explicit User Confirmation** before submission.
- **Application Tracker**: Live timeline stages (`Submitted -> Under Review -> Approved`).

### 4. 📢 Local Public Utility Hub
- **⚡ Electricity Interruption Notices**: Sub-station maintenance schedules, dates, timings, helpline 1912.
- **🌾 Ration Distribution Updates**: Live stock availability (Rice, Dal, Oil, Sugar), shop number, opening hours, OTP guidelines.
- **⛏️ 100-Day MGNREGS Work**: Daily wage (₹319/day), work location, duration, panchayat application instructions.

### 5. 🏥 Health & Maternal/Child Wellness
- **Free Health Camps**: Adult, Women's Anaemia Screening, Free Eye Screening & Cataract surgery, Dental camps with doctor schedules.
- **👶 Kids & Family Immunization**: Verified regular vaccination sessions (Polio, BCG, Pentavalent, MR), ASHA contact, nutrition support.
- **Strict Medical Disclaimers**: Disclaims diagnosis to prioritize professional medical consultation.

### 6. 🛡️ Women's Safety & Confidential Emergency Hub
- **🚨 1-Tap Emergency Call**: Instant one-tap access to National Emergency (`112`), Women Helpline (`181`), Police Cell (`1091`), NCW Helpline (`7827170170`), and Trusted Contact.
- **Domestic Violence & Dowry Harassment Support**: Respectful, non-judgmental guided support and rights under the DV Act 2005 and Dowry Prohibition Act.
- **One Stop Centres (Sakhi Centres)**: Directory with distance, address, 24x7 temporary shelter, and legal aid.
- **⚡ QUICK EXIT**: Floating top bar that instantly switches the entire screen to a neutral calculator disguise and stops all audio.
- **🔒 Safe Neutral Notifications**: Privacy-preserving labels (e.g. *"You have a new support update"*).
- **Trusted Contact & Safety Plan**: Private safe places, emergency bag checklist, and emergency numbers.

### 7. 💚 Mental Health & Counselling ("Talk to Someone")
- **Tele-MANAS (14416 / 1800-891-4416)**: Direct 24/7 free toll-free calling.
- **Confidential Booking**: Data-minimized form generating secure Request ID (`JY-CNS-XXXXXX`) without requiring abuse disclosure.

### 8. ♿ Accessibility & Mobile-First Performance
- Accessibility toolbar: Text resize (`A`, `A+`, `A++`), High Contrast modes (Black/Yellow contrast, Dark mode), "Read Screen" full TTS.
- Offline resilience and PWA support with service worker readiness.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js Server Actions & API Route Handlers.
- **Database**: PostgreSQL (Supabase) with Row Level Security (RLS) & Audit Triggers (`supabase/schema.sql`).
- **AI & Voice**: Google Gemini API + Browser Web Speech API (STT & TTS).
- **PWA**: Web App Manifest & Service Worker caching.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run locally in development
npm run dev

# Build for production
npm run build
```
