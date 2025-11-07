import "./globals.css";
import Header from "../components/Header";
import { Providers } from "./providers";

export const metadata = {
  title: "E-Commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="m-0 p-0">
        <Providers>
          <Header />
          <main className="m-0 p-0">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
