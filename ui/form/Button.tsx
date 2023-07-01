import * as styles from "./Button.css";

type Base = {
  label: string;
  disabled?: boolean;
  cta?: true;
};

type SubmitButton = {
  submit: true;
} & Base;

type Button = {
  onClick: () => void;
  confirmation?: string;
} & Base;

type Props = SubmitButton | Button;

const Button = ({ label, disabled, cta, ...rest }: Props) => (
  <button
    className={
      cta
        ? styles.button.cta
        : "confirmation" in rest
        ? styles.button.danger
        : styles.button.default
    }
    disabled={disabled}
    type={"submit" in rest ? "submit" : "button"}
    onClick={
      "onClick" in rest
        ? () => {
            if ("confirmation" in rest) {
              if (window.confirm(rest.confirmation)) {
                rest.onClick();
              }
            } else {
              rest.onClick();
            }
          }
        : undefined
    }
  >
    {label}
  </button>
);

export default Button;
