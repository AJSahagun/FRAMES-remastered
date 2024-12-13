import { HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { errorCatch } from '../core/config/errors';

@Injectable()
export class ConfigurationService {
  constructor(
    @Inject('POSTGRES_POOL') private readonly sql: any,
  ){}

  async getTos(){
    try {
      const data = await this.sql(`select value from configurations where key='tos' order by created_at desc limit 1`)
      if(data.length<1) throw new NotFoundException('no configured TOS yet')
      return data[0].value
    } catch (error) {
      errorCatch(error)
    }
  }

  async getMaxOccupants(){
    try {
      const data = await this.sql(`select value from configurations where key='max_occupants' order by created_at desc limit 1`)
      if(data.length<1) throw new NotFoundException('no configured max occupants yet')
      return data[0].value
    } catch (error) {
      errorCatch(error)
    }
  }

  async changeTos(tos:string){
    const query=`insert into configurations("key",value) values('tos', $1)`
    return await this.sql(query,[tos])
  }

  async changeMaxOccupants(max:number){
    const query=`insert into configurations("key",value) values('max_occupants', $1)`
    return await this.sql(query,[max])
  }

  async create(createConfig: CreateConfigurationDto) {
    if(createConfig.tos){
      try {
        await this.changeTos(createConfig.tos)
      } catch (error){
        errorCatch(error)
      }
    }
    if(createConfig.max_occupants){
      try {
        await this.changeMaxOccupants(createConfig.max_occupants)
      } catch (error) {
        errorCatch(error)
      }
    }
  }

  findAll() {
    return `This action returns all configuration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configuration`;
  }

  update(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    return `This action updates a #${id} configuration`;
  }

  remove(id: number) {
    return `This action removes a #${id} configuration`;
  }
}
