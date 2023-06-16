module.exports = (req, res, next) => {
  res.header("access-control-allow-origin", "https://localhost:8000");
  res.header("access-control-allow-credentials", "true");
  res.header("x-viron-authtypes-path", "/authentication");
  res.header("access-control-expose-headers", "x-viron-authtypes-path");
  next();
};
