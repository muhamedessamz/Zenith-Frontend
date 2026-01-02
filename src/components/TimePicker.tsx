import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
    label?: string;
}

export const TimePicker = ({ value, onChange, label = 'Time' }: TimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState('12');
    const [minutes, setMinutes] = useState('00');
    const [period, setPeriod] = useState<'AM' | 'PM'>('PM');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Parse initial value
    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':');
            const hour = parseInt(h);
            const minute = parseInt(m);

            if (hour === 0) {
                setHours('12');
                setPeriod('AM');
            } else if (hour < 12) {
                setHours(hour.toString().padStart(2, '0'));
                setPeriod('AM');
            } else if (hour === 12) {
                setHours('12');
                setPeriod('PM');
            } else {
                setHours((hour - 12).toString().padStart(2, '0'));
                setPeriod('PM');
            }
            setMinutes(minute.toString().padStart(2, '0'));
        }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update parent component
    const updateTime = (h: string, m: string, p: 'AM' | 'PM') => {
        let hour24 = parseInt(h);

        if (p === 'AM') {
            if (hour24 === 12) hour24 = 0;
        } else {
            if (hour24 !== 12) hour24 += 12;
        }

        const timeString = `${hour24.toString().padStart(2, '0')}:${m}`;
        onChange(timeString);
    };

    const handleHourChange = (newHour: string) => {
        setHours(newHour);
        updateTime(newHour, minutes, period);
    };

    const handleMinuteChange = (newMinute: string) => {
        setMinutes(newMinute);
        updateTime(hours, newMinute, period);
    };

    const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
        setPeriod(newPeriod);
        updateTime(hours, minutes, newPeriod);
    };

    const displayTime = value
        ? `${hours}:${minutes} ${period}`
        : 'Select time';

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>

            {/* Input Display */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-left flex items-center justify-between hover:border-indigo-400"
            >
                <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {displayTime}
                </span>
                <Clock size={18} className="text-gray-400" />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 bottom-full mb-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-fadeIn">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {/* Hours */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2 text-center">
                                Hour
                            </label>
                            <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                                {Array.from({ length: 12 }, (_, i) => {
                                    const hour = (i + 1).toString().padStart(2, '0');
                                    return (
                                        <button
                                            key={hour}
                                            type="button"
                                            onClick={() => handleHourChange(hour)}
                                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${hours === hour
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                                }`}
                                        >
                                            {hour}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Minutes */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2 text-center">
                                Minute
                            </label>
                            <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                                {['00', '15', '30', '45'].map((minute) => (
                                    <button
                                        key={minute}
                                        type="button"
                                        onClick={() => handleMinuteChange(minute)}
                                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${minutes === minute
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                            }`}
                                    >
                                        {minute}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* AM/PM */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2 text-center">
                                Period
                            </label>
                            <div className="space-y-1">
                                {(['AM', 'PM'] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => handlePeriodChange(p)}
                                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${period === p
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Current Selection Display */}
                    <div className="pt-3 border-t border-gray-200">
                        <div className="text-center">
                            <span className="text-2xl font-bold text-indigo-600">
                                {hours}:{minutes}
                            </span>
                            <span className="text-lg font-semibold text-gray-600 ml-2">
                                {period}
                            </span>
                        </div>
                    </div>

                    {/* Done Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    );
};
