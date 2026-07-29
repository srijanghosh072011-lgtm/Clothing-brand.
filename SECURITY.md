# Security — Noctairre

You asked what belongs here given this is your first Shopify build. The short
answer: **Shopify already owns most of the security stack.** A generic web
security checklist will send you chasing things you cannot control and cannot
break. This file covers only what is genuinely yours.

---

## What Shopify handles for you (do not try to configure these)

| Concern | Status |
|---|---|
| TLS / SSL certificate + renewal | Automatic on every domain you connect |
| HTTPS enforcement, HSTS | Automatic |
| PCI DSS Level 1 compliance | Shopify is certified; card data never touches your theme |
| DDoS protection, WAF, CDN | Included on all plans |
| Server patching, infrastructure | Shopify's |
| Checkout security | Shopify-hosted; you cannot modify it, which is the point |
| Bot/spam protection on native forms | Built in |
| Database access | You have none — there is nothing to misconfigure |

You will read advice about `.htaccess`, file permissions, SQL injection,
`wp-config`, and vulnerability scanners. **None of it applies here.** Those are
WordPress concerns. Ignore them.

---

## What is actually yours

### 1. Admin account security — the real attack surface

Nearly every Shopify store compromise is a stolen or reused admin login, not a
platform breach.

- [ ] **Two-factor authentication on every staff account.** Settings → Users →
      each account → Security. Use an authenticator app or a passkey.
      **Do not use SMS** — SIM-swap attacks defeat it, and NIST has flagged SMS
      one-time codes as a restricted authenticator since 2017.
- [ ] **Unique password from a password manager**, 16+ characters, used nowhere
      else.
- [ ] **Scope staff permissions to the minimum.** A social media contributor
      does not need Finances or Apps access. Settings → Users → Permissions.
- [ ] **Remove staff accounts the day someone stops working with you.**
- [ ] When you move the store off `srijan.ghosh072011@gmail.com` to a brand
      address, make the new account the store owner **and** put 2FA on it before
      transferring. A store owner account without 2FA is the single highest-risk
      object you have.

### 2. Apps — your largest third-party risk

Every app you install gets API access to your store data. This is where real
data exposure happens.

- [ ] Install only apps you actively need. An unused app is unmonitored access.
- [ ] Before installing: check the Shopify App Store review count, last update
      date, and the permissions it requests. An app asking for customer data it
      does not need is a red flag.
- [ ] **Uninstall unused apps immediately** — uninstalling revokes the API
      access; leaving it "disabled" does not always.
- [ ] Review installed apps quarterly: Settings → Apps and sales channels.

### 3. Domain and DNS

- [ ] **Auto-renew ON** at your registrar. An expired domain takes the store
      offline and is occasionally unrecoverable.
- [ ] **WHOIS privacy enabled.**
- [ ] **Registrar account has its own 2FA.** Someone who owns your domain owns
      your traffic regardless of how locked down Shopify is.
- [ ] **DNSSEC** enabled if your DNS provider supports it.

### 4. Email authentication (SPF, DKIM, DMARC)

This matters more than it sounds. Without it, your order confirmations land in
spam and anyone can spoof your domain.

- [ ] Shopify walks you through **domain authentication** when you add a sender
      address: Settings → Notifications → Sender email. Complete it — it sets up
      SPF and DKIM.
- [ ] Add a **DMARC** record manually as a DNS TXT record on `_dmarc.yourdomain`:
      ```
      v=DMARC1; p=none; rua=mailto:you@yourdomain.com
      ```
      Start at `p=none` to monitor. After a few weeks of clean reports, move to
      `p=quarantine`, then `p=reject`.
- [ ] Verify with a DMARC checker before trusting it.

### 5. Theme code (this repository)

- [ ] **Never commit API keys, access tokens or passwords** to this repo. There
      are none in it today — keep it that way. If you add a private app token,
      it belongs in Shopify's admin, not in a Liquid file.
- [ ] **Never paste third-party scripts into `theme.liquid`** without knowing
      what they do. A "free analytics" snippet with `<script src>` pointing at an
      unknown domain can read your customers' page activity. Use Shopify's
      Customer Events (Settings → Customer events) instead — it sandboxes them.
- [ ] Run `python3 check_theme.py` before every push.
- [ ] Keep a copy of the live theme before publishing changes: Online Store →
      Themes → Actions → Duplicate. This is your rollback.

### 6. Content Security Policy — set expectations

You **cannot** set arbitrary security headers on a Shopify storefront; Shopify
controls the response headers. This is a limitation, not an oversight, and it is
also why the app and script hygiene above carries more weight than it would on a
self-hosted site. Do not install apps that promise to "add security headers" —
they cannot deliver on a hosted storefront.

---

## Canadian legal requirements (you are in Saskatchewan)

Not security exactly, but required before you can legally sell. Flagging it
because it is the part people miss.

- **PIPEDA** governs your customer data. Saskatchewan has no separate
  private-sector privacy law, so the federal act applies by default. You need a
  privacy policy that states what you collect, why, how it is stored, and names
  a person accountable for privacy with real contact details.
- **CASL** governs your newsletter. You need **express opt-in** (the checkbox
  must not be pre-ticked), sender identification in every email, and a working
  unsubscribe honoured **within 10 business days**. Penalties reach $10M per
  violation for organizations — this is not a formality. The newsletter section
  in this theme is built as express opt-in with consent wording.
- Shopify can generate first-draft privacy, terms, refund and shipping policies:
  **Settings → Policies → Create from template.** Use those as a starting point,
  then have them reviewed. They are a reasonable draft, not legal advice.

---

## Before you go live

- [ ] 2FA on the store owner account and every staff account
- [ ] Store password protection removed (Online Store → Preferences)
- [ ] `noindex` not set — check Online Store → Preferences
- [ ] All four policy pages published and linked in the footer
- [ ] Test order placed and refunded end to end
- [ ] Order confirmation email received and not in spam
- [ ] Domain auto-renew on, registrar 2FA on
- [ ] `python3 check_theme.py` passes
- [ ] Theme duplicated as a rollback point

---

## If something goes wrong

1. **Change the store owner password immediately** and force-log-out all
   sessions: Settings → Users → your account → Log out all devices.
2. Review **Settings → Users → recent activity** for logins you do not recognise.
3. Uninstall any app you did not personally install.
4. Contact Shopify Support — they have server-side logs you cannot see.
5. Under PIPEDA you must report a breach to the Privacy Commissioner of Canada
   **as soon as feasible** if there is a real risk of significant harm to
   customers, and notify affected customers.

---

_Reviewed: this file covers a hosted Shopify storefront only. If you later move
to headless (Hydrogen) or add a custom backend, the threat model changes
substantially and this document needs rewriting._
