/**
 * BREAKING MATH — Mathematical Equation Solver & Engineering Calculator Suite
 * Production-ready frontend computational engine containing all 32 formulas.
 */

// ==========================================================================
// 1. APPLICATION DATABASE (ALL 32 FORMULAS FULLY IMPLEMENTED)
// ==========================================================================
const CATEGORIES = [
  { id: "all", label: "All Formulas" },
  { id: "cs", label: "Computer Science & IT" },
  { id: "electrical", label: "Electrical & Electronics" },
  { id: "mechanical", label: "Mechanical & Aerospace" },
  { id: "civil", label: "Civil & Structural" },
  { id: "chemical", label: "Chemical & Materials" }
];

const FORMULAS = [
  // ------------------------------------------------------------------------
  // COMPUTER SCIENCE & INFORMATION TECHNOLOGY (6 Formulas)
  // ------------------------------------------------------------------------
  {
    id: "amdahl-law",
    title: "Amdahl's Law",
    category: "cs",
    categoryLabel: "Computer Science & IT",
    description: "Calculates the theoretical maximum overall speedup of a computational task when scaling parallel processing cores.",
    latex: "S = \\frac{1}{(1 - p) + \\frac{p}{s}}",
    outputLabel: "Overall Speedup (S)",
    outputUnit: "× speedup",
    keywords: ["amdahl", "parallel", "speedup", "cores", "concurrency", "multithreading", "p", "s"],
    variables: [
      { id: "p", label: "Parallel Portion (p)", symbol: "p", unit: "fraction [0 - 1]", default: 0.8, min: 0, max: 1, step: 0.01, hint: "Fraction of algorithm that can run in parallel (0.8 = 80%)" },
      { id: "s", label: "Core Acceleration Factor (s)", symbol: "s", unit: "speedup factor", default: 4, min: 0.001, max: 4096, step: 1, hint: "Performance multiplier of parallel part (number of cores)" }
    ],
    validate: (inputs) => {
      if (inputs.p < 0 || inputs.p > 1) return "Parallel portion 'p' must satisfy 0 ≤ p ≤ 1.";
      if (inputs.s <= 0) return "Core speedup 's' must be strictly positive (> 0).";
      return null;
    },
    calculate: (inputs) => {
      const p = Number(inputs.p);
      const s = Number(inputs.s);
      const S = 1 / ((1 - p) + (p / s));
      const maxTheo = p === 1 ? Infinity : 1 / (1 - p);
      return {
        result: S,
        secondary: [
          { label: "Serial Fraction (1 - p)", value: formatNum(1 - p) },
          { label: "Theoretical Limit (s → ∞)", value: isFinite(maxTheo) ? formatNum(maxTheo) + "×" : "∞" }
        ],
        steps: [
          { title: "Define Governing Law", expr: "S = \\frac{1}{(1 - p) + \\frac{p}{s}}", note: "Amdahl's model partitions execution time into sequential and concurrent components." },
          { title: "Substitute Parameters", expr: `S = \\frac{1}{(1 - ${formatNum(p)}) + \\frac{${formatNum(p)}}{${formatNum(s)}}}`, note: "Substitute parallel fraction p and core scaling factor s." },
          { title: "Simplify Denominator", expr: `\\text{Denominator} = ${formatNum(1 - p)} + ${formatNum(p / s)} = ${formatNum((1 - p) + (p / s))}`, note: "Sum serial and parallel execution times." },
          { title: "Final Evaluation", expr: `S = \\mathbf{${formatNum(S)}\\times}`, note: "Net speedup achieved over a single processor execution." }
        ],
        chart: {
          label: "Speedup vs Cores",
          xAxis: "Cores (s)",
          yAxis: "Speedup (S)",
          labels: [1, 2, 4, 8, 16, 32, 64, 128],
          data: [1, 2, 4, 8, 16, 32, 64, 128].map(cores => Number((1 / ((1 - p) + (p / cores))).toFixed(3)))
        }
      };
    }
  },
  {
    id: "shannon-capacity",
    title: "Shannon Channel Capacity",
    category: "cs",
    categoryLabel: "Computer Science & IT",
    description: "Determines the theoretical maximum information transmission rate over a channel with bandwidth B in the presence of noise.",
    latex: "C = B \\cdot \\log_2\\left(1 + \\frac{S}{N}\\right)",
    outputLabel: "Channel Capacity (C)",
    outputUnit: "bps",
    keywords: ["shannon", "capacity", "bandwidth", "signal", "noise", "snr", "telecom", "bits"],
    variables: [
      { id: "b", label: "Bandwidth (B)", symbol: "B", unit: "Hz", default: 20000, min: 0.1, max: 1e11, step: 1000, hint: "Analog channel bandwidth in Hertz" },
      { id: "snr", label: "Signal-to-Noise Ratio (S/N)", symbol: "S/N", unit: "linear ratio", default: 1000, min: 0.001, max: 1e9, step: 10, hint: "Linear ratio of signal power to noise power (1000 ≈ 30 dB)" }
    ],
    validate: (inputs) => {
      if (inputs.b <= 0) return "Bandwidth B must be strictly greater than 0.";
      if (inputs.snr <= 0) return "Signal-to-noise ratio S/N must be strictly greater than 0.";
      return null;
    },
    calculate: (inputs) => {
      const B = Number(inputs.b);
      const snr = Number(inputs.snr);
      const spectralEff = Math.log2(1 + snr);
      const C = B * spectralEff;
      const snrDb = 10 * Math.log10(snr);
      return {
        result: C,
        secondary: [
          { label: "Spectral Efficiency", value: formatNum(spectralEff) + " b/s/Hz" },
          { label: "Capacity (kbps)", value: formatNum(C / 1000) + " kbps" },
          { label: "SNR in Decibels", value: formatNum(snrDb) + " dB" }
        ],
        steps: [
          { title: "Shannon-Hartley Theorem", expr: "C = B \\cdot \\log_2\\left(1 + \\frac{S}{N}\\right)", note: "Theoretical tight upper bound for error-free digital data throughput." },
          { title: "Substitute Parameters", expr: `C = (${formatNum(B)}) \\cdot \\log_2\\left(1 + ${formatNum(snr)}\\right)`, note: "Insert bandwidth in Hz and linear SNR." },
          { title: "Compute Spectral Efficiency", expr: `\\log_2(1 + ${formatNum(snr)}) = ${formatNum(spectralEff)} \\text{ bits/s/Hz}`, note: "Information carrying density per cycle of bandwidth." },
          { title: "Final Capacity", expr: `C = (${formatNum(B)}) \\times (${formatNum(spectralEff)}) = \\mathbf{${formatNum(C)} \\text{ bps}}`, note: "Theoretical transmission limit in bits per second." }
        ]
      };
    }
  },
  {
    id: "littles-law",
    title: "Little's Law",
    category: "cs",
    categoryLabel: "Computer Science & IT",
    description: "Relates steady-state average number of items in a queuing system to the arrival rate and average dwelling duration.",
    latex: "L = \\lambda \\cdot W",
    outputLabel: "Average Items in System (L)",
    outputUnit: "items",
    keywords: ["little", "queue", "arrival", "wait", "latency", "concurrency", "operating systems"],
    variables: [
      { id: "lambda", label: "Arrival Rate (λ)", symbol: "λ", unit: "items / s", default: 30, min: 0.0001, max: 1e9, step: 1, hint: "Mean rate at which requests enter the system" },
      { id: "w", label: "Average Wait Time (W)", symbol: "W", unit: "seconds", default: 0.25, min: 0.0001, max: 1e8, step: 0.05, hint: "Average time a request spends in the system" }
    ],
    validate: (inputs) => {
      if (inputs.lambda <= 0) return "Arrival rate λ must be positive.";
      if (inputs.w <= 0) return "Average wait time W must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const lam = Number(inputs.lambda);
      const w = Number(inputs.w);
      const L = lam * w;
      return {
        result: L,
        secondary: [
          { label: "Wait Time (ms)", value: formatNum(w * 1000) + " ms" },
          { label: "Throughput", value: formatNum(lam) + " req/s" }
        ],
        steps: [
          { title: "Queuing Formula", expr: "L = \\lambda \\cdot W", note: "Holds regardless of arrival distribution or internal scheduling disciplines." },
          { title: "Substitute Parameters", expr: `L = (${formatNum(lam)} \\text{ items/s}) \\times (${formatNum(w)} \\text{ s})`, note: "Multiply arrival throughput by residency duration." },
          { title: "Evaluate Concurrency", expr: `L = \\mathbf{${formatNum(L)} \\text{ items}}`, note: "Average concurrent in-flight items or active threads." }
        ]
      };
    }
  },
  {
    id: "binary-heap-indexing",
    title: "Binary Heap Indexing",
    category: "cs",
    categoryLabel: "Computer Science & IT",
    description: "Computes direct pointerless array indices for parent, left child, and right child in a zero-indexed binary heap.",
    latex: "\\text{Left} = 2i + 1, \\quad \\text{Right} = 2i + 2, \\quad \\text{Parent} = \\lfloor(i - 1)/2\\rfloor",
    outputLabel: "Left Child Index",
    outputUnit: "index",
    keywords: ["heap", "binary", "tree", "array", "indexing", "parent", "child", "priority queue"],
    variables: [
      { id: "i", label: "Current Node Index (i)", symbol: "i", unit: "zero-based integer", default: 3, min: 0, max: 1e8, step: 1, hint: "Zero-based position inside the continuous array" }
    ],
    validate: (inputs) => {
      const i = Number(inputs.i);
      if (i < 0 || !Number.isInteger(i)) return "Node index i must be a non-negative integer (0, 1, 2, ...).";
      return null;
    },
    calculate: (inputs) => {
      const i = parseInt(inputs.i, 10);
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      const parent = i === 0 ? "None (Root)" : Math.floor((i - 1) / 2);
      const depth = Math.floor(Math.log2(i + 1));
      return {
        result: left,
        secondary: [
          { label: "Left Child (2i + 1)", value: left.toString() },
          { label: "Right Child (2i + 2)", value: right.toString() },
          { label: "Parent Node", value: parent.toString() },
          { label: "Tree Depth Level", value: depth.toString() }
        ],
        steps: [
          { title: "Left Child Calculation", expr: `\\text{Left} = 2(${i}) + 1 = \\mathbf{${left}}`, note: "Offset for the left descendant in level-order traversal." },
          { title: "Right Child Calculation", expr: `\\text{Right} = 2(${i}) + 2 = \\mathbf{${right}}`, note: "Offset for the right descendant." },
          { title: "Parent Node Calculation", expr: i === 0 ? "\\text{Parent} = \\text{None (Index 0 is Root)}" : `\\text{Parent} = \\lfloor(${i} - 1)/2\\rfloor = \\mathbf{${parent}}`, note: "Integer floor division mapping child back to predecessor." }
        ]
      };
    }
  },
  {
    id: "hash-load-factor",
    title: "Hash Table Load Factor",
    category: "cs",
    categoryLabel: "Computer Science & IT",
    description: "Computes occupancy ratio α of stored entries to allocated buckets to assess collision likelihood and trigger dynamic resizing.",
    latex: "\\alpha = \\frac{n}{k}",
    outputLabel: "Load Factor (α)",
    outputUnit: "ratio",
    keywords: ["hash", "table", "load factor", "collision", "buckets", "alpha", "dictionary"],
    variables: [
      { id: "n", label: "Entries Stored (n)", symbol: "n", unit: "entries", default: 750, min: 0, max: 1e9, step: 10, hint: "Number of active key-value pairs" },
      { id: "k", label: "Bucket Array Slots (k)", symbol: "k", unit: "buckets", default: 1000, min: 1, max: 1e9, step: 10, hint: "Total allocated table capacity" }
    ],
    validate: (inputs) => {
      if (inputs.n < 0) return "Number of entries n cannot be negative.";
      if (inputs.k <= 0) return "Bucket count k must be strictly greater than 0.";
      return null;
    },
    calculate: (inputs) => {
      const n = Number(inputs.n);
      const k = Number(inputs.k);
      const alpha = n / k;
      let status = "Optimal (≤ 0.75)";
      if (alpha > 1.0) status = "High Contention (Chaining / Degradation)";
      else if (alpha > 0.75) status = "Resize / Rehash Recommended (> 0.75)";
      return {
        result: alpha,
        secondary: [
          { label: "Efficiency Status", value: status },
          { label: "Table Occupancy", value: (alpha * 100).toFixed(1) + "%" }
        ],
        steps: [
          { title: "Load Factor Definition", expr: "\\alpha = \\frac{n}{k}", note: "Ratio of populated entries to total array capacity." },
          { title: "Substitute Parameters", expr: `\\alpha = \\frac{${formatNum(n)}}{${formatNum(k)}}`, note: "Divide stored items by bucket size." },
          { title: "Computed Density", expr: `\\alpha = \\mathbf{${formatNum(alpha)}}`, note: "Values > 0.75 usually trigger internal rehashing to maintain O(1) performance." }
        ]
      };
    }
  },
  {
    id: "network-transmission-delay",
    title: "Network Transmission Delay",
    category: "cs",
    categoryLabel: "Computer Science & IT",
    description: "Calculates the time duration required to push all packet bits onto a network transmission medium.",
    latex: "t_{tx} = \\frac{L}{R}",
    outputLabel: "Transmission Delay (t_tx)",
    outputUnit: "s",
    keywords: ["network", "transmission", "delay", "packet", "bandwidth", "ethernet", "latency", "bits"],
    variables: [
      { id: "l", label: "Packet Length (L)", symbol: "L", unit: "bits", default: 12000, min: 1, max: 1e11, step: 8, hint: "Packet size (1500 bytes = 12,000 bits)" },
      { id: "r", label: "Transmission Rate (R)", symbol: "R", unit: "bps", default: 100000000, min: 1, max: 1e12, step: 1000000, hint: "Link speed (100 Mbps = 100,000,000 bps)" }
    ],
    validate: (inputs) => {
      if (inputs.l <= 0) return "Packet size L must be positive.";
      if (inputs.r <= 0) return "Transmission rate R must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const L = Number(inputs.l);
      const R = Number(inputs.r);
      const t = L / R;
      return {
        result: t,
        secondary: [
          { label: "Delay in Milliseconds", value: formatNum(t * 1000) + " ms" },
          { label: "Delay in Microseconds", value: formatNum(t * 1e6) + " µs" },
          { label: "Packet Size (Bytes)", value: formatNum(L / 8) + " B" }
        ],
        steps: [
          { title: "Transmission Formula", expr: "t_{tx} = \\frac{L}{R}", note: "Physical time required by network adapter to serialize packet bits." },
          { title: "Substitute Parameters", expr: `t_{tx} = \\frac{${formatNum(L)} \\text{ bits}}{${formatNum(R)} \\text{ bps}}`, note: "Divide packet size by link throughput." },
          { title: "Compute Delay", expr: `t_{tx} = ${formatNum(t)} \\text{ s} = \\mathbf{${formatNum(t * 1000)} \\text{ ms}}`, note: "Represents serialization delay, distinct from propagation speed." }
        ]
      };
    }
  },

  // ------------------------------------------------------------------------
  // ELECTRICAL & ELECTRONICS ENGINEERING (8 Formulas)
  // ------------------------------------------------------------------------
  {
    id: "ohms-law-dc-power",
    title: "Ohm's Law & DC Power",
    category: "electrical",
    categoryLabel: "Electrical & Electronics",
    description: "Solves all four fundamental DC electrical parameters (Voltage, Current, Resistance, Power) from any two known quantities.",
    latex: "V = I R, \\quad P = V I = I^2 R = \\frac{V^2}{R}",
    outputLabel: "Power Dissipated (P)",
    outputUnit: "W",
    keywords: ["ohm", "voltage", "current", "resistance", "power", "dc", "circuit", "watt", "ampere"],
    variables: [
      {
        id: "pair",
        label: "Known Quantity Pair",
        symbol: "Mode",
        type: "select",
        options: [
          { value: "VR", label: "Voltage (V) & Resistance (R)" },
          { value: "VI", label: "Voltage (V) & Current (I)" },
          { value: "VP", label: "Voltage (V) & Power (P)" },
          { value: "IR", label: "Current (I) & Resistance (R)" },
          { value: "IP", label: "Current (I) & Power (P)" },
          { value: "RP", label: "Resistance (R) & Power (P)" }
        ],
        default: "VR",
        hint: "Select which two quantities are known"
      },
      { id: "val1", label: "Primary Parameter", symbol: "Param 1", unit: "SI units", default: 12, min: 0.0001, max: 1e9, step: 0.1, hint: "Value of first known quantity" },
      { id: "val2", label: "Secondary Parameter", symbol: "Param 2", unit: "SI units", default: 4, min: 0.0001, max: 1e9, step: 0.1, hint: "Value of second known quantity" }
    ],
    validate: (inputs) => {
      if (Number(inputs.val1) <= 0 || Number(inputs.val2) <= 0) {
        return "Supplied electrical quantities must be strictly positive.";
      }
      return null;
    },
    calculate: (inputs) => {
      const p = inputs.pair || "VR";
      const a = Number(inputs.val1);
      const b = Number(inputs.val2);
      let V = 0, I = 0, R = 0, P = 0;

      if (p === "VR") { V = a; R = b; I = V / R; P = (V * V) / R; }
      else if (p === "VI") { V = a; I = b; R = V / I; P = V * I; }
      else if (p === "VP") { V = a; P = b; I = P / V; R = (V * V) / P; }
      else if (p === "IR") { I = a; R = b; V = I * R; P = I * I * R; }
      else if (p === "IP") { I = a; P = b; V = P / I; R = P / (I * I); }
      else if (p === "RP") { R = a; P = b; V = Math.sqrt(P * R); I = Math.sqrt(P / R); }

      return {
        result: P,
        secondary: [
          { label: "Voltage (V)", value: formatNum(V) + " V" },
          { label: "Current (I)", value: formatNum(I) + " A" },
          { label: "Resistance (R)", value: formatNum(R) + " Ω" },
          { label: "Power (P)", value: formatNum(P) + " W" }
        ],
        steps: [
          { title: "Ohm's & Joule's Laws", expr: "V = I R, \\quad P = V I = I^2 R = \\frac{V^2}{R}", note: "Fundamental constitutive relations for linear DC elements." },
          { title: "Selected Known Inputs", expr: `\\text{Known: } ${p} \\implies [${formatNum(a)}, ${formatNum(b)}]`, note: "Solve the linear/quadratic system for the remaining two unknown parameters." },
          { title: "Complete DC Circuit Solution", expr: `V = ${formatNum(V)}\\,\\text{V}, \\; I = ${formatNum(I)}\\,\\text{A}, \\; R = ${formatNum(R)}\\,\\Omega, \\; P = \\mathbf{${formatNum(P)}\\,\\text{W}}`, note: "All four state quantities fully resolved." }
        ]
      };
    }
  },
  {
    id: "rc-cutoff-frequency",
    title: "RC Filter Cutoff Frequency",
    category: "electrical",
    categoryLabel: "Electrical & Electronics",
    description: "Calculates the -3 dB corner cutoff frequency of a first-order passive resistor-capacitor filter.",
    latex: "f_c = \\frac{1}{2 \\pi R C}",
    outputLabel: "Cutoff Frequency (f_c)",
    outputUnit: "Hz",
    keywords: ["rc", "filter", "cutoff", "frequency", "capacitor", "resistor", "-3db", "low pass", "high pass"],
    variables: [
      { id: "r", label: "Resistance (R)", symbol: "R", unit: "Ω", default: 1000, min: 0.001, max: 1e9, step: 100, hint: "Filter resistance in Ohms" },
      { id: "c", label: "Capacitance (C)", symbol: "C", unit: "F", default: 1e-7, min: 1e-15, max: 1, step: 1e-8, hint: "Capacitance in Farads (1e-7 F = 0.1 µF = 100 nF)" }
    ],
    validate: (inputs) => {
      if (inputs.r <= 0) return "Resistance R must be positive.";
      if (inputs.c <= 0) return "Capacitance C must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const R = Number(inputs.r);
      const C = Number(inputs.c);
      const fc = 1 / (2 * Math.PI * R * C);
      const tau = R * C;
      return {
        result: fc,
        secondary: [
          { label: "Frequency in kHz", value: formatNum(fc / 1000) + " kHz" },
          { label: "Time Constant (τ = RC)", value: formatNum(tau * 1000) + " ms" },
          { label: "Angular Frequency (ω)", value: formatNum(2 * Math.PI * fc) + " rad/s" }
        ],
        steps: [
          { title: "Corner Frequency Formulation", expr: "f_c = \\frac{1}{2 \\pi R C}", note: "Condition where capacitive reactance equals resistance: X_C = R." },
          { title: "Substitute Parameters", expr: `f_c = \\frac{1}{2 \\pi \\times (${formatNum(R)}) \\times (${formatNum(C)})}`, note: "Product of 2π, resistance, and capacitance." },
          { title: "Compute Corner Frequency", expr: `f_c = \\mathbf{${formatNum(fc)} \\text{ Hz}} = \\mathbf{${formatNum(fc / 1000)} \\text{ kHz}}`, note: "Signal power is attenuated by 50% (-3 dB) at this frequency." }
        ],
        chart: {
          label: "Low-Pass Gain Response (dB)",
          xAxis: "Frequency Ratio (f / fc)",
          yAxis: "Gain (dB)",
          labels: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50].map(f => `${f}× fc`),
          data: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50].map(f => Number((20 * Math.log10(1 / Math.sqrt(1 + f * f))).toFixed(2)))
        }
      };
    }
  },
  {
    id: "lc-resonant-frequency",
    title: "LC Resonant Frequency",
    category: "electrical",
    categoryLabel: "Electrical & Electronics",
    description: "Determines the undamped natural resonant frequency of an inductor-capacitor tank circuit.",
    latex: "f_0 = \\frac{1}{2 \\pi \\sqrt{L C}}",
    outputLabel: "Resonant Frequency (f_0)",
    outputUnit: "Hz",
    keywords: ["lc", "tank", "resonance", "inductor", "capacitor", "tuned", "rf", "oscillator"],
    variables: [
      { id: "l", label: "Inductance (L)", symbol: "L", unit: "H", default: 0.001, min: 1e-12, max: 1e4, step: 0.0001, hint: "Inductance in Henrys (0.001 H = 1 mH)" },
      { id: "c", label: "Capacitance (C)", symbol: "C", unit: "F", default: 1e-8, min: 1e-15, max: 1, step: 1e-9, hint: "Capacitance in Farads (1e-8 F = 10 nF)" }
    ],
    validate: (inputs) => {
      if (inputs.l <= 0) return "Inductance L must be positive.";
      if (inputs.c <= 0) return "Capacitance C must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const L = Number(inputs.l);
      const C = Number(inputs.c);
      const sqrtLC = Math.sqrt(L * C);
      const f0 = 1 / (2 * Math.PI * sqrtLC);
      const Z0 = Math.sqrt(L / C);
      return {
        result: f0,
        secondary: [
          { label: "Frequency in kHz", value: formatNum(f0 / 1000) + " kHz" },
          { label: "Characteristic Z0", value: formatNum(Z0) + " Ω" },
          { label: "Angular ω0", value: formatNum(2 * Math.PI * f0) + " rad/s" }
        ],
        steps: [
          { title: "Thomson Resonance Formula", expr: "f_0 = \\frac{1}{2 \\pi \\sqrt{L C}}", note: "Resonant frequency occurs when inductive reactance cancels capacitive reactance: X_L = X_C." },
          { title: "Evaluate Radicand Term", expr: `\\sqrt{L C} = \\sqrt{(${formatNum(L)}) \\times (${formatNum(C)})} = ${formatNum(sqrtLC)}`, note: "Square root of reactive energy storage coefficients." },
          { title: "Compute Natural Frequency", expr: `f_0 = \\frac{1}{2 \\pi \\times ${formatNum(sqrtLC)}} = \\mathbf{${formatNum(f0)} \\text{ Hz}}`, note: "Peak transmission frequency of the ideal LC tank." }
        ]
      };
    }
  },
  {
    id: "three-phase-power",
    title: "Three-Phase AC Active Power",
    category: "electrical",
    categoryLabel: "Electrical & Electronics",
    description: "Calculates real active electric power dissipated in a balanced three-phase AC distribution system.",
    latex: "P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos(\\phi)",
    outputLabel: "Active Power (P)",
    outputUnit: "W",
    keywords: ["three phase", "power", "ac", "line voltage", "line current", "power factor", "kw", "active power"],
    variables: [
      { id: "vl", label: "Line Voltage (VL)", symbol: "V_L", unit: "V", default: 400, min: 0.1, max: 1e7, step: 10, hint: "RMS line-to-line potential (e.g. 400 V or 480 V)" },
      { id: "il", label: "Line Current (IL)", symbol: "I_L", unit: "A", default: 25, min: 0.01, max: 1e6, step: 1, hint: "RMS line conductor current in Amperes" },
      { id: "pf", label: "Power Factor (cos φ)", symbol: "cos(φ)", unit: "ratio [0 - 1]", default: 0.85, min: 0, max: 1, step: 0.01, hint: "Ratio of real power to apparent power (0 to 1)" }
    ],
    validate: (inputs) => {
      if (inputs.vl <= 0) return "Line voltage VL must be positive.";
      if (inputs.il <= 0) return "Line current IL must be positive.";
      if (inputs.pf < 0 || inputs.pf > 1) return "Power factor cos(φ) must be between 0 and 1.";
      return null;
    },
    calculate: (inputs) => {
      const VL = Number(inputs.vl);
      const IL = Number(inputs.il);
      const pf = Number(inputs.pf);
      const P = Math.sqrt(3) * VL * IL * pf;
      const S = Math.sqrt(3) * VL * IL;
      const Q = S * Math.sqrt(Math.max(0, 1 - pf * pf));
      return {
        result: P,
        secondary: [
          { label: "Active Power (kW)", value: formatNum(P / 1000) + " kW" },
          { label: "Apparent Power (S)", value: formatNum(S / 1000) + " kVA" },
          { label: "Reactive Power (Q)", value: formatNum(Q / 1000) + " kVAR" }
        ],
        steps: [
          { title: "Balanced 3-Phase Relation", expr: "P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos(\\phi)", note: "Applicable to both balanced Wye (Y) and Delta (Δ) system topologies." },
          { title: "Substitute Parameters", expr: `P = 1.73205 \\times (${formatNum(VL)}) \\times (${formatNum(IL)}) \\times ${formatNum(pf)}`, note: "Multiply root 3, RMS line voltage, RMS current, and power factor." },
          { title: "Active Real Power", expr: `P = \\mathbf{${formatNum(P)} \\text{ W}} = \\mathbf{${formatNum(P / 1000)} \\text{ kW}}`, note: "Effective continuous work-producing electrical rate." }
        ]
      };
    }
  },
  {
    id: "opamp-inverting-gain",
    title: "Op-Amp Inverting Gain",
    category: "electrical",
    categoryLabel: "Electrical & Electronics",
    description: "Calculates the closed-loop voltage amplification factor of an operational amplifier in an inverting configuration.",
    latex: "A_v = -\\frac{R_f}{R_{in}}",
    outputLabel: "Voltage Gain (A_v)",
    outputUnit: "gain (V/V)",
    keywords: ["opamp", "inverting", "gain", "amplifier", "feedback", "resistor", "electronics"],
    variables: [
      { id: "rf", label: "Feedback Resistor (Rf)", symbol: "R_f", unit: "Ω", default: 100000, min: 0.1, max: 1e9, step: 1000, hint: "Feedback path resistance (100 kΩ = 100,000 Ω)" },
      { id: "rin", label: "Input Resistor (Rin)", symbol: "R_in", unit: "Ω", default: 10000, min: 0.1, max: 1e9, step: 500, hint: "Input path series resistance (10 kΩ = 10,000 Ω)" }
    ],
    validate: (inputs) => {
      if (inputs.rf <= 0) return "Feedback resistance Rf must be positive.";
      if (inputs.rin <= 0) return "Input resistance Rin must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const Rf = Number(inputs.rf);
      const Rin = Number(inputs.rin);
      const Av = - (Rf / Rin);
      const gainDb = 20 * Math.log10(Math.abs(Av));
      return {
        result: Av,
        secondary: [
          { label: "Gain Magnitude |Av|", value: formatNum(Math.abs(Av)) + " V/V" },
          { label: "Gain in Decibels", value: formatNum(gainDb) + " dB" },
          { label: "Phase Shift", value: "180° Inversion" }
        ],
        steps: [
          { title: "Virtual Ground Analysis", expr: "A_v = -\\frac{R_f}{R_{in}}", note: "Derived from negative feedback forcing the inverting terminal to 0V virtual ground." },
          { title: "Substitute Resistors", expr: `A_v = -\\frac{${formatNum(Rf)}\\,\\Omega}{${formatNum(Rin)}\\,\\Omega}`, note: "Ratio of feedback resistance to input series resistance." },
          { title: "Compute Amplification", expr: `A_v = \\mathbf{${formatNum(Av)}} \\quad (${formatNum(gainDb)}\\text{ dB})`, note: "Negative sign denotes 180° inversion between input and output waveforms." }
        ]
      };
    }
  },
  {
    id: "capacitor-charging",
    title: "Capacitor Charging Curve",
    category: "electrical",
    categoryLabel: "Electrical & Electronics",
    description: "Calculates instantaneous potential across an uncharged capacitor charging through a series resistance.",
    latex: "V(t) = V_0 \\left(1 - e^{-\\frac{t}{R C}}\\right)",
    outputLabel: "Capacitor Voltage V(t)",
    outputUnit: "V",
    keywords: ["capacitor", "charging", "rc", "transient", "voltage", "time constant", "exponential"],
    variables: [
      { id: "v0", label: "DC Supply Potential (V0)", symbol: "V_0", unit: "V", default: 12, min: 0.01, max: 1e5, step: 1, hint: "Source DC potential in Volts" },
      { id: "r", label: "Series Resistance (R)", symbol: "R", unit: "Ω", default: 1000, min: 0.1, max: 1e9, step: 100, hint: "Charging path resistance" },
      { id: "c", label: "Capacitance (C)", symbol: "C", unit: "F", default: 0.0001, min: 1e-12, max: 1, step: 1e-5, hint: "Capacitance (0.0001 F = 100 µF)" },
      { id: "t", label: "Elapsed Time (t)", symbol: "t", unit: "s", default: 0.15, min: 0, max: 1e5, step: 0.01, hint: "Time since circuit switch closure" }
    ],
    validate: (inputs) => {
      if (inputs.v0 <= 0) return "Supply voltage V0 must be positive.";
      if (inputs.r <= 0) return "Resistance R must be positive.";
      if (inputs.c <= 0) return "Capacitance C must be positive.";
      if (inputs.t < 0) return "Time t cannot be negative.";
      return null;
    },
    calculate: (inputs) => {
      const V0 = Number(inputs.v0);
      const R = Number(inputs.r);
      const C = Number(inputs.c);
      const t = Number(inputs.t);
      const tau = R * C;
      const Vt = V0 * (1 - Math.exp(-t / tau));
      return {
        result: Vt,
        secondary: [
          { label: "Time Constant (τ = RC)", value: formatNum(tau * 1000) + " ms" },
          { label: "Charge Percentage", value: ((Vt / V0) * 100).toFixed(1) + "%" },
          { label: "Resistor Drop VR(t)", value: formatNum(V0 - Vt) + " V" }
        ],
        steps: [
          { title: "First-Order Transient Law", expr: "V(t) = V_0 \\left(1 - e^{-t / \\tau}\\right), \\quad \\tau = RC", note: "Solution to standard first-order RC differential circuit." },
          { title: "Evaluate Time Constant", expr: `\\tau = (${formatNum(R)}\\,\\Omega) \\times (${formatNum(C)}\\,\\text{F}) = ${formatNum(tau)}\\text{ s}`, note: "Time interval to reach 63.2% of steady-state voltage." },
          { title: "Compute Exponential Decay", expr: `e^{-${formatNum(t)} / ${formatNum(tau)}} = e^{${formatNum(-t / tau)}} = ${formatNum(Math.exp(-t / tau))}`, note: "Fraction of potential drop remaining across series resistor." },
          { title: "Capacitor Potential", expr: `V(${formatNum(t)}) = ${formatNum(V0)} \\times (1 - ${formatNum(Math.exp(-t / tau))}) = \\mathbf{${formatNum(Vt)}\\,\\text{V}}`, note: "Instantaneous voltage across capacitor plates." }
        ],
        chart: {
          label: "Voltage V(t)",
          xAxis: "Time (ms)",
          yAxis: "Voltage (V)",
          labels: [0, 0.5, 1, 1.5, 2, 3, 4, 5].map(m => `${(m * tau * 1000).toFixed(0)} ms`),
          data: [0, 0.5, 1, 1.5, 2, 3, 4, 5].map(m => Number((V0 * (1 - Math.exp(-m))).toFixed(3)))
        }
      };
    }
  },
  {
    id: "inductor-voltage",
    title: "Inductor Voltage",
    category: "electrical",
    categoryLabel: "Electrical & Electronics",
    description: "Calculates induced back-EMF voltage produced across an inductor in response to a time-varying electrical current.",
    latex: "V_L = L \\cdot \\frac{di}{dt}",
    outputLabel: "Induced Voltage (V_L)",
    outputUnit: "V",
    keywords: ["inductor", "voltage", "faraday", "lenz", "di/dt", "emf", "magnetic"],
    variables: [
      { id: "l", label: "Inductance (L)", symbol: "L", unit: "H", default: 0.05, min: 0.00001, max: 1e5, step: 0.01, hint: "Inductance in Henrys (0.05 H = 50 mH)" },
      { id: "didt", label: "Current Slew Rate (di/dt)", symbol: "di/dt", unit: "A / s", default: 200, min: -1e8, max: 1e8, step: 10, hint: "Rate of change of current over time" }
    ],
    validate: (inputs) => {
      if (inputs.l <= 0) return "Inductance L must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const L = Number(inputs.l);
      const didt = Number(inputs.didt);
      const VL = L * didt;
      return {
        result: VL,
        secondary: [
          { label: "Induced Back-EMF", value: formatNum(VL) + " V" },
          { label: "Opposing EMF (Lenz)", value: formatNum(-VL) + " V" }
        ],
        steps: [
          { title: "Faraday-Lenz Law", expr: "V_L = L \\cdot \\frac{di}{dt}", note: "Constitutive relation governing magnetic flux induction in coils." },
          { title: "Substitute Parameters", expr: `V_L = (${formatNum(L)}\\,\\text{H}) \\times (${formatNum(didt)}\\,\\text{A/s})`, note: "Multiply inductance by current variation rate." },
          { title: "Induced Voltage", expr: `V_L = \\mathbf{${formatNum(VL)}\\,\\text{V}}`, note: "Induced terminal potential opposing change in line current." }
        ]
      };
    }
  },
  {
    id: "transformer-turns-ratio",
    title: "Transformer Turns Ratio",
    category: "electrical",
    categoryLabel: "Electrical & Electronics",
    description: "Determines secondary induced voltage and transformation current ratio for an ideal single-phase AC transformer.",
    latex: "\\frac{V_p}{V_s} = \\frac{N_p}{N_s} = \\frac{I_s}{I_p}",
    outputLabel: "Secondary Voltage (V_s)",
    outputUnit: "V",
    keywords: ["transformer", "turns ratio", "voltage", "secondary", "primary", "step up", "step down"],
    variables: [
      { id: "np", label: "Primary Turns (Np)", symbol: "N_p", unit: "turns", default: 500, min: 1, max: 1e7, step: 10, hint: "Primary coil wire turns" },
      { id: "ns", label: "Secondary Turns (Ns)", symbol: "N_s", unit: "turns", default: 50, min: 1, max: 1e7, step: 10, hint: "Secondary coil wire turns" },
      { id: "vp", label: "Primary Voltage (Vp)", symbol: "V_p", unit: "V", default: 230, min: 0.1, max: 1e6, step: 5, hint: "Primary RMS input voltage" }
    ],
    validate: (inputs) => {
      if (inputs.np <= 0) return "Primary turns Np must be positive.";
      if (inputs.ns <= 0) return "Secondary turns Ns must be positive.";
      if (inputs.vp <= 0) return "Primary voltage Vp must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const Np = Number(inputs.np);
      const Ns = Number(inputs.ns);
      const Vp = Number(inputs.vp);
      const ratio = Np / Ns;
      const Vs = Vp * (Ns / Np);
      const mode = Vs < Vp ? "Step-Down" : (Vs > Vp ? "Step-Up" : "1:1 Isolation");
      return {
        result: Vs,
        secondary: [
          { label: "Configuration Mode", value: mode },
          { label: "Turns Ratio (Np : Ns)", value: formatNum(ratio) + " : 1" },
          { label: "Current Factor (Is / Ip)", value: formatNum(ratio) + "×" }
        ],
        steps: [
          { title: "Ideal Transformer Relation", expr: "\\frac{V_s}{V_p} = \\frac{N_s}{N_p}", note: "Mutual flux linkage scales output voltage in direct proportion to turns ratio." },
          { title: "Substitute Parameters", expr: `V_s = (${formatNum(Vp)}\\,\\text{V}) \\times \\left(\\frac{${formatNum(Ns)}}{${formatNum(Np)}}\\right)`, note: "Scale primary input voltage by secondary-to-primary winding ratio." },
          { title: "Compute Secondary Output", expr: `V_s = \\mathbf{${formatNum(Vs)}\\,\\text{V}}`, note: "Conservation of power mandates that current changes inversely." }
        ]
      };
    }
  },

  // ------------------------------------------------------------------------
  // MECHANICAL & AEROSPACE ENGINEERING (7 Formulas)
  // ------------------------------------------------------------------------
  {
    id: "euler-buckling",
    title: "Euler Critical Buckling Load",
    category: "mechanical",
    categoryLabel: "Mechanical & Aerospace",
    description: "Determines the maximum axial compressive load a slender column can sustain before failing via elastic lateral buckling.",
    latex: "P_{cr} = \\frac{\\pi^2 E I}{(K L)^2}",
    outputLabel: "Critical Buckling Load (P_cr)",
    outputUnit: "N",
    keywords: ["euler", "buckling", "column", "critical load", "elasticity", "inertia", "structural", "slender"],
    variables: [
      { id: "e", label: "Young's Modulus (E)", symbol: "E", unit: "Pa", default: 2e11, min: 1e5, max: 1e13, step: 1e9, hint: "Elastic modulus (Structural Steel ≈ 200 GPa = 2e11 Pa)" },
      { id: "i", label: "Moment of Inertia (I)", symbol: "I", unit: "m⁴", default: 8.33e-6, min: 1e-12, max: 10, step: 1e-7, hint: "Cross-sectional second moment of area about weak axis" },
      {
        id: "k",
        label: "Column Boundary Factor (K)",
        symbol: "K",
        type: "select",
        options: [
          { value: "1.0", label: "Pinned-Pinned (K = 1.0)" },
          { value: "0.5", label: "Fixed-Fixed (K = 0.5)" },
          { value: "0.7", label: "Fixed-Pinned (K = 0.7)" },
          { value: "2.0", label: "Fixed-Free Cantilever (K = 2.0)" }
        ],
        default: "1.0",
        hint: "Effective length boundary constraint multiplier"
      },
      { id: "l", label: "Column Length (L)", symbol: "L", unit: "m", default: 3.5, min: 0.1, max: 1000, step: 0.1, hint: "Unsupported physical column length" }
    ],
    validate: (inputs) => {
      if (inputs.e <= 0) return "Young's Modulus E must be positive.";
      if (inputs.i <= 0) return "Moment of inertia I must be positive.";
      if (inputs.l <= 0) return "Column length L must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const E = Number(inputs.e);
      const I = Number(inputs.i);
      const K = Number(inputs.k);
      const L = Number(inputs.l);
      const effL = K * L;
      const Pcr = (Math.PI * Math.PI * E * I) / (effL * effL);
      return {
        result: Pcr,
        secondary: [
          { label: "Critical Load (kN)", value: formatNum(Pcr / 1000) + " kN" },
          { label: "Effective Length (KL)", value: formatNum(effL) + " m" }
        ],
        steps: [
          { title: "Euler Buckling Equation", expr: "P_{cr} = \\frac{\\pi^2 E I}{(K L)^2}", note: "Calculates the bifurcation point where straight equilibrium becomes unstable." },
          { title: "Evaluate Effective Length", expr: `L_{eff} = K \\cdot L = ${formatNum(K)} \\times ${formatNum(L)} = ${formatNum(effL)}\\text{ m}`, note: "Adjusts length according to boundary support rotational stiffness." },
          { title: "Flexural Rigidity Product", expr: `\\pi^2 E I = \\pi^2 \\times (${formatNum(E)}) \\times (${formatNum(I)}) = ${formatNum(Math.PI * Math.PI * E * I)}`, note: "Bending resistance of cross-section." },
          { title: "Critical Axial Load", expr: `P_{cr} = \\mathbf{${formatNum(Pcr)}\\,\\text{N}} = \\mathbf{${formatNum(Pcr / 1000)}\\,\\text{kN}}`, note: "Axial compression exceeding this threshold precipitates sudden elastic deflection." }
        ],
        chart: {
          label: "Pcr vs Length (kN)",
          xAxis: "Length (m)",
          yAxis: "Critical Load (kN)",
          labels: [1, 2, 3, 4, 5, 6, 7, 8].map(len => `${len} m`),
          data: [1, 2, 3, 4, 5, 6, 7, 8].map(len => Number(((Math.PI * Math.PI * E * I) / Math.pow(K * len, 2) / 1000).toFixed(1)))
        }
      };
    }
  },
  {
    id: "beam-bending-stress",
    title: "Beam Bending Stress",
    category: "mechanical",
    categoryLabel: "Mechanical & Aerospace",
    description: "Calculates flexural normal stress at a perpendicular distance y from the neutral bending axis of a loaded beam.",
    latex: "\\sigma = \\frac{M \\cdot y}{I}",
    outputLabel: "Bending Stress (σ)",
    outputUnit: "Pa",
    keywords: ["bending", "stress", "flexure", "beam", "moment", "neutral axis", "inertia", "sigma"],
    variables: [
      { id: "m", label: "Bending Moment (M)", symbol: "M", unit: "N·m", default: 15000, min: 0, max: 1e9, step: 500, hint: "Internal bending moment on section" },
      { id: "y", label: "Neutral Axis Distance (y)", symbol: "y", unit: "m", default: 0.1, min: 0.0001, max: 10, step: 0.01, hint: "Perpendicular distance from neutral axis to extreme fiber" },
      { id: "i", label: "Moment of Inertia (I)", symbol: "I", unit: "m⁴", default: 0.00015, min: 1e-12, max: 10, step: 0.00001, hint: "Second moment of area of cross-section" }
    ],
    validate: (inputs) => {
      if (inputs.m < 0) return "Bending moment M cannot be negative.";
      if (inputs.y <= 0) return "Distance y must be strictly positive.";
      if (inputs.i <= 0) return "Moment of inertia I must be strictly positive.";
      return null;
    },
    calculate: (inputs) => {
      const M = Number(inputs.m);
      const y = Number(inputs.y);
      const I = Number(inputs.i);
      const sigma = (M * y) / I;
      return {
        result: sigma,
        secondary: [
          { label: "Stress in MPa", value: formatNum(sigma / 1e6) + " MPa" },
          { label: "Section Modulus (I/y)", value: formatNum(I / y) + " m³" }
        ],
        steps: [
          { title: "Flexure Formula", expr: "\\sigma = \\frac{M \\cdot y}{I}", note: "Assumes pure bending, linear elastic material response, and plane cross-sections remain plane." },
          { title: "Substitute Parameters", expr: `\\sigma = \\frac{(${formatNum(M)}\\,\\text{N}\\cdot\\text{m}) \\times (${formatNum(y)}\\,\\text{m})}{${formatNum(I)}\\,\\text{m}^4}`, note: "Multiply bending moment by fiber offset distance and divide by inertia." },
          { title: "Bending Stress", expr: `\\sigma = \\mathbf{${formatNum(sigma)}\\,\\text{Pa}} = \\mathbf{${formatNum(sigma / 1e6)}\\,\\text{MPa}}`, note: "Tensile on one side of neutral axis, compressive on opposite side." }
        ]
      };
    }
  },
  {
    id: "torsion-shafts",
    title: "Torsion in Circular Shafts",
    category: "mechanical",
    categoryLabel: "Mechanical & Aerospace",
    description: "Calculates maximum torsional shear stress generated in a circular drive shaft transmitting torque.",
    latex: "\\tau = \\frac{T \\cdot r}{J}",
    outputLabel: "Shear Stress (τ)",
    outputUnit: "Pa",
    keywords: ["torsion", "shaft", "torque", "shear stress", "polar moment", "twist", "tau"],
    variables: [
      { id: "t", label: "Applied Torque (T)", symbol: "T", unit: "N·m", default: 2500, min: 0.1, max: 1e9, step: 100, hint: "Twisting moment applied along axis" },
      { id: "r", label: "Outer Shaft Radius (r)", symbol: "r", unit: "m", default: 0.035, min: 0.001, max: 5, step: 0.005, hint: "Radius (0.035 m = 35 mm)" },
      { id: "j", label: "Polar Moment of Inertia (J)", symbol: "J", unit: "m⁴", default: 2.357e-6, min: 1e-12, max: 10, step: 1e-7, hint: "For solid shaft J = π r⁴ / 2" }
    ],
    validate: (inputs) => {
      if (inputs.t <= 0) return "Torque T must be positive.";
      if (inputs.r <= 0) return "Radius r must be positive.";
      if (inputs.j <= 0) return "Polar moment J must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const T = Number(inputs.t);
      const r = Number(inputs.r);
      const J = Number(inputs.j);
      const tau = (T * r) / J;
      return {
        result: tau,
        secondary: [
          { label: "Shear Stress in MPa", value: formatNum(tau / 1e6) + " MPa" },
          { label: "Torsional Modulus (J/r)", value: formatNum(J / r) + " m³" }
        ],
        steps: [
          { title: "Torsion Formula", expr: "\\tau = \\frac{T \\cdot r}{J}", note: "Shear stress varies linearly from zero at centerline to maximum at surface radius r." },
          { title: "Substitute Parameters", expr: `\\tau = \\frac{(${formatNum(T)}\\,\\text{N}\\cdot\\text{m}) \\times (${formatNum(r)}\\,\\text{m})}{${formatNum(J)}\\,\\text{m}^4}`, note: "Insert torque, outer radius, and polar moment of inertia." },
          { title: "Peak Shear Stress", expr: `\\tau = \\mathbf{${formatNum(tau)}\\,\\text{Pa}} = \\mathbf{${formatNum(tau / 1e6)}\\,\\text{MPa}}`, note: "Governs mechanical shaft sizing against shear yield failure." }
        ]
      };
    }
  },
  {
    id: "shaft-power",
    title: "Shaft Power",
    category: "mechanical",
    categoryLabel: "Mechanical & Aerospace",
    description: "Calculates mechanical rotational power output produced by a rotating shaft given torque and rotational speed.",
    latex: "P = \\frac{2 \\pi N T}{60}",
    outputLabel: "Rotational Power (P)",
    outputUnit: "W",
    keywords: ["shaft", "power", "torque", "rpm", "horsepower", "mechanical", "rotational"],
    variables: [
      { id: "n", label: "Rotational Speed (N)", symbol: "N", unit: "RPM", default: 1750, min: 0.1, max: 1e6, step: 50, hint: "Shaft revolutions per minute (1750 RPM standard motor)" },
      { id: "t", label: "Transmitted Torque (T)", symbol: "T", unit: "N·m", default: 280, min: 0.01, max: 1e8, step: 10, hint: "Shaft torque in Newton-meters" }
    ],
    validate: (inputs) => {
      if (inputs.n <= 0) return "Rotational speed N must be positive.";
      if (inputs.t <= 0) return "Torque T must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const N = Number(inputs.n);
      const T = Number(inputs.t);
      const omega = (2 * Math.PI * N) / 60;
      const P = omega * T;
      return {
        result: P,
        secondary: [
          { label: "Power in kW", value: formatNum(P / 1000) + " kW" },
          { label: "Mechanical Horsepower", value: formatNum(P / 745.7) + " hp" },
          { label: "Angular Velocity (ω)", value: formatNum(omega) + " rad/s" }
        ],
        steps: [
          { title: "Rotational Power Law", expr: "P = T \\cdot \\omega = \\frac{2 \\pi N T}{60}", note: "Product of torque and angular velocity in radians per second." },
          { title: "Convert RPM to Rad/s", expr: `\\omega = \\frac{2 \\pi \\times ${formatNum(N)}}{60} = ${formatNum(omega)}\\text{ rad/s}`, note: "Converts cyclic frequency into angular velocity." },
          { title: "Compute Mechanical Power", expr: `P = (${formatNum(omega)}) \\times (${formatNum(T)}) = \\mathbf{${formatNum(P)}\\,\\text{W}} = \\mathbf{${formatNum(P / 1000)}\\,\\text{kW}}`, note: "Continuous work rate available at the output coupling." }
        ]
      };
    }
  },
  {
    id: "linear-thermal-expansion",
    title: "Linear Thermal Expansion",
    category: "mechanical",
    categoryLabel: "Mechanical & Aerospace",
    description: "Calculates the dimensional elongation of a solid structural element subjected to a temperature swing.",
    latex: "\\Delta L = \\alpha \\cdot L_0 \\cdot \\Delta T",
    outputLabel: "Elongation (ΔL)",
    outputUnit: "m",
    keywords: ["thermal", "expansion", "temperature", "elongation", "alpha", "materials"],
    variables: [
      { id: "alpha", label: "Expansion Coefficient (α)", symbol: "α", unit: "1 / K", default: 1.2e-5, min: 1e-8, max: 1e-2, step: 1e-6, hint: "Coefficient of thermal expansion (Carbon Steel ≈ 1.2e-5 / K)" },
      { id: "l0", label: "Initial Length (L0)", symbol: "L_0", unit: "m", default: 10, min: 0.01, max: 1e5, step: 1, hint: "Original length in meters" },
      { id: "dt", label: "Temperature Change (ΔT)", symbol: "ΔT", unit: "K or °C", default: 45, min: -500, max: 5000, step: 5, hint: "Temperature differential (T_final - T_initial)" }
    ],
    validate: (inputs) => {
      if (inputs.alpha <= 0) return "Thermal expansion coefficient α must be positive.";
      if (inputs.l0 <= 0) return "Initial length L0 must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const alpha = Number(inputs.alpha);
      const L0 = Number(inputs.l0);
      const dt = Number(inputs.dt);
      const deltaL = alpha * L0 * dt;
      return {
        result: deltaL,
        secondary: [
          { label: "Elongation in mm", value: formatNum(deltaL * 1000) + " mm" },
          { label: "Final Length (L)", value: formatNum(L0 + deltaL) + " m" },
          { label: "Thermal Strain (ε)", value: formatNum(alpha * dt) }
        ],
        steps: [
          { title: "Linear Expansion Law", expr: "\\Delta L = \\alpha \\cdot L_0 \\cdot \\Delta T", note: "Linear constitutive relationship for isotropic thermal strains." },
          { title: "Substitute Parameters", expr: `\\Delta L = (${formatNum(alpha)}) \\times (${formatNum(L0)}\\,\\text{m}) \\times (${formatNum(dt)}\\,\\text{K})`, note: "Multiply material coefficient, initial length, and temperature change." },
          { title: "Elongation Result", expr: `\\Delta L = \\mathbf{${formatNum(deltaL)}\\,\\text{m}} = \\mathbf{${formatNum(deltaL * 1000)}\\,\\text{mm}}`, note: "Net physical displacement across member length." }
        ],
        chart: {
          label: "Elongation vs ΔT (mm)",
          xAxis: "ΔT (°C)",
          yAxis: "Elongation (mm)",
          labels: [0, 20, 40, 60, 80, 100].map(t => `${t}°C`),
          data: [0, 20, 40, 60, 80, 100].map(t => Number((alpha * L0 * t * 1000).toFixed(3)))
        }
      };
    }
  },
  {
    id: "carnot-efficiency",
    title: "Carnot Efficiency",
    category: "mechanical",
    categoryLabel: "Mechanical & Aerospace",
    description: "Determines the upper bound theoretical thermodynamic conversion efficiency attainable by any heat engine operating between two temperatures.",
    latex: "\\eta_{max} = 1 - \\frac{T_c}{T_h}",
    outputLabel: "Carnot Efficiency (η_max)",
    outputUnit: "fraction [0 - 1]",
    keywords: ["carnot", "efficiency", "thermodynamics", "heat engine", "kelvin", "temperature", "entropy"],
    variables: [
      { id: "tc", label: "Cold Sink Temp (Tc)", symbol: "T_c", unit: "Kelvin", default: 298.15, min: 0.01, max: 5000, step: 5, hint: "Cold reservoir temperature in Kelvin (298.15 K = 25 °C)" },
      { id: "th", label: "Hot Source Temp (Th)", symbol: "T_h", unit: "Kelvin", default: 873.15, min: 0.02, max: 10000, step: 10, hint: "Hot reservoir temperature in Kelvin (873.15 K = 600 °C)" }
    ],
    validate: (inputs) => {
      const Tc = Number(inputs.tc);
      const Th = Number(inputs.th);
      if (Tc <= 0) return "Cold reservoir temperature Tc must be strictly greater than 0 K.";
      if (Th <= 0) return "Hot reservoir temperature Th must be strictly greater than 0 K.";
      if (Th <= Tc) return "Hot source temperature Th must be strictly greater than cold sink temperature Tc.";
      return null;
    },
    calculate: (inputs) => {
      const Tc = Number(inputs.tc);
      const Th = Number(inputs.th);
      const eta = 1 - (Tc / Th);
      return {
        result: eta,
        secondary: [
          { label: "Efficiency Percentage", value: (eta * 100).toFixed(2) + "%" },
          { label: "Waste Heat Ratio (Qc/Qh)", value: formatNum(Tc / Th) },
          { label: "Hot Reservoir", value: (Th - 273.15).toFixed(1) + " °C" },
          { label: "Cold Reservoir", value: (Tc - 273.15).toFixed(1) + " °C" }
        ],
        steps: [
          { title: "Carnot's Fundamental Theorem", expr: "\\eta_{max} = 1 - \\frac{T_c}{T_h}", note: "Consequence of the Second Law of Thermodynamics and reversible Carnot cycle." },
          { title: "Substitute Absolute Temperatures", expr: `\\eta_{max} = 1 - \\frac{${formatNum(Tc)}\\,\\text{K}}{${formatNum(Th)}\\,\\text{K}} = 1 - ${formatNum(Tc / Th)}`, note: "Both reservoir temperatures must strictly be expressed in Kelvin." },
          { title: "Maximum Efficiency", expr: `\\eta_{max} = \\mathbf{${formatNum(eta)}} = \\mathbf{${(eta * 100).toFixed(2)}\\%}`, note: "No physical heat engine operating between these reservoirs can exceed this limit." }
        ],
        chart: {
          label: "Efficiency vs Hot Temp Th (K)",
          xAxis: "Hot Source Th (K)",
          yAxis: "Efficiency (%)",
          labels: [400, 600, 800, 1000, 1200].map(k => `${k} K`),
          data: [400, 600, 800, 1000, 1200].map(k => Number(((1 - Tc / k) * 100).toFixed(1)))
        }
      };
    }
  },
  {
    id: "hoop-stress",
    title: "Thin-Walled Vessel Hoop Stress",
    category: "mechanical",
    categoryLabel: "Mechanical & Aerospace",
    description: "Calculates circumferential tensile hoop stress developed in the wall of a pressurized cylindrical vessel.",
    latex: "\\sigma_h = \\frac{p \\cdot d}{2 t}",
    outputLabel: "Hoop Stress (σ_h)",
    outputUnit: "Pa",
    keywords: ["hoop", "stress", "pressure vessel", "cylinder", "thin walled", "pipe", "burst"],
    variables: [
      { id: "p", label: "Internal Gauge Pressure (p)", symbol: "p", unit: "Pa", default: 1.5e6, min: 0.01, max: 1e9, step: 1e5, hint: "Fluid internal pressure (1.5 MPa = 1.5e6 Pa)" },
      { id: "d", label: "Inside Diameter (d)", symbol: "d", unit: "m", default: 0.8, min: 0.01, max: 50, step: 0.05, hint: "Internal cylinder diameter in meters" },
      { id: "t", label: "Wall Thickness (t)", symbol: "t", unit: "m", default: 0.01, min: 0.0001, max: 2, step: 0.001, hint: "Shell wall thickness (0.01 m = 10 mm)" }
    ],
    validate: (inputs) => {
      if (inputs.p <= 0) return "Pressure p must be positive.";
      if (inputs.d <= 0) return "Inside diameter d must be positive.";
      if (inputs.t <= 0) return "Wall thickness t must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const p = Number(inputs.p);
      const d = Number(inputs.d);
      const t = Number(inputs.t);
      const sigmaH = (p * d) / (2 * t);
      const sigmaL = sigmaH / 2;
      return {
        result: sigmaH,
        secondary: [
          { label: "Hoop Stress in MPa", value: formatNum(sigmaH / 1e6) + " MPa" },
          { label: "Longitudinal Stress (σL)", value: formatNum(sigmaL / 1e6) + " MPa" },
          { label: "Diameter/Thickness Ratio", value: formatNum(d / t) + " (Valid if > 20)" }
        ],
        steps: [
          { title: "Hoop Stress Equilibrium", expr: "\\sigma_h = \\frac{p \\cdot d}{2 t}", note: "Balance of internal fluid pressure force against two resisting wall sections." },
          { title: "Substitute Parameters", expr: `\\sigma_h = \\frac{(${formatNum(p)}\\,\\text{Pa}) \\times (${formatNum(d)}\\,\\text{m})}{2 \\times (${formatNum(t)}\\,\\text{m})}`, note: "Multiply internal gauge pressure by diameter and divide by twice wall thickness." },
          { title: "Circumferential Stress", expr: `\\sigma_h = \\mathbf{${formatNum(sigmaH)}\\,\\text{Pa}} = \\mathbf{${formatNum(sigmaH / 1e6)}\\,\\text{MPa}}`, note: "Hoop stress is exactly double longitudinal axial stress (σ_h = 2 σ_L)." }
        ]
      };
    }
  },

  // ------------------------------------------------------------------------
  // CIVIL & STRUCTURAL ENGINEERING (5 Formulas)
  // ------------------------------------------------------------------------
  {
    id: "mannings-flow",
    title: "Manning's Open Channel Flow",
    category: "civil",
    categoryLabel: "Civil & Structural",
    description: "Calculates volumetric discharge flow rate in open channels under gravity-driven uniform fluid flow conditions.",
    latex: "Q = \\frac{1}{n} \\cdot A \\cdot R_h^{2/3} \\cdot S^{1/2}",
    outputLabel: "Discharge Rate (Q)",
    outputUnit: "m³/s",
    keywords: ["manning", "open channel", "discharge", "flow", "hydraulic", "roughness", "slope", "civil"],
    variables: [
      { id: "n", label: "Manning's Roughness (n)", symbol: "n", unit: "s / m^(1/3)", default: 0.015, min: 0.001, max: 0.2, step: 0.001, hint: "Channel roughness coefficient (Concrete ≈ 0.013 - 0.015)" },
      { id: "a", label: "Wetted Cross-Section Area (A)", symbol: "A", unit: "m²", default: 4.5, min: 0.01, max: 1e5, step: 0.5, hint: "Flow cross-sectional area" },
      { id: "rh", label: "Hydraulic Radius (Rh)", symbol: "R_h", unit: "m", default: 1.2, min: 0.01, max: 100, step: 0.1, hint: "Ratio of flow area to wetted perimeter (Rh = A / P_wet)" },
      { id: "s", label: "Channel Bed Slope (S)", symbol: "S", unit: "m / m", default: 0.002, min: 0.00001, max: 0.5, step: 0.0005, hint: "Longitudinal gradient of channel bed (0.002 = 0.2%)" }
    ],
    validate: (inputs) => {
      if (inputs.n <= 0) return "Roughness n must be positive.";
      if (inputs.a <= 0) return "Cross-sectional area A must be positive.";
      if (inputs.rh <= 0) return "Hydraulic radius Rh must be positive.";
      if (inputs.s <= 0) return "Bed slope S must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const n = Number(inputs.n);
      const A = Number(inputs.a);
      const Rh = Number(inputs.rh);
      const S = Number(inputs.s);
      const V = (1 / n) * Math.pow(Rh, 2/3) * Math.pow(S, 0.5);
      const Q = A * V;
      return {
        result: Q,
        secondary: [
          { label: "Flow Velocity (V)", value: formatNum(V) + " m/s" },
          { label: "Discharge (Liters/s)", value: formatNum(Q * 1000) + " L/s" }
        ],
        steps: [
          { title: "Manning's Empirical Law", expr: "Q = \\frac{1}{n} \\cdot A \\cdot R_h^{2/3} \\cdot S^{1/2}", note: "Standard formulation for gravity-driven free surface conduit flow." },
          { title: "Evaluate Intermediate Terms", expr: `R_h^{2/3} = ${formatNum(Math.pow(Rh, 2/3))}, \\quad S^{1/2} = ${formatNum(Math.pow(S, 0.5))}`, note: "Geometric resistance and driving energy slope." },
          { title: "Compute Average Velocity", expr: `V = \\frac{1}{${formatNum(n)}} \\times ${formatNum(Math.pow(Rh, 2/3))} \\times ${formatNum(Math.pow(S, 0.5))} = ${formatNum(V)}\\text{ m/s}`, note: "Mean flow velocity across cross-section." },
          { title: "Total Volumetric Discharge", expr: `Q = A \\cdot V = (${formatNum(A)}\\,\\text{m}^2) \\times (${formatNum(V)}\\,\\text{m/s}) = \\mathbf{${formatNum(Q)}\\,\\text{m}^3/\\text{s}}`, note: "Total liquid volume delivered per second." }
        ]
      };
    }
  },
  {
    id: "darcys-law",
    title: "Darcy's Law",
    category: "civil",
    categoryLabel: "Civil & Structural",
    description: "Calculates steady-state seepage fluid discharge through a porous geological medium such as an earthen embankment or aquifer.",
    latex: "Q = K \\cdot A \\cdot \\frac{\\Delta h}{L}",
    outputLabel: "Seepage Discharge (Q)",
    outputUnit: "m³/s",
    keywords: ["darcy", "seepage", "hydraulic conductivity", "permeability", "aquifer", "soil", "head loss"],
    variables: [
      { id: "k", label: "Hydraulic Conductivity (K)", symbol: "K", unit: "m / s", default: 0.00025, min: 1e-12, max: 1, step: 0.00005, hint: "Permeability coefficient (Clean Sand ≈ 1e-4 - 1e-2 m/s)" },
      { id: "a", label: "Porous Medium Area (A)", symbol: "A", unit: "m²", default: 12, min: 0.01, max: 1e6, step: 1, hint: "Cross-sectional flow area normal to seepage" },
      { id: "dh", label: "Head Loss (Δh)", symbol: "Δh", unit: "m", default: 1.8, min: 0.001, max: 1000, step: 0.1, hint: "Piezometric head differential" },
      { id: "l", label: "Seepage Path Length (L)", symbol: "L", unit: "m", default: 6, min: 0.01, max: 1e5, step: 0.5, hint: "Total flow path length through porous media" }
    ],
    validate: (inputs) => {
      if (inputs.k <= 0) return "Conductivity K must be positive.";
      if (inputs.a <= 0) return "Area A must be positive.";
      if (inputs.dh <= 0) return "Head loss Δh must be positive.";
      if (inputs.l <= 0) return "Length L must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const K = Number(inputs.k);
      const A = Number(inputs.a);
      const dh = Number(inputs.dh);
      const L = Number(inputs.l);
      const i = dh / L;
      const Q = K * A * i;
      return {
        result: Q,
        secondary: [
          { label: "Hydraulic Gradient (i = Δh/L)", value: formatNum(i) },
          { label: "Darcy Specific Flux (q)", value: formatNum(Q / A) + " m/s" },
          { label: "Discharge (Liters/hr)", value: formatNum(Q * 3.6e6) + " L/h" }
        ],
        steps: [
          { title: "Darcy's Governing Equation", expr: "Q = K \\cdot A \\cdot \\frac{\\Delta h}{L}", note: "Fundamental relationship for laminar fluid filtration through porous media." },
          { title: "Evaluate Hydraulic Gradient", expr: `i = \\frac{\\Delta h}{L} = \\frac{${formatNum(dh)}\\,\\text{m}}{${formatNum(L)}\\,\\text{m}} = ${formatNum(i)}`, note: "Dimensionless piezometric driving potential." },
          { title: "Compute Volumetric Flow", expr: `Q = (${formatNum(K)}\\,\\text{m/s}) \\times (${formatNum(A)}\\,\\text{m}^2) \\times (${formatNum(i)}) = \\mathbf{${formatNum(Q)}\\,\\text{m}^3/\\text{s}}`, note: "Total steady-state fluid seepage rate through the strata." }
        ]
      };
    }
  },
  {
    id: "beam-center-deflection",
    title: "Beam Maximum Center Deflection",
    category: "civil",
    categoryLabel: "Civil & Structural",
    description: "Calculates maximum downward center-span deflection of a simply-supported beam carrying a uniform distributed load.",
    latex: "\\delta_{max} = \\frac{5 \\cdot w \\cdot L^4}{384 \\cdot E \\cdot I}",
    outputLabel: "Center Deflection (δ_max)",
    outputUnit: "m",
    keywords: ["beam", "deflection", "simply supported", "distributed load", "elasticity", "inertia", "structural"],
    variables: [
      { id: "w", label: "Uniform Distributed Load (w)", symbol: "w", unit: "N / m", default: 8000, min: 0.1, max: 1e8, step: 500, hint: "Continuous linear load intensity (8 kN/m = 8000 N/m)" },
      { id: "l", label: "Beam Span (L)", symbol: "L", unit: "m", default: 6, min: 0.1, max: 100, step: 0.5, hint: "Span between end pin/roller supports" },
      { id: "e", label: "Elastic Modulus (E)", symbol: "E", unit: "Pa", default: 2e11, min: 1e6, max: 1e13, step: 1e9, hint: "Young's modulus (Structural Steel ≈ 2e11 Pa)" },
      { id: "i", label: "Moment of Inertia (I)", symbol: "I", unit: "m⁴", default: 1.2e-4, min: 1e-12, max: 10, step: 1e-5, hint: "Second moment of area of cross-section" }
    ],
    validate: (inputs) => {
      if (inputs.w <= 0) return "Distributed load w must be positive.";
      if (inputs.l <= 0) return "Span L must be positive.";
      if (inputs.e <= 0) return "Modulus E must be positive.";
      if (inputs.i <= 0) return "Moment of inertia I must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const w = Number(inputs.w);
      const L = Number(inputs.l);
      const E = Number(inputs.e);
      const I = Number(inputs.i);
      const delta = (5 * w * Math.pow(L, 4)) / (384 * E * I);
      return {
        result: delta,
        secondary: [
          { label: "Deflection in mm", value: formatNum(delta * 1000) + " mm" },
          { label: "Span-to-Deflection Ratio", value: "L / " + Math.round(L / delta) },
          { label: "Standard Limit (L/360)", value: formatNum((L / 360) * 1000) + " mm" }
        ],
        steps: [
          { title: "Euler-Bernoulli Beam Deflection", expr: "\\delta_{max} = \\frac{5 w L^4}{384 E I}", note: "Obtained from successive integration of the beam curvature equation M(x)." },
          { title: "Substitute Parameters", expr: `\\delta_{max} = \\frac{5 \\times (${formatNum(w)}) \\times (${formatNum(L)})^4}{384 \\times (${formatNum(E)}) \\times (${formatNum(I)})}`, note: "Combines span to 4th power with flexural rigidity product EI." },
          { title: "Compute Midspan Deflection", expr: `\\delta_{max} = \\mathbf{${formatNum(delta)}\\,\\text{m}} = \\mathbf{${formatNum(delta * 1000)}\\,\\text{mm}}`, note: "Peak deflection at midspan (x = L/2)." }
        ]
      };
    }
  },
  {
    id: "terzaghi-bearing-capacity",
    title: "Terzaghi Ultimate Bearing Capacity",
    category: "civil",
    categoryLabel: "Civil & Structural",
    description: "Calculates the ultimate foundation bearing capacity of a shallow strip footing resting on cohesive-frictional soil.",
    latex: "q_u = c \\cdot N_c + \\gamma \\cdot D_f \\cdot N_q + 0.5 \\cdot \\gamma \\cdot B \\cdot N_\\gamma",
    outputLabel: "Ultimate Bearing Capacity (q_u)",
    outputUnit: "Pa",
    keywords: ["terzaghi", "bearing capacity", "geotechnical", "foundation", "soil", "footing", "cohesion"],
    variables: [
      { id: "c", label: "Soil Cohesion (c)", symbol: "c", unit: "Pa", default: 20000, min: 0, max: 1e7, step: 1000, hint: "Soil cohesion parameter (20 kPa = 20,000 Pa)" },
      { id: "gamma", label: "Soil Unit Weight (γ)", symbol: "γ", unit: "N / m³", default: 18500, min: 1000, max: 1e6, step: 500, hint: "Unit weight of soil (typically 17,000 - 20,000 N/m³)" },
      { id: "df", label: "Embedment Depth (Df)", symbol: "D_f", unit: "m", default: 1.5, min: 0, max: 100, step: 0.2, hint: "Depth of foundation below ground surface" },
      { id: "b", label: "Footing Width (B)", symbol: "B", unit: "m", default: 2.0, min: 0.1, max: 100, step: 0.2, hint: "Width of shallow strip footing" },
      { id: "nc", label: "Bearing Factor (Nc)", symbol: "N_c", unit: "factor", default: 17.69, min: 1, max: 200, step: 0.1, hint: "Terzaghi bearing capacity factor for cohesion" },
      { id: "nq", label: "Surcharge Factor (Nq)", symbol: "N_q", unit: "factor", default: 7.44, min: 1, max: 200, step: 0.1, hint: "Terzaghi factor for overburden surcharge" },
      { id: "ngamma", label: "Weight Factor (Nγ)", symbol: "N_γ", unit: "factor", default: 3.64, min: 0, max: 200, step: 0.1, hint: "Terzaghi factor for soil wedge weight" }
    ],
    validate: (inputs) => {
      if (inputs.c < 0) return "Cohesion c cannot be negative.";
      if (inputs.gamma <= 0) return "Soil unit weight γ must be positive.";
      if (inputs.df < 0) return "Embedment depth Df cannot be negative.";
      if (inputs.b <= 0) return "Footing width B must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const c = Number(inputs.c);
      const gamma = Number(inputs.gamma);
      const Df = Number(inputs.df);
      const B = Number(inputs.b);
      const Nc = Number(inputs.nc);
      const Nq = Number(inputs.nq);
      const Ngamma = Number(inputs.ngamma);

      const t1 = c * Nc;
      const t2 = gamma * Df * Nq;
      const t3 = 0.5 * gamma * B * Ngamma;
      const qu = t1 + t2 + t3;
      return {
        result: qu,
        secondary: [
          { label: "Ultimate in kPa", value: formatNum(qu / 1000) + " kPa" },
          { label: "Allowable (FS = 3)", value: formatNum(qu / 3000) + " kPa" },
          { label: "Cohesion Component", value: formatNum(t1 / 1000) + " kPa" },
          { label: "Surcharge Component", value: formatNum(t2 / 1000) + " kPa" }
        ],
        steps: [
          { title: "Terzaghi Superposition Formulation", expr: "q_u = c N_c + \\gamma D_f N_q + \\frac{1}{2} \\gamma B N_\\gamma", note: "Sums soil shear strength, overburden surcharge confinement, and soil wedge weight." },
          { title: "Evaluate Individual Terms", expr: `T_1 = ${formatNum(t1)}\\,\\text{Pa}, \\; T_2 = ${formatNum(t2)}\\,\\text{Pa}, \\; T_3 = ${formatNum(t3)}\\,\\text{Pa}`, note: "Contributions of cohesion, embedment depth, and footing geometry." },
          { title: "Ultimate Bearing Capacity", expr: `q_u = \\mathbf{${formatNum(qu)}\\,\\text{Pa}} = \\mathbf{${formatNum(qu / 1000)}\\,\\text{kPa}}`, note: "Gross limit pressure precipitating general soil shear failure." }
        ]
      };
    }
  },
  {
    id: "stopping-sight-distance",
    title: "Horizontal Stopping Sight Distance",
    category: "civil",
    categoryLabel: "Civil & Structural",
    description: "Calculates total required roadway sight stopping distance accounting for driver perception-reaction delay and braking friction on slopes.",
    latex: "d = v \\cdot t + \\frac{v^2}{2 g (f \\pm G)}",
    outputLabel: "Stopping Sight Distance (d)",
    outputUnit: "m",
    keywords: ["stopping", "distance", "highway", "traffic", "sight distance", "reaction time", "braking", "friction", "slope"],
    variables: [
      { id: "v", label: "Vehicle Velocity (v)", symbol: "v", unit: "m / s", default: 27.78, min: 0.1, max: 200, step: 1, hint: "Design speed (100 km/h ≈ 27.78 m/s)" },
      { id: "t", label: "Perception-Reaction Time (t)", symbol: "t", unit: "s", default: 2.5, min: 0.1, max: 10, step: 0.1, hint: "AASHTO standard reaction time = 2.5 seconds" },
      { id: "f", label: "Friction Coefficient (f)", symbol: "f", unit: "ratio", default: 0.35, min: 0.05, max: 1.0, step: 0.01, hint: "Tire-pavement braking friction coefficient" },
      {
        id: "dir",
        label: "Roadway Gradient Profile",
        symbol: "Profile",
        type: "select",
        options: [
          { value: "flat", label: "Level Roadway (G = 0)" },
          { value: "up", label: "Uphill Grade (+G)" },
          { value: "down", label: "Downhill Grade (-G)" }
        ],
        default: "flat",
        hint: "Sign convention for gravitational deceleration assistance"
      },
      { id: "g_grade", label: "Grade Magnitude (G)", symbol: "G", unit: "decimal grade", default: 0.03, min: 0, max: 0.25, step: 0.01, hint: "Vertical slope (3% grade = 0.03)" }
    ],
    validate: (inputs) => {
      if (inputs.v <= 0) return "Velocity v must be positive.";
      if (inputs.t <= 0) return "Reaction time t must be positive.";
      if (inputs.f <= 0) return "Friction coefficient f must be positive.";
      const dir = inputs.dir || "flat";
      const G = dir === "flat" ? 0 : Number(inputs.g_grade);
      const effectiveF = dir === "down" ? Number(inputs.f) - G : Number(inputs.f) + G;
      if (effectiveF <= 0) return "Downhill grade cancels friction: vehicle cannot decelerate safely.";
      return null;
    },
    calculate: (inputs) => {
      const v = Number(inputs.v);
      const t = Number(inputs.t);
      const g = 9.80665;
      const f = Number(inputs.f);
      const dir = inputs.dir || "flat";
      const G = dir === "flat" ? 0 : (dir === "down" ? -Number(inputs.g_grade) : Number(inputs.g_grade));

      const dReaction = v * t;
      const dBraking = (v * v) / (2 * g * (f + G));
      const totalD = dReaction + dBraking;
      return {
        result: totalD,
        secondary: [
          { label: "Reaction Distance", value: formatNum(dReaction) + " m" },
          { label: "Braking Distance", value: formatNum(dBraking) + " m" },
          { label: "Speed in km/h", value: (v * 3.6).toFixed(1) + " km/h" }
        ],
        steps: [
          { title: "Stopping Distance Formulation", expr: "d = v \\cdot t + \\frac{v^2}{2 g (f \\pm G)}", note: "Standard AASHTO formulation combining perception lag and skid braking." },
          { title: "Perception-Reaction Distance", expr: `d_r = (${formatNum(v)}\\,\\text{m/s}) \\times (${formatNum(t)}\\,\\text{s}) = ${formatNum(dReaction)}\\text{ m}`, note: "Distance traveled before vehicle brakes engage." },
          { title: "Braking Distance Component", expr: `d_b = \\frac{(${formatNum(v)})^2}{2 \\times 9.81 \\times (${formatNum(f + G)})} = ${formatNum(dBraking)}\\text{ m}`, note: "Distance required to dissipate kinetic energy via friction." },
          { title: "Total Stopping Distance", expr: `d = ${formatNum(dReaction)} + ${formatNum(dBraking)} = \\mathbf{${formatNum(totalD)}\\,\\text{m}}`, note: "Minimum continuous visibility line required by highway design standards." }
        ],
        chart: {
          label: "Stopping Distance vs Speed (m)",
          xAxis: "Speed (km/h)",
          yAxis: "Distance (m)",
          labels: [40, 60, 80, 100, 120].map(s => `${s} km/h`),
          data: [40, 60, 80, 100, 120].map(s => {
            const vel = s / 3.6;
            return Number(((vel * t) + (vel * vel) / (2 * g * (f + G))).toFixed(1));
          })
        }
      };
    }
  },

  // ------------------------------------------------------------------------
  // CHEMICAL & MATERIALS ENGINEERING (6 Formulas)
  // ------------------------------------------------------------------------
  {
    id: "reynolds-number",
    title: "Reynolds Number",
    category: "chemical",
    categoryLabel: "Chemical & Materials",
    description: "Determines fluid dynamic flow regimes (laminar, transitional, or turbulent) based on the ratio of inertial to viscous forces.",
    latex: "Re = \\frac{\\rho \\cdot v \\cdot D}{\\mu}",
    outputLabel: "Reynolds Number (Re)",
    outputUnit: "dimensionless",
    keywords: ["reynolds", "fluid", "laminar", "turbulent", "viscosity", "density", "flow regime", "chemical"],
    variables: [
      { id: "rho", label: "Fluid Density (ρ)", symbol: "ρ", unit: "kg / m³", default: 998, min: 0.001, max: 1e5, step: 10, hint: "Mass density (Water at 20°C ≈ 998 kg/m³)" },
      { id: "v", label: "Flow Velocity (v)", symbol: "v", unit: "m / s", default: 1.2, min: 0.0001, max: 1000, step: 0.1, hint: "Mean fluid velocity in conduit" },
      { id: "d", label: "Hydraulic Diameter (D)", symbol: "D", unit: "m", default: 0.05, min: 0.0001, max: 50, step: 0.01, hint: "Internal conduit diameter (0.05 m = 50 mm)" },
      { id: "mu", label: "Dynamic Viscosity (μ)", symbol: "μ", unit: "Pa·s", default: 0.001002, min: 1e-8, max: 1e4, step: 0.0001, hint: "Fluid shear dynamic viscosity (Water ≈ 0.001002 Pa·s)" }
    ],
    validate: (inputs) => {
      if (inputs.rho <= 0) return "Density ρ must be positive.";
      if (inputs.v <= 0) return "Velocity v must be positive.";
      if (inputs.d <= 0) return "Diameter D must be positive.";
      if (inputs.mu <= 0) return "Viscosity μ must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const rho = Number(inputs.rho);
      const v = Number(inputs.v);
      const D = Number(inputs.d);
      const mu = Number(inputs.mu);
      const Re = (rho * v * D) / mu;

      let regime = "Laminar Flow (Re < 2,300)";
      if (Re >= 4000) regime = "Turbulent Flow (Re > 4,000)";
      else if (Re >= 2300) regime = "Transitional Flow (2,300 ≤ Re ≤ 4,000)";

      return {
        result: Re,
        secondary: [
          { label: "Flow Regime Classification", value: regime },
          { label: "Kinematic Viscosity (ν = μ/ρ)", value: formatNum(mu / rho) + " m²/s" }
        ],
        steps: [
          { title: "Reynolds Formulation", expr: "Re = \\frac{\\rho \\cdot v \\cdot D}{\\mu}", note: "Ratio of inertial forces to viscous forces in fluid shear flow." },
          { title: "Substitute Parameters", expr: `Re = \\frac{(${formatNum(rho)}\\,\\text{kg/m}^3) \\times (${formatNum(v)}\\,\\text{m/s}) \\times (${formatNum(D)}\\,\\text{m})}{${formatNum(mu)}\\,\\text{Pa}\\cdot\\text{s}}`, note: "Multiply density, conduit velocity, and diameter over viscosity." },
          { title: "Evaluate Reynolds Number", expr: `Re = \\mathbf{${formatNum(Re)}}`, note: "Governs boundary layer separation, pressure loss, and heat convection regimes." }
        ],
        diagram: (el) => {
          let activeRegime = "laminar";
          if (Re >= 4000) activeRegime = "turbulent";
          else if (Re >= 2300) activeRegime = "transitional";
          el.innerHTML = `
            <div class="regime-meter">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:600; font-size:0.85rem;">
                <span>Conduit Flow Regime</span>
                <span style="color:var(--accent-light); font-family:var(--font-mono);">${formatNum(Re)}</span>
              </div>
              <div class="meter-track">
                <div class="meter-segment laminar" style="opacity:${activeRegime === 'laminar' ? '1' : '0.3'}">Laminar (<2.3k)</div>
                <div class="meter-segment transitional" style="opacity:${activeRegime === 'transitional' ? '1' : '0.3'}">Transition</div>
                <div class="meter-segment turbulent" style="opacity:${activeRegime === 'turbulent' ? '1' : '0.3'}">Turbulent (>4k)</div>
              </div>
              <div class="meter-indicator-row">
                <span>0</span>
                <span>Re = 2,300</span>
                <span>Re = 4,000</span>
                <span>10,000+</span>
              </div>
            </div>
          `;
        }
      };
    }
  },
  {
    id: "ideal-gas-law",
    title: "Ideal Gas Law",
    category: "chemical",
    categoryLabel: "Chemical & Materials",
    description: "Calculates absolute thermodynamic pressure of a dilute gas enclosed within a vessel obeying the ideal equation of state.",
    latex: "P = \\frac{n \\cdot R \\cdot T}{V}",
    outputLabel: "Gas Pressure (P)",
    outputUnit: "Pa",
    keywords: ["ideal gas", "pressure", "temperature", "volume", "moles", "thermodynamics", "chemical"],
    variables: [
      { id: "n", label: "Amount of Gas (n)", symbol: "n", unit: "moles", default: 2.5, min: 0.0001, max: 1e8, step: 0.5, hint: "Number of gram-moles of gas" },
      { id: "t", label: "Absolute Temperature (T)", symbol: "T", unit: "Kelvin", default: 298.15, min: 0.01, max: 10000, step: 5, hint: "Temperature in Kelvin (298.15 K = 25 °C)" },
      { id: "v", label: "Vessel Volume (V)", symbol: "V", unit: "m³", default: 0.05, min: 0.00001, max: 1e6, step: 0.01, hint: "Container volume (0.05 m³ = 50 Liters)" }
    ],
    validate: (inputs) => {
      if (inputs.n <= 0) return "Mole quantity n must be positive.";
      if (inputs.t <= 0) return "Temperature T must be strictly positive Kelvin.";
      if (inputs.v <= 0) return "Volume V must be strictly positive.";
      return null;
    },
    calculate: (inputs) => {
      const n = Number(inputs.n);
      const T = Number(inputs.t);
      const V = Number(inputs.v);
      const R = 8.314462618;
      const P = (n * R * T) / V;
      return {
        result: P,
        secondary: [
          { label: "Pressure in kPa", value: formatNum(P / 1000) + " kPa" },
          { label: "Pressure in bar", value: formatNum(P / 1e5) + " bar" },
          { label: "Standard Atmospheres", value: formatNum(P / 101325) + " atm" }
        ],
        steps: [
          { title: "Ideal Gas Equation", expr: "P = \\frac{n \\cdot R \\cdot T}{V}, \\quad R = 8.31446\\,\\text{J/(mol}\\cdot\\text{K)}", note: "Standard ideal gas equation of state." },
          { title: "Substitute Parameters", expr: `P = \\frac{(${formatNum(n)}\\,\\text{mol}) \\times 8.3145 \\times (${formatNum(T)}\\,\\text{K})}{${formatNum(V)}\\,\\text{m}^3}`, note: "Product of molar quantity, universal gas constant, and absolute temperature." },
          { title: "Compute Static Pressure", expr: `P = \\mathbf{${formatNum(P)}\\,\\text{Pa}} = \\mathbf{${formatNum(P / 1e5)}\\,\\text{bar}}`, note: "Static pressure exerted against vessel interior boundary." }
        ]
      };
    }
  },
  {
    id: "arrhenius-equation",
    title: "Arrhenius Equation",
    category: "chemical",
    categoryLabel: "Chemical & Materials",
    description: "Calculates the temperature dependence of chemical reaction rate constants based on thermal activation energy.",
    latex: "k = A \\cdot e^{-\\frac{E_a}{R \\cdot T}}",
    outputLabel: "Reaction Rate Constant (k)",
    outputUnit: "rate constant",
    keywords: ["arrhenius", "kinetics", "activation energy", "reaction rate", "temperature", "catalysis"],
    variables: [
      { id: "a", label: "Pre-Exponential Factor (A)", symbol: "A", unit: "1 / s", default: 1e13, min: 0.001, max: 1e20, step: 1e12, hint: "Collision frequency factor per second" },
      { id: "ea", label: "Activation Energy (Ea)", symbol: "E_a", unit: "J / mol", default: 75000, min: 0.1, max: 1e8, step: 1000, hint: "Energy barrier (75 kJ/mol = 75,000 J/mol)" },
      { id: "t", label: "Reaction Temperature (T)", symbol: "T", unit: "Kelvin", default: 310.15, min: 0.1, max: 10000, step: 5, hint: "Temperature in Kelvin (310.15 K = 37 °C)" }
    ],
    validate: (inputs) => {
      if (inputs.a <= 0) return "Pre-exponential factor A must be positive.";
      if (inputs.ea <= 0) return "Activation energy Ea must be positive.";
      if (inputs.t <= 0) return "Temperature T must be strictly positive Kelvin.";
      return null;
    },
    calculate: (inputs) => {
      const A = Number(inputs.a);
      const Ea = Number(inputs.ea);
      const T = Number(inputs.t);
      const R = 8.314462618;
      const exponent = -Ea / (R * T);
      const k = A * Math.exp(exponent);
      return {
        result: k,
        secondary: [
          { label: "Boltzmann Term e^(-Ea/RT)", value: formatNum(Math.exp(exponent)) },
          { label: "Thermal Energy (RT)", value: formatNum(R * T) + " J/mol" }
        ],
        steps: [
          { title: "Arrhenius Reaction Law", expr: "k = A \\cdot e^{-\\frac{E_a}{R T}}", note: "Relates kinetic reaction velocity to thermal molecular excitation." },
          { title: "Compute Exponent Factor", expr: `-\\frac{E_a}{R T} = -\\frac{${formatNum(Ea)}}{8.3145 \\times ${formatNum(T)}} = ${formatNum(exponent)}`, note: "Fraction of molecular collisions having kinetic energy exceeding barrier Ea." },
          { title: "Rate Constant Result", expr: `k = (${formatNum(A)}) \\times (${formatNum(Math.exp(exponent))}) = \\mathbf{${formatNum(k)}}`, note: "Effective rate constant governing reaction speed." }
        ]
      };
    }
  },
  {
    id: "fouriers-law-conduction",
    title: "Fourier's Law of Heat Conduction",
    category: "chemical",
    categoryLabel: "Chemical & Materials",
    description: "Calculates the rate of thermal energy conduction across a solid material slab subjected to a temperature gradient.",
    latex: "q = -k \\cdot A \\cdot \\frac{\\Delta T}{\\Delta x}",
    outputLabel: "Heat Transfer Rate (q)",
    outputUnit: "W",
    keywords: ["fourier", "heat transfer", "conduction", "thermal conductivity", "gradient", "watts"],
    variables: [
      { id: "k", label: "Thermal Conductivity (k)", symbol: "k", unit: "W / (m·K)", default: 0.8, min: 0.001, max: 1e5, step: 0.1, hint: "Conductivity (Glass/Brick ≈ 0.8 W/(m·K))" },
      { id: "a", label: "Conduction Area (A)", symbol: "A", unit: "m²", default: 15, min: 0.01, max: 1e6, step: 1, hint: "Cross-sectional surface area normal to flow" },
      { id: "dt", label: "Temperature Drop (ΔT)", symbol: "ΔT", unit: "K or °C", default: -30, min: -2000, max: 2000, step: 2, hint: "Temperature gradient (T_cold - T_hot; negative in direction of flow)" },
      { id: "dx", label: "Slab Thickness (Δx)", symbol: "Δx", unit: "m", default: 0.12, min: 0.0001, max: 100, step: 0.01, hint: "Conduction barrier thickness (0.12 m = 12 cm)" }
    ],
    validate: (inputs) => {
      if (inputs.k <= 0) return "Thermal conductivity k must be positive.";
      if (inputs.a <= 0) return "Area A must be positive.";
      if (inputs.dx <= 0) return "Thickness Δx must be positive.";
      return null;
    },
    calculate: (inputs) => {
      const k = Number(inputs.k);
      const A = Number(inputs.a);
      const dt = Number(inputs.dt);
      const dx = Number(inputs.dx);
      const q = - (k * A * (dt / dx));
      return {
        result: q,
        secondary: [
          { label: "Heat Flux (q'' = q/A)", value: formatNum(q / A) + " W/m²" },
          { label: "Thermal Resistance (Rth)", value: formatNum(dx / (k * A)) + " K/W" }
        ],
        steps: [
          { title: "Fourier's Conduction Law", expr: "q = -k \\cdot A \\cdot \\frac{\\Delta T}{\\Delta x}", note: "The negative sign guarantees that heat flows spontaneously down the temperature gradient from hot to cold." },
          { title: "Evaluate Temperature Gradient", expr: `\\frac{\\Delta T}{\\Delta x} = \\frac{${formatNum(dt)}\\,\\text{K}}{${formatNum(dx)}\\,\\text{m}} = ${formatNum(dt / dx)}\\text{ K/m}`, note: "Rate of temperature change per unit distance." },
          { title: "Net Heat Transfer Rate", expr: `q = -(${formatNum(k)}) \\times (${formatNum(A)}) \\times (${formatNum(dt / dx)}) = \\mathbf{${formatNum(q)}\\,\\text{W}}`, note: "Continuous thermal wattage traversing the slab cross-section." }
        ]
      };
    }
  },
  {
    id: "fenske-equation",
    title: "Fenske Equation",
    category: "chemical",
    categoryLabel: "Chemical & Materials",
    description: "Calculates the minimum theoretical equilibrium stages (trays) required in a fractional distillation column operating at total reflux.",
    latex: "N_{min} = \\frac{\\ln\\left(\\frac{x_D / (1 - x_D)}{x_B / (1 - x_B)}\\right)}{\\ln(\\alpha_{avg})}",
    outputLabel: "Minimum Stages (N_min)",
    outputUnit: "equilibrium stages",
    keywords: ["fenske", "distillation", "stages", "reflux", "volatility", "chemical", "separation"],
    variables: [
      { id: "xd", label: "Distillate Light Fraction (xD)", symbol: "x_D", unit: "fraction [0 - 1]", default: 0.95, min: 0.001, max: 0.999, step: 0.01, hint: "Purity of light key in top distillate product" },
      { id: "xb", label: "Bottoms Light Fraction (xB)", symbol: "x_B", unit: "fraction [0 - 1]", default: 0.05, min: 0.001, max: 0.999, step: 0.01, hint: "Light key remaining in bottoms product" },
      { id: "alpha", label: "Relative Volatility (αavg)", symbol: "α_avg", unit: "ratio (> 1.0)", default: 2.4, min: 1.001, max: 100, step: 0.1, hint: "Average vapor-liquid equilibrium relative volatility" }
    ],
    validate: (inputs) => {
      const xD = Number(inputs.xd);
      const xB = Number(inputs.xb);
      const alpha = Number(inputs.alpha);
      if (xD <= 0 || xD >= 1) return "Distillate fraction xD must satisfy 0 < xD < 1.";
      if (xB <= 0 || xB >= 1) return "Bottoms fraction xB must satisfy 0 < xB < 1.";
      if (xD <= xB) return "Distillate purity xD must be strictly greater than bottoms fraction xB.";
      if (alpha <= 1) return "Relative volatility αavg must be strictly greater than 1.0.";
      return null;
    },
    calculate: (inputs) => {
      const xD = Number(inputs.xd);
      const xB = Number(inputs.xb);
      const alpha = Number(inputs.alpha);
      const topRatio = xD / (1 - xD);
      const botRatio = xB / (1 - xB);
      const sep = topRatio / botRatio;
      const Nmin = Math.log(sep) / Math.log(alpha);
      return {
        result: Nmin,
        secondary: [
          { label: "Minimum Trays (Excl. Reboiler)", value: formatNum(Nmin - 1) },
          { label: "Overall Separation Factor", value: formatNum(sep) },
          { label: "Top Product Ratio", value: formatNum(topRatio) }
        ],
        steps: [
          { title: "Fenske Minimum Stages Law", expr: "N_{min} = \\frac{\\ln\\left(\\frac{x_D / (1 - x_D)}{x_B / (1 - x_B)}\\right)}{\\ln(\\alpha_{avg})}", note: "Determines absolute lower limit of distillation stages under total reflux." },
          { title: "Evaluate Separation Term", expr: `\\text{Sep} = \\frac{${formatNum(topRatio)}}{${formatNum(botRatio)}} = ${formatNum(sep)}`, note: "Ratio of light to heavy key in distillate versus bottoms." },
          { title: "Compute Minimum Trays", expr: `N_{min} = \\frac{\\ln(${formatNum(sep)})}{\\ln(${formatNum(alpha)})} = \\mathbf{${formatNum(Nmin)} \\text{ stages}}`, note: "Includes equilibrium contact trays plus partial reboiler." }
        ]
      };
    }
  },
  {
    id: "braggs-law",
    title: "Bragg's Law",
    category: "chemical",
    categoryLabel: "Chemical & Materials",
    description: "Calculates the constructive interference wavelength for X-ray diffraction passing through a crystal lattice.",
    latex: "\\lambda = \\frac{2 \\cdot d \\cdot \\sin(\\theta)}{n}",
    outputLabel: "Wavelength (λ)",
    outputUnit: "m",
    keywords: ["bragg", "x-ray", "diffraction", "crystal", "lattice", "wavelength", "materials"],
    variables: [
      { id: "d", label: "Interplanar Spacing (d)", symbol: "d", unit: "m", default: 2.82e-10, min: 1e-15, max: 1e-6, step: 1e-11, hint: "Lattice spacing (NaCl ≈ 2.82 Å = 2.82e-10 m)" },
      { id: "theta", label: "Glancing Angle (θ)", symbol: "θ", unit: "degrees [°]", default: 20, min: 0.01, max: 89.99, step: 0.5, hint: "Diffraction angle between beam and atomic plane" },
      { id: "n", label: "Diffraction Order (n)", symbol: "n", unit: "integer", default: 1, min: 1, max: 20, step: 1, hint: "Positive harmonic diffraction order" }
    ],
    validate: (inputs) => {
      const d = Number(inputs.d);
      const theta = Number(inputs.theta);
      const n = Number(inputs.n);
      if (d <= 0) return "Lattice spacing d must be positive.";
      if (theta <= 0 || theta >= 90) return "Glancing angle θ must be between 0° and 90° non-inclusive.";
      if (n < 1 || !Number.isInteger(n)) return "Diffraction order n must be a positive integer (1, 2, ...).";
      return null;
    },
    calculate: (inputs) => {
      const d = Number(inputs.d);
      const thetaDeg = Number(inputs.theta);
      const n = Number(inputs.n);
      const thetaRad = thetaDeg * (Math.PI / 180);
      const lambda = (2 * d * Math.sin(thetaRad)) / n;
      return {
        result: lambda,
        secondary: [
          { label: "Wavelength in Ångströms", value: formatNum(lambda * 1e10) + " Å" },
          { label: "Wavelength in Nanometers", value: formatNum(lambda * 1e9) + " nm" },
          { label: "Path Difference (2d sin θ)", value: formatNum(2 * d * Math.sin(thetaRad) * 1e10) + " Å" }
        ],
        steps: [
          { title: "Bragg's Diffraction Condition", expr: "n \\lambda = 2 d \\sin(\\theta) \\implies \\lambda = \\frac{2 d \\sin(\\theta)}{n}", note: "Condition for constructive interference between scattered atomic plane rays." },
          { title: "Angle Conversion", expr: `\\theta = ${formatNum(thetaDeg)}^\\circ = ${formatNum(thetaRad)}\\text{ rad} \\implies \\sin(\\theta) = ${formatNum(Math.sin(thetaRad))}`, note: "Convert user degrees into computational radians." },
          { title: "Diffraction Wavelength", expr: `\\lambda = \\frac{2 \\times (${formatNum(d)}) \\times ${formatNum(Math.sin(thetaRad))}}{${n}} = \\mathbf{${formatNum(lambda)}\\,\\text{m}} = \\mathbf{${formatNum(lambda * 1e10)}\\,\\text{\\AA}}`, note: "Radiation wavelength satisfying the Bragg constructive condition." }
        ],
        chart: {
          label: "Wavelength vs Angle (Å)",
          xAxis: "Angle (°)",
          yAxis: "λ (Å)",
          labels: [10, 20, 30, 40, 50, 60, 70].map(deg => `${deg}°`),
          data: [10, 20, 30, 40, 50, 60, 70].map(deg => {
            const rad = deg * (Math.PI / 180);
            return Number(((2 * d * Math.sin(rad) / n) * 1e10).toFixed(3));
          })
        }
      };
    }
  }
];

