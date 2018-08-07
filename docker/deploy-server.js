const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');

const router = express.Router();
const app = express();

// Read angular proxy configuration
var fs = require("fs");
var proxyConfig = JSON.parse(fs.readFileSync("proxy.conf.json"));

// Run the app by serving the static files in the dist directory
// and setting proxy routes from the configuration file
router.use('/', express.static(__dirname + '/', {redirect: false}));

Object.keys(proxyConfig).forEach(function(key) {
  router.use(key, proxy({target: proxyConfig[key].target, changeOrigin: proxyConfig[key].changeOrigin}));
});

router.get('*', function (req, res, next) {
  res.sendFile(path.resolve(__dirname + '/index.html'));
});

module.exports = router;

app.use('/', router)
app.listen(process.env.PORT || 8080);
