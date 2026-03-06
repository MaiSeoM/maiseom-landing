import { useEffect } from "react";

export default function Seo({
  title,
  description,
  canonical,
  ogImage = "https://www.maiseom.com/og-cover.jpg",
  jsonLd,
}) {
  useEffect(() => {
    if (title) document.title = title;

    setMeta("description", description);

    setLink("canonical", canonical);

    setMetaProp("og:type", "website");
    setMetaProp("og:title", title);
    setMetaProp("og:description", description);
    setMetaProp("og:url", canonical);
    setMetaProp("og:image", ogImage);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    // JSON-LD
    const id = "jsonld-dynamic";
    const prev = document.getElementById(id);
    if (prev) prev.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      // optionnel : on laisse le JSON-LD de la page en place
    };
  }, [title, description, canonical, ogImage, jsonLd]);

  return null;
}

function setMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaProp(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
