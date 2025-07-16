import React, { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Calendar,
  Mail,
  MapPin,
  Activity,
  Filter,
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  Award,
  DollarSign
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../api";


const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Approved: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

const pieColors = ['#10B981', '#F59E0B', '#EF4444'];

const ServiceDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentView, setCurrentView] = useState("overview");

  // Mock data - replace with your actual API call
 const fetchAllUsers = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/api/users`); // 🔁 Use your real API endpoint
    const data = res.data;
    setUsers(data);
    calculateStats(data);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    setLoading(false);
  }
};

  const calculateStats = (userData) => {
    const totalApplications = userData.reduce((acc, user) => acc + (user.servicesApplied?.length || 0), 0);
    const statusCounts = { Pending: 0, Approved: 0, Rejected: 0 };
    const serviceTypes = {};
    
    userData.forEach(user => {
      user.servicesApplied?.forEach(service => {
        statusCounts[service.status]++;
        serviceTypes[service.type] = (serviceTypes[service.type] || 0) + 1;
      });
    });

    setStats({
      totalUsers: userData.length,
      totalApplications,
      statusCounts,
      serviceTypes,
      approvalRate: Math.round((statusCounts.Approved / totalApplications) * 100) || 0
    });
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleStatusChange = async (userId, serviceType, newStatus) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId 
          ? {
              ...user,
              servicesApplied: user.servicesApplied.map(service =>
                service.type === serviceType 
                  ? { ...service, status: newStatus }
                  : service
              )
            }
          : user
      )
    );
    
    const updatedUsers = users.map(user => 
      user._id === userId 
        ? {
            ...user,
            servicesApplied: user.servicesApplied.map(service =>
              service.type === serviceType 
                ? { ...service, status: newStatus }
                : service
            )
          }
        : user
    );
    calculateStats(updatedUsers);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "All") return matchesSearch;
    
    const hasStatus = user.servicesApplied?.some(service => service.status === statusFilter);
    return matchesSearch && hasStatus;
  });

  const chartData = Object.entries(stats.serviceTypes || {}).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const statusData = Object.entries(stats.statusCounts || {}).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const timelineData = users.flatMap(user => 
    user.servicesApplied?.map(service => ({
      date: new Date(service.appliedAt).toLocaleDateString(),
      count: 1
    })) || []
  ).reduce((acc, curr) => {
    const existing = acc.find(item => item.date === curr.date);
    if (existing) {
      existing.count += curr.count;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-10 border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">Service Management</p>
        </div>
        
        <nav className="mt-6">
          <button
            onClick={() => setCurrentView("overview")}
            className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
              currentView === "overview" 
                ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <TrendingUp className="w-5 h-5 mr-3" />
            Overview
          </button>
          
          <button
            onClick={() => setCurrentView("users")}
            className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
              currentView === "users" 
                ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Users & Applications
          </button>
          
          <button
            onClick={() => setCurrentView("analytics")}
            className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
              currentView === "analytics" 
                ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Activity className="w-5 h-5 mr-3" />
            Analytics
          </button>
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 mr-2" />
              <span className="font-semibold">Approval Rate</span>
            </div>
            <div className="text-2xl font-bold">{stats.approvalRate}%</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {currentView === "overview" && "Dashboard Overview"}
              {currentView === "users" && "Users & Applications"}
              {currentView === "analytics" && "Analytics & Reports"}
            </h2>
            <p className="text-gray-600 mt-1">
              {currentView === "overview" && "Welcome to your service management dashboard"}
              {currentView === "users" && "Manage user applications and status updates"}
              {currentView === "analytics" && "Detailed insights and performance metrics"}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={fetchAllUsers}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Overview View */}
        {currentView === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                    <p className="text-sm text-green-600 mt-1">+8% from last month</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.statusCounts?.Pending || 0}</p>
                    <p className="text-sm text-yellow-600 mt-1">Needs attention</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.statusCounts?.Approved || 0}</p>
                    <p className="text-sm text-green-600 mt-1">Great progress!</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mr-2" />
                  <h3 className="text-lg font-semibold">Urgent Actions</h3>
                </div>
                <p className="text-gray-600 mb-4">Applications requiring immediate attention</p>
                <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  View Urgent Items
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">Performance</h3>
                </div>
                <p className="text-gray-600 mb-4">View detailed analytics and reports</p>
                <button 
                  onClick={() => setCurrentView("analytics")}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Analytics
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">User Management</h3>
                </div>
                <p className="text-gray-600 mb-4">Manage users and their applications</p>
                <button 
                  onClick={() => setCurrentView("users")}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Users
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {currentView === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Service Types Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Application Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Application Timeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Users View */}
        {currentView === "users" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user) => (
                <div 
                  key={user._id} 
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.address}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Applications</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {user.servicesApplied?.length || 0}
                      </span>
                    </div>

                    {user.servicesApplied && user.servicesApplied.length > 0 ? (
                      <div className="space-y-2">
                        {user.servicesApplied.map((service, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">{service.type}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[service.status]}`}>
                                {service.status}
                              </span>
                            </div>
                            <select
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={service.status}
                              onChange={(e) => handleStatusChange(user._id, service.type, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No applications</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDashboard;