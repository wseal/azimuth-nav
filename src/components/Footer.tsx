export default function Footer() {
  return (
    <>
      <footer className="dark:bg-dark-800 border-t border-gray-200 bg-white dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-600 dark:text-gray-300">
            &copy; {new Date().getFullYear()}. Power By Next.js And Tailwind
            CSS.
          </p>
        </div>
      </footer>
    </>
  );
}
