import { z } from "zod";
import { useSession } from "@/libs/session";
import { createFormHook } from "@/libs/form";
import Input from "./form/Input";
import { useMutation } from "@/libs/api";
import { ApiKey } from "@prisma/client";
import Form from "./form/Form";

type RawApiKey = Omit<ApiKey, "createdAt" | "lastUsedAt"> & {
  createdAt: string;
  lastUsedAt: string;
};

const useForm = createFormHook({
  name: z.string().nonempty(),
});

const ApiKeyCreation = () => {
  const { user, addApiKey } = useSession();
  const { errors, onSubmit, onChanges, values } = useForm({
    initialData: { name: "" },
    onSubmit: ({ name }) =>
      createApiKey({ name }).then((key) =>
        addApiKey({
          ...key,
          lastUsedAt: new Date(key.lastUsedAt),
          createdAt: new Date(key.createdAt),
        })
      ),
  });

  const [createApiKey, creatingApiKey, error] = useMutation<
    { name: string },
    RawApiKey
  >("/api/api-keys");

  if (!user) {
    return <div>You need to be logged in to create an API key.</div>;
  }

  if (error) {
    <div>{error.message}</div>;
  }

  if (creatingApiKey) {
    return <>Creating your key...</>;
  }

  return (
    <Form onSubmit={onSubmit} submitLabel="Create key">
      <Input
        label="Key name"
        type="text"
        value={values.name}
        onChange={onChanges.name}
        error={errors.name}
      />
    </Form>
  );
};

export default ApiKeyCreation;
