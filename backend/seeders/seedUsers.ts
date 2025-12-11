import { PrismaClient } from "@prisma/client";  
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

    await prisma.user.deleteMany(); 

    const users = [
        {
            name: 'Yeferson', email: 'yeferson@gmail.com', password: bcrypt.hashSync('123456', 10),

        },{
            name: 'Brayan', email: 'brayan@gmail.com', password: bcrypt.hashSync('123456', 10)
        }
    ]

    for(const user  of users){
        await prisma.user.create({data: user})
    }

    console.log('Users seeded Creados con contraseñas hasheadas'); 
    
}

main()
.catch((e) =>console.error(e))
.finally(() => prisma.$disconnect());
