import 'reflect-metadata';
import { createExpressServer, JsonController, Get } from 'routing-controllers';

@JsonController()
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
      framework: 'routing-controllers'
    };
  }
}

const app = createExpressServer({
  controllers: [AppController],
  defaultErrorHandler: false
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
