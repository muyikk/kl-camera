import { Controller, Get } from '@nestjs/common';
import { Camera } from './camera.service';

// 自定义模块名称(hello)
@Controller("hello")
export class CameraController {
  constructor(private readonly appService: Camera) { }

  @Get("getHello")
  getHello(): string {
    return this.appService.getHello();
  }
}
