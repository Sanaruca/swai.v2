import { AppEnvironmetMAP } from './env';

export const environment: AppEnvironmetMAP = {
  API_URL: process.env['NX_API_URL']!,
  INSTITUTION_NAME: process.env['NX_INSTITUTION_NAME'] ?? 'INSTITUTION_NAME',
};
