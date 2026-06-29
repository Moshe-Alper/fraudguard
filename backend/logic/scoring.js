function avg(answers, indices) {
  return indices.reduce((sum, i) => sum + answers[i], 0) / indices.length
}

const SUMMARY_TEXTS = {
  'Late Fusion':
    'יש לנו פיצוח! בשביל הצרכים שלכם, הארכיטקטורה שהכי תתאים היא מיזוג מאוחר (Late Fusion).\n\nאיך הגעתי למסקנה הזו?\nהמערכת ניתחה את תשובותיך וזיהתה שסימנת חשיבות גבוהה מאוד למהירות תגובה בזמן אמת ולחיסכון בעלויות החומרה. בארכיטקטורה הזו, המערכת מנתחת כל ערוץ מידע בנפרד – את קול הדובר לחוד ואת הבעות הפנים לחוד – ומחברת ביניהם רק בשלב ההחלטה הסופי.\n\nמה זה נותן לך כמנהל?\n• מהירות ויציבות: הניתוח נפרד ולכן המערכת מגיבה בשבריר שנייה.\n• עמידות לרעשים: סימנת שיש לכם תנאי שטח קשים (כמו רעשי רקע באודיו). בזכות המיזוג המאוחר, רעש רקע במיקרופון לא יזהם את הניתוח המדויק של הווידאו, והמערכת תמשיך לעבוד מצוין.\n• חיסכון כלכלי: המודלים האלה רצים על שרתים זולים בהרבה.',
  'Deep Feature Fusion':
    'יש לנו מנצח! הארכיטקטורה המושלמת עבורכם היא מיזוג תכונות עמוק (Deep Feature Fusion).\n\nאיך הגעתי למסקנה הזו?\nמהתשובות שלך עולה שהדיוק הטכני ואמון המנהלים הם הערכים העליונים בארגונכם, וכי יש נכונות להשקיע משאבי מחשוב לביצועים מקסימליים. המערכת מבצעת הצלבה חכמה בין קול הדיבור לבין הבעות הפנים כבר בשלבי העיבוד המוקדמים של המודל.\n\nמה זה נותן לך כמנהל?\n• תפיסת הוראות מורכבות: שקר הוא אירוע פסיכולוגי מורכב. המערכת לא בודקת רק קול או פנים – היא יודעת לתפוס חוסר עקביות מיקרוסקופי בין מה שהאדם אומר לבין מה שהוא משדר בפרצוף – בו-זמנית.\n• שקיפות מלאה (XAI): מכיוון שציינת שהמנהלים שלכם לא מאמינים ל"קופסאות שחורות", שילבנו בתכרעמה רכיב בינה מלאכותית מסבירה. המערכת לא תגיד רק "הוא משקר" – היא תציג למנהל דוח מילולי שמסביר בדיוק אילו סימנים הובילו למסקנה הזו (לדוגמא: שילוב של טון דיבור גבוה עם תנועת עין מסוימת) – כדי שתוכלו לקבל החלטות בלב שלם.',
}

const RATIONALE = {
  'Late Fusion':
    'על פי מחקרם של Krishnamurthy et al. (2024), אסטרטגיית המיזוג המאוחר היא המועדפת במערכות זמן אמת. המערכת מנתחת כל ערוץ מידע (קול בנפרד, וידאו בנפרד) ומקבלת החלטה משותפת רק בסוף. זה מונע משגיאות בערוץ אחד לזהם את הנתונים הנקיים מהערוץ השני ומבטיח מהירות ויציבות תחת האילוצים שסימנת.',
  'Deep Feature Fusion':
    'על פי מחקרם של Wu et al. (2023), גישה זו מבצעת הצלבת נתונים חזותיים וקוליים בתוך השכבות הנסתרות של הרשת הנירונית. מכיוון שהונאה היא תופעה פסיכולוגית מורכבת, מיזוג עמוק מאפשר לתפוס חוסר עקביות דק מאוד בין הערוצים ומבטיח את הדיוק המקסימלי. מאחר שסימנת שחשוב לך לקבל הסברים, המערכת משלבת שכבת בינה מלאכותית מסבירה (XAI) כפי שמוכיחים Mathur & Reichling (2023) — מתן נימוק ברור למנהל מעלה את האמון ואת נכונותו להסתמך על המערכת.',
}

const RECOMMENDATION_LABELS = {
  'Late Fusion':         'מיזוג מאוחר (Late Fusion)',
  'Deep Feature Fusion': 'מיזוג עמוק (Deep Feature Fusion)',
}

const BONUS_TEXTS = {
  knowledgeDistillation:
    'טיפ מהבוט: נתיב סוג הוראה — אנחנו ממליצים לשלב מודל \'מורה\' גדול (שעובר Fine-tuning על ידע מעמיק) עם מודל \'סטודנט\' קטן ויעיל. זהו נתיב עם תהליכי שחיקה — אתה מקבל ביצועים חדים ומדויקים, אבל חוסך הרבה כסף על חומרה יקרה.',
  openSourceLLM:
    'טיפ מהבוט: נתיב פרטיות ואוטונומיה — מכיוון שסימנת שפרטיות המידע חשובה לך, אנחנו ממליצים לבסס את המערכת על מודלים בקוד פתוח ללא תלות בשירותים חיצוניים (כמו Llama 3). בצורה הזו אתם לא תלויים באף ספק חיצוני — גם אם Llama 3 ישתנה.',
}

function calculateRecommendation({ path, answers }) {
  const recKey = path === 'path1' ? 'Late Fusion' : 'Deep Feature Fusion'

  // Q4–Q5 (indices 3–4): budget/maintenance or precision/processing — knowledge distillation signal
  const economic = avg(answers, [3, 4])
  // Q6–Q7 (indices 5–6): field conditions/sync or open-source/privacy — strategic signal
  const strategic = avg(answers, [5, 6])

  const operationalEfficiency = avg(answers, [0, 1, 3, 4, 5, 6])
  const accuracyAndTrust = avg(answers, [1, 2, 3, 4])

  const bonuses = []
  if (economic >= 4 && path === 'path1') {
    bonuses.push({ type: 'knowledgeDistillation', text: BONUS_TEXTS.knowledgeDistillation })
  }
  if (strategic >= 4 && path === 'path2') {
    bonuses.push({ type: 'openSourceLLM', text: BONUS_TEXTS.openSourceLLM })
  }

  return {
    recommendation: RECOMMENDATION_LABELS[recKey],
    summaryText: SUMMARY_TEXTS[recKey],
    rationale: RATIONALE[recKey],
    scores: {
      operationalEfficiency: Math.round(operationalEfficiency * 100) / 100,
      accuracyAndTrust: Math.round(accuracyAndTrust * 100) / 100,
      economic: Math.round(economic * 100) / 100,
      strategic: Math.round(strategic * 100) / 100,
    },
    bonuses,
  }
}

module.exports = { calculateRecommendation }
