import { useSession } from "@/libs/session";
import { themeClass } from "@/styles/theme.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import * as styles from "@/styles/App.css";
import Menu from "@/ui/Menu";

export default function App({ Component, pageProps }: AppProps) {
  const { jwt, login } = useSession();

  useEffect(() => {
    if (jwt) {
      login(jwt);
    }
  }, []);

  return (
    <main className={`${themeClass} ${styles.main}`}>
      <Menu />
      <Component {...pageProps} />
    </main>
  );
}
