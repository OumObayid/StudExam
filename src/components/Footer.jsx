export default function Footer() {
  const date = new Date();
  const currentYear = date.getFullYear();
  return (
    <footer className="bg-gray-200 text-center p-4 shadow-inner">
      <p className="text-sm text-gray-700">
        © All Rights Reserved {currentYear} - Oumaima El Obayid
      </p>
    </footer>
  );
}
