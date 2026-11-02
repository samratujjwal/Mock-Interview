// Simple protected controller demonstrating requireAuth/requireRole
export function getProtectedResource(req, res) {
  const user = req.user || null;
  return res.json({ success: true, message: 'Protected resource accessed', data: { user } });
}