// ==========================================================================
// 2. STATE MANAGEMENT & DOM REFERENCES
// ==========================================================================
const state = {
  currentCategory: "all",
  searchQuery: "",
  activeFormulaId: null,
  theme: localStorage.getItem("bm-theme") || "dark",
  chartInstance: null
};

const dom = {
  themeToggle: document.getElementById("themeToggleBtn"),
  signInBtn: document.getElementById("signInBtn"),
  infoModal: document.getElementById("infoModal"),
  modalCloseBtn: document.getElementById("modalCloseBtn"),
  modalAcknowledgeBtn: document.getElementById("modalAcknowledgeBtn"),
  mobileNavToggle: document.getElementById("mobileNavToggle"),
  sidebar: document.getElementById("appSidebar"),
  sidebarNav: document.getElementById("sidebarCategoryNav"),
  globalSearch: document.getElementById("globalSearchInput"),
  searchClear: document.getElementById("searchClearBtn"),
  brandHomeLink: document.getElementById("brandHomeLink"),
  categoryChips: document.getElementById("categoryChips"),
  formulaGrid: document.getElementById("formulaCardsGrid"),
  emptyState: document.getElementById("emptyState"),
  resetSearchBtn: document.getElementById("resetSearchFilterBtn"),
  galleryHeading: document.getElementById("galleryHeading"),
  gallerySubheading: document.getElementById("gallerySubheading"),
  formulaMatchCount: document.getElementById("formulaMatchCount"),
  galleryView: document.getElementById("galleryView"),
  workspaceView: document.getElementById("workspaceView"),
  breadcrumbRoot: document.getElementById("breadcrumbRoot"),
  breadcrumbCategory: document.getElementById("breadcrumbCategory"),
  breadcrumbTitle: document.getElementById("breadcrumbTitle"),
  btnBackToGallery: document.getElementById("btnBackToGallery"),
  workspaceCategoryBadge: document.getElementById("workspaceCategoryBadge"),
  workspaceFormulaTitle: document.getElementById("workspaceFormulaTitle"),
  workspaceDescription: document.getElementById("workspaceDescription"),
  workspaceLatexDisplay: document.getElementById("workspaceLatexDisplay"),
  inputsContainer: document.getElementById("inputsContainer"),
  calculatorForm: document.getElementById("calculatorForm"),
  validationAlert: document.getElementById("validationAlert"),
  btnResetDefaults: document.getElementById("btnResetDefaults"),
  btnCopyLatex: document.getElementById("btnCopyLatex"),
  btnCopyResult: document.getElementById("btnCopyResult"),
  outputHeroLabel: document.getElementById("outputHeroLabel"),
  outputHeroValue: document.getElementById("outputHeroValue"),
  outputHeroUnit: document.getElementById("outputHeroUnit"),
  secondaryMetricsGrid: document.getElementById("secondaryMetricsGrid"),
  stepsContainer: document.getElementById("stepsContainer"),
  visualizationSection: document.getElementById("visualizationSection"),
  visualizationTitle: document.getElementById("visualizationTitle"),
  chartContainer: document.getElementById("chartCanvasContainer"),
  chartCanvas: document.getElementById("formulaChart"),
  diagramContainer: document.getElementById("diagramContainer")
};

