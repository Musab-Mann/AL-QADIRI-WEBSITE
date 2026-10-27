import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/require-admin.ts';
import { getSettings, updateSettings, getWhatsAppConfigStatus, type SettingsInput } from '@/server/settings.ts';

export const runtime = 'nodejs';

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  return NextResponse.json({ settings: getSettings(), whatsapp: getWhatsAppConfigStatus() });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const input = (body ?? {}) as Record<string, unknown>;
    const text = (key: string) => (typeof input[key] === 'string' ? (input[key] as string) : undefined);
    const patch: SettingsInput = {
      etaMinutes: text('etaMinutes'),
      whatsappNumber: text('whatsappNumber'),
      whatsappToken: text('whatsappToken'),
      whatsappPhoneNumberId: text('whatsappPhoneNumberId'),
      clearWhatsappApi: input.clearWhatsappApi === true,
    };
    const settings = updateSettings(patch);
    return NextResponse.json({ settings, whatsapp: getWhatsAppConfigStatus() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not update settings.' }, { status: 400 });
  }
}
