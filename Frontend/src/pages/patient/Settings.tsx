
import React, { useState } from 'react';
// import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Bell, Moon, Globe, Eye, Lock, LogOut, Save } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      appointments: true,
      reminders: true,
      messages: true,
      updates: false
    },
    appearance: {
      darkMode: false,
      compactView: false
    },
    privacy: {
      twoFactorAuth: false,
      shareData: true,
      cookieConsent: true
    },
    preferences: {
      language: 'English',
      timeFormat: '12h'
    }
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* <PageTitle title="Settings" description="Manage your account settings and preferences" /> */}
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="appointments">Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about upcoming appointments
                </p>
              </div>
              <Switch
                id="appointments"
                checked={settings.notifications.appointments}
                onCheckedChange={() => handleToggle('notifications', 'appointments')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminders">Medication Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded when to take your medications
                </p>
              </div>
              <Switch
                id="reminders"
                checked={settings.notifications.reminders}
                onCheckedChange={() => handleToggle('notifications', 'reminders')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="messages">Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new messages from your doctor
                </p>
              </div>
              <Switch
                id="messages"
                checked={settings.notifications.messages}
                onCheckedChange={() => handleToggle('notifications', 'messages')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="updates">System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about system updates and new features
                </p>
              </div>
              <Switch
                id="updates"
                checked={settings.notifications.updates}
                onCheckedChange={() => handleToggle('notifications', 'updates')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-muted-foreground" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how Health Portal looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch to dark theme to reduce eye strain
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={settings.appearance.darkMode}
                onCheckedChange={() => handleToggle('appearance', 'darkMode')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compactView">Compact View</Label>
                <p className="text-sm text-muted-foreground">
                  Show more information with less spacing
                </p>
              </div>
              <Switch
                id="compactView"
                checked={settings.appearance.compactView}
                onCheckedChange={() => handleToggle('appearance', 'compactView')}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select 
                id="language"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={settings.preferences.language}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, language: e.target.value }
                }))}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="12h" 
                    value="12h"
                    name="timeFormat"
                    checked={settings.preferences.timeFormat === '12h'}
                    onChange={() => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, timeFormat: '12h' }
                    }))}
                    className="h-4 w-4 border-primary text-primary focus:ring-primary"
                  />
                  <Label htmlFor="12h" className="text-sm font-normal">12-hour (AM/PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="24h" 
                    value="24h"
                    name="timeFormat"
                    checked={settings.preferences.timeFormat === '24h'}
                    onChange={() => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, timeFormat: '24h' }
                    }))}
                    className="h-4 w-4 border-primary text-primary focus:ring-primary"
                  />
                  <Label htmlFor="24h" className="text-sm font-normal">24-hour</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.privacy.twoFactorAuth}
                onCheckedChange={() => handleToggle('privacy', 'twoFactorAuth')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shareData">Share Analytics Data</Label>
                <p className="text-sm text-muted-foreground">
                  Help us improve by sharing anonymous usage data
                </p>
              </div>
              <Switch
                id="shareData"
                checked={settings.privacy.shareData}
                onCheckedChange={() => handleToggle('privacy', 'shareData')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cookieConsent">Cookie Consent</Label>
                <p className="text-sm text-muted-foreground">
                  Manage how we use cookies on this site
                </p>
              </div>
              <Switch
                id="cookieConsent"
                checked={settings.privacy.cookieConsent}
                onCheckedChange={() => handleToggle('privacy', 'cookieConsent')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              Account Actions
            </CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Account Visibility
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Your account is visible to your healthcare providers and linked family members.
              </p>
              <Button variant="outline" size="sm">Manage Visibility</Button>
            </div>
            
            <Separator />
            
            <div className="p-4 border rounded-md bg-destructive/5">
              <h3 className="font-medium text-destructive flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Log Out from All Devices
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                This will end all active sessions on all devices except the current one.
              </p>
              <Button variant="destructive" size="sm">Log Out from All Devices</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="w-full md:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
