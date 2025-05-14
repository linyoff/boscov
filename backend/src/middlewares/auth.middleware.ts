import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//tokens inválidos
const blacklist: string[] = [];

//verifica se o token esta na lista de invalidos
export function verifyToken(token: string): jwt.JwtPayload | string {
  if (blacklist.includes(token)) {
    throw new Error("Token inválido");
  }
  return jwt.verify(token, process.env.SECRET_JWT as string);
}

//adiciona token à blacklist
export function blackListToken(token: string): void {
  blacklist.push(token);
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  //pega o token do cabeçalho da req divide a string em ["Bearer", "<token>"] e acessa o segundo elemento da array
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
   res.status(401).json({ message: "Token não fornecido" });
   return;
  }

  try {
    if (!process.env.SECRET_JWT) throw new Error("SECRET_JWT não definido!");
    //verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.SECRET_JWT as string) as {
      id: number;
      email: string;
      tipoUsuario: string;
      nome: string;
    };

    res.locals.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
    return ;
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = res.locals.user;

  if(!user) {
    res.status(401).json({ message: "Usuário não autenticado" });
    return;
  }

  if(user.userType !== "ADMIN") {
    res.status(403).json({ message: "Acesso negado" });
    return;
  }

  next();
}


