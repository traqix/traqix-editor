import { z } from 'zod';
import { useState, useEffect } from 'react';
import { TreeItem } from '../types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EditorRightEventsProps {
    selectedItem: TreeItem;
    handleChange: (key: string, value: string) => void;
}

const inputSchema = z.string().optional();

export const EditorRightEvents = ({ selectedItem, handleChange }: EditorRightEventsProps) => {
  const [inputValue, setInputValue] = useState(selectedItem.props?.onclick || "");
  const [inputChangeValue, setInputChangeValue] = useState(selectedItem.props?.onchange || "");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(false);
    setInputValue(selectedItem.props?.onclick || "");
    setInputChangeValue(selectedItem.props?.onchange || "");
  }, [selectedItem.id]);

  function handleButtonClick(value: string) {
    setUnlocked(true);
    setInputValue(value ?? '');
  }

  function handleSubmit() {
    const parsedInput = inputSchema.safeParse(inputValue);
    if (parsedInput.success && unlocked) {
      handleChange("onclick", inputValue);
    } else {
      console.error('Invalid input:', parsedInput.error);
    }
  }
  
  function handleInputChangeValue(value: string) {
    setUnlocked(true);
    setInputChangeValue(value ?? '');
  }

  function handleSubmitOnValueChange() {
    const parsedInput = inputSchema.safeParse(inputChangeValue);
    if (parsedInput.success && unlocked) {
      handleChange("onchange", inputChangeValue);
    } else {
      console.error('Invalid input:', parsedInput.error);
    }
  }

  return (
    <div>
      { selectedItem.type.toLowerCase() == "input" && (<div className="space-y-2">
        <Label htmlFor="placeholder">ON Value Change</Label>
        <Textarea
          id="onchange"
          value={inputChangeValue}
          onChange={(e) => handleInputChangeValue(e.target.value)}
        />
        <Button onClick={handleSubmitOnValueChange}>
          Save
        </Button>
      </div> )}
      { true && (<div className="space-y-2">
        <Label htmlFor="placeholder">ON Click</Label>
        <Textarea
          id="onclick"
          value={inputValue}
          onChange={(e) => handleButtonClick(e.target.value)}
        />
        <Button onClick={handleSubmit}>
          Save
        </Button>
      </div>
      )}
    </div>
  );
};
