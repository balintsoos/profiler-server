const Koa = require('koa');
const { bodyParser } = require("@koa/bodyparser");
const Router = require('@koa/router');
const crypto = require('crypto');

const users = {};

const router = new Router();

router.get('/health', (context) => {
  context.status = 200;
});

router.get('/users', (context) => {
  context.body = users;
});

router.post('/users', (context) => {
  let username = context.request.body.username || '';
  const password = context.request.body.password || '';

  username = username.replace(/[!@#$%^&*]/g, '');

  if (!username || !password || users[username]) {
    context.status = 400;
    return;
  }

  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

  users[username] = { salt, hash };

  context.status = 201;
});

router.post('/auth', (context) => {
  let username = context.request.body.username || '';
  const password = context.request.body.password || '';

  username = username.replace(/[!@#$%^&*]/g, '');

  if (!username || !password || !users[username]) {
    context.status = 400;
    return;
  }

  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

  if (crypto.timingSafeEqual(hash, encryptHash)) {
    context.status = 200;
  } else {
    context.status = 401;
  }
});

const app = new Koa();
app.use(bodyParser());
app.use(router.routes());
app.listen(3000);
