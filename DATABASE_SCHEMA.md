# ===========================================
# HealthCare Pro - Database Schema (ERD)
# ===========================================

## Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     USERS       │     │   APPOINTMENTS  │     │    DOCTORS      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ id (PK)         │>────│ id (PK)         │
│ name            │     │ patient_id (FK) │     │ name            │
│ email           │     │ doctor_id (FK)  │     │ specialization  │
│ password_hash   │     │ date_time       │     │ email           │
│ phone           │     │ type            │     │ phone           │
│ date_of_birth   │     │ status          │     │ avatar_url      │
│ gender          │     │ reason          │     │ rating          │
│ blood_type      │     │ notes           │     │ consultation_fee│
│ avatar_url      │     │ location        │     │ available       │
│ insurance_id    │     │ created_at      │     │ experience_yrs  │
│ created_at      │     │ updated_at      │     │ created_at      │
│ updated_at      │     └─────────────────┘     └─────────────────┘
└─────────────────┘                                │
        │                                          │
        │ 1:N                                       │ 1:N
        │                                          │
        ▼                                          ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ MEDICAL_RECORDS│     │  PRESCRIPTIONS  │     │  VITALS         │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ id (PK)         │     │ id (PK)         │
│ patient_id (FK) │     │ record_id (FK)  │     │ user_id (FK)    │
│ doctor_id (FK) │     │ medication      │     │ type            │
│ date            │     │ dosage          │     │ value           │
│ type            │     │ frequency       │     │ unit            │
│ diagnosis       │     │ duration        │     │ recorded_at     │
│ treatment       │     │ instructions    │     │ status          │
│ notes           │     └─────────────────┘     └─────────────────┘
│ created_at      │
└─────────────────┘

        │
        │ 1:N
        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    BILLS       │     │  BILL_ITEMS     │     │  NOTIFICATIONS  │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ id (PK)        │     │ id (PK)         │
│ patient_id (FK) │     │ bill_id (FK)    │     │ user_id (FK)    │
│ appointment_id  │     │ description     │     │ title           │
│ description     │     │ quantity        │     │ message         │
│ total           │     │ unit_price      │     │ type            │
│ status          │     │ total           │     │ read            │
│ due_date        │     └─────────────────┘     │ action_url      │
│ paid_date       │                             │ created_at      │
│ payment_method  │                             └─────────────────┘
└─────────────────┘

