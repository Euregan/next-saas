import * as styles from "./Section.css";

import {
  ReactNode,
  Reducer,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { DocumentationContext, Node, slugify } from "./Page";

type Props = {
  title: string;
  children: ReactNode;
};

type SectionContextState = {
  level: number;
  addChildNode: (node: Node) => void;
};

const SectionContext = createContext<SectionContextState>({
  level: 1,
  addChildNode: () => {},
});

const Section = ({ title, children }: Props) => {
  const { level, addChildNode } = useContext(SectionContext);
  const { addTopLevelNode } = useContext(DocumentationContext);

  const Title = `h${level}` as keyof JSX.IntrinsicElements;

  const [node, dispatch] = useReducer<Reducer<Node, Node>>(
    (node, childNode) => ({
      ...node,
      children: {
        ...node.children,
        [slugify(childNode.title)]: childNode,
      },
    }),
    { title, children: {} }
  );

  useEffect(() => {
    addChildNode(node);

    if (level === 1) {
      addTopLevelNode(node);
    }
  }, [node]);

  return (
    <SectionContext.Provider
      value={{
        level: level + 1,
        addChildNode: dispatch,
      }}
    >
      <section className={styles.section}>
        <Title id={slugify(title)}>{title}</Title>
        {children}
      </section>
    </SectionContext.Provider>
  );
};

export default Section;
