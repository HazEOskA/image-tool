# Phishing / Impersonation — Incident Response

> Defensive, passive, legal response only. This document records how to handle a
> phishing email safely. It does **not** authorize any retaliation, hacking back,
> scanning, probing, login attempts, or contact intended to intimidate anyone.

---

## What happened

A phishing / impersonation email was received that pretended to come from
"policja" (police). Key observed indicators (as captured from the message):

| Field | Value |
|-------|-------|
| Visible **From** | `ahmad.yammin@st.ul.edu.lb` |
| **Reply-To** | `biuro@mail2art.com` |
| **Subject** | `Sprawa PL-KR/2025 04567` |
| **Attachment** | `0.p32.pdf` (suspicious; not opened) |

Passive DNS OSINT (public lookups only) showed:

- `st.ul.edu.lb` uses Microsoft 365 / Outlook protection
  (`st-ul-edu-lb.mail.protection.outlook.com`); SPF includes
  `spf.protection.outlook.com`; **no DMARC** record.
- `mail2art.com` uses Mail2World MX (`publicms1.mail2world.com`,
  `publicms2.mail2world.com`); **no DMARC** record.

> Note on attribution: the From address belongs to a university mailbox. It may
> be spoofed, compromised, or unrelated to the actual operator. **Do not assume a
> named individual is responsible.** See "Why From is not proof of identity".

---

## Red flags

- **Authority impersonation:** claims to be police to create fear/urgency.
- **Case-number subject:** `Sprawa PL-KR/2025 04567` mimics an official reference
  to look legitimate.
- **From / Reply-To mismatch:** the visible sender is a `.edu.lb` university
  address, but replies are routed to an unrelated commercial domain
  (`mail2art.com`). This is a classic phishing pattern.
- **Unexpected PDF attachment** (`0.p32.pdf`) with an odd, machine-style name.
- **Cross-border inconsistency:** a "Polish police" matter sent from a Lebanese
  university domain with replies to a third, unrelated mail provider.
- **No DMARC** on either domain, which makes spoofing and unauthenticated
  delivery easier and harder to attribute.

---

## Why Reply-To is the main operational clue

When an attacker spoofs or borrows a sender address, they still need to **receive
your reply somewhere they control.** The `Reply-To` header is where the
conversation is actually steered.

- `From` can be forged or come from a compromised mailbox the attacker does not
  monitor. It is for *display*.
- `Reply-To` is set so that when a victim hits "Reply", the message silently goes
  to the attacker's chosen inbox — here, `biuro@mail2art.com`.

So the Reply-To is the most useful **operational** indicator of where the
campaign wants responses delivered. It is a lead for **reporting** (to the mail
provider hosting that inbox), **not** a basis for accusing or contacting a person.

---

## Why From is not proof of identity

Email's `From` header is trivially forgeable — SMTP was not designed to
authenticate the displayed sender. A `From` address can be:

- **Spoofed** outright (especially when the domain has no DMARC enforcement),
- Sent from a **compromised** legitimate mailbox the real owner doesn't control,
- Or **unrelated** to the human whose name/address appears.

Authentication results (SPF / DKIM / DMARC) and the `Received` chain — not the
`From` line — are what indicate whether a message was actually authorized by the
sending domain. Treat the From address as a **claim to verify**, never as proof.

Because `st.ul.edu.lb` has **no DMARC** record, a receiving server has weaker
signals to reject spoofed mail, and we have weaker signals to attribute it.
Conclusion: the named mailbox owner should be treated as *possibly uninvolved*.

---

## What evidence to preserve

Preserve, do not alter:

1. **The original email as `.eml`** (full headers intact). In most clients:
   "Show original" / "View source" → save as `.eml`. Do **not** forward as the
   only copy (forwarding rewrites headers).
2. **Full raw headers** as a separate `.txt` if you cannot export `.eml`.
3. **The attachment, unopened**, kept in an isolated folder. Record its file
   name and a **SHA256 hash** (see `scripts/security/hash-evidence.ps1`). Do not
   open it.
4. **Screenshots** of the message as displayed (sender, subject, date/time).
5. **Your passive DNS report** (see `SAFE_OSINT_DNS_WORKFLOW.md`).
6. A short **timeline note**: when it arrived, what you did, when you reported it.

Store everything in one folder (e.g. `Desktop\PHISHING_EVIDENCE`) and keep it
read-only where possible.

---

## What NOT to do

- ❌ Do **not** open or "preview" the PDF or any attachment/link.
- ❌ Do **not** reply, "test" the sender, or engage the operator.
- ❌ Do **not** scan, port-probe, brute force, or attempt to log in to any host,
  mailbox, or service connected to the email.
- ❌ Do **not** attempt to access the suspected sender's accounts or "hack back".
- ❌ Do **not** publicly name or accuse the individual whose address appears — it
  may be spoofed or compromised.
- ❌ Do **not** enable macros, click "enable content", or run anything from the
  message.
- ❌ Do **not** enter credentials on any linked page.

Everything in this kit is **passive**: reading headers, public DNS lookups, hashing
your own saved files, and reporting through official channels.

---

## Safe escalation checklist

- [ ] Stop interacting with the message; do not open the attachment.
- [ ] Preserve evidence (`.eml`, raw headers, screenshots, attachment hash).
- [ ] Run passive DNS OSINT and save the report.
- [ ] Report phishing in your mail client (Gmail "Report phishing" / Outlook
      "Report → Phishing"). See `ABUSE_REPORT_TEMPLATES.md`.
- [ ] Report to the **abuse** contacts of the relevant providers:
      Microsoft/Outlook (sending side) and Mail2World (Reply-To inbox).
- [ ] If it impersonates police/government, report to the relevant national
      channel:
  - **Poland:** CERT Polska — <https://incydent.cert.pl/> (and report
    impersonation of authorities to the police via official channels).
  - Your local CERT/CSIRT or national cybercrime reporting portal otherwise.
- [ ] If it targeted a work account, notify your IT/security team.
- [ ] Block the sender and the Reply-To domain in your mail client.
- [ ] Review account security: change password if there's any chance you
      interacted; confirm MFA is enabled; check inbox rules/forwarding.
- [ ] (Optional) Send a single, factual "do not contact me again" notice — see
      template — without threats or accusations.

---

## Final conclusion

This message shows the hallmarks of an **authority-impersonation phishing
attempt**: a fear-inducing "police case" subject, a mismatched From/Reply-To,
an unexpected PDF, and domains without DMARC. The **Reply-To**
(`biuro@mail2art.com`) is the strongest operational indicator of where the
campaign collects responses and is the best lead for **reporting**.

The **From** (`ahmad.yammin@st.ul.edu.lb`) is **not** proof that the named person
is involved — it may be spoofed or compromised. The correct response is entirely
defensive: **preserve evidence, report through official channels, block, and
secure your accounts.** No retaliation, scanning, or contact beyond a single
factual notice.
