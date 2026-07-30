# Noctairre — Email Automation

Deterministic email automation. **No AI, no LLM calls, no per-run credit cost.**
Every flow here is a fixed trigger firing a fixed template.

Store: Noctairre · `4cwdw1-f9.myshopify.com` · CAD · Canada (CST)

> **Catalog is placeholder.** The products currently in the store are template
> data, not the real line. Nothing in these templates hardcodes a product name,
> price or SKU — everything runs off merge tags, so the emails stay correct
> when the real catalog goes in.

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
| 6 | Recurring 10% offer | **Shopify Email** campaign, scheduled | You schedule it | Free |

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

### 1. Discount code — one code, used everywhere

Create in Shopify admin → **Discounts → Create discount → Amount off products**:

| Setting | Value |
|---|---|
| Code | `WELCOME10` |
| Type | Percentage, **10%** |
| Applies to | All products |
| Eligibility | All customers |
| Usage limit | **Leave both limits off** |
| End date | None |

> **Do not set "one use per customer."** This single code is both the signup
> reward *and* the recurring offer. Capping it at one use per customer means
> anyone who redeems it on their first order is locked out of every campaign
> after that — they'd get an email with a code that fails at checkout, which is
> worse than not emailing them.

**What one shared code costs you.** Two tradeoffs, both real, both accepted by
choosing this route:

1. **It will leak.** A single static code ends up on RetailMeNot and gets used
   by people who never gave you an email. Unavoidable with a shared code.
2. **No attribution or urgency.** Because it never expires and never changes,
   you can't tell which campaign drove which order, and "ends Sunday" isn't
   enforceable.

If either starts to hurt, the fix is per-campaign codes — see
`emails/05-recurring-offer.md`.

### 2. Email capture — Shopify Forms

Shopify admin → **Apps → Shopify Forms** (free, first-party) → create form:

- Type: Popup, trigger at 15s or 40% scroll
- Fields: Email only (every extra field cuts conversion)
- Offer: 10% off, code `WELCOME10`
- **Consent checkbox is mandatory** — see CASL below

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

Nothing to configure per-product — the app watches every variant.

### 5. Coming soon

No product is in a coming-soon state right now; everything in the catalog is
published. To create that state:

1. Set the product's status to **Draft**, or publish it with a
   `coming-soon` tag, inventory 0 and "continue selling" off.
2. Add a signup form on that product page (Shopify Forms, tagged
   `interest:<product-handle>`).
3. On launch day, send `emails/04-coming-soon.md` as a campaign to that tag.

Step 3 is manual by design — a launch is a decision, not a trigger.

### 6. Recurring offer

Shopify Email → **Campaigns** → schedule `emails/05-recurring-offer.md`.

Cadence: **every 5–6 weeks, not a fixed date.** A discount that lands on the
1st of every month teaches the list to wait for the 1st and stop paying full
price. Vary the hook instead: early access, restock, seasonal, member-only.

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
  01-welcome.md          Sent immediately on subscribe
  02-reminder.md         3 days later, if no order
  03-back-in-stock.md    Variant inventory 0 → >0
  04-coming-soon.md      Manual, on launch day
  05-recurring-offer.md  Scheduled, every 5–6 weeks
```

Each file has subject line, preheader and body. Copy into Shopify Email and
keep the merge tags as written.
