const Koa = require('koa');
const Router = require('@koa/router');

const router = new Router();
router.get('/health', async (context) => {
  context.body = { success: true };
});

const app = new Koa();
app.use(router.routes());
app.listen(3000);