// ==========================================================================
// 3. NUMBER FORMATTING & MATH UTILITIES
// ==========================================================================
function formatNum(value, sigDigits = 5) {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (isNaN(num)) return "NaN";
  if (!isFinite(num)) return num > 0 ? "∞" : "-∞";
  if (num === 0) return "0";

  const abs = Math.abs(num);
  if (abs >= 1e7 || (abs < 1e-4 && abs > 0)) {
    return num.toExponential(sigDigits - 1);
  }
  return Number(num.toPrecision(sigDigits)).toString();
}

function renderMath(element, latexString, displayMode = true) {
  if (!element) return;
  if (window.katex && typeof window.katex.render === "function") {
    try {
      window.katex.render(latexString, element, {
        displayMode: displayMode,
        throwOnError: false
      });
      return;
    } catch (e) {
      console.warn("KaTeX render error:", e);
    }
  }
  // Fallback if KaTeX fails to load or error occurs
  element.textContent = latexString;
}

// ==========================================================================
// 4. CHART & VISUALIZATION ENGINE
// ==========================================================================
function destroyChart() {
  if (state.chartInstance) {
    state.chartInstance.destroy();
    state.chartInstance = null;
  }
}

function renderVisualization(formula, inputs, calcOutput) {
  destroyChart();
  dom.diagramContainer.classList.add("hidden");
  dom.diagramContainer.innerHTML = "";

  if (calcOutput.chart && window.Chart) {
    dom.visualizationSection.classList.remove("hidden");
    dom.chartContainer.classList.remove("hidden");
    dom.visualizationTitle.textContent = calcOutput.chart.label || "Parameter Visualization";

    const isDark = state.theme === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
    const textColor = isDark ? "#94a3b8" : "#475569";

    const ctx = dom.chartCanvas.getContext("2d");
    state.chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: calcOutput.chart.labels,
        datasets: [{
          label: calcOutput.chart.label,
          data: calcOutput.chart.data,
          borderColor: "#3b82f6",
          backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(37, 99, 235, 0.08)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "#3b82f6"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            titleColor: isDark ? "#f1f5f9" : "#0f172a",
            bodyColor: isDark ? "#cbd5e1" : "#334155",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            borderWidth: 1
          }
        },
        scales: {
          x: {
            title: { display: !!calcOutput.chart.xAxis, text: calcOutput.chart.xAxis, color: textColor },
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          y: {
            title: { display: !!calcOutput.chart.yAxis, text: calcOutput.chart.yAxis, color: textColor },
            grid: { color: gridColor },
            ticks: { color: textColor }
          }
        }
      }
    });
  } else if (calcOutput.diagram) {
    dom.visualizationSection.classList.remove("hidden");
    dom.chartContainer.classList.add("hidden");
    dom.diagramContainer.classList.remove("hidden");
    dom.visualizationTitle.textContent = "Technical Flow Classification";
    calcOutput.diagram(dom.diagramContainer);
  } else {
    dom.visualizationSection.classList.add("hidden");
  }
}

