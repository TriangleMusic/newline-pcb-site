# backups/ — ארכיוני גיבוי לפי תאריך

התיקייה הזו לא נשמרת ב-Git (ראו `.gitignore`) — היא נשארת מקומית על המחשב.

| קובץ | מה זה |
|---|---|
| `newline-pcb-site-YYYY-MM-DD.zip` | הארכיון המלא והנקי: כל הקוד, התמונות והתיעוד, בדיוק כמו בפרויקט. |
| `newline-pcb-site-YYYY-MM-DD-mail.zip` | אותו ארכיון בגרסה שמתאימה לשליחה בג'ימייל. |

## למה יש שתי גרסאות

ג'ימייל חוסם קובצי JavaScript (`.js`, `.mjs`) — גם כשהם בתוך ארכיון ZIP, וגם אם הארכיון מוגן בסיסמה.
לכן בגרסת ה-`-mail` ששת קובצי הקוד נשמרים עם סיומת `.txt` נוספת, ובתוך הארכיון נוספו:

- `קרא-אותי-לפני-שחזור.txt` — הסבר בעברית לנמען
- `restore-names.sh` — מחזיר את השמות המקוריים בפקודה אחת: `bash restore-names.sh`

לשימוש מקומי או להעברה בכל דרך אחרת (Drive, WeTransfer, דיסק) — השתמשו בארכיון הרגיל, בלי ה-`-mail`.

## איך מייצרים גיבוי חדש

```bash
# מתוך תיקיית הפרויקט
STAMP=$(date +%Y-%m-%d)
rsync -a --exclude 'node_modules/' --exclude '_site/' --exclude '.git/' \
      --exclude 'backups/' --exclude 'docs/dev-logs/' --exclude '.DS_Store' \
      ./ /tmp/newline-pcb-site/
(cd /tmp && zip -qr "$OLDPWD/backups/newline-pcb-site-$STAMP.zip" newline-pcb-site)
```

מומלץ לייצר גיבוי חדש ולשלוח לרון פעם בשנה, או אחרי שינוי משמעותי באתר.
