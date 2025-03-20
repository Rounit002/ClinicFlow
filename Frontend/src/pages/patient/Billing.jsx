
import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, CreditCard } from 'lucide-react';

const Billing = () => {
  const [bills, setBills] = useState([
    {
      id: 1,
      date: 'Oct 15, 2023',
      description: 'General Consultation',
      amount: 85.00,
      status: 'Paid',
      invoiceNumber: 'INV-2023-001'
    },
    {
      id: 2,
      date: 'Nov 3, 2023',
      description: 'Blood Test',
      amount: 120.00,
      status: 'Pending',
      invoiceNumber: 'INV-2023-002'
    },
    {
      id: 3,
      date: 'Dec 10, 2023',
      description: 'X-Ray Scan',
      amount: 150.00,
      status: 'Paid',
      invoiceNumber: 'INV-2023-003'
    }
  ]);

  return (
    <div className="space-y-6">
      <PageTitle title="Billing & Payments" description="View and manage your medical bills" />
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Your recent billing activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Card className="bg-clinic-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-bold">$235.00</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-clinic-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-clinic-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">$120.00</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Payment</p>
                    <p className="text-2xl font-bold">Nov 30, 2023</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-lg font-medium mb-4">Recent Bills</h3>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{bill.invoiceNumber}</td>
                      <td className="px-4 py-3">{bill.date}</td>
                      <td className="px-4 py-3">{bill.description}</td>
                      <td className="px-4 py-3">${bill.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          bill.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Download invoice">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="View details">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
