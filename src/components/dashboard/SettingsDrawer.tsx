
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

export const SettingsDrawer: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="icon" className="rounded-full w-12 h-12 bg-primary shadow-lg hover:bg-primary/90">
            <Settings className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="mx-auto max-w-sm">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-3">Quick Settings</h3>
            <div className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                Settings controls will be implemented soon
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
