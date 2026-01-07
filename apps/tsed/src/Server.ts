import {Configuration} from "@tsed/di";
import {application, type PlatformApplication} from "@tsed/platform-http";
import "@tsed/platform-log-request";
import "@tsed/platform-express";
import "@tsed/ajv";
import {config} from "./config/index.js";
import { HealthController } from "./controllers/HealthController.js";
import { TestController } from "./controllers/TestController.js";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 3000,
  httpsPort: false,
  mount: {
    "/": [
      HealthController,
      TestController
    ],
  },
  middlewares: [
    "cors",
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    { use: "urlencoded-parser", options: { extended: true }}
  ]
})
export class Server {
  protected app: PlatformApplication = application();
}
