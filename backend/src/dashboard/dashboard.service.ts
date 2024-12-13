import { Inject, Injectable } from '@nestjs/common';
import { errorCatch } from '../core/config/errors';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class DashboardService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql:any,
    ){}

    async topVisitor(q:QueryDto){
        try {
            const params=[
                q.department ?? null,   
                q.program ?? null,   
                q.year ?? null,  
                q.month ?? null,   
                q.date ?? null
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
            LIMIT 1;`
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
    async uniqueVisitorsCount(){
        try {
            const query=`
                SELECT  
                    count(*)
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
            const query=`select round(avg(count),0) as avg from (
                    select count(*) from history
                    group by date(time_out))`
            const result= await this.sql(query)
            return result
        } catch (error) {
            errorCatch(error)
        }
    }
    async monthByDay(q:QueryDto){
        try {
            const params=[
                q.department ?? null,   
                q.program ?? null,   
                q.year ?? null,  
                q.month ?? null,
                q.limit ?? 30,
                q.offset ?? 0
            ]
            const query=`
                with extracted_date as(
                    SELECT COUNT(*), time_out::date
                    FROM history h
                    JOIN users u ON u.school_id = h.school_id 
                    WHERE
                    ($1::VARCHAR IS NULL OR u.department ILIKE '%' || $1 || '%')
                    AND ($2::VARCHAR IS NULL OR u."program" ILIKE '%' || $2 || '%')
                    AND ($3::integer IS NULL OR h.time_out_year = $3)
                    AND ($4::integer IS NULL OR h.time_out_month = $4)
                    GROUP BY time_out::date
                    ORDER BY time_out ASC
                )
                SELECT TO_CHAR(time_out, 'YYYY-MM-DD') AS date, count as visitors from extracted_date limit $5 offset $6`
            const result = await this.sql(query, params)  
            return result
        } catch (error) {
            errorCatch(error)
        }
    }
    async allProgramMonthByDay(year:number, month:number){
        try {
            const query=`
           with daily_count as(
                select count(*), u.program, u.department, h.time_out_day as day
                from history h join users u on u.school_id = h.school_id
                where h.time_out_year= $1 and h.time_out_month=$2
                group by program, department, day 
            ),

            group_by_program as(
                select TO_CHAR(DATE '2000-01-01' + ($2 - 1) * INTERVAL '1 month', 'FMMonth') as month, 
                $1::text as year,  
                program, department,
                case 
                	when department='CICS' then '#302977'
                	when department='COE' then '#C30D26'
                	when department='CET' then '#FFAE4C'
                	when department='CAFAD' then '#8BA757'
                	else '#7C7070'
                end as color,
                
                sum(count) as visitors, 
                jsonb_object_agg(day, count) as "dailyVisitors"
                from daily_count
                group by program, department
            )
            select * from group_by_program
            `
            const result= await this.sql(query, [year,month])
            return result
        } catch (error) {
            errorCatch(error)
        }
    }
    async yearByMonth(year:number){
        try {
            const query=`
                SELECT 
                    count(*),
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
    async visitorCountPerDepartment(q:QueryDto){
        try {
            const params=[
                q.department ?? null,   
                q.program ?? null,   
                q.year ?? null,  
                q.month ?? null,   
                q.date ?? null,
            ]
            const query=`
                SELECT 
                    COUNT(*), coalesce(u.department,'Faculty') as department
                FROM history h
                join users u on u.school_id = h.school_id 

                where 
                ($1::VARCHAR IS NULL OR u.department ILIKE '%' || $1 || '%')
                AND ($2::VARCHAR IS NULL OR u."program" ILIKE '%' || $2 || '%')
                AND ($3::integer IS NULL OR h.time_out_year = $3)
                AND ($4::integer IS NULL OR h.time_out_month = $4)
                AND ($5::VARCHAR IS NULL OR h.time_out::DATE = $5::DATE)
                GROUP BY u.department
                ORDER BY count desc
            `
            const result= await this.sql(query, params)
            return result
        } catch (error) {
            errorCatch(error)
        }
    }
}
