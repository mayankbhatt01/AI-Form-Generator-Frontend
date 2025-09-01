"use client"

import DashboardPage from "./dashboard/page";
import LoginPage from "./login/page";

export default function Home() {
  let token:any = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    // use token
  }
  return (<>
    {token ? <DashboardPage /> :
      <LoginPage />}
  </>
  );
}
