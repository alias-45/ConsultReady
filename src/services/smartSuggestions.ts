import { MedicalRecord, SmartSuggestionResult } from '../types';

interface SpecialtyRule {
  keywords: string[];
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

interface SpecialtyConfig {
  defaultRules: SpecialtyRule[];
  reasonRules?: Record<string, SpecialtyRule[]>;
}

/**
 * Deterministic Rule-Based Suggestion Engine
 * Isolated service mapping clinical specialty and visit reasons to relevant patient records
 * with clinical rationale explanations.
 */
const RULE_CATALOG: Record<string, SpecialtyConfig> = {
  Cardiology: {
    defaultRules: [
      {
        keywords: ['ecg', 'electrocardiogram'],
        priority: 'high',
        reason: 'Essential baseline electrical tracing to detect ischemia, rhythm disturbances, or conduction delays.'
      },
      {
        keywords: ['blood pressure', 'bp'],
        priority: 'high',
        reason: 'Helps identify cardiovascular hemodynamics, longitudinal trends, and hypertension control.'
      },
      {
        keywords: ['lipid', 'cholesterol'],
        priority: 'medium',
        reason: 'Crucial for cardiac risk stratification, atherogenic profile, and lipid-lowering evaluation.'
      },
      {
        keywords: ['cardiac diagnosis', 'cardiac eval', 'echocardiogram'],
        priority: 'high',
        reason: 'Relevant to previous cardiac activity, structural health, and confirmed clinical history.'
      },
      {
        keywords: ['medication', 'prescription', 'rx'],
        priority: 'medium',
        reason: 'Helps understand ongoing treatment and avoid adverse medication conflicts or contraindications.'
      }
    ],
    reasonRules: {
      'Chest pain': [
        {
          keywords: ['ecg'],
          priority: 'high',
          reason: 'Relevant to previous cardiac activity and history — vital to rule out active or ischemic patterns.'
        },
        {
          keywords: ['blood pressure'],
          priority: 'high',
          reason: 'Helps identify cardiovascular patterns, workload stressors, and hypertensive etiology.'
        },
        {
          keywords: ['cardiac diagnosis'],
          priority: 'high',
          reason: 'Provides essential historical context of prior cardiac evaluations and structural tests.'
        },
        {
          keywords: ['lipid panel'],
          priority: 'medium',
          reason: 'Relevant for cardiac risk assessment and vascular plaque vulnerability evaluation.'
        },
        {
          keywords: ['medication'],
          priority: 'medium',
          reason: 'Helps understand ongoing treatment (e.g. beta blockers) and avoid medication conflicts.'
        }
      ],
      'Palpitations & irregular heartbeat': [
        {
          keywords: ['ecg'],
          priority: 'high',
          reason: 'Direct comparison with past rhythm tracings to identify paroxysmal or ectopy changes.'
        },
        {
          keywords: ['cardiac diagnosis'],
          priority: 'high',
          reason: 'Prior Holter or arrhythmia findings are vital to establish baseline palpitations.'
        },
        {
          keywords: ['medication'],
          priority: 'high',
          reason: 'Assesses current anti-arrhythmic or chronotropic medication regimens.'
        }
      ]
    }
  },
  Pulmonology: {
    defaultRules: [
      {
        keywords: ['chest x-ray', 'x-ray', 'cxr'],
        priority: 'high',
        reason: 'Provides vital anatomical imaging of lung parenchyma, airways, and pleural spaces.'
      },
      {
        keywords: ['medication', 'prescription'],
        priority: 'high',
        reason: 'Critical to evaluate inhalers, bronchodilators, or anti-allergy medications.'
      },
      {
        keywords: ['blood test'],
        priority: 'medium',
        reason: 'Examines systemic inflammatory markers, eosinophil counts, and infection baselines.'
      }
    ]
  },
  'General Medicine': {
    defaultRules: [
      {
        keywords: ['blood test'],
        priority: 'high',
        reason: 'Comprehensive metabolic and hematological overview for systemic wellness.'
      },
      {
        keywords: ['blood pressure'],
        priority: 'high',
        reason: 'Core vital sign trajectory indicating general cardiovascular stability.'
      },
      {
        keywords: ['medication'],
        priority: 'medium',
        reason: 'Current medication reconciliation to prevent polypharmacy and drug interactions.'
      },
      {
        keywords: ['discharge summary'],
        priority: 'low',
        reason: 'Provides context on any recent hospital encounters or acute illnesses.'
      }
    ]
  }
};

export function getSmartRecordSuggestions(
  records: MedicalRecord[],
  specialty: string,
  reason: string
): SmartSuggestionResult[] {
  const config = RULE_CATALOG[specialty] || RULE_CATALOG['General Medicine'];
  
  // Prefer specific reason rules if present, otherwise default specialty rules
  const activeRules = (config.reasonRules && config.reasonRules[reason]) || config.defaultRules;

  const suggestions: SmartSuggestionResult[] = [];
  const matchedRecordIds = new Set<string>();

  // Evaluate each rule against patient's existing records
  for (const rule of activeRules) {
    for (const record of records) {
      if (matchedRecordIds.has(record.id)) continue;

      const recordTitleLower = record.title.toLowerCase();
      const recordTypeLower = record.type.toLowerCase();
      const summaryLower = (record.clinicalSummary || '').toLowerCase();

      const matches = rule.keywords.some(
        (kw) =>
          recordTitleLower.includes(kw.toLowerCase()) ||
          recordTypeLower.includes(kw.toLowerCase()) ||
          summaryLower.includes(kw.toLowerCase())
      );

      if (matches) {
        suggestions.push({
          recordId: record.id,
          record,
          priority: rule.priority,
          reason: rule.reason
        });
        matchedRecordIds.add(record.id);
        break;
      }
    }
  }

  // Fallback: If no records matched (or specialty not explicitly modeled), suggest recent records
  if (suggestions.length === 0 && records.length > 0) {
    records.slice(0, 3).forEach((rec) => {
      suggestions.push({
        recordId: rec.id,
        record: rec,
        priority: 'medium',
        reason: `Recent record from your profile that provides clinical context for ${specialty}.`
      });
    });
  }

  return suggestions;
}
