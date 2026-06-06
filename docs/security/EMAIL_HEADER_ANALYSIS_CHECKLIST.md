# Email Header Analysis Checklist

> A passive, read-only checklist for analyzing a suspicious email's headers.
> Reading headers and doing public DNS lookups is safe. Do not contact, probe, or
> scan anyone. Write **neutral** conclusions — see the final section.

How to get full headers:
- **Gmail:** open message → ⋮ → **Show original**.
- **Outlook (desktop):** open message → **File → Properties → Internet headers**.
- **Outlook (web):** open message → ⋯ → **View → View message source**.
- Save the raw text; analyze the saved copy.

---

## 1. From
- The **displayed** sender. Easily spoofed — treat as a claim, not proof.
- Record the display name **and** the actual address; they can differ.
- Example in this case: `ahmad.yammin@st.ul.edu.lb`.
- ✅ Check: does the From domain match the Return-Path and DKIM `d=` domain?

## 2. Reply-To
- Where replies are silently routed. Often the attacker's real collection inbox.
- ⚑ A Reply-To on a **different, unrelated domain** than From is a strong red flag.
- Example: `biuro@mail2art.com` (unrelated to the From domain).
- Use it as a **reporting lead**, not as identity attribution.

## 3. Return-Path (envelope sender / MAIL FROM)
- The bounce address used during SMTP delivery; what SPF is actually checked
  against.
- ✅ Check: does it align with the From domain? A mismatch suggests spoofing or
  third-party sending.

## 4. Received chain
- The hop-by-hop path, **read bottom-to-top** (oldest at the bottom).
- The **lowest trustworthy** `Received` line closest to origin is most telling;
  upper hops are added by your own provider.
- ✅ Check: do the originating server/IP and HELO name match the claimed sending
  domain? Does the geography make sense?
- ⚑ Inconsistent or unexpected originating infrastructure is a red flag.
- Look up an IP's owner with passive WHOIS/RDAP only — **do not** connect to it.

## 5. Message-ID
- Unique ID assigned by the originating server, usually `<random@domain>`.
- ✅ Check: does the domain portion match the sending infrastructure? A mismatched
  or malformed Message-ID can indicate forgery or unusual tooling.
- Record it verbatim for your report.

## 6. SPF (Sender Policy Framework)
- Authorizes which servers may send for a domain. Result appears in
  `Authentication-Results` / `Received-SPF` (`pass` / `fail` / `softfail` /
  `none`).
- ✅ Check the published record: `Resolve-DnsName <domain> -Type TXT` → look for
  `v=spf1 ...`.
- Context: `st.ul.edu.lb` SPF includes `spf.protection.outlook.com`.
- ⚑ `fail`/`softfail` on a domain that should be authorized = likely spoofing.

## 7. DKIM (DomainKeys Identified Mail)
- A cryptographic signature (`DKIM-Signature` header) tied to a domain via `d=`.
- ✅ Check `Authentication-Results` for `dkim=pass` and which `d=` domain signed.
- ⚑ `dkim=none`/`fail`, or a `d=` that doesn't match the From domain, is suspect.

## 8. DMARC
- Policy that ties SPF/DKIM alignment to an action (`none` / `quarantine` /
  `reject`) and reporting.
- ✅ Check: `Resolve-DnsName _dmarc.<domain> -Type TXT` → look for `v=DMARC1`.
- Context: **both** `st.ul.edu.lb` and `mail2art.com` have **no DMARC** record →
  weaker spoofing protection and weaker attribution. Note this neutrally.

## 9. MX records
- The mail servers that receive a domain's mail.
- ✅ Check: `Resolve-DnsName <domain> -Type MX`.
- Context: `mail2art.com` → `publicms1.mail2world.com`, `publicms2.mail2world.com`
  (Mail2World); `st.ul.edu.lb` → Microsoft 365 protection host.
- MX tells you **which provider's abuse desk** to contact.

## 10. TXT / SPF records
- TXT records hold SPF and other verification strings.
- ✅ Check: `Resolve-DnsName <domain> -Type TXT`.
- Record the full SPF string and any other relevant TXT entries verbatim.

## 11. Attachment metadata
- **Do not open the attachment.** Record only:
  - File name (e.g. `0.p32.pdf`) and size.
  - **SHA256 hash** (see `scripts/security/hash-evidence.ps1`).
  - File type as reported by the OS (do not execute or render it).
- A hash lets a provider or analyst correlate the sample without you opening it.

---

## How to write neutral conclusions (without accusing a person)

The goal is an accurate, defensible record — not an allegation.

**Do**
- Attribute to **observable artifacts**, not people:
  > "The message presents `ahmad.yammin@st.ul.edu.lb` as the sender, with a
  > Reply-To of `biuro@mail2art.com`."
- Use **hedged, evidence-based** language:
  > "The From/Reply-To mismatch and absence of DMARC are **consistent with**
  > spoofing or a compromised mailbox."
- Separate **fact** ("no DMARC record was found") from **inference** ("this
  weakens attribution").
- Note uncertainty explicitly:
  > "It cannot be determined from the headers alone whether the named mailbox
  > owner is involved, unaware, or impersonated."

**Don't**
- ❌ State or imply that the named individual "sent" or "is behind" the attack.
- ❌ Use accusatory verbs ("attacker X did…") tied to a real person's name.
- ❌ Publish the individual's personal details or call them out publicly.
- ❌ Draw conclusions the headers don't support.

**Template conclusion**
> "Based on header analysis, this email exhibits indicators consistent with an
> authority-impersonation phishing attempt: a From/Reply-To domain mismatch, an
> unexpected attachment, and sending domains without DMARC enforcement. The
> Reply-To address (`biuro@mail2art.com`) indicates where replies are routed and
> is provided to the relevant provider for abuse review. The displayed sender may
> be spoofed or compromised; no determination is made here about any specific
> individual's involvement."
