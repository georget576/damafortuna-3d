export function generateTitleSlug(title: string, wordLimit: number = 6): string {
  if (!title) return 'untitled-reading';
  
  // Get first N words (default 6)
  const words = title.trim().split(/\s+/).slice(0, wordLimit);
  
  // Convert to lowercase and replace spaces with dashes
  return words
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters
}

export function generateUniqueSlug(title: string, existingSlugs: string[] = [], wordLimit: number = 6): string {
  let slug = generateTitleSlug(title, wordLimit);
  
  // If slug already exists, append a timestamp
  if (existingSlugs.includes(slug)) {
    const timestamp = Date.now().toString(36);
    slug = `${slug}-${timestamp}`;
  }
  
  return slug;
}