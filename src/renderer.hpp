// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#ifndef RENDERER_HPP_
#define RENDERER_HPP_

#include <ncurses.h>

#include <vector>

#include "component.hpp"

using std::vector;

class Renderer {
   public:
    Renderer(const bool focusOnFirst);
    void addComponent(Component *component);
    void render();
    Component *getFocusedComponent() const {
        return this->components[this->focused];
    };
    void focusOnNext();
    void focusOnPrev();
    vector<Component *> getComponents() { return this->components; };
    int getRows() { return this->rows; };
    int getCols() { return this->cols; };
    void quit();

   private:
    int rows;
    int cols;
    vector<Component *> components;
    int numComponents;
    int focused;
};

#endif // RENDERER_HPP_
