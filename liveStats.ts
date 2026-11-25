import {
  Donation,
  FinancialRecord,
  GeneralMember,
  Language,
  Project,
  TeamMember,
  Volunteer,
  WomensTeamActivity,
  WomensTeamMember,
} from '../types';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function formatNumberForLang(num: number, language: Language): string {
  const safe = Number.isFinite(num) ? Math.max(0, Math.round(num)) : 0;
  const formatted = safe.toLocaleString('en-US');
  if (language === 'en') return formatted;
  return formatted.replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d);
}

export interface LiveFoundationStatsInput {
  projects?: Project[];
  womensTeamActivities?: WomensTeamActivity[];
  generalMembers?: GeneralMember[];
  volunteers?: Volunteer[];
  womensTeamMembers?: WomensTeamMember[];
  committeeMembers?: TeamMember[];
  donations?: Donation[];
  financialRecords?: FinancialRecord[];
}

export interface LiveFoundationStatCard {
  value: string;
  label: string;
  subtext: string;
}

export interface LiveFoundationStatsResult {
  beneficiaries: LiveFoundationStatCard;
  activeProjects: LiveFoundationStatCard;
  registeredTeam: LiveFoundationStatCard;
  transparency: LiveFoundationStatCard;
  raw: {
    totalBeneficiaries: number;
    activeProjectsCount: number;
    verifiedPersonnelCount: number;
    transparencyPercent: number;
  };
}

function getIdentityKey(person: {
  email?: string;
  phone?: string;
  nameEn?: string;
  nameBn?: string;
  fullName?: string;
}): string {
  const email = String(person.email || '').trim().toLowerCase();
  if (email) return `email:${email}`;
  const phone = String(person.phone || '').replace(/[^0-9]/g, '');
  if (phone.length >= 7) return `phone:${phone.slice(-10)}`;
  const nameEn = String(person.nameEn || person.fullName || '').trim().toLowerCase();
  if (nameEn) return `name:${nameEn}`;
  const nameBn = String(person.nameBn || '').trim();
  return `bn:${nameBn}`;
}

