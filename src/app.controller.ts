import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  @Public()
  @Get()
  getRoot(): string {
    return 'ok';
  }
}
