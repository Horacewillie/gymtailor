type StepDotsProps = {
  current: number;
  total: number;
  containerClassName: string;
  activeDotClassName: string;
  dotClassName: string;
};

export function StepDots({
  current,
  total,
  containerClassName,
  activeDotClassName,
  dotClassName,
}: StepDotsProps) {
  return (
    <div className={containerClassName} aria-hidden="true">
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx === current - 1;
        return <span key={idx} className={isActive ? activeDotClassName : dotClassName} />;
      })}
    </div>
  );
}
