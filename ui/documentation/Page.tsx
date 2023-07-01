import { createContext, useContext, ReactNode, useState } from "react";
import Nav from "./Nav";
import * as styles from "./Page.css";

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

type Props = {
  children: ReactNode;
};

type Context = {
  content: Record<string, Node>;
  addTopLevelNode: (node: Node) => void;
};

export type Node = {
  title: string;
  children: Record<string, Node>;
};

export const DocumentationContext = createContext<Context>({
  content: {},
  addTopLevelNode: () => {},
});

const Page = ({ children }: Props) => {
  const [nodes, setNodes] = useState<Record<string, Node>>({});

  return (
    <DocumentationContext.Provider
      value={{
        content: nodes,
        addTopLevelNode: (node) =>
          setNodes({ ...nodes, [slugify(node.title)]: node }),
      }}
    >
      <main className={styles.page}>
        <article className={styles.main}>{children}</article>
        <nav>
          <Nav nodes={nodes} />
        </nav>
      </main>
    </DocumentationContext.Provider>
  );
};

export default Page;
