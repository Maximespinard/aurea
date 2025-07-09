import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfile, useUpdateProfile, useCreateProfile } from "@/hooks/useProfile";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const profileFormSchema = z.object({
  lastPeriodDate: z.string().optional(),
  cycleLength: z.number().min(21).max(45).optional(),
  periodDuration: z.number().min(1).max(10).optional(),
  contraception: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const [date, setDate] = useState<Date>();
  const { data: profile } = useProfile();
  const { profileExists } = useProfileStore();
  const updateProfileMutation = useUpdateProfile();
  const createProfileMutation = useCreateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      cycleLength: 28,
      periodDuration: 5,
      contraception: "",
      notes: "",
    },
  });

  // Load existing profile data into form
  useEffect(() => {
    if (profile) {
      form.reset({
        cycleLength: profile.cycleLength || 28,
        periodDuration: profile.periodDuration || 5,
        contraception: profile.contraception || "",
        notes: profile.notes || "",
      });
      if (profile.lastPeriodDate) {
        setDate(new Date(profile.lastPeriodDate));
      }
    }
  }, [profile, form]);

  async function onSubmit(data: ProfileFormValues) {
    const profileData = {
      ...data,
      lastPeriodDate: date?.toISOString(),
      symptoms: [], // TODO: Add symptoms tracking
    };

    if (profileExists) {
      updateProfileMutation.mutate(profileData);
    } else {
      createProfileMutation.mutate(profileData);
    }
  }

  const isLoading = updateProfileMutation.isPending || createProfileMutation.isPending;

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and cycle tracking preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your cycle tracking information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="lastPeriodDate"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Period Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              {date ? (
                                format(date, "PPP")
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
                            selected={date}
                            onSelect={setDate}
                            initialFocus
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  {isLoading ? "Saving..." : profileExists ? "Save Changes" : "Create Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}