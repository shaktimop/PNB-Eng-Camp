const https = require('https');

https.get('https://blog.x.com/content/dam/blog-twitter/official/en_us/products/2022/recommendations-on-twitter/how-recommendations-help-discover-more-twitter-1.jpg.img.fullhd.medium.jpg', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);
}).on('error', (e) => {
  console.error(e);
});
