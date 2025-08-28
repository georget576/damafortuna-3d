export function generateTitleSlug(title: string): string {
  if (!title) return 'untitled-reading';
  
  // Get first 5 words
  const words = title.trim().split(/\s+/).slice(0, 5);
  
  // Convert to lowercase and replace spaces with dashes
  return words
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters
}

export function generateUniqueSlug(title: string, existingSlugs: string[] = []): string {
  let slug = generateTitleSlug(title);
  
  // If slug already exists, append a timestamp
  if (existingSlugs.includes(slug)) {
    const timestamp = Date.now().toString(36);
    slug = `${slug}-${timestamp}`;
  }
  
  return slug;
}