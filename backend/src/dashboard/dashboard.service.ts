import { Inject, Injectable } from '@nestjs/common';
import { FindTopVisitorDto } from './dto/find-top-visitor.dto';
import { errorCatch } from '../core/config/errors';

@Injectable()
export class DashboardService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql:any,
    ){}

    async topVisitor(q:FindTopVisitorDto){
        try {
            const params=[
                q.department ?? null,   
                q.program ?? null,   
                q.year ?? null,  
                q.month ?? null,   
                q.date ?? null,
            ]
            const query=`
            with count_visit as(
                SELECT 
                    COUNT(*) AS total_count, 
                    u.school_id, 
                    u.first_name, 
                    u.middle_name, 
                    u.last_name, 
                    u.department, 
                    u."program"
                FROM history h
                JOIN users u ON u.school_id = h.school_id 
                WHERE 
                    ($1::VARCHAR IS NULL OR u.department ILIKE '%' || $1 || '%')
                    AND ($2::VARCHAR IS NULL OR u."program" ILIKE '%' || $2 || '%')
                    AND ($3::integer IS NULL OR EXTRACT(YEAR FROM h.time_out) = $3)
                    AND ($4::integer IS NULL OR EXTRACT(MONTH FROM h.time_out) = $4)
                    AND ($5::VARCHAR IS NULL OR h.time_out::DATE = $5::DATE)
                GROUP BY u.school_id, u.first_name, u.middle_name, u.last_name, u.department, u."program"
            )
            SELECT 
                total_count, 
                format_name(first_name, middle_name, last_name) AS name,
                school_id, 
                department, 
                "program"
            FROM count_visit
            ORDER BY total_count DESC 
            LIMIT 1;

            `
            const result=await this.sql(query,params)
            return result
        } catch (error) {
            console.log(error)
            errorCatch(error)
        }
    }
    async avgOccupancy(){
        try {
            const query=`select avg(time_out-time_in) from history h`
            const result = await this.sql(query)  
            return result
        } catch (error) {
            errorCatch(error)
        }
    }
    async monthByDay(month:number, year:number){
        try {
            const query=`
                SELECT COUNT(*), time_out::date
                FROM history h
                WHERE time_out >= MAKE_DATE($1, $2, 1) 
                AND time_out < MAKE_DATE($1, $2, 1) + INTERVAL '1 month' 
                GROUP BY time_out::date
                ORDER BY time_out ASC;`
            const result = await this.sql(query, [year,month])  
            console.log(result)
            return result
        } catch (error) {
            errorCatch(error)
        }
    }
    async yearByMonth(year:number){
        try {
            const query=`
                SELECT 
                    COUNT(*),
                    to_char(DATE_TRUNC('month', h.time_out), 'fmmonth') AS month
                FROM history h
                WHERE EXTRACT(YEAR FROM h.time_out) = $1
                GROUP BY DATE_TRUNC('month', h.time_out)
                ORDER BY count desc
            `
            const result= await this.sql(query, [year])
            return result
        } catch (error) {
            errorCatch(error)
        }
    }
    async visitorPerDepartment(department:string){
        try {
            const query=`
                SELECT 
                    COUNT(*), u.department
                FROM history h
                join users u on u.school_id = h.school_id 

                where ($1::VARCHAR IS NULL OR u.department ILIKE '%' || $1 || '%')
                GROUP BY u.department
                ORDER BY count desc
            `
            const result= await this.sql(query, [department])
            return result
        } catch (error) {
            errorCatch(error)
        }
    }
    async uniqueVisitors(){
        try {
            const query=`
                SELECT  
                    h.school_id
                FROM history h
                GROUP BY h.school_id
                HAVING COUNT(*) = 1;
            `
            const result= await this.sql(query)
            return result
        } catch (error) {
            errorCatch(error)
        }
    }
    async avgDailyVisitor(){
        try {
            const query=`select avg(count) from (
                    select count(*) from history
                    group by date(time_out))`
            const result= await this.sql(query)
            return result
        } catch (error) {
            errorCatch(error)
        }
    }

    
}
