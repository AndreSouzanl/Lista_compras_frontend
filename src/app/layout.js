
import "./globals.css";

export const metadata = {
  title: "Lista de Compras",
  description: "Lista de compras mensal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
