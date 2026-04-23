
import React from 'react';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} [props.className="w-6 h-6"] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

/**
 * BankIcon - أيقونة البنك.
 * @component
 * @returns {JSX.Element}
 */
export const BankIcon = () => (
    <IconWrapper><path d="M3 21h18"></path><path d="M5 21V10h14v11"></path><path d="M5 10V5l7-3 7 3v5"></path><path d="M12 21v-8"></path><path d="M9 13h6"></path></IconWrapper>
);

/**
 * CreditCardIcon - أيقونة بطاقة الائتمان.
 * @component
 * @returns {JSX.Element}
 */
export const CreditCardIcon = () => (
    <IconWrapper><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></IconWrapper>
);

/**
 * CheckCircleIcon - أيقونة دائرة بها علامة صح (للنجاح).
 * @component
 * @returns {JSX.Element}
 */
export const CheckCircleIcon = () => (
    <IconWrapper className="w-5 h-5 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></IconWrapper>
);

/**
 * XCircleIcon - أيقونة دائرة بها علامة خطأ (للفشل).
 * @component
 * @returns {JSX.Element}
 */
export const XCircleIcon = () => (
    <IconWrapper className="w-5 h-5 text-red-500"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></IconWrapper>
);

/**
 * StripeIcon - أيقونة Stripe.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const StripeIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24Z" fill="#635BFF"/>
      <path d="M36.23 24.22c0-2.31-1.05-4.2-3.23-4.2-2.18 0-3.15 1.89-3.15 4.2 0 2.22 1.05 4.12 3.23 4.12 2.18 0 3.15-1.9 3.15-4.12Zm-11.77 0c0-2.31-.97-4.2-3.23-4.2-2.26 0-3.15 1.89-3.15 4.2 0 2.22.97 4.12 3.23 4.12 2.26 0 3.15-1.9 3.15-4.12Zm-1.89-9.15h4.12v18.3h-4.12v-18.3Zm-7.85 0h4.12v18.3h-4.12v-18.3Z" fill="#fff"/>
    </svg>
);

/**
 * PayPalIcon - أيقونة PayPal.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const PayPalIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24Z" fill="#0070BA"/>
      <path d="M26.23 20.3c-.34 2.1-1.02 3.8-2.02 5.1-.38.5-1.03.8-1.7.8h-2.1c-.5 0-.8-.1-1-.4-.2-.3-.1-.7.1-1.1.2-.4.5-.8.8-1.2.3-.4.3-.5.2-.9-.1-.4-.5-.6-.9-.6H16c-.5 0-.8-.1-1-.4-.2-.3-.1-.7.1-1.1l2-5.7c.1-.4.4-.6.8-.6h4.6c2.4 0 4 .8 4.7 3.2.3 1.1.2 2.1-.1 3Z" fill="#009CDE"/>
      <path d="M24.83 20.8c-.35 2.1-1.02 3.8-2.02 5.1-.38.5-1.03.8-1.7.8h-2.1c-.5 0-.8-.1-1-.4-.2-.3-.1-.7.1-1.1.2-.4.5-.8.8-1.2.3-.4.3-.5.2-.9-.1-.4-.5-.6-1-.6h-1.6c-.5 0-.8-.1-1-.4-.2-.3-.1-.7.1-1.1l2-5.7c.1-.4.4-.6.8-.6h4.6c2.4 0 4 .8 4.7 3.2.3 1.1.2 2.1-.1 3Z" fill="#fff"/>
    </svg>
);
