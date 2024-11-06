import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @Inject('POSTGRES_POOL') private readonly sql:any,
  ){}


  async create(createHistoryDto: CreateHistoryDto):Promise<any> {
    const schoolId=createHistoryDto.schoolId
    const timeIn=createHistoryDto.timeIn
    const timeOut=createHistoryDto.timeOut
    const encoding = JSON.stringify(createHistoryDto.encoding);

    try {
      // insert history
      timeOut ? await this.sql(
        `insert into history("school_id", "time_in", "time_out") values('${schoolId}','${timeIn}','${timeOut}')
        `)
      : await this.sql(
        `insert into history("school_id", "time_in") values('${schoolId}','${timeIn}')
        `)

      // insert recent encodings
      await this.sql(
        `insert into encodings(school_id, encoding) values('${schoolId}', '${encoding}')
        `)

      // delete old encodings
      await this.sql(
        `delete from encodings where uuid not in
        (select uuid from encodings where school_id= '${schoolId}' order by date_created desc limit 5)
        and school_id= '${schoolId}'
      `)
        
    } catch (error) {
      console.log(error)
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('Success', HttpStatus.ACCEPTED);
  }

  async findAll():Promise<any> {
    return await this.sql(`SELECT * FROM history`);
  }

}
