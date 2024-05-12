import { createSpring } from "@/hooks/createSpring";
import { formatDate } from "@/lib/formatDate";

export default function SpringyPage() {
  const [progress, setProgress] = createSpring(0);
  const [radialProgress, setRadialProgress] = createSpring(0, {
    stiffness: 0.05,
  });
  const [xy, setXY] = createSpring(
    { x: 50, y: 50 },
    { stiffness: 0.15, damping: 0.3 }
  );
  const [date, setDate] = createSpring(new Date());

  function toggleProgress() {
    if (progress() === 0) setProgress(1);
    else setProgress(0);
  }
  function toggleRadialProgress() {
    if (radialProgress() === 0) setRadialProgress(1);
    else setRadialProgress(0);
  }
  function toggleXY() {
    if (xy().x === 50 && xy().y === 50) setXY({ x: 500, y: 500 });
    else setXY({ x: 50, y: 50 });
  }
  function toggleDate() {
    if (date().getDate() === new Date("2024-12-01").getDate())
      setDate(new Date("2024-04-14"));
    else setDate(new Date("2024-12-01"));
  }

  return (
    <div class="flex max-w-5xl mx-auto items-center justify-center flex-col py-20 gap-y-10">
      <div class="flex gap-x-2">
        <button class="btn btn-primary btn-xs" onClick={toggleProgress}>
          Toggle progress
        </button>
        <button class="btn btn-primary btn-xs" onClick={toggleRadialProgress}>
          Toggle Radial progress
        </button>
        <button class="btn btn-primary btn-xs" onClick={toggleXY}>
          Toggle XY
        </button>
        <button class="btn btn-primary btn-xs" onClick={toggleDate}>
          Toggle Date
        </button>
      </div>

      {/* Progress */}
      <div class="flex items-center flex-col gap-y-3">
        <progress
          class="progress progress-primary w-56"
          value={progress() * 100}
          max="100"
        ></progress>

        <p class="text-primary">{(progress() * 100).toFixed(0)}%</p>
      </div>

      {/* Radial progress */}
      <div
        class="radial-progress text-primary border border-primary"
        style={`--value:${radialProgress() * 100};`}
        role="progressbar"
      >
        {(radialProgress() * 100).toFixed(0)}%
      </div>

      {/* XY */}
      <div
        class="card bg-primary grid place-items-center text-xs text-white truncate"
        style={{
          width: xy().x + "px",
          height: xy().y + "px",
        }}
      >
        {xy().x.toFixed(0)} x {xy().y.toFixed(0)}
      </div>

      {/* Date */}
      <div class="badge badge-primary">{formatDate(date())}</div>
    </div>
  );
}
