import clsx from 'clsx';

interface Props {
  text: string;
  isStreaming?: boolean;
}

export default function StreamingText({ text, isStreaming }: Props) {
  return (
    <div
      className={clsx(
        'prose prose-invert prose-sm max-w-none leading-relaxed',
        'prose-p:my-2 prose-li:my-0.5',
        isStreaming && 'typing-cursor',
      )}
    >
      {text.split('\n').map((line, i) => (
        <p key={i} className={clsx(!line.trim() && 'h-2')}>
          {line || '\u00A0'}
        </p>
      ))}
    </div>
  );
}
