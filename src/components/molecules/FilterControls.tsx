import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

type Option = {
  id: number;
  label: string;
};

type FilterControlsProps = {
  materialOptions: Option[];
  selectedMaterial: string;
  onMaterialChange: (value: string) => void;

  conditionOptions: Option[];
  selectedCondition: string;
  onConditionChange: (value: string) => void;

  typeOptions: Option[];
  selectedType: string;
  onTypeChange: (value: string) => void;

  onClearFilters: () => void;
};

export const FilterControls: React.FC<FilterControlsProps> = ({
  materialOptions,
  selectedMaterial,
  onMaterialChange,

  conditionOptions,
  selectedCondition,
  onConditionChange,

  typeOptions,
  selectedType,
  onTypeChange,

  onClearFilters,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <Select onValueChange={onMaterialChange} value={selectedMaterial}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Material" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Materials</SelectItem>
          {materialOptions.map((m) => (
            <SelectItem key={m.id} value={m.id.toString()}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onConditionChange} value={selectedCondition}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conditions</SelectItem>
          {conditionOptions.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onTypeChange} value={selectedType}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {typeOptions.map((t) => (
            <SelectItem key={t.id} value={t.id.toString()}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={onClearFilters}
        className="p-2 rounded-md"
        title="Clear all filters"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
