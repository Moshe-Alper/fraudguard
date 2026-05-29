export default function RobotAvatar() {
  return (
    <div className="robot-avatar">
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="17" y="2" width="2" height="6" rx="1" fill="currentColor" />
        <circle cx="18" cy="2" r="2" fill="currentColor" />
        <rect x="6" y="8" width="24" height="20" rx="5" fill="currentColor" opacity="0.15" />
        <rect x="6" y="8" width="24" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle className="eye" cx="13" cy="17" r="3" fill="currentColor" />
        <circle className="eye" cx="23" cy="17" r="3" fill="currentColor" />
        <path d="M13 23 Q18 27 23 23" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
