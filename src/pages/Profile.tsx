
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  User, Mail, Shield, BellRing, Key, Lock, CreditCard,
  CheckCircle, Clock, Settings, Save, Smartphone, Info
} from 'lucide-react';

const Profile = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and security settings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-medium text-lg">Alex Johnson</h3>
                  <p className="text-sm text-muted-foreground">alex.johnson@example.com</p>
                </div>
                
                <div className="w-full border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span>Mar 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last login</span>
                    <span>Today, 10:30 AM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">API access</span>
                    <span>Enabled</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-3 space-y-6">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" defaultValue="Alex" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" defaultValue="Johnson" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="alex.johnson@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select 
                        id="timezone"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="utc">UTC (Coordinated Universal Time)</option>
                        <option value="est" selected>EST (Eastern Standard Time)</option>
                        <option value="pst">PST (Pacific Standard Time)</option>
                        <option value="cet">CET (Central European Time)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Preferred Currency</Label>
                      <select 
                        id="currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="usd" selected>USD (US Dollar)</option>
                        <option value="eur">EUR (Euro)</option>
                        <option value="gbp">GBP (British Pound)</option>
                        <option value="jpy">JPY (Japanese Yen)</option>
                      </select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Manage API access for your trading bots
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Key className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Trading Bot API Key</h4>
                          <p className="text-sm text-muted-foreground">Last used: Today, 09:45 AM</p>
                        </div>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Key className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Data Analytics API Key</h4>
                          <p className="text-sm text-muted-foreground">Last used: Yesterday, 15:30 PM</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">
                      <Key className="mr-2 h-4 w-4" />
                      Generate New API Key
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your account password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Update Password</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Authenticator App</h4>
                          <p className="text-sm text-muted-foreground">Use an authenticator app to generate time-based codes</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="2fa" />
                        <Label htmlFor="2fa">Enable</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Email Authentication</h4>
                          <p className="text-sm text-muted-foreground">Receive verification codes via email</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="email-auth" checked />
                        <Label htmlFor="email-auth">Enable</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Login History</CardTitle>
                    <CardDescription>
                      Recent account access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start border-b pb-4">
                        <div>
                          <h4 className="font-medium">Today, 10:30 AM</h4>
                          <p className="text-sm text-muted-foreground">New York, USA (IP: 192.168.1.1)</p>
                        </div>
                        <Badge className="bg-green-500">Current</Badge>
                      </div>
                      
                      <div className="flex justify-between items-start border-b pb-4">
                        <div>
                          <h4 className="font-medium">Yesterday, 8:25 PM</h4>
                          <p className="text-sm text-muted-foreground">New York, USA (IP: 192.168.1.1)</p>
                        </div>
                        <Badge variant="outline">Success</Badge>
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Oct 15, 2023, 3:45 PM</h4>
                          <p className="text-sm text-muted-foreground">Chicago, USA (IP: 203.0.113.1)</p>
                        </div>
                        <Badge variant="outline">Success</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Configure how you want to receive alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Trading Notifications</h3>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="trade-executed">Trade Executed</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications when a trade is executed</p>
                        </div>
                        <Switch id="trade-executed" checked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="trade-closed">Trade Closed</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications when a trade is closed</p>
                        </div>
                        <Switch id="trade-closed" checked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="significant-profit">Significant Profit/Loss</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications for significant profit/loss events</p>
                        </div>
                        <Switch id="significant-profit" checked />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">System Notifications</h3>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="system-status">System Status</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications about system status changes</p>
                        </div>
                        <Switch id="system-status" checked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="security-alerts">Security Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications about security-related events</p>
                        </div>
                        <Switch id="security-alerts" checked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="news-updates">News & Updates</Label>
                          <p className="text-sm text-muted-foreground">Receive updates about new features and improvements</p>
                        </div>
                        <Switch id="news-updates" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Notification Channels</h3>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notif">Email</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch id="email-notif" checked />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notif">Browser Push</Label>
                          <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                        </div>
                        <Switch id="push-notif" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
