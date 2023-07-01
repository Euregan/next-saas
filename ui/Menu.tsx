import Link from "./Link";
import * as styles from "./Menu.css";
import { useSession } from "@/libs/session";

const Menu = () => {
  const { user } = useSession();

  return (
    <header>
      <nav className={styles.nav}>
        <Link href={user ? "/app" : "/"}>Next SaaS</Link>
        <ul className={styles.links}>
          <li>
            <Link href="/doc">Documentation</Link>
          </li>
          {user ? (
            <li>
              <Link href="/account">Account</Link>
            </li>
          ) : (
            <>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/signin">Sign in</Link>
              </li>
              <li>
                <Link href="/signup">Sign up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Menu;
