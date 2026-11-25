export type FaithKey = 'islam' | 'hinduism' | 'buddhism' | 'christianity';

export interface CharityTeaching {
  id: string;
  faith: FaithKey;
  faithNameBn: string;
  faithNameEn: string;
  traditionSubtitleBn: string;
  traditionSubtitleEn: string;
  accentHex: string;
  sourceRefBn: string;
  sourceRefEn: string;
  originalLine?: string;
  quoteBn: string;
  quoteEn: string;
  reflectionBn: string;
  reflectionEn: string;
}

export const CHARITY_TEACHINGS: CharityTeaching[] = [
  {
    id: 'islam-bukhari-1417',
    faith: 'islam',
    faithNameBn: 'ইসলাম ধর্ম',
    faithNameEn: 'Islam',
    traditionSubtitleBn: 'সহীহ হাদীস · সহীহ বুখারী ও মুসলিম',
    traditionSubtitleEn: 'Sahih Hadith · Bukhari & Muslim',
    accentHex: '#167D78',
    sourceRefBn: 'সহীহ বুখারী, হাদীস ১৪১৭ ও সহীহ মুসলিম, হাদীস ১০১৬',
    sourceRefEn: 'Sahih al-Bukhari 1417 · Sahih Muslim 1016',
    originalLine: '«اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ»',
    quoteBn: '“আধখানা খেজুর দান করে হলেও তোমরা জাহান্নামের আগুন থেকে নিজেদের রক্ষা করো।”',
    quoteEn: '“Protect yourself from Hellfire even with half a date given in charity.”',
    reflectionBn:
      'অর্থাৎ আল্লাহর সন্তুষ্টির জন্য হালাল উপার্জন থেকে মাত্র ১ টাকা (৳১) বা সামান্যতম দানও কখনো তুচ্ছ নয়; আন্তরিক নিয়তে প্রদত্ত ক্ষুদ্র দানও বিপদ-আপদ দূর করে।',
    reflectionEn:
      'Even a contribution as small as BDT 1 offered sincerely carries immense spiritual weight and mercy.',
  },
  {
    id: 'islam-muslim-2588',
    faith: 'islam',
    faithNameBn: 'ইসলাম ধর্ম',
    faithNameEn: 'Islam',
    traditionSubtitleBn: 'সহীহ হাদীস ও পবিত্র আল-কুরআন',
    traditionSubtitleEn: 'Sahih Muslim & Holy Qur’an',
    accentHex: '#0F766E',
    sourceRefBn: 'সহীহ মুসলিম, হাদীস ২৫৮৮ · সূরা আল-বাকারা ২:২৬১',
    sourceRefEn: 'Sahih Muslim 2588 · Qur’an 2:261',
    originalLine: '«مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ»',
    quoteBn:
      '“সদকা (দান) কখনো সম্পদ কমায় না; বরং দান করলে আল্লাহ বান্দার সম্মান ও বরকত বাড়িয়ে দেন।” — আর আল্লাহর পথে ব্যয়কারীর দান একটি বীজের মতো, যা থেকে সাতশ গুণ পর্যন্ত ফল উৎপন্ন হয়।',
    quoteEn:
      '“Charity never decreases wealth; rather Allah increases the honor and blessing of the giver.” — What is spent in God’s path multiplies like a grain yielding seven hundredfold.',
    reflectionBn:
      'প্রতিটি ছোট অনুদান মানুষের কল্যাণে পৌঁছে যায় এবং দাতার জীবনে শান্তি ও বরকত নিয়ে আসে।',
    reflectionEn:
      'Every heartfelt act of generosity sustains communities in need while multiplying blessings.',
  },
  {
    id: 'hinduism-gita-17-20',
    faith: 'hinduism',
    faithNameBn: 'হিন্দু ধর্ম',
    faithNameEn: 'Hinduism',
    traditionSubtitleBn: 'শ্রীমদ্ভগবদ্গীতা ও উপনিষদ',
    traditionSubtitleEn: 'Bhagavad Gita & Upanishads',
    accentHex: '#D97706',
    sourceRefBn: 'শ্রীমদ্ভগবদ্গীতা, অধ্যায় ১৭, শ্লোক ২০',
    sourceRefEn: 'Bhagavad Gita 17.20',
    originalLine: 'दातव्यमिति यद्दानं दीयतेऽनुपकारिणे ।',
    quoteBn:
      '“কোনো প্রতিদানের প্রত্যাশা না করে কর্তব্যবোধে, উপযুক্ত সময়ে, স্থানে ও সৎপাত্রে নিঃস্বার্থভাবে যে দান করা হয় — তাকেই শ্রেষ্ঠ সাত্ত্বিক দান বলা হয়।”',
    quoteEn:
      '“Charity given out of duty, without expectation of anything in return, at the right place and time to a worthy cause, is Sattvic (pure).”',
    reflectionBn:
      'তৈত্তিরীয় উপনিষদেও (১.১১.৩) বলা হয়েছে: “শ্রদ্ধয়া দেয়ম্” — অহংকারহীন শ্রদ্ধা ও করুণার সাথে সামর্থ্য অনুযায়ী ১ টাকা হোক বা বেশি, নিঃস্বার্থ দানই পরম ধর্ম।',
    reflectionEn:
      'Taittiriya Upanishad (1.11.3) also teaches “Shraddhaya Deyam” — give with reverence, compassion, and whatever means one holds.',
  },
  {
    id: 'hinduism-vivekananda-seva',
    faith: 'hinduism',
    faithNameBn: 'হিন্দু ধর্ম',
    faithNameEn: 'Hinduism',
    traditionSubtitleBn: 'বেদান্ত ও মানবসেবা দর্শন',
    traditionSubtitleEn: 'Vedanta · Service to Living Beings',
    accentHex: '#B45309',
    sourceRefBn: 'তৈত্তিরীয় উপনিষদ ১.১১.৩ · মানবসেবা আদর্শ',
    sourceRefEn: 'Taittiriya Upanishad 1.11.3 · Seva Tradition',
    originalLine: 'श्रद्धया देयम् । संविदा देयम् ।',
    quoteBn:
      '“শ্রদ্ধার সাথে দান করো, ভালোবাসা ও সহানুভূতির সাথে দান করো। জীবে প্রেম করে যেই জন, সেই জন সেবিছে ঈশ্বর।”',
    quoteEn:
      '“Give with faith and humility, give with sympathy and understanding; serving humanity in distress is the highest worship of the Divine.”',
    reflectionBn:
      'অসহায় মানুষের মুখে হাসি ফোটাতে ক্ষুদ্র সামর্থ্যের সম্মিলিত দানও সমাজে মহৎ পরিবর্তন আনতে পারে।',
    reflectionEn:
      'Collective compassion—even in small sums—upholds dharma and relieves human suffering.',
  },
  {
    id: 'buddhism-dhammapada-223',
    faith: 'buddhism',
    faithNameBn: 'বৌদ্ধ ধর্ম',
    faithNameEn: 'Buddhism',
    traditionSubtitleBn: 'পবিত্র ধম্মপদ ও দান-পারমিতা',
    traditionSubtitleEn: 'Dhammapada & Dana Paramita',
    accentHex: '#0284C7',
    sourceRefBn: 'পবিত্র ধম্মপদ, ক্রোধবর্গ (গাথা ২২৩) ও লোকবর্গ (গাথা ১৭৭)',
    sourceRefEn: 'Dhammapada Verse 223 & Verse 177',
    originalLine: 'अक्कोधेन जिने कोधं ... सच्चेन अलिकवादिनं जिने दानेन कदरियं ॥',
    quoteBn:
      '“অক্রোধের দ্বারা ক্রোধকে জয় করো, সাধুতার দ্বারা অসাধুতাকে জয় করো, আর উদার দানের দ্বারা কৃপণতাকে জয় করো। কল্যাণময় দানই সকল জীবের জন্য পরম সুখের সোপান।”',
    quoteEn:
      '“Conquer anger with non-anger, conquer ill-will with goodness, and conquer miserliness through generosity (Dana).”',
    reflectionBn:
      'বৌদ্ধ দর্শনে ‘দান-পারমিতা’ হলো প্রথম ও প্রধান গুণ; ক্ষুদ্র ১ টাকা দানও যদি মৈত্রী ও করুণাভরা চিত্তে হয়, তবে তা অসীম পুণ্য সৃষ্টি করে।',
    reflectionEn:
      'In Buddhist teaching, Dana Paramita begins with an open heart—even the smallest gift offered with Metta creates boundless merit.',
  },
  {
    id: 'buddhism-iti-charity',
    faith: 'buddhism',
    faithNameBn: 'বৌদ্ধ ধর্ম',
    faithNameEn: 'Buddhism',
    traditionSubtitleBn: 'ত্রিপিটক · ইতিত্তক সুত্ত',
    traditionSubtitleEn: 'Tipitaka · Itivuttaka',
    accentHex: '#0369A1',
    sourceRefBn: 'খুদ্দক নিকায় · ইতিত্তক (দান সুত্ত)',
    sourceRefEn: 'Khuddaka Nikaya · Itivuttaka (Sharing)',
    quoteBn:
      '“যদি মানুষ জানত ভাগ করে নেওয়া ও দানের ফল কত মধুর, তবে অন্যকে না দিয়ে এবং কার্পণ্য দূর না করে সে এক গ্রাস খাদ্যও একা গ্রহণ করত না।”',
    quoteEn:
      '“If beings knew, as I know, the fruit of sharing gifts, they would not enjoy even their final morsel without sharing it with others.”',
    reflectionBn:
      'অপরের কষ্ট লাঘবে নিজের অংশ থেকে সামান্য ভাগ করে নেওয়াই মানবতার শ্রেষ্ঠ প্রকাশ।',
    reflectionEn:
      'Sharing even a tiny portion of what we possess nourishes compassion and binds society together.',
  },
  {
    id: 'christianity-mark-12',
    faith: 'christianity',
    faithNameBn: 'খৃষ্টান ধর্ম',
    faithNameEn: 'Christianity',
    traditionSubtitleBn: 'পবিত্র বাইবেল · নূতন নিয়ম',
    traditionSubtitleEn: 'Holy Bible · New Testament',
    accentHex: '#6D28D9',
    sourceRefBn: 'পবিত্র বাইবেল · মার্ক ১২:৪১–৪৪ ও লূক ২১:১–৪',
    sourceRefEn: 'Mark 12:41–44 · Luke 21:1–4',
    quoteBn:
      '“দরিদ্র বিধবার দুটি ক্ষুদ্র তামার মুদ্রার দান: অন্য সবাই নিজেদের উদ্বৃত্ত থেকে দিয়েছে, কিন্তু এই দরিদ্র নারী ভালোবাসা ও ত্যাগ থেকে তাঁর সামান্য সম্বলের সবটুকু দিয়েছেন — ঈশ্বরের দৃষ্টিতে তাঁর দানই সবচেয়ে বড়।”',
    quoteEn:
      '“The Widow’s Two Small Coins: Truly I tell you, this poor widow has put in more than all the others; they gave out of their abundance, but she gave out of love and devotion.”',
    reflectionBn:
      'খৃষ্টীয় শিক্ষায় অনুদানের অঙ্ক বড় কি ছোট তা বিচার্য নয়; ভালোবাসাভরা হৃদয়ের ১ টাকার দানও স্রষ্টার কাছে অতুলনীয় মূল্য রাখে।',
    reflectionEn:
      'Christian scripture directly honors the smallest offering made from love above vast wealth given without sacrifice.',
  },
  {
    id: 'christianity-corinthians-acts',
    faith: 'christianity',
    faithNameBn: 'খৃষ্টান ধর্ম',
    faithNameEn: 'Christianity',
    traditionSubtitleBn: 'প্রেরিত ও করিন্থীয় পত্র',
    traditionSubtitleEn: '2 Corinthians & Acts',
    accentHex: '#7C3AED',
    sourceRefBn: '২ করিন্থীয় ৯:৭ ও প্রেরিতদের কার্যবিবরণ ২০:৩৫',
    sourceRefEn: '2 Corinthians 9:7 · Acts 20:35',
    quoteBn:
      '“প্রত্যেকে নিজের হৃদয়ে যেভাবে স্থির করেছে, সেই অনুসারেই দান করুক — দুঃখিত মনে বা বাধ্য হয়ে নয়; কারণ ঈশ্বর আনন্দিত চিত্তে দানকারীকেই ভালোবাসেন। গ্রহণ করা অপেক্ষা দান করা অধিকতর ধন্য।”',
    quoteEn:
      '“Each should give what they have decided in their heart to give, not reluctantly or under compulsion, for God loves a cheerful giver. It is more blessed to give than to receive.”',
    reflectionBn:
      'জাতি-ধর্ম-বর্ণ নির্বিশেষে আর্তমানবতার সেবায় এগিয়ে আসাই সকল ধর্মের অভিন্ন আহ্বান।',
    reflectionEn:
      'Cheerful generosity across all communities reflects our shared duty to uplift every neighbor in need.',
  },
];
