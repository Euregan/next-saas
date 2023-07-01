import NextLink from "next/link";
import * as styles from "./Link.css";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
};

const Link = ({ href, children }: Props) => (
  <NextLink className={styles.link} href={href}>
    {children}
  </NextLink>
);

export default Link;
