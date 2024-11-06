# 考拉悠然公用相机模块
nestjs通用相机模块，多线程调用c++相机dll<br>
配合该文档食用<br>
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

- 初始化线程池中的工具函数
  ！！！（在使用其他方法前调用它！）！！！

```typescript
  /**
   * 初始化线程池中的工具函数
   */
  public async initPool()
```

- 释放图片内存！！！（在使用完图片后必须调用，否则内存溢出）！！！
```typescript
  /**
   * 释放图片内存
   * @param buffer 要释放的图片buffer
   */
  public free(buffer: any): undefined 
```

- 创建真实相机

```typescript
  /**
   * 创建真实相机
   * @param types 相机类型
   * @returns 枚举相机数量
   */
  public async init(types: string): Promise<unknown>
```

- 创建模拟相机

```typescript
  /**
   * 创建模拟相机
   * @param count 模拟相机数量
   * @param cameraPAthList 模拟相机路径
   * @returns 模拟相机id列表
   */
  public async mock(count: number, cameraPAthList: Array<string>): Promise<number[]>
```

- 获取相机参数

```typescript
  /**
   * 获取相机参数
   * @param id 相机ID
   * @returns
   */
  public async getParams(id: number): Promise<any>
```

- 内触发采集

```typescript
  /**
   * 内触发采集
   * @param id 相机id
   */
  public grabInternal(id: number): undefined
```

- 外触发采集

```typescript
  /**
   * 外触发采集
   * @param id 相机id
   */
  public grabExternal(id: number): undefined
```

- 单次采集

```typescript
  /**
   * 单次采集
   * @param id 相机id
   */
  public grabOnce(id: number)
```

- 停止采集

```typescript
  /**
   * 停止采集
   * @param id 相机id
   */
  public grabStop(id: number): undefined
```

- 出图回调函数

```typescript
  /**
   * 回调函数，用于出图
   * @param callback
   */
  public grabbed(callback: any): undefined
```
- 相机畸变校正

```typescript
  /**
   * 相机畸变校正
   * @param id 相机id
   * @param params 畸变校正参数,为NULL时取消校正  [0-3]相机内参 [4]外参数量(4/5/8/12/14) [5-end]畸变外参
   * @returns true:成功, false:失败
   */
  public async cameraUndistort({ id, params })
```
- 设置曝光时间

```typescript
  /**
   * 设置曝光时间
   * @param id 相机id
   * @param time 曝光时间
   * @returns true:成功, false:失败
   */
  public async setExposureTime({ id, time })
```
- 获取曝光时间

```typescript
  /**
   * 获取曝光时间
   * @param id 相机id
   * @returns time 曝光时间，return false => 失败
   */
  public async getExposureTime(id: number)
```

### 3. 示例

```typescript
import { CameraService } from 'kl-camera';

const cameraService = new CameraService(dllPath);
// 在使用前先调用初始化线程和工具类
await cameraService.initPool();
// 创建模拟相机，具体路径格式参考
// https://kaolayouran.feishu.cn/docx/JtQxdy15foYTSkxOGWscHHkqnTf
let id = await cameraService.mock(1, [
  'D:\\kl-storage\\egis\\localCamera\\test',
]);
// 获取相机参数
let params = await cameraService.getParams(id);
console.log(params);
// 执行回调函数取图
cameraService.grabbed((res) => {
  let { buffer, sn, id, height, width, channel } = res;
  console.log(res);
});
// 模拟内触发采集
cameraService.grabInternal(id);
```
