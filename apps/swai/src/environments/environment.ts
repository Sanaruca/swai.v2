import { AppEnvironmetMAP } from './env';

export const environment: AppEnvironmetMAP = {
  SWAI_BASE_URL: process.env['NX_SWAI_BASE_URL']!,
  INSTITUTION_NAME: process.env['NX_INSTITUTION_NAME'] ?? 'INSTITUTION_NAME',
};
