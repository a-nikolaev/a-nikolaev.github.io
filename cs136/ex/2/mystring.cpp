
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

/* Implementation: */
int MyString::size() {
	return 0;
}

void MyString::append(string s) {

}

void MyString::operator+= (string s) {

}

ostream & operator<< (ostream &os, MyString t) {
	return os;
}

istream & operator>> (istream &is, MyString &t) {
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
