import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
      const stale_records=await this.sql(
        `delete from encodings where uuid not in
        (select uuid from encodings where school_id= '${schoolId}' order by date_created desc limit 5)
        and school_id= '${schoolId}' returning id_ai`,
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

  async filterByQuery():Promise<any>{
    const query=`
    WITH user_with_history AS (
      SELECT 
          u.school_id, 
          u.department, 
          u.program, 
          CONCAT(
            u.first_name,
            CASE 
              WHEN u.middle_name IS NOT NULL THEN ' ' || u.middle_name 
              ELSE '' 
            END,
            ' ', u.last_name, 
            CASE 
              WHEN u.suffix IS NOT NULL THEN ' ' || u.suffix 
              ELSE '' 
            END
          ) AS name, 
          json_agg(
            json_build_object(
              'time_in', h.time_in, 
              'time_out', h.time_out
            )
          ) AS history
      FROM users u
      JOIN history h ON u.school_id = h.school_id
      GROUP BY u.school_id, u.department, u.program, u.first_name, u.middle_name, u.last_name, u.suffix
  )
  SELECT 
      school_id, 
      name, 
      department, 
      program, 
      history
  FROM user_with_history
  WHERE 
      ($1::VARCHAR IS NULL OR school_id ILIKE '%' || $1 || '%')
      AND ($2::VARCHAR IS NULL OR name ILIKE '%' || $2 || '%')
      AND ($3::VARCHAR IS NULL OR department ILIKE '%' || $3 || '%')
      AND ($4::VARCHAR IS NULL OR program ILIKE '%' || $4 || '%');`
  }


  const 
}
