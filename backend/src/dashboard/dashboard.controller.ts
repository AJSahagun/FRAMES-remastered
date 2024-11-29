import { BadRequestException, Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Role } from '../core/config/role.enum';
import { Roles } from '../core/decorators/roles/roles.decorator';
import { FindTopVisitorDto } from './dto/find-top-visitor.dto';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@Roles(Role.Dev, Role.Admin, Role.Librarian)
export class DashboardController {
    constructor(
        private readonly dashboardService:DashboardService
    ){}

    @Get('top-visitor')
    topVisitor(@Query() query:FindTopVisitorDto){
        try {
            return this.dashboardService.topVisitor(query)
        } catch (error) {
            throw error
        }
    }

    @Get('avg-occupancy')
    avgOccupancy(){
        try {
            return this.dashboardService.avgOccupancy()
        } catch (error) {
            throw error
        }
    }
    @Get('month-by-day')
    monthByDay(@Query('month') month:number, @Query('year') year:number){
        if (month === undefined || year === undefined) throw new BadRequestException('Query parameter "year and month" is required.');
        try {
            return this.dashboardService.monthByDay(month, year)
        } catch (error) {
            throw error
        }
    }

    @Get('year-by-month')
    yearByMonth(@Query('year', ParseIntPipe) year:number){
        if (year === undefined) {
            throw new BadRequestException('Query parameter "year" is required.');
        }
        try {
            return this.dashboardService.yearByMonth(year)
        } catch (error) {
            throw error
        }
    }

    @Get('visitor-per-department')
    visitorPerDepartment(@Query('department') department:string){
        try {
            return this.dashboardService.visitorPerDepartment(department)
        } catch (error) {
            throw error
        }
    }

    @Get('unique-visitor-count')
    uniqueVisitors(){
        try {
            return this.dashboardService.uniqueVisitors()
        } catch (error) {
            throw error
        }
    }
    @Get('avg-daily-visitor')
    avgDailyVisitor(){
        try {
            return this.dashboardService.avgDailyVisitor()
        } catch (error) {
            throw error
        }
    }
}
