import { useMutation } from "@/libs/api";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import * as styles from "@/styles/ChangePlan.css";
import Button from "@/ui/form/Button";
import { theme } from "@/styles/theme.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type Subscription = {
  subscriptionId: string;
  clientSecret?: string;
  name: string;
  price: number;
  currency: string;
  mbPerMonth: number;
  retentionDays: number;
};

type Props = {
  clientSecret: string;
};

const PaymentForm = ({ clientSecret }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.protocol}//${window.location.host}/app`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || null);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button
        label="Subscribe"
        submit
        disabled={isLoading || !stripe || !elements}
        cta
      />
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

const ChangePlan = () => {
  const router = useRouter();
  const { plan } = router.query;

  const [initiatePlanChange, loading, error, subscription] = useMutation<
    null,
    Subscription
  >(`/api/change-plan/${plan}`);

  useEffect(() => {
    if (plan) {
      initiatePlanChange(null);
    }
  }, [plan]);

  if (error) {
    return <>{error.message}</>;
  }

  if (loading || !subscription) {
    return <>Preparing your payment information</>;
  }

  // If there is no client secret, the user has selected the free plan
  if (!subscription.clientSecret) {
    router.push("/app");
    return <></>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.details}>
        <h2>{subscription.name}</h2>●
        <h3>
          {Intl.NumberFormat(navigator.language, {
            style: "currency",
            currency: subscription.currency,
          }).format(subscription.price) + "/month"}
        </h3>
      </div>
      <Elements
        options={{
          clientSecret: subscription.clientSecret,
          appearance: {
            theme: "night",
            variables: {
              colorPrimary: theme.colors.accent,
            },
          },
        }}
        stripe={stripePromise}
      >
        <PaymentForm clientSecret={subscription.clientSecret} />
      </Elements>
    </div>
  );
};

export default ChangePlan;
