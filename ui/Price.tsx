import Link from "next/link";
import * as styles from "./Price.css";
import { useSession } from "@/libs/session";
import { useQuery } from "@/libs/api";
import { JwtUser } from "@/libs/jwt";
import { ReactNode } from "react";

export type PriceData = {
  id: string;
  name: string;
  price: number;
  currency: string;
  mbPerMonth: number;
  retentionDays: number;
  position: number;
};

type CardProps = {
  active: boolean;
  user: JwtUser | null;
  price: PriceData;
  children: ReactNode;
};

const Card = ({ active, user, price, children }: CardProps) =>
  active ? (
    <div className={styles.card.active}>{children}</div>
  ) : (
    <Link
      href={
        user
          ? `/change-plan/${price.id}`
          : price.price === 0
          ? "/signup"
          : `/signup?plan=${price.id}`
      }
      className={styles.card.default}
    >
      {children}
    </Link>
  );

type Props = {
  price: PriceData;
};

const Price = ({ price }: Props) => {
  const { user } = useSession();

  const [loading, error, plan] = useQuery("/api/plan");

  const active = !loading && !error && plan === price.name;

  return (
    <Card active={active} user={user} price={price}>
      <h2 className={styles.title}>{price.name}</h2>
      <ul className={styles.details}>
        <li>{price.mbPerMonth} mb/month</li>
        <li>{price.retentionDays} retention days</li>
      </ul>
      <h3 className={styles.price}>
        {price.price === 0
          ? "Free"
          : Intl.NumberFormat(navigator.language, {
              style: "currency",
              currency: price.currency,
            }).format(price.price) + "/month"}
      </h3>
    </Card>
  );
};

export default Price;
