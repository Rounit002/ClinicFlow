
import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Save, User, Shield, Lock, FileText, Phone, Mail, Home, Cake } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    dob: '1985-06-15',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    bloodType: 'O+',
    allergies: 'Penicillin',
    emergencyContact: 'Sarah Johnson',
    emergencyPhone: '(555) 987-6543',
    insurance: 'HealthPlus Insurance',
    policyNumber: 'HP12345678',
    insurancePhone: '(800) 555-1234'
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    setUser({ ...formData });
    setEditing(false);
    toast.success('Profile updated successfully');
  };
  
  return (
    <div className="space-y-6">
      <PageTitle title="My Profile" description="View and manage your personal information" />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="text-2xl bg-clinic-100 text-clinic-700">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">Patient ID: PT-10234</p>
              
              <div className="w-full mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Cake className="h-4 w-4 text-muted-foreground" />
                  <span>{user.dob}</span>
                </div>
              </div>
              
              <Button className="mt-6 w-full" variant="outline" onClick={() => setEditing(true)} disabled={editing}>
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
              {editing ? 'Edit your personal information below' : 'Your personal and medical information'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="medical">
                  <FileText className="h-4 w-4 mr-2" />
                  Medical
                </TabsTrigger>
                <TabsTrigger value="insurance">
                  <Shield className="h-4 w-4 mr-2" />
                  Insurance
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={editing ? formData.name : user.name}
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
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={editing ? formData.phone : user.phone}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type={editing ? "date" : "text"}
                      value={editing ? formData.dob : user.dob}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={editing ? formData.address : user.address}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={editing ? formData.city : user.city}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={editing ? formData.state : user.state}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={editing ? formData.zipCode : user.zipCode}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input
                      id="bloodType"
                      name="bloodType"
                      value={editing ? formData.bloodType : user.bloodType}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      name="allergies"
                      value={editing ? formData.allergies : user.allergies}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-sm font-medium mb-2">Emergency Contact</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Name</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={editing ? formData.emergencyContact : user.emergencyContact}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <Input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={editing ? formData.emergencyPhone : user.emergencyPhone}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="insurance" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance Provider</Label>
                    <Input
                      id="insurance"
                      name="insurance"
                      value={editing ? formData.insurance : user.insurance}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      name="policyNumber"
                      value={editing ? formData.policyNumber : user.policyNumber}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurancePhone">Insurance Phone</Label>
                  <Input
                    id="insurancePhone"
                    name="insurancePhone"
                    value={editing ? formData.insurancePhone : user.insurancePhone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
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
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" disabled={!editing} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" disabled={!editing} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" disabled={!editing} />
                      </div>
                    </div>
                    
                    {editing && (
                      <Button className="mt-4" size="sm" disabled={!editing}>Update Password</Button>
                    )}
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
