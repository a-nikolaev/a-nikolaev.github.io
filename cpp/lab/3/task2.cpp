/*
	Author: 
	Description: 
*/
#include <iostream>
#include <cstdlib>
#include <cmath>

using namespace std;

// returns the number of (decimal) digits in the argument
// works for positive, zero, and negative numbers
int num_of_digits(int n);

int main() {
	srand(time(NULL));

	// test
	for (int i = -10; i<11; i++) {
		int num = exp(abs(i)) * 0.001 * i * (rand() % 1000);
		cout << num << "\t" << num_of_digits(num) << endl;
	}
}

int num_of_digits(int n) {
	// ...
}
