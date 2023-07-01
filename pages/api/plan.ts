import Result from "@/libs/Result";
import { authentified, handle } from "@/libs/endpoint";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default handle({
  get: authentified(async (user) =>
    Result.ok(
      (
        await prisma.account.findUniqueOrThrow({
          where: {
            stripeId: user.accountId,
          },
        })
      ).plan
    )
  ),
});
