type IconProps = { size?: number; className?: string }

const Svg = ({
  size = 20,
  className,
  children,
}: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)

export function ConstructionIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V9.5L12 4l7 5.5V21" />
      <path d="M9 21v-5h6v5" />
    </Svg>
  )
}

export function ResearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 3h6" />
      <path d="M9 3v7L5 18a2 2 0 001.8 3h10.4A2 2 0 0019 18l-4-8V3" />
      <path d="M7 16h10" />
    </Svg>
  )
}

export function TroopsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 4l16 16M20 4L4 20" />
      <path d="M4 4h4v4M16 4h4v4M4 20h4v-4M16 20h4v-4" />
    </Svg>
  )
}

export function HealingIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </Svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2L3 6.5v5.5c0 5.5 4 9.5 9 11 5-1.5 9-5.5 9-11V6.5L12 2z" />
    </Svg>
  )
}

export function PrepareIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </Svg>
  )
}

export function RadarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 20h8M12 20v-4" />
      <path d="M7 14a7 7 0 0110 0" />
      <path d="M4 10a11 11 0 0116 0" />
      <path d="M1 6a15 15 0 0122 0" />
    </Svg>
  )
}

export function ArenaIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 21h8M12 17v4" />
      <path d="M7 4h10v8a5 5 0 01-10 0V4z" />
      <path d="M4 7H7M17 7h3a2 2 0 010 4h-3" />
    </Svg>
  )
}

export function VehicleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </Svg>
  )
}

export function HeroesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      <path d="M12 1l1 3h3l-2.5 2 1 3L12 7.5 9.5 9l1-3L8 4h3l1-3z" />
    </Svg>
  )
}

export function CombatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="10" r="7" />
      <circle cx="9.5" cy="9.5" r="1.5" />
      <circle cx="14.5" cy="9.5" r="1.5" />
      <path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5" />
      <path d="M12 17v2M9 18v1M15 18v1" />
    </Svg>
  )
}

export function CanyonIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2 20L8 8l4 5 3-6 7 13H2z" />
    </Svg>
  )
}

export function TyrantIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 18l2-9 4 5 3-8 3 8 4-5 2 9H3z" />
      <path d="M3 18h18" />
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    </Svg>
  )
}

export function RestIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.35 10.04A9 9 0 019.96 3.65C6.5 4.5 4 7.6 4 11.5A8.5 8.5 0 0012.5 20c3.9 0 7-2.5 7.85-5.96z" />
    </Svg>
  )
}

export function MeritChestIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="10" width="18" height="12" rx="1" />
      <path d="M3 10V7a1 1 0 011-1h16a1 1 0 011 1v3" />
      <path d="M12 6V22" />
      <path d="M8 6a2 2 0 010-4c1.1 0 2 1.8 4 4M16 6a2 2 0 000-4c-1.1 0-2 1.8-4 4" />
    </Svg>
  )
}

export function LuckyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
      <path d="M2 9h20M12 3l4 6-4 12M12 3L8 9l4 12" />
    </Svg>
  )
}

export function DailyQuestsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h8M8 15h5" />
      <path d="M4 7h1M4 11h1M4 15h1" />
    </Svg>
  )
}

// --- Dispatch component ---

export type GameIconType =
  | 'construction'
  | 'research'
  | 'troops'
  | 'healing'
  | 'shield'
  | 'prepare'
  | 'radar'
  | 'arena'
  | 'vehicle'
  | 'heroes'
  | 'combat'
  | 'canyon'
  | 'tyrant'
  | 'rest'
  | 'merit_chest'
  | 'lucky_attempts'
  | 'daily_quests'

const ICON_MAP: Record<GameIconType, (props: IconProps) => React.JSX.Element> = {
  construction: ConstructionIcon,
  research: ResearchIcon,
  troops: TroopsIcon,
  healing: HealingIcon,
  shield: ShieldIcon,
  prepare: PrepareIcon,
  radar: RadarIcon,
  arena: ArenaIcon,
  vehicle: VehicleIcon,
  heroes: HeroesIcon,
  combat: CombatIcon,
  canyon: CanyonIcon,
  tyrant: TyrantIcon,
  rest: RestIcon,
  merit_chest: MeritChestIcon,
  lucky_attempts: LuckyIcon,
  daily_quests: DailyQuestsIcon,
}

export function GameIcon({
  type,
  size,
  className,
}: { type: GameIconType } & IconProps) {
  const Icon = ICON_MAP[type]
  return Icon ? <Icon size={size} className={className} /> : null
}
