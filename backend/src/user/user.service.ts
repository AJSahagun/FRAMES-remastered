import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserV2Dto } from './dto/create-user-v2.dto';

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
        `INSERT INTO users(first_name, middle_name, last_name, school_id, department, program)
        values('${createUserDto.firstName}',${createUserDto.middleName ? `'${createUserDto.middleName}'` : 'NULL'},'${createUserDto.lastName}', '${createUserDto.srCode}', '${createUserDto.department}', '${createUserDto.program}')
        `,
      );

      const idAi = await this.sql(
        `INSERT INTO encodings(encoding, school_id)
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

  async createV2(createUserDto: CreateUserV2Dto) {
    const name = `${createUserDto.first_name} ${createUserDto.middle_name} ${createUserDto.last_name}`;
    const schoolId = createUserDto.school_id;
    const encoding = JSON.stringify(createUserDto.encoding);

    try {
      await this.sql(`
        INSERT INTO users(first_name, middle_name, last_name, school_id, department, program)
        VALUES (
          '${createUserDto.first_name}',
          ${createUserDto.middle_name ? `'${createUserDto.middle_name}'` : 'NULL'},
          '${createUserDto.last_name}',
          '${createUserDto.school_id}',
          '${createUserDto.department}',
          '${createUserDto.program}'
        )
    `);
    

      const idAi = await this.sql(
        `INSERT INTO encodings(encoding, school_id)
        values('${encoding}','${createUserDto.school_id}')
        returning id_ai
        `,
      );
      this.eventEmitter.emit('onRegister', {
        id: idAi[0]['id_ai'],
        name,
        schoolId,
        encoding,
      });
    } catch (error) {
      if (error.code === '23505')
        throw new HttpException('Existing school Id', HttpStatus.CONFLICT);
      else
        throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    throw new HttpException('Success', HttpStatus.ACCEPTED);
  }

  async findAll(): Promise<any[]> {
    return await this.sql(`SELECT * FROM users`);
  }

  @OnEvent('syncEncodings')
  async findAllEncodings(latestId: number, callback: (result: any) => void) {
    try {
      const latestEncodings = await this.sql(
        `SELECT concat(u.first_name, ' ', u.middle_name, ' ', u.last_name) as name, e.id_ai as "idAi", e.school_id as "schoolId", e."encoding" from encodings e 
        left join users u on e.school_id = u.school_id
        where e.id_ai > ${latestId}`,
      );
      callback({ success: true, data: latestEncodings });
    } catch (error) {
      callback({ success: false, error });
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
