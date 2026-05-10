"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  Calendar,
  Clock,
  Video,
  MapPin,
  Award,
  Languages,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn, getInitials } from "@/lib/utils";
import { doctors } from "@/data/mock-data";

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [specialization, setSpecialization] = React.useState("all");
  const [selectedDoctor, setSelectedDoctor] = React.useState<string | null>(null);

  const specializations = ["all", ...new Set(doctors.map((d) => d.specialization))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = specialization === "all" || doctor.specialization === specialization;
    return matchesSearch && matchesSpec;
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
            Find a Doctor
          </h1>
          <p className="text-text-secondary mt-1">
            Browse our network of healthcare professionals
          </p>
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
                  placeholder="Search doctors by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="h-11 px-4 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-3 focus:ring-primary/20 cursor-pointer"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec} className="capitalize">
                    {spec === "all" ? "All Specializations" : spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, i) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover className="h-full flex flex-col">
              <CardContent className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar size="xl">
                    <AvatarImage src={doctor.avatar} alt={doctor.name} />
                    <AvatarFallback className="text-xl">{getInitials(doctor.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text-primary">{doctor.name}</h3>
                      <Badge variant={doctor.available ? "success" : "warning"} size="sm">
                        {doctor.available ? "Available" : "Busy"}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary">{doctor.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-warning fill-warning" />
                        <span className="text-sm font-medium text-text-primary">{doctor.rating}</span>
                      </div>
                      <span className="text-sm text-text-muted">({doctor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Languages className="h-4 w-4 text-primary" />
                    <span>{doctor.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-success" />
                    <span className="text-success font-medium">Next: {doctor.nextAvailable}</span>
                  </div>
                </div>

                {/* Credentials */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor.credentials.map((cred) => (
                    <Badge key={cred} variant="outline" size="sm">
                      {cred}
                    </Badge>
                  ))}
                </div>

                {/* Fee & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-text-muted">Consultation Fee</p>
                    <p className="text-xl font-bold text-text-primary">${doctor.consultationFee}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      Profile
                    </Button>
                    <Button size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No doctors found</h3>
          <p className="text-text-secondary">Try adjusting your search or filters.</p>
        </div>
      )}
    </motion.div>
  );
}