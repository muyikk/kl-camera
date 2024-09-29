import { Controller, Get } from '@nestjs/common';
import { CameraService } from './camera.service';

// 自定义模块名称(hello)
@Controller("hello")
export class CameraController {
  constructor(private readonly appService: CameraService) { }

  @Get("getHello")
  getHello(): string {
    return this.appService.getHello();
  }
}
