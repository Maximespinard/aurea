import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Activity } from "lucide-react";
import ProfileForm from "@/features/Profile/ProfileForm";
import { useAuthStore } from "@/stores/authStore";
import { useProfile } from "@/hooks/useProfile";
import { format } from "date-fns";

export default function Profile() {
  const { user } = useAuthStore();
  const { data: profile } = useProfile();


  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and cycle tracking preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Main Content - Form on the left */}
        <div>
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your cycle tracking information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ProfileForm />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - User info on the right */}
        <div className="space-y-6">
          {/* User Card */}
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{user?.username}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {profile && (
                  <div className="mt-4 pt-4 border-t w-full">
                    <p className="text-xs text-muted-foreground">Member since</p>
                    <p className="text-sm font-medium">
                      {format(new Date(user?.createdAt || new Date()), 'MMM yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cycle Stats */}
          {profile && (
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Cycle Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cycle Length</span>
                  <span className="text-sm font-medium">{profile.cycleLength} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Period Duration</span>
                  <span className="text-sm font-medium">{profile.periodDuration} days</span>
                </div>
                {profile.lastPeriodDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Period</span>
                    <span className="text-sm font-medium">
                      {format(new Date(profile.lastPeriodDate), 'MMM d')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}