import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

/**
 * A function to get properly formatted products from Stripe
 *
 * @returns The complete list of products from Stripe
 */
const getProducts = async () => {
  const { data: products } = await stripe.products.list({
    expand: ["data.default_price"],
  });

  return products
    .sort(
      (productA, productB) =>
        Number(productA.metadata.position) - Number(productB.metadata.position)
    )
    .map((product) => ({
      id: (product.default_price as Stripe.Price).id,
      name: product.name,
      price: ((product.default_price as Stripe.Price).unit_amount || 0) / 100,
      currency: (product.default_price as Stripe.Price).currency,
      mbPerMonth: Number(product.metadata.mbPerMonth),
      retentionDays: Number(product.metadata.retentionDays),
    }));
};

export default getProducts;
