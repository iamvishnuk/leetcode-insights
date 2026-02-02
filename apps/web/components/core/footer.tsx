import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='mt-16 border-t'>
      <div className='text-muted-foreground mx-auto flex h-20 max-w-6xl items-center justify-between text-sm'>
        <p>
          © {new Date().getFullYear()} LeetCode Insights · Built by{' '}
          <Link
            href='https://vishnuk.dev'
            className='text-foreground font-medium hover:underline'
            target='_blank'
          >
            Vishnu
          </Link>
        </p>

        <div className='flex items-center gap-6'>
          <Link
            href='#'
            className='hover:text-foreground transition'
          >
            GitHub
          </Link>
          <Link
            href='#'
            className='hover:text-foreground transition'
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