// ==========================================================================
// 5. GALLERY & CARDS RENDERING
// ==========================================================================
function getCategoryCount(catId) {
  if (catId === "all") return FORMULAS.length;
  return FORMULAS.filter(f => f.category === catId).length;
}

function renderSidebarNavigation() {
  dom.sidebarNav.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `nav-item-btn ${state.currentCategory === cat.id ? "active" : ""}`;
    btn.dataset.category = cat.id;

    const count = getCategoryCount(cat.id);
    btn.innerHTML = `
      <span>${cat.label}</span>
      <span class="nav-count-badge">${count}</span>
    `;

    btn.addEventListener("click", () => {
      setCategoryFilter(cat.id);
      dom.sidebar.classList.remove("open");
    });
    dom.sidebarNav.appendChild(btn);
  });
}

function renderCategoryChips() {
  dom.categoryChips.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `chip-btn ${state.currentCategory === cat.id ? "active" : ""}`;
    btn.textContent = `${cat.label} (${getCategoryCount(cat.id)})`;
    btn.addEventListener("click", () => setCategoryFilter(cat.id));
    dom.categoryChips.appendChild(btn);
  });
}

function filterFormulas() {
  const query = state.searchQuery.trim().toLowerCase();
  return FORMULAS.filter(formula => {
    const matchesCat = state.currentCategory === "all" || formula.category === state.currentCategory;
    if (!matchesCat) return false;
    if (!query) return true;

    const inTitle = formula.title.toLowerCase().includes(query);
    const inDesc = formula.description.toLowerCase().includes(query);
    const inCat = formula.categoryLabel.toLowerCase().includes(query);
    const inKw = formula.keywords.some(k => k.toLowerCase().includes(query));
    const inVars = formula.variables.some(v => v.label.toLowerCase().includes(query) || v.symbol.toLowerCase().includes(query));

    return inTitle || inDesc || inCat || inKw || inVars;
  });
}

