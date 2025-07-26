#include <iostream>
#include <ctime>
#include <string>

int main() {
    std::time_t now = std::time(0);
    std::string timeStr = std::ctime(&now);  // Converts to string

    // Optional: remove trailing newline
    if (!timeStr.empty() && timeStr.back() == '\n') {
        timeStr.pop_back();
    }



    return 0;
}
