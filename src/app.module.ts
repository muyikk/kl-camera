import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Global()
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService]
})
class AppModule { }

// 以自定义名称导出 AppModule和AppService，这里使用HelloModule和HelloService
export { AppModule as CameraModule, AppService as CameraService }
