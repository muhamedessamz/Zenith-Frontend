interface LogoProps {
    size?: number;
    showText?: boolean;
    variant?: 'default' | 'white' | 'dark';
    className?: string;
}

export const Logo = ({
    size = 40,
    showText = true,
    variant = 'default',
    className = ''
}: LogoProps) => {
    const textColor = variant === 'white' ? '#ffffff' : variant === 'dark' ? '#0f172a' : '#111827';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Zenith Icon - Mountain Peak with Gradient */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="zenithGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="zenithGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                {/* Glow Effect */}
                <path
                    d="M50 10 L85 75 L15 75 Z"
                    fill="url(#zenithGlow)"
                    filter="blur(8px)"
                />

                {/* Main Mountain Peak */}
                <path
                    d="M50 15 L80 70 L20 70 Z"
                    fill="url(#zenithGradient)"
                />

                {/* Inner Peak Detail */}
                <path
                    d="M50 15 L65 50 L35 50 Z"
                    fill="white"
                    fillOpacity="0.2"
                />

                {/* Peak Highlight */}
                <path
                    d="M50 15 L42 35 L58 35 Z"
                    fill="white"
                    fillOpacity="0.4"
                />

                {/* Base Line */}
                <line
                    x1="15"
                    y1="75"
                    x2="85"
                    y2="75"
                    stroke="url(#zenithGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>

            {showText && (
                <span
                    className="font-display font-bold text-2xl tracking-tight"
                    style={{ color: textColor }}
                >
                    Zenith
                </span>
            )}
        </div>
    );
};

// Compact version for navbar
export const LogoCompact = ({ className = '' }: { className?: string }) => {
    return <Logo size={32} showText={true} className={className} />;
};

// Icon only version
export const LogoIcon = ({ size = 40, className = '' }: { size?: number; className?: string }) => {
    return <Logo size={size} showText={false} className={className} />;
};
