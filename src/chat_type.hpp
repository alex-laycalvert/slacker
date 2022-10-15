// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#ifndef CHAT_TYPE_HPP_
#define CHAT_TYPE_HPP_

#include <string>

#include "component.hpp"

using std::string;

class ChatType : public Component {
   public:
    ChatType(const int heightPercent, const int widthPercent);
    void render(const bool focused, const int rows, const int cols,
                const int rowOffset, const int colOffset);
    void sendInput(const char input);

   private:
    string currentInput;
};

#endif // CHAT_TYPE_HPP_
