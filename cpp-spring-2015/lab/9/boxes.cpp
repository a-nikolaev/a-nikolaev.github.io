#include <iostream>
#include <vector>

using namespace std;

enum Direction { HORIZONTAL, VERTICAL };

class Box {
private:
    Direction dir;
    std::vector<Box> children;

public:

    //----- Constructors -----

    Box();

    Box(int n);

    //------ Functions -------

    // returns the width of the box
    int get_width();

    // returns the height of the box
    int get_height();

    // returns the direction child boxes are arranged
    int get_dir();

    // returns a reference to the vector of children
    //
    // Comment:
    // This function is needed for printing boxes. This is not a very good
    // idea to make such a public function, you may want to refactor the code,
    // for example using so called friend functions for printing, but we did
    // not learn about them yet.
    vector<Box> & get_children();
};

void print(Box &b);


int main() {

    Box b1;
    Box b2(1);
    Box b3(2);
    Box b4(3);

    print(b1);
    print(b2);
    print(b3);
    print(b4);
}



//------------------ Class Box -------------------

//---------- Class Box : Constructors ------------



// The default contructor makes an empty box

Box::Box() : dir(HORIZONTAL), children() { }


// A simple constructor for multiple boxes nested one into another.
// Kind of like Russian nesting dolls.

Box::Box(int n) {
    if (n > 1) {
        Box b(n-1);
        children.push_back(b);
    }
    dir = HORIZONTAL; // this does not matter really
}





//----------- Class Box : Functions --------------
// (you don't have to edit this section)

int Box::get_width() {
    if (children.size() == 0) return 3;

    if (dir == HORIZONTAL) {
        // children are arranged horizontally
        // return the sum of their width + 2
        int sum = 0;
        for(int i = 0; i<children.size(); i++) {
            sum += children[i].get_width();
        }
        return sum + 2;
    }
    else {
        // children are arranged vertically
        // return the maximum of their width + 2
        int max_ch_width = 1;
        for(int i = 0; i<children.size(); i++) {
            int ch_w = children[i].get_width();
            if (ch_w > max_ch_width)
                max_ch_width = ch_w;
        }
        return max_ch_width + 2;
    }
}

int Box::get_height() {
    if (children.size() == 0) return 3;

    if (dir == VERTICAL) {
        // children are arranged vertically
        // return the sum of their height + 2
        int sum = 0;
        for(int i = 0; i<children.size(); i++) {
            sum += children[i].get_height();
        }
        return sum + 2;
    }
    else {
        // children are arranged horizontally
        // return the max of their height + 2
        int max_ch_height = 1;
        for(int i = 0; i<children.size(); i++) {
            int ch_h = children[i].get_height();
            if (ch_h > max_ch_height)
                max_ch_height = ch_h;
        }
        return max_ch_height + 2;
    }
}

vector<Box> & Box::get_children() {
    vector<Box> & ch = children;
    return ch;
}

int Box::get_dir() {
    return dir;
}



//----------------- Printing -------------------
// (you don't have to edit this section)
const int W = 100;
const int H = 50;

// printing helper functions
void stamp(char arr[W][H], int x, int y, char c) {
    if (x >= 0 && x < W && y >= 0 && y < H) arr[x][y] = c;
}

void printing_one(char arr[W][H], Box &b, int x, int y) {
    int w = b.get_width();
    int h = b.get_height();

    for(int i = 0; i < w; i++) {
        stamp(arr, x+i, y, '-');
        stamp(arr, x+i, y+h-1, '-');
    }
    for(int j = 0; j < h; j++) {
        stamp(arr, x, y+j, '|');
        stamp(arr, x+w-1, y+j, '|');
    }
    // corners
    stamp(arr, x, y, '+');
    stamp(arr, x, y+h-1, '+');
    stamp(arr, x+w-1, y, '+');
    stamp(arr, x+w-1, y+h-1, '+');

    vector<Box> & children = b.get_children();
    int dir = b.get_dir();

    // adding the boxes that are inside (children)
    int chx = x+1, chy = y+1;
    for (int i = 0; i<children.size(); i++) {
        printing_one(arr, children[i], chx, chy);
        if (dir == HORIZONTAL)
            chx += children[i].get_width();
        else
            chy += children[i].get_height();
    }
}

// main printing function
void print(Box &b) {
    char arr[W][H];
    for (int i = 0; i < W; i++) {
        for (int j = 0; j < H; j++) {
            arr[i][j] = ' ';
        }
    }

    printing_one(arr, b, 0, 0);

    int h = b.get_height();
    int h_to_print = H<h ? H : h;
    for (int j = 0; j < h_to_print; j++) {
        for (int i = 0; i < W; i++) {
            cout << arr[i][j];
        }
        cout << endl;
    }
    cout << endl;
}



