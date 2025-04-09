module.exports = (req, res, next) => {
  const allowedOrigins = ["https:/localhost:8000", "http://localhost:9000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("access-control-allow-origin", origin);
  }
  res.header("access-control-allow-credentials", "true");
  res.header("x-viron-authtypes-path", "/authentication");
  res.header(
    "access-control-expose-headers",
    "x-viron-authtypes-path, content-type, content-disposition"
  );
  // /downloadに対しては, content-typeとcontent-dispositionを付与する
  if (req.path === "/download") {
    res.header("content-type", "text/csv");
    res.header("content-disposition", "attachment; filename=download.csv");
  }
  next();
};
