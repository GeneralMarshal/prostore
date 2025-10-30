import { Metadata } from "next";
import Header from "@/components/shared/header";
import Footer  from "@/components/footer";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: { default: "Home", template: `%s | ${APP_NAME}`}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
