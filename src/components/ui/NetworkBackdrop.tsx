// Rede decorativa discreta: geometria estável, sem canvas ou loop de JavaScript.
const points = [
  [24, 92], [142, 40], [252, 134], [94, 242], [210, 326], [30, 402],
  [310, 36], [366, 258], [296, 456], [476, 370], [526, 80], [604, 212],
  [722, 44], [770, 326], [650, 460], [886, 174], [966, 60], [1060, 290],
  [922, 440], [1168, 124], [1190, 454], [1080, 516], [456, 526], [74, 530],
];
const edges = [[0,1],[0,3],[1,2],[1,6],[2,3],[2,7],[3,4],[3,5],[4,7],[4,8],[5,23],[6,10],[7,9],[8,22],[9,11],[9,14],[10,11],[10,12],[11,13],[12,15],[12,16],[13,14],[13,15],[14,18],[15,16],[15,17],[16,19],[17,18],[17,19],[17,20],[18,21],[19,20],[20,21],[21,22]];

export default function NetworkBackdrop() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" className="network-backdrop pointer-events-none absolute inset-0 h-full w-full text-blue-lite">
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.12">
        {edges.map(([a,b]) => <line key={`${a}-${b}`} x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} />)}
      </g>
      <g fill="currentColor" opacity="0.3">
        {points.map(([x,y],i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.5 : 1.5} />)}
      </g>
    </svg>
  );
}
