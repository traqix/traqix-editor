import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect, useState } from 'react';
import { TreeItem } from '../types';

interface EditorRightContentProps {
    selectedItem: TreeItem;
    handleChange: any;
}

export const EditorRightContent = ({ selectedItem, handleChange }: EditorRightContentProps) => {
  const [inputValue, setInputValue] = useState(selectedItem.props?.content || "");
  const debouncedInputValue = useDebounce(inputValue, 700);

  useEffect(() => {
    setInputValue(selectedItem.props?.content ?? '')
  }, [selectedItem.props?.content])

  useEffect(() => {
    if (debouncedInputValue !== selectedItem.props?.content) {
        console.log('debouncedInputValue', debouncedInputValue)
      handleChange("content", debouncedInputValue);
    }
  }, [debouncedInputValue]);

  return (
    <Input
      id="content"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};
