import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@/components/ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Save, User, Shield, Lock, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    phone_number: '',
    role: 'patient',
  });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(''); // Store fetch errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching profile with token:', token); // Debug token
        if (!token) {
          setError('No authentication token found. Please log in again.');
          return;
        }

        const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/appointments/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetch profile response status:', response.status); // Debug response status
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Fetch profile error response:', errorData); // Debug server response
          throw new Error(errorData.message || `Failed to fetch profile (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log('Fetched profile data:', data); // Debug fetched data
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message || 'Failed to load profile. Please try again.');
        toast.error(error.message || 'Failed to load profile');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Saving profile with token:', token); // Debug token
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const updateData = { ...formData };
      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.error('New password and confirmation do not match');
          return;
        }
        updateData.password = passwordData.newPassword;
      }

      console.log('Update data being sent:', updateData); // Debug request body
      const response = await fetch(`https://clinicflow-e7a9.onrender.com/api/appointments/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      console.log('Save profile response status:', response.status); // Debug response status
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save profile error response:', errorData); // Debug server response
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      console.log('Updated user data:', updatedUser); // Debug response data
      setUser(updatedUser.user);
      setFormData(updatedUser.user);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setEditing(false);
      setError(''); // Clear any previous errors
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
      toast.error(error.message || 'Failed to update profile');
    }
  };

  // Render error state if fetch fails
  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle title="My Profile" description="View and manage your personal information" />
        <Card>
          <CardContent className="p-6">
            <div className="text-red-600">{error}</div>
            <Button onClick={() => navigate('/login')} className="mt-4">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="My Profile" description="View and manage your personal information" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" alt={user.username} />
                <AvatarFallback className="text-2xl bg-clinic-100 text-clinic-700">
                  {user.username ? user.username.split(' ').map(n => n[0]).join('') : 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-medium">{user.username}</h3>
              <p className="text-sm text-muted-foreground mt-1">Role: {user.role}</p>
              <div className="w-full mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone_number}</span>
                </div>
              </div>
              <Button
                className="mt-6 w-full"
                variant="outline"
                onClick={() => setEditing(true)}
                disabled={editing}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              {editing && (
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
            <CardDescription>
              {editing ? 'Edit your personal information below' : 'Your personal information'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={editing ? formData.username : user.username}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editing ? formData.email : user.email}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      value={editing ? formData.phone_number : user.phone_number}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-medium mb-2">Password</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Change your password to keep your account secure
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          disabled={!editing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          disabled={!editing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;