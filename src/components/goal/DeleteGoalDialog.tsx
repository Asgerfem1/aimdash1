import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (deleteAll: boolean) => void;
  isRecurring: boolean;
}

export function DeleteGoalDialog({
  open,
  onOpenChange,
  onConfirm,
  isRecurring,
}: DeleteGoalDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {isRecurring ? (
              <div className="space-y-4">
                <p>How would you like to delete this goal?</p>
                <div className="space-y-2">
                  <button
                    onClick={() => onConfirm(false)}
                    className="w-full p-3 text-left border rounded-lg hover:bg-gray-100"
                  >
                    Delete only this instance
                  </button>
                  <button
                    onClick={() => onConfirm(true)}
                    className="w-full p-3 text-left border rounded-lg hover:bg-gray-100 border-destructive text-destructive"
                  >
                    Delete all recurring instances
                  </button>
                </div>
              </div>
            ) : (
              "This action cannot be undone."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!isRecurring && (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onConfirm(false)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}