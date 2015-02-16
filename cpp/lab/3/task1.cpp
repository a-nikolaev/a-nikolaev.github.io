/*
	Author: 
	Description: 
*/
#include <iostream>

using namespace std;

// returns true if the argument is even, otherwise false
bool is_even(int n);

int main() {
	// test
	for (int i = -5; i < 6; i++) {
		cout << i << '\t';
		if (is_even(i))
			cout << "even" << endl;
		else
			cout << "odd" << endl;
	}
	return 0;
}

bool is_even(int n) {
	// ...
}
