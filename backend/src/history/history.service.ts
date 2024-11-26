import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @Inject('POSTGRES_POOL') private readonly sql:any,
  ){}


  async create(createHistoryDto: CreateHistoryDto[]):Promise<any> {
    try {
      const historyValues = createHistoryDto.map((dto) => {
        const timeIn = dto.time_in;
        const timeOut = dto.time_out || null;
        return `('${dto.school_id}', '${timeIn}', ${timeOut ? `'${timeOut}'` : 'NULL'})`;
      });

      const historyInsertQuery = `
        INSERT INTO history ("school_id", "time_in", "time_out")
        VALUES ${historyValues.join(', ')};
      `;

      await this.sql(historyInsertQuery);
      return { success: true, message: 'Bulk data processed successfully' };
    } catch (error) {
      console.log(error)
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll():Promise<any> {
    return await this.sql(`SELECT * FROM history`);
  }

  async findLatestHistory(): Promise<any> {
    return await this.sql(`select id_ai from history order by id_ai desc limit 1`);
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
