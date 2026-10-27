import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/require-admin.ts';
import { saveMenuItemImage, UploadError } from '@/server/upload.ts';
import { updateMenuItem, getEffectiveItemById } from '@/server/menu-overlay.ts';

export const runtime = 'nodejs';

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid item id.' }, { status: 400 });
  if (!getEffectiveItemById(id)) return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a multipart form with an "image" file.' }, { status: 400 });
  }
  const file = form.get('image');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image file was provided.' }, { status: 400 });
  }

  try {
    const path = await saveMenuItemImage(file);
    const item = updateMenuItem(id, { image: path });
    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof UploadError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Could not save the image.' }, { status: 500 });
  }
}
