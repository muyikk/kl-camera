import { Module, Global } from '@nestjs/common';
import { Camera } from './camera.service';

@Global()
@Module({
  imports: [],
  providers: [Camera],
  exports: [Camera]
})
class CameraModule { }

// 以自定义名称导出 AppModule和AppService，这里使用HelloModule和HelloService
export { CameraModule as CameraModule, Camera as Camera }
