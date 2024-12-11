import { Module, Global, DynamicModule } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { Camera } from './camera.service';

@Global()
@Module({ })

class CameraModule {
  static forRoot(dllPath: string = 'D:\\kl-storage\\dll\\wafer.dll'): DynamicModule {
    return {
      module: CameraModule,
      controllers: [CameraController],
      providers: [Camera,
        {
          provide: 'DLL_PATH',
          useValue: dllPath, 
        },
      ],
      exports: [Camera],
    };
  }
}
// 以自定义名称导出 AppModule和AppService，这里使用HelloModule和HelloService
export { CameraModule as CameraModule, Camera as Camera }
