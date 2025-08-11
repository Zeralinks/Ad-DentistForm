
export const leadsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    source: 'Google Ads',
    status: 'new',
    qualification: 'unqualified',
    service: 'Teeth Cleaning',
    notes: 'Interested in regular cleaning appointment',
    createdAt: '2024-01-15T10:30:00Z',
    lastContact: null
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    source: 'Facebook',
    status: 'contacted',
    qualification: 'qualified',
    service: 'Dental Implant',
    notes: 'Needs consultation for implant replacement',
    createdAt: '2024-01-14T14:20:00Z',
    lastContact: '2024-01-15T09:15:00Z'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 345-6789',
    source: 'Website',
    status: 'follow-up',
    qualification: 'qualified',
    service: 'Orthodontics',
    notes: 'Considering braces for teenager',
    createdAt: '2024-01-13T16:45:00Z',
    lastContact: '2024-01-14T11:30:00Z'
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '(555) 456-7890',
    source: 'Referral',
    status: 'booked',
    qualification: 'qualified',
    service: 'Root Canal',
    notes: 'Emergency appointment needed',
    createdAt: '2024-01-12T08:15:00Z',
    lastContact: '2024-01-13T13:20:00Z'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '(555) 567-8901',
    source: 'Google Ads',
    status: 'new',
    qualification: 'unqualified',
    service: 'Cosmetic Dentistry',
    notes: 'Inquiring about teeth whitening',
    createdAt: '2024-01-15T15:10:00Z',
    lastContact: null
  }
];

export const appointmentsData = [
  {
    id: 1,
    leadId: 4,
    patientName: 'David Wilson',
    service: 'Root Canal',
    date: '2024-01-16',
    time: '10:00 AM',
    duration: '60 minutes',
    status: 'confirmed',
    notes: 'Emergency appointment'
  },
  {
    id: 2,
    leadId: 2,
    patientName: 'Michael Chen',
    service: 'Dental Implant Consultation',
    date: '2024-01-17',
    time: '2:00 PM',
    duration: '30 minutes',
    status: 'confirmed',
    notes: 'Initial consultation'
  },
  {
    id: 3,
    leadId: 3,
    patientName: 'Emily Rodriguez',
    service: 'Orthodontics Consultation',
    date: '2024-01-18',
    time: '3:30 PM',
    duration: '45 minutes',
    status: 'pending',
    notes: 'Braces consultation for teenager'
  }
];

export const followUpTemplates = [
  {
    id: 1,
    name: 'Initial Welcome',
    type: 'email',
    delay: 0,
    subject: 'Welcome! Your dental health journey starts here',
    content: 'Thank you for your interest in our dental services. We are excited to help you achieve optimal oral health.'
  },
  {
    id: 2,
    name: 'Follow-up Reminder',
    type: 'email',
    delay: 24,
    subject: 'Have you had a chance to consider our services?',
    content: 'We wanted to follow up on your recent inquiry. Our team is ready to answer any questions you may have.'
  },
  {
    id: 3,
    name: 'Appointment Reminder',
    type: 'sms',
    delay: 24,
    subject: '',
    content: 'Hi! This is a reminder about your dental appointment tomorrow. Please reply CONFIRM or call us if you need to reschedule.'
  }
];
