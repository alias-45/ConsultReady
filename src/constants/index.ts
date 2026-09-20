import { MedicalRecord, UserProfile } from '../types';

export const DEMO_PATIENT: UserProfile = {
  id: 'PAT_994821',
  name: 'Ananya Sharma',
  role: 'patient',
  email: 'ananya.sharma@example.com',
  gender: 'Female',
  age: 29,
  bloodGroup: 'B+',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
};

export const DEMO_DOCTOR: UserProfile = {
  id: 'DOC_448102',
  name: 'Dr. Sameer Kulkarni, MD',
  role: 'doctor',
  email: 'dr.kulkarni@cityheart.org',
  doctorLicense: 'MCI12345',
  hospitalAffiliation: 'City Heart & Multispecialty Center',
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80'
};

export const SPECIALTIES = [
  'Cardiology',
  'Pulmonology',
  'General Medicine',
  'Neurology',
  'Orthopedics',
  'Gastroenterology',
  'Endocrinology',
  'Dermatology'
] as const;

export const REASONS_BY_SPECIALTY: Record<string, string[]> = {
  Cardiology: [
    'Chest pain',
    'Palpitations & irregular heartbeat',
    'Shortness of breath on exertion',
    'High blood pressure follow-up',
    'Post-stent annual review'
  ],
  Pulmonology: [
    'Chronic cough & wheezing',
    'Persistent breathlessness',
    'Post-COVID lung follow-up',
    'Sleep apnea evaluation'
  ],
  'General Medicine': [
    'Annual wellness physical',
    'Unexplained fatigue and fever',
    'General health checkup',
    'Pre-employment medical certificate'
  ],
  Neurology: [
    'Migraines and recurrent headaches',
    'Dizziness and balance issues',
    'Numbness or tingling in limbs'
  ],
  Orthopedics: [
    'Knee joint pain & stiffness',
    'Lower back pain',
    'Sports injury / ligament strain'
  ],
  Gastroenterology: [
    'Persistent acid reflux & heartburn',
    'Abdominal discomfort',
    'Liver enzymes follow-up'
  ],
  Endocrinology: [
    'Type 2 Diabetes management',
    'Thyroid imbalance follow-up',
    'Weight fluctuation & hormonal test'
  ],
  Dermatology: [
    'Skin rash and allergies',
    'Eczema flare-up',
    'Suspicious mole examination'
  ]
};

