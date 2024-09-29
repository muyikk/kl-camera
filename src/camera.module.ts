import { Module, Global } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { CameraService } from './camera.service';

@Global()
@Module({
  imports: [],
  controllers: [CameraController],
  providers: [CameraService],
  exports: [CameraService]
})
class CameraModule { }

// 以自定义名称导出 AppModule和AppService，这里使用HelloModule和HelloService
export { CameraModule as CameraModule, CameraService as CameraService }
