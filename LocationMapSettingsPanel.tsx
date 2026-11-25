import React, { useState } from 'react';
import {
  MapPin,
  Save,
  RotateCcw,
  Navigation,
  Compass,
  Plus,
  Trash2,
  Globe,
} from 'lucide-react';
import { BangladeshBranch, Language, MapConfig } from '../types';
import {
  BANGLADESH_DIVISIONS_DISTRICTS,
  INITIAL_BANGLADESH_BRANCHES,
} from '../data/bangladeshBranches';

interface LocationMapSettingsPanelProps {
  language: Language;
  mapConfig: MapConfig;
  onUpdateMapConfig: (newConfig: MapConfig) => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const LocationMapSettingsPanel: React.FC<LocationMapSettingsPanelProps> = ({
  language,
  mapConfig,
  onUpdateMapConfig,
  onToast,
}) => {
  const [address, setAddress] = useState(mapConfig.address);
  const [customEmbedUrl, setCustomEmbedUrl] = useState(mapConfig.customEmbedUrl || '');
  const [landmarkBn, setLandmarkBn] = useState(mapConfig.landmarkBn || '');
  const [landmarkEn, setLandmarkEn] = useState(mapConfig.landmarkEn || '');
  const [phone, setPhone] = useState(mapConfig.phone || '01646-475348');
  const [directionsUrl, setDirectionsUrl] = useState(mapConfig.directionsUrl || '');
  const [branches, setBranches] = useState<BangladeshBranch[]>(
    mapConfig.branches && mapConfig.branches.length > 0
      ? mapConfig.branches
      : INITIAL_BANGLADESH_BRANCHES
  );

  // New Branch Quick Add State
  const [newDivId, setNewDivId] = useState(BANGLADESH_DIVISIONS_DISTRICTS[0].id);
  const selectedDivObj =
    BANGLADESH_DIVISIONS_DISTRICTS.find((d) => d.id === newDivId) ||
    BANGLADESH_DIVISIONS_DISTRICTS[0];
  const [newDistrictBn, setNewDistrictBn] = useState(selectedDivObj.districts[0].bn);
  const [newBranchNameBn, setNewBranchNameBn] = useState('');
  const [newCoordinatorBn, setNewCoordinatorBn] = useState('');
  const [newPhone, setNewPhone] = useState('01646-475348');
  const [newStatus, setNewStatus] = useState<BangladeshBranch['status']>('active_branch');

  const defaultPlaceholder = '[এখানে CoLASH Foundation-এর সম্পূর্ণ ঠিকানা দিন]';

  const handleResetPlaceholder = () => {
    setAddress(defaultPlaceholder);
    onToast(
      'info',
      language === 'bn' ? 'প্লেসহোল্ডার ঠিকানা সেট করা হয়েছে' : 'Placeholder Reset',
      defaultPlaceholder
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: MapConfig = {
      address: address.trim() || defaultPlaceholder,
      customEmbedUrl: customEmbedUrl.trim() || undefined,
      landmarkBn: landmarkBn.trim(),
      landmarkEn: landmarkEn.trim(),
      phone: phone.trim(),
      directionsUrl:
        directionsUrl.trim() ||
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          address.trim() || 'Kamalganj, Moulvibazar, Sylhet'
        )}`,
      branches,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onUpdateMapConfig(updated);
    onToast(
      'success',
      language === 'bn' ? 'গুগল ম্যাপ, ঠিকানা ও শাখা তালিকা সংরক্ষিত হয়েছে' : 'Map, Address & Branches Updated',
      updated.address
    );
  };

  const handleAddBranch = () => {
    const distObj =
      selectedDivObj.districts.find((d) => d.bn === newDistrictBn) ||
      selectedDivObj.districts[0];
    const branchTitle =
      newBranchNameBn.trim() || `${distObj.bn} জেলা শাখা — কোলাশ ফাউন্ডেশন`;

    const created: BangladeshBranch = {
      id: `br-${Date.now()}`,
      divisionBn: selectedDivObj.nameBn,
      divisionEn: selectedDivObj.nameEn,
      districtBn: distObj.bn,
      districtEn: distObj.en,
      branchNameBn: branchTitle,
      branchNameEn: `${distObj.en} District Branch — CoLASH Foundation`,
      addressBn: `${distObj.bn}, ${selectedDivObj.nameBn}`,
      addressEn: `${distObj.en}, ${selectedDivObj.nameEn}`,
      coordinatorNameBn: newCoordinatorBn.trim() || 'জেলা সমন্বয় টিম',
      coordinatorNameEn: newCoordinatorBn.trim() || 'District Coordination Team',
      coordinatorPhone: newPhone.trim() || '01646-475348',
      status: newStatus,
      establishedDate: '২০২৬',
    };

    const nextBranches = [created, ...branches];
    setBranches(nextBranches);
    onUpdateMapConfig({
      ...mapConfig,
      address: address.trim() || mapConfig.address,
      branches: nextBranches,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setNewBranchNameBn('');
    setNewCoordinatorBn('');
    onToast(
      'success',
      language === 'bn' ? 'নতুন শাখা যোগ করা হয়েছে' : 'New Branch Added',
      created.branchNameBn
    );
  };

  const handleStatusChange = (id: string, status: BangladeshBranch['status']) => {
    const nextBranches = branches.map((b) => (b.id === id ? { ...b, status } : b));
    setBranches(nextBranches);
    onUpdateMapConfig({
      ...mapConfig,
      branches: nextBranches,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteBranch = (id: string) => {
    const nextBranches = branches.filter((b) => b.id !== id);
    setBranches(nextBranches);
    onUpdateMapConfig({
      ...mapConfig,
      branches: nextBranches,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    onToast(
      'info',
      language === 'bn' ? 'শাখা তালিকা থেকে সরানো হয়েছে' : 'Branch Removed'
    );
  };

  const previewEffectiveAddress =
    !address || address.includes('[এখানে CoLASH Foundation-এর সম্পূর্ণ ঠিকানা দিন]')
      ? 'Kamalganj, Moulvibazar, Sylhet, Bangladesh'
      : address;

  const previewEmbedUrl =
    customEmbedUrl && customEmbedUrl.startsWith('https://')
      ? customEmbedUrl
      : `https://maps.google.com/maps?q=${encodeURIComponent(
          previewEffectiveAddress
        )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#102B3F] to-[#167D78] text-white shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>{language === 'bn' ? 'গুগল ম্যাপ ও দেশব্যাপী শাখা কন্ট্রোল' : 'Google Maps & Bangladesh Branches Control'}</span>
        </div>
        <h3 className="text-lg font-bold">
          {language === 'bn' ? 'কেন্দ্রীয় ঠিকানা, ম্যাপ ও সারা বাংলাদেশের শাখা পরিচালনা' : 'HQ Address, Maps & Nationwide Branches'}
        </h3>
        <p className="text-xs text-stone-200 mt-1 max-w-xl leading-relaxed">
          {language === 'bn'
            ? 'কেন্দ্রীয় কার্যালয়ের Google Maps তথ্য এবং বাংলাদেশের ৮টি বিভাগ ও ৬৪ জেলার শাখা নেটওয়ার্ক পরিচালনা করুন।'
            : 'Manage central office Google Maps pin and regional/district branches across all 8 divisions of Bangladesh.'}
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E65100]" />
                <span>{language === 'bn' ? 'অফিস ঠিকানা *' : 'Office Address *'}</span>
              </label>

