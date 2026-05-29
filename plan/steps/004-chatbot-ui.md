# 004 — ChatBot UI

## Goal

Replace the static survey form (all 12 sliders visible at once) with a conversational chat bot experience.
The bot asks one question at a time in a WhatsApp-style chat interface, collects answers through a
sticky slider dock at the bottom, and presents the recommendation inline as a bot message.
No backend changes — the same `POST /api/recommend` endpoint is used.

---

## Step 1 — `chat.css`

Create `frontend-react/src/style/cmps/chat.css` with:

- `.chat-container` — flex column, fills viewport height below the header
- `.chat-messages` — scrollable message list (flex, overflow-y auto)
- `.chat-bubble` — base bubble styles + `bubble-in` entrance animation
- `.chat-bubble--bot` — right-aligned (RTL), surface background, border
- `.chat-bubble--user` — left-aligned (RTL), primary color background
- `.chat-bubble--result` — full-width bot bubble for the recommendation card
- `.chat-bubble--typing` — container for the animated typing indicator
- `.typing-dots span` — three dots with staggered `typing-bounce` keyframe animation
- `.chat-input-dock` — sticky bottom panel (flex column, border-top)
- `.chat-bubble--result .result-card` — overrides card background/border to transparent when rendered inside a bubble

Add `@import './cmps/chat.css';` to `frontend-react/src/style/main.css`.

---

## Step 2 — `ChatMessage.jsx`

Create `frontend-react/src/components/chat/ChatMessage.jsx`.

Renders a single message from the `messages` array based on `message.type`:

| `type`    | Output |
|-----------|--------|
| `typing`  | Bot bubble with three animated dots |
| `result`  | Wide bot bubble containing `<ChatResultMessage>` |
| `text`    | Plain bot or user bubble with `message.content` |

The `role` field (`'bot'` / `'user'`) controls the CSS modifier class.

---

## Step 2a — `RobotAvatar.jsx`

Create `frontend-react/src/components/chat/RobotAvatar.jsx`.

An inline SVG robot face with no external assets:
- Rounded rectangle head with antenna nub
- Two circular eyes (class `eye`) for the blink animation
- Curved mouth

The component is purely presentational (no props).

The following CSS is added to `chat.css`:
- `.chat-bubble-row` — flex row wrapping an avatar + bubble; `--bot` variant uses `flex-direction: row-reverse` for RTL alignment
- `.robot-avatar` — 36×36 px, `color: var(--color-primary)` so the SVG inherits the theme color
- `@keyframes robot-float` — translateY 0 → -6 px → 0 over 2.4 s, ease-in-out, infinite
- `@keyframes robot-blink` — scaleY collapses to 0.1 at 95% of a 3 s cycle
- `@media (prefers-reduced-motion)` — disables both animations

Every bot bubble in `ChatMessage.jsx` is wrapped in a `.chat-bubble-row.chat-bubble-row--bot` div with `<RobotAvatar />` as a sibling.

---

## Step 3 — `ChatSliderInput.jsx`

Create `frontend-react/src/components/chat/ChatSliderInput.jsx`.

A sticky dock rendered below the message list while `phase === 'asking'`. Contains:
- A progress hint: "שאלה N מתוך 12"
- `<RangeSlider>` (reused from existing component) with `label=""` — the question text is already shown as a bot bubble above
- An "אשר" button that calls `onConfirm(pendingRange)`

Props: `{ questionIndex, pendingRange, onChange, onConfirm }`

---

## Step 4 — `ResultCard.jsx` (small update) + `ChatResultMessage.jsx`

**`ResultCard.jsx`** — wrap the footer in a conditional so the "התחל מחדש" button
is only rendered when an `onReset` handler is provided:

```jsx
{onReset && (
  <div className="result-card__footer">...</div>
)}
```

This prevents a dead button from appearing when the card is embedded inside a chat bubble.

**`ChatResultMessage.jsx`** — create `frontend-react/src/components/chat/ChatResultMessage.jsx`.
Passes `onReset={null}` to `<ResultCard>` (hides the footer) and conditionally renders `<BonusAlerts>`.

---

## Step 5 — `ChatBot.jsx`

Create `frontend-react/src/components/ChatBot.jsx` — the main orchestrator.

### State

| Name | Type | Purpose |
|------|------|---------|
| `messages` | `Message[]` | Append-only conversation log |
| `currentIndex` | `number` | Active question index (0–11); -1 before first question |
| `pendingRange` | `[lo, hi]` | Live slider value before user confirms |
| `phase` | `string` | `'asking'` / `'loading'` / `'done'` / `'error'` |
| `answersRef` | `useRef` | Stores confirmed `[lo, hi]` pairs — ref avoids re-renders |

### Message shape

```js
{ id: string, role: 'bot'|'user', type: 'text'|'typing'|'result', content, resultData, bonusData }
```

### Conversation flow

```
mount → greeting bot message
  [400ms delay] → push Q[0], set index = 0

onConfirm(range):
  save range to answersRef
  push user bubble with midpoint value
  push typing bubble (id = 'typing')
  [600ms delay]:
    remove typing bubble
    if index < 11  → push next question, advance index, reset pendingRange
    if index === 11 → call API, push result message on success, error bubble on failure

onReset():
  reset answersRef, messages, index, pendingRange, phase
  [400ms delay] → push Q[0] again
```

### Auto-scroll

```js
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])
```

A `<div ref={bottomRef} />` sits at the end of the message list so every new message scrolls into view.

---

## Step 6 — `App.jsx`

Strip the form-era state and handlers:
- Remove: `answers`, `result`, `loading`, `error` state
- Remove: `onSliderChange`, `onSubmit`, `onReset` functions
- Remove: imports of `QuestionForm`, `ResultCard`, `BonusAlerts`, `getRecommendation`
- Add: `import ChatBot from './components/ChatBot'`
- Replace `<main>` content with `<ChatBot />`
- Keep: `theme` state + toggle button in the header

---

## Verification

```bash
cd frontend-react && npm run dev
```

Checklist:
- [ ] Bot opens with a greeting and asks question 1 automatically
- [ ] Confirming an answer shows a user bubble + typing indicator + next question
- [ ] After question 12 the API is called and the recommendation appears inside the chat
- [ ] RTL layout: bot bubbles on the right, user bubbles on the left
- [ ] "התחל מחדש" button resets the full conversation
- [ ] Theme toggle still works and dark mode styles look correct