┌─────────────────┐
│   MESSAGES      │
├─────────────────┤
│ id (PK)         │
│ sender_id (FK)  │
│ receiver_id    │
│ content         │
│ read            │
│ created_at      │
└─────────────────┘
```

## Table Definitions

### USERS (Patients)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| name | VARCHAR(255) | NOT NULL | Full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| phone | VARCHAR(20) | | Contact number |
| date_of_birth | DATE | | Date of birth |
| gender | ENUM | | male/female/other |
| blood_type | VARCHAR(5) | | A+/A-/B+/B-/AB+/AB-/O+/O- |
| avatar_url | TEXT | | Profile image URL |
| insurance_id | VARCHAR(50) | | Insurance policy number |
| emergency_contact | JSONB | | Emergency contact info |
| allergies | TEXT[] | | Array of allergies |
| address | TEXT | | Home address |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

### DOCTORS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique doctor identifier |
| name | VARCHAR(255) | NOT NULL | Full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Professional email |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| specialization | VARCHAR(100) | NOT NULL | Medical specialty |
| credentials | TEXT[] | | Array of certifications |
| bio | TEXT | | Doctor biography |
| avatar_url | TEXT | | Profile image |
| rating | DECIMAL(2,1) | DEFAULT 0 | Average rating (0-5) |
| review_count | INTEGER | DEFAULT 0 | Number of reviews |
| consultation_fee | DECIMAL(10,2) | | Fee per visit |
| experience_years | INTEGER | | Years of experience |
| languages | TEXT[] | | Spoken languages |
| available | BOOLEAN | DEFAULT TRUE | Currently accepting patients |
| next_available | TIMESTAMP | | Next available slot |
| created_at | TIMESTAMP | DEFAULT NOW() | Registration date |

### APPOINTMENTS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique appointment ID |
| patient_id | UUID | FK → USERS | Patient reference |
| doctor_id | UUID | FK → DOCTORS | Doctor reference |
| date_time | TIMESTAMP | NOT NULL | Appointment date/time |
| duration | INTEGER | DEFAULT 30 | Duration in minutes |
| type | ENUM | NOT NULL | offline/telemedicine |
| status | ENUM | DEFAULT 'scheduled' | Status of appointment |
| reason | TEXT | | Reason for visit |
| notes | TEXT | | Additional notes |
| location | VARCHAR(255) | | For offline appointments |
| follow_up | TEXT | | Follow-up instructions |
| meeting_url | TEXT | | Video call link |
| created_at | TIMESTAMP | DEFAULT NOW() | Booking timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

**Status Values:** scheduled, confirmed, completed, cancelled, no-show

### MEDICAL_RECORDS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique record ID |
| patient_id | UUID | FK → USERS | Patient reference |
| doctor_id | UUID | FK → DOCTORS | Doctor who created |
| date | TIMESTAMP | NOT NULL | Record date |
| type | ENUM | NOT NULL | visit/lab/imaging/prescription |
| diagnosis | TEXT | NOT NULL | Medical diagnosis |
| treatment | TEXT | | Treatment plan |
| notes | TEXT | | Doctor's notes |
| attachments | JSONB | | Array of attachment URLs |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation |

### PRESCRIPTIONS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique prescription ID |
| record_id | UUID | FK → MEDICAL_RECORDS | Parent record |
| medication | VARCHAR(255) | NOT NULL | Medicine name |
| dosage | VARCHAR(100) | | e.g., "500mg" |
| frequency | VARCHAR(100) | | e.g., "3x daily" |
| duration | VARCHAR(100) | | e.g., "7 days" |
| instructions | TEXT | | Special instructions |
| created_at | TIMESTAMP | DEFAULT NOW() | Prescription date |

### VITALS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique vital ID |
| user_id | UUID | FK → USERS | Patient reference |
| type | ENUM | NOT NULL | blood_pressure/heart_rate/etc |
| value | VARCHAR(50) | NOT NULL | Measured value |
| unit | VARCHAR(20) | NOT NULL | Unit of measurement |
| recorded_at | TIMESTAMP | DEFAULT NOW() | When recorded |
| status | ENUM | DEFAULT 'normal' | normal/high/low/critical |

### BILLS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique bill ID |
| patient_id | UUID | FK → USERS | Patient reference |
| appointment_id | UUID | FK → APPOINTMENTS | Related appointment |
| description | VARCHAR(255) | NOT NULL | Bill description |
| total | DECIMAL(10,2) | NOT NULL | Total amount |
| status | ENUM | DEFAULT 'pending' | pending/paid/overdue/refunded |
| due_date | DATE | | Payment deadline |
| paid_date | DATE | | When paid |
| payment_method | VARCHAR(50) | | Payment method used |
| insurance_claim_id | VARCHAR(100) | | Insurance claim reference |
| created_at | TIMESTAMP | DEFAULT NOW() | Bill creation date |

### NOTIFICATIONS
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique notification ID |
| user_id | UUID | FK → USERS | Recipient |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification body |
| type | ENUM | DEFAULT 'general' | appointment/reminder/billing/etc |
| read | BOOLEAN | DEFAULT FALSE | Read status |
| action_url | VARCHAR(255) | | Link to relevant page |
| created_at | TIMESTAMP | DEFAULT NOW() | Notification time |

### MESSAGES
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique message ID |
| sender_id | UUID | FK → USERS | Message sender |
| receiver_id | UUID | FK → USERS | Message recipient |
| content | TEXT | NOT NULL | Message content |
| read | BOOLEAN | DEFAULT FALSE | Read status |
| created_at | TIMESTAMP | DEFAULT NOW() | Sent time |

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(date_time);
CREATE INDEX idx_records_patient ON medical_records(patient_id);
CREATE INDEX idx_bills_patient ON bills(patient_id);
CREATE INDEX idx_vitals_user ON vitals(user_id, type);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
```

## Relationships

- **USERS → APPOINTMENTS**: One-to-Many (1 patient, many appointments)
- **DOCTORS → APPOINTMENTS**: One-to-Many (1 doctor, many appointments)
- **USERS → MEDICAL_RECORDS**: One-to-Many
- **MEDICAL_RECORDS → PRESCRIPTIONS**: One-to-Many
- **USERS → BILLS**: One-to-Many
- **BILLS → BILL_ITEMS**: One-to-Many
- **USERS → VITALS**: One-to-Many
- **USERS → NOTIFICATIONS**: One-to-Many
- **USERS → MESSAGES**: One-to-Many (sender and receiver)