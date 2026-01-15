import { Controller, Get } from '@riktajs/core';

@Controller()
export class AppController {

  @Get('/health')
  getHealth() {
    return { status: 'ok' };
  }

  @Get('/api/test')
  test() {
    return {
      message: 'Hello, World!',
      timestamp: Date.now(),
      framework: 'rikta'
    };
  }
}
