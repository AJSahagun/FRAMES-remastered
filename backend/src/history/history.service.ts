import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { FindHistoryDTO } from './dto/find-history.dto';
import { errorCatch } from '../core/config/errors';

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

  async filterByQuery(q: FindHistoryDTO):Promise<any>{
    const query=`
     WITH filtered_history AS (
        SELECT 
            school_id,
            json_agg(
                json_build_object(
                    'time_in', time_in,
                    'time_out', time_out
                )
            ) AS filtered_history
        FROM history h
        WHERE 
            ($1::DATE IS NULL OR time_in::DATE = $1)
            AND ($2::INTEGER IS NULL OR time_out_year = $2)
            AND ($3::INTEGER IS NULL OR time_out_month = $3)
            
        GROUP BY school_id
      ),

      user_history AS (
          SELECT
              u.school_id,
              u.department,
              u.program,
              format_name(u.first_name, u.middle_name, u.last_name, u.suffix) AS name,
              fh.filtered_history AS history
          FROM users u
          JOIN filtered_history fh ON u.school_id = fh.school_id
      )
      SELECT
          school_id,
          name,
          department,
          program,
          history
      FROM user_history
      WHERE 
          ($4::VARCHAR IS NULL OR school_id ILIKE '%' || $4 || '%')
          AND ($5::VARCHAR IS NULL OR name ILIKE '%' || $5 || '%')
          AND ($6::VARCHAR IS NULL OR department ILIKE '%' || $6 || '%')
          AND ($7::VARCHAR IS NULL OR program ILIKE '%' || $7 || '%')
      LIMIT $8 OFFSET $9`

    try {
      // catch undefined queries
      const filtered = [
          q.date ?? null,     
          q.year ?? null, 
          q.month ?? null,
          q.school_id ?? null,
          q.name ?? null,
          q.department ?? null,
          q.program ?? null,
          q.limit ?? 10,
          q.offset ?? 0,
      ];
      const result= await this.sql(query, filtered)
      return result

    } catch (error) {
      errorCatch(error)
    }
  }
  
}
