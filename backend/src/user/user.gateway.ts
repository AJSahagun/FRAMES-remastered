import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';

import { UserService } from './user.service';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { configDotenv } from 'dotenv';

configDotenv();
@WebSocketGateway({
  cors: {
    origin: process.env.FRAMES_FRONTEND_URL || '*'
  },
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server
  
  constructor(
      private eventEmitter: EventEmitter2
  ){}

  // jwt things
  private verifyToken(token: string): boolean {
    return token === 'valid-token'; // Replace with actual logic (e.g., JWT verification)
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token || !this.verifyToken(token)) {
      console.log('Unauthorized client disconnected');
      client.disconnect();
      return;
    }

    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }


  // sync client history to server
  @SubscribeMessage('syncEncodings')
  async onSyncEncodings(@MessageBody() latestId: number) {

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
  handleUserCreated(payload: { id_ai: number, date_created:string, name: string, school_id: string, encoding: number[] }){
    this.server.emit('onRegister', payload);
  }
}
