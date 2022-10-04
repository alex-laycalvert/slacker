declare global;

namespace Slacker {
    interface Channel {
        id: string;
        name: string;
        topic: string;
        focus: string;
    }
}
