import { User, Doctor, Appointment, MedicalRecord, Vital, Bill, Notification } from "@/types";

// ============================================
// Mock Data - SmartCare AI
// ============================================

export const currentUser = {
  id: "user-001",
  name: "Ayah / Ibu",
  email: "demo@smartcare.ai",
  phone: "",
  avatar: "",
};

export const doctors: Doctor[] = [
  {
    id: "doc-001",
    name: "Dr. Emily Chen",
    specialization: "Cardiology",
    credentials: ["MD", "FACC", "Board Certified"],
    rating: 4.9,
    reviewCount: 234,
    experience: 15,
    consultationFee: 150,
    languages: ["English", "Mandarin"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    available: true,
    nextAvailable: "Tomorrow, 9:00 AM",
  },
  {
    id: "doc-002",
    name: "Dr. Michael Roberts",
    specialization: "General Medicine",
    credentials: ["MD", "ABFM Certified"],
    rating: 4.8,
    reviewCount: 189,
    experience: 12,
    consultationFee: 100,
    languages: ["English", "Spanish"],
    avatar: "https://images.unsplash.com/photo-1612349317150-e413a6a5b74d?w=150&h=150&fit=crop&crop=face",
    available: true,
    nextAvailable: "Today, 2:30 PM",
  },
  {
    id: "doc-003",
    name: "Dr. Sarah Johnson",
    specialization: "Dermatology",
    credentials: ["MD", "FAAD"],
    rating: 4.7,
    reviewCount: 156,
    experience: 10,
    consultationFee: 175,
    languages: ["English"],
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
    available: false,
    nextAvailable: "May 12, 10:00 AM",
  },
  {
    id: "doc-004",
    name: "Dr. James Wilson",
    specialization: "Orthopedics",
    credentials: ["MD", "Board Certified"],
    rating: 4.8,
    reviewCount: 98,
    experience: 18,
    consultationFee: 200,
    languages: ["English", "French"],
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face",
    available: true,
    nextAvailable: "Today, 4:00 PM",
  },
  {
    id: "doc-005",
    name: "Dr. Lisa Park",
    specialization: "Pediatrics",
    credentials: ["MD", "FAAP"],
    rating: 4.9,
    reviewCount: 312,
    experience: 14,
    consultationFee: 120,
    languages: ["English", "Korean"],
    avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face",
    available: true,
    nextAvailable: "Tomorrow, 11:00 AM",
  },
];

export const appointments: Appointment[] = [
  {
    id: "apt-001",
    patientId: "user-001",
    doctorId: "doc-001",
    doctorName: "Dr. Emily Chen",
    doctorSpecialization: "Cardiology",
    doctorAvatar: doctors[0].avatar,
    type: "telemedicine",
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 30,
    status: "confirmed",
    reason: "Annual heart checkup",
    notes: "Please prepare recent blood pressure readings",
  },
  {
    id: "apt-002",
    patientId: "user-001",
    doctorId: "doc-002",
    doctorName: "Dr. Michael Roberts",
    doctorSpecialization: "General Medicine",
    doctorAvatar: doctors[1].avatar,
    type: "offline",
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    duration: 45,
    status: "scheduled",
    reason: "General health consultation",
    location: "Medical Center, Room 204",
  },
  {
    id: "apt-003",
    patientId: "user-001",
    doctorId: "doc-003",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialization: "Dermatology",
    doctorAvatar: doctors[2].avatar,
    type: "offline",
    dateTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    duration: 30,
    status: "completed",
    reason: "Skin rash evaluation",
    followUp: "Follow up in 2 weeks",
  },
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: "rec-001",
    patientId: "user-001",
    doctorId: "doc-002",
    doctorName: "Dr. Michael Roberts",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    type: "visit",
    diagnosis: "Upper respiratory infection",
    treatment: "Prescribed antibiotics and rest",
    prescriptions: [
      {
        id: "rx-001",
        medication: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times daily",
        duration: "7 days",
        instructions: "Take with food. Complete full course.",
      },
    ],
    attachments: [],
    notes: "Patient reported symptoms for 3 days. No fever. Mild congestion.",
  },
  {
    id: "rec-002",
    patientId: "user-001",
    doctorId: "doc-001",
    doctorName: "Dr. Emily Chen",
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    type: "lab",
    diagnosis: "Annual blood work results - All within normal range",
    treatment: "Continue current lifestyle",
    prescriptions: [],
    attachments: [
      {
        id: "att-001",
        name: "Complete_Blood_Count.pdf",
        type: "application/pdf",
        url: "#",
      },
    ],
    notes: "Cholesterol levels slightly elevated. Recommend dietary changes.",
  },
];

export const vitals: Vital[] = [
  {
    id: "v-001",
    type: "blood_pressure",
    value: "120/80",
    unit: "mmHg",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "normal",
  },
  {
    id: "v-002",
    type: "heart_rate",
    value: "72",
    unit: "bpm",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "normal",
  },
  {
    id: "v-003",
    type: "weight",
    value: "145",
    unit: "lbs",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "normal",
  },
  {
    id: "v-004",
    type: "glucose",
    value: "95",
    unit: "mg/dL",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "normal",
  },
];

export const bills: Bill[] = [
  {
    id: "bill-001",
    patientId: "user-001",
    appointmentId: "apt-003",
    description: "Dermatology Consultation",
    items: [
      { description: "Office Visit", quantity: 1, unitPrice: 175, total: 175 },
      { description: "Skin Examination", quantity: 1, unitPrice: 50, total: 50 },
    ],
    total: 225,
    status: "pending",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "bill-002",
    patientId: "user-001",
    appointmentId: "apt-001",
    description: "Telemedicine Consultation - Dr. Chen",
    items: [
      { description: "Telehealth Visit", quantity: 1, unitPrice: 150, total: 150 },
    ],
    total: 150,
    status: "paid",
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    paidDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    paymentMethod: "Credit Card ****4242",
  },
];

export const notifications: Notification[] = [
  {
    id: "notif-001",
    title: "Upcoming Appointment",
    message: "Your telemedicine appointment with Dr. Emily Chen is in 2 days",
    type: "appointment",
    read: false,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    actionUrl: "/appointments",
  },
  {
    id: "notif-002",
    title: "Lab Results Available",
    message: "Your recent blood work results are now available",
    type: "general",
    read: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    actionUrl: "/records",
  },
  {
    id: "notif-003",
    title: "Payment Reminder",
    message: "You have an outstanding bill of $225 due in 14 days",
    type: "billing",
    read: true,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    actionUrl: "/billing",
  },
];

// Time slots for appointment booking
export const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM",
];

// Get upcoming appointments
export function getUpcomingAppointments() {
  return appointments.filter(
    (apt) => new Date(apt.dateTime) > new Date() && apt.status !== "cancelled"
  );
}

// Get past appointments
export function getPastAppointments() {
  return appointments.filter(
    (apt) => new Date(apt.dateTime) < new Date() || apt.status === "completed"
  );
}

// Get unread notifications count
export function getUnreadNotificationsCount() {
  return notifications.filter((n) => !n.read).length;
}