// First tab stop on every page: jumps past the navigation to <main id="main">.
export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to content
    </a>
  )
}
