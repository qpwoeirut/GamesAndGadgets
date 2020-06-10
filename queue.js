class Queue {
    constructor() {
        this._oldestIdx = 0;
        this._newestIdx = 0;
        this._storage = {};
    }
}

Queue.prototype.size = function() {
    return this._newestIdx - this._oldestIdx;
}

Queue.prototype.hasItems = function() {
    return this._newestIdx > this._oldestIdx;
}

Queue.prototype.empty = function() {
    return this._newestIdx == this._oldestIdx;
}

Queue.prototype.push = function(item) {
    this._storage[this._newestIdx++] = item;
}

Queue.prototype.pop = function() {
    if (this._oldestIdx === this._newestIdx) {
        throw "Queue is empty";
    }
    const item = this._storage[this._oldestIdx];
    delete this._storage[this._oldestIdx++];
    return item;
}

Queue.prototype.peek = function() {
    if (this._oldestIdx === this._newestIdx) {
        throw "Queue is empty";
    }
    return this._storage[this._oldestIdx];
}