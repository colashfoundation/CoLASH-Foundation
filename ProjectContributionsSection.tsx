import React, { useMemo, useState } from 'react';
import {
  Building2,
  Droplets,
  HandHeart,
  Heart,
  HeartPulse,
  PackageCheck,
  ShieldCheck,
  UserCheck,
  Users,
  ArrowRight,
} from 'lucide-react';
import {
  ContributionHelpType,
  Donation,
  Language,
  Project,
  ProjectContribution,
  SponsorshipProposal,
} from '../types';

interface ProjectContributionsSectionProps {
  language: Language;
  projects: Project[];
  donations: Donation[];
  sponsorships: SponsorshipProposal[];
  onOpenSponsorship: (project?: Project | null) => void;
  onOpenBloodDonorModal: () => void;
  onOpenDonate: (project?: Project | null) => void;
}

const HELP_TYPE_META: Record<
  ContributionHelpType,
  {
    labelBn: string;
    labelEn: string;
    textAccentClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  financial: {
    labelBn: 'আর্থিক অনুদান',
    labelEn: 'Financial Aid',
    textAccentClass: 'text-emerald-700 dark:text-emerald-300',
    icon: Heart,
  },
  sponsorship: {
    labelBn: 'স্পনসরশিপ',
    labelEn: 'Sponsorship',
    textAccentClass: 'text-amber-700 dark:text-amber-300',
    icon: Building2,
  },
  field_work: {
    labelBn: 'মাঠপর্যায়ের শ্রম ও সমন্বয়',
    labelEn: 'Field Coordination',
    textAccentClass: 'text-[#167D78] dark:text-[#D6F36A]',
    icon: Users,
  },
  materials: {
    labelBn: 'ত্রাণ ও উপকরণ সহায়তা',
    labelEn: 'Materials & Kits',
    textAccentClass: 'text-sky-700 dark:text-sky-300',
    icon: PackageCheck,
  },
  medical: {
    labelBn: 'চিকিৎসা ও স্বাস্থ্যসেবা',
    labelEn: 'Medical Aid',
    textAccentClass: 'text-indigo-700 dark:text-indigo-300',
    icon: HeartPulse,
  },
  blood_support: {
    labelBn: 'রক্তদান ও জরুরি সমন্বয়',
    labelEn: 'Blood Support',
    textAccentClass: 'text-rose-700 dark:text-rose-300',
    icon: Droplets,
  },
};

