import { Injectable } from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
    async findAll(){
        return prisma.user.findMany({
            select:{
                id:true,
                name:true,  
                email:true, 
                password:false,
            }
        });
    }   
}
