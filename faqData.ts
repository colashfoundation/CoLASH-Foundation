import { Language, PortalCategoryKey } from '../types';

export type FAQCategoryId = 'all' | 'identity' | 'donations' | 'governance' | 'membership';

export interface FAQItem {
  id: string;
  category: Exclude<FAQCategoryId, 'all'>;
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  actionLabelBn?: string;
  actionLabelEn?: string;
  actionCategory?: PortalCategoryKey;
}

export const FAQ_CATEGORIES: Array<{
  id: FAQCategoryId;
  labelBn: string;
  labelEn: string;
}> = [
  { id: 'all', labelBn: 'সব প্রশ্ন', labelEn: 'All Questions' },
  { id: 'identity', labelBn: 'পরিচিতি ও আদর্শ', labelEn: 'Identity & Charter' },
  { id: 'donations', labelBn: 'অনুদান ও স্বচ্ছতা', labelEn: 'Donations & Audit' },
  { id: 'governance', labelBn: 'পরিচালনা ও কমিটি', labelEn: 'Governance & Wings' },
  { id: 'membership', labelBn: 'সদস্য, রক্তদান ও সাহায্য', labelEn: 'Members, Blood & Aid' },
];

export const COLASH_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-what-is-colash',
    category: 'identity',
    questionBn: 'CoLASH কী এবং এর পূর্ণরূপ ও মূল উদ্দেশ্য কী?',
    questionEn: 'What does CoLASH stand for and what is its core purpose?',
    answerBn:
      'CoLASH-এর পূর্ণরূপ হলো "Circle of Light and Service for Humanity" — বাংলায় "মানবতার জন্য আলো এবং সেবার বলয়"। এটি ০৭ মার্চ ২০২৬ খ্রিস্টাব্দে সিলেট বিভাগের মৌলভীবাজার জেলার কমলগঞ্জ উপজেলায় প্রতিষ্ঠিত একটি অলাভজনক ও জনকল্যাণমুখী স্বেচ্ছাসেবী সংগঠন। শিক্ষা সহায়তা, দুর্যোগ ও বন্যাত্রাণ, বিনামূল্যে চিকিৎসা ও ২৪/৭ রক্তদান এবং অসহায় নারী-পুরুষের স্বাবলম্বী কর্মসংস্থানে সংগঠনটি কাজ করে।',
    answerEn:
      'CoLASH stands for "Circle of Light and Service for Humanity". Founded on 07 March 2026 in Kamalganj, Moulvibazar (Sylhet Division), it is an independent non-profit humanitarian foundation dedicated to education scholarships, emergency flood relief, free medical camps, a 24/7 blood bank, and sustainable livelihood empowerment.',
    actionLabelBn: 'প্রতিষ্ঠাতা ও দর্শন পড়ুন',
    actionLabelEn: 'Read Founder Vision',
    actionCategory: 'founder',
  },
  {
    id: 'faq-non-political',
    category: 'identity',
    questionBn: 'কোলাশ ফাউন্ডেশন কি কোনো রাজনৈতিক দল বা বিশেষ গোষ্ঠীর অংশ?',
    questionEn: 'Is CoLASH Foundation affiliated with any political party or religious sect?',
    answerBn:
      'না। কোলাশ ফাউন্ডেশন সম্পূর্ণ অরাজনৈতিক, অসাম্প্রদায়িক, অলাভজনক, স্বেচ্ছাসেবী ও গণতান্ত্রিক একটি স্বাধীন সংগঠন। আমাদের গঠনতন্ত্র অনুযায়ী এর কোনো রাজনৈতিক অঙ্গসংগঠন নেই এবং এটি অন্য কোনো সংগঠনের শাখা বা অংশও নয়। ধর্ম-বর্ণ-লিঙ্গ নির্বিশেষে শুধুমাত্র মানবতার মর্যাদা রক্ষায় সবাই এখানে সমান।',
    answerEn:
      'No. CoLASH Foundation is strictly non-political, non-communal, non-profit, and independent. Per its founding charter, it has no political wings and is not subordinate to any outside group. Every person is served and welcomed equally regardless of religion, background, or identity.',
    actionLabelBn: 'গঠনতন্ত্র ও আদর্শ দেখুন',
    actionLabelEn: 'View Foundation Charter',
    actionCategory: 'about',
  },
  {
    id: 'faq-interfaith-donation',
    category: 'identity',
    questionBn: 'ভিন্ন ধর্মের মানুষ কি কোলাশ ফাউন্ডেশন থেকে সাহায্য পেতে বা অনুদান দিতে পারেন?',
    questionEn: 'Can people of all faiths receive aid from or donate to CoLASH Foundation?',
    answerBn:
      'অবশ্যই। মানবতার সেবায় ইসলাম, সনাতন (হিন্দু), বৌদ্ধ ও খ্রিস্টান—সকল ধর্মের দানের মহৎ বাণীকে আমরা সমান শ্রদ্ধা জানাই। আমাদের অনুদান পেজে প্রতিটি ধর্মের দানের বাণী যুক্ত রয়েছে এবং সাহায্য বিতরণের সময় শুধুমাত্র মানুষের প্রয়োজনকে অগ্রাধিকার দেওয়া হয়, কোনো ধর্ম বা পরিচয় বিবেচনা করা হয় না।',
    answerEn:
      'Absolutely. CoLASH respects and draws inspiration from charity teachings across Islam, Hinduism, Buddhism, and Christianity alike. Aid distribution is strictly based on human need with zero discrimination.',
    actionLabelBn: 'সর্বজনীন অনুদান পেজ দেখুন',
    actionLabelEn: 'Visit Donate & Teachings Page',
    actionCategory: 'donate',
  },
  {
    id: 'faq-min-donation',
    category: 'donations',
    questionBn: 'সর্বনিম্ন কত টাকা অনুদান দেওয়া যায় এবং কীভাবে পাঠাতে হয়?',
    questionEn: 'What is the minimum donation amount and how can I send it?',
    answerBn:
      'মাত্র ৳১ (এক টাকা) থেকে শুরু করে আপনার সামর্থ্য অনুযায়ী যেকোনো অঙ্কের অনুদান দেওয়া যায়। অনুদান পেজ থেকে বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্ট নম্বর কপি করে টাকা পাঠিয়ে ট্রানজেকশন আইডি জমা দিলেই সাথে সাথে একটি ডিজিটাল ই-রসিদ তৈরি হয়ে যায়।',
    answerEn:
      'You can donate any amount starting from just ৳1 (1 BDT). Choose bKash, Nagad, or Dutch-Bangla Bank on the Donate page, submit your transaction ID, and receive an instant verifiable digital receipt.',
    actionLabelBn: '৳১ থেকে অনুদান দিন',
    actionLabelEn: 'Donate from ৳1',
    actionCategory: 'donate',
  },
  {
    id: 'faq-transparency-audit',
    category: 'donations',
    questionBn: 'আমার অনুদানের টাকা সত্যিই অসহায় মানুষের কাছে যাচ্ছে কিনা কীভাবে নিশ্চিত হব?',
    questionEn: 'How can I verify that my donation reaches people in need?',
    answerBn:
      'প্রতিটি অনুদান আমাদের পাবলিক "আর্থিক স্বচ্ছতা ও অডিট লেজার" পেজে স্বয়ংক্রিয়ভাবে যুক্ত হয়। এছাড়া প্রতিটি প্রকল্পের লক্ষ্যমাত্রা, সংগৃহীত তহবিল, উপকারভোগীর সংখ্যা এবং ভাউচার নম্বরসহ আয়-ব্যয়ের পূর্ণ অডিট বিবরণী যেকোনো সময় ওয়েবসাইটে সরাসরি পড়া ও যাচাই করা যায়।',
    answerEn:
      'Every verified contribution is logged in the Open Financial Transparency & Audit Ledger. Anyone can inspect campaign targets, fund disbursements, voucher numbers, and read annual audit statements directly on the website.',
    actionLabelBn: 'উন্মুক্ত অডিট লেজার দেখুন',
    actionLabelEn: 'Inspect Open Audit Ledger',
    actionCategory: 'transparency',
  },
  {
    id: 'faq-admin-overhead',
    category: 'donations',
    questionBn: 'কমিটির সদস্য বা কর্মীরা কি অনুদানের টাকা থেকে বেতন নেন?',
    questionEn: 'Do committee members or volunteers draw salaries from donations?',
    answerBn:
      'না। কোলাশ ফাউন্ডেশনের প্রতিষ্ঠাতা, সভাপতি, কার্যনির্বাহী পরিষদ এবং মাঠপর্যায়ের সকল স্বেচ্ছাসেবক সম্পূর্ণ বিনা পারিশ্রমিকে মানবিক দায়িত্ব পালন করেন। সংগৃহীত তহবিলের সর্বোচ্চ অংশ সরাসরি খাদ্য, শিক্ষা, চিকিৎসা ও স্বাবলম্বী প্রকল্পে ব্যয় করা হয়।',
    answerEn:
      'No. The Founder, Executive Council, and field volunteers serve on a 100% voluntary, unpaid basis so maximum funds go directly to food relief, scholarships, medical aid, and livelihood projects.',
  },
  {
    id: 'faq-founder-vs-committee',
    category: 'governance',
    questionBn: 'প্রতিষ্ঠাতা (Founder) ও কার্যনির্বাহী পরিষদ (২০২৬–২০২৮)-এর ভূমিকা কীভাবে আলাদা?',
    questionEn: 'How does the Founder role differ from the Approved Executive Council (2026–2028)?',
    answerBn:
      'প্রতিষ্ঠাতা মোঃ আশরাফুল ইসলাম সুলতান সংগঠনের জন্মলগ্ন (০৭-০৩-২০২৬), মূলদর্শন ও সাংবিধানিক আদর্শের অভিভাবক—তাঁর জন্য আলাদা প্রতিষ্ঠাতা পেজ রয়েছে। অন্যদিকে ১৬ সদস্যবিশিষ্ট "অনুমোদিত কার্যনির্বাহী পরিষদ ২০২৬–২০২৮" সভাপতির নেতৃত্বে সংগঠনের দৈনন্দিন প্রকল্প অনুমোদন, বাজেট পরিচালনা ও ত্রাণ কার্যক্রম বাস্তবায়ন করে। কোলাশের কোনো অতীত কমিটি নেই—এই বর্তমান কমিটিই প্রথম প্রতিষ্ঠাতা কমিটি।',
    answerEn:
      'The Founder (Md. Ashraful Islam Sultan) safeguards the founding genesis (07 March 2026) and non-political charter on the dedicated Founder page. The 16-member Approved Executive Council 2026–2028—led by the President—executes day-to-day relief, budgets, and operations. There are no past committees; this is the inaugural founding council.',
    actionLabelBn: 'কার্যনির্বাহী কমিটি দেখুন',
    actionLabelEn: 'View Executive Committee',
    actionCategory: 'committee',
  },
  {
    id: 'faq-womens-wing',
    category: 'governance',
    questionBn: 'কোলাশ উইমেন্স টিম (Women’s Team) কীভাবে কাজ করে?',
    questionEn: 'How does the CoLASH Women’s Team Wing operate?',
    answerBn:
      'কোলাশ উইমেন্স টিম একটি স্বায়ত্তশাসিত নারী নেতৃত্বাধীন উইং। প্রান্তিক নারী ও কিশোরীদের সেলাই মেশিন বিতরণ, কুটির শিল্প প্রশিক্ষণ, মা ও শিশু স্বাস্থ্য সচেতনতা এবং নারী স্বাবলম্বী প্রকল্পগুলো সম্পূর্ণ নিরাপদ ও মর্যাদাপূর্ণ পরিবেশে নারী সদস্যরাই পরিচালনা করেন।',
    answerEn:
      'The CoLASH Women’s Team is an autonomous female-led wing managing tailoring machine grants, cottage-craft training, maternal wellness drives, and women-centered safety initiatives with dedicated female members and leadership.',
    actionLabelBn: 'উইমেন্স টিম পেজ দেখুন',
    actionLabelEn: 'Open Women’s Wing',
    actionCategory: 'womens_team',
  },
  {
    id: 'faq-join-member',
    category: 'membership',
    questionBn: 'আমি কীভাবে কোলাশ ফাউন্ডেশনের সদস্য বা স্বেচ্ছাসেবক হিসেবে যুক্ত হতে পারি?',
    questionEn: 'How can I join CoLASH Foundation as a member or volunteer?',
    answerBn:
      'ওয়েবসাইটের উপরের "সদস্য পোর্টাল" বা "যুক্ত হোন" বাটনে ক্লিক করে খুব সহজেই সাধারণ সদস্য বা স্বেচ্ছাসেবক হিসেবে আবেদন করে যুক্ত হতে পারেন। তথ্য যাচাই ও অনুমোদনের পর আপনার নামে QR-কোডযুক্ত অফিশিয়াল ডিজিটাল আইডি কার্ড ইস্যু করা হবে।',
    answerEn:
      'Click "Member Portal" or "Join Volunteer" in the header to apply online with your details and blood group. Once reviewed and approved, you receive an official digital profile and QR-verifiable ID card.',
  },
  {
    id: 'faq-blood-and-qr',
    category: 'membership',
    questionBn: 'জরুরি রক্তের প্রয়োজনে বা কারো কোলাশ আইডি কার্ড আসল কিনা কীভাবে যাচাই করব?',
    questionEn: 'How do I find an urgent blood donor or verify a CoLASH Member ID card?',
    answerBn:
      '"সাধারণ সদস্য ও রক্তদাতা" ডিরেক্টরি থেকে রক্তের গ্রুপ ও জেলা অনুযায়ী সক্রিয় রক্তদাতাদের খুঁজে সরাসরি যোগাযোগ করা যায়। এছাড়া হেডারে থাকা "ID স্ক্যান" বাটন দিয়ে যেকোনো সদস্যের QR কোড স্ক্যান করে রিয়েল-টাইমে পরিচয় যাচাই করা সম্ভব।',
    answerEn:
      'Use the Members & Blood Bank directory to filter verified blood donors by blood group and district, or tap "Scan ID" in the top bar to scan any member’s QR code for instant authenticity verification.',
    actionLabelBn: 'রক্তদাতা ডিরেক্টরি খুঁজুন',
    actionLabelEn: 'Search Blood Directory',
    actionCategory: 'members',
  },
  {
    id: 'faq-public-aid-request',
    category: 'membership',
    questionBn: 'অসহায় কেউ সাহায্য, চিকিৎসা সহায়তা বা শিক্ষাবৃত্তির জন্য কীভাবে আবেদন করবেন?',
    questionEn: 'How can someone in need apply for humanitarian, medical, or scholarship aid?',
    answerBn:
      'কোনো প্রকার অ্যাকাউন্ট বা লগইন ছাড়াই আমাদের "নাগরিক আবেদন ডেস্ক" থেকে সাহায্য, অভিযোগ বা পরামর্শ জমা দেওয়া যায়। আবেদন সাবমিট করার সাথে সাথেই একটি ট্র্যাকিং আইডি (যেমন: COLASH-APP-...) পাওয়া যায়, যা দিয়ে পরবর্তীতে আবেদনের সর্বশেষ অবস্থা দেখা যায়। জরুরি প্রয়োজনে +880 1646-475348 নম্বরে সরাসরি কল করা যায়।',
    answerEn:
      'Anyone can submit an aid, medical, scholarship, or feedback request without logging in via our Citizen Applications Desk. You immediately receive a unique Tracking ID to check live review status, or you may call our 24/7 hotline at +880 1646-475348.',
    actionLabelBn: 'আবেদন ও ট্র্যাকিং ডেস্কে যান',
    actionLabelEn: 'Open Public Application Desk',
    actionCategory: 'notices_applications',
  },
];

export function getFAQCategoryLabel(cat: FAQCategoryId, language: Language): string {
  const found = FAQ_CATEGORIES.find((c) => c.id === cat);
  return found ? (language === 'bn' ? found.labelBn : found.labelEn) : '';
}
