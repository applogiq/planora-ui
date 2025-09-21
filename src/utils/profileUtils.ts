const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Get the full profile picture URL
 * @param user_profile - The user profile path from API
 * @returns Full URL for the profile picture
 */
export const getProfilePictureUrl = (user_profile: string | null | undefined): string => {
  if (!user_profile) {
    return `${API_BASE_URL}/public/user-profile/default.png`;
  }

  // If it's already a full URL, return as is
  if (user_profile.startsWith('http://') || user_profile.startsWith('https://')) {
    return user_profile;
  }

  // If it starts with /public, use as is with API base
  if (user_profile.startsWith('/public/')) {
    return `${API_BASE_URL}${user_profile}`;
  }

  // If it's just a filename, construct the full path
  return `${API_BASE_URL}/public/user-profile/${user_profile}`;
};

/**
 * Get user initials as fallback for profile picture
 * @param name - User's full name
 * @returns User initials (e.g., "John Doe" -> "JD")
 */
export const getUserInitials = (name: string): string => {
  if (!name) return 'U';

  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Check if the profile picture URL is valid/accessible
 * @param url - Profile picture URL to check
 * @returns Promise<boolean> - true if accessible, false otherwise
 */
export const isProfilePictureAccessible = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};