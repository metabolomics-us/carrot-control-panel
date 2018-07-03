const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');

const router = express.Router();
const app = express();

// Run the app by serving the static files
// in the dist directory
router.use('/', express.static(__dirname + '/', { redirect: false }));
router.use('/rest', proxy({target: 'http://minix.fiehnlab.ucdavis.edu/', changeOrigin: true}));

router.get('*', function (req, res, next) {
  res.sendFile(path.resolve(__dirname + '/index.html'));
});

module.exports = router;

app.use('/', router)
app.listen(process.env.PORT || 8080);