              <button
                type="button"
                onClick={handleResetPlaceholder}
                className="text-[11px] font-semibold text-[#167D78] dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'bn' ? 'প্লেসহোল্ডার ঠিকানায় রিসেট করুন' : 'Reset to Placeholder'}</span>
              </button>
            </div>

            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="[এখানে CoLASH Foundation-এর সম্পূর্ণ ঠিকানা দিন]"
              className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#167D78]"
            />
          </div>

          <div>
            <label className="font-bold block mb-1 text-stone-700 dark:text-stone-300">
              {language === 'bn' ? 'কাস্টম Google Maps Embed URL (ঐচ্ছিক)' : 'Custom Google Maps Embed URL (Optional)'}
            </label>
            <input
              type="text"
              value={customEmbedUrl}
              onChange={(e) => setCustomEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1 text-stone-700 dark:text-stone-300">
                {language === 'bn' ? 'লক্ষণীয় স্থান / এরিয়া (বাংলা)' : 'Nearby Landmark (Bangla)'}
              </label>
              <input
                type="text"
                value={landmarkBn}
                onChange={(e) => setLandmarkBn(e.target.value)}
                placeholder="যেমন: কমলগঞ্জ উপজেলা পরিষদ সংলগ্ন"
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>
            <div>
              <label className="font-bold block mb-1 text-stone-700 dark:text-stone-300">
                {language === 'bn' ? 'অফিস হটলাইন / ফোন' : 'Office Hotline Phone'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01646-475348"
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1 text-stone-700 dark:text-stone-300">
              {language === 'bn' ? 'সরাসরি দিকনির্দেশনা (Directions) লিংক' : 'Direct Directions URL'}
            </label>
            <input
              type="text"
              value={directionsUrl}
              onChange={(e) => setDirectionsUrl(e.target.value)}
              placeholder="https://www.google.com/maps/dir/?api=1&destination=..."
              className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#167D78] hover:bg-[#126864] text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Save className="w-4 h-4 text-[#D6F36A]" />
              <span>{language === 'bn' ? 'ম্যাপ ও শাখাসমূহ সংরক্ষণ করুন' : 'Save Map & Branches'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Nationwide Bangladesh Branches Manager */}
      <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-[#102B3F] dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#167D78]" />
            <span>{language === 'bn' ? 'সারা বাংলাদেশের শাখা ব্যবস্থাপনা (নতুন শাখা যোগ/সম্পাদনা)' : 'Bangladesh Nationwide Branches Manager'}</span>
          </h4>
          <span className="text-[11px] font-mono text-stone-500">
            {branches.length} {language === 'bn' ? 'টি শাখা' : 'branches'}
          </span>
        </div>

        {/* Add Branch Form */}
        <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <select
            value={newDivId}
            onChange={(e) => {
              const id = e.target.value;
              setNewDivId(id);
              const dObj = BANGLADESH_DIVISIONS_DISTRICTS.find((d) => d.id === id);
              if (dObj && dObj.districts.length > 0) setNewDistrictBn(dObj.districts[0].bn);
            }}
            className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
          >
            {BANGLADESH_DIVISIONS_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {language === 'bn' ? d.nameBn : d.nameEn}
              </option>
            ))}
          </select>

          <select
            value={newDistrictBn}
            onChange={(e) => setNewDistrictBn(e.target.value)}
            className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
          >
            {selectedDivObj.districts.map((dist) => (
              <option key={dist.en} value={dist.bn}>
                {language === 'bn' ? dist.bn : dist.en}
              </option>
            ))}
          </select>

          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as BangladeshBranch['status'])}
            className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
          >
            <option value="active_branch">{language === 'bn' ? 'সক্রিয় শাখা' : 'Active Branch'}</option>
            <option value="establishing">{language === 'bn' ? 'গঠন প্রক্রিয়াধীন' : 'Establishing'}</option>
            <option value="upcoming">{language === 'bn' ? 'আগামী শাখা' : 'Upcoming'}</option>
          </select>

          <input
            type="text"
            value={newBranchNameBn}
            onChange={(e) => setNewBranchNameBn(e.target.value)}
            placeholder={language === 'bn' ? 'শাখার নাম (যেমন: কক্সবাজার জেলা শাখা)' : 'Branch Name'}
            className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
          />

          <input
            type="text"
            value={newCoordinatorBn}
            onChange={(e) => setNewCoordinatorBn(e.target.value)}
            placeholder={language === 'bn' ? 'সমন্বয়কের নাম' : 'Coordinator Name'}
            className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
          />

          <div className="flex gap-2">
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono"
            />
            <button
              type="button"
              onClick={handleAddBranch}
              className="px-3.5 py-2 rounded-lg bg-[#167D78] hover:bg-[#102B3F] text-white font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'যোগ' : 'Add'}</span>
            </button>
          </div>
        </div>

        {/* Existing Branches List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {branches.map((b) => (
            <div
              key={b.id}
              className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="font-bold text-[#102B3F] dark:text-white truncate">{b.branchNameBn}</div>
                <div className="text-[11px] text-stone-500">
                  {b.districtBn} · {b.divisionBn} · {b.coordinatorNameBn}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value as BangladeshBranch['status'])}
                  className="px-2 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-[11px]"
                >
                  <option value="active_hq">HQ</option>
                  <option value="active_branch">{language === 'bn' ? 'সক্রিয়' : 'Active'}</option>
                  <option value="establishing">{language === 'bn' ? 'প্রক্রিয়াধীন' : 'Establishing'}</option>
                  <option value="upcoming">{language === 'bn' ? 'আগামী' : 'Upcoming'}</option>
                </select>
                {b.status !== 'active_hq' && (
                  <button
                    type="button"
                    onClick={() => handleDeleteBranch(b.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                    title="Delete branch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Map Preview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
        <h4 className="font-bold text-xs text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#167D78]" />
          <span>{language === 'bn' ? 'লাইভ প্রিভিউ (ওয়েবসাইটে যেমন দেখাবে)' : 'Live Preview (As Rendered on Site)'}</span>
        </h4>

        <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 h-[260px]">
          <iframe
            title="Google Maps Live Preview"
            src={previewEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
