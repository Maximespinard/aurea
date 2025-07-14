import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StopCircle } from 'lucide-react';
import { useEndActiveCycle } from '@/hooks/useCycle';
import { format } from 'date-fns';

interface EndCycleButtonProps {
  cycleStartDate: string;
  currentDay: number;
}

export function EndCycleButton({ cycleStartDate, currentDay }: EndCycleButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const endCycleMutation = useEndActiveCycle();

  const handleEnd = () => {
    endCycleMutation.mutate(undefined, {
      onSuccess: () => {
        setShowConfirm(false);
      },
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="text-destructive hover:text-destructive"
      >
        <StopCircle className="mr-2 h-4 w-4" />
        End Period
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Current Period?</AlertDialogTitle>
            <AlertDialogDescription>
              Your period started on {format(new Date(cycleStartDate), 'MMMM d, yyyy')} 
              (Day {currentDay}). Are you sure you want to mark it as ended?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEnd}
              disabled={endCycleMutation.isPending}
            >
              {endCycleMutation.isPending ? 'Ending...' : 'End Period'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}