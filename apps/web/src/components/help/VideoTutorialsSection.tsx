import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_TUTORIALS } from '../../data/helpData';
import { PlayCircle } from 'lucide-react';

const VideoTutorialsSection: React.FC = () => {
    const { t, language } = useLocalization();
    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

    const videoTutorials = MOCK_TUTORIALS.filter(t => t.type === 'video');

    const VideoModal: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-black p-2 rounded-lg shadow-2xl w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <video src={url} controls autoPlay className="w-full aspect-video rounded" />
            </div>
        </div>
    );

    return (
        <>
            <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
                <h2 className="text-2xl font-bold mb-4">{t('help.videos.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoTutorials.map(tut => (
                        <div key={tut.id} onClick={() => setPlayingVideoUrl(tut.videoUrl!)} className="group relative rounded-lg overflow-hidden cursor-pointer shadow-md">
                            <div className="absolute inset-0 bg-black/50" />
                            <img src={`https://picsum.photos/seed/${tut.id}/400/225`} alt={tut.title[language]} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                                <div className="text-xs font-semibold bg-black/50 px-2 py-0.5 rounded self-end">{tut.duration} {t('help.videos.minutes')}</div>
                                <h3 className="font-bold">{tut.title[language]}</h3>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="w-16 h-16 text-white/80" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {playingVideoUrl && <VideoModal url={playingVideoUrl} onClose={() => setPlayingVideoUrl(null)} />}
        </>
    );
};

export default VideoTutorialsSection;