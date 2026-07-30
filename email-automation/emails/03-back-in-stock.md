# 03 — Back in stock

**Trigger:** variant inventory goes `0 → >0`, for customers who requested it
**Platform:** Back-in-stock app (Appikon *Back in Stock* or *Swym Notify Me*)

---

**Subject:** {{ product.title }} — {{ variant.title }} is back

**Preheader:** You asked to be told.

---

{{ product.title }} is back in {{ variant.title }}.

**{{ product.title }}**
{{ variant.title }} · ${{ variant.price }} CAD

[Buy it →]({{ product.url }})

---

Restocks go fast and we don't hold stock back. If you want it, take it now.

—
Noctairre
夜

*[Business address]*
*[Unsubscribe]*

---

## Notes

- **Merge tag names vary by app.** The ones above are the common convention;
  check your app's docs and adjust. Wrong tags render as literal text in a
  live send — test before enabling.
- Send **immediately** on restock, not batched. The whole value is being first.
- **No discount code in this email.** Someone who asked to be notified is
  already going to buy — adding `WELCOME10` here just gives away margin on a
  sale you'd have made anyway. This is the one email that stays full price.
- Cap at one notification per request, then clear it. Repeatedly emailing
  about the same restock is how you get marked as spam.
- Once the real catalog is loaded, the variants worth watching are the middle
  sizes on your strongest pieces — they sell out first and generate most of
  the notify-me signups.
