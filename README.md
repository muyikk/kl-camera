## Description

nestjs 通用模块示例

## Usage

### Installation

```bash
$ npm install @koala1/hello
```

```typescript
// app.module.ts
import { HelloModule } from '@koala1/hello';

@Module({
  imports: [
    HelloModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

// app.service.ts
import { HelloService } from '@koala1/hello'
@Injectable()
export class AppService {
  constructor(
    public helloService: HelloService,
  ) {
    console.log(this.helloService.getHello()) // Hello
  }
}
```

## API

```typescript
// HelloService
getHello(): string;
```

## Router

```typescript
// hello/getHello
```

## Publish

发布方法参考 [PUBLISH.md](PUBLISH.md)
