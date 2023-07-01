import Result from "@/libs/Result";
import { handle, visitor } from "@/libs/endpoint";
import jwt from "@/libs/jwt";
import getProducts from "@/libs/products";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import Stripe from "stripe";
import { z } from "zod";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default handle({
  post: visitor(
    async ({ email, password, organizationName }) => {
      const products = await getProducts();
      const freePlan = products.find((product) => product.price === 0);

      if (!freePlan) {
        return Result.err({
          code: 500,
          message:
            "Something wrong happened during the creation of your account. We are sorry for the inconvenience.",
        });
      }

      const hashedPassword = await argon2.hash(password);

      if (await prisma.user.findFirst({ where: { email } })) {
        return Result.err({
          code: 409,
          message: "This email is already in use.",
        });
      }

      const customer = await stripe.customers.create({
        email: email,
        name: organizationName,
      });

      const user = await prisma.user.create({
        data: {
          password: hashedPassword,
          email,
          account: {
            create: {
              name: organizationName,
              stripeId: customer.id,
              plan: freePlan.name,
              mbPerMonth: freePlan.mbPerMonth,
              retentionDays: freePlan.retentionDays,
            },
          },
        },
        include: {
          account: true,
        },
      });

      return Result.ok({
        token: jwt.create(user.id, user.email, user.account.stripeId),
      });
    },
    z.object({
      email: z.string(),
      password: z.string(),
      organizationName: z.string().optional(),
    })
  ),
});
