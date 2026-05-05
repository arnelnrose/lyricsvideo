"use client";

import { LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthFormCard({
  mode,
  email,
  password,
  error,
  loading,
  onChangeMode,
  onChangeEmail,
  onChangePassword,
  onSubmit,
}) {
  const registerMode = mode === "register";

  return (
    <div className="w-full max-w-md">
      <Card className="overflow-hidden border-border/70 bg-card/80 shadow-2xl backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{registerMode ? "Create your account" : "Welcome back"}</CardTitle>
          <CardDescription>
            {registerMode
              ? "Start building and rendering your lyric videos."
              : "Login to continue editing your lyric video projects."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 rounded-lg border border-border/70 bg-muted/40 p-1">
            <Button
              variant={registerMode ? "ghost" : "secondary"}
              className="h-8"
              onClick={() => onChangeMode("login")}
              type="button"
            >
              Login
            </Button>
            <Button
              variant={registerMode ? "secondary" : "ghost"}
              className="h-8"
              onClick={() => onChangeMode("register")}
              type="button"
            >
              Register
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
                className="pl-9"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="auth-password"
                type="password"
                autoComplete={registerMode ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => onChangePassword(e.target.value)}
                className="pl-9"
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>

          <Button className="w-full" onClick={onSubmit} disabled={loading}>
            {loading ? "Please wait..." : registerMode ? "Create account" : "Login"}
          </Button>

          {error ? <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
