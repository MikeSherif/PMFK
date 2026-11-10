const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function getBasePath() {
  return basePath;
}

export function stripBasePath(pathname: string) {
  if (basePath && pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length) || '/';
  }
  return pathname;
}

export function withBasePath(path: string) {
  if (!basePath) {
    return path;
  }
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}
