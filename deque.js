class Deque {
    constructor() {
        this._oldestIdx = 1;
        this._newestIdx = 0;
        this._storage = {};
    }
}

Deque.prototype._throwIfEmpty = function() {
    if (this.empty()) {
        throw new Error("Deque is empty");
    }
}

Deque.prototype.size = function() {
    return this._newestIdx - this._oldestIdx + 1;
}

Deque.prototype.hasItems = function() {
    return this.size() > 0;
}

Deque.prototype.empty = function() {
    return this.size() === 0;
}

Deque.prototype.pushBack = function(item) {
    this._storage[++this._newestIdx] = item;
}

Deque.prototype.pushFront = function(item) {
    this._storage[--this._oldestIdx] = item;
}

Deque.prototype.popBack = function() {
    this._throwIfEmpty();
    const item = this._storage[this._newestIdx];
    delete this._storage[this._newestIdx--];
    return item;
}

Deque.prototype.popFront = function() {
    this._throwIfEmpty();
    const item = this._storage[this._oldestIdx];
    delete this._storage[this._oldestIdx++];
    return item;
}

Deque.prototype.peekFront = function() {
    this._throwIfEmpty();
    return this._storage[this._oldestIdx];
}

Deque.prototype.peekBack = function() {
    this._throwIfEmpty();
    return this._storage[this._newestIdx];
}