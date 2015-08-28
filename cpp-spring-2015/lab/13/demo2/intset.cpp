#include "intset.h"

void IntSet::empty() {
  card = 0;
}

bool IntSet::member(int v) {
  for (int i = 0; i < card; i++) {
    if ( arr[i] == v ) return true;
  }
  return false;
}

void IntSet::add(int v) {
  if ( ! member(v) ) {
    arr[card] = v;
    card ++;
  }
}

void IntSet::remove(int v) {
  for (int i = 0; i < card; i++) {
    if ( arr[i] == v ) {
      // found v in arr
      for (int j = i; j < card; j++) {
        arr[j] = arr[j+1];
      }
      card --;
      break;
    }
  }
}

int IntSet::get_card() {
  return card;
}
