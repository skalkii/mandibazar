export const LOCALES = ["en", "hi", "mr", "kn", "ne", "ta", "te", "bn"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  kn: "ಕನ್ನಡ",
  ne: "नेपाली",
  ta: "தமிழ்",
  te: "తెలుగు",
  bn: "বাংলা",
};

export type Dictionary = {
  app_title: string;
  app_tagline: string;
  pick_commodity: string;
  pick_commodity_placeholder: string;
  state: string;
  state_optional: string;
  all_states: string;
  see_prices: string;
  loading: string;
  no_commodities: string;
  top_prices: string;
  as_of: string;
  change: string;
  no_data: string;
  no_data_hint: string;
  data_source: string;
  per_kg: string;
  variety: string;
  range: string;
  theme_light: string;
  theme_dark: string;
  theme_system: string;
  language: string;
};

const en: Dictionary = {
  app_title: "Mandi Price Aggregator",
  app_tagline: "Today's commodity prices across Indian mandis. Pick a commodity to see the best rates near you.",
  pick_commodity: "Commodity",
  pick_commodity_placeholder: "Pick a commodity (e.g. Tomato)",
  state: "State",
  state_optional: "State (optional)",
  all_states: "All states",
  see_prices: "See prices",
  loading: "Loading…",
  no_commodities: "No commodities yet — run `pnpm seed`",
  top_prices: "Top mandi prices",
  as_of: "as of",
  change: "← Change",
  no_data: "No prices found",
  no_data_hint: "Try a different state or commodity.",
  data_source: "Data: data.gov.in Agmarknet · Updated daily ~6 PM IST",
  per_kg: "/kg",
  variety: "Variety",
  range: "range",
  theme_light: "Light",
  theme_dark: "Dark",
  theme_system: "System",
  language: "Language",
};

const hi: Dictionary = {
  app_title: "मंडी भाव",
  app_tagline: "आज के मंडी भाव। फसल चुनें और अपने पास के सबसे अच्छे दाम देखें।",
  pick_commodity: "फसल",
  pick_commodity_placeholder: "फसल चुनें (जैसे टमाटर)",
  state: "राज्य",
  state_optional: "राज्य (वैकल्पिक)",
  all_states: "सभी राज्य",
  see_prices: "भाव देखें",
  loading: "लोड हो रहा है…",
  no_commodities: "अभी कोई फसल नहीं — `pnpm seed` चलाएँ",
  top_prices: "सर्वोत्तम मंडी भाव",
  as_of: "तारीख",
  change: "← बदलें",
  no_data: "कोई भाव नहीं मिला",
  no_data_hint: "कोई और राज्य या फसल आज़माएँ।",
  data_source: "स्रोत: data.gov.in एगमार्कनेट · रोज़ शाम 6 बजे अद्यतन",
  per_kg: "/किलो",
  variety: "किस्म",
  range: "सीमा",
  theme_light: "हल्का",
  theme_dark: "गहरा",
  theme_system: "सिस्टम",
  language: "भाषा",
};

const mr: Dictionary = {
  app_title: "मंडई भाव",
  app_tagline: "आजचे मंडईतील भाव. पीक निवडा आणि जवळचे सर्वोत्तम भाव पाहा.",
  pick_commodity: "पीक",
  pick_commodity_placeholder: "पीक निवडा (उदा. टोमॅटो)",
  state: "राज्य",
  state_optional: "राज्य (पर्यायी)",
  all_states: "सर्व राज्ये",
  see_prices: "भाव पाहा",
  loading: "लोड होत आहे…",
  no_commodities: "अद्याप पिके नाहीत — `pnpm seed` चालवा",
  top_prices: "सर्वोत्तम मंडई भाव",
  as_of: "दिनांक",
  change: "← बदला",
  no_data: "कोणतेही भाव सापडले नाहीत",
  no_data_hint: "दुसरे राज्य किंवा पीक वापरून पाहा.",
  data_source: "स्रोत: data.gov.in एगमार्कनेट · रोज ६ वा. अद्यतन",
  per_kg: "/किलो",
  variety: "जात",
  range: "श्रेणी",
  theme_light: "उजळ",
  theme_dark: "गडद",
  theme_system: "सिस्टम",
  language: "भाषा",
};

