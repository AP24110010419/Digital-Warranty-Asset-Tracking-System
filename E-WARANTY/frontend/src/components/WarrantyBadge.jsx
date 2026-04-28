import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const WarrantyBadge = ({ status, daysRemaining }) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'ACTIVE':
        return 'badge-active';
      case 'EXPIRING_SOON':
        return 'badge-expiring';
      case 'EXPIRED':
        return 'badge-expired';
      default:
        return 'badge-active';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />;
      case 'EXPIRING_SOON':
        return <Clock className="w-4 h-4" />;
      case 'EXPIRED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getText = () => {
    switch (status) {
      case 'ACTIVE':
        return `Active (${daysRemaining} days)`;
      case 'EXPIRING_SOON':
        return `Expiring in ${daysRemaining} days`;
      case 'EXPIRED':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`${getBadgeClass()} flex items-center gap-2`}>
      {getIcon()}
      <span>{getText()}</span>
    </div>
  );
};
