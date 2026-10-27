import { db, nowIso } from './db.ts';

export interface Settings {
  etaMinutes: string;
  /** Where new-order WhatsApp notifications go. E.164 with a leading plus, e.g. +971502582786. */
  whatsappNumber: string;
}

export interface SettingsInput extends Partial<Settings> {
  /** Meta WhatsApp Cloud API token. Blank leaves the saved token as it is. */
  whatsappToken?: string;
  /** Meta WhatsApp Cloud API phone number ID. Blank leaves the saved ID as it is. */
  whatsappPhoneNumberId?: string;
  /** Removes the saved token and phone number ID, which switches automatic sending off. */
  clearWhatsappApi?: boolean;
}

// Client decision 2026-09-19: +971 50 258 2786 is the only number, for calls, WhatsApp and order alerts.
const DEFAULTS: Settings = {
  etaMinutes: '35 to 40',
  whatsappNumber: '+971502582786',
};

function readAll(): Record<string, string> {
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function getSettings(): Settings {
  const map = readAll();
  return {
    etaMinutes: map.eta_minutes ?? DEFAULTS.etaMinutes,
    whatsappNumber: map.whatsapp_number ?? DEFAULTS.whatsappNumber,
  };
}

function normaliseNumber(value: string): string {
  const digits = value.replace(/[\s()-]/g, '').replace(/^00/, '+');
  if (!/^\+?\d{8,15}$/.test(digits)) throw new Error('Enter the WhatsApp number with its country code, e.g. +971 50 258 2786.');
  return digits.startsWith('+') ? digits : `+${digits}`;
}

export function updateSettings(input: SettingsInput): Settings {
  const now = nowIso();
  const upsert = db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  );
  const remove = db.prepare('DELETE FROM settings WHERE key = ?');

  if (input.etaMinutes !== undefined) {
    const trimmed = input.etaMinutes.trim();
    if (!trimmed || trimmed.length > 40) throw new Error('Please enter a short estimated time, e.g. "35 to 40".');
    upsert.run('eta_minutes', trimmed, now);
  }
  if (input.whatsappNumber !== undefined) {
    upsert.run('whatsapp_number', normaliseNumber(input.whatsappNumber), now);
  }
  if (input.clearWhatsappApi) {
    remove.run('whatsapp_token');
    remove.run('whatsapp_phone_number_id');
  } else {
    const token = input.whatsappToken?.trim();
    if (token) {
      if (token.length < 20 || /\s/.test(token)) throw new Error('That does not look like a WhatsApp Cloud API token.');
      upsert.run('whatsapp_token', token, now);
    }
    const phoneNumberId = input.whatsappPhoneNumberId?.trim();
    if (phoneNumberId) {
      if (!/^\d{6,20}$/.test(phoneNumberId)) throw new Error('The phone number ID is the long number from Meta, digits only.');
      upsert.run('whatsapp_phone_number_id', phoneNumberId, now);
    }
  }
  return getSettings();
}

export interface WhatsAppConfig {
  token: string | null;
  phoneNumberId: string | null;
  /** Digits only, as the Cloud API expects (country code, no plus). */
  destination: string;
}

/** Server-only. Environment variables win over the dashboard, so a deployment can pin its own values. */
export function getWhatsAppConfig(): WhatsAppConfig {
  const map = readAll();
  const number = process.env.WHATSAPP_NUMBER || map.whatsapp_number || DEFAULTS.whatsappNumber;
  return {
    token: process.env.WHATSAPP_API_TOKEN || map.whatsapp_token || null,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || map.whatsapp_phone_number_id || null,
    destination: number.replace(/\D/g, ''),
  };
}

export function formatPhone(digitsOrE164: string): string {
  const d = digitsOrE164.replace(/\D/g, '');
  if (d.startsWith('971') && d.length === 12) return `+971 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  return `+${d}`;
}

/** What the admin settings page may show. Never the token itself. */
export function getWhatsAppConfigStatus(): {
  configured: boolean;
  destinationNumber: string;
  tokenSaved: boolean;
  phoneNumberIdSaved: boolean;
  fromEnvironment: boolean;
} {
  const config = getWhatsAppConfig();
  return {
    configured: Boolean(config.token && config.phoneNumberId && config.destination),
    destinationNumber: formatPhone(config.destination),
    tokenSaved: Boolean(config.token),
    phoneNumberIdSaved: Boolean(config.phoneNumberId),
    fromEnvironment: Boolean(process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_PHONE_NUMBER_ID),
  };
}
