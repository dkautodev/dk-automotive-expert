
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Generate hours from 00 to 23
const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

// Only 15-minute intervals
const minutes = ['00', '15', '30', '45'];

const TimeSelect: React.FC<TimeSelectProps> = ({ value, onChange, placeholder = "Sélectionner" }) => {
  // Parse current value
  const [currentHour, currentMinute] = value ? value.split(':') : ['', ''];

  const handleHourChange = (hour: string) => {
    const min = currentMinute || '00';
    onChange(`${hour}:${min}`);
  };

  const handleMinuteChange = (minute: string) => {
    const hr = currentHour || '08';
    onChange(`${hr}:${minute}`);
  };

  return (
    <div className="flex gap-2">
      <Select value={currentHour} onValueChange={handleHourChange}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}h
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={currentMinute} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelect;
