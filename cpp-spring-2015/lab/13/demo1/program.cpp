#include <iostream>
using namespace std;

class IntSet {
private:
  static const int N = 1024; // max cardinality
  int card; // cardinality
  int buf[N];

public:
  void empty();
  bool member(int v);
  bool add(int v);
  bool remove(int v);
  int get_card();
};

int main () {
  IntSet s;
  s.empty();

  s.add(10);
  s.add(20);
  s.add(15);
  s.add(5);
  s.add(5);
  s.add(15);
  s.add(7);
  s.remove(15);
  
  for(int i = 0; i < 25; i++) {
    cout << i << " ";
    
    if (s.member(i)) cout << "yes";

    cout << endl;
  }
}


void IntSet::empty() {
  card = 0;
}

bool IntSet::member(int v) {
  for (int i = 0; i < card; i++) {
    if (buf[i] == v) return true;
  }
  return false;
}

bool IntSet::add(int v) {
  if (card >= N) return false;

  for (int i = 0; i < card; i++) {
    if (buf[i] == v) 
      // if v is found, don't add it again
      return false;
  }

  // if not found, add it at the end of the buffer
  buf[card] = v;
  card ++;
  return true;
}

bool IntSet::remove(int v) {
  for (int i = 0; i < card; i++) {
    if (buf[i] == v) {
      // if v is found, remove it
      for (int j = i; j < card-1; j++) {
        buf[j] = buf[j+1];
      }
      // decrease cardinality
      card --;
      return true;
    }
  }
  return false;
}

int IntSet::get_card() {
  return card;
}
