import json
import os
import time
from dataclasses import dataclass
from typing import Any, Dict

import redis
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
API_URL = os.getenv("API_URL", "http://localhost:4000")
WORKER_TOKEN = os.getenv("WORKER_API_TOKEN", "change-me")
HEADERS = {
    "User-Agent": "MaiSeoMBot/1.0 (+https://maiseom.com)"
}

@dataclass
class AuditJob:
    auditId: str
    projectId: str
    domain: str


def pull_job(r: redis.Redis) -> AuditJob | None:
    item = r.brpop("maiseom:audit:queue", timeout=5)
    if not item:
        return None
    _, payload = item
    data = json.loads(payload)
    return AuditJob(**data)


def fetch_html(domain: str) -> tuple[str, float]:
    urls = [f"https://{domain}", f"http://{domain}"]
    for url in urls:
        start = time.time()
        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            response.raise_for_status()
            duration = time.time() - start
            return response.text, duration
        except Exception:
            continue
    raise RuntimeError("Unable to fetch domain")


def compute_scores(html: str, load_time: float) -> Dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.string.strip() if soup.title and soup.title.string else ""
    description = ""
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        description = meta_desc["content"]

    h1 = soup.find("h1")
    schema_scripts = soup.find_all("script", attrs={"type": "application/ld+json"})
    faq = any("FAQPage" in script.text for script in schema_scripts)
    howto = any("HowTo" in script.text for script in schema_scripts)
    organization = any("Organization" in script.text for script in schema_scripts)

    word_count = len(soup.get_text(" ").split())
    images = soup.find_all("img")
    alt_coverage = (
        sum(1 for img in images if img.get("alt")) / len(images) * 100 if images else 100
    )

    seo_score = 0
    seo_score += 20 if title else 0
    seo_score += 15 if description else 0
    seo_score += 15 if h1 else 0
    seo_score += min(20, max(0, 20 - load_time * 5))
    seo_score += min(15, word_count / 50)
    seo_score += min(15, alt_coverage / 10)

    ia_score = 0
    ia_score += 30 if schema_scripts else 0
    ia_score += 15 if faq else 0
    ia_score += 15 if howto else 0
    ia_score += 10 if organization else 0
    ia_score += 15 if word_count > 400 else 5
    ia_score += 15 if description and len(description) > 120 else 0

    summary_parts = []
    if not title:
        summary_parts.append("Aucun titre détecté")
    if load_time > 3:
        summary_parts.append(f"Temps de chargement élevé ({load_time:.1f}s)")
    if alt_coverage < 70:
        summary_parts.append("Beaucoup d'images sans attribut alt")
    if not schema_scripts:
        summary_parts.append("Données structurées absentes")
    if not summary_parts:
        summary_parts.append("Structure SEO et IA saine")

    recommendations = {
        "seo": [
            "Optimiser la balise title" if not title else "",
            "Ajouter une meta description" if not description else "",
            "Ajouter une balise H1" if not h1 else "",
            "Réduire le temps de chargement" if load_time > 3 else "",
            "Ajouter des attributs alt" if alt_coverage < 90 else "",
        ],
        "ia": [
            "Ajouter des schémas FAQ" if not faq else "",
            "Documenter votre entreprise avec Organization" if not organization else "",
            "Structurer un HowTo" if not howto else "",
        ],
      "content": {
            "title": title or "Titre conseillé pour capter les IA",
            "metaDescription": description or "Résumé clair de la proposition de valeur pour les IA",
        },
    }
    recommendations["seo"] = [item for item in recommendations["seo"] if item]
    recommendations["ia"] = [item for item in recommendations["ia"] if item]

    return {
        "seoScore": round(min(100, seo_score)),
        "aiScore": round(min(100, ia_score)),
        "summary": "; ".join(summary_parts),
        "recommendations": recommendations,
    }


def push_result(job: AuditJob, result: Dict[str, Any]):
    payload = {**result}
    url = f"{API_URL}/audits/{job.auditId}/complete"
    headers = {"Content-Type": "application/json", "X-Worker-Token": WORKER_TOKEN}
    response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=15)
    response.raise_for_status()


def main():
    client = redis.Redis.from_url(REDIS_URL)
    print("[worker] MaiSeoM worker started")
    while True:
        job = pull_job(client)
        if not job:
            continue
        try:
            html, load_time = fetch_html(job.domain)
            result = compute_scores(html, load_time)
            push_result(job, result)
            print(f"[worker] Completed audit {job.auditId}")
        except Exception as exc:
            print(f"[worker] Error processing job {job.auditId}: {exc}")
            time.sleep(2)


if __name__ == "__main__":
    main()
