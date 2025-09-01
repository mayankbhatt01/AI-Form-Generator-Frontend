"use client"

import DashboardPage from "./dashboard/page";
import LoginPage from "./login/page";

export default function Home() {
  const token = localStorage.getItem("token");
  return (<>
    {token ? <DashboardPage /> :
      <LoginPage  />}
  </>
  );
}
