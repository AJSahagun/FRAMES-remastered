import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { UserService } from './user.service';
import { Server } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class UserGateway {
  @WebSocketServer()
  server: Server
  
  constructor(
      // @Inject(forwardRef(()=>UserService)) private readonly userService:UserService
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

  // @OnEvent('syncEncodings')
  // handleEncodingsSync(idAi:number, name:string, srCode:string, encoding:string){
  //   this.server.emit('onMessage', {idAi, name, srCode, encoding});
  // }

  @OnEvent('onRegister')
  handleUserCreated(idAi:number, name:string, srCode:string, encoding:string){
    this.server.emit('onMessage', {idAi, name, srCode, encoding});
  }

  // @SubscribeMessage('newMessage')
  // onNewMessage(@MessageBody() body: any) {
  //   console.log(body);

  //   // from server to 
  //   // this.server.emit('onMessage', {
  //   //   message: 'New registered encoding',
  //   //   content: body,
  //   // });
  // }
}
