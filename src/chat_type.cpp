// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#include "chat_type.hpp"

#include "slacker.hpp"

ChatType::ChatType(const int heightPercent, const int widthPercent)
    : Component(heightPercent, widthPercent, true) {}

void ChatType::render(const bool focused, const int rows, const int cols,
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
    mvwprintw(this->window, 1, 1, "%s", this->currentInput.c_str());
    wrefresh(this->window);
}

void ChatType::sendInput(const char input) {
    switch (input) {
        case '\n':
            break;
        default:
            this->currentInput += input;
            break;
    }
}
