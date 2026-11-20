import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

// Sends a page view on every route change (the site is a single-page app, so the
// browser never reloads between pages). Renders nothing.
const RouteTracker = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    // Wait a tick so pages that set their own <title> have done so.
    const id = window.setTimeout(() => trackPageView(pathname + search), 0);
    return () => window.clearTimeout(id);
  }, [pathname, search]);
  return null;
};

export default RouteTracker;
