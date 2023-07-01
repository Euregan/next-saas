import Result from "@/libs/Result";
import { handle, visitor } from "@/libs/endpoint";
import getProducts from "@/libs/products";
import Stripe from "stripe";

export default handle({
  get: visitor(async () => Result.ok(await getProducts())),
});
