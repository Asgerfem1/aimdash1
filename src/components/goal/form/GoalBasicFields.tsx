import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { GoalFormData } from "@/types/goals";

interface GoalBasicFieldsProps {
  register: UseFormRegister<GoalFormData>;
}

export function GoalBasicFields({ register }: GoalBasicFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter goal title"
          {...register('title', { required: true })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          placeholder="Enter category"
          {...register('category', { required: true })}
        />
      </div>
    </>
  );
}