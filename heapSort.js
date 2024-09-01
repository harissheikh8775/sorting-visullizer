const n = 20;
const array = [];

init();
// web audio API
let audioContxt = null;

function playNote(freq) {
  if (audioContxt == null) {
    audioContxt = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }
  const duration = 0.1;
  const oscillator = audioContxt.createOscillator();
  oscillator.frequency.value = freq;
  oscillator.start();
  oscillator.stop(audioContxt.currentTime + duration);
  const node = audioContxt.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioContxt.currentTime + duration);
  oscillator.connect(node);
  node.connect(audioContxt.destination);
}

function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();
}

function play() {
  const copy = [...array];
  const moves = heapSort(copy);
  animate(moves);
}

function animate(moves) {
  if (moves.length === 0) {
    showBars();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;

  if (move.type === "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }

  // linear interpolation
  playNote(200 + array[i] * 500); // for the ith bar
  playNote(200 + array[j] * 500); // for the jth bar
  showBars(move);
  setTimeout(function () {
    animate(moves);
  }, 50);
}

function heapSort(array) {
  const moves = [];
  buildMaxHeap(array, moves);
  for (let i = array.length - 1; i > 0; i--) {
    moves.push({
      indices: [0, i],
      type: "swap",
    });
    [array[0], array[i]] = [array[i], array[0]];
    heapify(array, 0, i, moves);
  }
  return moves;
}

function buildMaxHeap(array, moves) {
  const startIdx = Math.floor(array.length / 2) - 1;
  for (let i = startIdx; i >= 0; i--) {
    heapify(array, i, array.length, moves);
  }
}

function heapify(array, idx, max, moves) {
  let largest = idx;
  const left = 2 * idx + 1;
  const right = 2 * idx + 2;

  if (left < max && array[left] > array[largest]) {
    largest = left;
  }

  if (right < max && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== idx) {
    moves.push({
      indices: [idx, largest],
      type: "swap",
    });
    [array[idx], array[largest]] = [array[largest], array[idx]];
    heapify(array, largest, max, moves);
  }
}

function showBars(move) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}
