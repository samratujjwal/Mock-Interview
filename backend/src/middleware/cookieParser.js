export default function cookieParser(req, res, next) {
  const header = req.headers.cookie;
  req.cookies = {};
  if (!header) return next();

  const parts = header.split(';');
  for (const part of parts) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = decodeURIComponent(part.slice(0, index).trim());
    const val = decodeURIComponent(part.slice(index + 1).trim());
    req.cookies[key] = val;
  }
  return next();
}
