import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
  X,
} from 'lucide-react';
import { Language, Project, SponsorshipProposal } from '../../types';
import { ALL_64_DISTRICTS } from '../../data/bangladeshBranches';

interface SponsorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  projects: Project[];
  initialProject?: Project | null;
  onSubmitSponsorship: (proposal: SponsorshipProposal) => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const SponsorshipModal: React.FC<SponsorshipModalProps> = ({
  isOpen,
  onClose,
  language,
  projects,
  initialProject,
  onSubmitSponsorship,
  onToast,
}) => {
  const [sponsorType, setSponsorType] = useState<'individual' | 'organization'>('individual');
  const [sponsorName, setSponsorName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('মৌলভীবাজার');
  const [targetProjectId, setTargetProjectId] = useState<string>(initialProject?.id || 'general');
  const [supportMode, setSupportMode] = useState<SponsorshipProposal['supportMode']>('financial');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [howToHelpBn, setHowToHelpBn] = useState('');
  const [submittedProposal, setSubmittedProposal] = useState<SponsorshipProposal | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTargetProjectId(initialProject?.id || 'general');
      setSubmittedProposal(null);
    }
  }, [isOpen, initialProject]);

  if (!isOpen) return null;

  const selectedProject = projects.find((p) => p.id === targetProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveName =
      sponsorType === 'organization' ? organizationName.trim() : sponsorName.trim();

    if (!effectiveName) {
      onToast(
        'error',
        language === 'bn'
          ? sponsorType === 'organization'
            ? 'প্রতিষ্ঠানের নাম লিখুন'
            : 'আপনার নাম লিখুন'
          : 'Please enter a name'
      );
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      onToast(
        'error',
        language === 'bn' ? 'সঠিক মোবাইল নম্বর দিন' : 'Please provide a valid phone number'
      );
      return;
    }

    if (!howToHelpBn.trim()) {
      onToast(
        'error',
        language === 'bn'
          ? 'কীভাবে স্পনসর বা সাহায্য করতে চান তা লিখুন'
          : 'Please describe how you would like to sponsor'
      );
      return;
    }

    const trackingId = `COLASH-SPN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toISOString().split('T')[0];

    const proposal: SponsorshipProposal = {
      id: `spn-${Date.now()}`,
      trackingId,
      sponsorType,
      sponsorName:
        sponsorType === 'organization'
          ? contactPerson.trim() || organizationName.trim()
          : sponsorName.trim(),
      organizationName: sponsorType === 'organization' ? organizationName.trim() : undefined,
      contactPerson: sponsorType === 'organization' ? contactPerson.trim() : undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      district: district.trim(),
      targetProjectId,
      targetProjectTitleBn:
        selectedProject?.titleBn || 'সার্বিক মানবিক তহবিল / যৌথ উদ্যোগ',
      targetProjectTitleEn:
        selectedProject?.titleEn || 'General Humanitarian Sponsorship',
      supportMode,
      estimatedAmount: estimatedAmount ? Number(estimatedAmount) : undefined,
      howToHelpBn: howToHelpBn.trim(),
      status: 'pending',
      createdAt: nowStr,
    };

    onSubmitSponsorship(proposal);
    setSubmittedProposal(proposal);
    onToast(
      'success',
      language === 'bn'
        ? 'স্পনসরশিপ প্রস্তাব সফলভাবে গৃহীত হয়েছে!'
        : 'Sponsorship Proposal Submitted!',
      `Tracking ID: ${trackingId}`
    );
  };

  const resetAndClose = () => {
    setSubmittedProposal(null);
    setSponsorName('');
    setOrganizationName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setEstimatedAmount('');
    setHowToHelpBn('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={resetAndClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#102B3F] text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#167D78] text-[#D6F36A] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                {language === 'bn'
                  ? 'ব্যক্তি বা প্রতিষ্ঠান স্পনসরশিপ আবেদন'
                  : 'Individual & Organizational Sponsorship'}
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                {language === 'bn'
                  ? 'যেকোনো প্রকল্প, মেডিকেল ক্যাম্প বা শিক্ষা বৃত্তিতে স্পনসর হিসেবে যুক্ত হোন'
                  : 'Sponsor a humanitarian project, scholarship batch, or relief event'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {submittedProposal ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-[#0B2236] dark:text-white">
                  {language === 'bn'
                    ? 'আপনার স্পনসরশিপ প্রস্তাব গৃহীত হয়েছে!'
                    : 'Your Sponsorship Proposal Is Received!'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                  {language === 'bn'
                    ? 'আমাদের সমন্বয়ক টিম দ্রুত আপনার সাথে যোগাযোগ করবেন। অনুমোদিত হলে আপনার বা প্রতিষ্ঠানের অবদান ওয়েবসাইটে প্রকাশিত হবে।'
                    : 'Our coordination team will reach out shortly. Once verified, your contribution will be featured on the project attribution ledger.'}
                </p>
              </div>
              <div className="inline-block px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-xs font-bold text-[#167D78] dark:text-[#D6F36A]">
                Tracking ID: {submittedProposal.trackingId}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-[#102B3F] hover:bg-[#167D78] text-white text-xs font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'সম্পন্ন করুন' : 'Done'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Sponsor Type Toggle */}
              <div>
                <label className="font-bold text-[#0B2236] dark:text-stone-200 block mb-2">
                  {language === 'bn' ? 'স্পনসরের ধরন নির্বাচন করুন' : 'Select Sponsor Type'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSponsorType('individual')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      sponsorType === 'individual'
                        ? 'bg-[#167D78]/10 border-[#167D78] text-[#0B2236] dark:text-white font-bold'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#167D78] shrink-0" />
                    <div>
                      <div className="font-bold">
                        {language === 'bn' ? 'ব্যক্তিগত স্পনসর' : 'Individual Sponsor'}
                      </div>
                      <div className="text-[10px] opacity-75">
                        {language === 'bn' ? 'ব্যক্তিগত বা পারিবারিক উদ্যোগে' : 'Personal or family sponsorship'}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSponsorType('organization')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      sponsorType === 'organization'
                        ? 'bg-[#167D78]/10 border-[#167D78] text-[#0B2236] dark:text-white font-bold'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold">
                        {language === 'bn' ? 'প্রতিষ্ঠান / সংস্থা' : 'Organization / CSR'}
                      </div>
                      <div className="text-[10px] opacity-75">
                        {language === 'bn' ? 'কোম্পানি, ব্যবসা বা সামাজিক ক্লাব' : 'Company, business or club'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {sponsorType === 'organization' ? (
                  <>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {language === 'bn' ? 'প্রতিষ্ঠান বা সংস্থার নাম *' : 'Organization Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: আল-আরাফাহ ট্রেডার্স / ক্লাব' : 'e.g. Acme Ltd.'}
                        className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        {language === 'bn' ? 'প্রতিনিধির নাম (যোগাযোগের জন্য)' : 'Contact Person Name'}
                      </label>
                      <input
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder={language === 'bn' ? 'প্রতিনিধির পূর্ণ নাম' : 'Representative name'}
                        className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-2">
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={sponsorName}
                      onChange={(e) => setSponsorName(e.target.value)}
                      placeholder={language === 'bn' ? 'স্পনসরের পূর্ণ নাম লিখুন' : 'Enter your full name'}
                      className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#167D78]" />
                      {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                    </span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#167D78]" />
                      {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sponsor@example.com"
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E6A15B]" />
                      {language === 'bn' ? 'জেলা / অবস্থান' : 'District'}
                    </span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    {ALL_64_DISTRICTS.map((d) => (
                      <option key={d.bn} value={d.bn}>
                        {language === 'bn' ? d.bn : d.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {language === 'bn' ? 'কোন প্রকল্পে স্পনসর করতে চান' : 'Target Project'}
                  </label>
                  <select
                    value={targetProjectId}
                    onChange={(e) => setTargetProjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-semibold"
                  >
                    <option value="general">
                      {language === 'bn'
                        ? 'সার্বিক মানবিক তহবিল / যৌথ কর্মসূচি'
                        : 'General Humanitarian Fund / Events'}
                    </option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {language === 'bn' ? p.titleBn : p.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {language === 'bn' ? 'স্পনসরশিপের মাধ্যম' : 'Sponsorship Mode'}
                  </label>
                  <select
                    value={supportMode}
                    onChange={(e) =>
                      setSupportMode(e.target.value as SponsorshipProposal['supportMode'])
                    }
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="financial">
                      {language === 'bn' ? 'আর্থিক স্পনসরশিপ' : 'Financial Sponsorship'}
                    </option>
                    <option value="materials">
                      {language === 'bn' ? 'ত্রাণ / শিক্ষা উপকরণ প্রদান' : 'Relief or Education Materials'}
                    </option>
                    <option value="medical_service">
                      {language === 'bn' ? 'মেডিকেল ক্যাম্প ও ওষুধ সহায়তা' : 'Medical Camp & Medicine'}
                    </option>
                    <option value="event_partner">
                      {language === 'bn' ? 'ইভেন্ট বা কর্মসূচি পার্টনার' : 'Event / Program Partner'}
                    </option>
                    <option value="mixed">
                      {language === 'bn' ? 'আর্থিক ও উপকরণ যৌথ সহায়তা' : 'Combined Financial & Material'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {language === 'bn' ? 'সম্ভাব্য বাজেট / পরিমাণ (৳, ঐচ্ছিক)' : 'Estimated Amount (BDT, Optional)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={estimatedAmount}
                    onChange={(e) => setEstimatedAmount(e.target.value)}
                    placeholder="যেমন: 10000"
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {language === 'bn'
                    ? 'কীভাবে এবং কী খাতে সাহায্য করতে চান *'
                    : 'How Would You Like to Help? *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={howToHelpBn}
                  onChange={(e) => setHowToHelpBn(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'যেমন: ৫০ জন শিক্ষার্থীর খাতা-কলম স্পনসর করতে চাই অথবা বন্যার্ত পরিবারের খাদ্য প্যাক স্পনসর করতে চাই...'
                      : 'Describe what items, funds, or services you or your organization wish to sponsor...'
                  }
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#167D78] hover:bg-[#102B3F] text-white font-bold transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {language === 'bn' ? 'স্পনসরশিপ প্রস্তাব পাঠান' : 'Submit Sponsorship Proposal'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
