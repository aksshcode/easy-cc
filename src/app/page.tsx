export default function Home() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

function NavBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <span className="text-lg font-bold">[Auto cc]</span>
        <div className="hidden gap-8 text-sm text-zinc-600 sm:flex dark:text-zinc-400">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-white">
            Features
          </a>
          <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white">
            Pricing
          </a>
        </div>
        <a
          href="#pricing"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-300"
        >
          Get started
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32">
      <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        AI-powered color correction
      </span>
      <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
        Perfect colors in every photo, automatically.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Upload your images and [Auto cc] fixes exposure, white balance and
        color grading in seconds. No manual editing required.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="#pricing"
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-300"
        >
          Start free trial
        </a>
        <a
          href="#features"
          className="rounded-lg border border-zinc-300 px-6 py-3 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          See how it works
        </a>
      </div>
    </section>
  );
}

const features = [
  {
    title: "Auto white balance",
    description: "Neutralize color casts instantly with scene-aware analysis.",
  },
  {
    title: "Smart exposure",
    description: "Recover highlights and shadows with balanced corrections.",
  },
  {
    title: "One-click presets",
    description: "Apply consistent looks across your entire photo library.",
  },
];

function Features() {
  return (
    <section id="features" className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Everything you need for flawless color
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Starter",
    price: "$9",
    description: "For casual photographers.",
    features: ["100 photos / month", "Auto white balance", "JPG export"],
  },
  {
    name: "Pro",
    price: "$29",
    description: "For working professionals.",
    features: [
      "Unlimited photos",
      "All correction tools",
      "RAW support",
      "Batch processing",
    ],
    highlight: true,
  },
  {
    name: "Studio",
    price: "$79",
    description: "For teams and agencies.",
    features: ["Everything in Pro", "5 seats", "API access", "Priority support"],
  },
];

function Pricing() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-bold tracking-tight">
        Simple pricing
      </h2>
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-8 ${plan.highlight
              ? "border-zinc-900 shadow-lg dark:border-white"
              : "border-zinc-200 dark:border-zinc-800"
              }`}
          >
            <h3 className="font-semibold">{plan.name}</h3>
            <p className="mt-4 text-4xl font-bold">
              {plan.price}
              <span className="text-base font-normal text-zinc-500">/mo</span>
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {plan.description}
            </p>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <a
              href="#"
              className={`mt-8 rounded-lg px-4 py-2 text-center text-sm font-medium ${plan.highlight
                ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-300"
                : "border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                }`}
            >
              Choose {plan.name}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-sm text-zinc-600 dark:text-zinc-400">
        <span>© 2026 [Auto cc]</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-900 dark:hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-white">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
