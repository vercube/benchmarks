import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  getHealth() {
    return { status: 'ok' };
  }

  @Get('/api/test')
  getTest() {
    return {
      message: 'Hello, World!',
      timestamp: Date.now(),
      framework: 'nestjs'
    };
  }
}
