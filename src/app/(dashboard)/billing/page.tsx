"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { bills } from "@/data/mock-data";

const statusConfig = {
  pending: { label: "Pending", color: "bg-warning-bg text-warning border-warning/20", icon: <Clock className="h-4 w-4" /> },
  paid: { label: "Paid", color: "bg-success-bg text-success border-success/20", icon: <CheckCircle className="h-4 w-4" /> },
  overdue: { label: "Overdue", color: "bg-error-bg text-error border-error/20", icon: <AlertCircle className="h-4 w-4" /> },
  refunded: { label: "Refunded", color: "bg-info-bg text-info border-info/20", icon: <DollarSign className="h-4 w-4" /> },
};

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");

  const filteredBills = bills.filter((bill) => {
    const matchesSearch = bill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bill.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPending = bills.filter((b) => b.status === "pending").reduce((sum, b) => sum + b.total, 0);
  const totalPaid = bills.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.total, 0);
  const overdueCount = bills.filter((b) => b.status === "overdue").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary font-heading">
            Billing & Payments
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your bills and payment history
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Pay Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-br from-warning-bg to-warning-bg/50 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-warning/20 text-warning flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <Badge variant="warning">Due Soon</Badge>
              </div>
              <p className="text-sm text-text-secondary mb-1">Pending Balance</p>
              <p className="text-3xl font-bold text-text-primary">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-text-muted mt-2">
                {bills.filter((b) => b.status === "pending").length} pending bills
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <Badge variant="success">Paid</Badge>
              </div>
              <p className="text-sm text-text-secondary mb-1">Total Paid (YTD)</p>
              <p className="text-3xl font-bold text-text-primary">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-text-muted mt-2">
                {bills.filter((b) => b.status === "paid").length} completed payments
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-error/10 text-error flex items-center justify-center">
                  <AlertCircle className="h-6 w-6" />
                </div>
                {overdueCount > 0 ? (
                  <Badge variant="error" pulse>{overdueCount} Overdue</Badge>
                ) : (
                  <Badge variant="success">All Clear</Badge>
                )}
              </div>
              <p className="text-sm text-text-secondary mb-1">Insurance Status</p>
              <p className="text-xl font-bold text-text-primary">Active</p>
              <p className="text-xs text-text-muted mt-2">INS-2024-78432</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "paid", "overdue"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      <div className="space-y-4">
        {filteredBills.map((bill, i) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover className="cursor-pointer">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Icon & Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Receipt className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-text-primary">{bill.description}</h3>
                        <span className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                          statusConfig[bill.status].color
                        )}>
                          {statusConfig[bill.status].icon}
                          {statusConfig[bill.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {bill.status === "paid" && bill.paidDate
                          ? `Paid on ${formatDate(bill.paidDate)}`
                          : `Due: ${formatDate(bill.dueDate)}`
                        }
                        {bill.paymentMethod && ` • ${bill.paymentMethod}`}
                      </p>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-text-primary">{formatCurrency(bill.total)}</p>
                      {bill.items.length > 1 && (
                        <p className="text-xs text-text-muted">{bill.items.length} items</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      {bill.status === "pending" && (
                        <Button size="sm" className="gap-1">
                          <CreditCard className="h-4 w-4" />
                          Pay Now
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bill Items (expandable) */}
                {bill.items.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-text-muted mb-2">Bill Breakdown</p>
                    <div className="space-y-1">
                      {bill.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-text-secondary">{item.description}</span>
                          <span className="text-text-muted">×{item.quantity}</span>
                          <span className="text-text-primary font-medium">{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBills.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Receipt className="h-10 w-10 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No bills found</h3>
          <p className="text-text-secondary">All your bills are settled or no matching bills exist.</p>
        </div>
      )}
    </motion.div>
  );
}