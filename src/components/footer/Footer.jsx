import "./Footer.css"
export default function Footer() {
  const date = new Date();
  const currentYear = date.getFullYear();
  return (
    <footer className="footer text-center p-4 ">
      <p className="text-sm text-gray-700 mb-0">
        © All Rights Reserved {currentYear} - Oumaima El Obayid
      </p>
    </footer>
  );
}
