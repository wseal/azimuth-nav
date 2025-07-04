import ThemeSwitch from "@/components/ThemeSwitch";

export default function Header() {
  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Navigation
        </h1>
        <ThemeSwitch />
      </div>
    </header>
  );
}
