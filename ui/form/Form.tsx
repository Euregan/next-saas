import { FormEvent, ReactNode } from "react";
import Button from "./Button";
import * as styles from "./Form.css";

type Props = {
  onSubmit: (event: FormEvent<Element>) => void;
  children: ReactNode;
  submitLabel: string;
};

const Form = ({ onSubmit, submitLabel, children }: Props) => {
  return (
    <form
      onSubmit={onSubmit}
      className={
        Array.isArray(children) && children.length === 1
          ? styles.form.inline
          : styles.form.default
      }
    >
      {children}
      <Button label={submitLabel} submit />
    </form>
  );
};

export default Form;
