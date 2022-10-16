import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

/* Create */
export const create = async (ctx) => {
    ctx.request.body.password = await bcrypt.hash(ctx.request.body.password, 10);
    const data = ctx.request.body;

    try {
        const { password, ...user } = await prisma.user.create({ data })

        ctx.body = user;
        ctx.status = 201;
    } catch (error) {
        ctx.status = 500;
        ctx.body = error;
        console.log(error);
    }
}

/* Login */
export const login = async (ctx) => {
    const [type, token] = ctx.headers.authorization.split(" ");
    const [email, plainTextPassword] = atob(token).split(":");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        ctx.status = 404;
        return
    }

    const passwordMatch = await bcrypt.compare(plainTextPassword, user.password);
    if (!passwordMatch) {
        ctx.status = 404;
        return
    }

    const { password, ...result } = user;

    const accessToken = jwt.sign({
        sub: user.id,
        name: user.name,
        expiresIn: "1d"
    }, process.env.JWT_SECRET);

    ctx.body = {
        user: result,
        accessToken
    }
}

/* List */
export const hunches = async (ctx) => {
    const username = ctx.request.params.username;

    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) {
        ctx.status = 404;
        return
    }

    try {
        const hunches = await prisma.hunch.findMany({ where: { userId: user.id } })

        ctx.body = {
            hunches,
            user: user.name
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = error;
        console.log(error);
    }
}