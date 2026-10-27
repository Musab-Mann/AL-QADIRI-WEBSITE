import { contact, messages, type Phone } from '@/content/site';

export function telHref(phone: Phone = contact.phones[0]): string {
  return `tel:${phone.e164}`;
}

export function waHref(message: string = messages.general, phone: Phone = contact.whatsappPhone): string {
  return `https://wa.me/${phone.e164.replace('+', '')}?text=${encodeURIComponent(message)}`;
}

export function mailHref(): string {
  return `mailto:${contact.email}`;
}

export function directionsHref(): string {
  if (contact.mapsUrl) return contact.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
}
