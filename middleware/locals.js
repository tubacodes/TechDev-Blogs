
export function setUserLocals(req, res, next) {
  res.locals.user = req.user || null;
  next();
}