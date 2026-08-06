export default function DiffTag({ children, variant = "plus" }) {
  return <span className={`diff-tag diff-tag--${variant}`}>{children}</span>;
}
