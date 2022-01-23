/**
 * Default style:
 * - width: `128px` | `8rem`
 * - border-bottom: `1px solid rgb(156 163 175)`
 * - display: `flex`
 */
export function SemiGrayLine({ className = 'border-gray-400' }) {
  const clsName = 'w-32 flex border-b m-2';
  return <span className={`${clsName} ${className}`} />;
}
