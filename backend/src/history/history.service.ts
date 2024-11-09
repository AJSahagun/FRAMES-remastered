import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async create(createHistoryDto: CreateHistoryDto): Promise<any> {
    const schoolId = createHistoryDto.school_id;
    const timeIn = createHistoryDto.time_in;
    const timeOut = createHistoryDto.time_out;
    const encoding = JSON.stringify(createHistoryDto.encoding);

    try {
      if (timeOut) {
        await this.sql(
          `insert into history("school_id", "time_in", "time_out") values('${schoolId}', '${timeIn}', '${timeOut}')`,
        );
      } else {
        await this.sql(
          `insert into history("school_id", "time_in") values('${schoolId}', '${timeIn}')`,
        );
      }
    } catch (error) {
      throw new HttpException(
        `Error inserting history: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      await this.sql(
        `insert into encodings(school_id, encoding) values('${schoolId}', '${encoding}')`,
      );
    } catch (error) {
      throw new HttpException(
        `Error inserting encoding: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      await this.sql(
        `delete from encodings where uuid not in
        (select uuid from encodings where school_id= '${schoolId}' order by date_created desc limit 5)
        and school_id= '${schoolId}'`,
      );
    } catch (error) {
      throw new HttpException(
        `Error deleting old encodings: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException('Success', HttpStatus.ACCEPTED);
  }

  async findAll(): Promise<any> {
    return await this.sql(`SELECT * FROM history`);
  }
}
