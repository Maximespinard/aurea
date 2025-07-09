import { useAuthStore } from '@/stores/authStore';
import { Calendar, User, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Current Cycle Day',
      value: '--',
      icon: Activity,
      description: 'Set up your profile to track cycles',
    },
    {
      title: 'Next Period',
      value: '--',
      icon: Calendar,
      description: 'Add your last period date',
    },
    {
      title: 'Average Cycle',
      value: '--',
      icon: User,
      description: 'Complete profile setup',
    },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your cycle overview and insights.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Complete Profile</p>
                <p className="text-sm text-gray-600">
                  Set up your cycle information
                </p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Log Today</p>
                <p className="text-sm text-gray-600">Add symptoms or notes</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
