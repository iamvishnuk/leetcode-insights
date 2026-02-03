'use client';

import { Button } from '@leetcode-insights/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader
} from '@leetcode-insights/ui/components/card';
import { cn } from '@leetcode-insights/ui/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Highlight, themes, type PrismTheme } from 'prism-react-renderer';
import { useState } from 'react';

type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'c'
  | 'go'
  | 'rust'
  | 'bash'
  | 'json'
  | 'html'
  | 'css'
  | 'sql';

type CodeSample = {
  language: Language;
  label: string;
  code: string;
};

type CodeBlockProps = {
  samples: CodeSample[];
  defaultLanguage?: Language;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  title?: string;
  lightTheme?: PrismTheme;
  darkTheme?: PrismTheme;
  className?: string;
  onCopy?: (code: string) => void;
  maxHeight?: string;
  onLanguageChange?: (language: Language) => void;
  showHeader?: boolean;
};

const CodeBlock = ({
  samples,
  defaultLanguage,
  showLineNumbers = true,
  showCopyButton = true,
  title,
  lightTheme = themes.oneLight,
  darkTheme = themes.oneDark,
  className,
  onCopy,
  maxHeight,
  onLanguageChange,
  showHeader = true
}: CodeBlockProps) => {
  const { theme } = useTheme();
  const [isCopied, setIsCopied] = useState(false);

  const initialLanguage =
    defaultLanguage ?? samples[0]?.language ?? 'javascript';
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(initialLanguage);

  const currentSample =
    samples.find((s) => s.language === selectedLanguage) ?? samples[0];

  const handleCopy = () => {
    if (!currentSample) return;
    navigator.clipboard.writeText(currentSample.code);
    setIsCopied(true);
    onCopy?.(currentSample.code);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    setSelectedLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  if (!currentSample) return null;

  return (
    <Card className={cn('gap-0 rounded-md p-0')}>
      {showHeader && (
        <CardHeader className='flex w-full items-center justify-between py-2'>
          {title && (
            <span className='text-muted-foreground text-sm font-medium'>
              {title}
            </span>
          )}
          <div className='flex items-center gap-2'>
            {samples.length > 1 && (
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className='rounded-md p-2 text-sm transition-colors duration-200 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-900'
              >
                {samples.map((sample) => (
                  <option
                    key={sample.language}
                    value={sample.language}
                  >
                    {sample.label}
                  </option>
                ))}
              </select>
            )}
            {showCopyButton && (
              <Button
                className='cursor-pointer'
                variant='ghost'
                size='icon'
                onClick={handleCopy}
                aria-label={isCopied ? 'Copied' : 'Copy code'}
              >
                {isCopied ? (
                  <Check className='h-4 w-4' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className='p-0'>
        <Highlight
          theme={theme === 'dark' ? darkTheme : lightTheme}
          code={currentSample.code.trim()}
          language={currentSample.language}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...style,
                ...(maxHeight ? { maxHeight, overflowY: 'auto' } : {})
              }}
              className={cn(className)}
            >
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                >
                  {showLineNumbers && (
                    <span className='text-muted-foreground mr-4 inline-block w-5 text-right text-sm select-none'>
                      {i + 1}
                    </span>
                  )}
                  {line.map((token, key) => (
                    <span
                      key={key}
                      {...getTokenProps({ token })}
                    />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </CardContent>
    </Card>
  );
};

export { CodeBlock, type CodeSample, type Language };

export default CodeBlock;
