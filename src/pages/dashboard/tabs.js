import Users from "./Users";
import Vendors from "./Vendors";
import PriceMatrix from "./PriceMatrix";
import Reports from "./Reports";
import SubContracterPerformance from "./SubContracterPerformance";
import UserDocuments from "./user-documents";
import React from "react";

export const tabPanelOptions = [
  {
    // tab: 'NEW',
    tab: "Market Research",
    tabContent: <UserDocuments />,
    roles: ["Super Admin", "System Admin", "Contract Specialist", "Technical Specialist"],
  },
  {
    tab: "USERS",
    tabContent: <Users />,
    roles: ["Super Admin", "System Admin"],
  },
  {
    tab: "VENDOR",
    tabContent: <Vendors />,
    roles: [
      "Super Admin",
      "System Admin",
      "Contract Specialist",
      "Technical Specialist",
      "Vendor/Contractor",
      "Small Business Specialist",
    ],
  },
  {
    tab: "PRICE MATRIX",
    tabContent: <PriceMatrix />,
    roles: [
      "Super Admin",
      "System Admin",
      "Contract Specialist",
      "Technical Specialist",
      "Financial",
      "Logistics",
    ],
  },
  {
    tab: "REPORTS",
    tabContent: <Reports />,
    roles: ["Super Admin", "System Admin"],
  },
  {
    tab: "SUB CONTRACTOR EVALUATION",
    tabContent: <SubContracterPerformance />,
    roles: [
      "Super Admin",
      "System Admin",
      "Small Business Specialist",
      "Contract Specialist",
      "Sub Contractor",
      "Prime Contractor",
    ],
  },
];
