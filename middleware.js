const fs = require('fs');
const path = require('path');

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

  // Handle PUT request for /update endpoint
  if (req.method === 'PUT' && req.path === '/update') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const data = JSON.parse(body);
      const dbPath = path.join(__dirname, 'db.json');
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      // Update the corresponding properties in the db.json file
      if (data.id && data.name) {
        const user = db.users.list.find(user => user.id === data.id);
        if (user) {
          user.name = data.name;
          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
          res.status(200).json({ message: 'Database updated successfully' });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } else {
        res.status(400).json({ message: 'Invalid request body' });
      }
    });
  } else {
    next();
  }
};
