import Result from "@/libs/Result";
import { authentified, handle } from "@/libs/endpoint";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import jsonwebtoken from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

export default handle({
  get: authentified(async (user) =>
    "key" in user
      ? Result.err({
          code: 401,
          message: "Only users can list API keys",
        })
      : Result.ok(
          await prisma.apiKey.findMany({
            where: {
              accountId: user.accountId,
            },
          })
        )
  ),
  post: authentified(
    async (user, { name }) => {
      if ("key" in user) {
        return Result.err({
          code: 401,
          message: "Only users can create API keys",
        });
      }

      const key = Buffer.from(uuid()).toString("base64");

      return Result.ok(
        await prisma.apiKey.create({
          data: {
            name,
            key,
            createdById: user.id,
            accountId: user.accountId,
          },
        })
      );
    },
    z.object({
      name: z.string().nonempty(),
    })
  ),
});
