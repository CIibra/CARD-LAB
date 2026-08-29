import { supabase } from '../services/supabaseClient';

const MAX_PHOTOS = 2;
const MAX_SIZE_MB = 5;

export function validatePhotoFiles(files) {
  if (files.length > MAX_PHOTOS) {
    return `Maximum ${MAX_PHOTOS} photos autorisées.`;
  }
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return `"${file.name}" n'est pas une image.`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `"${file.name}" dépasse ${MAX_SIZE_MB} Mo.`;
    }
  }
  return null;
}

// Envoie une liste de fichiers vers le bucket "issue-photos" et renvoie leurs URLs publiques
export async function uploadIssuePhotos(files, userId) {
  const urls = [];
  for (const file of files) {
    const ext = file.name.split('.').pop();
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from('issue-photos').upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from('issue-photos').getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export const MAX_ISSUE_PHOTOS = MAX_PHOTOS;
