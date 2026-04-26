"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { login, signup } from "@/api/auth";
import { Button, Input, useToast } from "@/components/ui";
import { setAccessToken } from "@/lib/auth-token";
import type { LoginRequest, SignupRequest } from "@/types/auth";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
}

const COPY = {
  loginTitle: "로그인",
  signupTitle: "회원가입",
  loginDescription:
    "이벤트 참여와 당첨 결과 확인을 위해 로그인해 주세요.",
  signupDescription:
    "벨루가에서 빠르게 이벤트에 참여할 계정을 만들어 주세요.",
  email: "이메일",
  password: "비밀번호",
  nickname: "닉네임",
  emailPlaceholder: "beluga@example.com",
  passwordPlaceholder: "비밀번호를 입력해 주세요",
  nicknamePlaceholder: "닉네임을 입력해 주세요",
  loginButton: "로그인하기",
  signupButton: "회원가입하기",
  loginSuccess: "로그인되었습니다.",
  signupSuccess: "회원가입이 완료되었습니다.",
  authFailed: "요청을 처리하지 못했습니다.",
  goSignup: "계정이 없나요? 회원가입",
  goLogin: "이미 계정이 있나요? 로그인",
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  const isLogin = mode === "login";
  const mutation = useMutation({
    mutationFn: (request: LoginRequest | SignupRequest) =>
      isLogin ? login(request) : signup(request as SignupRequest),
    onSuccess: (response) => {
      if (response.accessToken) {
        setAccessToken(response.accessToken);
      }

      showToast({
        message: isLogin ? COPY.loginSuccess : COPY.signupSuccess,
        tone: "success",
      });
      router.push(isLogin ? "/" : "/login");
    },
    onError: (error) => {
      showToast({
        message: error instanceof Error ? error.message : COPY.authFailed,
        tone: "error",
      });
    },
  });

  const title = isLogin ? COPY.loginTitle : COPY.signupTitle;
  const description = isLogin ? COPY.loginDescription : COPY.signupDescription;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request = isLogin
      ? { email: form.email, password: form.password }
      : form;

    mutation.mutate(request);
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <Link className="text-sm font-bold text-beluga-sky-deep" href="/">
          Beluga
        </Link>

        <section className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-200/60">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Input
              autoComplete="email"
              label={COPY.email}
              name="email"
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  email: event.target.value,
                }))
              }
              placeholder={COPY.emailPlaceholder}
              required
              type="email"
              value={form.email}
            />
            {!isLogin ? (
              <Input
                autoComplete="nickname"
                label={COPY.nickname}
                name="nickname"
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    nickname: event.target.value,
                  }))
                }
                placeholder={COPY.nicknamePlaceholder}
                required
                value={form.nickname}
              />
            ) : null}
            <Input
              autoComplete={isLogin ? "current-password" : "new-password"}
              label={COPY.password}
              minLength={8}
              name="password"
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  password: event.target.value,
                }))
              }
              placeholder={COPY.passwordPlaceholder}
              required
              type="password"
              value={form.password}
            />
            <Button className="w-full" isLoading={mutation.isPending} type="submit">
              {isLogin ? COPY.loginButton : COPY.signupButton}
            </Button>
          </form>

          <Link
            className="mt-5 block text-center text-sm font-semibold text-slate-600 hover:text-beluga-sky-deep"
            href={isLogin ? "/signup" : "/login"}
          >
            {isLogin ? COPY.goSignup : COPY.goLogin}
          </Link>
        </section>
      </div>
    </main>
  );
}
