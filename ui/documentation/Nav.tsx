import Link from "../Link";
import { Node } from "./Page";
import * as styles from "./Nav.css";

type Props = {
  nodes: Record<string, Node>;
};

const Nav = ({ nodes }: Props) => (
  <ul className={styles.nav}>
    {Object.entries(nodes).map(([slug, node]) => (
      <li key={node.title}>
        <Link href={`#${slug}`}>{node.title}</Link>
        {Object.values(node.children).length > 0 &&
          Nav({ nodes: node.children })}
      </li>
    ))}
  </ul>
);

export default Nav;
