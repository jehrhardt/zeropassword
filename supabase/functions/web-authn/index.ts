import { Application, Router } from "oak";

const router = new Router();

router.get("/web-authn", (ctx) => {
  ctx.response.body = "Hello Web3!";
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
