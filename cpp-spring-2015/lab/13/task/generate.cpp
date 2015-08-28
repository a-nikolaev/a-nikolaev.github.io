
#include <cstdlib>
#include <vector>
#include <iostream>
#include <fstream>

using namespace std;


// ****************** Declarations ********************

/*
 *  Class Random implements two functions for sampling 
 *  random ints and doubles.
 */

class Random {
  public:
    // returns a random floating point number 
    // uniformly distributed in the interval [0,1] 
    static double uniform_double ();

    // returns a random integer uniformly distributed 
    // in the interval [0, n-1] 
    static int uniform_int (int n);
};
  
/*
 *  Class Graph implements a simple graph. 
 *  It has one constructor that generates a random 
 *  Erdos-Renyi graph
 */

class Graph { 
  private:
    int n;                    // number of nodes
    vector <vector<bool> > m; // adjacency matrix

  public:
    // create a new Erdos-Renyi random graph
    Graph(int nn, double p);

    // return the number of nodes
    int get_nodes();
    // return the number of edges
    int get_edges();
    
    // returns true if there is an edge between nodes i and j
    bool adjacent (int i, int j);
};


// Save the graph object in a Graphviz dot file format
void save_graph(Graph &g, char *filename);
    

// ******************   Main   ************************


int main(int argc, char *argv[]) {

  srand(time(NULL));

  if (argc > 2) {
  
    int n = atoi(argv[1]);
    Graph g(n, 0.1);

    cout << "Number of nodes: " << g.get_nodes() << endl;
    cout << "Number of edges: " << g.get_edges() << endl;

    save_graph(g, argv[2]);
  }
  else {
    cout << "Requires two parameters." << endl;
    cout << "Example: " << endl;
    cout << "   ./graph 100 filename.dot" << endl;
  }

}


// ***************** Implementation *******************


double Random::uniform_double () {
  return static_cast<double>(rand()) / static_cast<double>(RAND_MAX);
}

int Random::uniform_int (int n) {
  return rand() % n;
}

Graph::Graph(int nn, double p) :
  n(nn),
  m(nn, vector<bool>(nn, false)) // make a matrix nn-by-nn initialized with false
{
  for(int i = 0; i < n; ++i) {
    for(int j = 0; j < i; ++j) {
      if (Random::uniform_double() < p) {
        m[i][j] = true;
        m[j][i] = true; // adj matrix is symmetric
      }
    }
  }
}

int Graph::get_nodes() {
  return n;
}

int Graph::get_edges() {
  int sum = 0;
  for(int i = 0; i < n; ++i) {
    for(int j = 0; j <= i; ++j) {
      if (adjacent(i,j)) sum ++;
    }
  }
  return sum;
}

bool Graph::adjacent(int i, int j) {
  if (i >= 0 && i < n && j >= 0 && j < n) 
    return m[i][j];
  else
    return false;
}

void save_graph(Graph &g, char *filename) {
  ofstream fout;
  fout.open(filename);
  if (fout.fail()) { return; }

  fout << "graph g {"                         << endl;
  fout << "  node [style=bold, shape=circle, colorscheme=dark28, color=5, fontcolor=white, style=filled]" << endl;
  fout << "  edge [style=bold, colorscheme=dark28, color=1]" << endl;

  // iterate through all nodes of the graph
  for (int i = 0; i < g.get_nodes(); ++i) {
    // print the node
    fout << "  " << i << endl;
    // print all its edges (unless they were printed already)
    for (int j = 0; j < i; ++j) {
      if (g.adjacent(i,j)) {
        fout << "  " << i << " -- " << j << endl;
      }
    }
  }
  fout << "}"<< endl;
  fout.close();
}

