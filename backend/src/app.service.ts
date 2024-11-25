import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  getHello():string {
    return `Welcome to FRAMES backend`
  }
}
