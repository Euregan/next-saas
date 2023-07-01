import { useMutation } from "@/libs/api";
import { useSession } from "@/libs/session";
import Button from "@/ui/form/Button";
import Input from "@/ui/form/Input";
import { useRouter } from "next/router";
import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useSession();

  const [submit, loading, error] = useMutation<
    {
      email: string;
      password: string;
    },
    { token: string }
  >("/api/signup");

  const router = useRouter();

  const { plan } = router.query;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        submit({ email, password }).then(({ token }) => {
          login(token);

          router.push(
            plan && typeof plan === "string" ? `/change-plan/${plan}` : "/app"
          );
        });
      }}
    >
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        disabled={loading}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        disabled={loading}
      />
      <Button label="Create an account" submit disabled={loading} />
    </form>
  );
};

export default Signup;
