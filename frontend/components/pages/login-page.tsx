"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { AuthFormCard } from "@/components/auth/auth-form-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { fetchJSON } from "@/lib/fetch-json";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { useAuthStore } from "@/store/auth-store";
import { useEditorStore } from "@/store/editor-store";

export function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { mode, email, password, authError, setMode, setEmail, setPassword, setAuthError } = useEditorStore();

  const authMutation = useMutation({
    mutationFn: async () => {
      setAuthError("");
      const schema = mode === "register" ? registerSchema : loginSchema;
      const parsed = schema.safeParse({ email, password });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Invalid credentials.");
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      return fetchJSON(endpoint, { method: "POST", body: JSON.stringify(parsed.data) });
    },
    onSuccess: (data) => {
      setUser(data.user);
      setPassword("");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.replace("/video");
    },
    onError: (error) => setAuthError(error.message),
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.22),transparent_42%),radial-gradient(circle_at_80%_85%,hsl(190_85%_55%/0.12),transparent_45%)]" />
      <AuthFormCard
        mode={mode}
        email={email}
        password={password}
        error={authError}
        loading={authMutation.isPending}
        onChangeMode={setMode}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onSubmit={() => authMutation.mutate()}
      />
    </main>
  );
}
