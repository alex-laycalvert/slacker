// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#ifndef NAVBAR_HPP_
#define NAVBAR_HPP_

#include <vector>

#include "component.hpp"
#include "slacker.hpp"

using std::vector;

class NavBar : public Component {
   public:
    NavBar(const int heightPercent, const int widthPercent,
           const vector<Channel> channel);
    void render(const bool focused, const int rows, const int cols,
                const int rowOffset, const int colOffset);
    void sendInput(const char input);

   private:
    vector<Channel> channels;
    int numChannels;
    int selectedChannel;
};

#endif // NAVBAR_HPP_
