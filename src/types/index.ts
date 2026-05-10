// ============================================
// SmartCare AI - TypeScript Types
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodType: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  avatar?: string;
  insuranceId?: string;
  address: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  credentials: string[];
  rating: number;
  reviewCount: number;
  experience: number;
  consultationFee: number;
  languages: string[];
  avatar?: string;
  available: boolean;
  nextAvailable: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatar?: string;
  type: "offline" | "telemedicine";
  dateTime: Date;
  duration: number;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";
  notes?: string;
  reason: string;
  followUp?: string;
  location?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  type: "visit" | "lab" | "imaging" | "prescription";
  diagnosis: string;
  treatment: string;
  prescriptions: Prescription[];
  attachments: Attachment[];
  notes: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface Vital {
  id: string;
  type: "blood_pressure" | "heart_rate" | "weight" | "glucose" | "temperature";
  value: string;
  unit: string;
  date: Date;
  status: "normal" | "high" | "low" | "critical";
}

export interface Bill {
  id: string;
  patientId: string;
  appointmentId?: string;
  description: string;
  items: BillItem[];
  total: number;
  status: "pending" | "paid" | "overdue" | "refunded";
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
}

export interface BillItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  dob: string; // ISO date string YYYY-MM-DD
  speechDelay?: "yes" | "no" | "unsure"; // NEW
  familyHistory?: "yes" | "no" | "unsure"; // NEW
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "reminder" | "billing" | "message" | "general";
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
}