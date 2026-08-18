#!/usr/bin/env python3
"""One-time pass: add data-copy keys to the editable text on the marketing
pages.

Uses a real parser rather than regex. A regex scan misses anything nested
inside an element it skipped, because the scan resumes after the whole
parent — which silently drops every <li><a>link</a></li> on the site.

An element is editable when it holds text and no child elements, so
replacing its inner content at build time cannot destroy any markup. Text
sitting loose beside markup was wrapped in a span first (tools/wrap-loose.py).

Header, footer and consent banner share one `site.` namespace, so editing
the footer on any page changes it on all of them.
"""
from html.parser import HTMLParser
import re, sys, os, glob, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Legal pages stay out. They are pending attorney review, and rewording a
# deposit clause or a privacy disclosure by hand is a liability.
PAGES = ["index.html", "events.html", "faq.html", "about.html",
         "quote.html", "404.html"]

EDITABLE = {"h1","h2","h3","h4","p","li","dt","dd","summary","span","a",
            "button","label","option","strong","em","td","th","figcaption"}
VOID = {"area","base","br","col","embed","hr","img","input","link","meta",
        "param","source","track","wbr"}

# Appears in <title>, meta tags and the footer signature too, so editing it
# in one place would desynchronise the rest.
FROZEN = {"Southern Drive Golf Co", "Skip to content", "Menu"}

SHARED = {"site-header", "site-footer", "consent-banner"}


class Finder(HTMLParser):
    """Collect (attr_insert_offset, inner_start, inner_end, tag, shared)."""

    def __init__(self, src):
        super().__init__(convert_charrefs=True)
        self.src = src
        self.lines = [0]
        for line in src.splitlines(keepends=True):
            self.lines.append(self.lines[-1] + len(line))
        self.stack = []
        self.hits = []
        self.shared_depth = 0

    def off(self):
        ln, col = self.getpos()
        return self.lines[ln - 1] + col

    def tag_end(self, start):
        """Offset of the '>' closing the start tag that begins at `start`."""
        i, q = start, None
        while i < len(self.src):
            ch = self.src[i]
            if q:
                if ch == q:
                    q = None
            elif ch in "\"'":
                q = ch
            elif ch == ">":
                return i
            i += 1
        raise ValueError("unterminated tag")

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        start = self.off()
        end = self.tag_end(start)
        if any(c in SHARED for c in d.get("class", "").split()):
            self.shared_depth += 1
            entered_shared = True
        else:
            entered_shared = False
        if tag in VOID:
            if entered_shared:
                self.shared_depth -= 1
            if self.stack:
                self.stack[-1]["kids"] += 1
            return
        if self.stack:
            self.stack[-1]["kids"] += 1
        self.stack.append({"tag": tag, "attr_at": end, "inner_at": end + 1,
                           "kids": 0, "shared": entered_shared,
                           "has_copy": "data-copy" in d})

    def handle_startendtag(self, tag, attrs):
        if self.stack:
            self.stack[-1]["kids"] += 1

    def handle_endtag(self, tag):
        while self.stack and self.stack[-1]["tag"] != tag:
            self.stack.pop()          # unclosed element; drop it
        if not self.stack:
            return
        f = self.stack.pop()
        if f["shared"]:
            self.shared_depth -= 1
        inner_end = self.off()
        if f["kids"] == 0 and tag in EDITABLE and not f["has_copy"]:
            text = self.src[f["inner_at"]:inner_end].strip()
            if text and len(text) > 1 and text not in FROZEN:
                self.hits.append({
                    "attr_at": f["attr_at"], "tag": tag, "text": text,
                    "shared": self.shared_depth > 0 or f["shared"],
                })


def slug(text, n=6):
    plain = re.sub(r"&[a-z]+;|&#\d+;", " ", text)
    words = re.sub(r"[^a-z0-9\s-]", "", plain.lower()).split()
    return "-".join(words[:n]) or "text"


def main(write=False):
    assigned = {}          # key -> text, for cross-page sharing
    per_page = {}
    for page in PAGES:
        path = os.path.join(ROOT, "site", page)
        src = open(path).read()
        p = Finder(src)
        p.feed(src)
        stem = page.replace(".html", "")
        edits = []
        for h in p.hits:
            ns = "site" if h["shared"] else stem
            base = f'{ns}.{h["tag"]}-{slug(h["text"])}'
            key, i = base, 2
            while key in assigned and assigned[key] != h["text"]:
                key = f"{base}-{i}"; i += 1
            assigned[key] = h["text"]
            edits.append((h["attr_at"], f' data-copy="{key}"'))
        for at, ins in sorted(edits, reverse=True):
            src = src[:at] + ins + src[at:]
        per_page[page] = len(edits)
        if write:
            open(path, "w").write(src)

    shared = sum(1 for k in assigned if k.startswith("site."))
    print(f"{'unique keys:':16} {len(assigned)}   ({shared} shared across pages)")
    for page, n in per_page.items():
        print(f"  {page:16} {n} tagged")
    return 0


if __name__ == "__main__":
    sys.exit(main("--write" in sys.argv))
