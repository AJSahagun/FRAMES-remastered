import { Inject, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
        private jwtService:JwtService
    ){}

    async validateUser(authPayload: AuthPayloadDto){
        const username=authPayload.username
        const pwd=authPayload.password

        const query= `SELECT * FROM accounts WHERE username = $1`;
        const users = await this.sql(query,[username]);

        if (users.length > 0) {
            const user = users[0];
            const isMatch = await bcrypt.compare(pwd, user.password);
            if(!isMatch) return { error:{code:404}}
            const {password, uuid, ...woPAss}=user
            
            
            return {token:this.jwtService.sign(woPAss)}
        }
        return { error: {code:404}}
    }
}