function renderGalleryCards() {
  const matched = filterFormulas();
  dom.formulaGrid.innerHTML = "";
  dom.formulaMatchCount.textContent = `${matched.length} formulas`;

  if (matched.length === 0) {
    dom.formulaGrid.classList.add("hidden");
    dom.emptyState.classList.remove("hidden");
    return;
  }

  dom.formulaGrid.classList.remove("hidden");
  dom.emptyState.classList.add("hidden");

  matched.forEach(formula => {
    const card = document.createElement("div");
    card.className = "formula-card";

    const varsSummary = formula.variables.map(v => `${v.symbol} (${v.unit})`).join(" • ");

    card.innerHTML = `
      <div>
        <span class="card-category-badge">${formula.categoryLabel}</span>
        <h3 class="card-title">${formula.title}</h3>
        <div class="card-latex-container" id="latex-card-${formula.id}"></div>
        <p class="card-desc">${formula.description}</p>
        <div class="card-vars-summary">${varsSummary}</div>
      </div>
      <div class="card-footer">
        <button class="action-btn primary-btn btn-open-calc" data-id="${formula.id}">
          Open Calculator
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;

    dom.formulaGrid.appendChild(card);
    const mathBox = card.querySelector(`#latex-card-${formula.id}`);
    renderMath(mathBox, formula.latex, true);

    card.querySelector(".btn-open-calc").addEventListener("click", () => {
      navigateToFormula(formula.id);
    });
  });
}

