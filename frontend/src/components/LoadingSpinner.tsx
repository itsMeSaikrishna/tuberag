import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

export default function LoadingSpinner({ className, size = 'md', label }: Props) {
  return (
    <div className={clsx('flex items-center justify-center gap-2', className)}>
      <Loader2 className={clsx('animate-spin text-accent', sizes[size])} />
      {label && <span className="text-sm text-gray-400">{label}</span>}
    </div>
  );
}
