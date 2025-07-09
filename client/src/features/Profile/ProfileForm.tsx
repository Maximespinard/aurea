import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useProfileForm } from './useProfileForm';

const ProfileForm = () => {
  const { form, onSubmit, isLoading, profileExists } = useProfileForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="lastPeriodDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last Period Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                This helps us predict your next cycle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cycleLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cycle Length (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="28"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    min={0}
                  />
                </FormControl>
                <FormDescription>
                  Average length of your menstrual cycle
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="periodDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period Duration (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    min={0}
                  />
                </FormControl>
                <FormDescription>
                  How long your period typically lasts
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contraception"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraception Method</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="pill">Birth Control Pill</SelectItem>
                  <SelectItem value="iud">IUD</SelectItem>
                  <SelectItem value="implant">Implant</SelectItem>
                  <SelectItem value="patch">Patch</SelectItem>
                  <SelectItem value="ring">Ring</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your current contraception method (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any additional information about your cycle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Saving...'
            : profileExists
            ? 'Save Changes'
            : 'Create Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
