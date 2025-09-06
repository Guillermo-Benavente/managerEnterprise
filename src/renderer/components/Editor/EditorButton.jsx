import Button from "Components/Button/Button";
import ButtonType from "Types/renderer/buttonType";

export default function EditorButton({
  editor,
  mark,
  event,
  isActive,
  command,
  type = ButtonType.LINK,
  className = '',
  activeClassName = '',
  children,
  ...props
}) {
  const active = typeof isActive === 'function'
    ? isActive(editor)
    : mark
      ? editor?.isActive?.(mark)
      : false;

  const handleClick = () => {
    if (event) return event();
    if (typeof command === 'function') return command(editor);
    if (mark) editor?.chain().focus().toggleMark?.(mark).run();
  };

  const combinedClass = `${className} ${active ? activeClassName : ''}`.trim();

  return (
    <Button
      type={type}
      active={active}
      className={combinedClass}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}