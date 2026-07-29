# Store policies — drafts to paste into Shopify

**I could not publish these automatically.** The Shopify connection this build
used does not carry the `write_legal_policies` permission, so the four policy
pages have to be pasted in by hand. It takes about five minutes.

**Where they go:** Shopify admin → **Settings → Policies**. Each policy has its
own box. Paste the HTML below into the matching one and save. The footer links
in the theme already point at `/policies/privacy-policy`,
`/policies/terms-of-service`, `/policies/refund-policy` and
`/policies/shipping-policy` — they will start working the moment you save.

> **These are drafts, not legal advice.** Replace every `[SQUARE BRACKET]`
> placeholder with your real details, and have a lawyer review them before you
> take a real order. They are written for a Canadian business under PIPEDA and
> CASL, which is what applies to you in Saskatchewan.

**Placeholders you must replace across all four:**

| Placeholder | What to put |
|---|---|
| `[LEGAL BUSINESS NAME]` | Your registered business name, if different from Noctairre |
| `[MAILING ADDRESS]` | A real mailing address — required by CASL on marketing email |
| `[PROVINCE]` | Saskatchewan |
| `[PRIVACY@NOCTAIRRE.COM]` | Your privacy contact address |
| `[HELLO@NOCTAIRRE.COM]` | Your general contact address |
| `[RETURNS@NOCTAIRRE.COM]` | Your returns address |
| `[7]` | Your record retention period in years |

---

## 1. Privacy policy

```html
<p><em>Last updated: [DATE].</em></p>

<h2>Who we are</h2>
<p>Noctairre ("we", "us") is a clothing brand operating from [PROVINCE], Canada. We are the organization accountable for the personal information collected through this website.</p>
<p><strong>Privacy contact:</strong> [PRIVACY@NOCTAIRRE.COM] &mdash; [MAILING ADDRESS]</p>

<h2>The law that applies</h2>
<p>Because we are a private business in Saskatchewan, which has no general private-sector privacy statute, the federal <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) governs how we handle your personal information.</p>

<h2>What we collect and why</h2>
<ul>
<li><strong>Order information</strong> &mdash; name, email, shipping and billing address, phone number. Collected so we can process, ship and support your order.</li>
<li><strong>Payment information</strong> &mdash; handled entirely by Shopify Payments and our payment processors. We never see or store your full card number.</li>
<li><strong>Account information</strong> &mdash; if you create an account, your email and order history, so you can track orders.</li>
<li><strong>Marketing consent</strong> &mdash; your email address, only if you actively opt in to our newsletter.</li>
<li><strong>Device and usage information</strong> &mdash; IP address, browser, pages viewed, collected through cookies to keep the store working and to understand how it is used.</li>
</ul>

<h2>Consent</h2>
<p>We collect personal information with your knowledge and consent. Placing an order constitutes consent to use that information to fulfil it. Marketing emails require separate, express opt-in and you may withdraw consent at any time.</p>

<h2>Who we share it with</h2>
<p>We share information only with service providers who need it to operate the store: Shopify (e-commerce platform and payments), our shipping carriers, and our email provider. We do not sell your personal information.</p>
<p>Shopify and some providers store data outside Canada, including in the United States. Information held there may be accessible to foreign courts and law enforcement under the laws of that country.</p>

<h2>How long we keep it</h2>
<p>Order records are retained for [7] years to meet Canadian tax and accounting requirements. Marketing contacts are retained until you unsubscribe.</p>

<h2>Your rights</h2>
<p>Under PIPEDA you may request access to the personal information we hold about you, ask us to correct it, or ask us to delete it where we are not legally required to keep it. Write to [PRIVACY@NOCTAIRRE.COM] and we will respond within 30 days.</p>
<p>If you are unsatisfied with our response you may complain to the Office of the Privacy Commissioner of Canada.</p>

<h2>Security</h2>
<p>This store runs on Shopify, which is PCI DSS Level 1 certified. All traffic is encrypted with TLS. We restrict staff access to customer data to those who need it.</p>

<h2>Children</h2>
<p>This store is not directed at children under 13 and we do not knowingly collect their information.</p>

<h2>Changes</h2>
<p>We may update this policy. Material changes will be posted here with a revised date.</p>
```

---

## 2. Terms of service

