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

  // I can't DRYify this. Is it to have descriptive properties and naming convention to each version
  async create(createUserDto: CreateUserDto):Promise<{errors:any}> {

    const first_name= createUserDto.firstName
    const last_name= createUserDto.lastName
    const sr_code= createUserDto.srCode
    const middle_name= createUserDto.middleName
    const suffix= createUserDto.suffix
    const department= createUserDto.department
    const program= createUserDto.program
    const encoding= createUserDto.encoding
    const name= `${first_name} ${middle_name?middle_name+" ":""}${last_name}${suffix?" "+suffix:""}`.trim()


    const {error:saveError}= await this.saveUser(first_name, last_name, sr_code, middle_name, suffix, department, program);
    if(saveError) return saveError
    const {error:syncError}= await this.syncEncoding(name, encoding, sr_code);
    if(syncError) return syncError
    
    return null
  }
  async createV2(createUserDto: CreateUserV2Dto):Promise<{errors:any}>  {
    const first_name= createUserDto.first_name
    const last_name= createUserDto.last_name
    const school_id= createUserDto.school_id
    const middle_name= createUserDto.middle_name
    const suffix= createUserDto.suffix
    const department= createUserDto.department
    const program= createUserDto.program
    const encoding= createUserDto.encoding

    const name= `${first_name} ${middle_name?middle_name+" ":""}${last_name}${suffix?" "+suffix:""}`.trim()

    const {error:saveError}= await this.saveUser(first_name, last_name, school_id, middle_name, suffix, department, program);
    if(saveError) return saveError
    const {error:syncError}= await this.syncEncoding(name, encoding, school_id);
    if(syncError) return syncError
    
    return null
  }

  async saveUser(first_name:string, last_name:string, school_id:string, middle_name?:string, suffix?:string, department?:string, program?:string): Promise<{ error: any }>{
    try {
      const user = await this.sql(
        `
        INSERT INTO users (first_name, last_name, school_id, middle_name, suffix, department, program)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          first_name,
          last_name,
          school_id,
          middle_name || null,
          suffix || null,
          department || null,
          program || null,
        ],
      );
      return { error: null };
    } catch (error) {
      return {error}
    }
  }

  async syncEncoding(name:string, encoding:number[], school_id:string): Promise<{ error:any }>{
    try {
      const idAi = await this.sql(
        `INSERT INTO encodings(encoding, school_id)
        values('${encoding}','${school_id}')
        returning id_ai
        `,
      );
      this.eventEmitter.emit('onRegister', {
        idAi: idAi[0]['id_ai'],
        name,
        school_id,
        encoding,
      });

      return {error:null}
    } catch (error) {
      return {error}
    }
  }
  async findAll(): Promise<any[]> {
    return await this.sql(`SELECT * FROM users`);
  }

  async findOne(school_id:string): Promise<any>{
    try {
      const user = await this.sql(
        `select * from users where school_id=$1`,[school_id],
      );
      if (user.length==0) return {error:404}
      return user;
    } catch (error) {
      return {error}
    }
  }

  @OnEvent('syncEncodings')
  async findAllEncodings(latestId: number, callback: (result: any) => void) {
    try {
      const latestEncodings = await this.sql(
        `SELECT 
          concat(
              u.first_name, 
              CASE 
                  WHEN u.middle_name IS NOT NULL THEN ' ' || u.middle_name 
                  ELSE '' 
              END, 
              ' ', 
              u.last_name
          ) AS name, 
          e.id_ai AS "idAi", 
          e.school_id AS "schoolId", 
          e."encoding" 
      FROM 
          encodings e
      LEFT JOIN 
          users u ON e.school_id = u.school_id
      WHERE 
          e.id_ai > ${latestId};`,
      );
      callback({ success: true, data: latestEncodings });
    } catch (error) {
      callback({ success: false, error });
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
