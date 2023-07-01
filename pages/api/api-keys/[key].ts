import Result from "@/libs/Result";
import { authentified, handle } from "@/libs/endpoint";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export default handle({
  delete: authentified(
    async (user, { key }) => {
      const apiKey = await prisma.apiKey.findFirst({
        where: {
          key,
          accountId: user.accountId,
        },
      });

      if (!apiKey) {
        return Result.err({
          code: 404,
          message: `Could not find an API key with key ${key}`,
        });
      }

      return Result.ok(
        await prisma.apiKey.delete({
          where: {
            key,
          },
        })
      );
    },
    z.object({
      key: z.string(),
    })
  ),
});
