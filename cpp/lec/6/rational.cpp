#include <iostream>
#include <cmath>

using namespace std;

void rational(double x, int &n, int &d);

int main() {
    double x = 0.0;
    while (cin >> x) {
        int n = 1, d = 1;
        rational(x, n, d);
        double v= n / static_cast<double>(d);
        cout << n << " / " << d << " = " << v << endl;
    }
}

const int N = 10000;

void rational(double x, int &num, int &denom) {

    int n = 1, d = 1;

    int nb = 1, db = 1;
    double vb = nb / static_cast<double>(db);

    while (n < N && d < N) {
        double v =  n / static_cast<double>(d);
        if (fabs(v - x) < fabs(vb - x)) {
            nb = n;
            db = d;
            vb = v;
        }

        if (v < x)
            n++;
        else
            d++;
    }

    num = nb;
    denom = db;
}
