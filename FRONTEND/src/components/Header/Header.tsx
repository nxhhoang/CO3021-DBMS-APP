import { Link } from "react-router-dom"

interface NavItemProps {
  to: string
  label: string
}

function NavItem({ to, label }: NavItemProps) {
  return (
    <li>
      <Link to={to}>{label}</Link>
    </li>
  )
}

export default function Header() {
  const leftLinks: NavItemProps[] = [
    { to: "/", label: "HOME" },
    { to: "/announcement", label: "ANNOUNCEMENT" },
    { to: "/problem", label: "PROBLEMSET" },
    { to: "/contest", label: "CONTEST" },
    { to: "/about", label: "ABOUT" }
  ]

  const rightLinks: NavItemProps[] = [
    { to: "/login", label: "LOGIN" },
    { to: "/register", label: "REGISTER" }
  ]

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      padding: "10px 20px",
      borderBottom: "1px solid #ccc"
    }}>
      
      {/* Logo */}
      <Link to="/" style={{ fontWeight: "bold", marginRight: 20 }}>
        LOGO
      </Link>

      {/* Menu trái */}
      <nav>
        <ul style={{ display: "flex", gap: 15, listStyle: "none" }}>
          {leftLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </ul>
      </nav>

      {/* Menu phải */}
      <nav style={{ marginLeft: "auto" }}>
        <ul style={{ display: "flex", gap: 15, listStyle: "none" }}>
          {rightLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </ul>
      </nav>
    </header>
  )
}