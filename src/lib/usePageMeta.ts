import { useEffect } from "react";

/** Sets the tab title while a page is open and, for private pages, keeps it out of search engines. */
export function usePageMeta(title: string, { noindex = false }: { noindex?: boolean } = {}) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    let meta: HTMLMetaElement | null = null;
    if (noindex) {
      meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, nofollow";
      document.head.appendChild(meta);
    }
    return () => {
      document.title = prevTitle;
      meta?.remove();
    };
  }, [title, noindex]);
}
