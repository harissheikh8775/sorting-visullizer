const n = 20;
const array = [];

init();
//web audio API
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
  const moves = insertionSort(copy);
  animate(moves);
}

function animate(moves) {
  if (moves.length == 0) {
    showBars();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;

  if (move.type == "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }
  //linear interpolation
  playNote(200 + array[i] * 500); // for the ith bar
  playNote(200 + array[j] * 500); // for the jth bar
  showBars(move);
  setTimeout(function () {
    animate(moves);
  }, 50);
}

function insertionSort(array) {
  const moves = [];
  for (let i = 1; i < array.length; i++) {
    let j = i;
    while (j > 0 && array[j - 1] > array[j]) {
      moves.push({
        indices: [j - 1, j],
        type: "comparison",
      });
      moves.push({
        indices: [j - 1, j],
        type: "swap",
      });
      [array[j - 1], array[j]] = [array[j], array[j - 1]];
      j--;
    }
  }
  return moves;
}

function showBars(move) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}
