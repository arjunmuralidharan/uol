function hybridSort(A, N) {
  swapped = 1;
  pos_min = 0;
  while (swapped) {
    swapped = 0;
    min = pos_min;
    for (let i = pos_min; i < N - 1; i++) {
      if (A[i + 1] < A[min]) {
        min = i;
      }
      if (A[i] > A[i + 1]) {
        aux = A[i];
        A[i] = A[i + 1];
        A[i + 1] = aux;
        swapped = 1;
      }
    }
    N = N - 1;
    aux = A[min];
    A[min] = A[pos_min];
    A[pos_min] = aux;
    pos_min = pos_min + 1;
    // console.log(A);
  }
}

let A = [5, 2, 7, 3, 4];
hybridSort(A, 5);

function X(A, low, high) {
  elem = A[high];
  i = low;
  for (let j = i; j < high; j++) {
    if (A[j] <= elem) {
      [A[i], A[j]] = [A[j], A[i]];
      i++;
    }
  }
  [A[high], A[i]] = [A[i], A[high]];
  console.log(i);
  return i;
}

X(A, 0, 4);

x = 8 % 10;

console.log(x);

H = [-1,-1,-1,-1,-1];

function B(H, N, k) {
  let i = (2 * k + 1) % N;
  for (j = 0; j < N; j++) {
    if (H[(i + j) % N] == -1) {
      H[(i + j) % N] = k;
    }
    break;
  }
}

B(H, 5, 4);
B(H, 5, 9);
B(H, 5, 14);
B(H, 5, 2);



console.log(H);