const kn: Dictionary = {
  app_title: "ಮಂಡಿ ಬೆಲೆಗಳು",
  app_tagline: "ಇಂದಿನ ಮಂಡಿ ಬೆಲೆಗಳು. ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಹತ್ತಿರದ ಉತ್ತಮ ದರಗಳನ್ನು ನೋಡಿ.",
  pick_commodity: "ಬೆಳೆ",
  pick_commodity_placeholder: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ (ಉದಾ. ಟೊಮೆಟೊ)",
  state: "ರಾಜ್ಯ",
  state_optional: "ರಾಜ್ಯ (ಐಚ್ಛಿಕ)",
  all_states: "ಎಲ್ಲಾ ರಾಜ್ಯಗಳು",
  see_prices: "ಬೆಲೆ ನೋಡಿ",
  loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
  no_commodities: "ಇನ್ನೂ ಬೆಳೆಗಳಿಲ್ಲ — `pnpm seed` ರನ್ ಮಾಡಿ",
  top_prices: "ಅತ್ಯುತ್ತಮ ಮಂಡಿ ಬೆಲೆಗಳು",
  as_of: "ದಿನಾಂಕ",
  change: "← ಬದಲಿಸಿ",
  no_data: "ಬೆಲೆಗಳು ಸಿಗಲಿಲ್ಲ",
  no_data_hint: "ಬೇರೆ ರಾಜ್ಯ ಅಥವಾ ಬೆಳೆ ಪ್ರಯತ್ನಿಸಿ.",
  data_source: "ಮೂಲ: data.gov.in ಎಗ್ಮಾರ್ಕ್‌ನೆಟ್ · ಪ್ರತಿದಿನ ಸಂಜೆ ೬ ಗಂಟೆಗೆ ಅಪ್‌ಡೇಟ್",
  per_kg: "/ಕೆಜಿ",
  variety: "ತಳಿ",
  range: "ಶ್ರೇಣಿ",
  theme_light: "ತಿಳಿ",
  theme_dark: "ಗಾಢ",
  theme_system: "ಸಿಸ್ಟಮ್",
  language: "ಭಾಷೆ",
};

const ne: Dictionary = {
  app_title: "मण्डी मूल्य",
  app_tagline: "आजका मण्डी मूल्य। बाली छान्नुहोस् र नजिकका उत्तम दर हेर्नुहोस्।",
  pick_commodity: "बाली",
  pick_commodity_placeholder: "बाली छान्नुहोस् (जस्तै गोलभेँडा)",
  state: "राज्य",
  state_optional: "राज्य (ऐच्छिक)",
  all_states: "सबै राज्य",
  see_prices: "मूल्य हेर्नुहोस्",
  loading: "लोड हुँदैछ…",
  no_commodities: "अहिले कुनै बाली छैन — `pnpm seed` चलाउनुहोस्",
  top_prices: "उत्तम मण्डी मूल्य",
  as_of: "मिति",
  change: "← परिवर्तन",
  no_data: "कुनै मूल्य भेटिएन",
  no_data_hint: "अर्को राज्य वा बाली प्रयास गर्नुहोस्।",
  data_source: "स्रोत: data.gov.in एग्मार्कनेट · दैनिक ६ बजे अद्यावधिक",
  per_kg: "/केजी",
  variety: "जात",
  range: "दायरा",
  theme_light: "उज्यालो",
  theme_dark: "अँध्यारो",
  theme_system: "प्रणाली",
  language: "भाषा",
};

