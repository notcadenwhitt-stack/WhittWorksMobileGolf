#!/usr/bin/env python3
"""Read every data-copy key out of site/*.html and write content/copy.json.

The HTML is the source of truth for WHICH strings are editable; this file is
the source of truth for WHAT they say. Re-run after adding a new data-copy
attribute by hand — existing values are kept, only new keys are added.
"""
import re, json, glob, os, sys, collections, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "content", "copy.json")

PAT = re.compile(r'<(\w+)\b[^>]*\bdata-copy="([^"]+)"[^>]*>(.*?)</\1>', re.S)

def main():
    existing = {}
    if os.path.exists(OUT):
        existing = json.load(open(OUT))

    found, owners, clashes = {}, collections.defaultdict(list), []
    for path in sorted(glob.glob(os.path.join(ROOT, "site", "*.html"))):
        page = os.path.basename(path)
        for tag, key, inner in PAT.findall(open(path).read()):
            # Store plain text, not source. The build escapes exactly once
            # on the way out; keeping entities here would double-escape and
            # turn "&amp;" into "&amp;amp;" on the page.
            text = html.unescape(inner.strip())
            owners[key].append(page)
            if key in found and found[key] != text:
                clashes.append((key, page, found[key], text))
            found[key] = text

    # Keep whatever the owner has already edited; only seed genuinely new keys
    merged = {k: existing.get(k, v) for k, v in found.items()}
    dropped = [k for k in existing if k not in found]

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(merged, f, indent=2, ensure_ascii=False, sort_keys=True)
        f.write("\n")

    shared = {k: v for k, v in owners.items() if len(v) > 1}
    print(f"keys:        {len(merged)}")
    print(f"shared:      {len(shared)} (appear on more than one page)")
    print(f"carried over:{sum(1 for k in merged if k in existing)}")
    if dropped:
        print(f"dropped:     {len(dropped)} -> {dropped[:5]}")
    if clashes:
        print("\nCLASH: same key, different text (build would pick one):")
        for k, page, a, b in clashes[:10]:
            print(f"  {k}\n    {a[:60]!r}\n    {page}: {b[:60]!r}")
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
