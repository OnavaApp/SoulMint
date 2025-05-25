import animationData from '@/animations/loader.json';
import Player from 'lottie-react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <Player
        animationData={animationData}
        autoplay
        loop
        style={{ height: 150, width: 150 }}
      />
    </div>
  );
};

export default LoadingOverlay;