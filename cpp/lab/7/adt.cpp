/*
    Author:
    Description:
*/

#include <iostream>
using namespace std;

// The employees at a certain software development company
enum Programmer {Alice=1, Bob=2, Carol=3, Dave=4, Eve=5, Frank=6, Grace=7, UNASSIGNED = 0};

// Constants
const int N = 24;

const int NOT_FOUND = -1;

/*
      The Scheduler Class
      -------------------
      >>> The CEO wants this functionality to be implemented today!
      The scheduler helps assigning the employees to do their work.

    - It implements a schedule for one working day.

    - A day is divided into 24 one-hour long time slots.

    - Only one employee can be assigned to work per time slot.

    - According to the local labor laws, an employee cannot be scheduled
      to work for more than 12 hours in total per day (for example, two
      disjoint intervals of 7 hours are prohibited, because 7+7 > 12).
*/

class Scheduler {
    Programmer timetable[N];

public:
      // Sets the schedule to UNASSIGNED for all time slots
    void init();

      // Returns who is assigned to work in the time slot t.
      // If t is out of bounds [0,N-1], return UNASSIGNED
    Programmer get(int t);

      // Assigns the programmer to the time interval if the entire interval is vacant.
      // The interval must have positive duration (duration > 0).
      // Returns true if succeeds, otherwise returns false.
    bool assign(Programmer name, int start, int duration);

      // Cancel all time assignments for the Programmer `name`.
    void cancel(Programmer name);

      // Searches for a vacant time interval of length `duration`,
      // returns the starting time if it finds such an interval,
      // otherwise returns NOT_FOUND.
    int find_interval(int duration);

};


/* Unit tests */
bool test_init();
bool test_get();
bool test_assign();
bool test_cancel();
bool test_find();


int main() {

    // Testing
    cout << endl;

    bool b = true;
    b = test_init() && b;
    b = test_get() && b;
    b = test_assign() && b;
    b = test_cancel() && b;
    b = test_find() && b;

    cout << endl;

    if (b)
        cout << "PASSED";
    else
        cout << "FAILED";

    cout << endl << endl;
}


/***************** Scheduler Implementation ******************/





                   // Add your code here





/*********************** Unit Tests **************************/

