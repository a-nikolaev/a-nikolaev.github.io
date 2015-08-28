#include <iostream>
#include "intset.h"

using namespace std;

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
