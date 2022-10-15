// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#include "chat_display.hpp"

#include <ncurses.h>

#include "slacker.hpp"

ChatDisplay::ChatDisplay(const int heightPercent, const int widthPercent)
    : Component(heightPercent, widthPercent, false) {}

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
    mvwprintw(this->window, 1, 1, "CHAT DISPLAY");
    wrefresh(this->window);
}

void ChatDisplay::sendInput(const char input) { (void)input; }
