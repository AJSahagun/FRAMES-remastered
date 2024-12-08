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
}
