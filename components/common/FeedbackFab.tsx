import React from 'react';
import { MessageSquare } from 'lucide-react';
import Tooltip from './Tooltip';
import { useLocalization } from '../../hooks/useLocalization';

interface FeedbackFabProps {
  onClick: () => void;
}

const FeedbackFab: React.FC<FeedbackFabProps> = ({ onClick }) => {
  const { t } = useLocalization();

  return (
    <Tooltip text={t('feedback.fabTooltip')}>
        <button
          onClick={onClick}
          className="fixed bottom-[160px] md:bottom-24 end-4 md:end-8 z-50 w-14 h-14 bg-secondary/80 dark:bg-secondary/70 backdrop-blur-md border-2 border-white/20 rounded-full shadow-2xl flex items-center justify-center text-white/90 transition-all duration-300 ease-bounce-out transform hover:scale-110 hover:shadow-secondary/40 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/50"
          aria-label={t('feedback.fabTooltip')}
        >
          <MessageSquare className="w-7 h-7" />
        </button>
    </Tooltip>
  );
};

export default FeedbackFab;