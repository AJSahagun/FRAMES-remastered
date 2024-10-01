import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @Inject('POSTGRES_POOL') private readonly sql:any,
  ){}


  async create(createHistoryDto: CreateHistoryDto):Promise<any> {
    const srCode=createHistoryDto.srCode
    const timeIn=createHistoryDto.timeIn
    const timeOut=createHistoryDto.timeOut

    try {
      const res = timeOut ? await this.sql(`insert into history("sr_code", "time_in", "time_out") values('${srCode}','${timeIn}','${timeOut}')`)
      : await this.sql(`insert into history("sr_code", "time_in") values('${srCode}','${timeIn}')`)
      
    } catch (error) {
      console.log(error)
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('Success', HttpStatus.ACCEPTED);
  }

  async findAll():Promise<any> {
    return await this.sql(`SELECT * FROM history`);
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }
}
