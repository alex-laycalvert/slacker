// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#ifndef CHAT_DISPLAY_HPP_
#define CHAT_DISPLAY_HPP_

#include <vector>

#include "component.hpp"
#include "slacker.hpp"

using std::vector;

class ChatDisplay : public Component {
   public:
    ChatDisplay(const int heightPercent, const int widthPercent);
    void render(const bool focused, const int rows, const int cols,
                const int rowOffset, const int colOffset);
    void sendInput(const char input);
    vector<Message> getMessages() { return this->messages; };
    void addMessage(Message message) { this->messages.push_back(message); };

   private:
    vector<Message> messages;
};

#endif // CHAT_DISPLAY_HPP_
