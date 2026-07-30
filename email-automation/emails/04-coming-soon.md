# 04 — Coming soon / launch

**Trigger:** manual campaign, sent on launch day
**Audience:** subscribers tagged `interest:<product-handle>`
**Platform:** Shopify Email campaign

---

## 4a. Signup confirmation (automated)

**Subject:** You're on the list

**Preheader:** We'll tell you the moment it drops.

---

You'll hear about **{{ product.title }}** before it goes public.

No countdown, no daily reminders. One email when it's live.

—
Noctairre
夜

*[Business address]* · *[Unsubscribe]*

---

## 4b. Launch (manual send)

**Subject:** {{ product.title }} is live

**Preheader:** You asked first. You get it first.

---

**{{ product.title }}** is available now.

*[One or two lines on the piece — weight, cut, what makes it different.
Match the product page copy. Keep it under 40 words.]*

${{ product.price }} CAD

[Shop it →]({{ product.url }})

---

You're getting this before it goes out to the full list.

—
Noctairre
夜

*[Business address]* · *[Unsubscribe]*

---

## Notes

- **Nothing is in a coming-soon state right now** — every product in the store
  is published. This template stays unused until you draft or tag one; see the
  README, step 5.
- **No discount code here, including `WELCOME10`.** A launch at full price is
  the point, and a permanent code in a launch email invites people to wait for
  the discount instead of buying on day one.
- Send 4b to the interest tag **first**, then to the full list 24–48h later.
  Early access is the reason people join the list; if there's no gap, there's
  no reason.
- No discount on a launch. New product at full price is the whole point.
- Delete the interest tag after launch so it doesn't accumulate stale segments.
