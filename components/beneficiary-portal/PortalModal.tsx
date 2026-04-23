import React from 'react';
import BeneficiaryPortal from './BeneficiaryPortal';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PortalModal: React.FC<PortalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <div className="pointer-events-auto w-screen">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                {/* Close Button */}
                <div className="absolute top-4 left-4 z-10">
                  <button
                    onClick={onClose}
                    className="rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>
                
                {/* Portal Content */}
                <BeneficiaryPortal />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalModal;