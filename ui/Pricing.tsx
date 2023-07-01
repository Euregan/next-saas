import { useQuery } from "@/libs/api";
import Price, { PriceData } from "@/ui/Price";
import * as styles from "./Pricing.css";

const Pricing = () => {
  const [loading, error, prices] = useQuery<Array<PriceData>>("/api/pricing");

  if (loading) {
    return <>loading</>;
  }

  if (error) {
    return <>{error.message}</>;
  }

  return (
    <div
      className={styles.prices}
      style={{ gridTemplateColumns: `repeat(${prices.length}, 1fr)` }}
    >
      {prices.map((price) => (
        <Price key={price.id} price={price} />
      ))}
    </div>
  );
};

export default Pricing;
