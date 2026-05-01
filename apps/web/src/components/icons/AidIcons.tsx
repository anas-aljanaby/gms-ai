import React from 'react';
import { DollarSign, Package, Briefcase } from 'lucide-react';

export const FinancialAidIcon: React.FC<{className?: string}> = ({className}) => <DollarSign className={className} />;
export const InKindAidIcon: React.FC<{className?: string}> = ({className}) => <Package className={className} />;
export const ServiceAidIcon: React.FC<{className?: string}> = ({className}) => <Briefcase className={className} />;