const ta: Dictionary = {
  app_title: "மண்டி விலைகள்",
  app_tagline: "இன்றைய மண்டி விலைகள். ஒரு பயிரைத் தேர்வு செய்து உங்களுக்கு அருகிலுள்ள சிறந்த விலைகளைப் பாருங்கள்.",
  pick_commodity: "பயிர்",
  pick_commodity_placeholder: "பயிரைத் தேர்ந்தெடுக்கவும் (எ.கா. தக்காளி)",
  state: "மாநிலம்",
  state_optional: "மாநிலம் (விருப்பப்படி)",
  all_states: "அனைத்து மாநிலங்கள்",
  see_prices: "விலை பார்க்க",
  loading: "ஏற்றுகிறது…",
  no_commodities: "இன்னும் பயிர்கள் இல்லை — `pnpm seed` இயக்கவும்",
  top_prices: "சிறந்த மண்டி விலைகள்",
  as_of: "தேதி",
  change: "← மாற்று",
  no_data: "விலைகள் கிடைக்கவில்லை",
  no_data_hint: "வேறு மாநிலம் அல்லது பயிரை முயற்சிக்கவும்.",
  data_source: "மூலம்: data.gov.in எக்மார்க்நெட் · தினமும் மாலை 6 மணிக்கு புதுப்பிக்கப்படுகிறது",
  per_kg: "/கிலோ",
  variety: "வகை",
  range: "வரம்பு",
  theme_light: "ஒளி",
  theme_dark: "இருள்",
  theme_system: "முறைமை",
  language: "மொழி",
};

const te: Dictionary = {
  app_title: "మండి ధరలు",
  app_tagline: "నేటి మండి ధరలు. పంటను ఎంచుకుని మీ సమీపంలోని ఉత్తమ ధరలను చూడండి.",
  pick_commodity: "పంట",
  pick_commodity_placeholder: "పంటను ఎంచుకోండి (ఉదా. టమోటా)",
  state: "రాష్ట్రం",
  state_optional: "రాష్ట్రం (ఐచ్ఛికం)",
  all_states: "అన్ని రాష్ట్రాలు",
  see_prices: "ధరలు చూడండి",
  loading: "లోడ్ అవుతోంది…",
  no_commodities: "ఇంకా పంటలు లేవు — `pnpm seed` అమలు చేయండి",
  top_prices: "ఉత్తమ మండి ధరలు",
  as_of: "తేదీ",
  change: "← మార్చు",
  no_data: "ధరలు దొరకలేదు",
  no_data_hint: "మరో రాష్ట్రం లేదా పంటను ప్రయత్నించండి.",
  data_source: "మూలం: data.gov.in ఎగ్‌మార్క్‌నెట్ · ప్రతిరోజూ సాయంత్రం 6 గంటలకు అప్‌డేట్",
  per_kg: "/కేజీ",
  variety: "రకం",
  range: "శ్రేణి",
  theme_light: "కాంతి",
  theme_dark: "చీకటి",
  theme_system: "సిస్టమ్",
  language: "భాష",
};

const bn: Dictionary = {
  app_title: "মান্ডি দাম",
  app_tagline: "আজকের মান্ডির দাম। ফসল বেছে নিন এবং আপনার কাছাকাছি সেরা দাম দেখুন।",
  pick_commodity: "ফসল",
  pick_commodity_placeholder: "ফসল বেছে নিন (যেমন টমেটো)",
  state: "রাজ্য",
  state_optional: "রাজ্য (ঐচ্ছিক)",
  all_states: "সব রাজ্য",
  see_prices: "দাম দেখুন",
  loading: "লোড হচ্ছে…",
  no_commodities: "এখনো ফসল নেই — `pnpm seed` চালান",
  top_prices: "সেরা মান্ডির দাম",
  as_of: "তারিখ",
  change: "← পরিবর্তন",
  no_data: "কোনো দাম পাওয়া যায়নি",
  no_data_hint: "অন্য রাজ্য বা ফসল চেষ্টা করুন।",
  data_source: "উৎস: data.gov.in এগমার্কনেট · প্রতিদিন বিকাল ৬টায় আপডেট",
  per_kg: "/কেজি",
  variety: "জাত",
  range: "পরিসর",
  theme_light: "আলো",
  theme_dark: "অন্ধকার",
  theme_system: "সিস্টেম",
  language: "ভাষা",
};

export const dictionaries: Record<Locale, Dictionary> = { en, hi, mr, kn, ne, ta, te, bn };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}
