# 考拉悠然公用相机模块
nestjs通用相机模块，多线程调用c++相机dll<br>
请配合以下文档食用<br>
[工业相机软件设计、制作与使用](https://kaolayouran.feishu.cn/docx/JtQxdy15foYTSkxOGWscHHkqnTf)
### 1. 关键数据结构

```typescript
// 自动获取
public cameraList: {
  id:{
  width: number,  // 宽
  height: number, // 高
  channel: number,  // 通道
  sn: string,   // 相机序列号
  model: string,  // 相机型号
  type: string; // 相机类型
  }
}
```

### 2. API

- 释放图片内存<br>
**！！！（在使用完图片后必须调用，否则内存溢出）！！！**<br>
传入buffer，如果使用`KLBuffer`，你应该传入`KLBuffer.buffer`<br>
```typescript
  /**
   * 释放图片内存
   * @param buffer 要释放的图片buffer
   */
  public freeImg(buffer: Buffer): void 
```

- 创建真实相机

```typescript
  /**
   * 创建真实相机
   * @param types 相机类型
   * @returns 真实相机id列表
   */
  public async init(types: string): Promise<number[]>
```

- 创建模拟相机

```typescript
  /**
   * 创建模拟相机
   * @param cameraPAthList 模拟相机路径列表
   * @returns 模拟相机id列表
   */
  public async mock(cameraPAthList: Array<string>): Promise<number[]>
```

- 关闭所有相机<br>
**相比于`关闭和打开相机`，更希望你使用`开始和停止采集`，相机模块不提供关闭某一个相机的方法，仅提供`关闭所有相机的方法`用于退出软件等操作**
```typescript
  /**
   * 关闭所有相机
   */
  public async closeAll(): Promise<void>
```

- 获取相机参数

```typescript
  /**
   * 获取相机参数
   * @param id 相机ID
   * @returns 该相机参数列表
   */
  public async getParams(id: number): Promise<any>
```

- 内触发采集

```typescript
  /**
   * 内触发采集
   * @param id 相机id
   * @param callback 出图回调函数
   */
  public grabInternal(id: number, callback?: Function): void
```

- 外触发采集

```typescript
  /**
   * 外触发采集
   * @param id 相机id
   * @param callback 出图回调函数
   */
  public grabExternal(id: number, callback?: Function): void
```

- 模拟相机外触发触发器
可使用 api/camera/exMockTrigger 调用
```typescript
  /**
   * 模拟相机外触发触发器
   * @param id 触发的相机id
   * @param interval 出图间隔
   * @param times 出图数量
   */
  public exMockTrigger(id: number, interval: number, times: number): void
```

- 单次采集

```typescript
  /**
   * 单次采集
   * @param id 相机id
   * @param callback 出图回调函数
   */
  public grabOnce(id: number, callback?: Function): void
```

- 停止采集

```typescript
  /**
   * 停止采集
   * @param id 相机id
   */
  public grabStop(id: number): void
```

- 相机畸变校正

```typescript
  /**
   * 相机畸变校正
   * @param id 相机id
   * @param params 畸变校正参数,为NULL时取消校正  [0-3]相机内参 [4]外参数量(4/5/8/12/14) [5-end]畸变外参
   * @returns true:成功, false:失败
   */
  public async undistort(id: number, undistortParams: Array<number> | null): Promise<boolean>
```
- 设置曝光时间

```typescript
  /**
   * 设置曝光时间
   * @param id 相机id
   * @param time 曝光时间
   * @returns true:成功, false:失败
   */
  public async setExposureTime(id: number, time: number): Promise<boolean>
```
- 获取曝光时间

```typescript
  /**
   * 获取曝光时间
   * @param id 相机id
   * @returns time 曝光时间，false => 失败
   */
  public async getExposureTime(id: number): Promise<boolean | number>
```

### 3. 示例

- CameraModule 使用
```typescript
// Moudle
import { Module } from '@nestjs/common';
import { CameraModule } from 'kl-camera';

@Module({
  imports: [
    // 填写dllPath路径
    CameraModule.forRoot('D:\\kl-storage\\template\\dll\\wafer.dll'), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
```

- Camera 使用
```typescript
// Service
import { Injectable } from '@nestjs/common';
import KLBuffer from 'kl-buffer'; // 使用kl-buffer处理图片
import { Camera } from 'kl-camera';

@Injectable()
export class AppService {
  constructor(
    private camera: Camera,
  ) {
    this.test()
  }
  test() {
    // 创建模拟相机，具体路径格式参考
    // https://kaolayouran.feishu.cn/docx/JtQxdy15foYTSkxOGWscHHkqnTf
    let ids = await this.camera.mock(1, [
      'D:\\kl-storage\\egis\\localCamera\\test',
    ]);
    
    // 获取相机参数
    let params = await this.camera.getParams(ids[0]);
    console.log(params);
    
    // 模拟内触发采集
    this.camera.grabInternal(ids[0], (res) => {
      let { fno, bufferPtrVal, sn, id, height, width, channel } = res;
      console.log(res);
      // 使用kl-buffer处理图片
      let buffer = KLBuffer.alloc(width * height * channel, bufferPtrVal).buffer
      // 释放图片内存
      this.camera.freeImg(buffer)
    });
  }
}
```
### 4. 真实相机与模拟相机使用说明
#### 4.1 init
- init接口会初始化指定类型的所有实体相机，传入的参数types指定相机类型，不同类型之间以'|'号分隔，且若有多个同类型相机，仅输入一次<br>
  - eg1: 当有一个`海康GigE网口相机`和`CameraLink(CML)采集卡相机`时，输入'Hik|HikFG'
  - eg2: 当有2个`海康GigE网口相机`时，输入'Hik'
- 目前已支持的types类型包括：
  - Hik：所有海康GigE网口相机和USB口相机
  - HikFG：所有海康采集卡相机，比较常用的如CameraLink(CML)采集卡与CoaXPress(CXP)采集卡
#### 4.2 mock
- 该接口传入数组：多个文件或文件夹路径path，接口返回该模拟相机的id。模拟相机的id为负值，从-1开始依次递减。
- 初始化模拟相机时传入数组的path可以是一个文件，也可以是一个文件夹，path应该是其完整路径（支持中文路径），如果是文件夹则path应以'/'或'\'结尾。
  - eg: `camera.mock('D:\\kl-storage\\template\\camera\\mock1', 'D:\\kl-storage\\template\\camera\\mock2')`
  - 如果传入的path是文件，对应内触发模式，将该文件作为模拟相机内触发脚本文件
  - 如果path路径合法且存在但file文件不存在，则会首先创建该文件，之后可以手动对其修改
  - 创建脚本文件时，假设传入的路径为`/path/file`，则工作路径是`/path/`，会递归遍历该文件夹及子文件夹中所有的`.jpg`、`.png`和`.bmp`图片文件并列举在文件file中，并在起始和末尾分别加入了控制指令`:LOOP`和 `:END`构成一个无限循环<br>**具体规则查看 4.3**
  - 脚本文件中所有图片文件的路径均为相对于工作路径`/path`/的相对路径（因此`/path/img`会存为"img"），要加入文件夹之外的其他图片文件的话也应该以同样的相对路径方式添加
#### 4.3 内触发脚本文件
- 脚本文件无论采用何种扩展名，均需以文本格式存储
- 脚本文件中所有图片文件的路径均为相对于工作路径`/path/`的相对路径（因此`/path/sub/img`会存为`sub/img`），要加入文件夹之外的其他图片文件的话也应该以同样的相对路径方式添加
- 脚本中支持下列四个控制指令（控制指令以':'起始，因文件系统路径中严禁':'字符，便于与文件指令相区分）
  - `:INTERVAL n`（中间有一个空格）：设置出图间隔，n为非负整数值，单位毫秒ms。如果没有用`:INTERVAL`指令进行过设置，默认间隔为1000（1秒）。`:INTERVAL`指令可以出现在脚本中的任意一行，其设置从该行之后开始生效。例如有以下脚本
    ```
    :INTERVAL 1000
    img1
    :INTERVAL 500
    img2
    img3
    ```
    则img1-img2的出图间隔仍是1000ms，而img2-img3的出图间隔开始改为500ms
  - `:LOOP`或`:LOOP n`（中间有一个空格）：循环执行直到遇到:END指令。循环次数n为非负整数值，填0或不写（仅写`:LOOP`）表示无限循环。`:LOOP`与`:END`必须成对出现（除非中间有`:RETURN`强制终止）
  - `:END`：循环终止，必须与`:LOOP`成对出现
  - `:RETURN`：终止脚本执行。当有一个已经编辑好的脚本文件，只想测试其中前几幅图片但又不想重制脚本文件时可用
- 脚本文件加载过程会对上述语法规则进行严格检查，异常情况会有日志输出说明，注意查看日志提示信息
