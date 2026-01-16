import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "토게피 메트로놈 마스터",
  description: "손가락 흔들기 단 하나! 운빨 대결 게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark h-full">
      <body className="antialiased min-h-full bg-background text-foreground flex flex-col">
        {children}
      </body>
    </html>
  );
}
