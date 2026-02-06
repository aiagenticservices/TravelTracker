import type { ReactNode } from "react";

export const metadata = {
  title: "TravelTracker",
  description: "Simple travel planner with CRUD and destination info"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          backgroundColor: "#f3f4f6"
        }}
      >
        {children}
      </body>
    </html>
  );
}
