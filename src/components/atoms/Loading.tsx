import { Loader2 } from 'lucide-react';

interface LoadingProps {
  loadingText: string;
}

const Loading: React.FC<LoadingProps> = ({ loadingText = 'Loading...' }) => {
  return (
    <div className="flex justify-center items-center mt-10">
      <Loader2 className="animate-spin mr-2" /> {loadingText}
    </div>
  );
};

export default Loading;
