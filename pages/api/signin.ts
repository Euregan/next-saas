import { handle, visitor } from "@/libs/endpoint";
import jwt from "@/libs/jwt";
import Result from "@/libs/Result";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { z } from "zod";

const prisma = new PrismaClient();

export default handle({
  post: visitor(
    async ({ email, password }) => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          account: true,
        },
      });

      if (!user) {
        return Result.err({
          code: 401,
          message: "Either the email or the password is invalid",
        });
      }

      const matches = await argon2.verify(user.password, password);
      if (!matches) {
        return Result.err({
          code: 401,
          message: "Either the email or the password is invalid",
        });
      }

      return Result.ok({
        token: jwt.create({
          id: user.id,
          email: user.email,
          accountId: user.account.stripeId,
        }),
      });
    },
    z.object({
      email: z.string(),
      password: z.string(),
    })
  ),
});