export const INITIAL_MOCK_RECORDS: MedicalRecord[] = [
  {
    id: 'REC_ECG_001',
    title: 'ECG Report',
    date: '03 Feb 2024',
    type: 'Imaging',
    provider: 'City Diagnostics & Cardiac Lab',
    fileSize: '1.4 MB',
    fileName: 'ECG_12Lead_03022024.pdf',
    clinicalSummary: '12-lead Electrocardiogram showing normal sinus rhythm at 72 bpm with non-specific ST-T wave variations in lateral leads. No acute ischemic changes.',
    details: {
      patientName: 'Ananya Sharma',
      patientAge: 29,
      patientGender: 'Female',
      facility: 'City Diagnostics Center, Cardiology Wing',
      physician: 'Dr. V. Ramanathan, MD (Cardiology)',
      findings: [
        'Heart Rate: 72 bpm, Regular Sinus Rhythm',
        'PR Interval: 148 ms (Normal: 120-200 ms)',
        'QRS Duration: 86 ms (Normal: < 100 ms)',
        'QT / QTc: 382 / 418 ms (Normal: < 450 ms)',
        'Axis: +45° (Normal Axis)',
        'No pathological Q waves or acute ST elevation'
      ],
      metrics: [
        { label: 'Heart Rate', value: '72 bpm', status: 'normal' },
        { label: 'PR Interval', value: '148 ms', status: 'normal' },
        { label: 'QRS Axis', value: '+45 deg', status: 'normal' },
        { label: 'QTc', value: '418 ms', status: 'normal' }
      ],
      ecgData: {
        heartRate: 72,
        prInterval: '148 ms',
        qrsDuration: '86 ms',
        qtc: '418 ms',
        rhythm: 'Normal Sinus Rhythm',
        stSegment: 'Isoelectric / Baseline'
      }
    }
  },
  {
    id: 'REC_BP_002',
    title: 'Blood Pressure History',
    date: 'Jan 2024 – Jun 2024',
    type: 'Vitals / History',
    provider: 'HealthTrack Remote Monitoring',
    fileSize: '840 KB',
    fileName: 'BP_Log_6Months_2024.csv',
    clinicalSummary: '6-month ambulatory blood pressure monitoring log. Average BP: 124/82 mmHg. Occasional spikes recorded during stressful episodes reaching 138/88 mmHg.',
    details: {
      patientName: 'Ananya Sharma',
      patientAge: 29,
      patientGender: 'Female',
      facility: 'HealthTrack Digital Health Records',
      physician: 'Dr. R. Verma, General Physician',
      findings: [
        'Total readings logged: 142 checks across 6 months',
        'Morning mean BP: 122/80 mmHg',
        'Evening mean BP: 126/84 mmHg',
        'No nocturnal dipping abnormalities observed',
        'Resting pulse avg: 74 bpm'
      ],
      metrics: [
        { label: 'Average Systolic', value: '124 mmHg', status: 'normal' },
        { label: 'Average Diastolic', value: '82 mmHg', status: 'normal' },
        { label: 'Peak Reading', value: '138/88 mmHg', status: 'warning' },
        { label: 'Compliance Rate', value: '94%', status: 'normal' }
      ]
    }
  },
  {
    id: 'REC_LIPID_003',
    title: 'Lipid Panel',
    date: '10 Jan 2024',
    type: 'Lab Report',
    provider: 'Metro Labs & Pathological Services',
    fileSize: '620 KB',
    fileName: 'Lipid_Profile_10012024.pdf',
    clinicalSummary: 'Fasting lipid profile showing mildly elevated Total Cholesterol (208 mg/dL) and LDL (128 mg/dL). Triglycerides and HDL within desirable reference boundaries.',
    details: {
      patientName: 'Ananya Sharma',
      patientAge: 29,
      patientGender: 'Female',
      facility: 'Metro Central Pathology Unit',
      physician: 'Dr. N. Roy, MD (Pathology)',
      findings: [
        'Fasting status: 12 hours verified',
        'Mild dyslipidemia, lifestyle and dietary modification advised',
        'Cardiovascular risk category: Low-to-Intermediate 10-year score'
      ],
      metrics: [
        { label: 'Total Cholesterol', value: '208 mg/dL', status: 'warning' },
        { label: 'HDL (Good)', value: '54 mg/dL', status: 'normal' },
        { label: 'LDL (Calculated)', value: '128 mg/dL', status: 'warning' },
        { label: 'Triglycerides', value: '130 mg/dL', status: 'normal' }
      ]
    }
  },
  {
    id: 'REC_MEDS_004',
    title: 'Current Medications',
    date: 'Mar 2024',
    type: 'Prescription',
    provider: 'Metro Care Pharmacy & Outpatient',
    fileSize: '310 KB',
    fileName: 'Rx_Active_Medications_032024.pdf',
    clinicalSummary: 'Active pharmacological prescriptions: Low-dose beta blocker (Metoprolol 25mg daily) and Vitamin D3 supplementation (60,000 IU monthly).',
    details: {
      patientName: 'Ananya Sharma',
      patientAge: 29,
      patientGender: 'Female',
      facility: 'Metro Care Outpatient Clinic',
      physician: 'Dr. V. Ramanathan, MD',
      medications: [
        { name: 'Metoprolol Tartrate', dosage: '25 mg', frequency: 'Once daily after breakfast', duration: 'Ongoing / 90 days' },
        { name: 'Cholecalciferol (Vit D3)', dosage: '60,000 IU', frequency: 'Once weekly for 8 weeks', duration: 'Completed' },
        { name: 'Paracetamol', dosage: '500 mg', frequency: 'SOS for mild tension headache', duration: 'As needed' }
      ]
    }
  },
  {
    id: 'REC_CARD_005',
    title: 'Previous Cardiac Diagnosis',
    date: '12 Dec 2023',
    type: 'Hospital Record',
    provider: 'Heart & Vascular Institute of Metro',
    fileSize: '2.1 MB',
    fileName: 'Cardiac_Eval_Summary_122023.pdf',
    clinicalSummary: 'Outpatient evaluation following episodic palpitations. Diagnosed with mild benign sinus tachycardia and situational anxiety-induced chest tightness. Structural cardiac normal.',
    details: {
      patientName: 'Ananya Sharma',
      patientAge: 29,
      patientGender: 'Female',
      facility: 'Heart & Vascular Institute',
      physician: 'Dr. V. Ramanathan, MD (Chief Cardiologist)',
      findings: [
        'Echocardiogram: Normal LV function, LVEF 62%, no valvular prolapse',
        '24-Hour Holter: Isolated benign premature atrial complexes (< 0.2%)',
        'Impression: Stress-related physiological tachycardia, low ischemic risk'
      ],
      metrics: [
        { label: 'Ejection Fraction', value: '62%', status: 'normal' },
        { label: 'LV Dimensions', value: 'Normal', status: 'normal' },
        { label: 'Aortic Valve', value: 'Tri-leaflet', status: 'normal' }
      ]
    }
  },
  {
    id: 'REC_BLOOD_006',
    title: 'Blood Test Report',
    date: '12 Jan 2024',
    type: 'Lab Report',
    provider: 'City Diagnostics & Clinical Lab',
    fileSize: '950 KB',
    fileName: 'Complete_Hemogram_12012024.pdf',
    clinicalSummary: 'Complete Blood Count (CBC) and basic metabolic panel. Hemoglobin 12.8 g/dL, WBC count 6,800/mcL. Renal and liver panel normal.',
    details: {
      patientName: 'Ananya Sharma',
      patientAge: 29,
      patientGender: 'Female',
      facility: 'City Diagnostics Central Lab',
      physician: 'Dr. A. Sen, MD',
      metrics: [
        { label: 'Hemoglobin', value: '12.8 g/dL', status: 'normal' },
        { label: 'Platelets', value: '240,000 /mcL', status: 'normal' },
        { label: 'Serum Creatinine', value: '0.82 mg/dL', status: 'normal' },
        { label: 'Blood Glucose (F)', value: '88 mg/dL', status: 'normal' }
      ]
    }
  },
  {
    id: 'REC_XRAY_007',
    title: 'Chest X-ray',
    date: '10 Apr 2024',
    type: 'Imaging',
    provider: 'Apex Imaging & Radiology Center',
    fileSize: '3.4 MB',
    fileName: 'CXR_PA_View_10042024.dicom',
    clinicalSummary: 'Standard PA chest radiograph. Normal cardiothoracic ratio (< 0.50). Clear lung fields with no consolidation, pleural effusion, or pneumothorax.',
    details: {
      patientName: 'Ananya Sharma',
      patientAge: 29,
      patientGender: 'Female',
      facility: 'Apex Imaging Center, Dept. of Radiology',
      physician: 'Dr. S. Mukherjee, MD (Radiology)',
      findings: [
        'Bilateral costophrenic angles sharp and clear',
        'Normal pulmonary vascular markings',
        'Normal aortic contour and mediastinal silhouette',
        'Bony thorax and soft tissues unremarkable'
      ]
    }
  },
  {
    id: 'REC_RX_008',
    title: 'Prescription',
    date: '21 Mar 2024',
    type: 'Prescription',
    provider: 'Apex Wellness Clinic',
    fileSize: '410 KB',
    fileName: 'Rx_ApexClinic_21032024.pdf',
    clinicalSummary: 'General outpatient prescription for seasonal allergic rhinitis and routine multivitamin supplementation.',
    details: {
      patientName: 'Ananya Sharma',
      patientAge: 29,
      patientGender: 'Female',
      facility: 'Apex Wellness Clinic',
      physician: 'Dr. R. Verma, MBBS',
      medications: [
        { name: 'Levocetirizine', dosage: '5 mg', frequency: 'Bedtime for 5 days', duration: 'Completed' },
        { name: 'Fluticasone Furoate Spray', dosage: '2 sprays each nostril', frequency: 'Daily morning', duration: '2 weeks' }
      ]
    }
  },
  {
    id: 'REC_DISCHARGE_009',
    title: 'Discharge Summary',
    date: '18 Jun 2024',
    type: 'Hospital Record',
    provider: 'Metro Care Hospital',
    fileSize: '1.8 MB',
    fileName: 'DischargeSummary_MetroCare_18062024.pdf',
    clinicalSummary: 'Day-care observation and discharge summary for transient food-induced gastroenteritis with mild dehydration, fully resolved with IV fluids and antiemetics.',
    details: {
      patientName: 'Ananya Sharma',
      patientAge: 29,
      patientGender: 'Female',
      facility: 'Metro Care Hospital, Acute Care Unit',
      physician: 'Dr. P. Deshmukh, MD (Internal Medicine)',
      findings: [
        'Vitals stable at discharge: BP 118/76, HR 70, SpO2 99%',
        'Tolerating oral diet and oral hydration comfortably',
        'Discharged in stable hemodynamic status'
      ]
    }
  }
];

export const VALID_SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
