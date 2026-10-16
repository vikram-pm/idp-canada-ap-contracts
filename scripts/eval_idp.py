"""P01 IDP eval: compare pipeline output against ground_truth.csv.

Usage:
  1. Run the 8 test-pack PDFs through the n8n workflow.
  2. From Google Sheets, download each tab (Review queue, Auto-approved, Manual)
     as CSV into one folder.
  3. python eval_idp.py --truth ground_truth.csv --results <folder>

Prints field-level, document-level and routing accuracy, plus every miss.
"""
import argparse, csv, glob, json, os, re

ROUTE_OK = {  # expected route text in ground_truth -> routes that count as correct
    "review": {"review"},
    "auto_approve": {"auto_approve", "audit_sample"},
}


def norm(v):
    """Compare values the way a reviewer would: ignore case, spaces, $ and punctuation."""
    s = str(v or "").lower().replace("\u00a0", " ").replace("\u202f", " ")
    return re.sub(r"[\s$.,:]", "", s)


PROV = {"ontario": "ON", "quebec": "QC", "québec": "QC", "british columbia": "BC", "alberta": "AB",
        "manitoba": "MB", "saskatchewan": "SK", "nova scotia": "NS", "new brunswick": "NB",
        "newfoundland": "NL", "prince edward island": "PE"}
POSTAL = {"A": "NL", "B": "NS", "C": "PE", "E": "NB", "G": "QC", "H": "QC", "J": "QC", "K": "ON", "L": "ON",
          "M": "ON", "N": "ON", "P": "ON", "R": "MB", "S": "SK", "T": "AB", "V": "BC", "Y": "YT"}
FREE_TEXT = {"governing_law", "supplier_address", "bill_to_address", "term", "privacy_clause"}


def province(v):
    s = str(v or "")
    m = re.search(r"\b(ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|YT|NT|NU)\b", s.upper())
    if m:
        return m.group(1)
    for k, code in PROV.items():
        if k in s.lower():
            return code
    m = re.search(r"\b([ABCEGHJKLMNPRSTVXY])\d[A-Z] ?\d[A-Z]\d\b", s.upper())
    return POSTAL.get(m.group(1)) if m else ""


def match(field, expected, actual):
    """Exact for numbers and IDs; province by code; free text by containment."""
    if field.endswith("_province"):
        return province(expected) == province(actual)
    e, a = norm(expected), norm(actual)
    if field in FREE_TEXT:
        return bool(e) and bool(a) and (e in a or a in e)
    if field == "parties":
        return all(norm(p) in a for p in expected.split(";"))
    return e == a


def load_truth(path):
    fields, routes = {}, {}
    with open(path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            doc, field, val = r["document"], r["field"], r["expected_value"]
            if field == "_expected_route":
                routes[doc] = val.split(" ")[0]  # "auto_approve (or audit_sample 5%)" -> auto_approve
            else:
                fields.setdefault(doc, {})[field] = val
    return fields, routes


def load_results(folder):
    out = {}
    for path in glob.glob(os.path.join(folder, "*.csv")):
        with open(path, newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                if r.get("file_name") and "route" in r:  # skip Audit log rows
                    out[r["file_name"]] = r  # latest row per file wins
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--truth", required=True)
    ap.add_argument("--results", required=True)
    a = ap.parse_args()

    truth_fields, truth_routes = load_truth(a.truth)
    results = load_results(a.results)

    f_total = f_ok = d_total = d_ok = r_total = r_ok = 0
    misses = []
    for doc in sorted(set(truth_fields) | set(truth_routes)):
        res = results.get(doc)
        if res is None:
            misses.append(f"{doc}: not found in results (not uploaded?)")
            continue
        got = json.loads(res.get("fields_json") or "{}")
        if doc in truth_fields:
            d_total += 1
            all_ok = True
            for field, expected in truth_fields[doc].items():
                f_total += 1
                actual = got.get(field, {}).get("value", "")
                if match(field, expected, actual):
                    f_ok += 1
                else:
                    all_ok = False
                    misses.append(f"{doc} · {field}: expected '{expected}', got '{actual}'")
            d_ok += all_ok
        if doc in truth_routes:
            r_total += 1
            exp = truth_routes[doc]
            if res.get("route") in ROUTE_OK.get(exp, {exp}):
                r_ok += 1
            else:
                misses.append(f"{doc} · route: expected {exp}, got {res.get('route')} ({res.get('why_it_needs_you')})")

    pct = lambda n, d: f"{100 * n / d:.1f}% ({n}/{d})" if d else "n/a"
    print("P01 IDP eval")
    print(f"  Field-level accuracy:    {pct(f_ok, f_total)}   target 95%+")
    print(f"  Document-level accuracy: {pct(d_ok, d_total)}   target 85%+")
    print(f"  Routing accuracy:        {pct(r_ok, r_total)}   target 100%")
    if misses:
        print("\nMisses:")
        for m in misses:
            print("  - " + m)


if __name__ == "__main__":
    main()
