"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Video,
  MessageSquare,
  FileText,
  Clock,
  Calendar,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Phone,
  Monitor,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials, formatDate, formatTime } from "@/lib/utils";
import { doctors, appointments } from "@/data/mock-data";

export default function TelemedicinePage() {
  const [activeTab, setActiveTab] = React.useState("upcoming");
  const [isInCall, setIsInCall] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);

  const upcomingSessions = appointments.filter(
    (apt) => apt.type === "telemedicine" && apt.status !== "cancelled"
  );

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
            Telemedicine
          </h1>
          <p className="text-text-secondary mt-1">
            Virtual consultations with healthcare professionals
          </p>
        </div>
        <Button className="gap-2">
          <Video className="h-4 w-4" />
          Start New Session
        </Button>
      </div>

      {/* Pre-call Checklist Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Ready for your video consultation?
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Check your camera and microphone before joining. Make sure you&apos;re in a quiet, well-lit area.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success" className="gap-1">
                  <Camera className="h-3 w-3" /> Camera Ready
                </Badge>
                <Badge variant="success" className="gap-1">
                  <Mic className="h-3 w-3" /> Microphone Ready
                </Badge>
                <Badge variant="success" className="gap-1">
                  <Monitor className="h-3 w-3" /> Internet Stable
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="gap-2">
                <Camera className="h-4 w-4" />
                Test Camera
              </Button>
              <Button className="gap-2">
                <Video className="h-4 w-4" />
                Join Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Upcoming Sessions</h2>
          {upcomingSessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="cursor-pointer">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Avatar size="lg">
                      <AvatarImage src={session.doctorAvatar} alt={session.doctorName} />
                      <AvatarFallback className="text-lg">{getInitials(session.doctorName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary">{session.doctorName}</h3>
                      <p className="text-sm text-text-secondary">{session.doctorSpecialization}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(session.dateTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(session.dateTime)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {upcomingSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Video className="h-8 w-8 text-text-muted" />
              </div>
              <p className="text-text-secondary">No upcoming telemedicine sessions</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              <button className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer text-left">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Video className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Start Instant Call</p>
                  <p className="text-xs text-text-muted">Quick consultation</p>
                </div>
              </button>
              <button className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer text-left">
                <div className="h-10 w-10 rounded-xl bg-success-bg text-success flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Share Documents</p>
                  <p className="text-xs text-text-muted">Lab results, prescriptions</p>
                </div>
              </button>
              <button className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer text-left">
                <div className="h-10 w-10 rounded-xl bg-info-bg text-info flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Message Doctor</p>
                  <p className="text-xs text-text-muted">Ask a question</p>
                </div>
              </button>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-warning-bg to-warning-bg/50 border-warning/20">
            <CardContent className="p-4">
              <h3 className="font-semibold text-text-primary mb-2">Telemedicine Tips</h3>
              <ul className="text-sm text-text-secondary space-y-2">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                  Test your equipment before the call
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                  Have your medical history ready
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                  Find a quiet, well-lit space
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}