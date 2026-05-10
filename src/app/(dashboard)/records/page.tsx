"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  Search,
  Filter,
  Download,
  Share2,
  Stethoscope,
  TestTube,
  Image as ImageIcon,
  Pill,
  ChevronRight,
  File,
  Plus,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn, getInitials, formatDate } from "@/lib/utils";
import { medicalRecords, doctors } from "@/data/mock-data";

const typeIcons = {
  visit: <Stethoscope className="h-4 w-4" />,
  lab: <TestTube className="h-4 w-4" />,
  imaging: <ImageIcon className="h-4 w-4" />,
  prescription: <Pill className="h-4 w-4" />,
};

const typeColors = {
  visit: "bg-primary/10 text-primary border-primary/20",
  lab: "bg-success-bg text-success border-success/20",
  imaging: "bg-info-bg text-info border-info/20",
  prescription: "bg-warning-bg text-warning border-warning/20",
};

export default function MedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch = record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          record.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || record.type === filterType;
    return matchesSearch && matchesType;
  });

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
            Medical Records
          </h1>
          <p className="text-text-secondary mt-1">
            View and manage your health documents and history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Request Records
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "visit", "lab", "imaging", "prescription"].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className="capitalize"
                >
                  {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: medicalRecords.length, icon: <FileText className="h-5 w-5" />, color: "primary" },
          { label: "Lab Results", value: medicalRecords.filter(r => r.type === "lab").length, icon: <TestTube className="h-5 w-5" />, color: "success" },
          { label: "Visits", value: medicalRecords.filter(r => r.type === "visit").length, icon: <Stethoscope className="h-5 w-5" />, color: "info" },
          { label: "Prescriptions", value: medicalRecords.filter(r => r.type === "prescription").length, icon: <Pill className="h-5 w-5" />, color: "warning" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center",
                  stat.color === "primary" && "bg-primary/10 text-primary",
                  stat.color === "success" && "bg-success-bg text-success",
                  stat.color === "info" && "bg-info-bg text-info",
                  stat.color === "warning" && "bg-warning-bg text-warning",
                )}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Records Timeline */}
      <div className="space-y-4">
        {filteredRecords.map((record, i) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover className="cursor-pointer">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Type & Date */}
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center border",
                      typeColors[record.type]
                    )}>
                      {typeIcons[record.type]}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-lg font-semibold text-text-muted">
                        {new Date(record.date).getDate()}
                      </p>
                      <p className="text-xs text-text-muted uppercase">
                        {new Date(record.date).toLocaleDateString("en-US", { month: "short" })}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant="outline" size="sm" className="capitalize">
                        {typeIcons[record.type]}
                        {record.type}
                      </Badge>
                      <span className="text-sm text-text-muted">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(record.date)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-text-primary mb-1">{record.diagnosis}</h3>
                    <p className="text-sm text-text-secondary mb-2">
                      {record.treatment}
                    </p>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback className="text-xs">{getInitials(record.doctorName)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-text-muted">{record.doctorName}</span>
                    </div>

                    {/* Prescriptions */}
                    {record.prescriptions.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-muted/50">
                        <p className="text-xs font-semibold text-text-muted mb-2">Prescriptions</p>
                        <div className="space-y-2">
                          {record.prescriptions.map((rx) => (
                            <div key={rx.id} className="flex items-center justify-between text-sm">
                              <span className="text-text-primary">{rx.medication}</span>
                              <span className="text-text-muted">{rx.dosage} • {rx.frequency}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attachments */}
                    {record.attachments.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {record.attachments.map((att) => (
                          <Badge key={att.id} variant="outline" size="sm" className="gap-1">
                            <File className="h-3 w-3" />
                            {att.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 lg:flex-col">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      <span className="hidden lg:inline">Download</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      <span className="hidden lg:inline">Share</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No records found</h3>
          <p className="text-text-secondary mb-6">Upload your medical documents or request records from your provider.</p>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Documents
          </Button>
        </div>
      )}
    </motion.div>
  );
}