import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/api/test")
export class TestController {
  @Get("/")
  get(): unknown {
    return {
      message: "Hello, World!",
      timestamp: Date.now(),
      framework: "tsed"
    };
  }
}
