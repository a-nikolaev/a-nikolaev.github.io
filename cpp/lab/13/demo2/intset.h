
#ifndef INTSET_H
#define INTSET_H

// Set of integers

class IntSet {
private:
  static const int N = 1024; // max cardinality
  int card; // cardinality
  int arr[N];

public:
  // makes the set empty
  void empty();

  // retruns true v is a member
  bool member(int v);

  // adds v to the set
  void add(int v);

  // removes v from the set
  void remove(int v);

  // returns the cardinality of the set
  int get_card();
};

#endif
