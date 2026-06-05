"use client";

import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import Overview from "./pages/Overview";
import ChatWidget from "./pages/ChatWidget";
import ProductCatalog from "./pages/ProductCatalog";
import Conversations from "./pages/Conversations";
import Analytics from "./pages/Analytics";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Documentation from "./pages/Documentation";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("overview");

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <Overview />;
      case "widget":
        return <ChatWidget />;
      case "catalog":
        return <ProductCatalog />;
      case "conversations":
        return <Conversations />;
      case "analytics":
        return <Analytics />;
      case "billing":
        return <Billing />;
      case "settings":
        return <Settings />;
      case "docs":
        return <Documentation />;
      default:
        return <Overview />;
    }
  };

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </DashboardLayout>
  );
}