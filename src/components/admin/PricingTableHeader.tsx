
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PricingTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="font-bold">Distance</TableHead>
        <TableHead className="font-bold">Prix HT</TableHead>
        <TableHead className="font-bold">Prix TTC</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default PricingTableHeader;
