# Abuse Report Templates

> Ready-to-copy, factual templates for reporting phishing through official
> channels. Fill in the `[BRACKETS]`. Keep the tone factual and neutral — report
> **artifacts and behavior**, not accusations against a named person. Attach your
> preserved evidence (`.eml`, headers, attachment **hash** — never the live
> attachment unless a provider explicitly requests it).

Reusable facts for this case:

```
Subject of phishing email : Sprawa PL-KR/2025 04567
Displayed sender (From)    : ahmad.yammin@st.ul.edu.lb
Reply-To                   : biuro@mail2art.com
Attachment (not opened)    : 0.p32.pdf   (SHA256: [PASTE_HASH])
Impersonated entity        : "policja" (police / authority impersonation)
Date/time received         : [DATE TIME TIMEZONE]
```

---

## 1. Gmail — phishing report note

> First use Gmail's built-in control: open the message → **⋮ → Report phishing**.
> Use the note below if you also email a description or file a Google form.

```
Subject: Phishing report — authority impersonation ("policja")

I received a phishing email in my Gmail account and reported it via
"Report phishing".

Details:
- Subject: Sprawa PL-KR/2025 04567
- Displayed From: ahmad.yammin@st.ul.edu.lb
- Reply-To: biuro@mail2art.com
- Attachment (not opened): 0.p32.pdf, SHA256: [PASTE_HASH]
- Received: [DATE TIME TIMEZONE]

The message impersonates police/authorities and uses a case-number subject to
create urgency. The From and Reply-To are on unrelated domains, consistent with
spoofing or a compromised mailbox. I have preserved the original message and
headers and can provide them on request.

I am not making any allegation against a specific individual; the displayed
sender may be spoofed or compromised.
```

---

## 2. Microsoft / Office 365 abuse report

> The sending domain (`st.ul.edu.lb`) uses Microsoft 365 / Outlook protection.
> Report to: **abuse@microsoft.com** and **reportphishing@microsoft.com**
> (Microsoft also offers the Report Message / Report Phishing add-in).

```
To: abuse@microsoft.com; reportphishing@microsoft.com
Subject: Phishing using Microsoft 365-protected domain (authority impersonation)

Hello Microsoft Abuse Team,

I am reporting a phishing email associated with a domain that uses Microsoft 365 /
Outlook mail protection.

- Displayed From: ahmad.yammin@st.ul.edu.lb
- Sending domain protection host: st-ul-edu-lb.mail.protection.outlook.com
- Reply-To: biuro@mail2art.com
- Subject: Sprawa PL-KR/2025 04567
- Attachment (not opened): 0.p32.pdf, SHA256: [PASTE_HASH]
- Received: [DATE TIME TIMEZONE]

The message impersonates police/authorities. The sending domain has no DMARC
record, and the From/Reply-To domains are unrelated, which is consistent with
spoofing or a compromised mailbox. Full headers and the original .eml are
available on request.

Please review for abuse / possible account compromise. I am not alleging
involvement by any specific individual.

Regards,
[YOUR NAME] / [CONTACT]
```

---

## 3. Mail provider abuse report (Reply-To inbox — Mail2World)

> The Reply-To inbox (`biuro@mail2art.com`) is hosted on Mail2World MX
> (`publicms1.mail2world.com`, `publicms2.mail2world.com`). Report to the
> provider's abuse desk, e.g. **abuse@mail2world.com** (confirm via their site /
> WHOIS abuse contact).

```
To: abuse@mail2world.com
Subject: Phishing campaign using Reply-To inbox on your service

Hello,

A phishing email routes replies to an inbox on your mail service.

- Reply-To (collection inbox): biuro@mail2art.com
- MX for mail2art.com: publicms1.mail2world.com, publicms2.mail2world.com
- Displayed From: ahmad.yammin@st.ul.edu.lb
- Subject: Sprawa PL-KR/2025 04567
- Attachment (not opened): 0.p32.pdf, SHA256: [PASTE_HASH]
- Received: [DATE TIME TIMEZONE]

The email impersonates police/authorities to pressure recipients. The Reply-To
address on your service appears to be the response-collection point. Please
review under your acceptable-use / abuse policy. Original message and full headers
available on request.

Thank you,
[YOUR NAME] / [CONTACT]
```

---

## 4. Domain registrar abuse report

> Find the registrar via public WHOIS/RDAP for the domain in question
> (e.g. `mail2art.com`), then send to the registrar's listed **abuse** contact.
> Do not contact the domain owner directly.

```
To: [REGISTRAR_ABUSE_EMAIL]   (from public WHOIS/RDAP abuse contact)
Subject: Abuse report — domain used in phishing (authority impersonation)

Hello,

I am reporting a domain involved in a phishing campaign and request review under
your anti-abuse policy.

- Domain: [DOMAIN, e.g. mail2art.com]
- Role in incident: [Reply-To inbox / sending domain]
- Associated addresses: From ahmad.yammin@st.ul.edu.lb; Reply-To biuro@mail2art.com
- Subject: Sprawa PL-KR/2025 04567
- Attachment (not opened): 0.p32.pdf, SHA256: [PASTE_HASH]
- Received: [DATE TIME TIMEZONE]

The message impersonates police/authorities. I have preserved the original email
and headers and can provide them. This report concerns the domain's use in the
campaign; I make no allegation about any specific individual.

Regards,
[YOUR NAME] / [CONTACT]
```

---

## 5. Formal "do not contact me again" notice

> Send **at most once**, factual and calm. No threats, no accusations, no
> demands beyond cessation of contact. Sending it routes to whoever controls the
> address; that's acceptable as a single notice. Keep a copy.

```
Subject: Do not contact me again

This address and I do not consent to receiving further messages from you.

Cease all contact. Any further messages will be reported to the relevant email
providers and, where applicable, to the appropriate authorities and national CERT.

This notice is sent once, for the record. No further correspondence will be
entered into.
```

---

## National / authority reporting (impersonation of police)

Because the message impersonates police, also report through official channels:

- **Poland — CERT Polska:** <https://incydent.cert.pl/> (report phishing /
  impersonation). For impersonation of the police specifically, report to the
  police via their official reporting channels.
- **Other countries:** your national CERT/CSIRT or official cybercrime reporting
  portal.
- If a **work** account was targeted, notify your internal IT/security team first.

> Never pay, never "settle", and never share credentials or personal documents in
> response to an impersonation message. Real authorities do not collect fines or
> demand documents via unsolicited email attachments.