export function computeLiveFoundationStats(
  input: LiveFoundationStatsInput,
  language: Language
): LiveFoundationStatsResult {
  const projects = Array.isArray(input.projects) ? input.projects.filter(Boolean) : [];
  const womensActivities = Array.isArray(input.womensTeamActivities)
    ? input.womensTeamActivities.filter(Boolean)
    : [];
  const generalMembers = Array.isArray(input.generalMembers) ? input.generalMembers.filter(Boolean) : [];
  const volunteers = Array.isArray(input.volunteers) ? input.volunteers.filter(Boolean) : [];
  const womensMembers = Array.isArray(input.womensTeamMembers)
    ? input.womensTeamMembers.filter(Boolean)
    : [];
  const committeeMembers = Array.isArray(input.committeeMembers)
    ? input.committeeMembers.filter(Boolean)
    : [];
  const donations = Array.isArray(input.donations) ? input.donations.filter(Boolean) : [];
  const financialRecords = Array.isArray(input.financialRecords)
    ? input.financialRecords.filter(Boolean)
    : [];

  // 1. Verified Total Beneficiaries directly across Projects + Women's Wing Activities
  const projectBeneficiaries = projects.reduce(
    (sum, p) => sum + (Number(p.beneficiariesCount) > 0 ? Number(p.beneficiariesCount) : 0),
    0
  );
  const womensBeneficiaries = womensActivities.reduce(
    (sum, a) => sum + (Number(a.beneficiariesCount) > 0 ? Number(a.beneficiariesCount) : 0),
    0
  );
  const totalBeneficiaries = projectBeneficiaries + womensBeneficiaries;

  // 2. Active Humanitarian Initiatives (Active/Urgent Projects + Ongoing/Upcoming Women's Wing initiatives)
  const activeMainProjects = projects.filter(
    (p) => !p.status || p.status === 'active' || p.status === 'urgent'
  ).length;
  const activeWomensInitiatives = womensActivities.filter(
    (a) => a.status === 'ongoing' || a.status === 'upcoming'
  ).length;
  const activeProjectsCount = activeMainProjects + activeWomensInitiatives;

  // 3. Deduplicated Verified Members, Committee Officials & Active Volunteers
  const uniquePeople = new Set<string>();
  const activeMembers = generalMembers.filter(
    (m) => m.status === 'active' && m.approvalStatus !== 'rejected'
  );
  const activeVolunteers = volunteers.filter((v) => v.status === 'active');
  const activeWomens = womensMembers.filter((w) => w.status === 'active');

  activeMembers.forEach((m) => uniquePeople.add(getIdentityKey(m)));
  activeVolunteers.forEach((v) => uniquePeople.add(getIdentityKey(v)));
  activeWomens.forEach((w) => uniquePeople.add(getIdentityKey(w)));
  committeeMembers.forEach((c) => uniquePeople.add(getIdentityKey(c)));

  const verifiedPersonnelCount = uniquePeople.size;

  // 4. Verified Voucher & Donation Audit Ratio
  const voucherCount = financialRecords.filter(
    (r) => Boolean(r.voucherNumber && String(r.voucherNumber).trim())
  ).length;
  const verifiedDonationsCount = donations.filter((d) => Boolean(d.isVerified)).length;
  const totalChecks = financialRecords.length + donations.length;
  const verifiedChecks = voucherCount + verifiedDonationsCount;
  const transparencyPercent =
    totalChecks > 0 ? Math.round((verifiedChecks / totalChecks) * 100) : 100;

  return {
    beneficiaries: {
      value: formatNumberForLang(totalBeneficiaries, language),
      label: language === 'bn' ? 'যাচাইকৃত উপকারভোগী' : 'Verified Beneficiaries',
      subtext:
        language === 'bn'
          ? `${formatNumberForLang(projects.length, 'bn')}টি প্রকল্প ও ${formatNumberForLang(womensActivities.length, 'bn')}টি নারী উদ্যোগের হিসাব`
          : `Across ${projects.length} projects & ${womensActivities.length} women's programs`,
    },
    activeProjects: {
      value:
        language === 'bn'
          ? `${formatNumberForLang(activeProjectsCount, 'bn')}টি`
          : `${activeProjectsCount}`,
      label: language === 'bn' ? 'চলমান মানবিক প্রকল্প' : 'Active Humanitarian Programs',
      subtext:
        language === 'bn'
          ? `মূল প্রকল্প ${formatNumberForLang(activeMainProjects, 'bn')}টি · উইমেন্স উইং ${formatNumberForLang(activeWomensInitiatives, 'bn')}টি`
          : `${activeMainProjects} core projects · ${activeWomensInitiatives} Women's Wing`,
    },
    registeredTeam: {
      value:
        language === 'bn'
          ? `${formatNumberForLang(verifiedPersonnelCount, 'bn')} জন`
          : `${verifiedPersonnelCount}`,
      label: language === 'bn' ? 'যাচাইকৃত সদস্য ও কর্মী' : 'Verified Members & Volunteers',
      subtext:
        language === 'bn'
          ? `সদস্য ${formatNumberForLang(activeMembers.length, 'bn')} · স্বেচ্ছাসেবক ${formatNumberForLang(activeVolunteers.length, 'bn')} · নারী উইং ${formatNumberForLang(activeWomens.length, 'bn')}`
          : `${activeMembers.length} members · ${activeVolunteers.length} volunteers · ${activeWomens.length} women wing`,
    },
    transparency: {
      value: `${formatNumberForLang(transparencyPercent, language)}%`,
      label: language === 'bn' ? 'অর্থব্যয়ে স্বচ্ছতা ও অডিট' : 'Verified Ledger Transparency',
      subtext:
        language === 'bn'
          ? `${formatNumberForLang(voucherCount, 'bn')}টি ভাউচার ও ${formatNumberForLang(verifiedDonationsCount, 'bn')}টি অনুদান যাচাইকৃত`
          : `${voucherCount} vouchers & ${verifiedDonationsCount} donations verified`,
    },
    raw: {
      totalBeneficiaries,
      activeProjectsCount,
      verifiedPersonnelCount,
      transparencyPercent,
    },
  };
}
