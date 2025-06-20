import mitt from 'mitt';

type Events = {
    jobApplied: void;
};

export const eventBus = mitt<Events>();
