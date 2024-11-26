import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { UserService } from './user.service';
import { Server } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { configDotenv } from 'dotenv';

configDotenv();
@WebSocketGateway({
  cors: {
    origin: process.env.FRAMES_FRONTEND_URL || '*'
  },
})
export class UserGateway {
  @WebSocketServer()
  server: Server
  
  constructor(
      private eventEmitter: EventEmitter2
  ){}


  // sync client history to server
  @SubscribeMessage('syncEncodings')
  async onSyncEncodings(@MessageBody() latestId: number) {
    // const latestEncodings =await this.userService.findAllEncodings(latestId)

    return new Promise((resolve,reject)=>{
      this.eventEmitter.emit('syncEncodings',latestId, (result)=>{
        if(result.success){
          resolve(result.data)
          this.server.emit('onSync', result.data);
        }
        else reject(result.error)
      })
    })
  }

  @OnEvent('onRegister')
  handleUserCreated(payload: { id_ai: number, name: string, school_id: string, encoding: number[] }){
    const { id_ai, name, school_id, encoding } = payload;
    this.server.emit('onRegister', {id_ai, name, school_id, encoding});
  }
}
