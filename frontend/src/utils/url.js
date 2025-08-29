export function resolveImageUrl(url) {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (/^https?:\/\//i.test(url)) return url;
  
  // For relative paths, resolve against backend
  const { protocol, hostname } = window.location;
  const backend = `${protocol}//${hostname}:5050`;
  
  // Ensure URL starts with / for proper resolution
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${backend}${cleanUrl}`;
}

export function getBackendUrl() {
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:5050`;
}
