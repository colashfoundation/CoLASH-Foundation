import React, { useState } from 'react';
import {
  CheckCircle2,
  Droplets,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { Language, PublicBloodDonor } from '../../types';
import { ALL_64_DISTRICTS } from '../../data/bangladeshBranches';

interface BloodDonorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onRegisterDonor: (donor: PublicBloodDonor) => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

const BLOOD_GROUPS = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

export const BloodDonorRegistrationModal: React.FC<BloodDonorRegistrationModalProps> = ({
  isOpen,
  onClose,
  language,
  onRegisterDonor,
  onToast,
}) => {
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [district, setDistrict] = useState('মৌলভীবাজার');
  const [upazilaOrArea, setUpazilaOrArea] = useState('');
  const [phone, setPhone] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [availabilityStatus, setAvailabilityStatus] =
    useState<PublicBloodDonor['availabilityStatus']>('available');
  const [notes, setNotes] = useState('');
  const [consentPublicListing, setConsentPublicListing] = useState(true);
  const [registeredDonor, setRegisteredDonor] = useState<PublicBloodDonor | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      onToast('error', language === 'bn' ? 'আপনার নাম লিখুন' : 'Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      onToast(
        'error',
        language === 'bn'
          ? 'যোগাযোগের জন্য সঠিক মোবাইল নম্বর দিন'
          : 'Please provide a valid phone number'
      );
      return;
    }
    if (!consentPublicListing) {
      onToast(
        'error',
        language === 'bn'
          ? 'রক্তদাতা ডিরেক্টরিতে যুক্ত হতে সম্মতি টিক দিন'
          : 'Please agree to list your blood group for emergency help'
      );
      return;
    }

    const donor: PublicBloodDonor = {
      id: `bd-${Date.now()}`,
      fullName: fullName.trim(),
      bloodGroup,
      district,
      upazilaOrArea: upazilaOrArea.trim() || undefined,
      phone: phone.trim(),
      lastDonationDate: lastDonationDate || undefined,
      availabilityStatus,
      notes: notes.trim() || undefined,
      registeredAt: new Date().toISOString().split('T')[0],
      consentPublicListing: true,
      isNonMemberDonor: true,
    };

    onRegisterDonor(donor);
    setRegisteredDonor(donor);
    onToast(
      'success',
      language === 'bn'
        ? 'স্বেচ্ছাসেবী রক্তদাতা হিসেবে যুক্ত হয়েছেন!'
        : 'Registered as Voluntary Blood Donor!',
      `${donor.fullName} (${donor.bloodGroup} · ${donor.district})`
    );
  };

  const resetAndClose = () => {
    setRegisteredDonor(null);
    setFullName('');
    setUpazilaOrArea('');
    setPhone('');
    setLastDonationDate('');
    setNotes('');
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
        className="w-full max-w-xl bg-white dark:bg-[#0c1a24] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-700 text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                {language === 'bn'
                  ? 'শুধুই রক্তদাতা নিবন্ধন (সদস্য না হয়েই)'
                  : 'Voluntary Blood Donor Registration (No Membership Needed)'}
              </h3>
              <p className="text-xs text-rose-100 mt-0.5">
                {language === 'bn'
                  ? 'সংগঠনের সদস্য বা কর্মী না হয়েও মানবতার টানে রক্তদাতা নেটওয়ার্কে যুক্ত হোন'
                  : 'Help save lives by joining our 24/7 blood donor list without organizational membership'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {registeredDonor ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-[#0B2236] dark:text-white">
                  {language === 'bn'
                    ? 'আপনাকে ধন্যবাদ! রক্তদাতা তালিকায় যুক্ত করা হয়েছে'
                    : 'Thank You! Added to Voluntary Blood Donor List'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                  {language === 'bn'
                    ? `${registeredDonor.fullName} (${registeredDonor.bloodGroup}) — আপনার তথ্য আমাদের রক্তদাতা খোঁজার তালিকায় যুক্ত হয়েছে। আপনার কোনো সদস্যপদ ছাড়াই প্রয়োজনের সময় রোগীর পরিবার যোগাযোগ করতে পারবেন।`
                    : `${registeredDonor.fullName} (${registeredDonor.bloodGroup}) is now listed in the public Blood Donor Finder without any membership obligation.`}
                </p>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                {language === 'bn' ? 'সম্পন্ন করুন' : 'Done'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'bn'
                    ? 'এটি কোনো সাংগঠনিক সদস্য ফর্ম নয়। আপনি কোলাশ ফাউন্ডেশনের সদস্য না হয়েও শুধুমাত্র জরুরি রক্তদানের জন্য এখানে আপনার রক্তের গ্রুপ ও এলাকা যুক্ত করতে পারবেন।'
                    : 'This is NOT a membership form. You can join strictly as a voluntary blood donor with zero organizational obligations.'}
                </span>
              </div>

              {/* Blood Group Selector */}
              <div>
                <label className="font-bold text-[#0B2236] dark:text-stone-200 block mb-2">
                  {language === 'bn' ? 'আপনার রক্তের গ্রুপ নির্বাচন করুন *' : 'Select Blood Group *'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer tabular-nums ${
                        bloodGroup === bg
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-900 text-[#0B2236] dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-rose-400'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3 h-3 text-rose-600" />
                      {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-rose-600" />
                      {language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
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
                      <MapPin className="w-3 h-3 text-rose-600" />
                      {language === 'bn' ? 'জেলা *' : 'District *'}
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
                    {language === 'bn' ? 'উপজেলা / এলাকা' : 'Upazila / Area'}
                  </label>
                  <input
                    type="text"
                    value={upazilaOrArea}
                    onChange={(e) => setUpazilaOrArea(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: কমলগঞ্জ, শ্রীমঙ্গল' : 'e.g. Kamalganj'}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {language === 'bn' ? 'বর্তমান রক্তদানের সক্ষমতা' : 'Availability Status'}
                  </label>
                  <select
                    value={availabilityStatus}
                    onChange={(e) =>
                      setAvailabilityStatus(
                        e.target.value as PublicBloodDonor['availabilityStatus']
                      )
                    }
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="available">
                      {language === 'bn' ? 'এখন রক্তদানে প্রস্তুত' : 'Available Now'}
                    </option>
                    <option value="recently_donated">
                      {language === 'bn' ? 'সম্প্রতি রক্ত দিয়েছি (৩ মাস বিরতি)' : 'Recently Donated'}
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {language === 'bn' ? 'সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক)' : 'Last Donation Date (Optional)'}
                  </label>
                  <input
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentPublicListing}
                  onChange={(e) => setConsentPublicListing(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {language === 'bn'
                    ? 'জরুরি রোগীর প্রাণ বাঁচাতে কোলাশ ফাউন্ডেশনের রক্তদাতা ডিরেক্টরিতে আমার নাম, রক্তের গ্রুপ, এলাকা ও ফোন নম্বর প্রদর্শনে আমি সম্মত আছি।'
                    : 'I consent to display my name, blood group, district, and phone number in the emergency blood donor directory.'}
                </span>
              </label>

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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer"
                >
                  <Droplets className="w-4 h-4" />
                  <span>
                    {language === 'bn' ? 'রক্তদাতা হিসেবে যুক্ত হোন' : 'Register as Blood Donor'}
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
