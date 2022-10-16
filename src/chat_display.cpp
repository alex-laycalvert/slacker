// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#include "chat_display.hpp"

#include <ncurses.h>

#include "api.hpp"
#include "slacker.hpp"

ChatDisplay::ChatDisplay(const int heightPercent, const int widthPercent,
                         Channel channel)
    : Component(heightPercent, widthPercent, false) {
    this->channel = channel;
    SlackerAPI *api = SlackerAPI::getSlackerAPI();
    this->messages = api->getChannelMessages(this->channel.id);
}

void ChatDisplay::render(const bool focused, const int rows, const int cols,
                         const int rowOffset, const int colOffset) {
    int height = rows * heightPercent / 100;
    int width = cols * widthPercent / 100;
    if (!this->window) {
        this->window = newwin(height, width, rowOffset, colOffset);
    }
    if (focused) {
        wattron(this->window, COLOR_PAIR(FOCUSED_COLOR_PAIR));
    }
    box(this->window, 0, 0);
    wattroff(this->window, COLOR_PAIR(FOCUSED_COLOR_PAIR));
    for (int i = 0; i < (int)this->messages.size(); i++) {
        mvwprintw(this->window, i + 1, 1, " ");
        mvwprintw(this->window, i + 1, 2, "%s> %s",
                  this->messages.at(i).userId.c_str(),
                  this->messages.at(i).text.c_str());
        if (i + 1 >= height - 1) break;
    }
    wrefresh(this->window);
}

void ChatDisplay::sendInput(const char input) { (void)input; }
