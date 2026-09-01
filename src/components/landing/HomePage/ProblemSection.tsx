const PROBLEMS = [
  {
    title: 'Spreadsheets',
    subtitle: '"The sheet is not the system."',
    items: [
      'One wrong edit breaks the record',
      'Permissions are hard to manage',
      'The work never becomes a workflow',
    ],
  },
  {
    title: 'Ready-made apps',
    subtitle: '"We keep changing our process to fit the tool."',
    items: [
      'Your process bends to the product',
      'Per-user pricing gets expensive',
      'Your data sits in someone else\'s system',
    ],
  },
  {
    title: 'Custom software',
    subtitle: '"We still need something now."',
    items: [
      'Takes months to launch',
      'Each change adds more work',
      'You depend on developers for every update',
    ],
  },
]

export function ProblemSection() {
  return (
    <section className="max-w-[960px] mx-auto px-6 py-[120px]">
      <div className="text-center mb-20">
        <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px] font-semibold mb-4 tracking-[-0.02em] md:tracking-[-0.03em]">
          What teams use now. And why it slows the work down.
        </h2>
        <p className="text-lg text-[#5d5f5f] max-w-xl mx-auto">
          When the work is real, spreadsheets break, generic apps force compromises, and custom builds take too long.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-[#e5e5e5]">
        {PROBLEMS.map((problem) => (
          <div key={problem.title} className="bg-[#fdf8f8] p-10 flex flex-col">
            {/* Icon + Title */}
            <div className="mb-6">
              <div className="w-10 h-10 rounded-full border-2 border-[#e5e5e5] flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-[#5d5f5f] font-mono">
                  {problem.title.charAt(0)}
                </span>
              </div>
              <h3 className="text-[24px] leading-tight font-semibold text-black mb-1">
                {problem.title}
              </h3>
              <p className="text-sm text-[#5d5f5f] italic font-mono">
                {problem.subtitle}
              </p>
            </div>

            {/* Pain points */}
            <ul className="space-y-4 text-base text-[#444748] flex-grow">
              {problem.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4c7c7] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-[#5d5f5f] mt-12 font-mono">
        Kora is the practical middle ground. Start in minutes, change the workflow, and keep ownership.
      </p>
    </section>
  )
}
