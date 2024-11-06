import { Module, Global } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { Camera } from './camera.service';

@Global()
@Module({
  imports: [],
  controllers: [CameraController],
  providers: [Camera],
  exports: [Camera]
})
class CameraModule { }

// 以自定义名称导出 AppModule和AppService，这里使用HelloModule和HelloService
export { CameraModule as CameraModule, Camera as Camera }
