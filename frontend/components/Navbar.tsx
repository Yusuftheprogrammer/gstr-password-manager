import Link from 'next/link'

const Navbar = () => {
  return (
    <div>
      <Link href="/register">register</Link>
      <Link href="/login">login</Link>
      <Link href="/vault">vault</Link>
    </div>
  )
}

export default Navbar;