export const ProjectContributionsSection: React.FC<ProjectContributionsSectionProps> = ({
  language,
  projects,
  donations,
  sponsorships,
  onOpenSponsorship,
  onOpenBloodDonorModal,
  onOpenDonate,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedHelpType, setSelectedHelpType] = useState<'all' | ContributionHelpType>('all');
  const [showAllEntries, setShowAllEntries] = useState(false);

  const allContributions = useMemo<ProjectContribution[]>(() => {
    const entries: ProjectContribution[] = [];

    projects.forEach((proj) => {
      if (Array.isArray(proj.contributions)) {
        proj.contributions.forEach((c) => {
          entries.push({
            ...c,
            projectId: c.projectId || proj.id,
            projectTitleBn: c.projectTitleBn || proj.titleBn,
            projectTitleEn: c.projectTitleEn || proj.titleEn,
          });
        });
      }
    });

    sponsorships
      .filter((s) => s.status === 'approved' || s.status === 'completed')
      .forEach((sp) => {
        const matchedProj = projects.find((p) => p.id === sp.targetProjectId);
        entries.push({
          id: `sp-${sp.id}`,
          contributorName:
            sp.sponsorType === 'organization' && sp.organizationName
              ? sp.organizationName
              : sp.sponsorName,
          contributorType: sp.sponsorType,
          organizationName: sp.organizationName,
          projectId: sp.targetProjectId || 'general',
          projectTitleBn: matchedProj?.titleBn || sp.targetProjectTitleBn || 'সার্বিক মানবিক তহবিল',
          projectTitleEn: matchedProj?.titleEn || sp.targetProjectTitleEn || 'General Humanitarian Fund',
          helpType: 'sponsorship',
          howHelpedBn:
            sp.howToHelpBn ||
            `${sp.sponsorType === 'organization' ? 'প্রাতিষ্ঠানিক' : 'ব্যক্তিগত'} স্পনসরশিপের মাধ্যমে সহায়তা প্রদান`,
          howHelpedEn:
            sp.howToHelpBn ||
            `Supported via ${sp.sponsorType === 'organization' ? 'organizational' : 'individual'} sponsorship`,
          amount: sp.estimatedAmount,
          date: (sp.createdAt || '').split(' ')[0] || '2026',
          source: 'sponsorship',
        });
      });

    donations.forEach((don) => {
      const matchedProj = projects.find(
        (p) => p.id === don.purpose || p.titleBn === don.purposeNameBn
      );
      entries.push({
        id: `don-${don.id}`,
        contributorName: don.isAnonymous
          ? language === 'bn'
            ? 'নাম প্রকাশে অনিচ্ছুক দাতা'
            : 'Anonymous Well-Wisher'
          : don.donorName,
        contributorType: 'individual',
        projectId: matchedProj?.id || don.purpose || 'general',
        projectTitleBn:
          matchedProj?.titleBn || don.purposeNameBn || 'সাধারণ মানবিক তহবিল',
        projectTitleEn:
          matchedProj?.titleEn || don.purposeNameEn || 'General Relief Fund',
        helpType: 'financial',
        howHelpedBn:
          don.notes?.trim() ||
          `৳${Number(don.amount || 0).toLocaleString('en-IN')} আর্থিক অনুদানের মাধ্যমে প্রকল্পের মাঠপর্যায়ের কাজে সরাসরি সহায়তা`,
        howHelpedEn:
          don.notes?.trim() ||
          `Contributed ৳${Number(don.amount || 0).toLocaleString('en-IN')} directly toward field operations`,
        amount: don.amount,
        date: don.date || '2026',
        source: 'donation',
        isAnonymous: don.isAnonymous,
      });
    });

    projects.forEach((proj) => {
      if (proj.proposedBy) {
        const proposerName =
          typeof proj.proposedBy === 'string'
            ? proj.proposedBy
            : `${proj.proposedBy.nameBn || proj.proposedBy.nameEn || 'সমন্বয়ক'}${
                proj.proposedBy.designationBn ? ` (${proj.proposedBy.designationBn})` : ''
              }`;
        entries.push({
          id: `prop-${proj.id}`,
          contributorName: proposerName,
          contributorType: 'member',
          projectId: proj.id,
          projectTitleBn: proj.titleBn,
          projectTitleEn: proj.titleEn,
          helpType: 'field_work',
          howHelpedBn:
            proj.impactUpdates?.[0]?.textBn ||
            `${proj.locationBn} অঞ্চলে প্রকল্প পরিকল্পনা ও মাঠপর্যায়ের কার্যক্রম সমন্বয়`,
          howHelpedEn:
            proj.impactUpdates?.[0]?.textEn ||
            `Initiated and coordinated ground operations in ${proj.locationEn}`,
          date:
            (typeof proj.proposedBy === 'object' && proj.proposedBy.date) ||
            proj.impactUpdates?.[0]?.date ||
            '2026-03-07',
          source: 'field',
        });
      }
    });

    return entries.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [projects, donations, sponsorships, language]);

  const filteredEntries = useMemo(() => {
    return allContributions.filter((item) => {
      const matchesProject =
        selectedProjectId === 'all' || item.projectId === selectedProjectId;
      const matchesHelp =
        selectedHelpType === 'all' || item.helpType === selectedHelpType;
      return matchesProject && matchesHelp;
    });
  }, [allContributions, selectedProjectId, selectedHelpType]);

  const visibleLimit = showAllEntries ? 12 : 6;
  const visibleEntries = filteredEntries.slice(0, visibleLimit);

  return (
    <section
      id="project-contributions"
      className="py-14 sm:py-20 bg-white/55 dark:bg-[#091620]/55 border-y border-stone-200/70 dark:border-stone-800/70 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Clean Editorial Header + Compact Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-stone-200/80 dark:border-stone-800 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#167D78] dark:text-[#D6F36A]">
              <HandHeart className="w-3.5 h-3.5" />
              <span>
                {language === 'bn'
                  ? 'স্বচ্ছ প্রকল্প অবদান ও অংশীদারিত্ব'
                  : 'Transparent Project Attribution'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl stylish-title text-balance">
              {language === 'bn'
                ? 'কে কোন প্রকল্পে কীভাবে সাহায্য করেছেন'
                : 'Who Helped Which Project & How'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              aria-label={language === 'bn' ? 'প্রকল্প ফিল্টার করুন' : 'Filter by project'}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-700 text-[#102B3F] dark:text-stone-200 focus:outline-none focus:border-[#167D78] cursor-pointer max-w-[220px]"
            >
              <option value="all">{language === 'bn' ? 'সকল প্রকল্প' : 'All Projects'}</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {language === 'bn' ? proj.titleBn : proj.titleEn}
                </option>
              ))}
            </select>

            <select
              value={selectedHelpType}
              onChange={(e) => setSelectedHelpType(e.target.value as 'all' | ContributionHelpType)}
              aria-label={language === 'bn' ? 'সহায়তার ধরন ফিল্টার করুন' : 'Filter by help type'}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0c1a24] border border-stone-200 dark:border-stone-700 text-[#102B3F] dark:text-stone-200 focus:outline-none focus:border-[#167D78] cursor-pointer"
            >
              <option value="all">{language === 'bn' ? 'সব ধরনের সহায়তা' : 'All Help Types'}</option>
              {(Object.keys(HELP_TYPE_META) as ContributionHelpType[]).map((typeKey) => (
                <option key={typeKey} value={typeKey}>
                  {language === 'bn' ? HELP_TYPE_META[typeKey].labelBn : HELP_TYPE_META[typeKey].labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Minimalist Attribution Grid (No nested boxes) */}
        {visibleEntries.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleEntries.map((entry) => {
                const meta = HELP_TYPE_META[entry.helpType] || HELP_TYPE_META.financial;
                const HelpIcon = meta.icon;
                return (
                  <article
                    key={entry.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between gap-4 hover:border-[#167D78]/60 transition-colors"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider ${meta.textAccentClass}`}>
                          <HelpIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{language === 'bn' ? meta.labelBn : meta.labelEn}</span>
                        </span>
                        <span className="font-mono text-stone-400 tabular-nums shrink-0">
                          {entry.date}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-[#0B2236] dark:text-white leading-snug">
                          {entry.contributorType === 'organization' ? (
                            <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-[#167D78] shrink-0" />
                          )}
                          <span className="truncate">{entry.contributorName}</span>
                        </div>
                        <div className="text-xs font-semibold text-[#167D78] dark:text-[#D6F36A] mt-0.5 truncate">
                          {language === 'bn' ? entry.projectTitleBn : entry.projectTitleEn}
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                        {language === 'bn' ? entry.howHelpedBn : entry.howHelpedEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                      {entry.amount && entry.amount > 0 ? (
                        <span className="font-mono font-extrabold text-[#0B2236] dark:text-white tabular-nums">
                          ৳{Number(entry.amount).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#167D78]" />
                          {language === 'bn' ? 'যাচাইকৃত অবদান' : 'Verified'}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const proj = projects.find((p) => p.id === entry.projectId) || null;
                          onOpenDonate(proj);
                        }}
                        className="text-xs font-bold text-[#167D78] dark:text-[#D6F36A] hover:underline cursor-pointer"
                      >
                        {language === 'bn' ? 'যুক্ত হোন →' : 'Support →'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredEntries.length > 6 && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllEntries((prev) => !prev)}
                  className="px-5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#0c1a24] hover:border-[#167D78] text-xs font-bold text-[#102B3F] dark:text-stone-200 transition-colors cursor-pointer"
                >
                  {showAllEntries
                    ? language === 'bn'
                      ? 'সংক্ষিপ্ত দেখুন'
                      : 'Show Fewer'
                    : language === 'bn'
                    ? `আরও অবদান দেখুন (${filteredEntries.length - 6}+)`
                    : `View More Contributions (${filteredEntries.length - 6}+)`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white dark:bg-[#0c1a24] border border-dashed border-stone-300 dark:border-stone-700 text-center space-y-3">
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              {language === 'bn'
                ? 'এই ফিল্টার অনুযায়ী এখনো কোনো অবদানের তথ্য নেই।'
                : 'No contribution records match this filter yet.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedProjectId('all');
                setSelectedHelpType('all');
              }}
              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold cursor-pointer"
            >
              {language === 'bn' ? 'সব দেখুন' : 'Show All'}
            </button>
          </div>
        )}

        {/* Unified Calm Architectural Callout Strip: Sponsorship + Non-Member Blood Donor */}
        <div className="rounded-2xl bg-[#102B3F] text-white grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/15 overflow-hidden">
          <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D6F36A]">
                {language === 'bn' ? 'ব্যক্তিগত ও প্রাতিষ্ঠানিক স্পনসরশিপ' : 'Project Sponsorship'}
              </div>
              <h3 className="text-base font-extrabold text-white">
                {language === 'bn'
                  ? 'কোনো প্রকল্প স্পনসর করতে চান?'
                  : 'Sponsor a Humanitarian Project'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {language === 'bn'
                  ? 'ব্যক্তি বা প্রতিষ্ঠান হিসেবে শিক্ষাবৃত্তি, চিকিৎসা বা ত্রাণ প্রকল্পে যুক্ত হোন।'
                  : 'Partner as an individual or institution on scholarships, health camps & relief.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenSponsorship(null)}
              className="px-4 py-2.5 rounded-xl bg-[#D6F36A] hover:bg-white text-[#0B2236] font-extrabold text-xs shrink-0 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'স্পনসর দিন' : 'Sponsor'}</span>
            </button>
          </div>

          <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-rose-300">
                {language === 'bn' ? 'সদস্যপদ ছাড়াই রক্তদান' : 'Voluntary Blood Network'}
              </div>
              <h3 className="text-base font-extrabold text-white">
                {language === 'bn'
                  ? 'সংগঠনের সদস্য না হয়েই রক্তদাতা হোন'
                  : 'Donate Blood Without Joining'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {language === 'bn'
                  ? 'মাত্র ১ মিনিটে রক্তের গ্রুপ ও জেলা যুক্ত করুন — জরুরি মুহূর্তে প্রাণ বাঁচাতে।'
                  : 'List only your blood group & district — no membership required.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenBloodDonorModal}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shrink-0 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রক্তদাতা হোন' : 'Donate Blood'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
