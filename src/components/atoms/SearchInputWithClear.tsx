import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import React from 'react';

interface SearchInputWithClearProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchInputWithClear: React.FC<SearchInputWithClearProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
}) => {
  return (
    <div className="flex gap-2 mb-4 items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border px-3 py-2 rounded-md w-full"
      />
      <Button onClick={onClear} variant="outline" className="p-5">
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};
