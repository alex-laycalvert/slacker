// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#include "component.hpp"

Component::Component(const int heightPercent, const int widthPercent,
                     const bool doesAcceptInput) {
    this->heightPercent = heightPercent;
    this->widthPercent = widthPercent;
    this->doesAcceptInput = doesAcceptInput;
    this->window = nullptr;
}