function setCategoryFilter(categoryId) {
  state.currentCategory = categoryId;
  const currentCatObj = CATEGORIES.find(c => c.id === categoryId);
  dom.galleryHeading.textContent = currentCatObj ? currentCatObj.label : "Formulas";
  renderSidebarNavigation();
  renderCategoryChips();
  renderGalleryCards();
}

// ==========================================================================
// 6. FORMULA WORKSPACE & REAL-TIME CALCULATION
// ==========================================================================
function getFormulaInputs() {
  const inputs = {};
  const currentFormula = FORMULAS.find(f => f.id === state.activeFormulaId);
  if (!currentFormula) return inputs;

  currentFormula.variables.forEach(v => {
    const el = document.getElementById(`input-${v.id}`);
    if (el) inputs[v.id] = el.value;
  });
  return inputs;
}

function setFormulaInputs(defaults) {
  Object.keys(defaults).forEach(key => {
    const el = document.getElementById(`input-${key}`);
    if (el) el.value = defaults[key];
  });
}

function executeCalculation() {
  const formula = FORMULAS.find(f => f.id === state.activeFormulaId);
  if (!formula) return;

  const inputs = getFormulaInputs();

  // Validate
  const validationError = formula.validate ? formula.validate(inputs) : null;
  if (validationError) {
    dom.validationAlert.textContent = `Input Error: ${validationError}`;
    dom.validationAlert.classList.remove("hidden");
    dom.outputHeroValue.textContent = "—";
    dom.secondaryMetricsGrid.innerHTML = "";
    dom.stepsContainer.innerHTML = `<div class="step-item" style="color:var(--danger)">Please fix input parameters above to calculate.</div>`;
    destroyChart();
    return;
  }

  dom.validationAlert.classList.add("hidden");

  // Calculate
  try {
    const output = formula.calculate(inputs);

    // Primary result
    dom.outputHeroLabel.textContent = formula.outputLabel || "Result";
    dom.outputHeroValue.textContent = formatNum(output.result);
    dom.outputHeroUnit.textContent = formula.outputUnit || "";

    // Secondary metrics
    dom.secondaryMetricsGrid.innerHTML = "";
    if (output.secondary && output.secondary.length > 0) {
      output.secondary.forEach(sec => {
        const item = document.createElement("div");
        item.className = "secondary-metric-card";
        item.innerHTML = `
          <span class="sec-label">${sec.label}</span>
          <span class="sec-val">${sec.value}</span>
        `;
        dom.secondaryMetricsGrid.appendChild(item);
      });
    }

    // Steps
    dom.stepsContainer.innerHTML = "";
    if (output.steps && output.steps.length > 0) {
      output.steps.forEach((step, idx) => {
        const stepEl = document.createElement("div");
        stepEl.className = "step-item";
        stepEl.innerHTML = `
          <div class="step-num-title">
            <span>Step ${idx + 1}: ${step.title}</span>
          </div>
          <div class="step-math" id="step-math-${idx}"></div>
          ${step.note ? `<div class="step-note">${step.note}</div>` : ""}
        `;
        dom.stepsContainer.appendChild(stepEl);
        renderMath(stepEl.querySelector(`#step-math-${idx}`), step.expr, false);
      });
    }

    // Visualization
    renderVisualization(formula, inputs, output);

  } catch (err) {
    console.error("Calculation Error:", err);
    dom.validationAlert.textContent = `Calculation failed: ${err.message}`;
    dom.validationAlert.classList.remove("hidden");
  }
}

