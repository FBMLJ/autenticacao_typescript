
import { Response } from "express";
import jwt from "jsonwebtoken";
import { Unauthorized } from "projeto_erros_padroes";
const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Mantenha isso seguro!
export function generateToken(userObj: any): string {
    const token = jwt.sign(userObj, secretKey, { expiresIn: process.env.DURACAO_TOKEN }); // Define o tempo de expiração
    return token;
}

export function setTokenHeader(userObj: any, res: Response): void{
    const token = generateToken(userObj);
    res.setHeader("authorization", `Bearer ${token}`)
}

export function verifyToken(req: any): Promise<any>{
    const token: string = req.headers["authorization"]?.split(" ")[1];
    
    return new Promise((resolve, reject)=> {
        if (!token){
            return reject()
        }
        try{
            resolve(jwt.verify(token, secretKey))
        }
        catch(e){
            reject();
        }

    })
}

export function loggin(){
    return function (_: any, __: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: any, res: Response) {
            try {

                const user =  await verifyToken(req);
                req.user = user;
                return originalMethod.apply(this, [req,res]);
            }
            catch(err){
                throw new Unauthorized();
            }

        };

        return descriptor;
    };
}