import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, prefix: string = '₹', suffix: string = ' Cr'): string {
  if (value === undefined || value === null || isNaN(value)) return '—';
  return `${prefix}${value.toLocaleString('en-IN')}${suffix}`;
}

export function formatNumber(value: number, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '—';
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value: number, includeSign: boolean = false): string {
  if (value === undefined || value === null || isNaN(value)) return '—';
  const prefix = includeSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function getScoreColorClass(score: number, maxScore: number): {
  badge: string;
  bar: string;
  text: string;
  bg: string;
} {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  if (percentage >= 70) {
    return {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bar: 'bg-emerald-500',
      text: 'text-emerald-700',
      bg: 'bg-emerald-50/50',
    };
  }
  if (percentage >= 45) {
    return {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      bar: 'bg-amber-500',
      text: 'text-amber-700',
      bg: 'bg-amber-50/50',
    };
  }
  return {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    bar: 'bg-rose-500',
    text: 'text-rose-700',
    bg: 'bg-rose-50/50',
  };
}

export function getRiskBadgeClass(level: string): string {
  switch (level) {
    case 'Low':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Moderate':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Elevated':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'High':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}