function buildWorkspaceInputs(formula) {
  dom.inputsContainer.innerHTML = "";
  formula.variables.forEach(v => {
    const group = document.createElement("div");
    group.className = "input-field-group";

    if (v.type === "select") {
      group.innerHTML = `
        <div class="input-label-row">
          <label class="field-label" for="input-${v.id}">${v.label}</label>
          <span class="field-symbol-tag">${v.symbol}</span>
        </div>
        <div class="input-control-wrap">
          <select id="input-${v.id}">
            ${v.options.map(opt => `<option value="${opt.value}" ${opt.value === v.default ? "selected" : ""}>${opt.label}</option>`).join("")}
          </select>
        </div>
        ${v.hint ? `<span class="field-hint">${v.hint}</span>` : ""}
      `;
    } else {
      group.innerHTML = `
        <div class="input-label-row">
          <label class="field-label" for="input-${v.id}">${v.label}</label>
          <span class="field-symbol-tag">${v.symbol}</span>
        </div>
        <div class="input-control-wrap">
          <input 
            type="number" 
            id="input-${v.id}" 
            value="${v.default}" 
            step="${v.step || 'any'}"
            ${v.min !== undefined ? `min="${v.min}"` : ""}
            ${v.max !== undefined ? `max="${v.max}"` : ""}
          >
          ${v.unit ? `<span class="unit-addon">${v.unit}</span>` : ""}
        </div>
        ${v.hint ? `<span class="field-hint">${v.hint}</span>` : ""}
      `;
    }

    dom.inputsContainer.appendChild(group);

    const inputControl = group.querySelector(`#input-${v.id}`);
    inputControl.addEventListener("input", executeCalculation);
    inputControl.addEventListener("change", executeCalculation);
  });
}

