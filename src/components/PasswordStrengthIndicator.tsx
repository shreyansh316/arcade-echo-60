import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const rules = [
    { label: '8+ Characters', isValid: password.length >= 8 },
    { label: 'Uppercase Letter', isValid: /[A-Z]/.test(password) },
    { label: 'Number', isValid: /[0-9]/.test(password) },
    { label: 'Special Character', isValid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-primary/20 space-y-2 mt-2">
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Password Security</p>
      <div className="grid grid-cols-2 gap-2">
        {rules.map((rule, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex items-center gap-2 text-sm transition-colors duration-300",
              rule.isValid ? "text-[#10b981]" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300",
              rule.isValid ? "bg-[#10b981]/20 border-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "border-muted-foreground"
            )}>
              {rule.isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-50" />}
            </div>
            {rule.label}
          </div>
        ))}
      </div>
    </div>
  );
};
