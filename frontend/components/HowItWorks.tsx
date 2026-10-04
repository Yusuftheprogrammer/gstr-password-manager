const steps = [
  { title: "Create your master password", text: "It never leaves your device." },
  { title: "Add your logins", text: "Each entry is encrypted in your browser." },
  { title: "Access them anywhere", text: "Only you can decrypt your vault." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-8 px-4 py-20">
      <h2 className="mb-10 text-center text-3xl font-bold">How it works</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-lg border border-border bg-card p-6">
            <span className="text-sm font-semibold text-primary">Step {i + 1}</span>
            <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}