```html
<p><em>Last updated: [DATE].</em></p>

<h2>1. Agreement</h2>
<p>By using this website or placing an order you agree to these terms. If you do not agree, do not use the site.</p>

<h2>2. Who we are</h2>
<p>This store is operated by [LEGAL BUSINESS NAME] carrying on business as Noctairre, [MAILING ADDRESS], Canada. Contact: [HELLO@NOCTAIRRE.COM].</p>

<h2>3. Eligibility</h2>
<p>You must be the age of majority in your province or state, or have the consent of a parent or guardian, to place an order.</p>

<h2>4. Products</h2>
<p>Our garments are garment-dyed, washed and in some cases hand-distressed. Variation in colour, wash and distressing between individual pieces is inherent to the process and is not a defect. Screen colours vary, so images are a guide rather than an exact match.</p>
<p>We make limited runs and do not guarantee restocks.</p>

<h2>5. Pricing and payment</h2>
<p>All prices are in Canadian dollars and exclude taxes and shipping unless stated. We may change prices at any time before you place an order. We reserve the right to refuse or cancel an order, including where a product has been listed at an incorrect price, and will refund you in full if we do.</p>

<h2>6. Shipping and risk</h2>
<p>Delivery estimates are estimates, not guarantees. Risk of loss passes to you when the carrier delivers the parcel to the address you provided. You are responsible for entering a correct address.</p>

<h2>7. Returns</h2>
<p>Our refund policy forms part of these terms and is available on the refund policy page.</p>

<h2>8. Intellectual property</h2>
<p>All content on this site &mdash; including the Noctairre name, the 夜 mark, garment designs, photography and copy &mdash; belongs to us and may not be reproduced commercially without written permission.</p>

<h2>9. Acceptable use</h2>
<p>You may not use this site to break any law, to scrape or harvest data, to interfere with its operation, or to transmit malicious code.</p>

<h2>10. Marketing emails</h2>
<p>Marketing emails are sent only to people who have given express consent, in compliance with Canada's Anti-Spam Legislation (CASL). Every message identifies us, gives our contact details, and includes an unsubscribe link that we honour within 10 business days.</p>

<h2>11. Limitation of liability</h2>
<p>To the fullest extent permitted by law, our total liability arising from any order is limited to the amount you paid for that order. We are not liable for indirect or consequential losses. Nothing in these terms limits rights you have under applicable consumer protection legislation.</p>

<h2>12. Governing law</h2>
<p>These terms are governed by the laws of [PROVINCE] and the federal laws of Canada, and the courts of [PROVINCE] have jurisdiction.</p>

<h2>13. Changes</h2>
<p>We may update these terms. The version in force is the one published at the time you place your order.</p>
```

---

## 3. Refund policy

```html
<h2>30-day returns</h2>
<p>You may return unworn, unwashed pieces with the original tags attached within <strong>30 days of delivery</strong> for a full refund to your original payment method.</p>

<h2>How to start a return</h2>
<p>Use the return link in your order confirmation email, or write to [RETURNS@NOCTAIRRE.COM] with your order number. We will send you a return label and instructions.</p>

<h2>Return shipping</h2>
<ul>
<li><strong>Within Canada</strong> &mdash; return shipping is covered by us.</li>
<li><strong>International</strong> &mdash; return shipping is at your cost, and original duties are not refundable.</li>
</ul>

<h2>Refund timing</h2>
<p>Once your parcel reaches us we inspect it and issue the refund within 5&ndash;10 business days. Your bank may take a further few days to post it.</p>

<h2>Exchanges</h2>
<p>We do not process direct exchanges. Because runs are small we cannot hold a size while a return is in transit. Return the piece for a refund and place a new order for the size you want.</p>

<h2>Final sale</h2>
<p>Discounted items and the Kanji Patch Set are final sale and cannot be returned unless faulty.</p>

<h2>Faults</h2>
<p>Our garments are hand-distressed and garment-dyed, so variation in wash, fade and distressing is intentional and is not a fault. If a piece has a genuine manufacturing defect, email us within 14 days of delivery with photographs and we will repair, replace or refund it. This does not affect your statutory rights under Canadian consumer protection law.</p>
```

---

## 4. Shipping policy

```html
<h2>Processing</h2>
<p>Orders are packed within two business days. You receive tracking by email as soon as the parcel leaves us. Orders placed on weekends or Canadian statutory holidays are processed the next business day.</p>

<h2>Rates and times</h2>
<ul>
<li><strong>Canada</strong> &mdash; 3&ndash;7 business days. Free on orders over $200 CAD, otherwise $15 CAD.</li>
<li><strong>United States</strong> &mdash; 5&ndash;10 business days, $25 CAD. Duties prepaid, so nothing is owed on delivery.</li>
<li><strong>International</strong> &mdash; 10&ndash;20 business days, calculated at checkout. Duties, taxes and customs fees are the responsibility of the recipient.</li>
</ul>

<h2>Delivery estimates</h2>
<p>Transit times are carrier estimates and are not guaranteed. Weather, customs inspections and carrier backlogs can extend them.</p>

<h2>Incorrect addresses</h2>
<p>Please check your address at checkout. Parcels returned to us because of an incorrect or incomplete address can be reshipped once you pay the return and reshipping cost.</p>

<h2>Lost or damaged parcels</h2>
<p>If tracking has not updated for 10 business days, contact [HELLO@NOCTAIRRE.COM] and we will open a carrier investigation. If a parcel arrives damaged, photograph the packaging and contents and contact us within 7 days.</p>
```

---

## After pasting

The shipping and refund text above must match what you actually configured in
**Settings → Shipping and delivery**. If you change your real rates, change these
too — a policy that contradicts checkout is worse than no policy.
