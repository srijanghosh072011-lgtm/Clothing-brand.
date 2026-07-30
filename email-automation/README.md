# Noctairre — Email Automation

Deterministic email automation. **No AI, no LLM calls, no per-run credit cost.**
Every flow here is a fixed trigger firing a fixed template.

Store: Noctairre · `4cwdw1-f9.myshopify.com` · CAD · Canada (CST)

---

## The rule this is built on

Nothing in this system calls a model. Every email is a static template with
merge tags (`{{ customer.first_name }}`, `{{ product.title }}`) that the email
platform fills in. Triggers are boolean: *this happened → send that*.

That means the running cost is the email platform's, not an AI bill, and it
stays flat whether you send 100 emails or 100,000.

---

## Architecture

| # | What you asked for | Tool | Trigger | Runtime cost |
|---|---|---|---|---|
| 1 | Capture email on site, give 10% off | **Shopify Forms** (free Shopify app) | Visitor submits form | Free |
| 2 | Automated welcome email w/ code | **Shopify Email** automation | `Customer subscribes to email marketing` | Free ≤10k emails/mo |
| 3 | Reminder if code unused | **Shopify Email** automation, 3-day wait | Subscribed 3 days ago, no order | Free |
| 4 | Back-in-stock alert | **Back-in-stock app** (Swym / Appikon, free tier) | Variant inventory `0 → >0` | Free tier |
| 5 | Coming-soon alert | Product tag + **Shopify Email** campaign | Manual send on launch | Free |
| 6 | ~Monthly 10% offer | **Shopify Email** campaign, scheduled | You schedule it | Free |

### Where Zapier fits: nowhere in the above — and that's deliberate

Zapier MCP (the thing installed earlier in this session) is an **agentic**
tool. It only runs while you're in a chat, and every run is an LLM call. It
cannot fire at 3am when someone subscribes, and it would bill exactly the
credits you said you didn't want to spend. Your instinct was right; this stack
avoids it entirely.

Classic Zapier **Zaps** (built on zapier.com, not MCP) *are* pure
if-this-then-that with no AI — but you don't need them for anything above.
Keep them in reserve for genuine cross-app glue Shopify can't do, e.g.:

- New subscriber → append row to Google Sheets (1 task)
- New order → post to Discord (1 task)

Those cost Zapier *tasks*, not AI credits.

---

## Setup, in order

### 1. Discount code

Create in Shopify admin → **Discounts → Create discount → Amount off products**:

- Code: `WELCOME10`
- Type: Percentage, **10%**
- Applies to: All products
- Eligibility: All customers
- Usage limit: **one use per customer** ← important, see caveat below
- No end date

> **Caveat on static codes.** A single shared code like `WELCOME10` ends up on
> RetailMeNot within weeks and gets used by people who never gave you an email.
> The better pattern is a **unique code per subscriber**, which Shopify Forms
> generates automatically. Prefer that if Forms supports it on your plan.

### 2. Email capture — Shopify Forms

Shopify admin → **Apps → Shopify Forms** (free, first-party) → create form:

- Type: Popup, trigger at 15s or 40% scroll
- Fields: Email only (every extra field cuts conversion)
- Offer: 10% off
- **Consent checkbox is mandatory** — see CASL note below

Place it on the homepage and product pages.

### 3. Welcome + reminder — Shopify Email

Shopify admin → **Marketing → Automations → Create automation**.

- **Welcome:** trigger `Customer subscribes to email marketing` → send
  `emails/01-welcome.md`. No delay.
- **Reminder:** same automation, add **Wait 3 days** → condition
  `Customer has not placed an order` → send `emails/02-reminder.md`.

### 4. Back in stock

Shopify has **no native** customer-facing back-in-stock email. Install a
purpose-built app — *Back in Stock* (Appikon) or *Swym Notify Me*. Both have
free tiers and both are rule-based, no AI.

Adds a "Notify me when available" button on sold-out variants, then fires
`emails/03-back-in-stock.md` when inventory goes above zero.

**Currently sold out** (these are what the button would appear on today):

| Product | Size | Price |
|---|---|---|
| Kuronami Distressed Zip Hoodie | M | $185 |
| Kage Cropped Zip Hoodie | L | $180 |
| Mu Waffle Thermal | XXL | $95 |

### 5. Coming soon

**You have no coming-soon products right now** — all 13 products are `ACTIVE`
and published. To create that state:

1. Set the product's status to **Draft**, or publish it with a
   `coming-soon` tag and inventory 0 with "continue selling" off.
2. Add a signup form on that product page (Shopify Forms, tagged
   `interest:<product-handle>`).
3. On launch day, send `emails/04-coming-soon.md` as a campaign to that tag.

Step 3 is manual by design — a launch is a decision, not a trigger.

### 6. Monthly offer

Shopify Email → **Campaigns** → schedule `emails/05-monthly-offer.md`.

Cadence: send it **every 5–6 weeks, not on a fixed date**. A predictable
monthly discount trains people to wait for it and stop paying full price —
which is a real margin problem for a brand at your price points ($75–$245).
Vary the hook: early access, restock, seasonal, member-only.

Create a fresh code each send (`NOCT-OCT`, `NOCT-NOV`…) with a 7-day expiry so
urgency is real.

---

## Two blockers before any of this sends

### Plan: trial — you'll need to upgrade before you can start selling and unlock full features

Shopify Email requires a paid plan to send.

### CASL (Canada's Anti-Spam Legislation)

You're a Canadian business emailing marketing. CASL is stricter than US
CAN-SPAM and penalties reach $10M for businesses. Every email needs:

- **Express consent** — an unticked checkbox with clear wording. Not
  pre-ticked, not bundled into "I agree to terms".
- **Sender identification** — business name and mailing address in the footer.
- **Unsubscribe** — working, one-click, honoured within 10 business days.

Shopify Email adds identification and unsubscribe automatically. This is the
main reason not to send marketing mail through Gmail: **Gmail has no
unsubscribe mechanism**, so a Gmail-based flow is non-compliant from day one,
on top of its 500/day cap and the deliverability hit from sending bulk mail off
a personal address.

Consent wording for the form:

> ☐ Email me about new drops, restocks and offers from Noctairre. You can
> unsubscribe anytime.

---

## Files

```
emails/
  01-welcome.md         Sent immediately on subscribe
  02-reminder.md        3 days later, if no order
  03-back-in-stock.md   Variant inventory 0 → >0
  04-coming-soon.md     Manual, on launch day
  05-monthly-offer.md   Scheduled, every 5–6 weeks
```

Each file has subject line, preheader and body. Copy into Shopify Email and
keep the merge tags as written.
