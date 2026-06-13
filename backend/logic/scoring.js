function avg(answers, indices) {
  return indices.reduce((sum, i) => sum + answers[i], 0) / indices.length
}

const SUMMARY_TEXTS = {
  'Late Fusion':
    'יש לנו פיצוח! הארכיטקטורה שהכי תתאים לצרכים שלכם, היא מיזוג מאוחר. בפשטות: המערכת מנתחת כל ערוץ בנפרד (את קול הדובר לחוד ואת הבעות הפנים לחוד) ומחברת ביניהם רק בשלב ההחלטה הסופי. למה זה מעולה לכם? כי זה פתרון מהיר בטירוף, חסכוני במשאבים – ואם פתאום יהיה רעש רקע באודיו – הוא לא "יזהם" או יקלקל את הניתוח המדויק של הווידאו. פשוט, יציב ויעיל.',
  'Deep Feature Fusion':
    'יש לנו מנצח! הארכיטקטורה המושלמת עבורכם היא מיזוג תכונות עמוק. מה זה אומר בפועל? המערכת מבצעת הצלבת-סופר בין קול הדיבור לבין הבעות הפנים, עמוק בתוך שלבי העיבוד של המודל. מאחר שהונאה ושקר הם דברים מורכבים פסיכולוגית, המערכת הזו יודעת לתפוס חוסר עקביות מיקרוסקופי בין מה שהאדם אומר לבין מה שהוא משדר בפרצוף. בנוסף, היא כוללת שכבת הסברתיות חכמה שתגיד למנהלים שלכם בדיוק למה היא הגיעה למסקנה הזו, כדי שתוכלו לקבל החלטות בשלמות לב ובביטחון מלא.',
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
  if (economic >= 4) {
    bonuses.push({ type: 'knowledgeDistillation', text: BONUS_TEXTS.knowledgeDistillation })
  }
  if (strategic >= 4) {
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
