import { WebsiteCustomConfig } from '../types';

const REGISTRATION_PATTERN = /নিবন্ধ|রেজিস্ট্র|অধ্যাদেশ|ordinance|registered|\breg\s*(no|:)|80g|dh-9842|clf-bd|ca-bd/i;

export function containsRegistrationClaim(value?: string): boolean {
  if (!value) return false;
  return REGISTRATION_PATTERN.test(value);
}

const INFLATED_PILLAR_STAT_PATTERN = /৪৫০\+|৮,২০০\+|১,৮৫০\+|১২০\+ কর্মজীবী মা|১২টি উপজেলায়|450\+|1,850\+|120\+ Micro-entrepreneurs|12 flood upazilas/i;

export function sanitizeWebsiteConfig(config: WebsiteCustomConfig): WebsiteCustomConfig {
  const next = { ...config };

  if (containsRegistrationClaim(next.heroBadgeBn)) {
    next.heroBadgeBn = 'মানবতার জন্য আলো এবং সেবার বলয় · স্থাপিত ২০২৬';
  }
  if (containsRegistrationClaim(next.heroBadgeEn)) {
    next.heroBadgeEn = 'Circle of Light and Service for Humanity · Est. 2026';
  }
  if (!next.regNumberBn || containsRegistrationClaim(next.regNumberBn)) {
    next.regNumberBn = 'অরাজনৈতিক ও অলাভজনক মানবিক সংস্থা';
  }
  if (containsRegistrationClaim(next.stat3LabelBn)) {
    next.stat3LabelBn = 'সক্রিয় স্বেচ্ছাসেবক';
  }
  if (next.pillar1StatBn && INFLATED_PILLAR_STAT_PATTERN.test(next.pillar1StatBn)) {
    next.pillar1StatBn = '';
  }
  if (next.pillar2StatBn && INFLATED_PILLAR_STAT_PATTERN.test(next.pillar2StatBn)) {
    next.pillar2StatBn = '';
  }
  if (next.pillar3StatBn && INFLATED_PILLAR_STAT_PATTERN.test(next.pillar3StatBn)) {
    next.pillar3StatBn = '';
  }
  if (next.pillar4StatBn && INFLATED_PILLAR_STAT_PATTERN.test(next.pillar4StatBn)) {
    next.pillar4StatBn = '';
  }

  return next;
}
