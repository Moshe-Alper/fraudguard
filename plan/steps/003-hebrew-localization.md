# Step 3: Hebrew Localization Plan

## Verification: Does the app match the PDF spec?

**Yes — the logic is a complete match:**

| PDF Spec | Current Code | Status |
|---|---|---|
| 12 slider questions (range 1–5) | 12 questions in `QuestionForm.jsx` | ✓ |
| Q1,Q2,Q5,Q6,Q7,Q8 → Operational Efficiency score | `avg(answers, [0,1,4,5,6,7])` in `scoring.js` | ✓ |
| Q3,Q4,Q11,Q12 → Accuracy & Trust score | `avg(answers, [2,3,10,11])` in `scoring.js` | ✓ |
| OpEff > AccTrust → Late Fusion | `operationalEfficiency > accuracyAndTrust` | ✓ |
| AccTrust ≥ OpEff → Deep Feature Fusion | else branch | ✓ |
| Q5+Q6 avg ≥ 4 → Knowledge Distillation bonus | `economic >= 4` | ✓ |
| Q9+Q10 avg ≥ 4 → Open Source LLM bonus | `strategic >= 4` | ✓ |

**Only text content and layout direction need to change.**

---

## Changes Required

### Step 3.1 — Translate questions in `frontend-react/src/components/QuestionForm.jsx`

Replace each English label and category name with Hebrew:

| # | English Label | Hebrew Label |
|---|---|---|
| 1 | How critical is real-time response? | עד כמה קריטית דרישת זמן אמת? |
| 2 | How important is low processing latency? | עד כמה חשובה מהירות תגובה מקצה לקצה? |
| 3 | How important is verbal reasoning explainability? | עד כמה נדרש קומינ מילולי (ולא רק ציון)? |
| 4 | How important is algorithmic transparency? | עד כמה קריטית שקיפות אלגוריתמית? |
| 5 | How constrained is your hardware budget? | עד כמה חמורה מגבלת התקציב לרכישת שרתים? |
| 6 | How important is minimizing ongoing operational costs? | עד כמה חשוב לצמצם עלויות תפעול שוטפות? |
| 7 | How noisy is your input data? | האם נתוני השטח נוטים להיות "מלוכלכים"? |
| 8 | How complex is audio-video synchronization? | עד כמה מאתגר לסנכרן בין ערוצי המידע השונים? |
| 9 | How important is technological independence? | עד כמה חשוב לארגון להשתמש בקוד פתוח? |
| 10 | How critical is keeping data on-premises? | עד כמה קריטי שמידע פנים-ארגוני יישאר בשרתי החברה? |
| 11 | How important is detection accuracy? | עד כמה גבוהי דיוק הם הערך הכי חשוב לחברה? |
| 12 | How willing are you to trade resources for performance? | האם הארגון מוכן להשקיע יותר זמן עיבוד כדי שלא יפספס הונאה? |

Category name translations:
- Operational → ממד מבצעי (זמן אמת)
- Managerial → ממד ניהולי (הסברתיות ואמון)
- Economic → ממד כלכלי (תקציב ומשאבים)
- Technical → ממד טכני (סביבת עבודה)
- Strategic → ממד אסטרטגי (קוד פתוח ואבטחה)
- Quality → ממד איכותי (דיוק)

### Step 3.2 — Translate scoring rationale in `backend/logic/scoring.js`

Replace the `RATIONALE` and `BONUS_TEXTS` values with Hebrew text from the PDF:

**Late Fusion rationale:**
> על פי מחקרם של Krishnamurthy et al. (2024), אסטרטגיית המיזוג המאוחר היא המועדפת במערכות זמן אמת. המערכת מנתחת כל ערוץ מידע (קול בנפרד, וידאו בנפרד) ומקבלת החלטה משותפת רק בסוף. זה מונע משערים בערוץ אחד לזהם את הנתונים הנקיים מהערוץ השני ומבטיח מהירות ויציבות תחת האילוצים שסימנת.

**Deep Feature Fusion rationale:**
> על פי מחקרם של Wu et al. (2023), גישה זו מבצעת הצלבת נתונים חזותיים וקוליים בתוך השכבות הנסתרות של הרשת הנירונית. מכיוון שהונאה היא תופעה פסיכולוגית מורכבת, מיזוג עמוק מאפשר לתפוס חוסר עקביות דק מאוד בין הערוצים ומבטיח את הדיוק המקסימלי. מאחר שסימנת שחשוב לך לקבל הסברים, המערכת משלבת שכבת בינה מלאכותית מסבירה (XAI) כפי שמוכיחים Mathur & Reichling (2023) — מתן נימוק ברור למנהל מעלה את האמון ואת נכונותו להסתמך על המערכת.

**Knowledge Distillation bonus:**
> מומלץ לשלב טכנולוגיית זיקוק ידע – (Knowledge Distillation) לפי Karimi et al. (2022), תהליך זה מאפשר למודל 'סטודנט' קטן ורזה להתאמן על בסיס מודל 'מורה' מורכב, ובכך לחסוך עלויות תשתית עצומות מבלי לאבד דיוק.

**Open Source LLM bonus:**
> מומלץ לבסס את המערכת על מודלים בקוד פתוח – (Open-Source LLM) על פי Zhu et al. (2023), שימוש במודלים פתוחים (כמו Llama 3) משחרר את הארגון מתלות יקרה בספקים חיצוניים ומבטיח ריבונות ואבטחת מידע פנים-ארגונית קשיחה.

### Step 3.3 — Translate UI strings in `frontend-react/src/components/ResultCard.jsx`

- `"Recommendation"` → `"המלצה"`
- `"Operational Efficiency"` → `"יעילות מבצעית"`
- `"Accuracy & Trust"` → `"דיוק ואמון ניהולי"`
- `"Reset"` → `"התחל מחדש"`

### Step 3.4 — Translate UI strings in `frontend-react/src/components/BonusAlerts.jsx`

- `"Bonus Insights"` → `"המלצות משלימות"`

### Step 3.5 — Translate submit button in `QuestionForm.jsx`

- `"Get Recommendation"` → `"קבל המלצה"`
- `"Analysing…"` → `"מנתח..."`

### Step 3.6 — Add RTL direction to CSS

Hebrew is right-to-left. Add `direction: rtl; text-align: right;` to the root in `frontend-react/src/style/basics/base.css` (or `var.css`), so all layout and text flows correctly without touching every component.

---

## What Does NOT Need to Change

- All scoring logic in `scoring.js` — 100% matches the PDF
- All React component structure
- All CSS layout classes
- Backend routes and API shape
- The RangeSlider component behavior (default midpoint, range 1–5)
