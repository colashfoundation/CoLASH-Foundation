/**
 * CSV / Excel Export Utilities with UTF-8 BOM for proper Bengali text rendering
 */

import { GeneralMember, DonationRecord, Volunteer } from '../types';

export const downloadCSV = (filename: string, csvContent: string) => {
  // UTF-8 BOM (\uFEFF) ensures Excel properly decodes Unicode / Bengali characters
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportMembersToCSV = (members: GeneralMember[]) => {
  const headers = ['Serial', 'ID', 'Name (Bengali)', 'Name (English)', 'Blood Group', 'District', 'Role (Bengali)', 'Role (English)', 'Joined Date', 'Joining Year', 'Date of Birth'];
  const rows = members.map((m, idx) => [
    m.slNo || idx + 1,
    `"${m.membershipId || ''}"`,
    `"${(m.nameBn || '').replace(/"/g, '""')}"`,
    `"${(m.nameEn || '').replace(/"/g, '""')}"`,
    `"${m.bloodGroup || ''}"`,
    `"${(m.district || '').replace(/"/g, '""')}"`,
    `"${(m.roleBn || '').replace(/"/g, '""')}"`,
    `"${(m.roleEn || '').replace(/"/g, '""')}"`,
    `"${m.joinedDate || ''}"`,
    `"${m.joiningYear || ''}"`,
    `"${m.dateOfBirth || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`colash-members-${dateStr}.csv`, csvContent);
};

export const exportBloodDonorsToCSV = (members: GeneralMember[], filterGroup?: string) => {
  const filtered = filterGroup && filterGroup !== 'all'
    ? members.filter(m => m.bloodGroup === filterGroup)
    : members;

  const headers = ['SL', 'Member ID', 'Name', 'Blood Group', 'District', 'Emergency Contact / Role', 'Joined'];
  const rows = filtered.map((m, idx) => [
    idx + 1,
    `"${m.membershipId}"`,
    `"${m.nameBn} (${m.nameEn})"`,
    `"${m.bloodGroup}"`,
    `"${m.district}"`,
    `"${m.roleBn}"`,
    `"${m.joinedDate}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`colash-blood-donors-${dateStr}.csv`, csvContent);
};

export const exportDonationsToCSV = (donations: DonationRecord[]) => {
  const headers = ['SL', 'Receipt ID', 'Donor Name', 'Amount (BDT)', 'Payment Method', 'Transaction ID / Phone', 'Date', 'Purpose', 'Status'];
  const rows = donations.map((d, idx) => [
    idx + 1,
    `"${d.id}"`,
    `"${d.donorName}"`,
    d.amount,
    `"${d.method}"`,
    `"${d.phoneOrTrx || ''}"`,
    `"${d.date}"`,
    `"${d.purpose || 'সাধারণ তহবিল'}"`,
    `"${d.status}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`colash-donations-${dateStr}.csv`, csvContent);
};

export const exportAuditReport20252026 = () => {
  const content = `========================================================================================
                     কোলাশ ফাউন্ডেশন (CoLASH FOUNDATION)
                 COMMUNITY LEADERS AND SOCIAL HELPERS (CoLASH)
         অরাজনৈতিক, অসাম্প্রদায়িক ও অলাভজনক মানবিক সমাজকল্যাণ সংস্থা | বাংলাদেশ
  কেন্দ্রীয় সচিবালয়: কমলগঞ্জ, মৌলভীবাজার ও সিলেট বিভাগ | হটলাইন: 01646-475348 | ইমেইল: ashraful46475348@gmail.com
========================================================================================

বিষয়: ২০২৫-২০২৬ অর্থবছরের অভ্যন্তরীণ আয়-ব্যয় ও বার্ষিক আর্থিক বিবরণী প্রকাশ
অর্থবছর: ২০২৫ - ২০২৬ (০১ জুলাই ২০২৫ – ৩০ জুন ২০২৬)
প্রকাশের তারিখ: ১২ এপ্রিল ২০২৬
নথি সূত্র: CLSH-FIN-2026
প্রস্তুতকারী: কোলাশ ফাউন্ডেশন অভ্যন্তরীণ অর্থ সচিবালয় (বাহ্যিক সিএ অডিট এখনো সম্পন্ন হয়নি)

----------------------------------------------------------------------------------------
১. নির্বাহী সারসংক্ষেপ ও নোট (Executive Summary & Note):
------------------------------------------------------------------------
কোলাশ ফাউন্ডেশনের পরিচালনা পর্ষদ ও অর্থ সচিবালয়ের অভ্যন্তরীণ হিসাবের আলোকে ২০২৫-২০২৬ অর্থবছরের 
সকল প্রাপ্ত অনুদান, বিকাশ ও নগদ চ্যানেল এবং মাঠপর্যায়ে ব্যয়িত অর্থের বিবরণী স্বচ্ছতার স্বার্থে 
সর্বসাধারণের পর্যবেক্ষণের জন্য উন্মুক্ত করা হয়েছে। এখনো কোনো বাহ্যিক চার্টার্ড অ্যাকাউন্ট্যান্ট (CA) 
ফার্মের মাধ্যমে আনুষ্ঠানিক অডিট সম্পন্ন করা হয়নি।

----------------------------------------------------------------------------------------
২. ২০২৫-২০২৬ অর্থবছরের আয় ও তহবিলের সারসংক্ষেপ (Receipts & Inflow):
------------------------------------------------------------------------
ক্রমিক   তহবিল ও আয়ের খাত                                       পরিমাণ (টাকা)
----------------------------------------------------------------------------------------
০১.     যাকাত, ফিতরা ও সদকা তহবিল (দারিদ্র্য বিমোচন ও পুনর্বাসন)     ৳ ১৮,৫০,০০০/-
০২.     সাধারণ অনুদান ও প্রবাসী শুভানুধ্যায়ীদের অর্থায়ন          ৳ ১৫,৩০,০০০/-
০৩.     জরুরি দুর্যোগ ও হাওর-বন্যা ত্রাণ বিশেষ আপদকালীন তহবিল       ৳ ৬,৮০,০০০/-
০৪.     সদস্যদের কল্যাণ চাঁদা ও বার্ষিক মানবিক অনুদান            ৳ ২,২৫,০০০/-
----------------------------------------------------------------------------------------
সর্বমোট প্রাপ্ত অনুদান ও জমা (Total Income):                     ৳ ৪২,৮৫,০০০/-
----------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------
৩. ২০২৫-২০২৬ অর্থবছরের খাতভিত্তিক মাঠপর্যায়ের ব্যয় (Field Disbursements):
------------------------------------------------------------------------
ক্রমিক   কার্যক্রম ও মাঠপর্যায়ের ব্যয় খাত                         পরিমাণ (টাকা)   শতকরা হার
----------------------------------------------------------------------------------------
০১.     ফেনী, নোয়াখালী ও সিলেট বন্যা পুনর্বাসন ও গৃহ নির্মাণ     ৳ ১৩,৪০,০০০/-     ৩১.৩%
০২.     অসহায় বিধবা ও মায়েদের সেলাই মেশিন প্রদান ও প্রশিক্ষণ      ৳ ৬,২০,০০০/-     ১৪.৫%
০৩.     বেকার যুব ও পুরুষদের কর্মসংস্থান (ভ্যান, রিকশা ও পুঁজি)    ৳ ৫,৭৫,০০০/-     ১৩.৪%
০৪.     মেধাবী অসচ্ছল ছাত্রছাত্রীদের শিক্ষা বৃত্তি ও উপকরণ        ৳ ৫,৩০,০০০/-     ১২.৪%
০৫.     জরুরি মুমূর্ষু রোগীর চিকিৎসা ও ফ্রি ব্লাড নেটওয়ার্ক         ৳ ৪,৫০,০০০/-     ১০.৫%
০৬.     দাপ্তরিক পরিচালনা, ডেটাবেজ ও প্রশাসনিক খরচ                ৳ ৩,০০,০০০/-      ৭.০%
----------------------------------------------------------------------------------------
সর্বমোট মাঠপর্যায়ের মানবিক ব্যয় ও বিতরণ:                        ৳ ৩৮,১৫,০০০/-     ৮৯.০%
----------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------
৪. সমাপনী ব্যালেন্স ও আপদকালীন রিজার্ভ তহবিল (Surplus & Reserve Fund):
------------------------------------------------------------------------
মোট অনুদান প্রাপ্তি:                                           ৳ ৪২,৮৫,০০০/-
বাদ: মাঠপর্যায়ে প্রত্যক্ষ মানবিক সেবা ও কার্যক্রম ব্যয়:          ৳ ৩৮,১৫,০০০/-
----------------------------------------------------------------------------------------
পরবর্তী অর্থবছরের জরুরি হাওর বন্যা ও আপদকালীন রিজার্ভ তহবিল:      ৳ ৪,৭০,০০০/-
----------------------------------------------------------------------------------------

৫. অভ্যন্তরীণ স্বচ্ছতা মন্তব্য:
"ফাউন্ডেশনের এই হিসাব বিবরণী অর্থ সচিবালয়ের অভ্যন্তরীণ নথি ও লেনদেনের তথ্যের ভিত্তিতে প্রকাশিত 
হয়েছে। এখনো কোনো বাহ্যিক চার্টার্ড অ্যাকাউন্ট্যান্ট ফার্মের মাধ্যমে আনুষ্ঠানিক অডিট করানো হয়নি।"

স্বাক্ষর ও সংকলন:
১. মোঃ আশরাফুল ইসলাম সুলতান (Md. Ashraful Islam Sultan) — প্রতিষ্ঠাতা, কোলাশ ফাউন্ডেশন
২. অর্থ ও হিসাবরক্ষণ সচিব — কার্যনির্বাহী পরিষদ, কোলাশ ফাউন্ডেশন

========================================================================================
নথি রেফারেন্স: CLSH-FIN-2026
অনলাইন স্বচ্ছতা পোর্টাল: https://colashfoundation.org/#transparency
========================================================================================
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'CoLASH-Audit-Report-2025-2026.txt');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