function openFormulaWorkspace(formulaId) {
  const formula = FORMULAS.find(f => f.id === formulaId);
  if (!formula) {
    showGalleryView();
    return;
  }

  state.activeFormulaId = formula.id;

  // Update Breadcrumbs
  dom.breadcrumbCategory.textContent = formula.categoryLabel;
  dom.breadcrumbTitle.textContent = formula.title;

  // Hero section
  dom.workspaceCategoryBadge.textContent = formula.categoryLabel;
  dom.workspaceFormulaTitle.textContent = formula.title;
  dom.workspaceDescription.textContent = formula.description;
  renderMath(dom.workspaceLatexDisplay, formula.latex, true);

  // Build inputs & calculate initial
  buildWorkspaceInputs(formula);
  executeCalculation();

  // Swap views
  dom.galleryView.classList.add("hidden");
  dom.workspaceView.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showGalleryView() {
  state.activeFormulaId = null;
  destroyChart();
  dom.workspaceView.classList.add("hidden");
  dom.galleryView.classList.remove("hidden");
  renderGalleryCards();
}

function navigateToFormula(formulaId) {
  window.location.hash = `#formula/${formulaId}`;
}

// ==========================================================================
// 7. ROUTING & HASH NAVIGATION
// ==========================================================================
function handleRouting() {
  const hash = window.location.hash || "#gallery";
  if (hash.startsWith("#formula/")) {
    const formulaId = hash.replace("#formula/", "").trim();
    openFormulaWorkspace(formulaId);
  } else {
    showGalleryView();
  }
}

// ==========================================================================
// 8. CLIPBOARD & ACTION UTILITIES
// ==========================================================================
async function copyToClipboard(text, buttonEl, successMsg) {
  const originalText = buttonEl.textContent;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    buttonEl.textContent = successMsg;
    setTimeout(() => { buttonEl.textContent = originalText; }, 1800);
  } catch (err) {
    console.warn("Clipboard copy failed:", err);
    buttonEl.textContent = "Failed";
    setTimeout(() => { buttonEl.textContent = originalText; }, 1800);
  }
}

// ==========================================================================
// 9. THEME MANAGEMENT
// ==========================================================================
function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("bm-theme", theme);

  if (state.activeFormulaId) {
    executeCalculation(); // Refresh chart with new theme colors
  }
}

function toggleTheme() {
  const nextTheme = state.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
}

// ==========================================================================
// 10. EVENT LISTENERS & INITIALIZATION
// ==========================================================================
function attachEventListeners() {
  // Theme Toggle
  dom.themeToggle.addEventListener("click", toggleTheme);

  // Search
  dom.globalSearch.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    dom.searchClear.classList.toggle("visible", state.searchQuery.length > 0);
    if (!dom.workspaceView.classList.contains("hidden")) {
      showGalleryView();
    }
    renderGalleryCards();
  });

  dom.searchClear.addEventListener("click", () => {
    dom.globalSearch.value = "";
    state.searchQuery = "";
    dom.searchClear.classList.remove("visible");
    renderGalleryCards();
  });

  dom.resetSearchBtn.addEventListener("click", () => {
    dom.globalSearch.value = "";
    state.searchQuery = "";
    dom.searchClear.classList.remove("visible");
    setCategoryFilter("all");
  });

  // Mobile Drawer Navigation
  dom.mobileNavToggle.addEventListener("click", () => {
    dom.sidebar.classList.toggle("open");
  });

  // Sign In Informational Modal
  dom.signInBtn.addEventListener("click", () => dom.infoModal.classList.remove("hidden"));
  dom.modalCloseBtn.addEventListener("click", () => dom.infoModal.classList.add("hidden"));
  dom.modalAcknowledgeBtn.addEventListener("click", () => dom.infoModal.classList.add("hidden"));
  dom.infoModal.addEventListener("click", (e) => {
    if (e.target === dom.infoModal) dom.infoModal.classList.add("hidden");
  });

  // Workspace Actions
  dom.btnBackToGallery.addEventListener("click", () => {
    window.location.hash = "#gallery";
  });
  dom.breadcrumbRoot.addEventListener("click", () => {
    window.location.hash = "#gallery";
  });
  dom.brandHomeLink.addEventListener("click", () => {
    window.location.hash = "#gallery";
  });

  dom.btnResetDefaults.addEventListener("click", () => {
    const formula = FORMULAS.find(f => f.id === state.activeFormulaId);
    if (!formula) return;
    const defaults = {};
    formula.variables.forEach(v => { defaults[v.id] = v.default; });
    setFormulaInputs(defaults);
    executeCalculation();
  });

  dom.btnCopyLatex.addEventListener("click", () => {
    const formula = FORMULAS.find(f => f.id === state.activeFormulaId);
    if (formula) copyToClipboard(formula.latex, dom.btnCopyLatex, "Copied LaTeX!");
  });

  dom.btnCopyResult.addEventListener("click", () => {
    const val = dom.outputHeroValue.textContent;
    const unit = dom.outputHeroUnit.textContent;
    copyToClipboard(`${val} ${unit}`.trim(), dom.btnCopyResult, "Copied Answer!");
  });

  // Routing Listener
  window.addEventListener("hashchange", handleRouting);
}

// Bootstrap Application
function init() {
  setTheme(state.theme);
  renderSidebarNavigation();
  renderCategoryChips();
  attachEventListeners();
  handleRouting();
}

// Initialize when DOM content is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}