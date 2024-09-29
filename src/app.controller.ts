import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// 自定义模块名称(hello)
@Controller("hello")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("getHello")
  getHello(): string {
    return this.appService.getHello();
  }
}
