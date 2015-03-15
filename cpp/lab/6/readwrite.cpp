/*
  Author: Alexey Nikolaev.
  Description: Lab 6.
    The program read a PPM file from the standard input,
    and outputs a modified PPM file through the standard output.
  
  To compile:
    g++ -o readwrite readwrite.cpp 

  Program usage:
    ./readwrite < input.ppm > output.ppm
*/


#include <iostream>
#include <cassert>

using namespace std;

const int H = 500;
const int W = 500;
const int C = 3;

// reads a PPM file.
// Notice that: w and h are passed by reference!
void read(int m[W][H][C], int &w, int &h) {
  char c;
  int x;
  // read the header P3
  cin >> c; cin >> x;
  assert(c == 'P');
  assert(x == 3);

  // skip the comments (if any)
  while ((cin>>ws).peek() == '#') { cin.ignore(4096, '\n'); }

  cin >> w; 
  cin >> h;

  assert(w <= W);
  assert(h <= H);
  int max;
  cin >> max;
  assert(max == 255);

  for (int j = 0; j < h; j++) {
    for (int i = 0; i < w; i++) {
        // red
        cin >> m[i][j][0];
        // green
        cin >> m[i][j][1];
        // blue
        cin >> m[i][j][2];
    }
  }

}

void write(int m[W][H][C], int w, int h) {
  // print the header
  cout << "P3" << endl;
  // width, height
  cout << w << ' '; 
  cout << h << endl;
  cout << 255 << endl;

  for (int j = 0; j < h; j++) {
    for (int i = 0; i < w; i++) {
      for (int k = 0; k < C; k++) {
        assert(m[i][j][k] < 256);
        assert(m[i][j][k] >= 0);
      }
      // red
      cout << m[i][j][0] << ' ';
      // green
      cout << m[i][j][1] << ' ';
      // blue
      cout << m[i][j][2] << ' ';

      // lines should be no longer than 70 characters
      if (i % 5 == 4 && i+1 < w) cout << endl;
    }
    cout << endl;
  }
}

int main() {

  int in[W][H][C];
  int out[W][H][C];
  int width, height;
  
  read(in, width, height);
  
  // filter
  for(int i = 0; i<width; i++){
    for(int j = 0; j<height; j++) {
      out[i][j][0] = in[i][j][0];
      out[i][j][1] = in[i][j][1];
      out[i][j][2] = 0;
    }
  }

  write(out, width, height);

}
