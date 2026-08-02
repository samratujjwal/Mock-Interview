export function sendSuccess(
  res,
  { statusCode = 200, message = "Success", data = {}, meta } = {},
) {
  const body = { success: true, message, data };
  if (meta !== undefined) {
    body.meta = meta;
  }
  return res.status(statusCode).json(body);
}

export function sendPaginated(
  res,
  { message = "Success", data = [], page, limit, total } = {},
) {
  const pages = limit > 0 ? Math.ceil(total / limit) : 0;
  return sendSuccess(res, {
    message,
    data,
    meta: { page, limit, total, pages },
  });
}
