import Link from 'next/link'

const Hero = () => {
  return (

    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <h1>Secure. Simple. Swift</h1>
      <h4>Protect your digital identity with a password manager<br /> built for speed, security and unforgotable experience. <br /> Never lose you password acounts with enterprise-grade encryption</h4>
      <Link href="/register">Get started</Link>
      <Link href="/">See how it works</Link>
    </section>
      
  )
  
}

export default Hero