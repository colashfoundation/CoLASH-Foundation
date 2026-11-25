import React, { useMemo, useState } from 'react';
import { Droplets, Phone, MessageSquare, MapPin, Search, X, Check, AlertCircle, Share2, UserPlus } from 'lucide-react';
import { GeneralMember, Language, PublicBloodDonor } from '../../types';

interface UrgentBloodModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: GeneralMember[];
  publicBloodDonors?: PublicBloodDonor[];
  onOpenBloodDonorModal?: () => void;
  language: Language;
}

export const UrgentBloodModal: React.FC<UrgentBloodModalProps> = ({
  isOpen,
  onClose,
  members,
  publicBloodDonors = [],
  onOpenBloodDonorModal,
  language
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const unifiedDonors = useMemo(() => {
    const publicList = publicBloodDonors
      .filter((d) => d.availabilityStatus !== 'unavailable')
      .map((d) => ({
        id: d.id,
        nameBn: d.fullName,
        nameEn: d.fullName,
        bloodGroup: d.bloodGroup,
        district: d.district,
        area: d.upazilaOrArea,
        badgeText: language === 'bn' ? 'অ-সদস্য রক্তদাতা' : 'Voluntary Donor',
        subtitle: d.upazilaOrArea ? `${d.upazilaOrArea}, ${d.district}` : language === 'bn' ? 'স্বেচ্ছায় রক্তদাতা (সদস্য নন)' : 'Voluntary Non-Member Donor',
        phone: d.consentPublicListing && d.phone ? d.phone : '01646-475348',
        avatar: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=200&auto=format&fit=crop&q=80',
        isNonMember: true,
      }));

    const memberList = members.map((m) => ({
      id: m.id,
      nameBn: m.nameBn,
      nameEn: m.nameEn,
      bloodGroup: m.bloodGroup,
      district: m.district,
      area: undefined,
      badgeText: m.membershipId,
      subtitle: language === 'bn' ? m.roleBn : m.roleEn,
      phone: '01646-475348',
      avatar: m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      isNonMember: false,
    }));

    return [...publicList, ...memberList];
  }, [members, publicBloodDonors, language]);

  if (!isOpen) return null;

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const districts = Array.from(new Set(unifiedDonors.map(m => m.district).filter(Boolean)));

  const filteredDonors = unifiedDonors.filter(m => {
    const matchesGroup = selectedGroup === 'all' || m.bloodGroup === selectedGroup;
    const matchesDistrict = selectedDistrict === 'all' || m.district === selectedDistrict;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      m.nameBn.toLowerCase().includes(q) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.district.toLowerCase().includes(q) ||
      (m.area && m.area.toLowerCase().includes(q));
    return matchesGroup && matchesDistrict && matchesSearch;
  });

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-[#0c1a24] sm:bg-black/75 sm:backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="min-h-screen sm:min-h-0 sm:my-6 sm:mx-auto sm:max-w-4xl w-full bg-white dark:bg-[#0c1a24] sm:rounded-3xl sm:border sm:border-stone-200 dark:sm:border-stone-800 sm:shadow-2xl overflow-hidden">
        
        {/* Slim Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-rose-600 via-rose-700 to-[#102B3F] px-4 py-3.5 sm:p-5 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <Droplets className="w-5 h-5 text-rose-200 fill-rose-200" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-lg truncate">
                {language === 'bn' ? 'জরুরি রক্তদাতা ডিরেক্টরি (২৪/৭)' : 'Emergency Blood Donor Network (24/7)'}
              </h3>
              <p className="text-[11px] sm:text-xs text-rose-100 truncate">
                {language === 'bn' ? 'সদস্য ও অ-সদস্য স্বেচ্ছায় রক্তদাতাদের সমন্বিত নেটওয়ার্ক' : 'CoLASH Members & Voluntary Non-Member Blood Donors'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenBloodDonorModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBloodDonorModal();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D6F36A] hover:bg-white text-[#102B3F] text-xs font-bold transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {language === 'bn' ? 'সদস্য না হয়েই রক্তদাতা হোন' : 'Register Blood Donor'}
                </span>
                <span className="sm:hidden">{language === 'bn' ? 'যুক্ত হোন' : 'Join'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'বন্ধ করুন' : 'Close'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 sm:p-6 bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 space-y-3">
          {/* Blood Group Chips */}
          <div>
            <label className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block mb-1.5">
              {language === 'bn' ? 'রক্তের গ্রুপ নির্বাচন করুন:' : 'Select Blood Group:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedGroup('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedGroup === 'all'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-rose-400'
                }`}
              >
                {language === 'bn' ? 'সকল গ্রুপ' : 'All Groups'}
              </button>
              {bloodGroups.map(bg => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedGroup === bg
                      ? 'bg-rose-600 text-white shadow-xs scale-105'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-rose-400'
                  }`}
                >
                  <Droplets className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span>{bg}</span>
                </button>
              ))}
            </div>
          </div>

          {/* District Dropdown and Search */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="sm:w-1/2">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-800 dark:text-stone-200 focus:outline-hidden focus:border-rose-500 cursor-pointer"
              >
                <option value="all">{language === 'bn' ? 'সকল জেলা' : 'All Districts'}</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'নাম, এলাকা বা জেলা দিয়ে খুঁজুন...' : 'Search donor name, area or district...'}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Donors List */}
        <div className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span>
              {language === 'bn'
                ? `উপলব্ধ রক্তদাতা: ${filteredDonors.length} জন`
                : `Available Donors: ${filteredDonors.length}`}
            </span>
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'জরুরি প্রয়োজনে সরাসরি কল করুন' : 'Direct calling enabled'}</span>
            </span>
          </div>

          {filteredDonors.length === 0 ? (
            <div className="text-center py-12 text-stone-400 space-y-2">
              <Droplets className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-sm font-semibold">
                {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো রক্তদাতা পাওয়া যায়নি।' : 'No blood donors found for this criteria.'}
              </p>
              <p className="text-xs">
                {language === 'bn' ? 'অন্য গ্রুপ বা জেলা নির্বাচন করে অনুসন্ধান করুন।' : 'Try selecting a different blood group or district.'}
              </p>
            </div>
          ) : (
            filteredDonors.map((donor) => {
              const donorPhone = donor.phone;
              const cleanPhone = donorPhone.replace(/[^0-9]/g, '');
              const waLink = `https://wa.me/88${cleanPhone}?text=${encodeURIComponent(`আসসালামু আলাইকুম। কোলাশ ফাউন্ডেশন ব্লাড ডিরেক্টরি থেকে জরুরি প্রয়োজনে যোগাযোগ করছি। রোগীর রক্তের গ্রুপ: ${donor.bloodGroup}`)}`;

              return (
                <div
                  key={donor.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-700 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={donor.avatar}
                        alt={donor.nameEn}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-500/60"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-rose-600 text-white text-[9px] font-black">
                        {donor.bloodGroup}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-[#102B3F] dark:text-white flex items-center flex-wrap gap-2">
                        <span>{language === 'bn' ? donor.nameBn : donor.nameEn}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          donor.isNonMember
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-sans font-bold'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                        }`}>
                          {donor.badgeText}
                        </span>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>{donor.district}</span>
                        </span>
                        <span>·</span>
                        <span>{donor.subtitle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={`tel:${donorPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                      title="Direct Phone Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'সরাসরি কল' : 'Call'}</span>
                    </a>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                      title="Send WhatsApp Message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyPhone(donorPhone, donor.id)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                      title="Copy Number"
                    >
                      {copiedId === donor.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 sm:px-6 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span>জরুরি প্রয়োজনে কেন্দ্রীয় হটলাইন: <strong>01646-475348</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
