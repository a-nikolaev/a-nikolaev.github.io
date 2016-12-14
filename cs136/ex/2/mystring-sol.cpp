
#include <iostream>
#include <fstream>
#include <vector>

using namespace std;

class MyString {
private:
  vector<char> data;

public:
  int size(); // Returns the number of characters in it
  void append(string s); // Append the characters from s at the end of the current MyString
  void operator+= (string s); // A "fancy" way to do append

  // Stream input and output operators
  friend ostream & operator<< (ostream &os, MyString t);
  friend istream & operator>> (istream &is, MyString &t);
};

int MyString::size() {
  return data.size();
}

void MyString::append(string s) {
  for(int i = 0; i < s.size(); i++) {
    data.push_back(s[i]);
  }
}

void MyString::operator+= (string s) {
  this->append(s);
}

ostream & operator<< (ostream &os, MyString t) {
  for (int i = 0; i < t.data.size(); i++) {
    os << t.data[i];
  }
  return os;
}

istream & operator>> (istream &is, MyString &t) {
  string s;

  is >> s;
  t.data.clear();
  t.append(s);

  return is;
}

int main() {
  MyString s;      // Default constructor is called, makes an empty MyString
  s.append("ABC"); // "ABC" gets appended to it
  s += "DEF";      // and "DEF" too.

  cout << s.size() << endl; // Prints "6" and end-of-line
  cout << s << endl; // Prints "ABCDEF" and end-of-line

  // We would also want to read words from a text file,
  // the same way the type `string` would do that:
  fstream fin("file.txt");
  while(fin >> s) {
    cout << "[" << s << "]" << endl;
  }
  fin.close();
}
