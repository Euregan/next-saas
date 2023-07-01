import { useState } from "react";
import Button from "./form/Button";
import { ApiKey } from "@prisma/client";
import * as styles from "./ApiKey.css";
import { useSession } from "@/libs/session";
import { useMutation } from "@/libs/api";

type Props = {
  apiKey: ApiKey;
};

const ApiKey = ({ apiKey }: Props) => {
  const [hidden, setHidden] = useState(true);
  const { removeApiKey } = useSession();

  const [deleteApiKey, deletingApiKey] = useMutation(
    `/api/api-keys/${apiKey.key}`,
    "DELETE"
  );

  return (
    <div>
      <div>{apiKey.name}</div>
      <div className={styles.container}>
        <pre>
          {apiKey.key.split("").map((character) => (hidden ? "*" : character))}
        </pre>
        <Button
          onClick={() => setHidden(!hidden)}
          label={hidden ? "Reveal" : "Hide"}
          disabled={deletingApiKey}
        />
        <Button
          onClick={() => deleteApiKey({}).then(() => removeApiKey(apiKey))}
          label="Delete"
          disabled={deletingApiKey}
          confirmation={`Are you sure you want to delete the ${apiKey.name} key?`}
        />
      </div>
    </div>
  );
};

export default ApiKey;
