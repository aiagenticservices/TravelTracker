export const metadata = {
  title: "TravelTracker",
  description: "Travel planning app"
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
