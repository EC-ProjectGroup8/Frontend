import React from "react";
import { useLocation } from "react-router-dom";

const formatTitle = (path: string) => {
  if (path === "/" || path === "") return "Home";
  const seg = path.split("/").filter(Boolean);
  const last = seg[seg.length - 1] || "";
  return last.charAt(0).toUpperCase() + last.slice(1);
};

type Props = {
  page?: string;
};

const CurrentPage: React.FC<Props> = ({ page }) => {
  const { pathname } = useLocation();
  const computed = formatTitle(pathname ?? "");
  const title = page ?? computed ?? "Current Page";

  return <h3 className="page-indicator">{title}</h3>;
};

export default CurrentPage;
