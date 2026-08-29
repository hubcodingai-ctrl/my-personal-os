import './globals.css';

export const metadata = {
  title: 'My Personal OS',
  description: 'Custom Web Operating System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
