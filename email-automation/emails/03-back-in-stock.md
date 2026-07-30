# 03 — Back in stock

**Trigger:** variant inventory goes `0 → >0`, for customers who requested it
**Platform:** Back-in-stock app (Appikon *Back in Stock* or *Swym Notify Me*)

---

**Subject:** {{ product.title }} — {{ variant.title }} is back

**Preheader:** You asked to be told. Limited restock.

---

{{ product.title }} is back in {{ variant.title }}.

**{{ product.title }}**
{{ variant.title }} · ${{ variant.price }} CAD

[Buy it →]({{ product.url }})

---

Restocks go fast and we don't hold stock back for anyone. If you want it,
take it now.

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
- No discount in this email. Someone who asked to be notified is already
  going to buy — discounting here just gives away margin.
- Cap at one notification per request, then clear it. Repeatedly emailing
  about the same restock is how you get marked as spam.

### Sold out today

These are the variants the "Notify me" button would appear on right now:

| Product | Variant | SKU | Price |
|---|---|---|---|
| Kuronami Distressed Zip Hoodie | M | `NCT-KZH-M` | $185 |
| Kage Cropped Zip Hoodie | L | `NCT-KCH-L` | $180 |
| Mu Waffle Thermal | XXL | `NCT-MWT-XXL` | $95 |

All three are mid-range sizes on your best pieces — the sizes that sell out
first are the ones worth restocking deepest next run.
