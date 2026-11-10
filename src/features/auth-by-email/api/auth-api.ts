import { http, type ViewerDto } from '@/shared/api';

export type OtpRequestPayload = {
  email: string;
  consentPdn: true;
  consentVersion: string;
};

export type OtpVerifyPayload = {
  email: string;
  code: string;
};

export function requestOtpCode(payload: OtpRequestPayload) {
  return http.post<{ expiresInSec: number }>('/auth/otp/request', payload, { skipAuthReaction: true });
}

export function verifyOtpCode(payload: OtpVerifyPayload) {
  return http.post<{ viewer: ViewerDto }>('/auth/otp/verify', payload, { skipAuthReaction: true });
}

export function logoutSession() {
  return http.post<{ ok: true }>('/auth/logout');
}
