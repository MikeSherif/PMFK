import { beforeEach, describe, expect, it } from 'vitest';
import { DEMO_OTP_CODE } from '@/shared/config';
import {
  getFeed,
  getSaved,
  getViewerByToken,
  listMatches,
  listMeetings,
  listMessages,
  requestOtp,
  resetMockDb,
  saveProfile,
  sendInterest,
  skipProfile,
  updateProfile,
  verifyOtp,
} from './db';

describe('mock otp store', () => {
  it('issues a demo code and creates a session on verify', () => {
    const requested = requestOtp('anna@demo.ru', '2026-11-09');
    expect(requested.ok).toBe(true);

    const wrong = verifyOtp('anna@demo.ru', '000000');
    expect(wrong.ok).toBe(false);

    const verified = verifyOtp('anna@demo.ru', DEMO_OTP_CODE);
    expect(verified.ok).toBe(true);
    if (!verified.ok) {
      return;
    }
    const viewer = getViewerByToken(verified.token);
    expect(viewer?.email).toBe('anna@demo.ru');
    expect(viewer?.abilities.canSendInterest).toBe(false);
  });

  it('rejects expired or missing codes', () => {
    const result = verifyOtp('missing@demo.ru', DEMO_OTP_CODE);
    expect(result.ok).toBe(false);
  });

  it('sends the profile back to moderation after substantial edits', () => {
    requestOtp('anna@demo.ru', '2026-11-09');
    const verified = verifyOtp('anna@demo.ru', DEMO_OTP_CODE);
    expect(verified.ok).toBe(true);
    if (!verified.ok) {
      return;
    }
    const current = getViewerByToken(verified.token);
    expect(current?.profile.status).toBe('approved');
    if (!current) {
      return;
    }
    const next = updateProfile(current.id, {
      fullName: 'Анна Иванова',
      company: current.profile.company,
      role: current.profile.role,
      industry: current.profile.industry,
      city: current.profile.city,
      website: current.profile.website,
      lookingFor: current.profile.lookingFor,
      offering: current.profile.offering,
      tags: current.profile.tags,
      catalogConsent: current.profile.catalogConsent,
      publishConsent: current.profile.publishConsent,
    });
    expect(next?.profile.status).toBe('pending');
    expect(next?.profile.fullName).toBe('Анна Иванова');
  });
});

describe('mock catalog', () => {
  beforeEach(() => {
    resetMockDb();
  });

  function login(email: string) {
    requestOtp(email, '2026-11-09');
    const verified = verifyOtp(email, DEMO_OTP_CODE);
    expect(verified.ok).toBe(true);
    if (!verified.ok) {
      throw new Error('expected session');
    }
    const viewer = getViewerByToken(verified.token);
    if (!viewer) {
      throw new Error('expected viewer');
    }
    return viewer;
  }

  it('lists published cards and skip/save them without a ticket', () => {
    const viewer = login('anna@demo.ru');
    const feed = getFeed(viewer.id);
    expect(feed.total).toBe(3);
    const first = feed.items[0];
    expect(first).toBeDefined();
    if (!first) {
      return;
    }
    expect(skipProfile(viewer.id, first.id).ok).toBe(true);
    expect(getFeed(viewer.id).total).toBe(2);
    const next = getFeed(viewer.id).items[0];
    expect(next).toBeDefined();
    if (!next) {
      return;
    }
    expect(saveProfile(viewer.id, next.id).ok).toBe(true);
    expect(getSaved(viewer.id)).toHaveLength(1);
  });

  it('blocks interest without a ticket and allows it for the demo ticket account', () => {
    const free = login('anna@demo.ru');
    const paid = login('ticket@demo.ru');
    const cardId = getFeed(free.id).items[0]?.id;
    expect(cardId).toBeDefined();
    if (!cardId) {
      return;
    }
    expect(sendInterest(free.id, cardId, free.abilities.canSendInterest).code).toBe('TICKET_REQUIRED');
    const sent = sendInterest(paid.id, cardId, paid.abilities.canSendInterest);
    expect(sent.ok).toBe(true);
  });

  it('seeds a chat match for the demo ticket account', () => {
    const paid = login('ticket@demo.ru');
    const matches = listMatches(paid.id);
    expect(matches.length).toBeGreaterThan(0);
    const first = matches[0];
    expect(first).toBeDefined();
    if (!first) {
      return;
    }
    const page = listMessages(paid.id, first.id);
    expect(page?.items.length).toBeGreaterThan(0);
  });

  it('returns an empty meetings list until booking is implemented', () => {
    const paid = login('ticket@demo.ru');
    expect(listMeetings(paid.id)).toEqual([]);
  });
});
