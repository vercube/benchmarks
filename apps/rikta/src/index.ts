import { Rikta } from '@riktajs/core';

async function bootstrap(): Promise<void> {
  const app = await Rikta.create({
    host: '127.0.0.1',
    port: 3000,
  });

  await app.listen();
}

bootstrap().catch(console.error);