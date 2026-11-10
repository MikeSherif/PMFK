import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/shared/config';
import type { ProfileWriteDto } from '@/shared/api';
import { getViewerByToken, updateProfile } from '@/shared/api/mock/db';
import { jsonError, jsonUnauthenticated } from '../../_lib/json-error';

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseBody(body: unknown): { ok: true; data: ProfileWriteDto } | { ok: false; fieldErrors: Record<string, string[]> } {
  const source = body as Record<string, unknown> | null;
  const fieldErrors: Record<string, string[]> = {};
  const fullName = readString(source?.fullName);
  const company = readString(source?.company);
  const role = readString(source?.role);
  const industry = readString(source?.industry);
  const lookingFor = readString(source?.lookingFor);
  const offering = readString(source?.offering);
  if (fullName.length < 2) fieldErrors.fullName = ['Укажите имя и фамилию'];
  if (company.length < 2) fieldErrors.company = ['Укажите компанию или проект'];
  if (role.length < 2) fieldErrors.role = ['Укажите должность'];
  if (!industry) fieldErrors.industry = ['Выберите отрасль'];
  if (lookingFor.length < 8) fieldErrors.lookingFor = ['Опишите, что ищете'];
  if (offering.length < 8) fieldErrors.offering = ['Опишите, что можете предложить'];
  const tags = Array.isArray(source?.tags) ? source.tags.filter((tag): tag is string => typeof tag === 'string') : [];
  if (tags.length < 1) fieldErrors.tags = ['Выберите хотя бы один тег'];
  if (tags.length > 8) fieldErrors.tags = ['Можно выбрать не больше 8 тегов'];
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }
  return {
    ok: true,
    data: {
      fullName,
      company,
      role,
      industry,
      city: readString(source?.city),
      website: readString(source?.website),
      lookingFor,
      offering,
      tags,
      catalogConsent: source?.catalogConsent === true,
      publishConsent: source?.publishConsent === true,
    },
  };
}

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const viewer = getViewerByToken(token);
  if (!viewer) {
    return jsonUnauthenticated();
  }
  return NextResponse.json(viewer.profile);
}

export async function PUT(request: Request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const viewer = getViewerByToken(token);
  if (!viewer) {
    return jsonUnauthenticated();
  }
  const parsed = parseBody(await request.json().catch(() => null));
  if (!parsed.ok) {
    return jsonError(422, 'VALIDATION', 'Проверьте поля формы', { fieldErrors: parsed.fieldErrors });
  }
  const next = updateProfile(viewer.id, parsed.data);
  if (!next) {
    return jsonUnauthenticated();
  }
  return NextResponse.json(next.profile);
}
