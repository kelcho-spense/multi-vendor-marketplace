import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get()
  getHello(): string {
    return 'Api is running healthy!';
  }
}
