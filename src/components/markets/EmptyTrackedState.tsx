
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

export const EmptyTrackedState = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
        No tracked coins yet. Start tracking coins to see them here.
      </TableCell>
    </TableRow>
  );
};
