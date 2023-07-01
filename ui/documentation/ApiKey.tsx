import { useSession } from "@/libs/session";
import { useMemo, useState } from "react";
import ApiKeyCreation from "../ApiKeyCreation";
import Button from "../form/Button";

const ApiKey = () => {
  const { apiKeys } = useSession();
  const [hidden, setHidden] = useState(true);

  const initialApiKeys = useMemo(() => apiKeys, []);

  if (initialApiKeys.length === 0) {
    return <ApiKeyCreation />;
  }

  return (
    <div>
      <pre>
        {initialApiKeys
          .reverse()[0]
          .key.split("")
          .map((character) => (hidden ? "*" : character))}
      </pre>
      <Button
        onClick={() => setHidden(!hidden)}
        label={hidden ? "Reveal" : "Hide"}
      />
    </div>
  );
};

export default ApiKey;
