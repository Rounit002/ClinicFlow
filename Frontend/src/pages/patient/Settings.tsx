import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon } from 'lucide-react';

const Settings = () => {
  // Initialize state with saved dark mode value from localStorage
  const [settings, setSettings] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return {
      appearance: {
        darkMode: savedDarkMode ? JSON.parse(savedDarkMode) : false,
      },
    };
  });

  // Apply dark mode class on mount and when darkMode changes
  useEffect(() => {
    // Apply the dark class on mount based on saved state
    if (settings.appearance.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Save to localStorage whenever darkMode changes
    localStorage.setItem('darkMode', JSON.stringify(settings.appearance.darkMode));
  }, [settings.appearance.darkMode]);

  // Handle toggle for dark mode
  const handleToggle = () => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        darkMode: !prev.appearance.darkMode,
      },
    }));
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-muted-foreground" />
            Appearance
          </CardTitle>
          <CardDescription>Customize your viewing experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Enable dark theme</p>
            </div>
            <Switch
              id="darkMode"
              checked={settings.appearance.darkMode}
              onCheckedChange={handleToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;