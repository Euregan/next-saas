import * as styles from "./Input.css";

type Props = {
  label: string;
  type: string;
  value: string | null;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const Input = ({ label, type, value, onChange, disabled, error }: Props) => (
  <label className={styles.label}>
    <div className={styles.labelAndError}>
      <span>{label}</span>
      {error && <span className={styles.error}>{error}</span>}
    </div>
    <input
      className={styles.input}
      type={type}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    />
  </label>
);

export default Input;
