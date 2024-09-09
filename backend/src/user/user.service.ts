import { HttpCode, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}
  async create(createUserDto: CreateUserDto) {
    try {
      await this.sql(
        `INSERT INTO users(first_name, middle_name, last_name, sr_Code, department, program) 
        values('${createUserDto.firstName}','${createUserDto.middleName}','${createUserDto.lastName}', '${createUserDto.srCode}', '${createUserDto.department}', '${createUserDto.program}')
        `
      )

      await this.sql(
        `INSERT INTO encodings(encoding, sr_code) 
        values('${JSON.stringify(createUserDto.encoding)}','${createUserDto.srCode}')
        `
      )

    } catch (error) {
      if(error.code === '23505') throw new HttpException('Existing srCode', HttpStatus.CONFLICT)
      else throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    throw new HttpException('Success', HttpStatus.ACCEPTED)
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
}
