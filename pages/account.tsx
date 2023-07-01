import { useSession } from "@/libs/session";
import ApiKey from "@/ui/ApiKey";
import ApiKeyCreation from "@/ui/ApiKeyCreation";
import * as styles from "@/styles/Account.css";
import Pricing from "@/ui/Pricing";

const Account = () => {
  const { apiKeys } = useSession();

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2>Plans</h2>
        <Pricing />
      </section>

      <section className={styles.section}>
        <h2>API keys</h2>
        {apiKeys.length > 0 && (
          <ul className={styles.keys}>
            {apiKeys.map((key) => (
              <li key={key.key}>
                <ApiKey apiKey={key} />
              </li>
            ))}
          </ul>
        )}
        <ApiKeyCreation />
      </section>
    </div>
  );
};

export default Account;
