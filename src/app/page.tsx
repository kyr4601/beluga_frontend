import Link from "next/link";

import { EventList } from "@/components/events/event-list";

const COPY = {
  eyebrow: "선착순 기프티콘 서비스",
  title: "벨루가",
  description:
    "진행 중인 이벤트를 먼저 확인하고, 예정된 이벤트는 시작 시간에 바로 참여할 수 있게 준비합니다.",
  login: "로그인",
  signup: "회원가입",
  mypage: "마이페이지",
  admin: "관리자",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-beluga-sky-deep">
              {COPY.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              {COPY.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {COPY.description}
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <HeaderLink href="/mypage">{COPY.mypage}</HeaderLink>
            <HeaderLink href="/admin">{COPY.admin}</HeaderLink>
            <HeaderLink href="/login">{COPY.login}</HeaderLink>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-sky-500 px-4 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition-colors hover:bg-sky-600"
              href="/signup"
            >
              {COPY.signup}
            </Link>
          </nav>
        </header>

        <EventList />
      </div>
    </main>
  );
}

function HeaderLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
      href={href}
    >
      {children}
    </Link>
  );
}
