import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Billing = () => {
  const [bills] = useState([
    { id: 1, date: 'Oct 15, 2023', description: 'General Consultation', amount: 85.00, status: 'Paid', invoiceNumber: 'INV-2023-001' },
    { id: 2, date: 'Nov 3, 2023', description: 'Blood Test', amount: 120.00, status: 'Pending', invoiceNumber: 'INV-2023-002' },
    { id: 3, date: 'Dec 10, 2023', description: 'X-Ray Scan', amount: 150.00, status: 'Paid', invoiceNumber: 'INV-2023-003' },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <PageTitle title="Billing & Payments" description="View and manage your medical bills" />
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Payment Summary</CardTitle>
          <CardDescription>Your recent billing activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            {[
              { title: 'Total Paid', value: '$235.00', icon: CreditCard, bg: 'bg-clinic-50' },
              { title: 'Pending', value: '$120.00', icon: FileText, bg: 'bg-amber-50' },
              { title: 'Next Payment', value: 'Nov 30, 2023', icon: CreditCard, bg: 'bg-gray-50' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                className={`${item.bg} rounded-lg shadow-sm`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                      <p className="text-2xl font-bold">{item.value}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-opacity-50 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-clinic-600" />
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            ))}
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Recent Bills</h3>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
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
                {bills.map((bill, index) => (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ backgroundColor: '#f5f5f5' }}
                    className="border-b"
                  >
                    <td className="px-4 py-3 font-medium">{bill.invoiceNumber}</td>
                    <td className="px-4 py-3">{bill.date}</td>
                    <td className="px-4 py-3">{bill.description}</td>
                    <td className="px-4 py-3">${bill.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} className="h-8 w-8 p-0" title="Download invoice">
                        <Download className="h-4 w-4" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} className="h-8 w-8 p-0" title="View details">
                        <FileText className="h-4 w-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Billing;