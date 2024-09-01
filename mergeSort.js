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
  const moves = mergeSort(copy);
  animate(moves);
}

function animate(moves) {
  if (moves.length == 0) {
    showBars();
    return;
  }
  const move = moves.shift();
  const [left, right] = move.indices;

  if (move.type === "overwrite") {
    array[left] = move.value;
  }

  // linear interpolation
  playNote(200 + array[left] * 500); // for the left bar
  playNote(200 + array[right] * 500); // for the right bar
  showBars(move);
  setTimeout(function () {
    animate(moves);
  }, 50);
}

function mergeSort(array) {
  const moves = [];
  const aux = array.slice();
  divideAndMerge(array, aux, 0, array.length - 1, moves);
  return moves;
}

function divideAndMerge(array, aux, low, high, moves) {
  if (low >= high) return;
  const mid = Math.floor((low + high) / 2);
  divideAndMerge(aux, array, low, mid, moves);
  divideAndMerge(aux, array, mid + 1, high, moves);
  merge(array, aux, low, mid, high, moves);
}

function merge(array, aux, low, mid, high, moves) {
  let i = low;
  let j = mid + 1;
  for (let k = low; k <= high; k++) {
    if (i > mid) {
      moves.push({
        indices: [k, j],
        type: "overwrite",
        value: aux[j],
      });
      array[k] = aux[j++];
    } else if (j > high) {
      moves.push({
        indices: [k, i],
        type: "overwrite",
        value: aux[i],
      });
      array[k] = aux[i++];
    } else if (aux[j] < aux[i]) {
      moves.push({
        indices: [k, j],
        type: "overwrite",
        value: aux[j],
      });
      array[k] = aux[j++];
    } else {
      moves.push({
        indices: [k, i],
        type: "overwrite",
        value: aux[i],
      });
      array[k] = aux[i++];
    }
  }
}

function showBars(move) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "overwrite" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}
