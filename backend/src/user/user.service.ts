import {
  forwardRef,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Module,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserGateway } from './user.gateway';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(
    @Inject('POSTGRES_POOL') private readonly sql: any,
    // @Inject(forwardRef(()=>UserGateway)) private readonly syncEncodingsGateway:UserGateway
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const name = `${createUserDto.firstName} ${createUserDto.middleName} ${createUserDto.lastName}`;
    const srCode = createUserDto.srCode;
    const encoding = JSON.stringify(createUserDto.encoding);

    try {
      await this.sql(
        `INSERT INTO users(first_name, middle_name, last_name, sr_Code, department, program)
        values('${createUserDto.firstName}','${createUserDto.middleName}','${createUserDto.lastName}', '${createUserDto.srCode}', '${createUserDto.department}', '${createUserDto.program}')
        `,
      );

      const idAi = await this.sql(
        `INSERT INTO encodings(encoding, sr_code)
        values('${encoding}','${createUserDto.srCode}')
        returning id_ai
        `,
      );
      this.eventEmitter.emit('onRegister', {
        id: idAi[0]['id_ai'],
        name,
        srCode,
        encoding,
      });
    } catch (error) {
      if (error.code === '23505')
        throw new HttpException('Existing srCode', HttpStatus.CONFLICT);
      else
        throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    throw new HttpException('Success', HttpStatus.ACCEPTED);
  }

  async findAll(): Promise<any[]> {
    return await this.sql(`SELECT * FROM users`);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  @OnEvent('syncEncodings')
  async findAllEncodings(latestId: number, callback: (result: any) => void) {
    try {
      const latestEncodings = await this.sql(
        `SELECT concat(u.first_name, ' ', u.middle_name, ' ', u.last_name) as name, e.id_ai as "idAi", e.sr_code as "srCode", e."encoding" from encodings e 
        left join users u on e.sr_code = u.sr_code
        where e.id_ai > ${latestId}`,
      );
      callback({ success: true, data: latestEncodings });
    } catch (error) {
      callback({ success: false, error });
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
