# NewLine PCB — מדריך תחזוקה ועדכון האתר

> מסמך תפעולי לרון ועידו. כל מה שצריך לדעת כדי לתחזק ולעדכן את האתר `newline-pcb.com`.

---

## 1. מה יש לנו

אתר תדמית דו-לשוני (עברית + אנגלית) ל-NewLine PCB LTD, חי ב-`https://newline-pcb.com`.

| רכיב | טכנולוגיה |
|---|---|
| בניית האתר | [Eleventy](https://www.11ty.dev/) (סטטי, מהיר, ללא DB) |
| אחסון + CDN + SSL | Cloudflare Pages |
| קוד מקור | GitHub (`TriangleMusic/newline-pcb-site`) |
| DNS | Cloudflare |
| רשם הדומיין | LiveDNS (livedns.co.il) |
| מייל ארגוני | Google Workspace (`@newline-pcb.com`) |
| טופס יצירת קשר | Web3Forms (250 פניות/חודש בחינם) |
| פריסה אוטומטית | Cloudflare Pages + GitHub Actions |

---

## 2. איפה הכל — חשבונות וקישורים

| מערכת | כתובת | חשבון | למי הגישה |
|---|---|---|---|
| האתר (פרודקשן) | https://newline-pcb.com | — | ציבורי |
| pages.dev (preview) | https://newline-pcb.pages.dev | — | ציבורי |
| קוד ב-GitHub | https://github.com/TriangleMusic/newline-pcb-site | TriangleMusic | מי שיש לו גישה ל-organization |
| Cloudflare (DNS + Pages) | https://dash.cloudflare.com/ | `ido.netzer@gmail.com` | עידו |
| LiveDNS (רשם דומיין) | https://domains.livedns.co.il/ | רון (Ron Netzer) | רון |
| Web3Forms (טופס) | https://app.web3forms.com/ | `ido.netzer@gmail.com` | עידו |
| Google Workspace | https://admin.google.com/ | רון | רון |

**טיפ:** אל תשלחו סיסמאות במייל. כל אחד שומר את הסיסמאות בשמירה שלו (1Password / מנהל-סיסמאות).

---

## 3. שינויים נפוצים — איך עושים מה

### 3.1 לשנות טלפון / מייל / כתובת / WhatsApp
**קובץ:** `src/_data/site.json`

זה קובץ מרכזי. שינוי כאן מעדכן את כל הופעות הפרטים בכל האתר אוטומטית.

```json
{
  "phone": "074-7030307",
  "phoneTel": "+972747030307",
  "whatsappNumber": "972545454649",
  "whatsappDisplay": "+972 54-545-4649",
  "email": "info@newline-pcb.com",
  "addressEn": "P.O.B 6409, Haifa, Zip: 31063",
  "addressHe": "ת.ד 6409, חיפה, מיקוד 31063"
}
```

### 3.2 לשנות טקסטים באתר
- **עברית** — `src/he/index.njk`, `src/he/about.njk`, `src/he/contact.njk`, `src/he/multilayer-pcb.njk`, `src/he/flex-rigid-pcb.njk`
- **אנגלית** — אותם שמות בלי `/he/`: `src/index.njk`, `src/about.njk`, וכו'
- **תוויות UI משותפות (כפתורים, ניווט, פוטר)** — `src/_data/i18n.js`

### 3.3 להוסיף תמונות לגלריה
1. הכינו 2 גרסאות לכל תמונה: `NN-full.jpg` (~1920px) + `NN-thumb.jpg` (~600px)
2. שמרו בתיקייה הנכונה:
   - מעגלים רב-שכבתיים: `src/assets/img/gallery/multilayer/`
   - Flex-Rigid: `src/assets/img/gallery/flex-rigid/`
3. עדכנו את ה-`range(1, N)` בתבנית הרלוונטית (`src/multilayer-pcb.njk` + `src/he/multilayer-pcb.njk`)

### 3.4 לשנות לאן הפניות מהטופס מגיעות
**ב-Web3Forms** (לא בקוד):
1. https://app.web3forms.com/ → Settings → Email Configuration → Recipient Emails
2. כדי להחליף לכתובת אחרת — קודם להוסיף אותה ב-Workspace → Linked Emails ולאמת.

> **כרגע מוגדר:** הפניות מגיעות ל-`ron@newline-pcb.com`.

---

## 4. תהליך עדכון בפועל — שתי דרכים

### דרך א' — קלה (GitHub בדפדפן)
מתאים לשינויי טקסט קטנים.

1. כנסו ל-https://github.com/TriangleMusic/newline-pcb-site
2. נווטו לקובץ שרוצים לערוך (למשל `src/_data/site.json`)
3. לחצו על העיפרון "Edit this file"
4. ערכו → גללו למטה → "Commit changes"
5. **תוך ~דקה** ה-GitHub Action בונה ופורס את האתר אוטומטית. בידקו ב-https://newline-pcb.com

### דרך ב' — מקצועית (מקומי)
מתאים לשינויים גדולים / פיתוח.

```bash
# פעם ראשונה בלבד:
git clone https://github.com/TriangleMusic/newline-pcb-site.git
cd newline-pcb-site
npm install

# כל פעם:
npm run dev          # שרת פיתוח: http://localhost:8080
# ... עורכים בקוד ...
npm run build        # בונה ל-_site/

git add .
git commit -m "<תיאור השינוי>"
git push
# פריסה אוטומטית תוך ~דקה
```

---

## 5. הטופס (Web3Forms) — איך זה עובד

- **מי מקבל את הפניות:** `ron@newline-pcb.com`
- **מי הבעלים של החשבון:** `ido.netzer@gmail.com`
- **מפתח הגישה:** ציבורי, שמור ב-`src/_data/site.json` (שדה `web3formsKey`)
- **מגבלה:** 250 פניות בחודש (תוכנית חינם). מתאפס בכל 1 בחודש.

**להחליף נמען / להוסיף נמען נוסף:**
1. Workspace → Linked Emails → הוסיפו כתובת (היא תקבל מייל אימות)
2. Settings → Email Configuration → Recipient Emails → בחרו את הכתובת
3. Save Settings

**אם פניות לא מגיעות:** בידקו ספאם → https://app.web3forms.com/forms → Submissions (היסטוריה).

---

## 6. דומיין, DNS, ו-SSL

### היכן הדומיין רשום
- **רשם:** LiveDNS (https://domains.livedns.co.il/) — בעלות של רון
- **תוקף נוכחי:** עד `02/10/2029`
- **חידוש:** חודשים לפני התפוגה תקבלו מייל מ-LiveDNS. אל תפספסו!

### שרתי שמות (NS) — Cloudflare
- `paityn.ns.cloudflare.com`
- `skip.ns.cloudflare.com`

> **אל תשנו את ה-NS בלי לדעת מה אתם עושים** — זה ינתק את האתר ואת המייל.

### רשומות DNS חשובות
ב-Cloudflare → newline-pcb.com → DNS → Records:

| Type | Name | Content | Proxy | מטרה |
|---|---|---|---|---|
| CNAME | newline-pcb.com (`@`) | newline-pcb.pages.dev | DNS only | האתר |
| CNAME | www | newline-pcb.pages.dev | DNS only | האתר (www) |
| MX × 5 | newline-pcb.com | ASPMX.L.GOOGLE.com (וכו') | DNS only | מייל Google |
| TXT | newline-pcb.com | `v=spf1 include:_spf.google.com ~all` | DNS only | SPF למייל |
| A | ftp | 107.6.168.93 | DNS only | רשומה ישנה (בטוחה להשאיר) |

> **אם הוספתם DKIM/DMARC מ-Google אחר כך — הוסיפו גם כאן.**

### SSL
- מונפק אוטומטית על-ידי Cloudflare (Google Trust Services).
- מתחדש לבד. לא צריך לגעת.

---

## 7. בעיות נפוצות

### "האתר לא עולה"
1. בידקו https://newline-pcb.pages.dev — אם זה עולה, הבעיה ב-DNS.
2. בידקו ב-https://www.whatsmydns.net/ שה-DNS מצביע ל-Cloudflare.
3. ב-Cloudflare → newline-pcb.com → DNS → ודאו שהרשומות לא השתנו.

### "הטופס לא שולח / לא מגיע"
1. נסו לשלוח טופס מ-https://newline-pcb.com/he/contact/ — האם מופיעה הודעת הצלחה ירוקה?
2. בידקו ספאם בתיבה של רון.
3. כנסו ל-https://app.web3forms.com/forms → Submissions — האם השליחה נרשמה?
4. אם עברתם 250 שליחות החודש — חכו לראשון בחודש או שדרגו ל-Pro.

### "המייל לא מגיע ל-`ron@`"
- זה נושא של Google Workspace (לא של האתר). היכנסו ל-https://admin.google.com.
- אבל בידקו קודם ב-Cloudflare → DNS שרשומות ה-MX לא נמחקו בטעות.

### "פריסה לא מתבצעת אחרי commit"
1. https://github.com/TriangleMusic/newline-pcb-site/actions — בידקו אם ה-Action נכשל.
2. אם נכשל — לחצו על הריצה האחרונה לראות את השגיאה.
3. או — היכנסו ל-Cloudflare Pages → newline-pcb → Deployments ובידקו לוג שם.

---

## 8. מבנה התיקיות — מפה מהירה

```
newline-pcb-site/
├── src/                        ← הכל פה
│   ├── _data/
│   │   ├── site.json          ← טלפון, מייל, WhatsApp, כתובת, מפתח Web3Forms
│   │   └── i18n.js            ← תוויות ניווט וכפתורים (HE/EN)
│   ├── _includes/             ← תבניות משותפות
│   │   ├── layout-he.njk      ← מבנה דף עברי (RTL)
│   │   ├── layout-en.njk      ← מבנה דף אנגלי
│   │   ├── header.njk         ← תפריט עליון
│   │   ├── footer.njk         ← פוטר
│   │   ├── contact-form.njk   ← הטופס (משותף)
│   │   └── whatsapp-fab.njk   ← כפתור WhatsApp צף
│   ├── assets/
│   │   ├── css/               ← עיצוב (tokens, base, components, rtl)
│   │   ├── js/                ← form.js, nav.js, lightbox.js
│   │   └── img/               ← תמונות, לוגו, גלריות
│   ├── index.njk              ← דף הבית (אנגלית)
│   ├── about.njk              ← /about/
│   ├── multilayer-pcb.njk     ← /multilayer-pcb/
│   ├── flex-rigid-pcb.njk     ← /flex-rigid-pcb/
│   ├── contact.njk            ← /contact/
│   └── he/                    ← אותם דפים בעברית תחת /he/
│       ├── index.njk
│       ├── about.njk
│       └── ...
├── _site/                      ← פלט הבנייה (אל תערכו ידנית)
├── .github/workflows/          ← הגדרת הפריסה האוטומטית
├── package.json
├── .eleventy.js                ← הגדרות Eleventy
└── HANDOVER.md                 ← המסמך הזה
```

---

## 9. מי לפנות

- **בעיות באתר / קוד / Cloudflare** — עידו (`ido.netzer@gmail.com`)
- **דומיין / חשבון LiveDNS** — רון (`ron@newline-pcb.com`)
- **מייל Google Workspace** — רון
- **תוכן (טקסטים, תמונות, מספרי טלפון)** — שניכם יחד

---

## 10. צ'קליסט שנתי

- [ ] לחדש את הדומיין ב-LiveDNS לפני 02/10 כל שנה
- [ ] לוודא ש-Cloudflare ו-Pages עדיין מחוברים נכון
- [ ] לבדוק ש-Web3Forms עדיין שולח (לשלוח test פעם ברבעון)
- [ ] לוודא שהפניות לא נופלות לספאם של רון
- [ ] לבדוק שלא חרגנו מ-250 פניות בחודש

---

*נכתב ב-22/05/2026. כשעושים שינוי משמעותי במבנה — עדכנו את המסמך הזה.*
