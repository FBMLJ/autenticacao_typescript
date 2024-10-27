import bcrypt from 'bcrypt';
const salt:number =parseInt(process.env.SALT_SIZE ? process.env.SALT_SIZE : "10");

export function criptoGraphPassword(senha: string) {
    return bcrypt.hashSync(senha,salt)
}

export async function verify(senha: string, senhaStored: string):Promise<boolean>{
    return await bcrypt.compare(senha, senhaStored);
}
