import { PaymentChannel } from '../types';

export const PAYMENT_CHANNELS_STORAGE_KEY = 'colash_payment_channels';

export const INITIAL_PAYMENT_CHANNELS: PaymentChannel[] = [
  {
    id: 'ch-bkash-1',
    gateway: 'bkash',
    number: '01646-475348',
    accountType: 'Personal',
    accountHolderName: 'CoLASH Foundation',
    instructionBn: 'বিকাশ অ্যাপ থেকে Send Money সিলেক্ট করে এই নম্বরে অনুদান পাঠান এবং TrxID দিন।',
    instructionEn: 'Select Send Money in the bKash app to this number and enter your TrxID.',
    isActive: true,
    createdAt: '2026-03-07',
  },
  {
    id: 'ch-nagad-1',
    gateway: 'nagad',
    number: '01646-475348',
    accountType: 'Personal',
    accountHolderName: 'CoLASH Foundation',
    instructionBn: 'নগদ অ্যাপ থেকে Send Money সিলেক্ট করে অনুদান পাঠান এবং Transaction ID দিন।',
    instructionEn: 'Select Send Money in the Nagad app to this number and enter your Transaction ID.',
    isActive: true,
    createdAt: '2026-03-07',
  },
];
