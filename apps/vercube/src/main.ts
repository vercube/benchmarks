import { createApp, Controller, Get } from '@vercube/core';

@Controller('/')
class AppController {
  @Get('/health')
  health() {
    return { status: 'ok' };
  }

  @Get('/api/test')
  test() {
    return {
      message: 'Hello, World!',
      timestamp: Date.now(),
      framework: 'vercube'
    };
  }
}

(async () => { 
  const app = await createApp();
  app.container.bind(AppController);

  await app.listen();

  console.log('Server started on port 3000');
})();