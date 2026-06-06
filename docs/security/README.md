# Security — Phishing Incident Response Mini-Kit

A small, **defensive** toolkit for handling phishing / impersonation emails
safely and legally. Everything here is **passive**: reading headers, public DNS
lookups, hashing your own saved files, and reporting through official channels.

> ⚠️ **Scope & ethics:** This kit is for defense only. It contains **no**
> offensive content — no hacking back, no scanning/probing of real targets, no
> brute force, no exploits, no payloads, no credential access, and no harassment.
> The displayed sender of a phishing email may be **spoofed or compromised**, so
> nothing here is used to accuse or target a specific individual.

---

## Files in this kit

| File | Purpose |
|------|---------|
| [`PHISHING_INCIDENT_RESPONSE.md`](./PHISHING_INCIDENT_RESPONSE.md) | What happened, red flags, why Reply-To matters, why From isn't proof, evidence to preserve, what not to do, escalation checklist, conclusion. |
| [`EMAIL_HEADER_ANALYSIS_CHECKLIST.md`](./EMAIL_HEADER_ANALYSIS_CHECKLIST.md) | Field-by-field header review (From, Reply-To, Return-Path, Received, Message-ID, SPF, DKIM, DMARC, MX, TXT, attachment metadata) + how to write neutral, non-accusatory conclusions. |
| [`SAFE_OSINT_DNS_WORKFLOW.md`](./SAFE_OSINT_DNS_WORKFLOW.md) | Passive-only DNS OSINT rules + `Resolve-DnsName` commands (A, AAAA, MX, NS, TXT, SOA, `_dmarc`) and how to save reports to the Desktop. |
| [`ABUSE_REPORT_TEMPLATES.md`](./ABUSE_REPORT_TEMPLATES.md) | Copy-paste reports: Gmail, Microsoft/Office 365, mail provider, domain registrar, and a one-time "do not contact me again" notice. |
| [`../../scripts/security/passive-dns-osint.ps1`](../../scripts/security/passive-dns-osint.ps1) | PowerShell: passive DNS lookups for a list of domains → `osint_dns_report.txt` on Desktop. DNS queries only. |
| [`../../scripts/security/hash-evidence.ps1`](../../scripts/security/hash-evidence.ps1) | PowerShell: SHA256-hash `.eml`/`.pdf` evidence in `Desktop\PHISHING_EVIDENCE` → `hash_report.txt`. Never opens attachments. |

---

## The workflow

### 1. Preserve evidence
- Save the original email as `.eml` (full headers) and screenshot it.
- Copy the **unopened** attachment into `Desktop\PHISHING_EVIDENCE`.
- Keep a short timeline note. → see `PHISHING_INCIDENT_RESPONSE.md`.

### 2. Report phishing
- Use your client's built-in control (Gmail **Report phishing** / Outlook
  **Report → Phishing**).
- Send abuse reports to the relevant providers and, for authority impersonation,
  your national CERT. → templates in `ABUSE_REPORT_TEMPLATES.md`.

### 3. Passive DNS OSINT
- Run public DNS lookups only — no scanning or probing.
  ```powershell
  ./scripts/security/passive-dns-osint.ps1 -Domains "st.ul.edu.lb","mail2art.com"
  ```
  → details in `SAFE_OSINT_DNS_WORKFLOW.md`.

### 4. Hash evidence
- Generate SHA256 hashes without opening anything:
  ```powershell
  ./scripts/security/hash-evidence.ps1   # run once to create the folder, again to hash
  ```
- Share **hashes**, not the live attachment (unless a provider asks).

### 5. Do not retaliate
- No hacking back, scanning, probing, login attempts, or aggressive contact.
- At most, send the single factual "do not contact me again" notice.

### 6. Block the sender
- Block the From address and the Reply-To domain in your mail client; add a rule
  to route future copies to spam.

### 7. Monitor account security
- If there's any chance you interacted: change your password, confirm **MFA** is
  enabled, and review mailbox **rules/forwarding** for anything you didn't set.
- Watch for follow-up attempts; keep the evidence folder until the matter closes.

---

## Running the PowerShell scripts

```powershell
# If script execution is restricted, allow it for THIS session only:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Passive DNS report -> Desktop\osint_dns_report.txt
./scripts/security/passive-dns-osint.ps1 -Domains "st.ul.edu.lb","mail2art.com"

# Evidence hashing -> Desktop\PHISHING_EVIDENCE\hash_report.txt
./scripts/security/hash-evidence.ps1
```

Both scripts are read/lookup only: `passive-dns-osint.ps1` performs DNS queries
and never connects to target services; `hash-evidence.ps1` hashes files and never
opens them.

---

## Golden rules

1. **Preserve, don't poke.** Capture evidence; never interact with the attacker's
   infrastructure.
2. **From is a claim; Reply-To is a lead.** Neither proves who a real person is.
3. **Report through official channels.** Let providers and CERTs act.
4. **Stay passive and legal.** Public DNS and your own files only.
5. **Secure yourself.** Block, change credentials if needed, verify MFA.
