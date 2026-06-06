# Safe OSINT — Passive DNS Workflow

> **Passive only.** This workflow performs public DNS lookups against public
> resolvers. It does **not** scan, probe, fingerprint, brute force, or connect to
> any target service. It does not attempt logins or contact any individual.

---

## Ground rules

- ✅ **Passive DNS only** — query public DNS records (A, AAAA, MX, NS, TXT, SOA,
  `_dmarc`). These are published, public records.
- ❌ **No port scanning** (no `nmap`, no `Test-NetConnection -Port`, no banner
  grabbing).
- ❌ **No probing or fingerprinting** of web/mail services on the target.
- ❌ **No login attempts** against any mailbox, panel, or host.
- ❌ **No aggressive contact** with suspected individuals. At most, one factual
  abuse report / "do not contact" notice through proper channels.
- ✅ Keep a record of exactly what you queried and when.

DNS lookups are the digital equivalent of reading a public phone book. Anything
that *connects to* or *interacts with* the suspect's services is out of scope.

---

## What each record tells you (defensively)

| Record | Why it matters |
|--------|----------------|
| **A / AAAA** | IPv4 / IPv6 the domain points to (informational; do not connect). |
| **MX** | Which provider receives the domain's mail → **who to report to**. |
| **NS** | Authoritative name servers / DNS host. |
| **TXT** | Holds **SPF** and other verification strings. |
| **SOA** | Zone authority + admin contact format; confirms the zone exists. |
| **_dmarc TXT** | Whether a **DMARC** policy exists (often absent in abused domains). |

---

## PowerShell — `Resolve-DnsName` commands

`Resolve-DnsName` is built into Windows PowerShell and performs DNS queries only.

Set the domain once:

```powershell
$domain = "example.com"
```

Run each record type:

```powershell
# A — IPv4 addresses
Resolve-DnsName -Name $domain -Type A

# AAAA — IPv6 addresses
Resolve-DnsName -Name $domain -Type AAAA

# MX — mail servers (who receives mail for the domain)
Resolve-DnsName -Name $domain -Type MX

# NS — authoritative name servers
Resolve-DnsName -Name $domain -Type NS

# TXT — includes SPF (look for v=spf1 ...)
Resolve-DnsName -Name $domain -Type TXT

# SOA — zone authority
Resolve-DnsName -Name $domain -Type SOA

# DMARC — policy record lives at _dmarc.<domain>
Resolve-DnsName -Name "_dmarc.$domain" -Type TXT
```

Optional — query a specific public resolver explicitly (still passive):

```powershell
Resolve-DnsName -Name $domain -Type MX -Server 1.1.1.1
```

Tip: wrap any lookup that may not exist (e.g. AAAA, DMARC) so a "record not found"
doesn't stop your script:

```powershell
try   { Resolve-DnsName -Name "_dmarc.$domain" -Type TXT -ErrorAction Stop }
catch { "No DMARC record found for $domain" }
```

---

## How to save reports to the Desktop

Send results to a text file on your Desktop. `Tee-Object` shows output *and*
writes it:

```powershell
$desktop = [Environment]::GetFolderPath("Desktop")
$report  = Join-Path $desktop "osint_dns_report.txt"

"OSINT DNS report — $domain — $(Get-Date -Format s)" | Out-File $report

Resolve-DnsName -Name $domain -Type A   | Out-File $report -Append
Resolve-DnsName -Name $domain -Type MX  | Out-File $report -Append
Resolve-DnsName -Name $domain -Type TXT | Out-File $report -Append
# ...repeat for AAAA, NS, SOA, _dmarc...

"Report saved to $report"
```

For a ready-made version that loops over several domains and handles missing
records, use **`scripts/security/passive-dns-osint.ps1`** in this repo. It writes
`osint_dns_report.txt` to your Desktop and performs DNS queries only.

```powershell
# from the repo root (PowerShell)
./scripts/security/passive-dns-osint.ps1 -Domains "st.ul.edu.lb","mail2art.com"
```

> If script execution is blocked, run it for the current session only:
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` — this affects only
> the current window and does not weaken system-wide settings permanently.

---

## After the lookup

- Save the report into your `PHISHING_EVIDENCE` folder alongside the email and
  attachment hash.
- Use the **MX** result to pick the right provider abuse desk
  (see `ABUSE_REPORT_TEMPLATES.md`).
- Note **absent DMARC** factually; do not infer a specific person's guilt from it.
- Stop here. Do not escalate from "looked up public records" to "interacted with
  their systems."