bool test_init () {
    cout << "Testing init:\t";

    bool passed = true;

    // Test: check that all time slots become UNASSIGNED
    {
        bool b = true;
        Scheduler s;
        s.init();
        for(int i = 0; i < N; i++) {
            b = b && (UNASSIGNED == s.get(i));
        }

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    cout << endl;
    return passed;
}


bool test_get () {
    cout << "Testing get:\t";

    bool passed = true;

    // Test: test that get out of bounds return UNASSIGNED
    {
        bool b = true;
        Scheduler s;
        s.init();

        // when i < 0
        for(int i = -1; i > -N * 100; i--)
            b = b && (UNASSIGNED == s.get(i));

        // when i >= N
        for(int i = N; i < N * 100; i++)
            b = b && (UNASSIGNED == s.get(i));

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    cout << endl;
    return passed;
}


bool test_assign() {
    cout << "Testing assign:\t";

    bool passed = true;

    // Test 1: assigning a valid interval
    {
        bool b = true;
        Scheduler s;
        s.init();

        bool result = s.assign(Alice, 5, 2) && s.assign(Alice, 7, 4);

        b = b && (true == result) && (UNASSIGNED == s.get(4)) && (UNASSIGNED == s.get(11));

        for(int i = 5; i < 5+6; i++)
            b = b && (Alice == s.get(i));

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    // Test 2: assigning an out of bound or negative or zero-length interval
    {
        bool b = true;
        Scheduler s;
        s.init();

        bool result =
            s.assign(Bob,  -1,   5) || 
            s.assign(Bob, -10,   1) || 
            s.assign(Bob, -10,   0) || 
            s.assign(Bob,   2,   0) || 
            s.assign(Bob,   5,  -1) || 
            s.assign(Bob,  10, -10) || 
            s.assign(Bob, N-2,   3) || 
            s.assign(Bob, N-3,  10) ;

        b = b && (false == result);

        for(int i = 0; i < N; i++)
            b = b && (UNASSIGNED == s.get(i));

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    // Test 3: assigning to a non-vacant interval
    {
        bool b = true;
        Scheduler s;
        s.init();

        int result1 = s.assign(Carol, 3, 1) && s.assign(Dave, 7,1);
        b = b && (true == result1);

        int result2 = s.assign(Eve, 2, 7);
        b = b && (false == result2);

        b = b &&
            (
                UNASSIGNED == s.get(2) &&
                Carol      == s.get(3) &&
                UNASSIGNED == s.get(4) &&
                UNASSIGNED == s.get(5) &&
                UNASSIGNED == s.get(6) &&
                Dave       == s.get(7) &&
                UNASSIGNED == s.get(8)
            );

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    // Test 4: assigning to a non-vacant interval - overlaping with the same Programmer
    {
        bool b = true;
        Scheduler s;
        s.init();

        int result1 =
            s.assign(Frank, 10, 4);

        b = b && (true == result1);

        int result2 =
            s.assign(Frank, 8, 3) ||
            s.assign(Frank, 7, 9) ||
            s.assign(Frank, 11, 1) ||
            s.assign(Frank, 12, 10);

        b = b && (false == result2);

        b = b &&
            (
                UNASSIGNED == s.get(9)  &&
                Frank      == s.get(10) &&
                Frank      == s.get(11) &&
                Frank      == s.get(12) &&
                Frank      == s.get(13) &&
                UNASSIGNED == s.get(14)
            );

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    // Test 5: assigning in total more than 12 hours to a single programmer
    {
        bool b = true;
        Scheduler s;
        s.init();

        int result1 =
            s.assign(Grace, 1, 1) &&  // 1
            s.assign(Grace, 4, 2) &&  // 4,5
            s.assign(Grace, 9, 2) &&  // 9,10
            s.assign(Grace, 6, 2) &&  // 6,7
            s.assign(Grace, 8, 1) &&  // 8
            s.assign(Grace, 12, 3) && // 12,13,14
            s.assign(Grace, 17, 1)    // 17
            ;

        int result2 = s.assign(Grace, 15, 1);

        b = (true == result1) && (false == result2);

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    cout << endl;
    return passed;

}


bool test_cancel() {
    cout << "Testing cancel:\t";

    bool passed = true;

    // Test: you can cancel job assignments
    {
        bool b = true;
        Scheduler s;
        s.init();

        int result1 = s.assign(Frank, 5, 2);
        int result2 = s.assign(Grace, 10, 3);
        int result3 = s.assign(Frank, 18, 1);
        s.cancel(Frank);

        b = b &&
            (true == result1) && (true == result2) && (true == result3) &&
            (UNASSIGNED == s.get(5) ) &&
            (UNASSIGNED == s.get(6) ) &&
            (Grace      == s.get(10)) &&
            (Grace      == s.get(11)) &&
            (Grace      == s.get(12)) &&
            (UNASSIGNED == s.get(18));

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    cout << endl;
    return passed;
}


bool test_find() {
    cout << "Testing find:\t";

    bool passed = true;

    // Test: finding an existing interval
    {
        bool b = true;
        Scheduler s;
        s.init();

        s.assign(Alice, 4, 1);
        s.assign(Bob, 15, 1);
        s.assign(Alice, 20, 1);

        int start = s.find_interval(10);
        b = b && (NOT_FOUND != start) && (start >= 0) && (start + 10 < N);

        if (b) {
            for(int i = start; i < start + 10; i++) {
                b = b && (UNASSIGNED == s.get(i));
            }
        }

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    // Test: when such ah interval does not exist
    {
        bool b = true;
        Scheduler s;
        s.init();

        s.assign(Alice, 4, 1);
        s.assign(Bob, 15, 1);
        s.assign(Alice, 20, 1);

        int start = s.find_interval(11);
        b = b && (NOT_FOUND == start);

        if (b) { cout << "pass "; } else { cout << "fail "; }
        passed = passed && b;
    }

    cout << endl;
    return passed;
}

