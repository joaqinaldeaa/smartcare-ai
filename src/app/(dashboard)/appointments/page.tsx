"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Video,
  MapPin,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn, formatDate, formatTime, getStatusColor, getInitials } from "@/lib/utils";
import { appointments, doctors } from "@/data/mock-data";

const statusIcons = {
  scheduled: <Clock className="h-4 w-4" />,
  confirmed: <CheckCircle className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  "no-show": <AlertCircle className="h-4 w-4" />,
};

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  completed: "bg-cyan-100 text-cyan-700 border-cyan-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  "no-show": "bg-gray-100 text-gray-700 border-gray-200",
};

export default function AppointmentsPage() {
  const [filter, setFilter] = React.useState("all");
  const [selectedAppointment, setSelectedAppointment] = React.useState<typeof appointments[0] | null>(null);

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return new Date(apt.dateTime) > new Date() && apt.status !== "cancelled";
    if (filter === "completed") return apt.status === "completed";
    if (filter === "cancelled") return apt.status === "cancelled";
    return true;
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
            Appointments
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your medical appointments and bookings
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input placeholder="Search appointments..." className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "upcoming", "completed", "cancelled"].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((apt, i) => (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover className="cursor-pointer" onClick={() => setSelectedAppointment(apt)}>
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar size="lg">
                      <AvatarImage src={apt.doctorAvatar} alt={apt.doctorName} />
                      <AvatarFallback className="text-lg">{getInitials(apt.doctorName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-text-primary">{apt.doctorName}</h3>
                        <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", statusColors[apt.status])}>
                          {statusIcons[apt.status]}
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">{apt.doctorSpecialization}</p>
                      <p className="text-xs text-text-muted mt-1">
                        Reason: {apt.reason}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-6 lg:gap-8">
                    <div className="text-center lg:text-left">
                      <div className="flex items-center gap-2 text-text-primary">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="font-medium">{formatDate(apt.dateTime)}</span>
                      </div>
                      <p className="text-sm text-text-muted mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatTime(apt.dateTime)} • {apt.duration} min
                      </p>
                    </div>

                    {/* Type */}
                    <div className="hidden sm:block">
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                        apt.type === "telemedicine" ? "bg-success-bg text-success" : "bg-info-bg text-info"
                      )}>
                        {apt.type === "telemedicine" ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        {apt.type === "telemedicine" ? "Video Call" : "In-Person"}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="ghost" className="text-error hover:text-error hover:bg-error/10">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <CalendarDays className="h-10 w-10 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No appointments found</h3>
          <p className="text-text-secondary mb-6">You don&apos;t have any appointments matching this filter.</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Book New Appointment
          </Button>
        </div>
      )}
    </motion.div>
  );
}