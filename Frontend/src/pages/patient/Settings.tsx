import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return { appearance: { darkMode: savedDarkMode ? JSON.parse(savedDarkMode) : false } };
  });

  useEffect(() => {
    if (settings.appearance.darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    localStorage.setItem('darkMode', JSON.stringify(settings.appearance.darkMode));
  }, [settings.appearance.darkMode]);

  const handleToggle = () => {
    setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, darkMode: !prev.appearance.darkMode } }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <motion.div
       gather initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Moon className="h-5 w-5 text-muted-foreground" /> Appearance
            </CardTitle>
            <CardDescription>Customize your viewing experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode" className="font-semibold">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark theme</p>
              </div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Switch
                  id="darkMode"
                  checked={settings.appearance.darkMode}
                  onCheckedChange={handleToggle}
                />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Settings;