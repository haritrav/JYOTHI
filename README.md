# JYOTHI (ஜோதி / ज्योति / జ్యోతి / ജ്യോതി)

> **Tagline:** *“Her Voice. Her Language. Her Access.”*  
> **Alternative Tagline:** *“Speak. Know. Act. Stay Safe.”*  
> **Core Principle:** *“Technology should adapt to the woman, not the woman to technology.”*

---

## 🌟 About JYOTHI

**JYOTHI** is a production-quality, mobile-first, multilingual, voice-first digital companion web application engineered specifically for rural women, first-time smartphone users, and women with limited literacy in India.

The application allows a woman to independently:
1. **Discover Government Schemes** (*Kalaignar Magalir Urimai Thittam*, *PMMVY*, *Lakhpati Didi*, *PM Ujjwala*, *PMAY-G*).
2. **Check Preliminary Eligibility** with a simple conversational one-question-at-a-time wizard.
3. **Understand Required Documents** (Aadhaar, Bank Passbook, Ration Card, Passport Photo) via audio and visual guides.
4. **Follow Step-by-Step Application Procedures** and track submitted drafts with application tracking IDs (`JYO-TN-2026-8841`) and visual status timelines.
5. **Receive Verified Local Updates:**
   - ⚡ **Electricity power outages** with exact substation timings, affected villages, and 1912 direct dial.
   - 🍚 **PDS Ration shop stocks** (Rice, Wheat, Sugar, Oil, Dal) with monthly distribution schedules and 1967 helpline.
   - 👷 **MGNREGA 100-Day rural work opportunities** with daily wages (₹319/day) and Gram Panchayat contacts.
   - 🏛️ **Panchayat & agricultural announcements**.
6. **Access Health & Family Care:**
   - 👩 Adult and Women Specialty screening camps (Cervical Pap smear, Breast screening, Anemia Hb check).
   - 👁️ Free eye & cataract screening with free reading glasses.
   - 💉 **Child Vaccination session calendar** with ASHA worker contacts, turn-by-turn directions, and one-tap reminder alerts.
7. **Access Women's Safety & Emergency Services (Priority #1):**
   - 🚨 **One-tap Immediate Danger mode** connecting directly to official national helplines:
     - **112** — Emergency Response Support System (Police / Ambulance / Fire)
     - **181** — Women Helpline (24/7 Protection & Support)
     - **1098** — Child Helpline
   - 📍 **One Stop Centres (Sakhi Kendras)** directory with distance, 24/7 operating status, free temporary shelter, medical assistance, and turn-by-turn navigation.
   - 🛡️ **Domestic violence & Dowry harassment guided triage** that never forces sensitive disclosure.
   - ⚖️ **Legal Support & Rights** (Protection orders, right to residence, maintenance, and 100% free legal aid through DLSA/TLSC).
   - 🛡️ **My Safety Plan** builder to privately store trusted contacts, safe places, emergency bag checklists, and quick-delete controls.
   - 🚪 **Quick Exit / Safe Exit button** that immediately disguises the screen into a neutral **Rural Weather & Crop Advisory** view and cleans sensitive traces.
   - 🔒 **Safe Notifications** that neutrally mask sensitive alerts into `💚 You have a new support update` to safeguard confidentiality.
8. **Access Mental Health & Free Counselling:**
   - 💚 **Tele-MANAS** official 24/7 toll-free helpline (`14416` / `1800-89-14416`).
   - **Register for Free Counselling** with licensed female counselors collecting minimal sensitive information and issuing confidential request IDs (`CNSL-2026-XXXX`).
9. **Admin Portal (`/admin`):**
   - Secure PIN (`1234`) login to manage verified schemes, electricity outage notices, ration stock, counselling requests, and immutable audit logs.

---

## 🇮🇳 Supported Regional Languages

- 🇮🇳 **Tamil — தமிழ்**
- 🇮🇳 **Hindi — हिन्दी**
- 🇮🇳 **Telugu — తెలుగు**
- 🇮🇳 **Malayalam — മലയാളം**

---

## 🛠️ Technology Stack

- **Frontend Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Voice & Audio:** Web Speech API (Speech Recognition & Speech Synthesis for `ta-IN`, `hi-IN`, `te-IN`, `ml-IN`), Web Audio API chime synthesis
- **AI & Intent Engine:** Google Gemini API (`/api/ai`) with verified local function calling fallback
- **PWA:** Installable standalone Progressive Web App for Android

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/haritrav/JYOTHI.git
cd JYOTHI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser (or simulate mobile view at 390x844).

### 4. Build for Production
```bash
npm run build
npm start
```
